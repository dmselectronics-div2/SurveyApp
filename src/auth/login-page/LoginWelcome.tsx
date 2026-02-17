import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Platform,
  BackHandler,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginWelcome = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('OptionSelection');
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleSignIn = () => {
    navigation.navigate('SigninForm');
  };

  const handleSignUp = () => {
    navigation.navigate('SignupRoleSelection');
  };

  return (
    <ImageBackground
      source={require('../../assets/image/Nature.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('OptionSelection')}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={28} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Logo Container */}
        {/* <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Icon name="eco" size={48} color="#4A7856" />
          </View>
          <Text style={styles.appName}>DATA FOR BLUE CARBON ECOSYSTEMS</Text>
        </View> */}

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome back</Text>
          <Text style={styles.welcomeSubtitle}>
            Continue your  research journey
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.signInButton]}
            onPress={handleSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>Sign - In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.signUpButton]}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4A7856',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1.2,
    lineHeight: 18,
    maxWidth: 200,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonContainer: {
    gap: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  signInButton: {
    backgroundColor: '#4A7856',
    borderColor: '#4A7856',
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  signUpButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderColor: '#FFFFFF',
  },
  signUpButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A7856',
    letterSpacing: 0.6,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: '600',
  },
});

export default LoginWelcome;
