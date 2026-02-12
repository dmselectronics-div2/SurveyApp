import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const MiniBarChartDummy1 = ({ title }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading with dummy data
    setTimeout(() => {
      // Dummy data for sex distribution
      const dummyData = {
        labels: ['Male', 'Female', 'Unknown'],
        datasets: [
          {
            data: [65, 58, 12],
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          },
        ],
      };
      setChartData(dummyData);
      setLoading(false);
    }, 300);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const hasRealData = chartData && chartData.datasets && chartData.datasets[0] &&
    chartData.datasets[0].data.some((v) => v > 0);

  return (
    <View style={styles.chartBox}>
      <Text style={styles.chartTitle}>{title}</Text>
      <Text style={styles.subtitle}>(Dummy Data)</Text>
      <View style={styles.chartContainer}>
        {hasRealData ? (
          <BarChart
            style={{
              marginVertical: 5,
              borderRadius: 8,
            }}
            data={chartData}
            width={290}
            height={200}
            fromZero
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(74, 120, 86, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 1,
              barPercentage: 0.7,
              propsForBackgroundLines: {
                stroke: '#e3e3e3',
              },
            }}
            showBarTops={true}
            showValuesOnTopOfBars={true}
            withInnerLines={true}
          />
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 168, 83, 0.2)',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(52, 168, 83, 0.4)',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 220,
    backgroundColor: 'rgba(52, 168, 83, 0.1)',
    borderRadius: 10,
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
  },
});

export default MiniBarChartDummy1;
