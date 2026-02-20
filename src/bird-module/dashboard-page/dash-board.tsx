import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import MapView, {Marker} from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import {API_URL, API_KEY} from '../../config';
import {getDatabase} from '../database/db';
import BarChartModel from './bar-charts/bar-chart';
import HabitatBarChart from './bar-charts/habitat-bar-chart';
import {checkNetworkStatus} from '../../assets/sql_lite/sync_service';
import {getDashboardCache, setDashboardCache} from '../../assets/sql_lite/db_connection';
import NetworkStatusBanner from '../../components/NetworkStatusBanner';

const GREEN = '#2e7d32';

const MainDashboardPage = () => {
  const [avatarUri, setAvatarUri] = useState('');
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalSurveys: 0,
    totalSpecies: 0,
    totalBirdCount: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [location, setLocation] = useState<{lat: number; lon: number} | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [dataSource, setDataSource] = useState<'cloud' | 'cache'>('cloud');
  const navigation = useNavigation<any>();

  useEffect(() => {
    const requestLocationAndFetch = async () => {
      try {
        if (Platform.OS === 'android') {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
        }
        const loc = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });
        setLocation({lat: loc.latitude, lon: loc.longitude});
      } catch (error) {
        console.log('Location error:', error);
        setWeatherLoading(false);
      }
    };
    requestLocationAndFetch();
  }, []);

  useEffect(() => {
    if (!location) return;
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location.lat},${location.lon}`,
        );
        setWeather(res.data);
      } catch (error) {
        console.log('Weather error:', error);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, [location]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const db = await getDatabase();
        db.transaction((tx: any) => {
          tx.executeSql(
            'SELECT email FROM LoginData',
            [],
            (tx: any, loginResults: any) => {
              if (loginResults.rows.length > 0) {
                const emailLocal = loginResults.rows.item(0).email;
                tx.executeSql(
                  'SELECT userImageUrl, name FROM Users WHERE email = ?',
                  [emailLocal],
                  (_tx: any, userResults: any) => {
                    if (userResults.rows.length > 0) {
                      const row = userResults.rows.item(0);
                      if (row.userImageUrl) setAvatarUri(row.userImageUrl);
                      if (row.name) setUserName(row.name);
                    }
                  },
                );
              }
            },
          );
        });
      } catch (error: any) {
        console.log('Error loading user data: ' + error.message);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const online = await checkNetworkStatus();
        setIsOnline(online);

        if (online) {
          // ONLINE: fetch from cloud and cache
          const [speciesRes, statsRes] = await Promise.all([
            axios.get(`${API_URL}/bird-species`),
            axios.get(`${API_URL}/bird-stats`),
          ]);

          const speciesCount = Array.isArray(speciesRes.data) ? speciesRes.data.length : 0;
          const totalSurveys = statsRes.data?.total || 0;
          const totalBirdCount = statsRes.data?.totalBirdCount || 0;

          setStats({ totalSurveys, totalSpecies: speciesCount, totalBirdCount });
          setDataSource('cloud');

          // Cache for offline use
          await setDashboardCache('bird_species', speciesRes.data);
          await setDashboardCache('bird_stats', statsRes.data);
        } else {
          // OFFLINE: load from cache
          const cachedSpecies = await getDashboardCache('bird_species');
          const cachedStats = await getDashboardCache('bird_stats');

          if (cachedSpecies && cachedStats) {
            const speciesCount = Array.isArray(cachedSpecies.data) ? cachedSpecies.data.length : 0;
            const totalSurveys = cachedStats.data?.total || 0;
            const totalBirdCount = cachedStats.data?.totalBirdCount || 0;
            setStats({ totalSurveys, totalSpecies: speciesCount, totalBirdCount });
            setDataSource('cache');
          }
        }
      } catch (error) {
        console.log('Error fetching stats:', error);
        // Fallback to cache on error
        try {
          const cachedSpecies = await getDashboardCache('bird_species');
          const cachedStats = await getDashboardCache('bird_stats');
          if (cachedSpecies && cachedStats) {
            const speciesCount = Array.isArray(cachedSpecies.data) ? cachedSpecies.data.length : 0;
            setStats({
              totalSurveys: cachedStats.data?.total || 0,
              totalSpecies: speciesCount,
              totalBirdCount: cachedStats.data?.totalBirdCount || 0,
            });
            setDataSource('cache');
          }
        } catch (cacheError) {
          console.log('Cache fallback also failed:', cacheError);
        }
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      {/* Note: NetworkStatusBanner is rendered by parent BottomNavbar */}

      {/* Header */}
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ModuleSelector')}
            style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Birds Dashboard</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileMenu')}>
          <Avatar.Image
            size={40}
            source={
              avatarUri
                ? {uri: avatarUri}
                : require('../../assets/image/prof.jpg')
            }
          />
        </TouchableOpacity>
      </View>

      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.iconContainer}>
          <MCIcon name="bird" size={48} color={GREEN} />
        </View>
        <Text style={styles.title}>
          {userName
            ? `Welcome, ${userName}`
            : 'Welcome to the Bird Survey Module'}
        </Text>
        <Text style={styles.subtitle}>
          Start collecting bird observation data
        </Text>
      </View>

      {/* Analytics Section */}
      <Text style={styles.sectionTitle}>Bird Survey Analytics</Text>

      {/* Main Bar Chart - Species Count */}
      <View style={styles.chartCard}>
        <BarChartModel />
      </View>

      {/* Habitat Distribution Chart */}
      <View style={styles.chartCard}>
        <HabitatBarChart title="Habitat Distribution" />
      </View>

      {/* Weather Card */}
      <TouchableOpacity
        style={styles.chartCard}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('BirdMapPage')}>
        <View style={styles.weatherBox}>
          <View style={styles.weatherTitleRow}>
            <View style={styles.weatherTitleDot} />
            <Text style={styles.weatherTitle}>Current Weather</Text>
          </View>
          {weatherLoading ? (
            <ActivityIndicator size="small" color={GREEN} style={{marginTop: 40}} />
          ) : weather ? (
            <>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.miniMap}
                  region={{
                    latitude: location?.lat || 7.7,
                    longitude: location?.lon || 79.8,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}>
                  {location && (
                    <Marker
                      coordinate={{latitude: location.lat, longitude: location.lon}}
                      title="You"
                    />
                  )}
                </MapView>
              </View>
              <View style={styles.weatherInfoRow}>
                <Image
                  source={{uri: `https:${weather.current.condition.icon}`}}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherTemp}>{Math.round(weather.current.temp_c)}°C</Text>
              </View>
              <Text style={styles.weatherCondition}>{weather.current.condition.text}</Text>
              <View style={styles.weatherDetailsRow}>
                <View style={styles.weatherDetail}>
                  <MCIcon name="water-outline" size={14} color="#666" />
                  <Text style={styles.weatherDetailText}>{weather.current.humidity}%</Text>
                </View>
                <View style={styles.weatherDetail}>
                  <MCIcon name="weather-windy" size={14} color="#666" />
                  <Text style={styles.weatherDetailText}>{weather.current.wind_kph} km/h</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.weatherNoData}>No weather data</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Summary Statistics */}
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12}}>
          <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: dataSource === 'cloud' ? '#10B981' : '#F59E0B'}} />
          <Text style={{fontSize: 10, color: dataSource === 'cloud' ? '#10B981' : '#F59E0B', fontWeight: '600'}}>
            {dataSource === 'cloud' ? 'Live Data' : 'Cached Data'}
          </Text>
        </View>
      </View>
      <View style={styles.summaryRow}>
        <View style={styles.statCard}>
          <MCIcon name="clipboard-text-outline" size={24} color={GREEN} />
          {statsLoading ? (
            <ActivityIndicator size="small" color={GREEN} style={{marginTop: 8}} />
          ) : (
            <Text style={styles.statValue}>{stats.totalSurveys}</Text>
          )}
          <Text style={styles.statLabel}>Surveys</Text>
        </View>
        <View style={styles.statCard}>
          <MCIcon name="feather" size={24} color={GREEN} />
          {statsLoading ? (
            <ActivityIndicator size="small" color={GREEN} style={{marginTop: 8}} />
          ) : (
            <Text style={styles.statValue}>{stats.totalSpecies}</Text>
          )}
          <Text style={styles.statLabel}>Species</Text>
        </View>
        <View style={styles.statCard}>
          <MCIcon name="eye-outline" size={24} color={GREEN} />
          {statsLoading ? (
            <ActivityIndicator size="small" color={GREEN} style={{marginTop: 8}} />
          ) : (
            <Text style={styles.statValue}>{stats.totalBirdCount}</Text>
          )}
          <Text style={styles.statLabel}>Observations</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f4f7f5',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 22,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
  },
  iconContainer: {
    width: 85,
    height: 85,
    borderRadius: 42,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GREEN,
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  miniChartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  miniChartCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  weatherBox: {
    alignItems: 'center',
  },
  weatherTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherTitleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#388e3c',
    marginRight: 6,
  },
  weatherTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1b5e20',
  },
  mapContainer: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  miniMap: {
    width: '100%',
    height: '100%',
  },
  weatherInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  weatherIcon: {
    width: 36,
    height: 36,
  },
  weatherTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  weatherCondition: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
  },
  weatherDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  weatherDetailText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  weatherNoData: {
    fontSize: 12,
    color: '#999',
    marginTop: 40,
  },
});

export default MainDashboardPage;
