import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { API_URL } from '../../../config';


const BarChartModel = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { width } = Dimensions.get('window');

  useEffect(() => {
    const fetchBirdData = async () => {
      console.log('Fetching bird data from API...');
      try {
        const response = await axios.get(`${API_URL}/bird-species`); // Replace 'YOUR_API_URL' with your actual endpoint
        console.log('Raw API response:', response.data);

        // Transform the data into the format required for the bar chart
        const labels = response.data.map((item) => item.species); // Replace `species` with the correct field
        const data = response.data.map((item) => item.count); // Replace `count` with the correct field

        const formattedData = {
          labels,
          datasets: [{ data }],
        };

        console.log('Formatted chart data:', formattedData);
        setChartData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bird data:', error);
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
    <View style={styles.chartContainer}>
      <BarChart
        style={{
          marginVertical: 8,
          borderRadius: 8,
        }}
        data={chartData}
        width={width - 20} // Dynamically set chart width
        height={220}
        fromZero
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 8,
          },
        }}
        verticalLabelRotation={30} // Rotate labels for better readability
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default BarChartModel;
