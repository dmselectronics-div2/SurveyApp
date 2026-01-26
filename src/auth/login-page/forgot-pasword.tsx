import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  Appearance,
  ActivityIndicator,
} from 'react-native';
import {
  Provider as PaperProvider,
  TextInput,
  DefaultTheme,
  Button,
  Icon,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from '../../config';
import SQLite from 'react-native-sqlite-storage';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#56FF64',
    text: 'red',
    placeholder: 'white',
    surface: 'rgba(217, 217, 217, 0.7)',
  },
};

const ForgetPasswordPage = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const db = SQLite.openDatabase(
    {name: 'user_db.db', location: 'default'},
    () => {
      console.log('Database opened successfully');
    },
    error => {
      console.error('Error opening database: ', error);
    },
  );

  const handleLogin = () => {
    if (!validateFields()) {
      return;
    }

    const userData = {
      email: email,
    };

    axios
      .post(`${API_URL}/send-password-reset-email`, userData)
      .then(res => {
        // console.log('Response:', res.data);
        if (res.data.status === 'ok') {
          // Alert.alert('Success', 'Email verified in successfully');
          handleSendCode();
        } else {
          Alert.alert('Error', 'Email not registered!');
        }
      })
      .catch(error => {
        // console.error('Error:', error);
        Alert.alert('Error', 'Email not registered!');
      });
    // console.log('email should verify here', API_URL);
  };

  const handleLogin2 = () => {
    navigation.navigate('LoginPage');
  };

  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateFields = () => {
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    return isValid;
  };

  // Get the email from route parameters
  const handleSendCode = async () => {
    const userData = {
      email: email,
    };
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/send-confirmation-email`,
        userData,
      );
      const {confirmationCode} = response.data;
      console.log('confirmationCode', confirmationCode);
      setLoading(false);
      Alert.alert(
        'Success',
        'Please check your email for the verification code.',
      );
      navigation.navigate('VerifyFPEmail', {email, confirmationCode});
    } catch (err) {
      setError('Failed to send confirmation email.');
    }
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
            Forgot Password
          </Text>
          <Text
            style={[styles.sub_text, {color: isDarkMode ? 'white' : 'black'}]}>
            Enter your email address below to reset your password.
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

          {/* <Button
            mode="contained"
            onPress={handleLogin}
            style={[styles.button_signup, {borderRadius: 8}]}
            buttonColor="#516E9E"
            textColor="white"
            labelStyle={styles.button_label}>
            Send
          </Button> */}

          {loading ? (
            <ActivityIndicator size="large" color="#516E9E" />
          ) : (
            <Button
              mode="contained"
              onPress={handleLogin}
              style={[styles.button_signup, {borderRadius: 8}]}
              buttonColor="#516E9E"
              textColor="white"
              labelStyle={styles.button_label}>
              Send
            </Button>
          )}

          <TouchableOpacity onPress={handleLogin2}>
            <Text
              style={[
                styles.forgotPasswordText,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              Back to Login
            </Text>
          </TouchableOpacity>
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
  boldText: {
    fontWeight: 'bold',
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
    marginTop: 10,
  },
  sub_text_below: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: 'rgba(217, 217, 217, 0.8)',
    textAlign: 'center',
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
    height: 300,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 80,
  },
  forgotPasswordText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 19,
    marginTop: 10,
    marginLeft: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10, // Adjusted for a smaller gap
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
    marginTop: 20,
    fontFamily: 'Inter-regular',
  },
  finger_icon: {
    // justifyContent: 'center',
    // flexDirection: 'row',
    marginRight: 10,
    marginTop: 10,
    // marginLeft:-100
  },
  dialpad_icon: {
    // justifyContent: 'center',
    // flexDirection: 'row',
    marginRight: 90,
    marginTop: 10,
    // marginLeft:-100
  },
  button_google: {
    width: '90%',
    marginTop: 6,
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
  sub_text_C: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sub_text_D: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'right',
    marginTop: 2,
  },
  bottom_container: {
    flexDirection: 'row',
    marginTop: 2,
    alignItems: 'center',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 9,
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 5,
    justifyContent: 'center',
    marginLeft: 100,
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 10,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleButtonText: {
    fontSize: 18,
    color: 'black', // Same color as the button's textColor
  },
  lower_container: {
    flexDirection: 'row',
    marginTop: 180,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginTop: 5,
  },
});

export default ForgetPasswordPage;
