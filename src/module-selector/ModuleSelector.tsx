import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
      id: 'citizen',
      title: 'Survey',
      description: 'Citizen & Scientist observation with monitoring data collection',
      icon: 'account-group',
      screen: 'WelcomeSinhala',
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
        {/* Header */}
        <View style={styles.titleContainer}>
          <View style={styles.decorativeLine} />
          <Text style={styles.title}>Select Survey Module</Text>
          <View style={styles.decorativeLine} />
        </View>

        {/* Module Buttons */}
        <View style={styles.container}>
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
        </View>

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
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
