import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Appearance,
  Alert,
  Platform,
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
  const fromCitizen = route?.params?.fromCitizen || false;

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
      if (!fromCitizen) {
        updateDisAgreePolicyAgreeInSQLite(email);
      }
      Alert.alert(
        'Privacy Policy Required',
        'You must agree to our Privacy Policy to use this app.',
      );
      return;
    } else if (checked) {
      if (fromCitizen) {
        navigation.navigate('WelcomeSinhala');
      } else {
        console.log('email is: ', email, ' Name is: ', gName);
        updatePolicyAgreeInSQLite(email, gName);
      }
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
    <View style={styles.backgroundContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>
            Privacy Policy
          </Text>

          <Text style={styles.sectionTitle}>
            1. Introduction
          </Text>
          <Text style={styles.sectionText}>
            Welcome to mangrove application. Your privacy is critically important
            to us.
          </Text>

          <Text style={styles.sectionTitle}>
            2. Information We Collect
          </Text>
          <Text style={styles.sectionText}>
            We collect personal information that you provide to us, such as your
            name, email address, and other data you input into the app.
          </Text>

          <Text style={styles.sectionTitle}>
            3. How We Use Your Information
          </Text>
          <Text style={styles.sectionText}>
            We use your information to provide, operate, and maintain our
            services, as well as to improve our offerings.
          </Text>

          <Text style={styles.sectionTitle}>
            4. Sharing Your Information
          </Text>
          <Text style={styles.sectionText}>
            We do not share your personal information with third parties except as
            necessary to provide our services or as required by law.
          </Text>

          <Text style={styles.sectionTitle}>
            5. Data Security
          </Text>
          <Text style={styles.sectionText}>
            We implement security measures to protect your data, but no method of
            transmission over the internet is 100% secure.
          </Text>

          <Text style={styles.sectionTitle}>
            6. Your Rights
          </Text>
          <Text style={styles.sectionText}>
            You have the right to access, update, or delete your personal
            information. Contact us if you wish to exercise these rights.
          </Text>

          <Text style={styles.sectionTitle}>
            7. Changes to This Policy
          </Text>
          <Text style={styles.sectionText}>
            We may update this Privacy Policy from time to time. Any changes will
            be communicated via the app or our website.
          </Text>

          <Text style={styles.sectionTitle}>
            8. Contact Us
          </Text>
          <Text style={styles.sectionText}>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at dmselectronics.division02@gmail.com
          </Text>

          <View style={styles.checkboxRow}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
              color="#4A7856"
              uncheckedColor="#4A7856"
            />
            <View style={{flex: 1}}>
              <Text style={styles.agreeText}>
                I have read and accept the Privacy Policy
              </Text>
              <Text style={styles.agreeSubText}>
                You must accept the Privacy Policy to continue.
              </Text>
            </View>
          </View>

          <Button
            mode="contained"
            style={styles.agreeButton}
            onPress={handleAgree}
            buttonColor="#4A7856"
            textColor="white"
            labelStyle={styles.button_label}>
            Submit
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#7A8B6F',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333333',
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
    color: '#555555',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  agreeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  agreeSubText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  agreeButton: {
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 10,
  },
  button_label: {
    fontSize: 16,
  },
});

export default PrivacyPolicy;
