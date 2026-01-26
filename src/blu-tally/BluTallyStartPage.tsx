import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const BluTallyStartPage: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleGetStarted = () => {
    navigation.navigate('ModuleSelector');
  };

  return (
    <ImageBackground
      source={require('../assets/image/imageD.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require('../assets/image/startpage.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.appTitle}>BLUTALLY</Text>
          <Text style={styles.tagline}>DATA FOR BLUE CARBON</Text>
          <Text style={styles.tagline}>ECOSYSTEMS</Text>
        </View>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>GET STARTED</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: height * 0.15,
    paddingBottom: 50,
  },
  logoSection: {
    alignItems: 'center',
  },
  logoImage: {
    width: 160,
    height: 180,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 30,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1B4332',
    letterSpacing: 8,
    marginBottom: 15,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 14,
    color: '#1B4332',
    letterSpacing: 3,
    fontWeight: '500',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  buttonSection: {
    width: '100%',
    paddingHorizontal: 40,
    marginTop: 'auto',
  },
  getStartedButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default BluTallyStartPage;
