import React, { useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDate } from '../Utils/useDate';

// Import images 
const cloud = require('../assets/icons/cloud.png');
const rain = require('../assets/icons/rain.png');
const sun = require('../assets/icons/sun.png');
const storm = require('../assets/icons/storm.png');
const fog = require('../assets/icons/fog.png');
const snow = require('../assets/icons/snow.png');
const wind = require('../assets/icons/windy.png');

interface WeatherCardProps {
  temperature?: number;
  windspeed?: number;
  humidity?: number;
  place?: string;
  iconString?: string;
  conditions?: string;
  temp?: number;
  time?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  windspeed,
  humidity,
  place,
  iconString,
  conditions, 
  temp
}) => {
  const [icon, setIcon] = useState<any>(sun);
  const { time } = useDate();

  useEffect(() => {
    if (iconString) {
      const iconLower = iconString.toLowerCase();
      if (iconLower.includes('cloud')) {
        setIcon(cloud);
      } else if (iconLower.includes('rain')) {
        setIcon(rain);
      } else if (iconLower.includes('clear')) {
        setIcon(sun);
      } else if (iconLower.includes('thunder')) {
        setIcon(storm);
      } else if (iconLower.includes('fog')) {
        setIcon(fog);
      } else if (iconLower.includes('snow')) {
        setIcon(snow);
      } else if (iconLower.includes('wind')) {
        setIcon(wind);
      }
    }
  }, [iconString]);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.temperature}>{temperature} °C</Text>
      </View>
      <Text style={styles.place}>{place}</Text>
      <View style={styles.dateTime}>
        <Text style={styles.date}>{new Date().toDateString()}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoBox}>Wind Speed <Text style={styles.infoValue}>{windspeed} km/h</Text></Text>
        <Text style={styles.infoBox}>Humidity <Text style={styles.infoValue}>{humidity} gm/m³</Text></Text>
      </View>
      <View style={styles.footer}>
        <ScrollView>
        <View style={styles.forecastBox}>
          <Text style={styles.forecastTime}>{new Date(time).toLocaleTimeString('en', { hour: 'numeric', hour12: true, minute: 'numeric' }).split(" ")[0]}</Text>
          <Image source={icon} style={styles.forecastIcon} />
          <Text style={styles.forecastTemp}>{temp}°C</Text>
        </View>
        </ScrollView>
      </View>
      <Text style={styles.conditions}>{conditions}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minWidth: 400,
    height: 450,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    // backgroundColor:'red',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  icon: {
    width: 80,
    height: 80,
    // marginRight: 16
  },
  temperature: {
    fontSize: 40,
    fontWeight: 'bold'
  },
  place: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16
  },
  dateTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  date: {
    fontSize: 16,
    textAlign: 'center'
  },
  time: {
    fontSize: 16,
    textAlign: 'center'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  infoBox: {
    flex: 1,
    textAlign: 'center',
    padding: 4,
    fontWeight: 'bold'
  },
  infoValue: {
    fontWeight: 'normal'
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16
  },
  forecastBox: {
    width: 100,
    height: 100,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10
  },
  forecastTime: {
    textAlign: 'center'
  },
  forecastIcon: {
    width: 40,
    height: 40,
    marginVertical: 8
  },
  forecastTemp: {
    fontWeight: 'bold'
  },
  conditions: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold'
  }
});

export default WeatherCard;
