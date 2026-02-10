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

const SignupResearchAreas = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const email = route.params?.email || '';
  const name = route.params?.name || '';
  const role = route.params?.role || '';
  const surveyTypes = route.params?.surveyTypes || [];

  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const researchAreas = [
    { id: 'Water', label: 'Water', children: [] },
    { id: 'Soil', label: 'Soil', children: [] },
    {
      id: 'Biodiversity', label: 'Biodiversity',
      children: [
        { id: 'Flora', label: 'Flora' },
        { id: 'Fauna', label: 'Fauna' },
      ],
    },
    {
      id: 'Ecosystem', label: 'Ecosystem',
      children: [
        { id: 'Mangroves', label: 'Mangroves' },
        { id: 'Salt marsh', label: 'Salt marsh' },
      ],
    },
    { id: 'Pollution', label: 'Pollution', children: [] },
  ];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const toggleArea = (id: string) => {
    setSelectedAreas(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id],
    );
  };

  const isParentChecked = (parentId: string, children: any[]) => {
    if (children.length === 0) return selectedAreas.includes(parentId);
    return children.some(c => selectedAreas.includes(c.id));
  };

  const handleNext = () => {
    if (selectedAreas.length === 0) {
      Alert.alert('Error', 'Please select at least one research area');
      return;
    }

    const hasPeriodical = surveyTypes.includes('Periodical/monthly');
    if (hasPeriodical) {
      navigation.navigate('SignupPeriodicalCategories', {
        email, name, role, surveyTypes, researchAreas: selectedAreas,
      });
    } else {
      navigation.navigate('SignupPersonalDetails', {
        email, name, role, surveyTypes, researchAreas: selectedAreas, periodicalCategories: [],
      });
    }
  };

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
            <Text style={styles.cardTitle}>Research Areas</Text>
            <Text style={styles.cardSubtitle}>Select all areas relevant to your research</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
              {researchAreas.map(area => (
                <View key={area.id}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => {
                      if (area.children.length === 0) toggleArea(area.id);
                    }}
                    activeOpacity={0.7}
                  >
                    {area.children.length === 0 ? (
                      <Checkbox
                        status={selectedAreas.includes(area.id) ? 'checked' : 'unchecked'}
                        onPress={() => toggleArea(area.id)}
                        color="#4A7856"
                        uncheckedColor="#999"
                      />
                    ) : (
                      <View style={[
                        styles.parentIndicator,
                        isParentChecked(area.id, area.children) && styles.parentIndicatorActive,
                      ]} />
                    )}
                    <Text style={[
                      styles.checkboxLabel,
                      area.children.length > 0 && styles.parentLabel,
                    ]}>{area.label}</Text>
                  </TouchableOpacity>

                  {area.children.map(child => (
                    <TouchableOpacity
                      key={child.id}
                      style={[styles.checkboxRow, styles.childRow]}
                      onPress={() => toggleArea(child.id)}
                      activeOpacity={0.7}
                    >
                      <Checkbox
                        status={selectedAreas.includes(child.id) ? 'checked' : 'unchecked'}
                        onPress={() => toggleArea(child.id)}
                        color="#4A7856"
                        uncheckedColor="#999"
                      />
                      <Text style={styles.checkboxLabel}>{child.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
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
    flex: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 90 : 80,
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
  scrollArea: { flex: 1 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  childRow: { marginLeft: 30 },
  checkboxLabel: { fontSize: 14, color: '#333', flex: 1 },
  parentLabel: { fontWeight: '600', color: '#4A7856' },
  parentIndicator: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2,
    borderColor: '#4A7856', marginHorizontal: 11,
  },
  parentIndicatorActive: { backgroundColor: 'rgba(74, 120, 86, 0.3)' },
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

export default SignupResearchAreas;
