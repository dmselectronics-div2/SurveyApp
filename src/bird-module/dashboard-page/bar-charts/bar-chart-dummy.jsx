import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const BarChartDummy = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { width } = Dimensions.get('window');

  useEffect(() => {
    // Simulate loading with dummy data
    setTimeout(() => {
      // Dummy data for bird species
      const dummyData = {
        labels: ['Sparrow', 'Eagle', 'Parrot', 'Crow', 'Dove', 'Owl'],
        datasets: [
          {
            data: [45, 28, 52, 35, 41, 19],
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          },
        ],
      };
      setChartData(dummyData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading chart...</Text>
      </View>
    );
  }

  const hasRealData = chartData && chartData.datasets && chartData.datasets[0] &&
    chartData.datasets[0].data.some((v) => v > 0);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.titleContainers}>
        <Text style={styles.chartTitle}>Bird Species Count</Text>
        <Text style={styles.chartSubtitle}>(Dummy Data)</Text>
      </View>
      {hasRealData ? (
        <BarChart
          style={{
            marginVertical: 8,
            borderRadius: 8,
          }}
          data={chartData}
          width={width - 20}
          height={220}
          fromZero
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(74, 120, 86, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 8,
            },
            propsForBackgroundLines: {
              strokeDasharray: '0',
            },
          }}
          verticalLabelRotation={45}
          showValuesOnTopOfBars={true}
        />
      ) : (
        <Text style={styles.noDataText}>No species data available</Text>
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
  chartSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
  },
});

export default BarChartDummy;
