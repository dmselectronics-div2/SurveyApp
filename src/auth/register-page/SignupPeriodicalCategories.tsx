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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Checkbox } from 'react-native-paper';

const SignupPeriodicalCategories = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const role = route.params?.role || '';
  const surveyTypes = route.params?.surveyTypes || [];
  const researchAreas = route.params?.researchAreas || [];

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    { id: 'Physiochemical & Biological water', label: 'Physiochemical & Biological water', children: [] },
    { id: 'Physiochemical & Biological soil', label: 'Physiochemical & Biological soil', children: [] },
    {
      id: 'Biodiversity', label: 'Biodiversity',
      children: [
        { id: 'Flora (phenology, Invasive detection)', label: 'Flora (phenology, Invasive detection)' },
        { id: 'Fauna (Bird, Butterfly, Gastropode, dragonfly, Fish, mammal, Amphibian, Reptila)', label: 'Fauna (Bird, Butterfly, Gastropode, dragonfly, Fish, mammal, Amphibian, Reptila)' },
      ],
    },
    {
      id: 'Ecosystem', label: 'Ecosystem',
      children: [
        { id: 'Mangroves (Plant diversity & Growth, above data)', label: 'Mangroves (Plant diversity & Growth, above data)' },
        { id: 'Saltmarsh (Site modifications, above ground carbon, below ground carbon, downed wood carbon, soil carbon)', label: 'Saltmarsh (Site modifications, above ground carbon, below ground carbon, downed wood carbon, soil carbon)' },
      ],
    },
    {
      id: 'Pollution', label: 'Pollution',
      children: [
        { id: 'OSPAR marine litter', label: 'OSPAR marine litter' },
        { id: 'Microplastics (water, Sediment, Biota)', label: 'Microplastics (water, Sediment, Biota)' },
        { id: 'Heavy metals', label: 'Heavy metals' },
      ],
    },
  ];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id],
    );
  };

  const isParentChecked = (children: any[]) => {
    return children.some(c => selectedCategories.includes(c.id));
  };

  const handleSubmit = () => {
    navigation.navigate('SignupForm', {
      role, surveyTypes, researchAreas, periodicalCategories: selectedCategories,
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
          <MaterialIcon name="arrow-back" size={28} color="#FFFFFF" />
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
            <Text style={styles.cardTitle}>Periodical/monthly Categories</Text>
            <Text style={styles.cardSubtitle}>
              Select categories for your Periodical/monthly Surveys
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
              {categories.map(cat => (
                <View key={cat.id}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => {
                      if (cat.children.length === 0) toggleCategory(cat.id);
                    }}
                    activeOpacity={0.7}
                  >
                    {cat.children.length === 0 ? (
                      <Checkbox
                        status={selectedCategories.includes(cat.id) ? 'checked' : 'unchecked'}
                        onPress={() => toggleCategory(cat.id)}
                        color="#4A7856"
                        uncheckedColor="#999"
                      />
                    ) : (
                      <View style={[
                        styles.parentIndicator,
                        isParentChecked(cat.children) && styles.parentIndicatorActive,
                      ]} />
                    )}
                    <Text style={[
                      styles.checkboxLabel,
                      cat.children.length > 0 && styles.parentLabel,
                    ]}>{cat.label}</Text>
                  </TouchableOpacity>

                  {cat.children.map(child => (
                    <TouchableOpacity
                      key={child.id}
                      style={[styles.checkboxRow, styles.childRow]}
                      onPress={() => toggleCategory(child.id)}
                      activeOpacity={0.7}
                    >
                      <Checkbox
                        status={selectedCategories.includes(child.id) ? 'checked' : 'unchecked'}
                        onPress={() => toggleCategory(child.id)}
                        color="#4A7856"
                        uncheckedColor="#999"
                      />
                      <Text style={styles.childLabel}>{child.label}</Text>
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
                <MaterialIcon name="chevron-left" size={18} color="#4A7856" />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitBtnText}>Submit</Text>
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
  backButtonText: { fontSize: 16, color: '#FFFFFF', marginLeft: 5, fontWeight: '600' },
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
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: '#666', marginBottom: 16 },
  scrollArea: { flex: 1 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  childRow: { marginLeft: 30 },
  checkboxLabel: { fontSize: 14, color: '#333', flex: 1 },
  childLabel: { fontSize: 12, color: '#555', flex: 1 },
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
    borderWidth: 1, borderColor: '#4A7856', flexDirection: 'row', justifyContent: 'center',
  },
  backBtnText: { fontSize: 14, fontWeight: '600', color: '#4A7856' },
  submitBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
    backgroundColor: '#4A7856',
  },
  submitBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
});

export default SignupPeriodicalCategories;
