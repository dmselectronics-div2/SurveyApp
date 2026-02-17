import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
  BackHandler,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { API_URL } from '../../config';

const SignupPersonalDetails = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const email = route.params?.email || '';
  const name = route.params?.name || '';
  const role = route.params?.role || '';
  const surveyTypes = route.params?.surveyTypes || [];
  const researchAreas = route.params?.researchAreas || [];
  const periodicalCategories = route.params?.periodicalCategories || [];

  const [nameWithInitials, setNameWithInitials] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [institute, setInstitute] = useState('');
  const [instituteAddress, setInstituteAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter your first and last name');
      return;
    }
    if (!mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/save-signup-details`, {
        email,
        role,
        surveyTypes,
        researchAreas,
        periodicalCategories,
        firstName,
        lastName,
        nameWithInitials,
        mobileNumber,
        designation,
        institute,
        instituteAddress,
      });

      setLoading(false);
      navigation.navigate('PrivacyPolicy', { email, name, fromCitizen: false });
    } catch (error) {
      setLoading(false);
      console.error('Error saving details:', error);
      Alert.alert('Error', 'Failed to save details. Please try again.');
    }
  };

  const inputTheme = { colors: { primary: '#4A7856', background: 'rgba(255, 255, 255, 0.95)' } };

  return (
    <ImageBackground
      source={require('../../assets/image/welcome.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialIcon name="arrow-back" size={28} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerArea}>
            <Text style={styles.title}>Signup</Text>
            <Text style={styles.subtitle}>
              Register to contribute to environmental research data collection
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name with Initials</Text>
              <TextInput
                mode="outlined"
                placeholder="e.g. J. K. Smith"
                value={nameWithInitials}
                onChangeText={setNameWithInitials}
                outlineColor="rgba(74, 120, 86, 0.3)"
                activeOutlineColor="#4A7856"
                style={styles.input}
                editable={!loading}
                theme={inputTheme}
              />
            </View>

            <View style={styles.nameRow}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  mode="outlined"
                  placeholder="First"
                  value={firstName}
                  onChangeText={setFirstName}
                  outlineColor="rgba(74, 120, 86, 0.3)"
                  activeOutlineColor="#4A7856"
                  style={styles.input}
                  editable={!loading}
                  theme={inputTheme}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Last"
                  value={lastName}
                  onChangeText={setLastName}
                  outlineColor="rgba(74, 120, 86, 0.3)"
                  activeOutlineColor="#4A7856"
                  style={styles.input}
                  editable={!loading}
                  theme={inputTheme}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                mode="outlined"
                value={email}
                editable={false}
                outlineColor="rgba(74, 120, 86, 0.3)"
                style={[styles.input, styles.disabledInput]}
                theme={inputTheme}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                mode="outlined"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
                outlineColor="rgba(74, 120, 86, 0.3)"
                activeOutlineColor="#4A7856"
                style={styles.input}
                editable={!loading}
                theme={inputTheme}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Designation</Text>
              <TextInput
                mode="outlined"
                placeholder="Enter designation"
                value={designation}
                onChangeText={setDesignation}
                outlineColor="rgba(74, 120, 86, 0.3)"
                activeOutlineColor="#4A7856"
                style={styles.input}
                editable={!loading}
                theme={inputTheme}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Institute</Text>
              <TextInput
                mode="outlined"
                placeholder="Enter institute"
                value={institute}
                onChangeText={setInstitute}
                outlineColor="rgba(74, 120, 86, 0.3)"
                activeOutlineColor="#4A7856"
                style={styles.input}
                editable={!loading}
                theme={inputTheme}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Institute's Address</Text>
              <TextInput
                mode="outlined"
                placeholder="Enter institute address"
                value={instituteAddress}
                onChangeText={setInstituteAddress}
                multiline
                numberOfLines={3}
                outlineColor="rgba(74, 120, 86, 0.3)"
                activeOutlineColor="#4A7856"
                style={[styles.input, styles.multilineInput]}
                editable={!loading}
                theme={inputTheme}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={styles.submitBtnText}>
                  {loading ? 'Saving...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
  backButton: {
    position: 'absolute', top: Platform.OS === 'ios' ? 50 : 40, left: 20,
    flexDirection: 'row', alignItems: 'center', padding: 10, zIndex: 10,
  },
  backButtonText: { fontSize: 16, color: '#FFFFFF', marginLeft: 5, fontWeight: '600' },
  scrollContainer: { flex: 1, marginTop: Platform.OS === 'ios' ? 60 : 50 },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 20 },
  headerArea: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 18 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: 16, padding: 20, marginBottom: 30,
    ...Platform.select({
      ios: { shadowColor: 'black', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 8 },
    }),
  },
  inputContainer: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '500', color: '#333', marginBottom: 4 },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.95)', fontSize: 13 },
  disabledInput: { backgroundColor: 'rgba(200, 200, 200, 0.3)' },
  multilineInput: { minHeight: 70 },
  nameRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  halfInput: { flex: 1 },
  buttonContainer: {
    flexDirection: 'row', gap: 10, marginTop: 10,
    paddingTop: 15, borderTopWidth: 1, borderTopColor: '#E0E0E0',
  },
  backBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
    borderWidth: 1, borderColor: '#4A7856',
  },
  backBtnText: { fontSize: 14, fontWeight: '600', color: '#4A7856' },
  submitBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
    backgroundColor: '#4A7856',
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
});

export default SignupPersonalDetails;
