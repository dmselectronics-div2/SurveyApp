import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { API_URL } from '../../../config';

const { width } = Dimensions.get('window');
const CHART_WIDTH = (width - 80) / 2;

const HabitatBarChart = ({ title }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [habitatCounts, setHabitatCounts] = useState({});

  useEffect(() => {
    const fetchHabitatData = async () => {
      try {
        const response = await axios.get(`${API_URL}/bird-habitat`);

        if (!response.data || response.data.length === 0) {
          setChartData(null);
          setLoading(false);
          return;
        }

        const processedData = {};
        response.data.forEach((item) => {
          const habitat = item.name && item.name.trim() ? item.name : 'Unknown';
          processedData[habitat] = (processedData[habitat] || 0) + item.count;
        });

        setHabitatCounts(processedData);

        const labels = Object.keys(processedData);
        const values = Object.values(processedData);

        setChartData({
          labels,
          datasets: [{ data: values }],
        });
      } catch (error) {
        console.error('Error fetching habitat data:', error);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHabitatData();
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

  const total = Object.values(habitatCounts).reduce((a, b) => a + b, 0);

  return (
    <View style={styles.chartBox}>
      <View style={styles.titleRow}>
        <View style={styles.titleDot} />
        <Text style={styles.chartTitle}>{title}</Text>
      </View>
      {hasRealData ? (
        <>
          <ScrollView
            style={{maxHeight: 200}}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
            >
              <BarChart
                style={styles.chart}
                data={chartData}
                width={Math.max(CHART_WIDTH, chartData.labels.length * 60)}
                height={200}
                fromZero
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#f8fdf8',
                  decimalPlaces: 0,
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
                    fontSize: 8,
                  },
                }}
                showBarTops={false}
                showValuesOnTopOfBars={true}
                withInnerLines={true}
                verticalLabelRotation={30}
              />
            </ScrollView>
          </ScrollView>
          <View style={styles.legendRow}>
            {Object.entries(habitatCounts).slice(0, 4).map(([habitat, count]) => (
              <View key={habitat} style={styles.legendItem}>
                <Text style={styles.legendLabel} numberOfLines={1}>{habitat}</Text>
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
    gap: 6,
    marginTop: 8,
  },
  legendItem: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignItems: 'center',
    maxWidth: 70,
  },
  legendLabel: {
    fontSize: 8,
    color: '#666',
    fontWeight: '600',
  },
  legendValue: {
    fontSize: 11,
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

export default HabitatBarChart;
