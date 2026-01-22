import React, {useState, useEffect, useCallback} from 'react';
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
} from 'react-native';
import {
  Provider as PaperProvider,
  TextInput,
  DefaultTheme,
  Button,
  Icon,
} from 'react-native-paper';

import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from '../../config';
import ReactNativeBiometrics from 'react-native-biometrics';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as Keychain from 'react-native-keychain';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import ProfileMenu from '../dashboard-page/menu-page/profile-page';
const GOOGLE_WEB_CLIENT_ID: string =
  '532310046514-217fr842olbptie78ubtgi4mkq84ljo8.apps.googleusercontent.com';
// const GOOGLE_ANDROID_CLIENT_ID: string = '532310046514-9c13pu3kgf7sqo1latjgrodclq1kl2m9.apps.googleusercontent.com ';
import SQLite from 'react-native-sqlite-storage';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  // androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  scopes: ['profile', 'email'],
});

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

const GoogleLogin = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};

const LoginPage = ({route}) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isFingerPrintEnable, setFingerPrintEnable] = useState(false);

  // Get the email from route parameters
  const userNewEmail = route?.params?.email || null;

  const handleLogin2 = () => {
    navigation.navigate('ForgetPasswordPage');
  };

  // const handleGoogleLogin = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await GoogleLogin();  // Perform Google login using GoogleSignin
  //       const { idToken } = response;

  //       if (idToken) {
  //         // Send the ID token to your backend
  //         const backendResponse = await axios.post(`${API_URL}/google-signin`, {
  //           token: idToken,
  //         });

  //         // Extract token and user info from the backend response
  //         const { token, user } = backendResponse.data;

  //         // Store the JWT token (optional, you can use SecureStore or AsyncStorage)
  //         // SecureStore.setItemAsync('token', token);

  //         console.log('Login successful', user);
  //         navigation.navigate('Welcome');
  //       }
  //     } catch (error) {
  //       console.error('Error during Google Sign-In', error);
  //       setError('Google Sign-In failed.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // Open the SQLite database
  const db = SQLite.openDatabase(
    {name: 'user_db.db', location: 'default'},
    () => {
      console.log('Database opened successfully');
    },
    error => {
      console.error('Error opening database: ', error);
    },
  );

  useEffect(() => {
    createFailedSubmissionsTable();
    createTable();
    createTableLoginData();
    showData();
  }, []);

  const createFailedSubmissionsTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS failed_submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          formData TEXT
        )`,
        [],
        () => {
          console.log('Failed submissions table created successfully.');
        },
        error => {
          console.error('Error creating failed submissions table:', error);
        },
      );
    });
  };

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          email TEXT, 
          password TEXT, 
          pin INTEGER, 
          isGoogleLogin INTEGER CHECK(isGoogleLogin IN (0, 1)),
          emailConfirm INTEGER CHECK(emailConfirm IN (0, 1)), -- 0 for no, 1 for yes
          userConfirm INTEGER CHECK(userConfirm IN (0, 1)), -- 0 for no, 1 for yes
          policyConfirm INTEGER CHECK(policyConfirm IN (0, 1)), -- 0 for no, 1 for yes
          name TEXT, 
          area TEXT, 
          fingerPrint INTEGER CHECK(fingerPrint IN (0, 1)), -- 0 for no, 1 for yes
          userImageUrl TEXT
        )`,
        [],
        () => {
          console.log('User Table created successfully ');
        },
        error => {
          console.log('Error creating table: ' + error.message);
        },
      );
    });
  };

  const createTableLoginData = () => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS LoginData (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          email TEXT NOT NULL,
          name TEXT
        )`,
        [],
        () => {
          console.log('Table email created successfully');
        },
        error => {
          console.log('Error creating table: ' + error.message);
        },
      );
    });
  };

  const showData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT email FROM Users',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            console.log('Results: C ', results.rows.item(0)); // This should give you an array of the rows
          } else {
            console.log('No data found.');
          }
        },
        error => {
          console.log('Error retrieving data: ', error);
        },
      );
    });
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Initiate Google Sign-In
      const userInfo = await GoogleSignin.signIn();

      // Log the full userInfo object to inspect its structure
      console.log('User Info:', JSON.stringify(userInfo, null, 2));

      // Access user data from the response
      if (userInfo && userInfo.data && userInfo.data.user) {
        const {email, name, photo} = userInfo.data.user;
        console.log('Google Login:', email, name);
        handleSignUp(email, name, photo);
      } else {
        console.error('User object is undefined or invalid');
      }
    } catch (error) {
      console.error('Google Sign-In failed', error);
      setError('Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  //google signing detail registeration
  const handleSignUp = (email, name, photo) => {
    const userData = {
      email,
      name,
      photo,
    };
    axios
      .post(`${API_URL}/google-register`, userData)
      .then(res => {
        setLoading(false);
        console.log('status ', res.data.status);
        if (res.data.status === 'ok') {
          console.log('A');
          // Save the user info to SQLite or any other storage
          saveGoogleUserToSQLite(email, name, photo);
          Alert.alert('Success', 'Registered in successfully');
        } else if (res.data.status === 'google') {
          console.log('D');
          // Alert.alert('Success', 'Already Registered user');
          saveLastUserToSQLite(email, name, photo);
        } else if (res.data.status === 'notgoogle') {
          console.log('E');
          Alert.alert('Success', 'User Registered method Error');
        } else {
          console.log('X');
          // Alert.alert('Error', res.data.data);
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
        Alert.alert('Error', 'Error registering user. Please try again.');
      });
  };

  //   google login Save data in SQLite
  const saveGoogleUserToSQLite = (email, name, photo) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Users',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            tx.executeSql(
              `INSERT INTO Users (email, password, pin, isGoogleLogin, emailConfirm, userConfirm, policyConfirm, name, area, fingerPrint, userImageUrl) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [email, null, 0, 1, 1, 0, 0, name, null, 0, photo],
              () => {
                console.log('AC 1', name);
                irnudildb(email, name);
              },
              error => {
                console.log('Error saving user to SQLite: ' + error.message);
              },
            );
          } else {
            // If no row exists, insert a new one
            tx.executeSql(
              `INSERT INTO Users (email, password, pin, isGoogleLogin, emailConfirm, userConfirm, policyConfirm, name, area, fingerPrint, userImageUrl) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [email, null, 0, 1, 1, 0, 0, name, null, 0, photo],
              () => {
                console.log('AB 1', name );
                irnundildb(email, name);
              },
              error => {
                console.log('Error saving user to SQLite: ' + error.message);
              },
            );
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  };

  // Save data in SQLite
  const saveLastUserToSQLite = (email, name, photo) => {
    console.log('DF');
    db.transaction(tx => {
      tx.executeSql(
        'SELECT email FROM LoginData',
        [],
        (tx, results) => {
          console.log('result A', results.rows.item(0));
          console.log('Number of rows: ', results.rows.length);
          if (results.rows.length > 0) {
            const emailLocal = results.rows.item(0).email;
            console.log('emailLocal ', emailLocal, email);
            if (email === emailLocal) {
              // console.log('DFHJ');
              // Alert.alert('Success', 'Logged in successfully');
              // navigation.navigate('Welcome', {email});
              handleLocalAdminApproved(email, name);
            } else {
              // If no row exists, insert a new one
              tx.executeSql(
                `INSERT INTO Users (email, password, pin, isGoogleLogin, emailConfirm, userConfirm, policyConfirm, name, area, fingerPrint, userImageUrl) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [email, null, 0, 1, 1, 0, 0, name, null, 0, photo],
                () => {
                  console.log('DFHI 1');
                  // navigation.navigate('SetPin', {email, name});
                  ruuldildb(email, name);
                },
                error => {
                  console.log('Error saving user to SQLite: ' + error.message);
                },
              );
            }
          } else {
            // If no row exists, insert a new one
            tx.executeSql(
              `INSERT INTO Users (email, password, pin, isGoogleLogin, emailConfirm, userConfirm, policyConfirm, name, area, fingerPrint, userImageUrl) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [email, null, 0, 1, 1, 0, 0, name, null, 0, photo],
              () => {
                console.log('DFG 1');
                irnundildb(email, name);
              },
              error => {
                console.log('Error saving user to SQLite: ' + error.message);
              },
            );
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  };

  const handleLogin = () => {
    if (!validateFields()) {
      return;
    }

    const userData = {
      email: email,
      password: password,
    };

    db.transaction(tx => {
      tx.executeSql(
        'SELECT email FROM Users where email=?',
        [email],
        (tx, results) => {
          if (results.rows.length > 0) {
            console.log('B');
            checkLocalStoredData();
          } else {
            // check if user already registered, but email not confirmed and there are no any data in sqlite
            console.log('A');
            axios
              .post(`${API_URL}/login`, userData)
              .then(res => {
                console.log('Response:', res.data);
                if (res.data.status === 'ok') {
                  console.log('H');
                  // Save user to SQLite after backend success
                  saveUserToSQLiteLogin(email, password);
                } else if (res.data.status === 'google') {
                  console.log('E');
                  Alert.alert('Error', 'The registration method is invalid');
                } else if (res.data.status === 'notConfirmed') {
                  console.log('G');
                  handleSendCode();
                  Alert.alert('Error', 'Please Confirm Email First!');
                } else if (res.data.status === 'notApproved') {
                  console.log('H');
                  handleApproved();
                  Alert.alert('Error', 'Wait for Admin Approval!');
                } else {
                  console.log('C');
                  Alert.alert('Error', res.data.data);
                }
              })
              .catch(error => {
                console.error('Error:', error);
                Alert.alert('Failed', 'Please Sign Up First');
              });
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  };

  const handleLoginCitizen = () => {
    navigation.navigate('CitizenForm');
     
    }


  const handleApproved = () => {
    if (!email) {
      Alert.alert('Error', 'Email is required.');
      return;
    }
    console.log('email is: ', email);

    navigation.navigate('GetAdminApprove', {email, name}); // Need to Change Name
  };

  const verifyLoginMethod = (email, userData) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT isGoogleLogin FROM Users WHERE email = ?',
        [email],
        (tx, results) => {
          if (results.rows.length > 0) {
            const isGoogleLogin = results.rows.item(0).isGoogleLogin;
            console.log('google status ', isGoogleLogin);
            if (isGoogleLogin === 0) {
              axios
                .post(`${API_URL}/login`, userData)
                .then(res => {
                  console.log('Response:', res.data);
                  if (res.data.status === 'ok') {
                    Alert.alert('Success', 'Logged in successfully');
                    navigation.navigate('Welcome', {email});
                  } else {
                    Alert.alert('Error', res.data.data);
                  }
                })
                .catch(error => {
                  console.error('Error:', error);
                  Alert.alert(
                    'Error',
                    'Please enter correct Username or Password!',
                  );
                });
            } else {
              Alert.alert('Error', 'The registration method is invalid');
              // navigation.navigate('VerifyEmail', {email});
            }
          } else {
            console.error('Error:', error);
            Alert.alert('Failed', 'Please Sign Up First');
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  };

  // Get the email from route parameters
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

      // Navigate to the ConfirmEmail screen and pass the code
      navigation.navigate('VerifyEmail', {email, confirmationCode});
    } catch (err) {
      setError('Failed to send confirmation email.');
    }
  };

  // Save data in SQLite
  const saveUserToSQLiteLogin = (email, password) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO Users (email, password, pin, isGoogleLogin, emailConfirm, userConfirm, policyConfirm, name, area, fingerPrint, userImageUrl) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [email, password, 0, 0, 0, 0, 0, 0, null, null, 0], // Default values: 0 for pin, emailConfirm, fingerPrint and null for name, area
        (tx, result) => {
          console.log('User saved to SQLite successfully');
          const name = 'null';
          irnundildb(email, name);
        },
        error => {
          console.log('Error saving user to SQLite: ' + error.message);
        },
      );
    });
  };

  // Retrieving the email
  const retrieveEmailSecurely = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const email = credentials.username;
        setUserEmail(email);
        retrieveFingerPrintStateSQLite(email);
        console.log('Retrieved email:', email);
        // console.log('Retrieved PIN:', pinPW);
        return {email};
      } else {
        console.log('No email found Keychain');
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve email securely', error);
    }
  };

  useEffect(() => {
    retrieveEmailSecurely(); // Call it when the Login page loads
  }, []);

  const validateFields = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password.');
      return false;
    }

    return true;
  };

  const handleDialPadPress = () => {
    if (userEmail || userNewEmail) {
      navigation.navigate('AddPin');
    } else {
      Alert.alert('Failed', 'Please Sign Up First');
    }
  };

  const handleSensorIconPress = () => {
    if (userEmail || userNewEmail) {
      if (isFingerPrintEnable) {
        handleBiometricAuth();
      } else {
        Alert.alert('Failed', 'Please Enable Finger Print First');
      }
    } else {
      Alert.alert('Failed', 'Please Sign Up First');
    }
  };

  const handleSignupPress = () => {
    navigation.navigate('RegisterPage');
  };

  useEffect(() => {
    GoogleSignin.signOut(); // Optional: Sign out to start fresh for testing
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      navigation.navigate('Welcome', {email});
      console.log(userInfo); // You can send this to your backend for verification
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Operation in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services not available or outdated
      } else {
        console.error(error);
      }
    }
  };

  const handleBiometricAuth = async () => {
    const rnBiometrics = new ReactNativeBiometrics();

    const checkBiometrics = async () => {
      try {
        const {available, biometryType} =
          await rnBiometrics.isSensorAvailable();
        if (available) {
          if (biometryType === 'TouchID' || biometryType === 'Biometrics') {
            const {success} = await rnBiometrics.simplePrompt({
              promptMessage: 'Confirm fingerprint',
            });

            if (success) {
              navigation.navigate('Welcome', {email});
            } else {
              Alert.alert('Authentication failed', 'Please try again.');
            }
          } else {
            Alert.alert(
              'Biometric authentication not supported on this device.',
            );
          }
        } else {
          Alert.alert('Biometric sensor not available on this device.');
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

    checkBiometrics();
  };

  // Function to retrieve email from SQLite
  const retrieveFingerPrintStateSQLite = userSetEmail => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT fingerPrint FROM Users WHERE email=?', // Select the latest entry
        [userSetEmail],
        (tx, results) => {
          if (results.rows.length > 0) {
            const fingerPrint = results.rows.item(0).fingerPrint;
            if (fingerPrint === 0) {
              setFingerPrintEnable(false);
            } else if (fingerPrint === 1) {
              setFingerPrintEnable(true);
            }
          } else {
            console.log('No user found in SQLite');
          }
        },
        error => {
          console.log('Error retrieving user from SQLite: ' + error.message);
        },
      );
    });
  };

  const checkLocalStoredData = () => {
    const userData = {
      email: email,
      password: password,
    };

    db.transaction(tx => {
      tx.executeSql(
        'SELECT emailConfirm, userConfirm FROM Users WHERE email = ?',
        [email],
        (tx, results) => {
          if (results.rows.length > 0) {
            console.log('R');
            const emailConfirm = results.rows.item(0).emailConfirm;
            const userConfirm = results.rows.item(1).userConfirm;
            console.log(emailConfirm, userConfirm);
            if (emailConfirm === 1 && userConfirm === 1) {
              verifyLoginMethod(email, userData);
            } else if (emailConfirm === 1 && userConfirm === 0) {
              navigation.navigate('GetAdminApprove', {email, name}); // Need to Change Name

            } else {
              // Navigate to ConfirmEmail page if email is not confirmed
              handleSendCode();
              Alert.alert('Error', 'Please Confirm Email First!');
              // navigation.navigate('VerifyEmail', {email});
            }
          } else {
            // check if user already registered, but email not confirmed and there are no any data in sqlite
            console.log('Q');
            axios
              .post(`${API_URL}/login`, userData)
              .then(res => {
                console.log('Response:', res.data);
                if (res.data.status === 'ok') {
                  console.log('H');
                  // Save user to SQLite after backend success
                  saveUserToSQLiteLogin(email, password);
                } else if (res.data.status === 'google') {
                  console.log('M');
                  Alert.alert('Error', 'The registration method is invalid');
                } else if (res.data.status === 'notConfirmed') {
                  console.log('P');
                  handleSendCode();
                  Alert.alert('Error', 'Please Confirm Email First!');
                } else {
                  console.log('L');
                  Alert.alert('Error', res.data.data);
                }
              })
              .catch(error => {
                console.error('Error:', error);
                Alert.alert('Failed', 'Please Sign Up First');
              });
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  };

  const handleLocalAdminApproved = (email, name) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT userConfirm FROM Users WHERE email = ?',
        [email],
        (tx, results) => {
          if (results.rows.length > 0) {
            console.log('R');
            const userConfirm = results.rows.item(0).userConfirm;
            console.log(userConfirm);
            if (userConfirm === 1) {
              console.log('DFHJ');
              Alert.alert('Success', 'Logged in successfully');
              navigation.navigate('Welcome', {email});
            } else {
              navigation.navigate('GetAdminApprove', {email, name}); 
            }
          } else {
            console.log('error to getting data from Users db ', results);
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  }

  // Insert Register New User data in Local Data Base
  const irnudildb = (email, name) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE LoginData SET email = ? WHERE id=1`,
        [email],
        (tx, result) => {
          console.log('AC 2', name);
          navigation.navigate('PrivacyPolicy', {email, name});
        },
        error => {
          console.log('Error saving user to SQLite: ' + error.message);
        },
      );
    });
  };

  // Insert Register New User No data in Local Data Base
  const irnundildb = (email, name) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `INSERT INTO LoginData (email, name) VALUES (?, ?)`,
          [email, name],
          (tx, result) => {
            console.log('AB 2');
            console.log('result ', result);
            navigation.navigate('PrivacyPolicy', {email, name});
          },
          error => {
            console.log('Error saving user to SQLite: ' + error.message);
          },
        );
      },
      error => {
        console.log('Transaction error: ', error);
      },
      () => {
        console.log('Transaction committed');
      },
    );
  };

  // Registered user Update Login data in local DB
  const ruuldildb = (email, name) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE LoginData SET email = ? WHERE id=1`,
        [email],
        (tx, result) => {
          console.log('DFHI 2');
          navigation.navigate('Welcome', {email});
        },
        error => {
          console.log('Error saving user to SQLite: ' + error.message);
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
            Login
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
          />
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
          />

          <TouchableOpacity onPress={handleLogin2}>
            <Text
              style={[
                styles.forgotPasswordText,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={handleLogin}
            style={[styles.button_signup, {borderRadius: 8}]}
            buttonColor="#516E9E"
            textColor="white"
            labelStyle={styles.button_label}>
            Login
          </Button>

          <Button
            mode="contained"
            onPress={handleLoginCitizen}
            style={[styles.button_signup, {borderRadius: 8}]}
            buttonColor="#516E9E"
            textColor="white"
            labelStyle={styles.button_label}>
            Login As a Citizen
          </Button>

          <View style={styles.orContainer}>
            <View style={styles.horizontalLine} />
            <Text
              style={[
                styles.sub_text_D,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              or continue with
            </Text>
            <View style={styles.horizontalLine} />
          </View>

          <Button
            mode="contained"
            onPress={handleGoogleLogin}
            style={[styles.button_google, {borderRadius: 8}]}
            buttonColor="white"
            textColor="black"
            labelStyle={styles.button_label}>
            <View style={styles.googleButtonContent}>
              <Image
                source={require('../../assets/image/google.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Google</Text>
            </View>
          </Button>

          <View style={styles.iconContainer}>
            <View style={styles.finger_icon}>
              <TouchableOpacity onPress={handleSensorIconPress}>
                <Icon source="fingerprint" color="white" size={50} />
              </TouchableOpacity>
            </View>
            <View style={styles.dialpad_icon}>
              <TouchableOpacity onPress={handleDialPadPress}>
                <Icon source="dialpad" color="white" size={50} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottom_container}>
            <Text
              style={[
                styles.sub_text_A,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              If you don't have any account?
            </Text>

            <Button
              mode="text"
              onPress={() => handleSignupPress()}
              theme={{colors: {primary: 'green'}}}>
              <Text
                style={[
                  styles.sub_text_B,
                  {color: isDarkMode ? 'white' : 'black'},
                ]}>
                Signup
              </Text>
            </Button>
          </View>
          <View style={styles.lower_container}>
            <Text style={styles.sub_text_below}>
              By clicking continue, you agree to our{' '}
              <Text style={styles.boldText}>
                Terms of Service and Privacy Policy
              </Text>
            </Text>
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
    height: 560,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 80,
  },
  forgotPasswordText: {
    color: 'black',
    textDecorationLine: 'underline',
    fontSize: 16,
    marginTop: 10,
    marginLeft: 240,
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
});

export default LoginPage;
