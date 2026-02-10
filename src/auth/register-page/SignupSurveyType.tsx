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
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Checkbox } from 'react-native-paper';

const SignupSurveyType = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const role = route.params?.role || '';

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const surveyTypes = [
    { id: 'Periodical/monthly', label: 'Periodical/monthly Surveys' },
    { id: 'Undergraduate Research', label: 'Undergraduate Research' },
    { id: 'Postgraduate', label: 'Postgraduate' },
    { id: 'Other', label: 'Other' },
  ];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const toggleType = (id: string) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id],
    );
  };

  const handleNext = () => {
    if (selectedTypes.length === 0) {
      Alert.alert('Error', 'Please select at least one survey type');
      return;
    }
    navigation.navigate('SignupResearchAreas', {
      role, surveyTypes: selectedTypes,
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/image/Nature.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialIcon name="arrow-back" size={28} color="#4A7856" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.contentWrapper}>
          <View style={styles.headerArea}>
            <Text style={styles.title}>Signup</Text>
            <Text style={styles.subtitle}>
              Register to contribute to environmental research data collection
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Survey Type</Text>
            <Text style={styles.cardSubtitle}>Select all that apply to your research</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {surveyTypes.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.checkboxRow}
                  onPress={() => toggleType(type.id)}
                  activeOpacity={0.7}
                >
                  <Checkbox
                    status={selectedTypes.includes(type.id) ? 'checked' : 'unchecked'}
                    onPress={() => toggleType(type.id)}
                    color="#4A7856"
                    uncheckedColor="#999"
                  />
                  <Text style={styles.checkboxLabel}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.nextBtnText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  backButtonText: { fontSize: 16, color: '#4A7856', marginLeft: 5, fontWeight: '600' },
  contentWrapper: {
    flex: 1, paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 90 : 80,
  },
  headerArea: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 18 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: 16, padding: 20,
    flex: 1, marginBottom: 30,
    ...Platform.select({
      ios: { shadowColor: 'black', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 8 },
    }),
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: '#4A7856', marginBottom: 16 },
  checkboxRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 6,
  },
  checkboxLabel: { fontSize: 14, color: '#333', flex: 1 },
  buttonContainer: {
    flexDirection: 'row', gap: 10, marginTop: 20,
    paddingTop: 15, borderTopWidth: 1, borderTopColor: '#E0E0E0',
  },
  backBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
    borderWidth: 1, borderColor: '#4A7856',
  },
  backBtnText: { fontSize: 14, fontWeight: '600', color: '#4A7856' },
  nextBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
    backgroundColor: '#4A7856',
  },
  nextBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
});

export default SignupSurveyType;
