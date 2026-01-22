import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { API_URL } from '../../../config';

const MiniBarChartModel = ({ title }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateMeanMedian = (data) => {
    // Calculate mean
    const sum = data.reduce((acc, val) => acc + val, 0);
    const meanValue = sum / data.length;

    // Calculate median
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const medianValue =
      sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    return {
      mean: parseFloat(meanValue.toFixed(2)), // Round to 2 decimal places
      median: parseFloat(medianValue.toFixed(2)), // Round to 2 decimal places
    };
  };

  // useEffect(() => {
  //   const fetchBirdData = async () => {
  //     console.log('Fetching bird data from API...');
  //     try {
  //       const response = await axios.get(`${API_URL}/bird-species`); // Replace with your API URL
  //       console.log('Raw API response:', response.data);

  //       const data = response.data.map((item) => item.count); // Assuming each item has a count

  //       // Calculate mean and median
  //       const { mean, median } = calculateMeanMedian(data);

  //       // Only include mean and median in the dataset
  //       const labels = ['Mean', 'Median'];
  //       const values = [mean, median];

  //       const formattedData = {
  //         labels,
  //         datasets: [{ data: values }],
  //       };

  //       setChartData(formattedData);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching bird data:', error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchBirdData();
  // }, []);

  useEffect(() => {
    const fetchBirdData = async () => {
      console.log('Fetching bird data from API...');
      try {
        const response = await axios.get(`${API_URL}/bird-species`); // Replace with your API URL
        console.log('Raw API response:', response.data);
  
        const data = response.data.map((item) => item.count); // Assuming each item has a count
  
        // Check if data is empty
        if (data.length === 0) {
          const formattedData = {
            labels: ['Mean', 'Median'],
            datasets: [{ data: [0, 0] }],
          };
          setChartData(formattedData);
        } else {
          // Calculate mean and median
          const { mean, median } = calculateMeanMedian(data);
  
          // Only include mean and median in the dataset
          const labels = ['Mean', 'Median'];
          const values = [mean, median];
  
          const formattedData = {
            labels,
            datasets: [{ data: values }],
          };
  
          setChartData(formattedData);
        }
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bird data:', error);
  
        // In case of error (offline or server issue), show 0 for Mean and Median
        const formattedData = {
          labels: ['Mean', 'Median'],
          datasets: [{ data: [0, 0] }],
        };
        setChartData(formattedData);
        setLoading(false);
      }
    };
  
    fetchBirdData();
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
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255,0,0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
            strokeWidth: 1,
            barPercentage: 1.5, // Increase bar width (default is 0.7)
            propsForBackgroundLines: {
              stroke: '#e3e3e3',
            },
          }}
          showBarTops={true}
          showValuesOnTopOfBars={true}
          withInnerLines={false} // Optional: Removes inner grid lines for cleaner appearance
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

export default MiniBarChartModel;
