import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Alert,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Switch } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../../config';
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';
import SQLite from 'react-native-sqlite-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const SetPin = ({ navigation, route }: any) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [BiometicHas, isBiometricHas] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);

  const pinRefs = [useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null)];

  const db = SQLite.openDatabase(
    { name: 'user_db.db', location: 'default' },
    () => console.log('Database opened'),
    (err: any) => console.error('Database error: ', err),
  );

  const email = route?.params?.email || null;
  const gName = route?.params?.name || null;

  if (!email) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: Email not provided.</Text>
      </View>
    );
  }

  const handlePinChange = (text: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);
    if (text.length === 1 && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && pin[index] === '' && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const updatePinInSQLite = (pinValue: string) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE Users SET pin = ? WHERE email = ?',
        [pinValue, email],
        () => console.log('PIN updated in SQLite'),
        (error: any) => console.error('Error updating PIN:', error.message),
      );
    });
  };

  const handleSavePin = async () => {
    const completePin = pin.join('');

    if (completePin.length < 4) {
      Alert.alert('Error', 'Please enter all 4 digits');
      return;
    }

    setLoading(true);
    try {
      // Save locally FIRST (works offline)
      await Keychain.setGenericPassword(email, completePin);
      updatePinInSQLite(completePin);

      if (biometricEnabled) {
        updateFingerPrintInSQLite();
      }

      // Try server sync in background (non-blocking)
      try {
        const NetInfo = require('@react-native-community/netinfo').default;
        const netState = await NetInfo.fetch();
        if (netState.isConnected && netState.isInternetReachable) {
          await axios.post(`${API_URL}/save-pin`, { email, pin: completePin });
          if (biometricEnabled) {
            await axios.post(`${API_URL}/enable-fingerprint`, { email });
          }
        }
      } catch (serverError) {
        console.log('Server PIN sync deferred (offline):', serverError);
      }

      Alert.alert('Success', 'PIN set successfully! Please sign in to continue.', [
        {
          text: 'OK',
          onPress: () => navigation.replace('SigninForm'),
        },
      ]);
    } catch (error) {
      console.error('Error storing PIN:', error);
      Alert.alert('Error', 'Failed to set PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFingerPrintInSQLite = () => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE Users SET fingerPrint = ? WHERE email = ?',
        [1, email],
        () => console.log('Fingerprint status updated in SQLite'),
        (error: any) => console.error('Error updating fingerprint status:', error.message),
      );
    });
  };

  const getResearchAreaDataFromMongo = (userEmail: string, userName: string) => {
    axios
      .post(`${API_URL}/get-reArea`, { email: userEmail, gName: userName })
      .then(res => {
        if (res.data.status === 'bird') {
          getResearchNameDataFromMongo(userEmail, userName);
        } else if (res.data.status === 'none') {
          navigation.navigate('SignupSuccess', { email: userEmail, name: userName });
        } else {
          navigation.navigate('SignupSuccess', { email: userEmail, name: userName });
        }
      })
      .catch(() => {
        navigation.navigate('SignupSuccess', { email: userEmail, name: userName });
      });
  };

  const getResearchNameDataFromMongo = (userEmail: string, userName: string) => {
    axios
      .post(`${API_URL}/get-name`, { email: userEmail, gName: userName })
      .then(res => {
        const data = res.data;
        if (data && data.name && data.email) {
          ruuldildb(data.email, data.confirmEmail, data.name, data.profileImagePath, data.area);
        } else {
          navigation.navigate('SignupSuccess', { email: userEmail, name: userName });
        }
      })
      .catch(() => {
        navigation.navigate('SignupSuccess', { email: userEmail, name: userName });
      });
  };

  const ruuldildb = (userEmail: string, emailStatus: any, userName: string, profileImagePath: string, area: string) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE LoginData SET email = ? WHERE id=1',
        [userEmail],
        () => {
          saveGoogleUserToSQLite(userEmail, emailStatus, userName, profileImagePath, area);
        },
        (error: any) => console.log('Error saving user to SQLite: ' + error.message),
      );
    });
  };

  const saveGoogleUserToSQLite = (userEmail: string, emailStatus: any, userName: string, profileImagePath: string, area: string) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'SELECT * FROM Users WHERE email = ?',
        [userEmail],
        (tx: any, results: any) => {
          if (results.rows.length > 0) {
            tx.executeSql(
              'UPDATE Users SET isGoogleLogin = ?, emailConfirm = ?, name = ?, userImageUrl = ?, area = ? WHERE email = ?',
              [0, 1, userName, profileImagePath, area, userEmail],
              () => navigation.navigate('Welcome', { email: userEmail }),
              (error: any) => console.log('Error saving user to SQLite: ' + error.message),
            );
          } else {
            navigation.navigate('Welcome', { email: userEmail });
          }
        },
        (error: any) => console.log('Error querying Users table: ' + error.message),
      );
    });
  };

  useEffect(() => {
    showBiometricEnable();
  }, []);

  const showBiometricEnable = () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const checkBiometrics = async () => {
      try {
        const { available } = await rnBiometrics.isSensorAvailable();
        if (available) {
          isBiometricHas(true);
        }
      } catch (error: any) {
        console.error('Biometric error:', error);
      }
    };
    checkBiometrics();
  };

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    if (!isSwitchOn) {
      setBiometricEnabled(true);
      handleBiometricAuth();
    } else {
      setBiometricEnabled(false);
      Alert.alert('Info', 'Fingerprint disabled');
    }
  };

  const handleBiometricAuth = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirm fingerprint',
      });
      if (success) {
        Alert.alert('Success', 'Fingerprint added successfully');
        updateFingerPrintInSQLite();
      } else {
        Alert.alert('Failed', 'Authentication failed. Please try again.');
        setIsSwitchOn(false);
        setBiometricEnabled(false);
      }
    } catch (error: any) {
      console.error('Biometric error:', error);
      Alert.alert('Error', `Biometric authentication error: ${error.message}`);
      setIsSwitchOn(false);
      setBiometricEnabled(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/image/welcome.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <View style={styles.lockCircle}>
                  <MaterialIcon name="lock" size={40} color="#4A7856" />
                </View>
              </View>

              <Text style={styles.title}>Set Your PIN</Text>
              <Text style={styles.subtitle}>
                Create a 4-digit PIN to secure your account
              </Text>

              <View style={styles.pinContainer}>
                {pin.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={pinRefs[index]}
                    value={digit}
                    onChangeText={text => handlePinChange(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
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

              {BiometicHas && (
                <View style={styles.fingerprintContainer}>
                  <View style={styles.fingerprintRow}>
                    <MaterialIcon name="fingerprint" size={24} color="#4A7856" />
                    <Text style={styles.fingerprintText}>Enable Fingerprint</Text>
                  </View>
                  <Switch
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                    color="#4A7856"
                  />
                </View>
              )}

              <TouchableOpacity
                style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                onPress={handleSavePin}
                activeOpacity={0.8}
                disabled={loading}>
                <Text style={styles.saveButtonText}>
                  {loading ? 'Saving...' : 'Save PIN'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'center' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: 'black', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 10 },
      android: { elevation: 10 },
    }),
  },
  iconContainer: { marginBottom: 20 },
  lockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(74, 120, 86, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: '700', color: '#4A7856', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  pinContainer: {
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
  fingerprintContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(74, 120, 86, 0.15)',
    marginBottom: 20,
  },
  fingerprintRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fingerprintText: { fontSize: 15, color: '#333', fontWeight: '500' },
  saveButton: {
    backgroundColor: '#4A7856',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    ...Platform.select({
      ios: { shadowColor: 'black', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5 },
      android: { elevation: 6 },
    }),
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
});

export default SetPin;
