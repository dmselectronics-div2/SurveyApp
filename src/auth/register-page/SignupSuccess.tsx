import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
  BackHandler,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { setLoginEmail } from '../../assets/sql_lite/db_connection';

const SignupSuccess = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const email = route.params?.email || '';

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleGoToDashboard = () => {
    setLoginEmail(email);
    navigation.replace('Welcome', { email });
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
              <View style={styles.successCircle}>
                <MaterialIcon name="check" size={40} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.title}>Registration successfull</Text>
            <Text style={styles.message}>
              Your account has been created and your research preferences have been saved.
            </Text>

            <TouchableOpacity
              style={styles.dashboardButton}
              onPress={handleGoToDashboard}
              activeOpacity={0.8}
            >
              <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'center' },
  centerContainer: { paddingHorizontal: 30 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: 20, padding: 30,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: 'black', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 10 },
    }),
  },
  iconContainer: { marginBottom: 20 },
  successCircle: {
    width: 70, height: 70, borderRadius: 35, backgroundColor: '#4A7856',
    justifyContent: 'center', alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#4A7856', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6 },
      android: { elevation: 6 },
    }),
  },
  title: {
    fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 12, textAlign: 'center',
  },
  message: {
    fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 25,
  },
  dashboardButton: {
    backgroundColor: '#4A7856', paddingVertical: 14, paddingHorizontal: 40,
    borderRadius: 25, alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 5 },
    }),
  },
  dashboardButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF', letterSpacing: 0.5 },
});

export default SignupSuccess;
