import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
  BackHandler,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { API_URL } from '../../config';
import { setLoginEmail, getLoginSession } from '../../assets/sql_lite/db_connection';
import ReactNativeBiometrics from 'react-native-biometrics';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Keychain from 'react-native-keychain';
import NetInfo from '@react-native-community/netinfo';
import { getDatabase } from '../../bird-module/database/db';
import { hashPassword, verifyPassword } from '../../utils/passwordUtils';

const SigninForm = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isFingerPrintAvailable, setFingerPrintAvailable] = useState(false);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);
  const [showPinSection, setShowPinSection] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [userEmail, setUserEmail] = useState('');
  const [userPin, setUserPin] = useState('');
  const pinRefs = [
    React.useRef<any>(null),
    React.useRef<any>(null),
    React.useRef<any>(null),
    React.useRef<any>(null),
  ];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    checkBiometricAvailability();
    checkStoredCredentials();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available } = await rnBiometrics.isSensorAvailable();
      setFingerPrintAvailable(available);
    } catch (error) {
      console.error('Biometric check error:', error);
    }
  };

  const checkStoredCredentials = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setHasStoredCredentials(true);
      }
    } catch (error) {
      console.error('Keychain error:', error);
    }
  };

  // TODO: Remove dummy account before production release
  const DEV_DUMMY_EMAIL = 'dev@surveyapp.com';
  const DEV_DUMMY_PASSWORD = 'dev123';

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // DEV ONLY: Dummy account for development access - remove in production
    if (email === DEV_DUMMY_EMAIL && password === DEV_DUMMY_PASSWORD) {
      await setLoginEmail(DEV_DUMMY_EMAIL);
      Alert.alert('Success', 'Dev login successful');
      navigation.replace('Welcome', { email: DEV_DUMMY_EMAIL });
      return;
    }

    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    // Check network connectivity
    const netState = await NetInfo.fetch();
    const isOnline = netState.isConnected && netState.isInternetReachable;

    if (isOnline) {
      // ONLINE: try server login
      try {
        const response = await axios.post(`${API_URL}/login`, { email: trimmedEmail, password });

        if (response.data.status === 'ok') {
          await setLoginEmail(trimmedEmail);
          // Save credentials and name locally for offline login
          try {
            const db = await getDatabase();
            const hashedPw = hashPassword(password);
            const serverName = response.data.data?.name || '';
            const serverImage = response.data.data?.profileImage || '';
            db.transaction((tx: any) => {
              tx.executeSql(
                'INSERT OR REPLACE INTO Users (email, password, isGoogleLogin, name, userImageUrl) VALUES (?, ?, ?, ?, ?)',
                [trimmedEmail, hashedPw, 0, serverName, serverImage],
              );
            });
          } catch (e) { console.log('Local credential save error:', e); }
          Alert.alert('Success', 'Logged in successfully');
          navigation.replace('Welcome', { email: trimmedEmail });
        } else if (response.data.status === 'notConfirmed') {
          handleSendVerificationCode();
        } else if (response.data.status === 'google') {
          Alert.alert(
            'Sign-In Method Mismatch',
            'This account uses Google Sign-In. Please use the Google button to sign in.',
          );
        } else if (response.data.status === 'notApproved') {
          Alert.alert('Pending', 'Your account is awaiting admin approval.');
          navigation.navigate('GetAdminApprove', { email: trimmedEmail });
        } else {
          Alert.alert('Error', response.data.data || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Error', 'Login failed. Please check your credentials.');
      }
    } else {
      // OFFLINE: check local SQLite credentials
      try {
        const db = await getDatabase();
        db.transaction((tx: any) => {
          tx.executeSql(
            'SELECT * FROM Users WHERE email = ?', [trimmedEmail],
            async (_: any, results: any) => {
              if (results.rows.length > 0) {
                const user = results.rows.item(0);
                // Block email/password login for Google-only accounts
                if (user.isGoogleLogin === 1) {
                  setLoading(false);
                  Alert.alert(
                    'Sign-In Method Mismatch',
                    'This account uses Google Sign-In. Please use the Google button to sign in.',
                  );
                  return;
                }
                // Support both hashed and legacy plain-text passwords
                const passwordMatch = verifyPassword(password, user.password) || user.password === password;
                if (passwordMatch) {
                  // Check session validity BEFORE resetting the timestamp
                  const session = await getLoginSession();
                  if (session.email !== trimmedEmail || !session.isValid) {
                    setLoading(false);
                    Alert.alert('Session Expired', 'Your session has expired. Please connect to the internet to log in again.');
                    return;
                  }
                  // If password was stored as plain text, re-hash it
                  if (user.password === password) {
                    try {
                      const db2 = await getDatabase();
                      const hashedPw = hashPassword(password);
                      db2.transaction((tx2: any) => {
                        tx2.executeSql('UPDATE Users SET password = ? WHERE email = ?', [hashedPw, email]);
                      });
                    } catch (e) { /* ignore migration error */ }
                  }
                  await setLoginEmail(trimmedEmail);
                  setLoading(false);
                  Alert.alert('Offline Login', 'Logged in with saved credentials.');
                  navigation.replace('Welcome', { email: trimmedEmail });
                } else {
                  setLoading(false);
                  Alert.alert('Error', 'Invalid password. Please check your credentials or connect to internet.');
                }
              } else {
                setLoading(false);
                Alert.alert('Error', 'No saved credentials found. Please connect to internet for first login.');
              }
            },
            () => {
              setLoading(false);
              Alert.alert('Error', 'Could not verify credentials offline.');
            },
          );
        });
        return; // loading state managed inside transaction callback
      } catch (error) {
        Alert.alert('Error', 'Offline login failed.');
      }
    }

    setLoading(false);
  };

  const handleSendVerificationCode = async () => {
    try {
      const response = await axios.post(`${API_URL}/send-confirmation-email`, { email });
      const { confirmationCode } = response.data;
      Alert.alert('Email Not Verified', 'Please verify your email first.');
      navigation.navigate('VerifyEmail', { email, confirmationCode });
    } catch (err) {
      console.error('Failed to send confirmation email.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();

      // Handle cancelled sign-in gracefully
      if (!result || (result as any).type === 'cancelled') {
        setLoading(false);
        return;
      }

      const userData = (result as any).data?.user ?? (result as any).user;
      if (userData && userData.email) {
        const gEmail: string = userData.email;
        const gName: string = userData.name || userData.givenName || userData.familyName || 'User';
        const gPhoto: string = userData.photo || '';
        await handleGoogleSignUp(gEmail, gName, gPhoto);
      } else {
        Alert.alert('Error', 'Google Sign-In returned no account data. Please try again.');
      }
    } catch (error: any) {
      console.error('Google Sign-In failed', error?.code, error?.message, error);
      // Don't show error for user-cancelled flow
      if (error?.code === 'SIGN_IN_CANCELLED' || error?.code === -5) {
        // User cancelled, do nothing
      } else if (error?.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        Alert.alert('Error', 'Google Play Services is not available on this device.');
      } else if (error?.code === 'DEVELOPER_ERROR' || error?.code === 10) {
        Alert.alert('Configuration Error', 'Google Sign-In is not properly configured. Please contact support.');
      } else {
        Alert.alert('Error', `Google Sign-In failed: ${error?.message || 'Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async (gEmail: string, name: string, photo: string): Promise<void> => {
    try {
      const res = await axios.post(`${API_URL}/google-register`, { email: gEmail, name, photo });

      if (res.data.status === 'ok') {
        // New Google user — save to local SQLite with photo
        try {
          const db = await getDatabase();
          db.transaction((tx: any) => {
            tx.executeSql(
              'INSERT OR REPLACE INTO Users (email, password, isGoogleLogin, name, userImageUrl) VALUES (?, ?, ?, ?, ?)',
              [gEmail, '', 1, name, photo || ''],
            );
          });
        } catch (e) { console.log('Google user local save error:', e); }
        await setLoginEmail(gEmail);
        Alert.alert('Success', 'Account registered successfully');
        navigation.navigate('PrivacyPolicy', { email: gEmail, name });

      } else if (res.data.status === 'google') {
        // Existing Google account — update local record with latest photo/name
        try {
          const db = await getDatabase();
          db.transaction((tx: any) => {
            tx.executeSql(
              'INSERT OR REPLACE INTO Users (email, password, isGoogleLogin, name, userImageUrl) VALUES (?, ?, ?, ?, ?)',
              [gEmail, '', 1, name, photo || ''],
            );
          });
        } catch (e) { console.log('Google user local update error:', e); }

        // Check admin approval before granting access
        const userData = res.data.data;
        if (!userData || !userData.isApproved) {
          navigation.navigate('GetAdminApprove', { email: gEmail, name });
          return;
        }

        await setLoginEmail(gEmail);
        Alert.alert('Success', 'Logged in successfully');
        navigation.replace('Welcome', { email: gEmail });

      } else if (res.data.status === 'notgoogle') {
        Alert.alert(
          'Sign-In Method Mismatch',
          'This email is already registered with email & password. Please use email/password to sign in instead.',
        );
      }
    } catch (error) {
      console.error('Google sign-up error:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please check your connection and try again.');
    }
  };

  const handleFingerprintLogin = async () => {
    if (!hasStoredCredentials) {
      Alert.alert('Error', 'Please sign in with your credentials first to enable fingerprint login.');
      return;
    }

    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();

      if (available && (biometryType === 'TouchID' || biometryType === 'Biometrics')) {
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: 'Confirm fingerprint to sign in',
        });

        if (success) {
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            const netState = await NetInfo.fetch();
            const isOnline = netState.isConnected && netState.isInternetReachable;

            if (isOnline) {
              const response = await axios.post(`${API_URL}/fingerprint-login`, {
                email: credentials.username,
              });

              if (response.data.status === 'ok') {
                await setLoginEmail(credentials.username);
                navigation.replace('Welcome', { email: credentials.username });
              } else if (response.data.status === 'notApproved') {
                Alert.alert('Pending', 'Your account is awaiting admin approval.');
              } else if (response.data.status === 'notConfirmed') {
                Alert.alert('Error', 'Please verify your email first.');
              } else {
                Alert.alert('Error', response.data.data || 'Login failed');
              }
            } else {
              // OFFLINE: biometric already verified identity, Keychain has email
              await setLoginEmail(credentials.username);
              Alert.alert('Offline Login', 'Logged in with fingerprint (offline mode).');
              navigation.replace('Welcome', { email: credentials.username });
            }
          }
        } else {
          Alert.alert('Failed', 'Authentication failed. Please try again.');
        }
      } else {
        Alert.alert('Error', 'Biometric authentication not supported.');
      }
    } catch (error: any) {
      console.error('Biometric error:', error);
      Alert.alert('Error', 'Fingerprint authentication failed.');
    }
  };

  const handlePinLogin = async () => {
    if (!hasStoredCredentials) {
      Alert.alert('Error', 'Please sign in with your credentials first to use PIN login.');
      return;
    }
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setUserEmail(credentials.username);
        setUserPin(credentials.password);
        setShowPinSection(true);
      }
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
    }
  };

  const handlePinChange = (text: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);
    if (text.length === 1 && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && pin[index] === '' && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handlePinSubmit = async () => {
    const enteredPin = pin.join('');
    if (enteredPin.length < 4) {
      Alert.alert('Error', 'Please enter all 4 digits');
      return;
    }
    if (enteredPin === userPin) {
      await setLoginEmail(userEmail);
      navigation.replace('Welcome', { email: userEmail });
    } else {
      Alert.alert('Error', 'Invalid PIN. Please try again.');
      setPin(['', '', '', '']);
      pinRefs[0].current?.focus();
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgetPasswordPage');
  };

  return (
    <ImageBackground
      source={require('../../assets/image/Nature.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (showPinSection) {
              setShowPinSection(false);
              setPin(['', '', '', '']);
            } else {
              navigation.goBack();
            }
          }}
          activeOpacity={0.7}>
          <MaterialIcon name="arrow-back" size={28} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">

            {showPinSection ? (
              <View style={styles.formContainer}>
                <View style={styles.pinIconContainer}>
                  <View style={styles.pinLockCircle}>
                    <MaterialIcon name="dialpad" size={40} color="#4A7856" />
                  </View>
                </View>

                <Text style={styles.pinTitle}>Enter Your PIN</Text>
                <Text style={styles.pinSubtitle}>
                  Enter your 4-digit PIN to access your account
                </Text>

                <View style={styles.pinInputContainer}>
                  {pin.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={pinRefs[index]}
                      value={digit}
                      onChangeText={text => handlePinChange(text, index)}
                      onKeyPress={e => handlePinKeyPress(e, index)}
                      style={styles.pinInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      secureTextEntry
                      mode="outlined"
                      outlineColor="rgba(74, 120, 86, 0.3)"
                      activeOutlineColor="#4A7856"
                      theme={{ colors: { primary: '#4A7856', background: '#fff' } }}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handlePinSubmit}
                  activeOpacity={0.8}>
                  <Text style={styles.loginButtonText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setShowPinSection(false);
                    setPin(['', '', '', '']);
                  }}
                  activeOpacity={0.7}>
                  <Text style={styles.usePasswordText}>Use email & password instead</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <View style={styles.header}>
                  <Text style={styles.title}>Sign In</Text>
                  <Text style={styles.subtitle}>
                    If you already have an account. Please sign in
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    mode="outlined"
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    outlineColor="rgba(74, 120, 86, 0.3)"
                    activeOutlineColor="#4A7856"
                    textColor="#333333"
                    style={styles.input}
                    theme={{ colors: { primary: '#4A7856', background: 'rgba(255, 255, 255, 0.95)' } }}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    mode="outlined"
                    placeholder="Enter your password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureTextEntry}
                    outlineColor="rgba(74, 120, 86, 0.3)"
                    activeOutlineColor="#4A7856"
                    textColor="#333333"
                    style={styles.input}
                    right={
                      <TextInput.Icon
                        icon={secureTextEntry ? 'eye-off' : 'eye'}
                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                        color="#4A7856"
                      />
                    }
                    theme={{ colors: { primary: '#4A7856', background: 'rgba(255, 255, 255, 0.95)' } }}
                  />
                </View>

                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.rememberContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                    activeOpacity={0.7}>
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <MaterialIcon name="check" size={16} color="#fff" />}
                    </View>
                    <Text style={styles.rememberText}>Remember</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  activeOpacity={0.8}
                  disabled={loading}>
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.orContainer}>
                  <View style={styles.horizontalLine} />
                  <Text style={styles.orText}>or continue with</Text>
                  <View style={styles.horizontalLine} />
                </View>

                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleLogin}
                  activeOpacity={0.8}>
                  <Image
                    source={require('../../assets/image/google.png')}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleButtonText}>Google</Text>
                </TouchableOpacity>

                <View style={styles.quickLoginContainer}>
                  {isFingerPrintAvailable && (
                    <TouchableOpacity
                      style={styles.quickLoginButton}
                      onPress={handleFingerprintLogin}
                      activeOpacity={0.7}>
                      <MaterialIcon name="fingerprint" size={32} color="#4A7856" />
                      <Text style={styles.quickLoginText}>Fingerprint</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.quickLoginButton}
                    onPress={handlePinLogin}
                    activeOpacity={0.7}>
                    <MaterialIcon name="dialpad" size={32} color="#4A7856" />
                    <Text style={styles.quickLoginText}>PIN</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Don't have an account? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.replace('SignupRoleSelection')}
                    activeOpacity={0.7}>
                    <Text style={styles.signUpLink}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
  },
  backButtonText: { fontSize: 14, color: '#FFFFFF', marginLeft: 5, fontWeight: '600' },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 28,
    ...Platform.select({
      ios: { shadowColor: 'black', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 10 },
      android: { elevation: 10 },
    }),
  },
  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '700', color: '#4A7856', marginBottom: 10 },
  subtitle: { fontSize: 13, color: '#666', lineHeight: 19 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.98)', fontSize: 13 },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#4A7856',
    borderRadius: 4,
    marginRight: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#4A7856' },
  rememberText: { fontSize: 11, color: '#333', fontWeight: '500' },
  forgotText: { fontSize: 11, color: '#4A7856', fontWeight: '700' },
  loginButton: {
    backgroundColor: '#4A7856',
    paddingVertical: 13,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: 'black', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5 },
      android: { elevation: 6 },
    }),
  },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  horizontalLine: { flex: 1, height: 1, backgroundColor: 'rgba(74, 120, 86, 0.2)' },
  orText: { fontSize: 11, color: '#999', marginHorizontal: 10 },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(74, 120, 86, 0.3)',
    marginBottom: 16,
  },
  googleIcon: { width: 20, height: 20, marginRight: 8 },
  googleButtonText: { fontSize: 14, fontWeight: '600', color: '#333' },
  quickLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginBottom: 16,
  },
  quickLoginButton: { alignItems: 'center', gap: 4 },
  quickLoginText: { fontSize: 11, color: '#4A7856', fontWeight: '500' },
  signUpContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signUpText: { fontSize: 12, color: '#666' },
  signUpLink: { fontSize: 12, color: '#4A7856', fontWeight: '700', textDecorationLine: 'underline' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20 },
  pinIconContainer: { alignItems: 'center', marginBottom: 20 },
  pinLockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(74, 120, 86, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinTitle: { fontSize: 24, fontWeight: '700', color: '#4A7856', marginBottom: 8, textAlign: 'center' },
  pinSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  pinInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 25,
  },
  pinInput: {
    width: 55,
    height: 55,
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: '#fff',
  },
  usePasswordText: { fontSize: 13, color: '#4A7856', fontWeight: '600', textDecorationLine: 'underline', textAlign: 'center' },
});

export default SigninForm;
