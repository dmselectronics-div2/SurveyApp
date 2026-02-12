import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Appearance,
  TouchableOpacity,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {getDatabase} from '../database/db';
import BarChartDummy from './bar-charts/bar-chart-dummy';
import MiniBarChartDummy from './bar-charts/mini-bar-chart-dummy';
import MiniBarChartDummy1 from './bar-charts/mini-bar-chart-dummy1';

const MainDashboardPage = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [avatarUri, setAvatarUri] = useState('');
  const [userName, setUserName] = useState('');
  const navigation = useNavigation<any>();

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

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

  const isDarkMode = theme === 'dark';

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#121212' : '#fff'},
      ]}>
      {/* Header with avatar */}
      <View
        style={[
          styles.header,
          {backgroundColor: isDarkMode ? '#1e1e1e' : '#fff'},
        ]}>
        <Text
          style={[
            styles.headerTitle,
            {color: isDarkMode ? '#fff' : '#333'},
          ]}>
          Birds Dashboard
        </Text>
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

      {/* Welcome card */}
      <View style={styles.title_container}>
        <View
          style={[
            styles.whiteBox,
            {
              backgroundColor: isDarkMode
                ? 'rgb(2, 93, 32)'
                : 'rgba(84, 200, 86, 0.7)',
            },
          ]}>
          <Text
            style={[styles.main_text, {color: isDarkMode ? 'white' : 'black'}]}>
            {userName ? `Welcome, ${userName}` : 'Welcome to the Bird Survey Module'}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: isDarkMode ? '#ccc' : '#59c959',
              marginTop: 20,
              textAlign: 'center',
            }}>
            Start collecting bird observation data
          </Text>
        </View>
      </View>

      {/* Charts Section */}
      <View style={styles.chartSectionTitle}>
        <Text style={[styles.sectionTitle, {color: isDarkMode ? '#fff' : '#333'}]}>
          📊 Bird Survey Analytics
        </Text>
      </View>

      {/* Main Bar Chart */}
      <View style={[styles.chartWrapper, {backgroundColor: isDarkMode ? '#1e1e1e' : '#fff'}]}>
        <BarChartDummy />
      </View>

      {/* Mini Charts Container */}
      <View style={styles.miniChartsContainer}>
        <View style={[styles.miniChartWrapper, {backgroundColor: isDarkMode ? '#1e1e1e' : '#fff'}]}>
          <MiniBarChartDummy title="Statistical Summary" />
        </View>
        <View style={[styles.miniChartWrapper, {backgroundColor: isDarkMode ? '#1e1e1e' : '#fff'}]}>
          <MiniBarChartDummy1 title="Sex Distribution" />
        </View>
      </View>

      {/* Summary Statistics */}
      <View style={styles.summaryContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Observations</Text>
          <Text style={[styles.statValue, {color: '#4A7856'}]}>245</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Species Recorded</Text>
          <Text style={[styles.statValue, {color: '#1976D2'}]}>6</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg. Count</Text>
          <Text style={[styles.statValue, {color: '#D32F2F'}]}>37.5</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'InriaSerif-Bold',
  },
  title_container: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    marginTop: '2%',
    marginBottom: '5%',
  },
  main_text: {
    fontSize: 22,
    fontFamily: 'InriaSerif-Bold',
    marginTop: 10,
  },
  whiteBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 200,
    marginHorizontal: 0,
    marginTop: 10,
  },
  chartSectionTitle: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'InriaSerif-Bold',
  },
  chartWrapper: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  miniChartsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginVertical: 10,
  },
  miniChartWrapper: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginVertical: 20,
    marginBottom: 30,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    minWidth: 100,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'InriaSerif-Bold',
  },
});

export default MainDashboardPage;
