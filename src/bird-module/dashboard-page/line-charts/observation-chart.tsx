import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { API_URL } from '../../../config';

const LineChartModel = () => {
  const [chartData, setChartData] = useState({
    labels: ['No Data'], // Placeholder for months
    datasets: [{ data: [0] }], // Placeholder for bird counts
  });
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchBirdCountByMonth = async () => {
  //     try {
  //       console.log('Fetching bird counts by month...');
  //       const response = await axios.get(`${API_URL}/bird-count-by-month`);
  //       console.log('API Response:', response.data);

  //       // Extract data for chart
  //       const labels = response.data.map((item) => item.month); // Months for X-axis
  //       const data = response.data.map((item) => item.count); // Bird counts for Y-axis

  //       setChartData({
  //         labels,
  //         datasets: [{ data }],
  //       });
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching bird counts by month:', error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchBirdCountByMonth();
  // }, []);

  useEffect(() => {
    const fetchBirdCountByMonth = async () => {
      try {
        console.log('Fetching bird counts by month...');
        const response = await axios.get(`${API_URL}/bird-count-by-month`);
        console.log('API Response:', response.data);
  
        // Extract data for chart
        const labels = response.data.map((item) => item.month); // Months for X-axis
        const data = response.data.map((item) => item.count); // Bird counts for Y-axis
  
        setChartData({
          labels,
          datasets: [{ data }],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bird counts by month:', error);
  
        // In case of error (e.g., offline or server error), set 0 as the default data
        setChartData({
          labels: ['No Data'],
          datasets: [{ data: [0] }],
        });
        setLoading(false);
      }
    };
  
    fetchBirdCountByMonth();
  }, []);
  

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Check if all data values are 0 - charts crash with all-zero data (SVG Infinity bug)
  const hasRealData = chartData && chartData.datasets && chartData.datasets[0] &&
    chartData.datasets[0].data.some((v: number) => v > 0);

  return (
    <View>
      <View>
        {hasRealData ? (
          <LineChart
            data={chartData}
            width={400}
            height={200}
            yAxisLabel=""
            yAxisSuffix=" birds"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 1,
            }}
          />
        ) : (
          <Text style={{fontSize: 14, color: '#888', marginTop: 20}}>No observation data available</Text>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '55%',
    height: 142,
    marginLeft: 'auto',
    marginRight: 24,
    marginTop: '60%',
  },
  boldText: {
    fontWeight: 'bold',
  },
  title_container: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    marginTop: '20%',
  },
  main_text: {
    fontSize: 25,
    fontFamily: 'InriaSerif-Bold',
    color: '#413E3E',
    // fontWeight: 'bold',
    marginTop: 10,
  },
  sub_text: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
  },
  sub_text_below: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: 'rgba(217, 217, 217, 0.8)',
    textAlign: 'center',
  },
  text_container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 142,
  },
  whiteBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 500,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 80,
  },

  BlueBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 150,
    width: 150,
    borderRadius: 10,
    backgroundColor: 'rgba(143,154,173, 0.83)',
    marginLeft: 1,
    marginRight: 1,
    marginTop: 10,
  },

  forgotPasswordText: {
    color: 'black',
    textDecorationLine: 'underline',
    fontSize: 16,
    marginTop: 10,
    marginLeft: 240,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10, // Adjusted for a smaller gap
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  text_input: {
    width: '90%',
    marginTop: 10,
  },
  button_signup: {
    width: '90%',
    marginTop: 20,
    fontFamily: 'Inter-regular',
  },
  finger_icon: {
    // justifyContent: 'center',
    // flexDirection: 'row',
    marginRight: 10,
    marginTop: 10,
    // marginLeft:-100
  },
  dialpad_icon: {
    // justifyContent: 'center',
    // flexDirection: 'row',
    marginRight: 90,
    marginTop: 10,
    // marginLeft:-100
  },
  button_google: {
    width: '90%',
    marginTop: 6,
    fontFamily: 'Inter-regular',
  },
  button_label: {
    fontSize: 18,
  },
  sub_text_A: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'right',
  },
  sub_text_B: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sub_text_C: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sub_text_D: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'right',
    marginTop: 2,
  },
  bottom_container: {
    flexDirection: 'row',
    marginTop: 2,
    alignItems: 'center',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 9,
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 5,
    justifyContent: 'center',
    marginLeft: 100,
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 10,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleButtonText: {
    fontSize: 18,
    color: 'black', // Same color as the button's textColor
  },
  lower_container: {
    flexDirection: 'row',
    marginTop: 180,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },

  BlueBoxTwo: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    width: 320,
    borderRadius: 10,
    backgroundColor: 'rgba(143,154,173, 0.83)',
    marginLeft: 1,
    marginRight: 1,
    marginTop: 10,
    flexDirection: 'column',
  },
});

export default LineChartModel;



