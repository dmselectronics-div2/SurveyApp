import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../../config';
import SQLite from 'react-native-sqlite-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const GetAdminApprove = ({ navigation, route }: any) => {
  const [displayMessage, setDisplayMessage] = useState('Please wait. Our admin will review your request and notify you via email.');
  const [displayTitle, setDisplayTitle] = useState('Pending Approval');
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  const email = route?.params?.email || null;
  const gName = route?.params?.name || null;

  const db = SQLite.openDatabase(
    { name: 'user_db.db', location: 'default' },
    () => console.log('Database opened'),
    (err: any) => console.error('Database error: ', err),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (checkingStatus) handleVerifyUserApproved();
    }, 3000);
    return () => clearInterval(interval);
  }, [checkingStatus]);

  const handleVerifyUserApproved = () => {
    if (!email) return;

    axios
      .get(`${API_URL}/get-user-validation?email=${encodeURIComponent(email)}`)
      .then(res => {
        const { status } = res.data;
        if (status === 'ok') {
          setCheckingStatus(false);
          setIsApproved(true);
          setDisplayMessage('Congratulations! The admin has approved your account.');
          setDisplayTitle('Approved');
          handleApprovedStatus(email, gName);
        } else if (status === 'no') {
          setDisplayTitle('Pending Approval');
          setDisplayMessage('Please wait. Our admin will review your request and notify you via email.');
        }
      })
      .catch(error => {
        console.error('Error during admin Approval:', error.message);
      });
  };

  const handleApprovedStatus = (userEmail: string, userName: string) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE Users SET userConfirm = ? WHERE email = ?',
        [1, userEmail],
        () => {
          console.log('Approved status saved');
          setTimeout(() => {
            navigation.navigate('SetPin', { email: userEmail, name: userName });
          }, 2000);
        },
        (error: any) => console.log('Error saving to SQLite: ' + error.message),
      );
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/image/welcome.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.centerContainer}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              {isApproved ? (
                <View style={styles.approvedCircle}>
                  <MaterialIcon name="check-circle" size={50} color="#4A7856" />
                </View>
              ) : (
                <ActivityIndicator size="large" color="#4A7856" />
              )}
            </View>

            <Text style={styles.title}>{displayTitle}</Text>
            <Text style={styles.message}>{displayMessage}</Text>

            {!isApproved && (
              <Text style={styles.emailInfo}>Account: {email}</Text>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'center' },
  centerContainer: { paddingHorizontal: 20 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: 20, padding: 30,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: 'black', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 10 },
      android: { elevation: 10 },
    }),
  },
  iconContainer: { marginBottom: 20 },
  approvedCircle: { alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#4A7856', marginBottom: 12, textAlign: 'center' },
  message: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 15 },
  emailInfo: { fontSize: 12, color: '#999', textAlign: 'center' },
});

export default GetAdminApprove;
