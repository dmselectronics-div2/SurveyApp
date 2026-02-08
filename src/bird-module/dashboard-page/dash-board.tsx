import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  ScrollView,
  Appearance,
  Pressable,
} from 'react-native';
import {
  Provider as PaperProvider,
  TextInput,
  DefaultTheme,
  Button,
  Icon,
  IconButton,
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
import PieChartModelMain from './pie-charts/diversity-pie-chart-main';
import LineChartModel from './line-charts/observation-chart';
import BarChartModel from './bar-charts/bar-chart';
import MiniBarChartModel from './bar-charts/mini-bar-chart';
import MapPage from './area-map/area-map';
import MapView, {Marker} from 'react-native-maps';
import {WeatherCard} from '../weather-page/Components';
import ModelChart from './pie-charts/model-chart';
import ModelChart1 from './pie-charts/model-chart1';
import ModelChart2 from './pie-charts/model-chart2';
import ModelChart3 from './pie-charts/model-chart3';
import MiniBarChartModel1 from './bar-charts/mini-bar-chart1';
import PieChartModelMain1 from './pie-charts/diversity-pie-chart-main1';
import PieChartModelMain2 from './pie-charts/diversity-pie-chart-main2';
import PieChartModelMain3 from './pie-charts/diversity-pie-chart-main3';

const {width: screenWidth} = Dimensions.get('window');

const MainDashboardPage = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const navigation = useNavigation();
  const [showModelChart, setShowModelChart] = useState(false);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const clickPieChart = () => {
    console.log('pie chart click');
    // setShowModelChart(true);
    navigation.navigate('PieChartModel');
  };

  if (showModelChart) {
    return <ModelChart setShowModelChart={setShowModelChart} />;
  }

  const clickPieChart1 = () => {
    console.log('pie chart click');
    // setShowModelChart(true);
    navigation.navigate('PieChartModel1');
  };

  if (showModelChart) {
    return <ModelChart1 setShowModelChart={setShowModelChart} />;
  }

  const clickPieChart2 = () => {
    console.log('pie chart click');
    // setShowModelChart(true);
    navigation.navigate('PieChartModel2');
  };

  if (showModelChart) {
    return <ModelChart2 setShowModelChart={setShowModelChart} />;
  }

  const clickPieChart3 = () => {
    console.log('pie chart click');
    // setShowModelChart(true);
    navigation.navigate('PieChartModel3');
  };

  if (showModelChart) {
    return <ModelChart3 setShowModelChart={setShowModelChart} />;
  }


  const isDarkMode = theme === 'dark';

  return (
    <ImageBackground
      source={require('../../assets/image/imageD1.jpg')}
      style={styles.backgroundImage}>
      <ScrollView>
        <View style={styles.title_container}>
          {/* Pie Chart */}
          <View
            style={[
              styles.whiteBox,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(17, 17, 17, 0.8)'
                  : 'rgba(217, 217, 217, 0.7)',
              },
            ]}>
            <Text
              style={[
                styles.main_text,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              The Bird Diversity in Sri Lanka
            </Text>
            <ScrollView horizontal={true} style={styles.scrollContainer}>
              <View style={styles.pieChartContainer}>
                <TouchableOpacity activeOpacity={0.7} onPress={clickPieChart}>
                  <PieChartModelMain />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={clickPieChart1}>
                  <PieChartModelMain1 />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={clickPieChart2}>
                  <PieChartModelMain2 />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={clickPieChart3}>
                  <PieChartModelMain3 />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Map View */}
          <View
            style={[
              styles.whiteBox,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(17, 17, 17, 0.8)'
                  : 'rgba(217, 217, 217, 0.7)',
              },
            ]}>
            <Text
              style={[
                styles.main_text,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              Latest Research Location
            </Text>
            <ScrollView horizontal={true} style={styles.scrollContainer}>
              <View style={styles.mapBox}>
                <MapPage />
              </View>
            </ScrollView>
          </View>

          {/* Line chart */}

          <View
            style={[
              styles.whiteBox,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(17, 17, 17, 0.8)'
                  : 'rgba(217, 217, 217, 0.7)',
              },
            ]}>
            <Text
              style={[
                styles.main_text,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              Observation Details
            </Text>
            <ScrollView horizontal={true} style={styles.scrollContainer}>
              <View style={styles.pieChartContainer}>
                <LineChartModel />
                {/* <LineChartModel />
              <LineChartModel />
              <LineChartModel />
              <LineChartModel />
              <LineChartModel /> */}
              </View>
            </ScrollView>
          </View>

          {/* Bar graph */}
          <View
            style={[
              styles.whiteBox,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(17, 17, 17, 0.8)'
                  : 'rgba(217, 217, 217, 0.7)',
              },
            ]}>
            <Text
              style={[
                styles.main_text,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              Species Richness
            </Text>
            <ScrollView horizontal={true} style={styles.scrollContainer}>
              <View style={styles.pieChartContainer}>
                <BarChartModel />
              </View>
            </ScrollView>
          </View>

          {/* Pie Chart */}
          <View
            style={[
              styles.SecondwhiteBox,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(17, 17, 17, 0.8)'
                  : 'rgba(217, 217, 217, 0.7)',
              },
            ]}>
            <Text
              style={[
                styles.main_text,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              Summary Statistics
            </Text>
            <ScrollView horizontal={true} style={styles.scrollContainer}>
              <View style={styles.pieChartContainer}>
                <MiniBarChartModel title={'Mean, median Bird Counts'} />
                <MiniBarChartModel1 title={'Distribution of Bird Counts by Sex'} />
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
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
    marginTop: '5%',
    marginBottom: '5%',
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
    height: 250,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 10,
  },

  weatherWhiteBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 500,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 10,
  },

  SecondwhiteBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 280,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 10,
  },

  BlueBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    width: 220,
    borderRadius: 10,
    backgroundColor: 'rgba(143,154,173, 0.83)',
    marginLeft: 1,
    marginRight: 1,
    marginTop: 10,
    flexDirection: 'column',
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
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scrollContainer: {
    flexDirection: 'row',
  },
  mapBox: {
    width: screenWidth * 0.9,
    height: '95%',
  },
  button: {
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: 220,
  },
  pieChartWrapper: {
    height: 150,
    width: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainDashboardPage;
