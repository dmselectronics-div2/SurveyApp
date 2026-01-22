//import liraries
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  Alert,
  Appearance,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {
  Provider as PaperProvider,
  TextInput,
  DefaultTheme,
  Button,
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
// component
const VerifyFPEmail = ({navigation, route}) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [pin5, setPin5] = useState('');
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');
  const [pin4, setPin4] = useState('');
  const [userPin, setUserPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmCode, setConfirmCode] = useState(null);
  const [countdown, setCountdown] = useState(30); // Countdown state
  const [isResendEnabled, setIsResendEnabled] = useState(false); // State to control button enabling
  const timerRef = useRef(null); 
  const [resendAttempts, setResendAttempts] = useState(0);

  // Create references for each TextInput
  const pin1Ref = useRef(null);
  const pin2Ref = useRef(null);
  const pin3Ref = useRef(null);
  const pin4Ref = useRef(null);
  const pin5Ref = useRef(null);

  // SQLite Database
  const db = SQLite.openDatabase(
    {name: 'user_db.db', location: 'default'},
    () => {
      console.log('Database opened');
    },
    err => {
      console.error('Database error: ', err);
    },
  );

  // Get the email from route parameters
  const email = route?.params?.email || null;
  const confirmation = route?.params?.confirmationCode || null;

  useEffect(() => {
    if (confirmation) {
      setConfirmCode(confirmation);
    }
  }, [confirmation]);

  const cleanFilled = () => {
    setPin1('');
    setPin2('');
    setPin3('');
    setPin4('');
    setPin5('');
  };

  const handleConfirmEmail = async () => {
    if (
      pin1 === '' ||
      pin2 === '' ||
      pin3 === '' ||
      pin4 === '' ||
      pin5 === ''
    ) {
      Alert.alert('Failed', 'Please Fill all Field');
    } else {
      setLoading(true);
      handleConfirm();
    }
  };

  const updateEmailVerificationInSQLite = EmailVerified => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Users SET emailConfirm = ? WHERE email = ?',
        [EmailVerified ? 1 : 0, email], // Update fingerprint status (1 for enabled, 0 for disabled)
        (tx, result) => {
          console.log('Email Confirmation status updated in SQLite');
        },
        error => {
          console.error(
            'Error updating Email Confirmation status:',
            error.message,
          );
        },
      );
    });
  };

  // Update useEffect to use the startCountdown function
useEffect(() => {
  if (confirmation) {
    setConfirmCode(confirmation);
    startCountdown();
  }

  return () => {
    clearInterval(timerRef.current); // Cleanup on component unmount
  };
}, [confirmation]);

const startCountdown = () => {
  // Clear any existing timer
  if (timerRef.current) {
    clearInterval(timerRef.current);
  }

  // Reset countdown and disable the resend button
  setCountdown(30);
  setIsResendEnabled(false);

  // Start a new countdown
  timerRef.current = setInterval(() => {
    setCountdown(prev => {
      if (prev <= 1) {
        clearInterval(timerRef.current); // Clear the timer when countdown finishes
        setIsResendEnabled(true); // Enable the button
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};

  const handleConfirm = async () => {
    const enteredPin = `${pin1}${pin2}${pin3}${pin4}${pin5}`;
    if (enteredPin === confirmCode) {
      setLoading(false);
      updateEmailVerificationInSQLite(true);
      Alert.alert('Success', 'Email verified in successfully');
      navigation.navigate('ResetPassword', {email});
    } else {
      Alert.alert('Invalid PIN');
    }
  };

  // Get the email from route parameters
  const sendEmailAgain = async () => {
    if (resendAttempts >= 2) {
      Alert.alert('Limit Reached', 'You can try again later.');
      return;
    }
    try {
      // Clear the existing timer and start a new countdown
      startCountdown();
  
      // Clear the pin fields
      cleanFilled();
  
      // Disable the resend button and reset countdown
      setIsResendEnabled(false);
      setCountdown(30);
  
      // Make the API request to resend the confirmation code
      const response = await axios.post(`${API_URL}/send-password-reset-email`, {
        email,
      });
      const { resetCode } = response.data;
      console.log('New confirmation code:', resetCode);
  
      // Update the confirmation code state
      setConfirmCode(resetCode);

      // Increment the resend attempt counter
      setResendAttempts(prev => prev + 1);
    } catch (err) {
      setError('Failed to send confirmation email.');
      Alert.alert('Error', 'Failed to send confirmation email.');
    }
  };
  

  // remove back press
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

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
            Verify your Email
          </Text>
          <View style={styles.flex_container}>
            <Text
              style={[
                styles.sub_text,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              Please enter the verification code{' '}
            </Text>
            <Text
              style={[
                styles.sub_text_bold,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              {' '}
              we sent to your{' '}
            </Text>
          </View>
          <View style={styles.flex_container}>
            <Text
              style={[
                styles.sub_text_bold,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              {email}
            </Text>
          </View>
          <View style={styles.flex_container}>
            <Text
              style={[
                styles.sub_text_bold,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              {' '}
              email address{' '}
            </Text>
            <Text
              style={[
                styles.sub_text,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              {' '}
              to complete the verification process.
            </Text>
          </View>
          {/* <Text>hi {confirmationCode}</Text> */}

          <View style={styles.flex_container_text_input}>
            <TextInput
              label=""
              mode="outlined"
              value={pin1}
              onChangeText={text => {
                setPin1(text);
                if (text.length === 1) {
                  pin1Ref.current.focus(); // Move to next input
                }
              }}
              style={[
                styles.text_input,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(0, 0, 0, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                  fontSize: 30,
                  textAlign: 'center',
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace' && pin1.length === 0) {
                  pin1Ref.current.blur(); // Prevent focus shift if already empty
                }
              }}
            />
            <TextInput
              ref={pin1Ref}
              label=""
              mode="outlined"
              value={pin2}
              onChangeText={text => {
                setPin2(text);
                if (text.length === 1) {
                  pin2Ref.current.focus(); // Move to next input
                }
              }}
              style={[
                styles.text_input,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(0, 0, 0, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                  fontSize: 30,
                  textAlign: 'center',
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace' && pin2.length === 0) {
                  pin2Ref.current.blur();
                  pin1Ref.current.focus(); // Move back to the previous input
                }
              }}
            />
            <TextInput
              ref={pin2Ref}
              label=""
              mode="outlined"
              value={pin3}
              onChangeText={text => {
                setPin3(text);
                if (text.length === 1) {
                  pin3Ref.current.focus(); // Move to next input
                }
              }}
              style={[
                styles.text_input,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(0, 0, 0, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                  fontSize: 30,
                  textAlign: 'center',
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace' && pin3.length === 0) {
                  pin3Ref.current.focus(); // Move back to the previous input
                }
              }}
            />
            <TextInput
              ref={pin3Ref}
              label=""
              mode="outlined"
              value={pin4}
              onChangeText={text => {
                setPin4(text);
                if (text.length === 1) {
                  pin4Ref.current.focus(); // Move to next input
                }
              }}
              style={[
                styles.text_input,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(0, 0, 0, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                  fontSize: 30,
                  textAlign: 'center',
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace' && pin4.length === 0) {
                  pin4Ref.current.blur();
                  pin3Ref.current.focus(); // Move back to the previous input
                }
              }}
            />
            <TextInput
              ref={pin4Ref}
              label=""
              mode="outlined"
              value={pin5}
              onChangeText={setPin5}
              style={[
                styles.text_input,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(0, 0, 0, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                  fontSize: 30,
                  textAlign: 'center',
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace' && pin5.length === 0) {
                  pin5Ref.current.focus(); // Move back to the previous input
                }
              }}
            />
          </View>

          {/* {loading ?
           (
            <ActivityIndicator size="large" color="#516E9E" />
          ) : ( */}
          <Button
            mode="contained"
            onPress={handleConfirmEmail}
            style={[styles.button_signup, {borderRadius: 8}]}
            buttonColor="#516E9E"
            textColor="white"
            labelStyle={styles.button_label}>
            Confirm
          </Button>
          {/* </Button>)} */}

          <TouchableOpacity
            onPress={sendEmailAgain}
            disabled={!isResendEnabled || resendAttempts >= 2} // Disable until countdown finishes
          >
            <Text
              style={[
                styles.forgotPasswordText,
                {
                  color:
                    isResendEnabled && resendAttempts < 2
                      ? isDarkMode
                        ? 'white'
                        : 'black'
                      : 'gray',
                },
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
    </ImageBackground>
  );
};

// styles
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
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    // backgroundColor: 'white',
    fontFamily: 'Inter-Bold',
    marginTop: '20%',
  },
  forgotPasswordText: {
    color: 'black',
    textDecorationLine: 'underline',
    fontSize: 16,
    marginTop: 10,
    // marginLeft: 240,
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
    textAlign: 'center',
  },
  sub_text_bold: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
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
    // width: '100%',
    height: 442,
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
    width: 55,
  },
  button_signup: {
    width: '90%',
    marginTop: 115,
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
  flex_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex_container_text_input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 40,
  },
});

export default VerifyFPEmail;
