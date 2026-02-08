import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Appearance,
} from 'react-native';
import {TextInput, DefaultTheme, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from '../../config';
import CustomAlert from '../custom-alert/alert-design';
import * as Keychain from 'react-native-keychain';

const RegisterPage = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleSignUp = () => {
  //   if (!validateFields()) {
  //     return;
  //   }

  //   const userData = {
  //     email: email,
  //     password: password,
  //     confirmPassword: confirmPassword,
  //   };

  //   setLoading(true);

  //   axios
  //     .post(`${API_URL}/register`, userData)
  //     .then(res => {
  //       setLoading(false);
  //       if (res.data.status === 'ok') {
  //         // Save user to SQLite after backend success
  //         saveUserToSQLite(email, password);
  //         handleSendCode();
  //         Alert.alert(
  //           'Success',
  //           'Please check your email for the verification code.',
  //         );
  //       } else {
  //         Alert.alert('Error', res.data.data);
  //       }
  //     })
  //     .catch(error => {
  //       setLoading(false);
  //       console.error('Error:', error);
  //       Alert.alert('Error', 'Error registering user. Please try again.');
  //     });
  // };


  const handleSignUp = () => {
    if (!validateFields()) {
      return;
    }

    const userData = {
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    setLoading(true);

    axios
      .post(`${API_URL}/registering`, userData)
      .then(res => {
        setLoading(false);
        const { status, data } = res.data;

        if (status === 'ok') {
          // Registration successful, send verification email
          console.log('Registration successful');
          handleSendCode();
        } else {
          // Handle user already exists or other errors
          Alert.alert('Error', data);
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error during registration:', error);
        Alert.alert('Error', 'Error registering user. Please try again.');
      });
  };


  // Send verification code to email
  const handleSendCode = async () => {
    const userData = {
      email: email,
    };
    try {
      const response = await axios.post(
        `${API_URL}/send-confirmation-email`,
        userData,
      );
      const {confirmationCode} = response.data;
      console.log('confirmationCode', confirmationCode);
      Alert.alert('Success', 'Please check your email for the verification code.');
      // Navigate to the ConfirmEmail screen and pass the code
      navigation.navigate('VerifyEmail', {email, confirmationCode});
    } catch (err) {
      console.error('Failed to send confirmation email:', err);
      Alert.alert('Error', 'Failed to send confirmation email. Please try again.');
    }
  };

  const validateFields = () => {
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
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

  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const hideAlert = () => {
    setIsAlertVisible(false);
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode = theme === 'dark';

  return (
    <ImageBackground
      source={require('./../../assets/image/imageD.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.title_container}>
        <View
          style={[
            styles.whiteBox,
            {
              backgroundColor: isDarkMode
                ? 'rgba(17, 17, 17, 0.8)'
                : 'rgba(217, 217, 217, 0.7)',
            },
          ]}>
          <Text
            style={[styles.main_text, {color: isDarkMode ? 'white' : 'black'}]}>
            User Registration
          </Text>
          <Text
            style={[styles.sub_text, {color: isDarkMode ? 'white' : 'black'}]}>
            Enter your email and password to login to this app
          </Text>

          <TextInput
            label="Enter Your Email Address"
            mode="outlined"
            value={email}
            onChangeText={email => setEmail(email)}
            style={[
              styles.text_input,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(0, 0, 0, 0.7)'
                  : 'rgba(255, 255, 255, 0.7)',
              },
            ]}
            error={!!emailError}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={password => setPassword(password)}
            style={[
              styles.text_input,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(0, 0, 0, 0.7)'
                  : 'rgba(255, 255, 255, 0.7)',
              },
            ]}
            secureTextEntry
            error={!!passwordError}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <TextInput
            label="Confirm Password"
            mode="outlined"
            value={confirmPassword}
            onChangeText={confirmPassword =>
              setConfirmPassword(confirmPassword)
            }
            style={[
              styles.text_input,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(0, 0, 0, 0.7)'
                  : 'rgba(255, 255, 255, 0.7)',
              },
            ]}
            secureTextEntry
            error={!!confirmPasswordError}
          />
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}

          <CustomAlert
            visible={isAlertVisible}
            onClose={hideAlert}
            message="Successfully Registered!"
          />

          {loading ? (
            <ActivityIndicator size="large" color="#516E9E" />
          ) : (
            <Button
              mode="contained"
              onPress={handleSignUp}
              style={[styles.button_signup, {borderRadius: 8}]}
              buttonColor="#516E9E"
              textColor="white"
              labelStyle={styles.button_label}>
              Sign Up
            </Button>
          )}

          <View style={styles.bottom_container}>
            <Text
              style={[
                styles.sub_text_A,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              If you have an account
            </Text>

            <Button
              mode="text"
              onPress={() => navigation.navigate('LoginPage')}
              theme={{colors: {primary: 'green'}}}>
              <Text
                style={[
                  styles.sub_text_B,
                  {color: isDarkMode ? 'white' : 'black'},
                ]}>
                Signin
              </Text>
            </Button>
          
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '55%',
    height: 142,
    marginLeft: 'auto',
    marginRight: 24,
    marginTop: '60%',
  },
  title_container: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    marginTop: '20%',
  },
  main_text: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
  },
  sub_text: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'right',
  },
  text_container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 142,
  },
  whiteBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 454,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 80,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  text_input: {
    width: '90%',
    marginTop: 10,
  },
  button_signup: {
    width: '90%',
    marginTop: 30,
    fontFamily: 'Inter-regular',
  },
  button_label: {
    fontSize: 18,
  },
  sub_text_A: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'right',
  },
  sub_text_B: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bottom_container: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginTop: 5,
  },
});

export default RegisterPage;
