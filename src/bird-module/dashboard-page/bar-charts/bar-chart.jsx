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
import { getDatabase } from '../../database/db';


const BarChartModel = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);

  const { width } = Dimensions.get('window');

  useEffect(() => {
    getDatabase().then(db => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT email FROM LoginData LIMIT 1',
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              const userEmail = results.rows.item(0).email;
              setEmail(userEmail);
              console.log('Retrieved email profile : ', userEmail);
            } else {
              console.log('No email and password stored.');
            }
          },
          error => {
            console.log('Error querying Users table: ' + error.message);
          },
        );
      });
    });
  }, []);

  // useEffect(() => {
  //   const fetchBirdData = async () => {
  //     console.log('Fetching bird data from API...');
  //     try {
  //       const response = await axios.get(`${API_URL}/bird-species`); // Replace 'YOUR_API_URL' with your actual endpoint
  //       console.log('Raw API response:', response.data);

  //       // Transform the data into the format required for the bar chart
  //       const labels = response.data.map((item) => item.species); // Replace `species` with the correct field
  //       const data = response.data.map((item) => item.count); // Replace `count` with the correct field

  //       const formattedData = {
  //         labels,
  //         datasets: [{ data }],
  //       };

  //       console.log('Formatted chart data:', formattedData);
  //       setChartData(formattedData);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching bird data:', error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchBirdData();
  // }, []);

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  useEffect(() => {
    const fetchBirdData = async () => {
      console.log('Fetching bird data from API...');
      try {
        const response = await axios.get(`${API_URL}/bird-species`); // Replace 'YOUR_API_URL' with your actual endpoint
        console.log('Raw API response:', response.data);
  
        // If no data is returned, set empty data
        if (response.data.length === 0) {
          const formattedData = {
            labels: ['No Data'],  // Optional: You can customize this to show a more relevant label
            datasets: [{ data: [0] }],
          };
          setChartData(formattedData);
        } else {
          // Transform the data into the format required for the bar chart
          const labels = response.data.map((item) => item.species); // Replace `species` with the correct field
          const data = response.data.map((item) => item.count); // Replace `count` with the correct field
  
          const formattedData = {
            labels,
            datasets: [{ data }],
          };
  
          setChartData(formattedData);
        }
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bird data:', error);
  
        // In case of error (offline or server issue), show default data
        const formattedData = {
          labels: ['No Data'],
          datasets: [{ data: [0] }],
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
    <View style={styles.chartContainer}>
      <BarChart
        style={{
          marginVertical: 8,
          borderRadius: 8,
        }}
        data={chartData}
        width={width - 20} // Dynamically set chart width
        height={200}
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
