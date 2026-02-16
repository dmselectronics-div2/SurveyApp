import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { API_URL } from '../../../config';

const CHART_WIDTH = (Dimensions.get('window').width - 80) / 2;

const MiniBarChartModel1 = ({ title }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sexCounts, setSexCounts] = useState({});

  useEffect(() => {
    const fetchBirdDataBySex = async () => {
      try {
        const response = await axios.get(`${API_URL}/bird-sex`);

        if (!response.data || response.data.length === 0) {
          setChartData(null);
          setLoading(false);
          return;
        }

        const processedData = response.data.reduce((acc, item) => {
          const sexCategory = item.name && item.name.trim() ? item.name : 'Unknown';
          if (!acc[sexCategory]) acc[sexCategory] = 0;
          acc[sexCategory] += item.count;
          return acc;
        }, {});

        setSexCounts(processedData);

        const labels = Object.keys(processedData);
        const values = Object.values(processedData);

        setChartData({
          labels,
          datasets: [{ data: values }],
        });
      } catch (error) {
        console.error('Error fetching bird data by sex:', error);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBirdDataBySex();
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

  const total = Object.values(sexCounts).reduce((a, b) => a + b, 0);

  return (
    <View style={styles.chartBox}>
      <View style={styles.titleRow}>
        <View style={styles.titleDot} />
        <Text style={styles.chartTitle}>{title}</Text>
      </View>
      {hasRealData ? (
        <>
          <BarChart
            style={styles.chart}
            data={chartData}
            width={CHART_WIDTH}
            height={150}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#f8fdf8',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(27, 94, 32, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(75, 75, 75, ${opacity})`,
              barPercentage: 0.5,
              fillShadowGradient: '#81c784',
              fillShadowGradientOpacity: 0.9,
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
          <View style={styles.legendRow}>
            {Object.entries(sexCounts).map(([sex, count]) => (
              <View key={sex} style={styles.legendItem}>
                <Text style={styles.legendLabel}>{sex}</Text>
                <Text style={styles.legendValue}>
                  {total > 0 ? Math.round((count / total) * 100) : 0}%
                </Text>
              </View>
            ))}
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
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  legendItem: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
  },
  legendLabel: {
    fontSize: 9,
    color: '#666',
    fontWeight: '600',
  },
  legendValue: {
    fontSize: 12,
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

export default MiniBarChartModel1;
