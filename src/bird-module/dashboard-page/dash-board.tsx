import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Appearance,
} from 'react-native';


const MainDashboardPage = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode = theme === 'dark';

  return (
    <ImageBackground
      source={require('../../assets/image/imageD1.jpg')}
      style={styles.backgroundImage}>
      <ScrollView>
        <View style={styles.title_container}>
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
              Birds Dashboard
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: isDarkMode ? '#ccc' : '#666',
                marginTop: 20,
                textAlign: 'center',
              }}>
              Welcome to the Bird Survey Module
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 10,
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default MainDashboardPage;
