import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions, // Correct import for Dimensions
} from 'react-native';
import {
  Provider as PaperProvider,
  TextInput,
  DefaultTheme,
  Button,
  Icon,
} from 'react-native-paper';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import PieChartModel from './diversity-indices';
import ModelChart from './model-chart';

//mulinma pena rauma

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#56FF64',
    text: 'red',
    placeholder: 'white',
    surface: 'rgba(217, 217, 217, 0.7)',
  },
};

const PieChartModelMain3 = () => {
  const navigation = useNavigation();

  const data = [
    {
      population: 21500000,
      color: '#E16200',
    },
    {
      population: 2800000,
      color: '#E1214E',
    },
    {
      population: 5207612,
      color: '#E14AB5',
    },
    {
      population: 8538000,
      color: '#00B3FA',
    },
    {
      population: 11920000,
      color: '#14B390',
    },
    // {
    //     name: 'Sri Lanka',
    //     population: 11450000,
    //     color: '#E89900',
    //     legendFontColor: '#7F7F7F',
    //     legendFontSize: 15,
    //   },
  ];

  return (
        <View style={styles.BlueBox}>
          <Text style={styles.sub_text}>Bird Count by Habitat Type</Text>
          <View style={styles.chartWithLegendContainer}>
            <PieChart
              data={data}
              width={150}
              height={120}
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                // labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 1,
                },
                propsForDots: {
                  r: '10',
                  strokeWidth: '10',
                  stroke: '#000000',
                },
              }}
              accessor={'population'}
              backgroundColor={'transparent'}
              paddingLeft={'10'}
              center={[15, 0]}
              absolute
              hasLegend={false}
            />

            <View style={styles.customLegend}>
              {data.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[{backgroundColor: item.color}]} />
                </View>
              ))}
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    width: 220,
    borderRadius: 10,
    backgroundColor: 'rgba(143,154,173, 0.83)',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },

  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  chartWithLegendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  customLegend: {
    marginLeft: -20, // Adjust as needed
    flexDirection: 'column',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 10, // Adjust the size of the color circle here
    height: 10, // Adjust the size of the color circle here
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#000000',
  },
});

export default PieChartModelMain3;
