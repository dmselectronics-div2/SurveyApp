import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
  Appearance,
} from 'react-native';
import {Button, List, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import axios from 'axios';
import {API_URL} from '../../config';

const theme = {
  colors: {
    primary: '#56FF64',
    text: 'red',
    placeholder: 'white',
    surface: 'rgba(217, 217, 217, 0.7)',
  },
};

const GetAdminApprove = ({navigation, route}) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [displayMessage, setDisplayMessage] = useState('');
  const [displayTitle, setDisplayTitle] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Get the email from route parameters
  const email = route?.params?.email || null;
  const gName = route?.params?.name || null;

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (checkingStatus) {
        handleVerifyUserApproved();
      }
    }, 1000); // API check every second

    return () => clearInterval(interval);
  }, [checkingStatus]);

  const handleVerifyUserApproved = () => {
    if (!email) {
      Alert.alert('Error', 'Email is required.');
      return;
    }
    console.log('email is admin approve : ', email, ' Name is: ', gName);

    axios
      .get(`${API_URL}/get-user-validation?email=${encodeURIComponent(email)}`)
      .then(res => {
        const {status} = res.data;

        if (status === 'ok') {
          setCheckingStatus(false);
          console.log(email, ' is verified by admin! ');
          console.log('email is: ', email, ' Name is: ', gName);
          setDisplayMessage(
            'Congratulations! The admin has approved your account.',
          );
          setDisplayTitle('Approved');
          //   Alert.alert('Verified', 'Congratulations! The admin has approved your account.');
          handleApprovedStatus(email, gName);
        } else if (status === 'no') {
          //navigation.navigate('GetAdminApprove', {email, gName});
          console.log(
            status,
            'Pending Approval',
            'Please wait. Our admin will review your request and notify you via email.',
          );
          //Alert.alert('Pending Approval', 'Please wait. Our admin will review your request and notify you via email.');
          setDisplayTitle('Pending Approval');
          setDisplayMessage(
            'Please wait. Our admin will review your request and notify you via email.',
          );
        } else {
          console.error('Error during admin Approval:', status);
          Alert.alert('Error', 'Error Approving user');
        }
      })
      .catch(error => {
        console.error(
          'Error during admin Approval:',
          error.response ? error.response.data : error.message,
        );
        Alert.alert('Error', 'Error Approving user');
      });
  };

  const handleApprovedStatus = (email, name) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE Users SET userConfirm = ? WHERE email = ?`,
        [1, email],
        (tx, result) => {
          console.log('saved approved status', email, name);

          // Keep screen for 3 seconds before navigating
          setTimeout(() => {
            navigation.navigate('SetPin', {email, name});
          }, 3000);
        },
        error => {
          console.log('Error saving user to SQLite: ' + error.message);
        },
      );
    });
  };

  const handleSignUp = () => {};

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
      <ScrollView style={styles.title_container}>
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
            {displayTitle}
          </Text>

          <Text
            style={[
              styles.sectionText,
              {color: isDarkMode ? 'white' : 'black'},
            ]}>
            {displayMessage}
          </Text>
          {/* 
          <Button
            mode="contained"
            onPress={handleSignUp}
            style={[styles.button_signup, {borderRadius: 8}]}
            buttonColor="#516E9E"
            textColor="white"
            labelStyle={styles.button_label}>
            Set Name
          </Button> */}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Your existing styles here
  container: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '55%',
    height: 102,
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
    textAlign: 'center',
  },
  sub_text: {
    fontSize: 18,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 20,
    lineHeight: 24,
    // marginBottom: 15,
    marginTop: 25,
    margin: 15,
    color: '#555',
    textAlign: 'center',
  },
  sub_text_bold: {
    fontSize: 18,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text_container: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 142,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: '40%',
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
    marginTop: 50,
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
  center_list: {
    marginTop: 40,
    width: '90%',
  },
  list_menu: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    maxHeight: 210,
  },
});

export default GetAdminApprove;
