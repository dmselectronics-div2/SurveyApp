//import liraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  Image,
} from 'react-native';
import {
  Provider as PaperProvider,
  TextInput,
  DefaultTheme,
  Button,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {BackHandler} from 'react-native';
import FastImage from 'react-native-fast-image';
import SQLite from 'react-native-sqlite-storage';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#56FF64',
    text: 'red',
    placeholder: 'white',
    surface: 'rgba(217, 217, 217, 0.7)',
  },
};
// component
const Welcome = ({navigation, route}) => {
  // const navigation = useNavigation();

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

  // Get the email from route parameters
  const email = route?.params?.email || null;

  // const updateLoginEmailInSQLite = email => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'UPDATE LoginData SET email = ? WHERE id = 1',
  //       [email], 
  //       (tx, result) => {
  //         console.log('Email Update status updated in SQLite');
  //       },
  //       error => {
  //         console.error(
  //           'Error updating Email Confirmation status:',
  //           error.message,
  //         );
  //       },
  //     );
  //   });
  // };

  useEffect(() => {
    // updateLoginEmailInSQLite(email);
    const timer = setTimeout(() => {
      navigation.navigate('BluTallyStartPage');
    }, 2000);

    // Add back button handler
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true; // Prevents the default back button action
      },
    );

    return () => {
      clearTimeout(timer); // Cleanup the timer
      backHandler.remove(); // Remove the back button listener
    };
  }, []);

  return (
    <ImageBackground
      source={require('./../../assets/image/imageD1.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.title_container}>
        <View style={styles.whiteBox}>
          <FastImage
            source={require('../../assets/image/done.gif')}
            style={styles.doneIcon}
          />
          <Text style={styles.main_text}>Welcome</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

// styles
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
  doneIcon: {
    width: 104,
    height: 104,
    marginRight: 10,
    marginTop: 60,
  },

  title_container: {
    flex: 1,
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    // backgroundColor: 'white',
    fontFamily: 'JejuHallasan-Regular',
    marginTop: '20%',
  },
  main_text: {
    fontSize: 40,
    fontFamily: 'JejuHallasan-Regular',
    color: 'black',
    // fontWeight: 'bold',
    marginTop: 30,
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
    // width: '100%',
    height: 300,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 80,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default Welcome;
