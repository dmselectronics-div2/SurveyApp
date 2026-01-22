import React from 'react';
import { View, Text, ImageBackground, StyleSheet, FlatList } from 'react-native';
import { useStateContext } from './Context'; // Ensure this path is correct
import WeatherCard from './Components/WeatherCard'; 

const Sunny = require('./assets/images/Sunny.jpg');

const App: React.FC = () => {
  const { weather, thisLocation, values } = useStateContext();

  return (
    <ImageBackground
      source={Sunny}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <WeatherCard
          place={thisLocation}
          windspeed={weather.wind_kph}
          humidity={weather.humidity}
          temperature={weather.temp_c}
          iconString={weather.conditions}
          conditions={weather.conditions}
        />

        <FlatList
          data={values.slice(1, 7)}
          keyExtractor={(item) => item.datetime}
          renderItem={({ item }) => (
            <WeatherCard
              time={item.datetime}
              temp={item.temp_c}
              iconString={item.conditions}
            />
          )}
          contentContainerStyle={styles.weatherCardsContainer}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    opacity: 0.5, 
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    width: '80%',
  },
});

export default App;
