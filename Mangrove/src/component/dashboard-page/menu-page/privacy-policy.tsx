import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground
} from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  const handleAgree = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      style={styles.backgroundImage}
      // source={require('../../../assets/image/imageB.jpg')} // Replace with your own background image
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.sectionText}>
          Welcome to mangrove application. Your privacy is critically important to us.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.sectionText}>
          We collect personal information that you provide to us, such as your name, email address, and other data you input into the app.
        </Text>

        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        <Text style={styles.sectionText}>
          We use your information to provide, operate, and maintain our services, as well as to improve our offerings.
        </Text>

        <Text style={styles.sectionTitle}>4. Sharing Your Information</Text>
        <Text style={styles.sectionText}>
          We do not share your personal information with third parties except as necessary to provide our services or as required by law.
        </Text>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.sectionText}>
          We implement security measures to protect your data, but no method of transmission over the internet is 100% secure.
        </Text>

        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        <Text style={styles.sectionText}>
          You have the right to access, update, or delete your personal information. Contact us if you wish to exercise these rights.
        </Text>

        <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
        <Text style={styles.sectionText}>
          We may update this Privacy Policy from time to time. Any changes will be communicated via the app or our website.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact Us</Text>
        <Text style={styles.sectionText}>
          If you have any questions or concerns about this Privacy Policy, please contact us at dmselectronics.division02@gmail.com

        </Text>

        <Button
          mode="contained"
          style={styles.agreeButton}
          onPress={handleAgree}
        >
          Agree and Continue
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
  agreeButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: 'blue',
    marginBottom: 20,
  },
});

export default PrivacyPolicy;
