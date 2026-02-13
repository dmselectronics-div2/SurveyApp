import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import axios from 'axios';
import {API_URL} from '../../../config';

const BarChartByvalvi = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const {width} = Dimensions.get('window');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/bivalvi-form-entries?page=1&limit=500`,
        );
        const entries = response.data?.data || [];

        if (entries.length === 0) {
          setChartData({
            labels: ['No Data'],
            datasets: [{data: [0]}],
          });
        } else {
          // Group by plot_habitat_type
          const habitatCounts: Record<string, number> = {};
          entries.forEach((entry: any) => {
            const habitat = entry.plot_habitat_type || 'Unknown';
            habitatCounts[habitat] = (habitatCounts[habitat] || 0) + 1;
          });

          const labels = Object.keys(habitatCounts);
          const data = Object.values(habitatCounts);

          setChartData({
            labels,
            datasets: [{data}],
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching byvalvi data:', error);
        setChartData({
          labels: ['No Data'],
          datasets: [{data: [0]}],
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading chart...</Text>
      </View>
    );
  }

  const hasRealData =
    chartData &&
    chartData.datasets &&
    chartData.datasets[0] &&
    chartData.datasets[0].data.some((v: number) => v > 0);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.titleContainers}>
        <Text style={styles.chartTitle}>Surveys by Habitat Type</Text>
      </View>
      {hasRealData ? (
        <BarChart
          style={{
            marginVertical: 8,
            borderRadius: 8,
          }}
          data={chartData}
          width={width - 40}
          height={220}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 8,
            },
            propsForBackgroundLines: {
              strokeDasharray: '0',
              stroke: '#e3e3e3',
            },
          }}
          verticalLabelRotation={30}
          showValuesOnTopOfBars={true}
        />
      ) : (
        <Text style={styles.noDataText}>No habitat data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 250,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  titleContainers: {
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default BarChartByvalvi;
