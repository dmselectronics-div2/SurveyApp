import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const ModuleSelector: React.FC = () => {
  const navigation = useNavigation<any>();

  const modules = [
    {
      id: 'bird',
      title: 'Bird Survey',
      description: 'Bird observation and monitoring Data Collection',
      icon: 'bird',
      screen: 'BirdBottomNav',
    },
    {
      id: 'byvalvi',
      title: 'Byvalvi Survey',
      description: 'Bivalve & gastropod observation and monitoring data collection',
      icon: 'snail',
      screen: 'MangroveNew',
    },
    {
      id: 'phenology',
      title: 'Phenology Survey',
      description: 'Plant phenology and seasonal observation data collection',
      icon: 'flower',
      screen: 'PhenologySurvey',
    },
    {
      id: 'butterfly',
      title: 'Butterfly Survey',
      description: 'Butterfly observation and monitoring data collection',
      icon: 'butterfly',
      screen: 'ButterflyBottomNav',
    },
    {
      id: 'water',
      title: 'Water Survey',
      description: 'Water quality and aquatic ecosystem observation data collection',
      icon: 'water',
      screen: 'WaterSurvey',
    },
   
  ];

  const handleModuleSelect = (screenName: string) => {
    navigation.navigate(screenName);
  };

  return (
    <ImageBackground
      source={require('../assets/image/welcome.jpg')}
      style={styles.backgroundImage}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.overlay}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <MaterialIcon name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.titleContainer}>
          <View style={styles.decorativeLine} />
          <Text style={styles.title}>Select Survey Module</Text>
          <View style={styles.decorativeLine} />
        </View>

        {/* Module Buttons */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={true}>
          {modules.map(module => (
            <TouchableOpacity
              key={module.id}
              style={styles.button}
              onPress={() => handleModuleSelect(module.screen)}
              activeOpacity={0.8}>
              <View style={styles.buttonIconContainer}>
                <Icon name={module.icon} size={36} color="#FFFFFF" />
              </View>
              <View style={styles.buttonContentColumn}>
                <Text style={styles.buttonTextEnglish}>{module.title}</Text>
                <Text style={styles.buttonText}>{module.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 20 : 15,
    paddingBottom: 10,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(74, 120, 86, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 70 : 55,
    marginBottom: 10,
  },
  decorativeLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 15,
  },
  title: {
    fontSize: 26,

    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 30,
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 20,
    marginVertical: 12,
    minWidth: 280,
    width: '100%',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4A7856',
    ...Platform.select({
      ios: {
        shadowColor: '#4A7856',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  buttonIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A7856',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonContentColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,

    color: '#333333',
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginVertical: 2,
  },
  buttonTextEnglish: {
    fontSize: 20,

    color: '#4A7856',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default ModuleSelector;
