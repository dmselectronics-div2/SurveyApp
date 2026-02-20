import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {API_URL} from '../../config';
import SQLite from 'react-native-sqlite-storage';
import {hashPassword} from '../../utils/passwordUtils';

const ResetPassword = ({navigation, route}: any) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const email = route?.params?.email || null;

  const db = SQLite.openDatabase(
    {name: 'user_db.db', location: 'default'},
    () => console.log('Database opened'),
    (err: any) => console.error('Database error: ', err),
  );

  const validateFields = () => {
    let isValid = true;
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    return isValid;
  };

  const handleResetPassword = () => {
    if (!validateFields()) return;

    setLoading(true);
    axios
      .post(`${API_URL}/update-password`, {email, password})
      .then(res => {
        setLoading(false);
        if (res.data.status === 'ok') {
          saveUserToSQLite(email, password);
          Alert.alert('Success', 'Password has been reset successfully.');
          navigation.navigate('SetNewPin', {email});
        } else {
          Alert.alert('Error', res.data.data || 'Failed to reset password');
        }
      })
      .catch(() => {
        setLoading(false);
        Alert.alert('Error', 'Failed to reset password. Please try again.');
      });
  };

  const saveUserToSQLite = (userEmail: string, pwd: string) => {
    const hashedPw = hashPassword(pwd);
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE Users SET password = ? WHERE email = ?',
        [hashedPw, userEmail],
        () => console.log('Password updated in SQLite'),
        (error: any) => console.log('Error updating password: ' + error.message),
      );
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/image/welcome.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <MaterialIcon name="arrow-back" size={28} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.lockCircle}>
              <MaterialIcon name="vpn-key" size={40} color="#4A7856" />
            </View>
          </View>

          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter a new password for your account</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              mode="outlined"
              placeholder="Enter new password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={securePassword}
              outlineColor="rgba(74, 120, 86, 0.3)"
              activeOutlineColor="#4A7856"
              textColor="#333333"
              style={styles.input}
              error={!!passwordError}
              right={
                <TextInput.Icon
                  icon={securePassword ? 'eye-off' : 'eye'}
                  onPress={() => setSecurePassword(!securePassword)}
                  color="#4A7856"
                />
              }
              theme={{colors: {primary: '#4A7856', background: 'rgba(255, 255, 255, 0.95)'}}}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              mode="outlined"
              placeholder="Confirm new password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConfirm}
              outlineColor="rgba(74, 120, 86, 0.3)"
              activeOutlineColor="#4A7856"
              textColor="#333333"
              style={styles.input}
              error={!!confirmPasswordError}
              right={
                <TextInput.Icon
                  icon={secureConfirm ? 'eye-off' : 'eye'}
                  onPress={() => setSecureConfirm(!secureConfirm)}
                  color="#4A7856"
                />
              }
              theme={{colors: {primary: '#4A7856', background: 'rgba(255, 255, 255, 0.95)'}}}
            />
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4A7856" style={{marginVertical: 15}} />
          ) : (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleResetPassword}
              activeOpacity={0.8}>
              <Text style={styles.saveButtonText}>Save New Password</Text>
            </TouchableOpacity>
          )}

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SigninForm')} activeOpacity={0.7}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {flex: 1, resizeMode: 'cover'},
  overlay: {flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', paddingHorizontal: 20},
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
  },
  backButtonText: {fontSize: 14, color: '#FFFFFF', marginLeft: 5, fontWeight: '600'},
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: {shadowColor: 'black', shadowOffset: {width: 0, height: 5}, shadowOpacity: 0.35, shadowRadius: 10},
      android: {elevation: 10},
    }),
  },
  iconContainer: {marginBottom: 15},
  lockCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(74, 120, 86, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {fontSize: 24, fontWeight: '700', color: '#4A7856', marginBottom: 10, textAlign: 'center'},
  subtitle: {fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 20},
  inputContainer: {width: '100%', marginBottom: 16},
  label: {fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8},
  input: {backgroundColor: 'rgba(255, 255, 255, 0.98)', fontSize: 13},
  errorText: {color: 'red', fontSize: 12, marginTop: 4},
  saveButton: {
    backgroundColor: '#4A7856',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    ...Platform.select({
      ios: {shadowColor: 'black', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.25, shadowRadius: 5},
      android: {elevation: 6},
    }),
  },
  saveButtonText: {fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5},
  loginContainer: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
  loginText: {fontSize: 12, color: '#666'},
  loginLink: {fontSize: 12, color: '#4A7856', fontWeight: '700', textDecorationLine: 'underline'},
});

export default ResetPassword;
