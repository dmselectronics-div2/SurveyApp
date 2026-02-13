import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import axios from 'axios';
import {API_URL} from '../../../config';

const PIE_COLORS = [
  '#2e7d32',
  '#1976D2',
  '#D32F2F',
  '#F57C00',
  '#7B1FA2',
  '#00838F',
  '#C2185B',
  '#455A64',
  '#AFB42B',
  '#6D4C41',
];

const LocationPieChart = ({title}: {title?: string}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  const {width} = Dimensions.get('window');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/bivalvi-form-entries?page=1&limit=500`,
        );
        const entries = response.data?.data || [];

        if (entries.length === 0) {
          setHasData(false);
        } else {
          const locationCounts: Record<string, number> = {};
          entries.forEach((entry: any) => {
            const location = entry.Location || 'Unknown';
            locationCounts[location] = (locationCounts[location] || 0) + 1;
          });

          const pieData = Object.entries(locationCounts).map(
            ([name, count], index) => ({
              name: name.length > 12 ? name.substring(0, 12) + '...' : name,
              population: count,
              color: PIE_COLORS[index % PIE_COLORS.length],
              legendFontColor: '#333',
              legendFontSize: 11,
            }),
          );

          setChartData(pieData);
          setHasData(pieData.length > 0);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching byvalvi location data:', error);
        setHasData(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.chartBox}>
      <Text style={styles.chartTitle}>{title || 'Surveys by Location'}</Text>
      <View style={styles.chartContainer}>
        {hasData ? (
          <PieChart
            data={chartData}
            width={width - 60}
            height={180}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        ) : (
          <Text style={styles.noDataText}>No location data available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 220,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    marginVertical: 20,
  },
});

export default LocationPieChart;
