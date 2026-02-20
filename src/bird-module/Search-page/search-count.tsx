import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import {IconButton, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import RNFS from 'react-native-fs';
import {API_URL} from '../../config';

const GREEN = '#2e7d32';
const GREEN_LIGHT = '#e8f5e9';

interface GroupedSpecies {
  species: string;
  count: number;
}

const SearchCount = ({setShowBirdCount}: {setShowBirdCount: (v: boolean) => void}) => {
  const [species, setSpecies] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<GroupedSpecies[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const normalizedSpecies = species.trim().toLowerCase();

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/form-entries?page=1&limit=500`);
      const data = response.data || [];

      const grouped: Record<string, GroupedSpecies> = {};
      let total = 0;

      data.forEach((item: any) => {
        (item.birdObservations || []).forEach((bird: any) => {
          const key = bird.species.toLowerCase();
          if (normalizedSpecies && !key.includes(normalizedSpecies)) return;
          const cnt = Number(bird.count) || 0;
          total += cnt;
          if (!grouped[key]) {
            grouped[key] = {species: bird.species, count: cnt};
          } else {
            grouped[key].count += cnt;
          }
        });
      });

      setResults(Object.values(grouped).sort((a, b) => b.count - a.count));
      setTotalCount(total);
    } catch {
      setResults([]);
      setTotalCount(0);
    }
    setShowResults(true);
    setLoading(false);
  };

  const handleDelete = (index: number) => {
    const item = results[index];
    Alert.alert('Remove Species', `Remove "${item.species}" from results?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setTotalCount(prev => prev - item.count);
          setResults(prev => prev.filter((_, i) => i !== index));
        },
      },
    ]);
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

    const headers = 'Species,Count\n';
    const csvRows = results.map(item => `"${item.species}",${item.count}`).join('\n');
    const csvContent = headers + csvRows + `\n\nTotal Count,${totalCount}`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `${RNFS.ExternalStorageDirectoryPath}/Download/CountFilter_${timestamp}.csv`;

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowBirdCount(false)} style={styles.backBtn}>
          <IconButton icon="arrow-left" iconColor="#333" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Count Filter</Text>
          <Text style={styles.headerSubtitle}>Search observed species count</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Filter Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Icon name="counter" size={22} color={GREEN} />
            </View>
            <Text style={styles.cardTitle}>Search Criteria</Text>
          </View>

          <Text style={styles.fieldLabel}>Species Name (Optional)</Text>
          <TextInput
            mode="outlined"
            placeholder="e.g. Kingfisher"
            value={species}
            onChangeText={setSpecies}
            outlineColor="#e0e0e0"
            activeOutlineColor={GREEN}
            style={styles.textInput}
            textColor="#333"
            placeholderTextColor="#bbb"
          />

          <TouchableOpacity style={styles.searchBtn} activeOpacity={0.8} onPress={handleSearch}>
            <Icon name="magnify" size={20} color="#fff" />
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {loading && (
          <ActivityIndicator size="large" color={GREEN} style={{marginTop: 24}} />
        )}
        {showResults && !loading && (
          <View style={styles.resultsSection}>
            {/* Total Count Card */}
            <View style={styles.totalCard}>
              <View style={styles.totalCardLeft}>
                <Icon name="sigma" size={24} color={GREEN} />
                <Text style={styles.totalLabel}>Total Bird Count</Text>
              </View>
              <View style={styles.totalBadge}>
                <Text style={styles.totalBadgeText}>{totalCount}</Text>
              </View>
            </View>

            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                Species Breakdown ({results.length})
              </Text>
              {results.length > 0 && (
                <TouchableOpacity style={styles.downloadBtn} onPress={downloadCSV}>
                  <Icon name="download" size={18} color="#fff" />
                  <Text style={styles.downloadBtnText}>CSV</Text>
                </TouchableOpacity>
              )}
            </View>

            {results.length === 0 ? (
              <View style={styles.emptyCard}>
                <Icon name="bird" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No species found</Text>
                <Text style={styles.emptySubtext}>Try a different species name</Text>
              </View>
            ) : (
              results.map((item, index) => (
                <View key={index} style={styles.countRow}>
                  <View style={styles.countRowLeft}>
                    <View style={styles.birdCountBadge}>
                      <Text style={styles.birdCountText}>{item.count}</Text>
                    </View>
                    <View style={styles.countRowInfo}>
                      {renderSpeciesName(item.species)}
                    </View>
                  </View>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(index)}>
                    <Icon name="trash-can-outline" size={18} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row', alignItems: 'center', paddingRight: 20, paddingTop: 8, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  backBtn: {marginRight: 4},
  headerTitle: {fontSize: 20, fontWeight: '700', color: '#1a1a1a'},
  headerSubtitle: {fontSize: 13, color: '#888', marginTop: 2},
  scrollContent: {padding: 16, paddingBottom: 40},
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 18, elevation: 2,
    shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.08, shadowRadius: 4,
    borderWidth: 1, borderColor: '#f0f0f0',
  },
  cardHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 18},
  iconContainer: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: GREEN_LIGHT,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  cardTitle: {fontSize: 16, fontWeight: '600', color: '#1a1a1a'},
  fieldLabel: {fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5},
  textInput: {backgroundColor: '#fafafa', height: 50},
  searchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14, marginTop: 20, gap: 8,
  },
  searchBtnText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  resultsSection: {marginTop: 24},
  resultsHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14},
  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: GREEN,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, gap: 6,
  },
  downloadBtnText: {color: '#fff', fontSize: 13, fontWeight: '600'},
  totalCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: GREEN_LIGHT, borderRadius: 14, padding: 16, marginBottom: 18,
    borderWidth: 1, borderColor: '#c8e6c9',
  },
  totalCardLeft: {flexDirection: 'row', alignItems: 'center', gap: 10},
  totalLabel: {fontSize: 15, fontWeight: '600', color: GREEN},
  totalBadge: {
    backgroundColor: GREEN, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10,
  },
  totalBadgeText: {color: '#fff', fontSize: 18, fontWeight: '700'},
  resultsTitle: {fontSize: 18, fontWeight: '700', color: '#1a1a1a'},
  emptyCard: {
    alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 40,
    elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3,
    borderWidth: 1, borderColor: '#f0f0f0',
  },
  emptyText: {fontSize: 16, fontWeight: '600', color: '#999', marginTop: 12},
  emptySubtext: {fontSize: 13, color: '#bbb', marginTop: 4},
  countRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10,
    elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.06, shadowRadius: 3,
    borderWidth: 1, borderColor: '#f0f0f0',
  },
  countRowLeft: {flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1},
  countRowInfo: {flex: 1},
  birdCountBadge: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: GREEN,
    justifyContent: 'center', alignItems: 'center',
  },
  birdCountText: {color: '#fff', fontSize: 16, fontWeight: '700'},
  speciesText: {fontSize: 14, fontWeight: '500', color: '#333'},
  speciesScientific: {fontStyle: 'italic', color: '#666'},
  deleteBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFEBEE',
    justifyContent: 'center', alignItems: 'center',
  },
});

export default SearchCount;
