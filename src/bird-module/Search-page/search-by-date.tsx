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
import NetInfo from '@react-native-community/netinfo';
import {API_URL} from '../../config';
import {getDatabase} from '../database/db';

const toLocalDate = (dateStr: string) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
};

const GREEN = '#2e7d32';
const GREEN_LIGHT = '#e8f5e9';

const PureSearchPage = ({setShowDateFilter, onEditItem}: {setShowDateFilter: (v: boolean) => void; onEditItem?: (item: any) => void}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startText, setStartText] = useState('');
  const [endText, setEndText] = useState('');
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedBirds, setExpandedBirds] = useState<Record<string, boolean>>({});
  const [isOffline, setIsOffline] = useState(false);

  const loadOfflineData = async (startD: Date | null, endD: Date | null): Promise<void> => {
    return new Promise(async resolve => {
      try {
        const db = await getDatabase();
        db.transaction((tx: any) => {
          tx.executeSql(
            `SELECT bs.uniqueId, bs.habitatType, bs.point, bs.pointTag, bs.latitude, bs.longitude,
                    bs.date, bs.observers, bs.startTime, bs.endTime, bs.weather, bs.water, bs.season,
                    bs.statusOfVegy, bs.radiusOfArea, bs.descriptor,
                    bo.species, bo.count, bo.maturity, bo.sex, bo.behaviour, bo.identification,
                    bo.status, bo.remarks
             FROM bird_survey bs
             LEFT JOIN bird_observations bo ON bs.uniqueId = bo.uniqueId
             ORDER BY bs.date DESC LIMIT 300`,
            [],
            (_: any, results: any) => {
              const surveyMap: Record<string, any> = {};
              for (let i = 0; i < results.rows.length; i++) {
                const row = results.rows.item(i);
                if (!surveyMap[row.uniqueId]) {
                  surveyMap[row.uniqueId] = {
                    _id: row.uniqueId,
                    uniqueId: row.uniqueId,
                    habitatType: row.habitatType,
                    point: row.point,
                    pointTag: row.pointTag,
                    latitude: row.latitude,
                    longitude: row.longitude,
                    date: row.date,
                    observers: row.observers,
                    startTime: row.startTime,
                    endTime: row.endTime,
                    weather: row.weather,
                    water: row.water,
                    season: row.season,
                    statusOfVegy: row.statusOfVegy,
                    radiusOfArea: row.radiusOfArea,
                    descriptor: row.descriptor,
                    birdObservations: [],
                  };
                }
                if (row.species) {
                  surveyMap[row.uniqueId].birdObservations.push({
                    species: row.species || '',
                    count: row.count || '',
                    maturity: row.maturity || '',
                    sex: row.sex || '',
                    behaviour: row.behaviour || '',
                    identification: row.identification || '',
                    status: row.status || '',
                    remarks: row.remarks || '',
                  });
                }
              }
              const items = Object.values(surveyMap);
              const filtered = items.filter((item: any) => {
                const itemD = toLocalDate(item.date);
                if (!itemD) return false;
                const matchStart = !startD || itemD >= startD;
                const matchEnd = !endD || itemD <= endD;
                return matchStart && matchEnd;
              });
              setResults(filtered);
              setIsOffline(true);
              resolve();
            },
            () => {
              setResults([]);
              resolve();
            },
          );
        });
      } catch {
        setResults([]);
        resolve();
      }
    });
  };

  const toggleBirdExpand = (surveyId: string, birdIdx: number) => {
    const key = `${surveyId}-${birdIdx}`;
    setExpandedBirds(prev => ({...prev, [key]: !prev[key]}));
  };

  const handleSearch = async () => {
    const startD = toLocalDate(startText);
    const endD = toLocalDate(endText);
    if (endD) endD.setHours(23, 59, 59, 999);

    setLoading(true);
    setIsOffline(false);

    const netState = await NetInfo.fetch();
    const isOnline = netState.isConnected && netState.isInternetReachable;

    if (isOnline) {
      try {
        const response = await axios.get(`${API_URL}/form-entries?page=1&limit=500`);
        const data = response.data || [];
        const filtered = data.filter((item: any) => {
          const itemD = toLocalDate(item.date);
          if (!itemD) return false;
          const matchStart = !startD || itemD >= startD;
          const matchEnd = !endD || itemD <= endD;
          return matchStart && matchEnd;
        });
        setResults(filtered);
      } catch {
        await loadOfflineData(startD, endD);
      }
    } else {
      await loadOfflineData(startD, endD);
    }

    setShowResults(true);
    setLoading(false);
  };

  const handleEdit = (item: any) => {
    if (onEditItem) {
      onEditItem(item);
    }
  };

  const handleDelete = (item: any, index: number) => {
    Alert.alert('Delete Survey', `Delete survey at ${item.point} on ${item.date}?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/form-entry/${item._id}`);
            setResults(prev => prev.filter((_, i) => i !== index));
            Alert.alert('Success', 'Survey deleted successfully');
          } catch (error) {
            console.error('Delete error:', error);
            Alert.alert('Error', 'Failed to delete survey');
          }
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
            {isOffline && (
              <View style={styles.offlineBanner}>
                <Icon name="wifi-off" size={14} color="#E65100" />
                <Text style={styles.offlineBannerText}>Offline — showing locally saved data</Text>
              </View>
            )}

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

                    {item.birdObservations.map((bird: any, bIdx: number) => {
                      const key = `${item._id}-${bIdx}`;
                      const isExpanded = expandedBirds[key];
                      return (
                        <View key={bIdx} style={styles.birdRow}>
                          <View style={styles.birdHeader}>
                            <View style={styles.birdCountBadge}>
                              <Text style={styles.birdCountText}>{bird.count}</Text>
                            </View>
                            {renderSpeciesName(bird.species)}
                          </View>
                          {isExpanded && (
                            <View style={styles.birdDetails}>
                              {bird.maturity ? <View style={styles.birdTag}><Text style={styles.birdTagLabel}>Maturity:</Text><Text style={styles.birdTagText}>{bird.maturity}</Text></View> : null}
                              {bird.sex ? <View style={styles.birdTag}><Text style={styles.birdTagLabel}>Sex:</Text><Text style={styles.birdTagText}>{bird.sex}</Text></View> : null}
                              {bird.behaviour ? <View style={styles.birdTag}><Text style={styles.birdTagLabel}>Behaviour:</Text><Text style={styles.birdTagText}>{bird.behaviour}</Text></View> : null}
                              {bird.identification ? <View style={styles.birdTag}><Text style={styles.birdTagLabel}>Identification:</Text><Text style={styles.birdTagText}>{bird.identification}</Text></View> : null}
                              {bird.status ? <View style={[styles.birdTag, bird.status === 'Endemic' && styles.endemicTag]}>
                                <Text style={[styles.birdTagLabel, bird.status === 'Endemic' && styles.endemicTagText]}>Status:</Text>
                                <Text style={[styles.birdTagText, bird.status === 'Endemic' && styles.endemicTagText]}>{bird.status}</Text>
                              </View> : null}
                              {bird.remarks ? <View style={styles.birdTag}><Text style={styles.birdTagLabel}>Remarks:</Text><Text style={styles.birdTagText}>{bird.remarks}</Text></View> : null}
                            </View>
                          )}
                          <TouchableOpacity onPress={() => toggleBirdExpand(item._id, bIdx)} style={styles.seeMoreBtn}>
                            <Text style={styles.seeMoreText}>{isExpanded ? 'See Less' : 'See More'}</Text>
                            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={GREEN} />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>

                  {/* Edit & Delete Buttons */}
                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                      style={styles.editButton}
                      activeOpacity={0.7}
                      onPress={() => handleEdit(item)}>
                      <Icon name="pencil-outline" size={18} color="#fff" />
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      activeOpacity={0.7}
                      onPress={() => handleDelete(item, index)}>
                      <Icon name="trash-can-outline" size={18} color="#fff" />
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
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
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateInputFilled: {
    borderColor: GREEN,
  },
  dateLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
    fontWeight: '500',
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  datePlaceholder: {
    color: '#bbb',
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
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    gap: 6,
  },
  offlineBannerText: {
    fontSize: 12,
    color: '#E65100',
    fontWeight: '500',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#f5f5f5',
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
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: GREEN,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
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
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GREEN,
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  birdTagLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
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
  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 6,
    paddingVertical: 4,
  },
  seeMoreText: {
    fontSize: 11,
    color: GREEN,
    fontWeight: '600',
  },
});

export default PureSearchPage;
