import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import SyncStatusIndicator, { SyncStatusLegend } from '../../components/SyncStatusIndicator';
import type { SyncStatus } from '../../components/SyncStatusIndicator';
import { checkNetworkStatus } from '../../assets/sql_lite/sync_service';
import { getPendingRecords } from '../../assets/sql_lite/db_connection';
import NetworkStatusBanner from '../../components/NetworkStatusBanner';

const { width } = Dimensions.get('window');

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString();
};

// Helper function to format values
const formatValue = (value: any) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (typeof value === 'object' && value.latitude !== undefined) {
    return `${value.latitude?.toFixed(4)}, ${value.longitude?.toFixed(4)}`;
  }
  return String(value);
};

type CategoryType = 'plants' | 'animals' | 'nature' | 'human-activity';

interface CategoryConfig {
  key: CategoryType;
  label: string;
  labelSi: string;
  labelTa: string;
  endpoint: string;
  columns: { key: string; label: string }[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'plants',
    label: 'Plants',
    labelSi: 'ශාක',
    labelTa: 'தாவரங்கள்',
    endpoint: '/api/plants',
    columns: [
      { key: 'plantCategory', label: 'Category' },
      { key: 'plantType', label: 'Type' },
      { key: 'commonName', label: 'Common Name' },
      { key: 'scientificName', label: 'Scientific Name' },
      { key: 'date', label: 'Date' },
      { key: 'timeOfDay', label: 'Time' },
      { key: 'description', label: 'Description' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' },
    ],
  },
  {
    key: 'animals',
    label: 'Animals',
    labelSi: 'සතුන්',
    labelTa: 'விலங்குகள்',
    endpoint: '/api/animals',
    columns: [
      { key: 'animalType', label: 'Type' },
      { key: 'commonName', label: 'Common Name' },
      { key: 'scientificName', label: 'Scientific Name' },
      { key: 'date', label: 'Date' },
      { key: 'timeOfDay', label: 'Time' },
      { key: 'description', label: 'Description' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' },
    ],
  },
  {
    key: 'nature',
    label: 'Nature',
    labelSi: 'පරිසරය',
    labelTa: 'இயற்கை',
    endpoint: '/api/nature',
    columns: [
      { key: 'natureType', label: 'Type' },
      { key: 'date', label: 'Date' },
      { key: 'timeOfDay', label: 'Time' },
      { key: 'description', label: 'Description' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' },
    ],
  },
  {
    key: 'human-activity',
    label: 'Human Activity',
    labelSi: 'මානව ක්‍රියාකාරකම්',
    labelTa: 'மனித செயற்பாடுகள்',
    endpoint: '/api/human-activity',
    columns: [
      { key: 'activityType', label: 'Activity Type' },
      { key: 'date', label: 'Date' },
      { key: 'timeOfDay', label: 'Time' },
      { key: 'description', label: 'Description' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' },
    ],
  },
];

const CitizenDataTable = () => {
  const navigation = useNavigation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('plants');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [dataSource, setDataSource] = useState<'cloud' | 'local'>('cloud');

  const translations = {
    en: {
      title: 'Submitted Data',
      noData: 'No data available',
      loading: 'Loading...',
      error: 'Error loading data',
      retry: 'Retry',
      showing: 'Showing',
      of: 'of',
      entries: 'entries',
      page: 'Page',
      prev: 'Previous',
      next: 'Next',
      photo: 'Photo',
      viewImage: 'View Image',
    },
    si: {
      title: 'ඉදිරිපත් කළ දත්ත',
      noData: 'දත්ත නොමැත',
      loading: 'පූරණය වෙමින්...',
      error: 'දත්ත පූරණයේ දෝෂයක්',
      retry: 'නැවත උත්සාහ කරන්න',
      showing: 'පෙන්වමින්',
      of: 'න්',
      entries: 'ඇතුළත් කිරීම්',
      page: 'පිටුව',
      prev: 'පෙර',
      next: 'ඊළඟ',
      photo: 'ඡායාරූපය',
      viewImage: 'රූපය බලන්න',
    },
    ta: {
      title: 'சமர்ப்பிக்கப்பட்ட தரவு',
      noData: 'தரவு இல்லை',
      loading: 'ஏற்றுகிறது...',
      error: 'தரவை ஏற்றுவதில் பிழை',
      retry: 'மீண்டும் முயற்சிக்கவும்',
      showing: 'காட்டுகிறது',
      of: 'இல்',
      entries: 'உள்ளீடுகள்',
      page: 'பக்கம்',
      prev: 'முந்தைய',
      next: 'அடுத்து',
      photo: 'புகைப்படம்',
      viewImage: 'படத்தைப் பார்க்கவும்',
    },
  };

  useEffect(() => {
    loadLanguage();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, currentPage]);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  const getCategoryConfig = () => {
    return CATEGORIES.find(cat => cat.key === selectedCategory) || CATEGORIES[0];
  };

  const getCategoryLabel = (cat: CategoryConfig) => {
    if (currentLanguage === 'si') return cat.labelSi;
    if (currentLanguage === 'ta') return cat.labelTa;
    return cat.label;
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const online = await checkNetworkStatus();
      setIsOnline(online);

      if (online) {
        // ONLINE: fetch from cloud
        const categoryConfig = getCategoryConfig();
        const response = await fetch(
          `${API_URL}${categoryConfig.endpoint}?page=${currentPage}&limit=20`
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        if (result.data && Array.isArray(result.data)) {
          // Add sync_status to cloud data
          setData(result.data.map((item: any) => ({ ...item, sync_status: 'synced' })));
          if (result.pagination) {
            setTotalPages(result.pagination.pages);
            setTotalEntries(result.pagination.total);
          }
        } else if (Array.isArray(result)) {
          setData(result.map((item: any) => ({ ...item, sync_status: 'synced' })));
        } else {
          setData([]);
        }
        setDataSource('cloud');
      } else {
        // OFFLINE: load from local SQLite
        const tableMap: Record<CategoryType, string> = {
          'plants': 'plants',
          'animals': 'animals',
          'nature': 'nature',
          'human-activity': 'human_activities',
        };
        const tableName = tableMap[selectedCategory];
        try {
          const localRecords = await getPendingRecords(tableName);
          // getPendingRecords only gets 'pending' - we need all records for display
          // Use a broader query from db_connection
          const { default: SQLite } = await import('react-native-sqlite-storage');
          const db = SQLite.openDatabase({ name: 'BluTally.db', location: 'default' }, () => {}, () => {});
          const allRecords: any[] = await new Promise((resolve) => {
            db.transaction((tx: any) => {
              tx.executeSql(
                `SELECT * FROM ${tableName} ORDER BY created_at DESC LIMIT 50`,
                [],
                (_: any, results: any) => {
                  const rows = [];
                  for (let i = 0; i < results.rows.length; i++) {
                    rows.push(results.rows.item(i));
                  }
                  resolve(rows);
                },
                () => { resolve([]); return false; },
              );
            });
          });
          setData(allRecords);
          setTotalEntries(allRecords.length);
          setTotalPages(1);
        } catch (localErr) {
          console.log('Error loading local data:', localErr);
          setData([]);
        }
        setDataSource('local');
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setIsLoading(false);
      setData([]);
    }
  };

  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleImagePress = (imageUri: string) => {
    setSelectedImage(imageUri);
    setImageModalVisible(true);
  };

  const renderCategoryTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabsContainer}
    >
      {CATEGORIES.map(cat => (
        <TouchableOpacity
          key={cat.key}
          style={[
            styles.tab,
            selectedCategory === cat.key && styles.tabActive,
          ]}
          onPress={() => handleCategoryChange(cat.key)}
        >
          <Text
            style={[
              styles.tabText,
              selectedCategory === cat.key && styles.tabTextActive,
            ]}
          >
            {getCategoryLabel(cat)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTableHeader = () => {
    const categoryConfig = getCategoryConfig();
    return (
      <View style={styles.tableHeader}>
        <View style={[styles.headerCell, { width: 40 }]}>
          <Text style={styles.headerText}>Sync</Text>
        </View>
        <View style={[styles.headerCell, { width: 50 }]}>
          <Text style={styles.headerText}>#</Text>
        </View>
        <View style={[styles.headerCell, { width: 80 }]}>
          <Text style={styles.headerText}>{t.photo}</Text>
        </View>
        {categoryConfig.columns.map(col => (
          <View key={col.key} style={[styles.headerCell, { width: 120 }]}>
            <Text style={styles.headerText}>{col.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderTableRow = (item: any, index: number) => {
    const categoryConfig = getCategoryConfig();
    const syncStatus: SyncStatus = item.sync_status || 'synced';
    return (
      <View key={item._id || item.id || index} style={styles.tableRow}>
        <View style={[styles.cell, { width: 40, alignItems: 'center' }]}>
          <SyncStatusIndicator status={syncStatus} />
        </View>
        <View style={[styles.cell, { width: 50 }]}>
          <Text style={styles.cellText}>{(currentPage - 1) * 20 + index + 1}</Text>
        </View>
        <View style={[styles.cell, { width: 80 }]}>
          {item.photo ? (
            <TouchableOpacity onPress={() => handleImagePress(item.photo)}>
              <Image
                source={{ uri: item.photo }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : (
            <Icon name="image-not-supported" size={24} color="#ccc" />
          )}
        </View>
        {categoryConfig.columns.map(col => (
          <View key={col.key} style={[styles.cell, { width: 120 }]}>
            <Text style={styles.cellText} numberOfLines={2}>
              {col.key === 'date'
                ? formatDate(item[col.key])
                : formatValue(item[col.key])}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <Text style={styles.paginationText}>
        {t.showing} {Math.min(data.length, 20)} {t.of} {totalEntries} {t.entries}
      </Text>
      <View style={styles.paginationButtons}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
          onPress={handlePrevPage}
          disabled={currentPage === 1}
        >
          <Icon name="chevron-left" size={24} color={currentPage === 1 ? '#ccc' : '#4A7856'} />
        </TouchableOpacity>
        <Text style={styles.pageText}>
          {t.page} {currentPage} / {totalPages}
        </Text>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <Icon name="chevron-right" size={24} color={currentPage === totalPages ? '#ccc' : '#4A7856'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderImageModal = () => (
    <Modal
      visible={imageModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setImageModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Icon name="close" size={28} color="#fff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Network Status */}
        <NetworkStatusBanner showSyncButton={true} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={28} color="#4A7856" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.title}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
            <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: dataSource === 'cloud' ? '#10B981' : '#F59E0B'}} />
            <Text style={{fontSize: 10, color: dataSource === 'cloud' ? '#10B981' : '#F59E0B', fontWeight: '600'}}>
              {dataSource === 'cloud' ? 'Cloud' : 'Local'}
            </Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
            <Icon name="refresh" size={24} color="#4A7856" />
          </TouchableOpacity>
        </View>

        {/* Sync Status Legend */}
        <SyncStatusLegend />

        {/* Category Tabs */}
        {renderCategoryTabs()}

        {/* Content */}
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#4A7856" />
            <Text style={styles.loadingText}>{t.loading}</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Icon name="error-outline" size={50} color="#e74c3c" />
            <Text style={styles.errorText}>{t.error}</Text>
            <Text style={styles.errorDetail}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
              <Text style={styles.retryButtonText}>{t.retry}</Text>
            </TouchableOpacity>
          </View>
        ) : data.length === 0 ? (
          <View style={styles.centerContainer}>
            <Icon name="inbox" size={50} color="#ccc" />
            <Text style={styles.noDataText}>{t.noData}</Text>
          </View>
        ) : (
          <>
            {renderPagination()}
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View>
                {renderTableHeader()}
                <ScrollView style={styles.tableBody}>
                  {data.map((item, index) => renderTableRow(item, index))}
                </ScrollView>
              </View>
            </ScrollView>
          </>
        )}

        {renderImageModal()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#4A7856',
    borderRadius: 15,
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A7856',
    fontFamily: 'Times New Roman',
  },
  refreshButton: {
    padding: 5,
  },
  tabsContainer: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 5,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#4A7856',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Times New Roman',
  },
  tabTextActive: {
    color: '#4A7856',
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  errorDetail: {
    marginTop: 5,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#4A7856',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  paginationText: {
    fontSize: 12,
    color: '#666',
  },
  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageButton: {
    padding: 5,
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#4A7856',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4A7856',
    paddingVertical: 12,
  },
  headerCell: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  tableBody: {
    maxHeight: 400,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  cell: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});

export default CitizenDataTable;
