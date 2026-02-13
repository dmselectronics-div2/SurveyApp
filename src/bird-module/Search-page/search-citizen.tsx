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
} from 'react-native';
import {IconButton} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {API_URL} from '../../config';

const GREEN = '#2e7d32';
const GREEN_LIGHT = '#e8f5e9';

const CitySearchPage = ({setShowCitizen}: {setShowCitizen: (v: boolean) => void}) => {
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
      const response = await axios.get(`${API_URL}/citizens?page=1&limit=500`);
      const data = response.data?.data || [];
      const filtered = data.filter((item: any) => {
        const itemDate = item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '';
        const matchStart = !start || itemDate >= start;
        const matchEnd = !end || itemDate <= end;
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
    Alert.alert('Edit Record', `Edit citizen record by ${item.name}?`, [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Edit', onPress: () => console.log('Edit:', item._id)},
    ]);
  };

  const handleDelete = (item: any, index: number) => {
    Alert.alert('Delete Record', `Delete citizen record by ${item.name}?`, [
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowCitizen(false)} style={styles.backBtn}>
          <IconButton icon="arrow-left" iconColor="#333" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Citizen Data</Text>
          <Text style={styles.headerSubtitle}>Browse citizen science records</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Filter Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Icon name="account-group-outline" size={22} color={GREEN} />
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
            <DateTimePicker value={startDate} mode="date" is24Hour display="default" onChange={onChangeStart} />
          )}
          {showEnd && (
            <DateTimePicker value={endDate} mode="date" is24Hour display="default" onChange={onChangeEnd} />
          )}

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
            <Text style={styles.resultsTitle}>Citizen Records ({results.length})</Text>

            {results.length === 0 ? (
              <View style={styles.emptyCard}>
                <Icon name="account-search-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No records found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your date range</Text>
              </View>
            ) : (
              results.map((item, index) => (
                <View key={item._id} style={styles.resultCard}>
                  {/* Record Header */}
                  <View style={styles.resultHeader}>
                    <View style={styles.resultHeaderLeft}>
                      <View style={styles.avatarBadge}>
                        <Icon name="account" size={20} color="#fff" />
                      </View>
                      <View>
                        <Text style={styles.resultName}>{item.name || 'Unknown'}</Text>
                        <Text style={styles.resultDate}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                        <Icon name="pencil-outline" size={18} color={GREEN} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item, index)}>
                        <Icon name="trash-can-outline" size={18} color="#D32F2F" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Details */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Mobile</Text>
                      <Text style={styles.detailValue}>{item.mobile || '-'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Email</Text>
                      <Text style={styles.detailValue}>{item.email || '-'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Latitude</Text>
                      <Text style={styles.detailValue}>{item.latitude || '-'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Longitude</Text>
                      <Text style={styles.detailValue}>{item.longitude || '-'}</Text>
                    </View>
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
  dateRow: {flexDirection: 'row', gap: 12},
  dateInput: {
    flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fafafa', borderRadius: 12, borderWidth: 1.5, borderColor: '#e0e0e0',
    paddingHorizontal: 14, paddingVertical: 12,
  },
  dateInputFilled: {borderColor: GREEN, backgroundColor: GREEN_LIGHT},
  dateLabel: {fontSize: 11, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2},
  dateValue: {fontSize: 14, fontWeight: '500', color: '#333'},
  datePlaceholder: {color: '#bbb'},
  searchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14, marginTop: 20, gap: 8,
  },
  searchBtnText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  resultsSection: {marginTop: 24},
  resultsTitle: {fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 14},
  emptyCard: {
    alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 40,
    elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3,
    borderWidth: 1, borderColor: '#f0f0f0',
  },
  emptyText: {fontSize: 16, fontWeight: '600', color: '#999', marginTop: 12},
  emptySubtext: {fontSize: 13, color: '#bbb', marginTop: 4},
  resultCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, elevation: 2,
    shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.08, shadowRadius: 4,
    borderWidth: 1, borderColor: '#f0f0f0',
  },
  resultHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  resultHeaderLeft: {flexDirection: 'row', alignItems: 'center', gap: 10},
  avatarBadge: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: GREEN,
    justifyContent: 'center', alignItems: 'center',
  },
  resultName: {fontSize: 15, fontWeight: '600', color: '#1a1a1a'},
  resultDate: {fontSize: 12, color: '#888', marginTop: 1},
  actionRow: {flexDirection: 'row', gap: 6},
  editBtn: {width: 36, height: 36, borderRadius: 10, backgroundColor: GREEN_LIGHT, justifyContent: 'center', alignItems: 'center'},
  deleteBtn: {width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center'},
  detailsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12},
  detailItem: {backgroundColor: '#fafafa', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, minWidth: '30%', flexGrow: 1},
  detailLabel: {fontSize: 10, fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2},
  detailValue: {fontSize: 13, fontWeight: '500', color: '#333'},
});

export default CitySearchPage;
