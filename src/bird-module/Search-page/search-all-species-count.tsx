import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { API_URL } from '../../config';
import { birdSpecies } from '../survey-drafts/bird-list';

const GREEN = '#2e7d32';
const GREEN_LIGHT = '#e8f5e9';
const LIGHT_GRAY = '#f5f5f5';

interface SpeciesCount {
  species: string;
  count: number;
}

const SearchAllSpeciesCount = ({ setShowAllSpeciesCount }: { setShowAllSpeciesCount: (v: boolean) => void }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SpeciesCount[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/form-entries?page=1&limit=500`);
      const data = response.data || [];

      const grouped: Record<string, SpeciesCount> = {};
      let total = 0;

      data.forEach((item: any) => {
        (item.birdObservations || []).forEach((bird: any) => {
          if (selectedSpecies && bird.species.toLowerCase() !== selectedSpecies.toLowerCase()) {
            return;
          }
          const key = bird.species.toLowerCase();
          const cnt = Number(bird.count) || 0;
          total += cnt;

          if (!grouped[key]) {
            grouped[key] = { species: bird.species, count: cnt };
          } else {
            grouped[key].count += cnt;
          }
        });
      });

      const sortedResults = Object.values(grouped).sort((a, b) => b.count - a.count);
      setResults(sortedResults);
      setTotalCount(total);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to fetch data');
      setResults([]);
      setTotalCount(0);
    }
    setShowResults(true);
    setLoading(false);
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 30) {
        return true;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  const downloadCSV = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to download the CSV file.');
      return;
    }
    if (results.length === 0) {
      Alert.alert('No Data', 'No data available for download.');
      return;
    }

    const headers = 'Observed Species,Count\n';
    const csvRows = results.map(item => `"${item.species}",${item.count}`).join('\n');
    const csvContent = headers + csvRows + `\n\nTotal Count,${totalCount}`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `${RNFS.ExternalStorageDirectoryPath}/Download/SpeciesCount_${timestamp}.csv`;

    try {
      await RNFS.writeFile(path, csvContent, 'utf8');
      Alert.alert('Success', `CSV file saved at: ${path}`);
    } catch (error) {
      console.error('Error saving CSV:', error);
      Alert.alert('Error', 'Failed to save CSV file.');
    }
  };

  const renderSpeciesName = (name: string) => {
    const match = name.match(/^(.*?)\s*\((.+?)\)$/);
    if (match) {
      return (
        <Text style={styles.speciesText}>
          {match[1]} <Text style={styles.speciesScientific}>({match[2]})</Text>
        </Text>
      );
    }
    return <Text style={styles.speciesText}>{name}</Text>;
  };

  const renderSpeciesItem = ({ item, index }: { item: SpeciesCount; index: number }) => (
    <View style={[styles.resultItem, index % 2 === 0 ? styles.alternateRow : null]}>
      <View style={styles.resultContent}>
        <View style={styles.speciesNameContainer}>
          <Icon name="bird" size={18} color={GREEN} style={styles.birdIcon} />
          {renderSpeciesName(item.species)}
        </View>
      </View>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{item.count}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowAllSpeciesCount(false)} style={styles.backBtn}>
          <IconButton icon="arrow-left" iconColor="#333" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Species Count</Text>
          <Text style={styles.headerSubtitle}>All observed species count</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Filter Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Icon name="bird" size={22} color={GREEN} />
            </View>
            <Text style={styles.cardTitle}>Select Species</Text>
          </View>

          {/* Species Filter */}
          <Text style={styles.fieldLabel}>Observed Species</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && styles.dropdownFocused]}
            placeholderStyle={styles.dropdownPlaceholder}
            selectedTextStyle={styles.dropdownSelected}
            inputSearchStyle={styles.inputSearch}
            itemTextStyle={styles.dropdownItemText}
            data={birdSpecies}
            search
            searchPlaceholder="Search species..."
            labelField="label"
            valueField="value"
            placeholder="Observed Species"
            value={selectedSpecies}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setSelectedSpecies(item.value);
              setIsFocus(false);
            }}
          />
          {selectedSpecies && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setSelectedSpecies(null)}>
              <Icon name="close-circle" size={16} color="#999" />
              <Text style={styles.clearBtnText}>Clear species filter</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.searchBtn}
            activeOpacity={0.8}
            onPress={handleSearch}>
            <Icon name="magnify" size={20} color="#fff" />
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {loading && <ActivityIndicator size="large" color={GREEN} style={{ marginTop: 24 }} />}

        {showResults && !loading && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                Total Bird Count
              </Text>
              <View style={styles.headerRight}>
                <View style={styles.totalBadge}>
                  <Text style={styles.totalLabel}>Total Count</Text>
                  <Text style={styles.totalCount}>{totalCount}</Text>
                </View>
                {results.length > 0 && (
                  <TouchableOpacity style={styles.downloadBtn} onPress={downloadCSV}>
                    <Icon name="download" size={18} color="#fff" />
                    <Text style={styles.downloadBtnText}>CSV</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {results.length === 0 ? (
              <View style={styles.emptyCard}>
                <Icon name="file-search-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No species found</Text>
                <Text style={styles.emptySubtext}>Try selecting a different species</Text>
              </View>
            ) : (
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Observed Species</Text>
                  <Text style={[styles.tableHeaderText, styles.countColumn]}>Count</Text>
                </View>
                <FlatList
                  data={results}
                  renderItem={renderSpeciesItem}
                  keyExtractor={(item, index) => `${item.species}-${index}`}
                  scrollEnabled={false}
                  nestedScrollEnabled={false}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backBtn: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: GREEN_LIGHT,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: GREEN,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  dropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dropdownFocused: {
    borderColor: GREEN,
  },
  dropdownPlaceholder: {
    fontSize: 13,
    color: '#bbb',
  },
  dropdownSelected: {
    fontSize: 13,
    color: '#000',
    fontWeight: '500',
  },
  inputSearch: {
    height: 40,
    fontSize: 13,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#000',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  clearBtnText: {
    fontSize: 12,
    color: '#999',
  },
  searchBtn: {
    backgroundColor: GREEN,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  searchBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsSection: {
    marginTop: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalBadge: {
    backgroundColor: GREEN_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: GREEN,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GREEN,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  downloadBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  totalCount: {
    fontSize: 18,
    fontWeight: '700',
    color: GREEN,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: GREEN_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: GREEN,
    flex: 1,
  },
  countColumn: {
    textAlign: 'right',
    flex: 0.3,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  alternateRow: {
    backgroundColor: '#fafafa',
  },
  resultContent: {
    flex: 1,
  },
  speciesNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  birdIcon: {
    marginRight: 8,
  },
  speciesText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  speciesScientific: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  countBadge: {
    backgroundColor: GREEN,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 4,
  },
});

export default SearchAllSpeciesCount;
