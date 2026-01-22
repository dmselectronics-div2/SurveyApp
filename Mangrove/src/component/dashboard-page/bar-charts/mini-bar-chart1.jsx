import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { API_URL } from '../../../config';

const MiniBarChartModel1 = ({ title }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBirdDataBySex = async () => {
      console.log('Fetching bird data grouped by sex from API...');
      try {
        const response = await axios.get(`${API_URL}/bird-sex`);
        console.log('Raw API response:', response.data);

        // Process data to handle null or empty sex values
        const processedData = response.data.reduce(
          (acc, item) => {
            const sexCategory = item.sex && item.sex.trim() ? item.sex : 'Unknown';
            if (!acc[sexCategory]) acc[sexCategory] = 0;
            acc[sexCategory] += item.count;
            return acc;
          },
          {}
        );

        console.log('Processed data grouped by sex:', processedData);

        // Prepare labels and data for the chart
        const labels = Object.keys(processedData);
        const values = Object.values(processedData);

        const formattedData = {
          labels,
          datasets: [{ data: values }],
        };

        setChartData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bird data by sex:', error);
        setLoading(false);
      }
    };

    fetchBirdDataBySex();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.BlueBox}>
      <Text style={styles.sub_text}>{title}</Text>
      <View style={styles.chartWithLegendContainer}>
        <BarChart
          style={{
            marginVertical: 1,
            borderRadius: 1,
          }}
          data={chartData}
          width={300}
          height={220}
          fromZero
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255,0,0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
            strokeWidth: 1,
            barPercentage: 0.7,
            propsForBackgroundLines: {
              stroke: '#e3e3e3',
            },
          }}
          showBarTops={true}
          showValuesOnTopOfBars={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  BlueBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 260,
    width: 320,
    borderRadius: 10,
    backgroundColor: 'rgba(52,168,83, 0.57)',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
  sub_text: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },
  chartWithLegendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MiniBarChartModel1;
