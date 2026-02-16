import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BarChart, PieChart} from 'react-native-chart-kit';
import axios from 'axios';
import {API_URL} from '../../config';
import {getDatabase} from '../../bird-module/database/db';
import BarChartByvalvi from './bar-charts/habitat-type-chart';
import LocationPieChart from './bar-charts/location-chart';
import MiniSamplingChart from './bar-charts/sampling-method-chart';

const screenWidth = Dimensions.get('window').width;
const GREEN = '#2e7d32';

const PIE_COLORS = [
  '#1b5e20', '#2e7d32', '#388e3c', '#43a047', '#4caf50',
  '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9', '#00695c',
  '#00897b', '#009688', '#26a69a', '#4db6ac',
];

const ByvalviDashboard = () => {
  const navigation = useNavigation<any>();
  const [avatarUri, setAvatarUri] = useState('');
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalSurveys: 0,
    totalSpecimenCount: 0,
    speciesWithData: 0,
    uniqueLocations: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [speciesData, setSpeciesData] = useState<any>(null);
  const [speciesLoading, setSpeciesLoading] = useState(true);
  const [pieData, setPieData] = useState<any[]>([]);

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
        const response = await axios.get(`${API_URL}/bivalvi-stats`);
        setStats({
          totalSurveys: response.data?.total || 0,
          totalSpecimenCount: response.data?.totalSpecimenCount || 0,
          speciesWithData: response.data?.speciesWithData || 0,
          uniqueLocations: response.data?.uniqueLocations || 0,
        });
      } catch (error) {
        console.log('Error fetching bivalvi stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await axios.get(`${API_URL}/bivalvi-species`);
        const data = response.data;

        if (!data || data.length === 0) {
          setSpeciesData(null);
          setPieData([]);
          setSpeciesLoading(false);
          return;
        }

        // Top 8 species for bar chart
        const top8 = data.slice(0, 8);
        setSpeciesData({
          labels: top8.map((s: any) => s.name.split(' ')[0].substring(0, 6)),
          datasets: [{data: top8.map((s: any) => s.count)}],
        });

        // All species for pie chart
        const pie = data.map((s: any, index: number) => ({
          name: s.name,
          population: s.count,
          color: PIE_COLORS[index % PIE_COLORS.length],
          legendFontColor: '#333',
          legendFontSize: 11,
        }));
        setPieData(pie);
      } catch (error) {
        console.error('Error fetching bivalvi species:', error);
        setSpeciesData(null);
        setPieData([]);
      } finally {
        setSpeciesLoading(false);
      }
    };
    fetchSpecies();
  }, []);

  const hasBarData =
    speciesData &&
    speciesData.datasets &&
    speciesData.datasets[0] &&
    speciesData.datasets[0].data.some((v: number) => v > 0);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ModuleSelector')}
            style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Byvalvi Dashboard</Text>
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
          <MCIcon name="snail" size={48} color={GREEN} />
        </View>
        <Text style={styles.title}>
          {userName
            ? `Welcome, ${userName}`
            : 'Welcome to the Byvalvi Survey Module'}
        </Text>
        <Text style={styles.subtitle}>
          Start collecting bivalve and gastropod observation data
        </Text>
      </View>

      {/* Analytics Section */}
      <Text style={styles.sectionTitle}>Byvalvi Survey Analytics</Text>

      {/* Species Bar Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartTitleRow}>
          <View style={styles.titleDot} />
          <Text style={styles.chartTitle}>Species Count</Text>
        </View>
        <Text style={styles.chartSubtitle}>Top observed species across surveys</Text>
        {speciesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={GREEN} />
            <Text style={styles.loadingText}>Loading chart...</Text>
          </View>
        ) : hasBarData ? (
          <BarChart
            style={styles.chartStyle}
            data={speciesData}
            width={screenWidth - 64}
            height={220}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#f8fdf8',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(75, 75, 75, ${opacity})`,
              barPercentage: 0.6,
              fillShadowGradient: '#43a047',
              fillShadowGradientOpacity: 0.9,
              propsForBackgroundLines: {
                stroke: '#e8f5e9',
                strokeWidth: 1,
              },
              propsForLabels: {
                fontSize: 10,
              },
            }}
            verticalLabelRotation={35}
            showValuesOnTopOfBars={true}
            withInnerLines={true}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.noDataText}>No species data yet</Text>
            <Text style={styles.noDataHint}>Submit a survey to see analytics</Text>
          </View>
        )}
      </View>

      {/* Species Pie Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartTitleRow}>
          <View style={styles.titleDot} />
          <Text style={styles.chartTitle}>Species Distribution</Text>
        </View>
        <Text style={styles.chartSubtitle}>Proportion of each species observed</Text>
        {speciesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={GREEN} />
          </View>
        ) : pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth - 50}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.noDataText}>No distribution data yet</Text>
          </View>
        )}
      </View>

      {/* Habitat Type Chart (already fetches real data) */}
      <View style={styles.chartCard}>
        <BarChartByvalvi />
      </View>

      {/* Location Pie Chart (already fetches real data) */}
      <View style={styles.chartCard}>
        <LocationPieChart title="Surveys by Location" />
      </View>

      {/* Sampling Method Chart */}
      <View style={styles.chartCard}>
        <MiniSamplingChart title="Sampling Methods" />
      </View>

      {/* Summary Statistics */}
      <Text style={styles.sectionTitle}>Summary</Text>
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
          <MCIcon name="bug-outline" size={24} color={GREEN} />
          {statsLoading ? (
            <ActivityIndicator size="small" color={GREEN} style={{marginTop: 8}} />
          ) : (
            <Text style={styles.statValue}>{stats.speciesWithData}</Text>
          )}
          <Text style={styles.statLabel}>Species</Text>
        </View>
      </View>
      <View style={[styles.summaryRow, {marginTop: 8}]}>
        <View style={styles.statCard}>
          <MCIcon name="eye-outline" size={24} color={GREEN} />
          {statsLoading ? (
            <ActivityIndicator size="small" color={GREEN} style={{marginTop: 8}} />
          ) : (
            <Text style={styles.statValue}>{stats.totalSpecimenCount}</Text>
          )}
          <Text style={styles.statLabel}>Specimens</Text>
        </View>
        <View style={styles.statCard}>
          <MCIcon name="map-marker-outline" size={24} color={GREEN} />
          {statsLoading ? (
            <ActivityIndicator size="small" color={GREEN} style={{marginTop: 8}} />
          ) : (
            <Text style={styles.statValue}>{stats.uniqueLocations}</Text>
          )}
          <Text style={styles.statLabel}>Locations</Text>
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
    alignItems: 'center',
  },
  chartTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2e7d32',
    marginRight: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b5e20',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 12,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 200,
  },
  loadingText: {
    fontSize: 13,
    color: '#888',
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  noDataHint: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
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
});

export default ByvalviDashboard;
