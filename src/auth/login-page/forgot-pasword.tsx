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

const ForgetPasswordPage = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  };

  const handleSend = () => {
    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      return;
    }
    setEmailError('');

    setLoading(true);
    axios
      .post(`${API_URL}/send-password-reset-email`, {email})
      .then(res => {
        if (res.data.status === 'ok') {
          handleSendCode();
        } else {
          setLoading(false);
          Alert.alert('Error', 'Email not registered!');
        }
      })
      .catch(() => {
        setLoading(false);
        Alert.alert('Error', 'Email not registered!');
      });
  };

  const handleSendCode = async () => {
    try {
      const response = await axios.post(`${API_URL}/send-confirmation-email`, {email});
      const {confirmationCode} = response.data;
      setLoading(false);
      Alert.alert('Success', 'Please check your email for the verification code.');
      navigation.navigate('VerifyFPEmail', {email, confirmationCode});
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Failed to send confirmation email.');
    }
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
          <MaterialIcon name="arrow-back" size={28} color="#4A7856" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.lockCircle}>
              <MaterialIcon name="lock-reset" size={40} color="#4A7856" />
            </View>
          </View>

          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address below and we'll send you a verification code to reset your password.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail address:</Text>
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
              style={styles.input}
              error={!!emailError}
              theme={{colors: {primary: '#4A7856', background: 'rgba(255, 255, 255, 0.95)'}}}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4A7856" style={{marginVertical: 15}} />
          ) : (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              activeOpacity={0.8}>
              <Text style={styles.sendButtonText}>Send Verification Code</Text>
            </TouchableOpacity>
          )}

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginPage')} activeOpacity={0.7}>
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
  inputContainer: {width: '100%', marginBottom: 20},
  label: {fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8},
  input: {backgroundColor: 'rgba(255, 255, 255, 0.98)', fontSize: 13},
  errorText: {color: 'red', fontSize: 12, marginTop: 4},
  sendButton: {
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
  sendButtonText: {fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5},
  loginContainer: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
  loginText: {fontSize: 12, color: '#666'},
  loginLink: {fontSize: 12, color: '#4A7856', fontWeight: '700', textDecorationLine: 'underline'},
});

export default ForgetPasswordPage;
