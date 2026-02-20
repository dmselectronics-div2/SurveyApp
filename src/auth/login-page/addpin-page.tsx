import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Alert,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as Keychain from 'react-native-keychain';
import {setLoginEmail} from '../../assets/sql_lite/db_connection';

const AddPin = ({navigation}: any) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [userEmail, setUserEmail] = useState('');
  const [userPin, setUserPin] = useState('');

  const pinRefs = [useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null)];

  useEffect(() => {
    retrieveCredentials();
  }, []);

  const retrieveCredentials = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setUserEmail(credentials.username);
        setUserPin(credentials.password);
      } else {
        Alert.alert('Error', 'No PIN found. Please set up a PIN first.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
    }
  };

  const handlePinChange = (text: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);
    if (text.length === 1 && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && pin[index] === '' && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handleSignIn = () => {
    const enteredPin = pin.join('');
    if (enteredPin.length < 4) {
      Alert.alert('Error', 'Please enter all 4 digits');
      return;
    }
    if (enteredPin === userPin) {
      setLoginEmail(userEmail);
      navigation.replace('Welcome', {email: userEmail});
    } else {
      Alert.alert('Error', 'Invalid PIN. Please try again.');
      setPin(['', '', '', '']);
      pinRefs[0].current?.focus();
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/image/welcome.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <MaterialIcon name="arrow-back" size={28} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <View style={styles.lockCircle}>
                  <MaterialIcon name="dialpad" size={40} color="#4A7856" />
                </View>
              </View>

              <Text style={styles.title}>Enter Your PIN</Text>
              <Text style={styles.subtitle}>
                Enter your 4-digit PIN to access your account
              </Text>

              <View style={styles.pinContainer}>
                {pin.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={pinRefs[index]}
                    value={digit}
                    onChangeText={text => handlePinChange(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    style={styles.pinInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    secureTextEntry
                    mode="outlined"
                    outlineColor="rgba(74, 120, 86, 0.3)"
                    activeOutlineColor="#4A7856"
                    theme={{colors: {primary: '#4A7856', background: '#fff'}}}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleSignIn}
                activeOpacity={0.8}>
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('SigninForm')}
                activeOpacity={0.7}>
                <Text style={styles.usePasswordText}>Use email & password instead</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {flex: 1, resizeMode: 'cover'},
  overlay: {flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'center'},
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
  },
  backButtonText: {fontSize: 14, color: '#FFFFFF', marginLeft: 5, fontWeight: '600'},
  scrollContent: {flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20},
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    ...Platform.select({
      ios: {shadowColor: 'black', shadowOffset: {width: 0, height: 5}, shadowOpacity: 0.35, shadowRadius: 10},
      android: {elevation: 10},
    }),
  },
  iconContainer: {marginBottom: 20},
  lockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(74, 120, 86, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {fontSize: 24, fontWeight: '700', color: '#4A7856', marginBottom: 8, textAlign: 'center'},
  subtitle: {fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 25},
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 25,
  },
  pinInput: {
    width: 55,
    height: 55,
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: '#fff',
  },
  continueButton: {
    backgroundColor: '#4A7856',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    ...Platform.select({
      ios: {shadowColor: 'black', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.25, shadowRadius: 5},
      android: {elevation: 6},
    }),
  },
  continueButtonText: {fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5},
  usePasswordText: {fontSize: 13, color: '#4A7856', fontWeight: '600', textDecorationLine: 'underline'},
});

export default AddPin;
