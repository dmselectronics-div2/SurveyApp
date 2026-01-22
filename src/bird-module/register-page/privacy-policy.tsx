import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Appearance,
  Alert,
} from 'react-native';
import {Button, Checkbox} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import axios from 'axios';
import { API_URL } from '../../config';

const PrivacyPolicy = ({navigation, route}) => {
  // const navigation = useNavigation();
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleAgree = () => {
    if (!checked) {
      updateDisAgreePolicyAgreeInSQLite(email);
      Alert.alert(
        'Privacy Policy Required',
        'You must agree to our Privacy Policy to use this app.',
      );
      return;
    } else if (checked) {
      console.log('email is: ', email, ' Name is: ', gName);
      updatePolicyAgreeInSQLite(email, gName);
      // navigation.navigate('SetPin', {email, gName});
    } else {
      Alert.alert('Error');
    }
  };

  const updatePolicyAgreeInSQLite = (email, name) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Users SET policyConfirm = ? WHERE email = ?',
        [1, email], // Update fingerprint status (1 for enabled, 0 for disabled)
        (tx, result) => {
          console.log('Policy Confirmation status updated in SQLite');
          handleVerifyUserApproved(email, name);
        },
        error => {
          console.error(
            'Error updating Policy Confirmation status:',
            error.message,
          );
        },
      );
    });
  };

  const updateDisAgreePolicyAgreeInSQLite = (email) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Users SET policyConfirm = ? WHERE email = ?',
        [0, email], // Update fingerprint status (1 for enabled, 0 for disabled)
        (tx, result) => {
          console.log('Policy Confirmation status updated as not agree in SQLite');
        },
        error => {
          console.error(
            'Error updating Policy Confirmation status:',
            error.message,
          );
        },
      );
    });
  };

  const handleVerifyUserApproved = (email, name) => {
   
    if (!email) {
      Alert.alert('Error', 'Email is required.');
      return;
    }
    console.log('email is: ', email, ' Name is: ', name);

    axios
      .get(`${API_URL}/get-user-validation?email=${encodeURIComponent(email)}`)
      .then(res => {
       
        const { status } = res.data;
  
        if (status === 'ok') {
          console.log(email, ' is verified by admin! ');
          console.log('email is: ', email, ' Name is: ', name);
          //Alert.alert('Verified', 'Congratulations! The admin has approved your account.');
          handleApprovedStatus(email, name);          
        } else if (status === 'no') {
          navigation.navigate('GetAdminApprove', {email, name});
          //console.log(status, 'Pending Approval', 'Please wait. Our admin will review your request and notify you via email.');
          //Alert.alert('Pending Approval', 'Please wait. Our admin will review your request and notify you via email.');
        }else {
          console.error('Error during admin Approval:', status);
        Alert.alert('Error', 'Error Approving user');
        }
      })
      .catch(error => {
        console.error('Error during admin Approval:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Error Approving user');
     });
  };

  const handleApprovedStatus = (email, name) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE Users SET userConfirm = ? WHERE email = ?`,
        [1 , email],
        (tx, result) => {
          console.log('saved approved status');
          navigation.navigate('SetPin', {email, name});
        },
        error => {
          console.log('Error saving user to SQLite: ' + error.message);
        },
      );
    });
  }

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
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            backgroundColor: isDarkMode
              ? 'rgba(17, 17, 17, 0.8)'
              : 'rgba(217, 217, 217, 0.7)',
          },
        ]}>
        <Text style={[styles.title, {color: isDarkMode ? 'white' : 'black'}]}>
          Privacy Policy
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkMode ? 'white' : 'black'},
          ]}>
          1. Introduction
        </Text>
        <Text
          style={[styles.sectionText, {color: isDarkMode ? 'white' : 'black'}]}>
          Welcome to mangrove application. Your privacy is critically important
          to us.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkMode ? 'white' : 'black'},
          ]}>
          2. Information We Collect
        </Text>
        <Text
          style={[styles.sectionText, {color: isDarkMode ? 'white' : 'black'}]}>
          We collect personal information that you provide to us, such as your
          name, email address, and other data you input into the app.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkMode ? 'white' : 'black'},
          ]}>
          3. How We Use Your Information
        </Text>
        <Text
          style={[styles.sectionText, {color: isDarkMode ? 'white' : 'black'}]}>
          We use your information to provide, operate, and maintain our
          services, as well as to improve our offerings.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkMode ? 'white' : 'black'},
          ]}>
          4. Sharing Your Information
        </Text>
        <Text
          style={[styles.sectionText, {color: isDarkMode ? 'white' : 'black'}]}>
          We do not share your personal information with third parties except as
          necessary to provide our services or as required by law.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkMode ? 'white' : 'black'},
          ]}>
          5. Data Security
        </Text>
        <Text
          style={[styles.sectionText, {color: isDarkMode ? 'white' : 'black'}]}>
          We implement security measures to protect your data, but no method of
          transmission over the internet is 100% secure.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkMode ? 'white' : 'black'},
          ]}>
          6. Your Rights
        </Text>
        <Text
          style={[styles.sectionText, {color: isDarkMode ? 'white' : 'black'}]}>
          You have the right to access, update, or delete your personal
          information. Contact us if you wish to exercise these rights.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkMode ? 'white' : 'black'},
          ]}>
          7. Changes to This Policy
        </Text>
        <Text
          style={[styles.sectionText, {color: isDarkMode ? 'white' : 'black'}]}>
          We may update this Privacy Policy from time to time. Any changes will
          be communicated via the app or our website.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkMode ? 'white' : 'black'},
          ]}>
          8. Contact Us
        </Text>
        <Text
          style={[styles.sectionText, {color: isDarkMode ? 'white' : 'black'}]}>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at dmselectronics.division02@gmail.com
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
            }}
          />
          <Text
            style={[styles.agreeText, {color: isDarkMode ? 'white' : 'black'}]}>
            I have read and agree to the Privacy Policy
          </Text>
        </View>
        <Button
          mode="contained"
          style={styles.agreeButton}
          onPress={handleAgree}
          buttonColor="#516E9E"
          textColor="white"
          labelStyle={styles.button_label}>
          Next
        </Button>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
    backgroundColor: 'rgba(173, 170, 177, 0.8)',
    margin: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#444',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    color: '#555',
  },
  agreeText: {
    fontSize: 16,
    lineHeight: 24,
    // marginBottom: 15,
    color: '#555',
    fontStyle: 'italic',
  },
  agreeButton: {
    marginTop: 20,
    alignSelf: 'center',
    // backgroundColor: 'blue',
    marginBottom: 20,
  },
  button_label: {
    fontSize: 18,
  },
});

export default PrivacyPolicy;
