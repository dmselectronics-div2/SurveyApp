import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  Alert,
  TouchableOpacity,
  BackHandler,
  TextInput,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../../config';
import SQLite from 'react-native-sqlite-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const VerifyEmail = ({ navigation, route }: any) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [confirmCode, setConfirmCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30); // Resend timer
  const [expirationTime, setExpirationTime] = useState(600); // 10 min expiration
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);

  const inputs = useRef<Array<any>>([]);
  const timerRef = useRef<any>(null);
  const expirationTimerRef = useRef<any>(null);

  const db = SQLite.openDatabase(
    { name: 'user_db.db', location: 'default' },
    () => console.log('Database opened'),
    (err: any) => console.error('Database error: ', err),
  );

  const email = route?.params?.email || null;
  const confirmation = route?.params?.confirmationCode || null;
  const gName = route?.params?.name || null;

  useEffect(() => {
    if (confirmation) {
      setConfirmCode(confirmation);
      startCountdown();
    }
    return () => {
      clearInterval(timerRef.current);
      clearInterval(expirationTimerRef.current);
    };
  }, [confirmation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, [navigation]);

  const startCountdown = () => {
    // Resend Timer (30 seconds)
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(30);
    setIsResendEnabled(false);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Expiration Timer (10 minutes)
    if (expirationTimerRef.current) clearInterval(expirationTimerRef.current);
    setExpirationTime(600);
    expirationTimerRef.current = setInterval(() => {
      setExpirationTime(prev => {
        if (prev <= 1) {
          clearInterval(expirationTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleInputChange = (text: string, index: number) => {
    const newCode = [...code];

    // Handle paste
    if (text.length > 1) {
      const pastedCode = text.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || '';
      }
      setCode(newCode);

      const lastIndex = newCode.findLastIndex(c => c !== '');
      const focusIndex = lastIndex < 5 ? lastIndex + 1 : 5;
      inputs.current[focusIndex]?.focus();
      return;
    }

    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!code[index] && index > 0) {
        inputs.current[index - 1]?.focus();
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
      }
    }
  };

  const cleanFilled = () => {
    setCode(['', '', '', '', '', '']);
    inputs.current[0]?.focus();
  };

  const updateEmailVerificationInSQLite = () => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE Users SET emailConfirm = ? WHERE email = ?',
        [1, email],
        () => {
          console.log('Email Confirmation status updated in SQLite');
          Alert.alert('Success', 'Email verified successfully');
          navigation.navigate('GetAdminApprove', { email, name: gName });
        },
        (error: any) => console.error('Error updating Email Confirmation status:', error.message),
      );
    });
  };

  const handleConfirmEmail = () => {
    const enteredPin = code.join('');
    if (enteredPin.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    if (expirationTime === 0) {
      Alert.alert('Expired', 'This code has expired. Please request a new one.');
      return;
    }

    setLoading(true);

    if (enteredPin === confirmCode) {
      setLoading(false);
      axios
        .post(`${API_URL}/email-validation`, { email })
        .then(res => {
          if (res.data.status === 'ok') {
            updateEmailVerificationInSQLite();
          } else {
            Alert.alert('Error', 'Email verification failed');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          Alert.alert('Error', 'Error verifying email. Please try again.');
        });
    } else {
      setLoading(false);
      Alert.alert('Error', 'Invalid verification code');
    }
  };

  const sendEmailAgain = async () => {
    if (resendAttempts >= 2) {
      Alert.alert('Limit Reached', 'You can try again later.');
      return;
    }
    try {
      startCountdown();
      cleanFilled();
      const response = await axios.post(`${API_URL}/send-confirmation-email`, { email });
      const { confirmationCode } = response.data;
      setConfirmCode(confirmationCode);
      setResendAttempts(prev => prev + 1);
    } catch (err) {
      Alert.alert('Error', 'Failed to send confirmation email.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/image/welcome.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialIcon name="arrow-back" size={28} color="#4A7856" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.centerContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Verify your Email</Text>
            <Text style={styles.description}>
              Please enter the 6-digit verification code we sent to{' '}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            <Text style={styles.timerText}>
              Code expires in: <Text style={styles.timerBold}>{formatTime(expirationTime)}</Text>
            </Text>

            <View style={styles.pinContainer}>
              {code.map((digit, index) => (
                <View key={index} style={styles.inputWrapper}>
                  <TextInput
                    ref={ref => inputs.current[index] = ref}
                    style={styles.pinInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleInputChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    selectTextOnFocus
                    cursorColor="#4A7856"
                    selectionColor="#4A7856"
                  />
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
              onPress={handleConfirmEmail}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.confirmButtonText}>
                {loading ? 'Verifying...' : 'Confirm'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={sendEmailAgain}
              disabled={!isResendEnabled || resendAttempts >= 2}
            >
              <Text style={[
                styles.resendText,
                { color: isResendEnabled && resendAttempts < 2 ? '#4A7856' : '#999' },
              ]}>
                {resendAttempts >= 2
                  ? 'Try again later'
                  : isResendEnabled
                    ? 'Re-send code?'
                    : `Re-send available in ${countdown}s`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'center' },
  backButton: {
    position: 'absolute', top: Platform.OS === 'ios' ? 50 : 40, left: 20,
    flexDirection: 'row', alignItems: 'center', padding: 10, zIndex: 10,
  },
  backButtonText: { fontSize: 16, color: '#4A7856', marginLeft: 5, fontWeight: '600' },
  centerContainer: { paddingHorizontal: 20 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: 20, padding: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: 'black', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 10 },
      android: { elevation: 10 },
    }),
  },
  title: { fontSize: 24, fontWeight: '700', color: '#4A7856', marginBottom: 12 },
  description: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 5 },
  timerText: { fontSize: 13, color: '#E74C3C', textAlign: 'center', marginBottom: 20 },
  timerBold: { fontWeight: '700' },
  emailText: { fontWeight: '700', color: '#333' },
  pinContainer: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%',
    marginBottom: 25, gap: 8,
  },
  inputWrapper: {
    flex: 1,
    height: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(74, 120, 86, 0.3)',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  pinInput: {
    flex: 1,
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
    padding: 0, // Remove default padding
  },
  confirmButton: {
    backgroundColor: '#4A7856', paddingVertical: 13, borderRadius: 25,
    alignItems: 'center', width: '100%', marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: 'black', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5 },
      android: { elevation: 6 },
    }),
  },
  confirmButtonDisabled: { opacity: 0.6 },
  confirmButtonText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  resendText: { fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' },
});

export default VerifyEmail;
