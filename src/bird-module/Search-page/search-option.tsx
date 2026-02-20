import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PureSearchPage from './search-by-date';
import SearchPage from './search-page';
import SearchAllSpeciesCount from './search-all-species-count';
import CitySearchPage from './search-citizen';
import SearchByHabitat from './search-by-habitat';
import BirdSurveyForm from '../survey-drafts/bird-survey-form';

const GREEN = '#2e7d32';
const GREEN_LIGHT = '#e8f5e9';

const filterOptions = [
  {
    key: 'date',
    title: 'Date Filter',
    subtitle: 'Search records by date range',
    icon: 'calendar-search',
  },
  {
    key: 'point',
    title: 'Date & Point Filter',
    subtitle: 'Filter by date and survey point',
    icon: 'map-marker-radius',
  },
  {
    key: 'allSpecies',
    title: 'All Species Count',
    subtitle: 'View all species with total counts',
    icon: 'bird',
  },
  {
    key: 'habitat',
    title: 'Habitat Type Filter',
    subtitle: 'Filter records by habitat type',
    icon: 'tree-outline',
  },
];

const SearchOption = () => {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showPointFilter, setShowPointFilter] = useState(false);
  const [showAllSpeciesCount, setShowAllSpeciesCount] = useState(false);
  const [showCitizen, setShowCitizen] = useState(false);
  const [showHabitatFilter, setShowHabitatFilter] = useState(false);
  const [editSurveyData, setEditSurveyData] = useState<any>(null);
  const [editSource, setEditSource] = useState<string | null>(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (editSurveyData) {
        setEditSurveyData(null);
        return true;
      }
      if (showDateFilter) { setShowDateFilter(false); return true; }
      if (showPointFilter) { setShowPointFilter(false); return true; }
      if (showAllSpeciesCount) { setShowAllSpeciesCount(false); return true; }
      if (showCitizen) { setShowCitizen(false); return true; }
      if (showHabitatFilter) { setShowHabitatFilter(false); return true; }
      return false;
    });
    return () => backHandler.remove();
  }, [showDateFilter, showPointFilter, showAllSpeciesCount, showCitizen, showHabitatFilter, editSurveyData]);

  const handlePress = (key: string) => {
    switch (key) {
      case 'date':
        setShowDateFilter(true);
        break;
      case 'point':
        setShowPointFilter(true);
        break;
      case 'allSpecies':
        setShowAllSpeciesCount(true);
        break;
      case 'citizen':
        setShowCitizen(true);
        break;
      case 'habitat':
        setShowHabitatFilter(true);
        break;
    }
  };

  const handleEditItem = (item: any, source: string) => {
    setEditSurveyData(item);
    setEditSource(source);
  };

  const handleEditComplete = () => {
    setEditSurveyData(null);
    if (editSource === 'date') {
      setShowDateFilter(true);
    } else if (editSource === 'point') {
      setShowPointFilter(true);
    } else if (editSource === 'habitat') {
      setShowHabitatFilter(true);
    }
    setEditSource(null);
  };

  if (editSurveyData) {
    return <BirdSurveyForm editData={editSurveyData} onEditComplete={handleEditComplete} />;
  }
  if (showDateFilter) {
    return (
      <PureSearchPage
        setShowDateFilter={setShowDateFilter}
        onEditItem={(item: any) => handleEditItem(item, 'date')}
      />
    );
  }
  if (showPointFilter) {
    return (
      <SearchPage
        setShowPointFilter={setShowPointFilter}
        onEditItem={(item: any) => handleEditItem(item, 'point')}
      />
    );
  }
  if (showAllSpeciesCount) {
    return <SearchAllSpeciesCount setShowAllSpeciesCount={setShowAllSpeciesCount} />;
  }
  if (showHabitatFilter) {
    return (
      <SearchByHabitat
        setShowHabitatFilter={setShowHabitatFilter}
        onEditItem={(item: any) => handleEditItem(item, 'habitat')}
      />
    );
  }
  if (showCitizen) {
    return <CitySearchPage setShowCitizen={setShowCitizen} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search & Filter</Text>
        <Text style={styles.subtitle}>
          Select a filter to explore bird survey data
        </Text>
      </View>

      {/* Filter Cards */}
      {filterOptions.map(option => (
        <TouchableOpacity
          key={option.key}
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => handlePress(option.key)}>
          <View style={styles.iconContainer}>
            <Icon name={option.icon} size={24} color={GREEN} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{option.title}</Text>
            <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
          </View>
          <Icon name="chevron-right" size={22} color="#bbb" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'InriaSerif-Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: GREEN_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
});

export default SearchOption;
