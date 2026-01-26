import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Alert,
  Appearance,
} from 'react-native';
import {TextInput, Button, Switch} from 'react-native-paper';
import axios from 'axios';
import {API_URL} from '../../config';
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';
import SQLite from 'react-native-sqlite-storage';

const SetNewPin = ({navigation, route}) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [BiometicHas, isBiometricHas] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');

  // References to TextInput fields
  const pin1Ref = useRef(null);
  const pin2Ref = useRef(null);
  const pin3Ref = useRef(null);

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
  const gName = route?.params?.name || null;

  if (!email) {
    // If email is not provided, handle the error
    console.error('Error: Email is not passed to SetPin component.');
    return (
      <View>
        <Text>Error: Email not provided.</Text>
      </View>
    );
  }

  // Function to update the pin in SQLite
  const updatePinInSQLite = pinValue => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Users SET pin = ? WHERE email = ?',
        [pinValue, email], // Update the pin for the user
        (tx, result) => {
          console.log('PIN updated in SQLite');
        },
        error => {
          console.error('Error updating PIN:', error.message);
        },
      );
    });
  };

  const handleSavePin = async () => {
    const completePin = `${pin}${pin1}${pin2}${pin3}`;

    if (pin === '' || pin1 === '' || pin2 === '' || pin3 === '') {
      Alert.alert('Failed', 'Please Fill all Field');
    } else {
      try {
        const response = await axios.post(`${API_URL}/save-pin`, {
          email, // Send email to identify the user
          pin: completePin, // Send the concatenated PIN
        });

        if (response.status === 200) {
          await Keychain.setGenericPassword(email, completePin);
          Alert.alert('Success', 'PIN saved successfully');
          // Update the PIN in SQLite
          updatePinInSQLite(completePin);
          if (biometricEnabled) {
            navigation.navigate('LoginPage', {email, gName});
          }
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', error.response?.data?.error || 'Server Error');
      }
      try {
        // Store the PIN securely
        await Keychain.setGenericPassword(email, completePin);
        Alert.alert('Success', 'PIN set successfully!');
        // Update the PIN in SQLite
        updatePinInSQLite(completePin);
        if (biometricEnabled) {
          navigation.navigate('LoginPage', {email, gName});
        }
        navigation.navigate('LoginPage', {email, gName});
      } catch (error) {
        console.error('Error storing PIN:', error);
        Alert.alert('Error', 'Failed to set PIN. Please try again.');
      }
    }
  };

  const updateFingerPrintInSQLite = () => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Users SET fingerPrint = ? WHERE email = ?',
        [1, email], // Update fingerprint status (1 for enabled, 0 for disabled)
        (tx, result) => {
          console.log('Fingerprint status updated in SQLite');
        },
        error => {
          console.error('Error updating fingerprint status:', error.message);
        },
      );
    });
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode = theme === 'dark';

  // const onToggleSwitch = () => {
  //   setIsSwitchOn(!isSwitchOn);
  //   if (isSwitchOn) {
  //     Alert.alert('Biometric Not Disabled');
  //   }else{
  //     setBiometricEnabled(true);
  //     handleBiometricAuth();
  //   }
  // };

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    if (!isSwitchOn) {
      setBiometricEnabled(true);
      handleBiometricAuth();
    } else {
      setBiometricEnabled(false);
      updateFingerPrintInSQLite();
      Alert.alert('Fingerprint disabled');
    }
  };

  useEffect(() => {
    showBiometricEnable();
  }, []);

  const showBiometricEnable = () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const checkBiometrics = async () => {
      try {
        const {available, biometryType} =
          await rnBiometrics.isSensorAvailable();
        if (available) {
          isBiometricHas(true);
        } else {
          updateFingerPrintInSQLite(false);
          Alert.alert('Biometric sensor not available on this device.');
        }
        // }
      } catch (error) {
        // Log the exact error for debugging purposes
        console.error('Biometric error:', error);
        Alert.alert(
          'Error',
          `An error occurred while trying to authenticate: ${error.message}`,
        );
      }
    };

    checkBiometrics();
  };

  // const biometricSwitchOn = () => {
  //   if (isSwitchOn) {
  //     handleBiometricAuth();
  //   }
  // };

  const handleBiometricAuth = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    try {
      const {success} = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirm fingerprint',
      });

      if (success) {
        Alert.alert('Authentication Success', 'Fingerprint Added Successfully');
        updateFingerPrintInSQLite(true);
        // navigation.navigate('SelectResearchArea');
      } else {
        Alert.alert('Authentication failed', 'Please try again.');
      }
    } catch (error) {
      // Log the exact error for debugging purposes
      console.error('Biometric error:', error);
      Alert.alert(
        'Error',
        `An error occurred while trying to authenticate: ${error.message}`,
      );
    }
  };

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
            Set Your PIN
          </Text>
          <View style={styles.pinContainer}>
            <TextInput
              value={pin}
              onChangeText={text => {
                setPin(text);
                if (text.length === 1) {
                  pin1Ref.current.focus(); // Move to next input
                }
              }}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace' && pin === '') {
                  pin1Ref.current.blur(); // Avoid focusing if the field is already empty
                }
              }}
              style={[
                styles.text_input,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(0, 0, 0, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                  fontSize: 30,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
            />
            <TextInput
              ref={pin1Ref}
              value={pin1}
              onChangeText={text => {
                setPin1(text);
                if (text.length === 1) {
                  pin2Ref.current.focus(); // Move to next input
                }
              }}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace' && pin1 === '') {
                  pin1Ref.current.blur();
                  pin2Ref.current.focus(); // Move to the previous input
                }
              }}
              style={[
                styles.text_input,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(0, 0, 0, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                  fontSize: 30,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
            />
            <TextInput
              ref={pin2Ref}
              value={pin2}
              onChangeText={text => {
                setPin2(text);
                if (text.length === 1) {
                  pin3Ref.current.focus(); // Move to next input
                }
              }}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace' && pin2 === '') {
                  pin1Ref.current.focus(); // Move back to the previous input
                }
              }}
              style={[
                styles.text_input,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(0, 0, 0, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                  fontSize: 30,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
            />
            <TextInput
              ref={pin3Ref}
              value={pin3}
              onChangeText={setPin3}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace' && pin3 === '') {
                  pin2Ref.current.focus(); // Move back to the previous input
                }
              }}
              style={[
                styles.text_input,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(0, 0, 0, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                  fontSize: 30,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
            />
          </View>
          <Button
            mode="contained"
            onPress={handleSavePin}
            style={styles.button_signup}
            buttonColor="#516E9E"
            textColor="white"
            labelStyle={styles.button_label}>
            Save PIN
          </Button>
          {BiometicHas && (
            <View style={styles.bottom_container}>
              <Text
                style={[
                  styles.sub_text_A,
                  {color: isDarkMode ? 'white' : 'black'},
                ]}>
                Enable Finger Print
              </Text>
              <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bottom_container: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center',
  },
  sub_text_A: {
    fontSize: 18,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'left',
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
  pinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    marginTop: 20,
  },
  text_input: {
    width: 55,
  },
  button_signup: {
    width: '90%',
    marginTop: 30,
    fontFamily: 'Inter-regular',
    borderRadius: 8,
  },
  button_label: {
    fontSize: 18,
  },
});

export default SetNewPin;
