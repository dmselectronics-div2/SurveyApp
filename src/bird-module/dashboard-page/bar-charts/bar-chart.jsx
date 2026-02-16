import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { API_URL } from '../../../config';

const { width } = Dimensions.get('window');

const BarChartModel = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBirdData = async () => {
      try {
        const response = await axios.get(`${API_URL}/bird-species`);

        if (!response.data || response.data.length === 0) {
          setChartData(null);
        } else {
          const labels = response.data.map((item) => item.name || item.species);
          const data = response.data.map((item) => item.count);

          setChartData({
            labels,
            datasets: [{ data }],
          });
        }
      } catch (error) {
        console.error('Error fetching bird data:', error);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBirdData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#2e7d32" />
        <Text style={styles.loadingText}>Loading chart...</Text>
      </View>
    );
  }

  const hasRealData = chartData && chartData.datasets && chartData.datasets[0] &&
    chartData.datasets[0].data.some((v) => v > 0);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.titleRow}>
        <View style={styles.titleDot} />
        <Text style={styles.chartTitle}>Bird Species Count</Text>
      </View>
      <Text style={styles.chartSubtitle}>Total observations by species</Text>
      {hasRealData ? (
        <BarChart
          style={styles.chart}
          data={chartData}
          width={width - 64}
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
              fontSize: 11,
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
    fontSize: 13,
    color: '#888',
    marginTop: 10,
  },
  chartContainer: {
    alignItems: 'center',
  },
  titleRow: {
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
  chart: {
    marginVertical: 8,
    borderRadius: 12,
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
});

export default BarChartModel;
