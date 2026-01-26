import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Alert,
  Appearance,
} from 'react-native';
import {TextInput, DefaultTheme, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from '../../config';
import * as Keychain from 'react-native-keychain';

const AddPin = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPin, setUserPin] = useState('');

  // Create references for each TextInput
  const pin1Ref = useRef(null);
  const pin2Ref = useRef(null);
  const pin3Ref = useRef(null);

  // Replace with the actual email from context or state
  const email = 'user@example.com';

  const handleSignIn = async () => {
    const enteredPin = `${pin}${pin1}${pin2}${pin3}`;
    if (pin === '' || pin1 === '' || pin2 === '' || pin3 === '') {
      Alert.alert('Failed', 'Please Fill all Field');
    } else {
      if (enteredPin === userPin) {
        // Alert.alert('Success', 'Signed in successfully');
        navigation.navigate('Welcome', {email}); // Navigate to the desired screen
      } else {
        Alert.alert('Invalid PIN');
      }
    }
  };

  // Retrieving the email
  const retrieveEmailSecurely = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const email = credentials.username;
        const pinPW = credentials.password;
        setUserEmail(email);
        setUserPin(pinPW);
        console.log('Retrieved email:', email);
        console.log('Retrieved PIN:', pinPW);
        return {email, pinPW};
      } else {
        console.log('No email found');
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve email securely', error);
    }
  };

  useEffect(() => {
    retrieveEmailSecurely(); // Call it when the Login page loads
  }, []);

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
            Enter Your PIN
          </Text>
          <View style={styles.flex_container}>
            <Text
              style={[
                styles.sub_text,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              Please enter a{' '}
            </Text>
            <Text
              style={[
                styles.sub_text_bold,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              {' '}
              PIN for access to this app
            </Text>
            <Text
              style={[
                styles.sub_text,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              {' '}
              without
            </Text>
          </View>
          <View style={styles.flex_container}>
            <Text
              style={[
                styles.sub_text,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              {' '}
              sign in.
            </Text>
          </View>

          <View style={styles.flex_container_text_input}>
            <TextInput
              label=""
              mode="outlined"
              value={pin}
              onChangeText={text => {
                setPin(text);
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
                if (nativeEvent.key === 'Backspace' && pin.length === 0) {
                  pin1Ref.current.blur(); // Prevent focus shift if already empty
                }
              }}
            />
            <TextInput
              ref={pin1Ref}
              label=""
              mode="outlined"
              value={pin1}
              onChangeText={text => {
                setPin1(text);
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
                if (nativeEvent.key === 'Backspace' && pin1.length === 0) {
                  pin1Ref.current.blur();
                  pin2Ref.current.focus(); // Move back to the previous input
                }
              }}
            />
            <TextInput
              ref={pin2Ref}
              label=""
              mode="outlined"
              value={pin2}
              onChangeText={text => {
                setPin2(text);
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
                if (nativeEvent.key === 'Backspace' && pin2.length === 0) {
                  pin1Ref.current.focus(); // Move back to the previous input
                }
              }}
            />
            <TextInput
              ref={pin3Ref}
              label=""
              mode="outlined"
              value={pin3}
              onChangeText={setPin3}
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
                  pin2Ref.current.focus(); // Move back to the previous input
                }
              }}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSignIn}
            style={[styles.button_signup, {borderRadius: 8}]}
            buttonColor="#516E9E"
            textColor="white"
            labelStyle={styles.button_label}>
            Continue
          </Button>
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
    height: 300,
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
    marginTop: 30,
    fontFamily: 'Inter-regular',
  },
  button_label: {
    fontSize: 18,
  },
  flex_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex_container_text_input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    marginTop: 20,
  },
});

export default AddPin;
