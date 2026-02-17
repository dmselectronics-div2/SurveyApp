import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { API_URL } from '../../../config';

const { width } = Dimensions.get('window');
const CHART_WIDTH = (width - 80) / 2;

const MiniBarChartModel = ({ title }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meanVal, setMeanVal] = useState(0);
  const [medianVal, setMedianVal] = useState(0);

  const calculateMeanMedian = (data) => {
    if (data.length === 0) return { mean: 0, median: 0 };
    const sum = data.reduce((acc, val) => acc + val, 0);
    const meanValue = sum / data.length;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const medianValue =
      sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    return {
      mean: parseFloat(meanValue.toFixed(1)),
      median: parseFloat(medianValue.toFixed(1)),
    };
  };

  useEffect(() => {
    const fetchBirdData = async () => {
      try {
        const response = await axios.get(`${API_URL}/bird-species`);
        const data = response.data.map((item) => item.count);

        if (data.length === 0) {
          setChartData(null);
        } else {
          const { mean, median } = calculateMeanMedian(data);
          setMeanVal(mean);
          setMedianVal(median);
          setChartData({
            labels: ['Mean', 'Median'],
            datasets: [{ data: [mean, median] }],
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
      </View>
    );
  }

  const hasRealData = chartData && chartData.datasets && chartData.datasets[0] &&
    chartData.datasets[0].data.some((v) => v > 0);

  return (
    <View style={styles.chartBox}>
      <View style={styles.titleRow}>
        <View style={styles.titleDot} />
        <Text style={styles.chartTitle}>{title}</Text>
      </View>
      {hasRealData ? (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
          >
            <BarChart
              style={styles.chart}
              data={chartData}
              width={Math.max(CHART_WIDTH, chartData.labels.length * 60)}
              height={150}
              fromZero
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#f8fdf8',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(56, 142, 60, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(75, 75, 75, ${opacity})`,
                barPercentage: 0.5,
                fillShadowGradient: '#66bb6a',
                fillShadowGradientOpacity: 0.85,
                propsForBackgroundLines: {
                  stroke: '#e8f5e9',
                  strokeWidth: 1,
                },
                propsForLabels: {
                  fontSize: 10,
                },
              }}
              showBarTops={false}
              showValuesOnTopOfBars={true}
              withInnerLines={true}
            />
          </ScrollView>
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Mean</Text>
              <Text style={styles.statValue}>{meanVal}</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Median</Text>
              <Text style={styles.statValue}>{medianVal}</Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.noDataText}>No data yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartBox: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#388e3c',
    marginRight: 6,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1b5e20',
  },
  chart: {
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  statBadge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    color: '#666',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2e7d32',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 180,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noDataText: {
    fontSize: 12,
    color: '#999',
  },
});

export default MiniBarChartModel;
