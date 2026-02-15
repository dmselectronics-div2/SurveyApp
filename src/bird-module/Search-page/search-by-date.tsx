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
import {IconButton} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import RNFS from 'react-native-fs';
import {API_URL} from '../../config';

const GREEN = '#2e7d32';
const GREEN_LIGHT = '#e8f5e9';

const PureSearchPage = ({setShowDateFilter}: {setShowDateFilter: (v: boolean) => void}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startText, setStartText] = useState('');
  const [endText, setEndText] = useState('');
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toISOString().split('T')[0];
    };
    const start = formatDate(startText);
    const end = formatDate(endText);

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/form-entries?page=1&limit=500`);
      const data = response.data || [];
      const filtered = data.filter((item: any) => {
        const matchStart = !start || item.date >= start;
        const matchEnd = !end || item.date <= end;
        return matchStart && matchEnd;
      });

      setResults(filtered);
    } catch {
      setResults([]);
    }
    setShowResults(true);
    setLoading(false);
  };

  const handleEdit = (item: any) => {
    Alert.alert('Edit Survey', `Edit survey at ${item.point} on ${item.date}?`, [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Edit', onPress: () => console.log('Edit:', item._id)},
    ]);
  };

  const handleDelete = (item: any, index: number) => {
    Alert.alert('Delete Survey', `Delete survey at ${item.point} on ${item.date}?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setResults(prev => prev.filter((_, i) => i !== index));
        },
      },
    ]);
  };

  const onChangeStart = (_event: any, selectedDate: any) => {
    const currentDate = selectedDate || startDate;
    setShowStart(Platform.OS === 'ios');
    setStartDate(currentDate);
    setStartText(currentDate.toDateString());
  };

  const onChangeEnd = (_event: any, selectedDate: any) => {
    const currentDate = selectedDate || endDate;
    setShowEnd(Platform.OS === 'ios');
    setEndDate(currentDate);
    setEndText(currentDate.toDateString());
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

    const headers = 'Date,Point,Point Tag,Start Time,End Time,Habitat,Observer,Weather,Latitude,Longitude,Descriptor,Radius,Water,Season,Vegetation,Species,Count,Maturity,Sex,Behaviour,Identification,Status\n';
    const csvRows = results.map((item: any) => {
      return (item.birdObservations || []).map((bird: any) =>
        [
          item.date, item.point, item.pointTag, item.startTime, item.endTime,
          item.habitatType, item.observers, item.weather, item.latitude, item.longitude,
          item.descriptor, item.radiusOfArea, item.water, item.season, item.statusOfVegy,
          `"${bird.species}"`, bird.count, bird.maturity, bird.sex, bird.behaviour,
          bird.identification, bird.status,
        ].join(','),
      ).join('\n');
    }).join('\n');

    const csvContent = headers + csvRows;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `${RNFS.ExternalStorageDirectoryPath}/Download/DateFilter_${timestamp}.csv`;

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
        <TouchableOpacity
          onPress={() => setShowDateFilter(false)}
          style={styles.backBtn}>
          <IconButton icon="arrow-left" iconColor="#333" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Date Filter</Text>
          <Text style={styles.headerSubtitle}>Search records by date range</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Filter Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Icon name="calendar-search" size={22} color={GREEN} />
            </View>
            <Text style={styles.cardTitle}>Select Date Range</Text>
          </View>

          <View style={styles.dateRow}>
            <TouchableOpacity
              onPress={() => setShowStart(true)}
              style={[styles.dateInput, startText ? styles.dateInputFilled : null]}>
              <View>
                <Text style={styles.dateLabel}>Start Date</Text>
                <Text style={[styles.dateValue, !startText && styles.datePlaceholder]}>
                  {startText || 'Select date'}
                </Text>
              </View>
              <Icon name="calendar" size={20} color={startText ? GREEN : '#bbb'} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowEnd(true)}
              style={[styles.dateInput, endText ? styles.dateInputFilled : null]}>
              <View>
                <Text style={styles.dateLabel}>End Date</Text>
                <Text style={[styles.dateValue, !endText && styles.datePlaceholder]}>
                  {endText || 'Select date'}
                </Text>
              </View>
              <Icon name="calendar" size={20} color={endText ? GREEN : '#bbb'} />
            </TouchableOpacity>
          </View>

          {showStart && (
            <DateTimePicker
              value={startDate}
              mode="date"
              is24Hour
              display="default"
              onChange={onChangeStart}
            />
          )}

          {showEnd && (
            <DateTimePicker
              value={endDate}
              mode="date"
              is24Hour
              display="default"
              onChange={onChangeEnd}
            />
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
        {loading && (
          <ActivityIndicator size="large" color={GREEN} style={{marginTop: 24}} />
        )}
        {showResults && !loading && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                Search Results ({results.length})
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
                <Icon name="file-search-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No records found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your date range</Text>
              </View>
            ) : (
              results.map((item, index) => (
                <View key={item._id} style={styles.resultCard}>
                  {/* Survey Header */}
                  <View style={styles.resultHeader}>
                    <View style={styles.resultHeaderLeft}>
                      <View style={styles.pointBadge}>
                        <Text style={styles.pointBadgeText}>{item.point}</Text>
                      </View>
                      <View>
                        <Text style={styles.resultDate}>{item.date}</Text>
                        <Text style={styles.resultTime}>
                          {item.startTime} - {item.endTime}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => handleEdit(item)}>
                        <Icon name="pencil-outline" size={18} color={GREEN} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDelete(item, index)}>
                        <Icon name="trash-can-outline" size={18} color="#D32F2F" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Survey Details Grid */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Habitat</Text>
                      <Text style={styles.detailValue}>{item.habitatType}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Point Tag</Text>
                      <Text style={styles.detailValue}>{item.pointTag}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Observer</Text>
                      <Text style={styles.detailValue}>{item.observers}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Weather</Text>
                      <Text style={styles.detailValue}>{item.weather}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Latitude</Text>
                      <Text style={styles.detailValue}>{item.latitude}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Longitude</Text>
                      <Text style={styles.detailValue}>{item.longitude}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Descriptor</Text>
                      <Text style={styles.detailValue}>{item.descriptor}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Radius</Text>
                      <Text style={styles.detailValue}>{item.radiusOfArea}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Water</Text>
                      <Text style={styles.detailValue}>{item.water}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Season</Text>
                      <Text style={styles.detailValue}>{item.season}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Vegetation</Text>
                      <Text style={styles.detailValue}>{item.statusOfVegy}</Text>
                    </View>
                  </View>

                  {/* Bird Observations */}
                  <View style={styles.observationsSection}>
                    <View style={styles.obsSectionHeader}>
                      <Icon name="bird" size={16} color={GREEN} />
                      <Text style={styles.obsSectionTitle}>
                        Bird Observations ({item.birdObservations.length})
                      </Text>
                    </View>

                    {item.birdObservations.map((bird: any, bIdx: number) => (
                      <View key={bIdx} style={styles.birdRow}>
                        <View style={styles.birdHeader}>
                          <View style={styles.birdCountBadge}>
                            <Text style={styles.birdCountText}>{bird.count}</Text>
                          </View>
                          {renderSpeciesName(bird.species)}
                        </View>
                        <View style={styles.birdDetails}>
                          <View style={styles.birdTag}>
                            <Text style={styles.birdTagText}>{bird.maturity}</Text>
                          </View>
                          <View style={styles.birdTag}>
                            <Text style={styles.birdTagText}>{bird.sex}</Text>
                          </View>
                          <View style={styles.birdTag}>
                            <Text style={styles.birdTagText}>{bird.behaviour}</Text>
                          </View>
                          <View style={styles.birdTag}>
                            <Text style={styles.birdTagText}>{bird.identification}</Text>
                          </View>
                          <View style={[styles.birdTag, bird.status === 'Endemic' && styles.endemicTag]}>
                            <Text style={[styles.birdTagText, bird.status === 'Endemic' && styles.endemicTagText]}>
                              {bird.status}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: GREEN_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateInputFilled: {
    borderColor: GREEN,
    backgroundColor: GREEN_LIGHT,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  datePlaceholder: {
    color: '#bbb',
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 20,
    gap: 8,
  },
  searchBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Results
  resultsSection: {
    marginTop: 24,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
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
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 40,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 4,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pointBadge: {
    backgroundColor: GREEN,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pointBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  resultDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  resultTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GREEN_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  detailItem: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: '30%',
    flexGrow: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  observationsSection: {
    backgroundColor: GREEN_LIGHT,
    borderRadius: 12,
    padding: 12,
  },
  obsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  obsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: GREEN,
  },
  birdRow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  birdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  birdCountBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  birdCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  speciesText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  speciesScientific: {
    fontStyle: 'italic',
    color: '#666',
  },
  birdDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginLeft: 36,
  },
  birdTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  birdTagText: {
    fontSize: 11,
    color: '#666',
  },
  endemicTag: {
    backgroundColor: '#FFF3E0',
  },
  endemicTagText: {
    color: '#E65100',
    fontWeight: '600',
  },
});

export default PureSearchPage;
