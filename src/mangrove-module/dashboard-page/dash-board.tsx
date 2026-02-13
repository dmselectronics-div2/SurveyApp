import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BarChart, PieChart} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const GREEN = '#2e7d32';

const ByvalviDashboard = () => {
  const navigation = useNavigation<any>();

  // -----------------------------
  // 6 Selected Species (Dummy Data)
  // -----------------------------
  const barData = {
    labels: ['EG', 'MC', 'LC', 'NP', 'CS', 'MB1'],
    datasets: [
      {
        data: [34, 52, 28, 41, 19, 47],
      },
    ],
  };

  const pieData = [
    {
      name: 'Ellobium gangeticum (EG)',
      population: 34,
      color: '#1b5e20',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Melampus ceylonicus (MC)',
      population: 52,
      color: '#2e7d32',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Littoraria scabra (LC)',
      population: 28,
      color: '#388e3c',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Nerita polita (NP)',
      population: 41,
      color: '#43a047',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Corbicula solida (CS)',
      population: 19,
      color: '#66bb6a',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Magallana belcheri (MB1)',
      population: 47,
      color: '#81c784',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    labelColor: () => '#333',
    propsForBackgroundLines: {
      stroke: '#e0e0e0',
    },
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ModuleSelector')}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Byvalvi Dashboard</Text>
      </View>

      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.iconContainer}>
          <MCIcon name="snail" size={48} color={GREEN} />
        </View>
        <Text style={styles.title}>
          Welcome to the Byvalvi Survey Module
        </Text>
        <Text style={styles.subtitle}>
          Start collecting bivalve and gastropod observation data
        </Text>
      </View>

      {/* Analytics Section */}
      <Text style={styles.sectionTitle}>Byvalvi Survey Analytics</Text>

      {/* Bar Chart Card */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Species Count</Text>
        <BarChart
          data={barData}
          width={screenWidth - 50}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={20}
          fromZero
          showValuesOnTopOfBars
          style={styles.chartStyle}
        />
      </View>

      {/* Pie Chart Card */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Observation Distribution</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 50}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
          absolute
        />
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GREEN,
    marginBottom: 12,
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
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: GREEN,
    marginBottom: 10,
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
  chartStyle: {
    borderRadius: 12,
  },
});

export default ByvalviDashboard;
