import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
  Appearance,
} from 'react-native';
import {Button, List, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import axios from 'axios';
import {API_URL} from '../../config';

const theme = {
  colors: {
    primary: '#56FF64',
    text: 'red',
    placeholder: 'white',
    surface: 'rgba(217, 217, 217, 0.7)',
  },
};

const GetUserName = ({navigation, route}) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [name, setName] = useState('');

  // Get the email from route parameters
  const email = route?.params?.email || null;

  // SQLite Database
  const db = SQLite.openDatabase(
    {name: 'user_db.db', location: 'default'},
    () => {
      console.log('Database opened');
    },
    err => {
      console.error('Database error: ', err);
    },
  );

  // Function to update the pin in SQLite
  const updateNameInSQLite = (email) => {
    if (!email) {
      Alert.alert('Error', 'Email is required.');
      return;
    }

    console.log('email is ', email, ' name', name);
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Users SET name = ? WHERE email = ?',
        [name, email],
        (tx, result) => {
          if (result.rowsAffected > 0) {
            console.log('Name updated in SQLite');
            // Alert.alert('Success', 'Your name has been updated.');
            // navigation.navigate('Welcome', {email});
          } else {
            console.log(result);
            Alert.alert('Error', 'Failed to update name in SQLite.');
          }
        },
        error => {
          console.error('Error updating name:', error.message);
          Alert.alert('Error', 'Failed to update name. Please try again.');
        },
      );
    });
  };

  const handleSignUp = () => {
    if (name && name.trim() !== '') {
      console.log('name',name);
      handlePostName(name);
    } else {
      Alert.alert('Please enter your name!');
    }
  };

  const handlePostName = (name) => {
    const userData = {
      email: email,
      name: name,
    };
    axios
      .post(`${API_URL}/add-username`, userData)
      .then(res => {
        if (res.data.status === 'ok') {
          // Save user to SQLite after backend success
          updateNameInSQLite(email);
          Alert.alert('Successfully added your name!');
          navigation.navigate('Welcome', {email});
        } else {
          Alert.alert('Error', res.data.data);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'Error registering user. Please try again.');
      });
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);
  

  const isDarkMode = theme === 'dark';

  return (
    <ImageBackground
      source={require('./../../assets/image/imageD.jpg')}
      style={styles.backgroundImage}>
      <ScrollView style={styles.title_container}>
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
            style={[styles.main_text, {color: isDarkMode ? 'white' : 'black'}]}>
            Enter your name
          </Text>
          <View style={styles.center_list}>
            <TextInput
              label="Name"
              value={name}
              onChangeText={text => setName(text)}
              mode="outlined"
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSignUp}
            style={[styles.button_signup, {borderRadius: 8}]}
            buttonColor="#516E9E"
            textColor="white"
            labelStyle={styles.button_label}>
            Set Name
          </Button>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Your existing styles here
  container: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '55%',
    height: 102,
    marginLeft: 'auto',
    marginRight: 24,
    marginTop: '60%',
  },
  title_container: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    marginTop: '20%',
  },
  main_text: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  sub_text: {
    fontSize: 18,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
  },
  sub_text_bold: {
    fontSize: 18,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text_container: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 342,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 80,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  text_input: {
    width: 55,
  },
  button_signup: {
    width: '90%',
    marginTop: 50,
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
  bottom_container: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  flex_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex_container_text_input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 40,
  },
  center_list: {
    marginTop: 40,
    width: '90%',
  },
  list_menu: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    maxHeight: 210,
  },
});

export default GetUserName;
