import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getDatabase} from '../database/db';
import BarChartDummy from './bar-charts/bar-chart-dummy';
import MiniBarChartDummy from './bar-charts/mini-bar-chart-dummy';
import MiniBarChartDummy1 from './bar-charts/mini-bar-chart-dummy1';

const GREEN = '#2e7d32';

const MainDashboardPage = () => {
  const [avatarUri, setAvatarUri] = useState('');
  const [userName, setUserName] = useState('');
  const navigation = useNavigation<any>();

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

      {/* Main Bar Chart */}
      <View style={styles.chartCard}>
        <BarChartDummy />
      </View>

      {/* Mini Charts */}
      <View style={styles.miniChartsRow}>
        <View style={[styles.chartCard, styles.miniChartCard]}>
          <MiniBarChartDummy title="Statistical Summary" />
        </View>
        <View style={[styles.chartCard, styles.miniChartCard]}>
          <MiniBarChartDummy1 title="Sex Distribution" />
        </View>
      </View>

      {/* Summary Statistics */}
      <Text style={styles.sectionTitle}>Summary</Text>
      <View style={styles.summaryRow}>
        <View style={styles.statCard}>
          <MCIcon name="eye-outline" size={24} color={GREEN} />
          <Text style={styles.statValue}>245</Text>
          <Text style={styles.statLabel}>Observations</Text>
        </View>
        <View style={styles.statCard}>
          <MCIcon name="feather" size={24} color={GREEN} />
          <Text style={styles.statValue}>6</Text>
          <Text style={styles.statLabel}>Species</Text>
        </View>
        <View style={styles.statCard}>
          <MCIcon name="chart-bar" size={24} color={GREEN} />
          <Text style={styles.statValue}>37.5</Text>
          <Text style={styles.statLabel}>Avg. Count</Text>
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
});

export default MainDashboardPage;
