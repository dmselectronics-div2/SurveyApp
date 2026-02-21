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
          <Text style={styles.appName}>Blue Tally</Text>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.metaText}>Last Updated: January 27, 2025{'\n'}Version 2.0</Text>

          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.sectionText}>
            This Privacy Policy describes how the Blue Tally mobile application ("Blue Tally," "we," "us," or "our") collects, uses, stores, and protects your information. We are committed to safeguarding your privacy and ensuring full transparency about how your data is handled.{'\n\n'}
            By downloading or using Blue Tally, you acknowledge that you have read and understood this Privacy Policy and agree to its terms. If you do not agree, please discontinue use of the App.
          </Text>

          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.subSectionTitle}>2.1 Scientific & Environmental Data</Text>
          <Text style={styles.sectionText}>
            Blue Tally processes the following field observation records:{'\n'}
            {'•'} Soil and water measurement data{'\n'}
            {'•'} Bird species observations, counts, and behavioural notes{'\n'}
            {'•'} Bivalve species data and physical measurements{'\n'}
            {'•'} GPS coordinates from specimen observations and sampling points{'\n'}
            {'•'} Date and precise timestamps for all recorded observations{'\n'}
            {'•'} Photographic documentation of specimens and habitat (where provided)
          </Text>
          <Text style={styles.subSectionTitle}>2.2 Authentication & User Information</Text>
          <Text style={styles.sectionText}>
            To provide secure access to the App, we collect:{'\n'}
            {'•'} Email address and time-limited verification codes{'\n'}
            {'•'} Google account information, if you choose Google Sign-In{'\n'}
            {'•'} Biometric data (fingerprint) — processed exclusively on your device; never transmitted to our servers{'\n'}
            {'•'} Device information: model, manufacturer, and operating system version{'\n'}
            {'•'} GPS data collected only during active observation recording sessions
          </Text>
          <Text style={styles.subSectionTitle}>2.3 Usage & Diagnostic Data</Text>
          <Text style={styles.sectionText}>
            We may collect limited, anonymized technical data to maintain App stability:{'\n'}
            {'•'} Crash logs and error reports{'\n'}
            {'•'} Feature usage statistics (aggregated and anonymized){'\n'}
            {'•'} App version and session duration{'\n'}
            This data is never linked to your personal identity.
          </Text>

          <Text style={styles.sectionTitle}>3. Authentication</Text>
          <Text style={styles.subSectionTitle}>3.1 Authentication Methods</Text>
          <Text style={styles.sectionText}>
            Blue Tally supports the following secure sign-in options:{'\n'}
            {'•'} Email authentication using time-sensitive one-time codes{'\n'}
            {'•'} Google Sign-In via OAuth 2.0{'\n'}
            {'•'} Device fingerprint authentication using your device's built-in secure enclave
          </Text>
          <Text style={styles.subSectionTitle}>3.2 Authentication Data Processing</Text>
          <Text style={styles.sectionText}>
            {'•'} Email verification codes expire immediately after use and are permanently deleted from our systems.{'\n'}
            {'•'} Google Sign-In data is processed in strict accordance with Google's Privacy Policy (policies.google.com/privacy).{'\n'}
            {'•'} Fingerprint data is processed entirely within your device's secure hardware element and is never stored on or transmitted to our servers.{'\n'}
            {'•'} All authentication tokens are encrypted in transit using TLS 1.2 or higher.{'\n'}
            {'•'} Repeated failed login attempts trigger automatic account protection measures to prevent unauthorized access.
          </Text>

          <Text style={styles.sectionTitle}>4. How We Use Your Information</Text>
          <Text style={styles.subSectionTitle}>4.1 Scientific Data Usage</Text>
          <Text style={styles.sectionText}>
            {'•'} Compiling and maintaining ecosystem datasets for long-term analysis{'\n'}
            {'•'} Supporting biodiversity conservation research and scientific knowledge{'\n'}
            {'•'} Generating visualizations, trend reports, and ecological analytics{'\n'}
            {'•'} Sharing anonymized, de-identified data with verified research institutions and conservation organizations under data-sharing agreements
          </Text>
          <Text style={styles.subSectionTitle}>4.2 User Data Usage</Text>
          <Text style={styles.sectionText}>
            Personal data is used only to:{'\n'}
            {'•'} Authenticate and maintain your account securely{'\n'}
            {'•'} Provide technical support and resolve issues{'\n'}
            {'•'} Send essential App updates and service notifications{'\n'}
            {'•'} Maintain the operational functionality of the data collection features{'\n\n'}
            We do not use your personal data for advertising, profiling, or any automated decision-making that produces legal or significant effects on you.
          </Text>

          <Text style={styles.sectionTitle}>5. Data Storage & Security</Text>
          <Text style={styles.subSectionTitle}>5.1 Storage Infrastructure</Text>
          <Text style={styles.sectionText}>
            {'•'} All data is stored on encrypted servers using AES-256 encryption at rest.{'\n'}
            {'•'} Scientific data and personal information are maintained in logically separate, access-controlled storage environments.{'\n'}
            {'•'} Scientific data is subject to routine automated backups with integrity verification.{'\n'}
            {'•'} Servers are located in data centres that comply with ISO/IEC 27001 standards.
          </Text>
          <Text style={styles.subSectionTitle}>5.2 Transmission Security</Text>
          <Text style={styles.sectionText}>
            {'•'} All data transmitted between the App and our servers is protected using TLS 1.2 or higher.{'\n'}
            {'•'} Authentication tokens are cryptographically signed and rotated regularly.{'\n'}
            {'•'} API endpoints are protected against common attack vectors including injection, replay attacks, and brute-force attempts.
          </Text>
          <Text style={styles.subSectionTitle}>5.3 Access Controls</Text>
          <Text style={styles.sectionText}>
            {'•'} Access to personal data is restricted to authorized personnel on a strict need-to-know basis.{'\n'}
            {'•'} All internal access to production data is logged, monitored, and audited.{'\n'}
            {'•'} Administrative access requires multi-factor authentication.{'\n'}
            {'•'} Staff with access to personal data are bound by confidentiality obligations and receive regular data protection training.
          </Text>
          <Text style={styles.subSectionTitle}>5.4 Vulnerability Management</Text>
          <Text style={styles.sectionText}>
            {'•'} We conduct regular security assessments and penetration testing of our systems.{'\n'}
            {'•'} Security patches are applied promptly upon release.{'\n'}
            {'•'} A responsible disclosure process is in place for reporting potential vulnerabilities.
          </Text>

          <Text style={styles.sectionTitle}>6. Data Breach Notification</Text>
          <Text style={styles.subSectionTitle}>6.1 Detection & Response</Text>
          <Text style={styles.sectionText}>
            Blue Tally maintains an Incident Response Plan to detect, contain, and remediate data security incidents promptly. Upon discovery of a confirmed or suspected breach, we will:{'\n'}
            {'•'} Immediately activate our incident response procedures to contain and assess the breach{'\n'}
            {'•'} Conduct a rapid investigation to determine the nature, scope, and likely impact of the incident{'\n'}
            {'•'} Implement corrective measures to prevent further unauthorized access or disclosure
          </Text>
          <Text style={styles.subSectionTitle}>6.2 Regulatory Notification</Text>
          <Text style={styles.sectionText}>
            In the event of a personal data breach that poses a risk to individuals' rights and freedoms, we will notify the relevant supervisory authority within 72 hours of becoming aware of the breach, where feasible, and provide all required details.
          </Text>
          <Text style={styles.subSectionTitle}>6.3 User Notification</Text>
          <Text style={styles.sectionText}>
            Where a breach is likely to result in a high risk to your rights and freedoms, we will notify you directly without undue delay, including a clear description of the nature of the breach, the likely consequences, and the measures we are taking to address it. Notifications will be sent via email and, where appropriate, displayed as an in-App alert.
          </Text>

          <Text style={styles.sectionTitle}>7. Data Sharing & Disclosure</Text>
          <Text style={styles.sectionText}>
            {'•'} Anonymized and de-identified scientific data may be shared with accredited research institutions and conservation bodies under formal data-sharing agreements.{'\n'}
            {'•'} We do not sell, rent, or trade your personal data to any third party under any circumstances.{'\n'}
            {'•'} Data may be disclosed to comply with a legal obligation, court order, or lawful government request.{'\n'}
            {'•'} In the event of a merger, acquisition, or asset sale, users will be notified before personal data is transferred.{'\n'}
            {'•'} We may share data with carefully vetted service providers who are contractually bound to process data only on our instructions.
          </Text>

          <Text style={styles.sectionTitle}>8. Data Retention & Data Ownership</Text>
          <Text style={styles.subSectionTitle}>8.1 Data Ownership</Text>
          <Text style={styles.sectionText}>
            All scientific and environmental data collected through Blue Tally — including field observations, species records, measurements, location data, and associated media — is and remains the exclusive property of Blue Tally and its management team. By submitting data through the App, you acknowledge that such data is contributed to Blue Tally's ecosystem database and may be used for research, conservation, and analytical purposes at our discretion.{'\n\n'}
            This ownership applies regardless of whether your account remains active or is subsequently deleted.
          </Text>
          <Text style={styles.subSectionTitle}>8.2 Profile & Account Deletion</Text>
          <Text style={styles.sectionText}>
            You have the right to request deletion of your personal profile and account at any time. Upon a valid deletion request:{'\n'}
            {'•'} Your personal identifiers (name, email address, login credentials) will be permanently removed from our systems within 30 days.{'\n'}
            {'•'} Your account access will be revoked immediately upon confirmation.{'\n'}
            {'•'} All scientific and observational data you have contributed will be retained by Blue Tally in anonymized or de-identified form.{'\n\n'}
            To request account deletion, please contact us at Software.dmselectronics@gmail.com with the subject line "Account Deletion Request."
          </Text>
          <Text style={styles.subSectionTitle}>8.3 General Retention Periods</Text>
          <Text style={styles.sectionText}>
            {'•'} Scientific observation data is retained indefinitely to preserve long-term ecological research value.{'\n'}
            {'•'} Personal account data is retained for the duration of your active account and purged within 30 days of a confirmed deletion request.{'\n'}
            {'•'} Accounts with no login activity for 67 consecutive months will be archived with 30 days' notice by email.
          </Text>

          <Text style={styles.sectionTitle}>9. Your Rights</Text>
          <Text style={styles.subSectionTitle}>9.1 General Rights</Text>
          <Text style={styles.sectionText}>
            All Blue Tally users have the right to:{'\n'}
            {'•'} Access the personal data we hold about you{'\n'}
            {'•'} Correct any inaccurate or incomplete personal data{'\n'}
            {'•'} Request deletion of your personal profile and account (see Section 8.2){'\n'}
            {'•'} Export your personal account data in a portable, machine-readable format{'\n'}
            {'•'} Opt out of non-essential communications at any time{'\n\n'}
            Please note: the right to erasure applies to your personal identifiers and account information. Scientific and observational data is owned by Blue Tally and is not subject to personal erasure requests (see Section 8.1).
          </Text>
          <Text style={styles.subSectionTitle}>9.2 GDPR Rights (European Users)</Text>
          <Text style={styles.sectionText}>
            If you are located in the EEA, United Kingdom, or Switzerland, you have additional rights under GDPR:{'\n'}
            {'•'} Right to restriction of processing{'\n'}
            {'•'} Right to object to processing based on legitimate interests{'\n'}
            {'•'} Right not to be subject to solely automated decision-making{'\n'}
            {'•'} Right to lodge a complaint with your local Data Protection Authority{'\n\n'}
            Our legal bases for processing personal data under GDPR are: (a) your consent, (b) performance of a contract, (c) compliance with a legal obligation, and (d) our legitimate interests.
          </Text>
          <Text style={styles.subSectionTitle}>9.3 Exercising Your Rights</Text>
          <Text style={styles.sectionText}>
            To exercise any of the rights listed above, please contact us at Software.dmselectronics@gmail.com with the subject line "Data Rights Request." We will respond within 30 days.
          </Text>

          <Text style={styles.sectionTitle}>10. Children's Privacy</Text>
          <Text style={styles.sectionText}>
            Blue Tally is designed for users aged 13 and older. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided personal data without verifiable parental consent, we will delete that data promptly. Contact us at Software.dmselectronics@gmail.com if you believe a child under 13 has registered an account.
          </Text>

          <Text style={styles.sectionTitle}>11. Third-Party Services</Text>
          <Text style={styles.sectionText}>
            Blue Tally integrates with the following third-party services, each governed by its own privacy policy:{'\n'}
            {'•'} Google Sign-In — governed by Google's Privacy Policy (policies.google.com/privacy){'\n'}
            {'•'} Google Play Services — for App distribution and update delivery{'\n'}
            {'•'} Cloud infrastructure providers — bound by data processing agreements that meet GDPR standards
          </Text>

          <Text style={styles.sectionTitle}>12. International Data Transfers</Text>
          <Text style={styles.sectionText}>
            If you are accessing Blue Tally from outside the country where our servers are located, your data may be transferred internationally. Where data is transferred from the EEA to countries not recognized as providing an adequate level of data protection, we rely on appropriate safeguards such as Standard Contractual Clauses (SCCs) approved by the European Commission.
          </Text>

          <Text style={styles.sectionTitle}>13. Google Play Store Compliance</Text>
          <Text style={styles.sectionText}>
            Blue Tally fully complies with Google Play Developer Program Policies. Specifically:{'\n'}
            {'•'} We provide clear and accurate disclosure of all data collection and usage practices in this Privacy Policy.{'\n'}
            {'•'} We request only the device permissions necessary to deliver core App functionality.{'\n'}
            {'•'} Sensitive permissions (e.g., location, camera) are requested at runtime with a clear explanation of their purpose.{'\n'}
            {'•'} This Privacy Policy is accessible in-App and via the Google Play Store listing.
          </Text>

          <Text style={styles.sectionTitle}>14. Changes to This Policy</Text>
          <Text style={styles.sectionText}>
            We may update this Privacy Policy periodically. When material changes are made, we will notify you via email to your registered address, display a prominent in-App notification, and update the "Last Updated" date at the top of this document. Continued use of Blue Tally after the effective date of any changes constitutes acceptance of the revised Privacy Policy.
          </Text>

          <Text style={styles.sectionTitle}>15. Contact Information</Text>
          <Text style={styles.sectionText}>
            Blue Tally Data Privacy{'\n'}
            Email: Software.dmselectronics@gmail.com{'\n'}
            Subject line for data requests: "Data Rights Request"{'\n'}
            We aim to respond to all enquiries within 30 days.
          </Text>

          <Text style={styles.sectionTitle}>16. Consent</Text>
          <Text style={styles.sectionText}>
            By using Blue Tally, you confirm that you have read, understood, and agree to the collection and processing of your information as described in this Privacy Policy. You may withdraw your consent at any time by contacting us or deleting your account, without affecting the lawfulness of processing carried out prior to withdrawal.
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
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A7856',
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333333',
    textAlign: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
    color: '#333333',
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
    color: '#4A7856',
  },
  sectionText: {
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 8,
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
