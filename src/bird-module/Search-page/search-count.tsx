import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyCountTable from '../count-table/count-table';
import SQLite from 'react-native-sqlite-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
// Define the custom themes
const themes = {
  light: {
    colors: {
      background: '#ffffff',
      text: '#000000',
      button: '#516E9E',
      placeholder: 'gray',
    },
  },
  dark: {
    colors: {
      background: '#121212',
      text: '#ffffff',
      button: '#BB86FC',
      placeholder: '#b0b0b0',
    },
  },
};

const SearchCount = ({ setShowBirdCount }) => {
  const navigation = useNavigation();
  // const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startText, setStartText] = useState('');
  const [endText, setEndText] = useState('');
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [species, setSpecies] = useState('');
  const [rowEmail, setRowEmail] = useState('');
  const [email, setEmail] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Add state for theme

  console.log('Search by Count page');

  const db = SQLite.openDatabase(
    {name: 'user_db.db', location: 'default'},
    () => {
      console.log('Database opened successfully');
    },
    error => {
      console.error('Error opening database: ', error);
    },
  );

  console.log('row data are ', rowEmail);

  const showData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Users',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            console.log('Results:', results.rows._array); // This should give you an array of the rows
          } else {
            console.log('No data found.');
          }
        },
        error => {
          console.log('Error retrieving data: ', error);
        },
      );
    });
  };

  const retriveEmailFromSQLite = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT email FROM LoginData LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const email = results.rows.item(0).email;
            setEmail(email);
            console.log('Retrieved email edit permission : ', email);
            return {email};
          } else {
            console.log('No email and password stored.');
            return null;
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  };

  useEffect(() => {
    showData();
    retriveEmailFromSQLite();
  }, []);

  const handleSignUp = () => {
    console.log('Species:', species);
    console.log('Start Date:', startText);
    console.log('End Date:', endText);
    setShowTable(true);
  };

  const showStartDatepicker = () => {
    setShowStart(true);
  };

  const showEndDatepicker = () => {
    setShowEnd(true);
  };

  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStart(Platform.OS === 'ios');
    setStartDate(currentDate);
    setStartText(currentDate.toDateString());
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEnd(Platform.OS === 'ios');
    setEndDate(currentDate);
    setEndText(currentDate.toDateString());
  };
  const currentTheme = isDarkTheme ? themes.dark : themes.light;
  return (
    <ImageBackground
      source={require('./../../assets/image/imageD1.jpg')}
      style={[styles.backgroundImage, { backgroundColor: currentTheme.colors.background }]}>
      <TouchableOpacity onPress={() => setShowBirdCount(false)}>
        <IconButton
          icon="keyboard-backspace"
          iconColor="black"
          size={30}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>
      <ScrollView style={styles.title_container}>
         <View style={[styles.whiteBox, { backgroundColor: currentTheme.colors.background }]}>
          <View>
            <TextInput
              mode="outlined"
              placeholder="Observed Species"
              value={species}
              onChangeText={setSpecies}
              style={[styles.text_input, styles.text_input_gap, { color: currentTheme.colors.text ,borderColor: '#ccc',
                borderWidth: 1, }]}
              placeholderTextColor={currentTheme.colors.placeholder}
            />
          </View>

          <View style={styles.dateContainer}>
            <TouchableOpacity
              onPress={showStartDatepicker}
              style={[styles.dateInput, { backgroundColor: 'white' }]}>
              <Text style={{ color: currentTheme.colors.text }}>{startText || 'Start Date'}</Text>
              <Icon name="calendar" size={15} color="gray" style={styles.icon} />
            </TouchableOpacity>
            {showStart && (
              <DateTimePicker
                testID="startDateTimePicker"
                value={startDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeStart}
              />
            )}

            <TouchableOpacity
              onPress={showEndDatepicker}
              style={[styles.dateInput, { backgroundColor: 'white' }]}>
              <Text style={{ color: currentTheme.colors.text }}>{endText || 'End Date'}</Text>
              <Icon name="calendar" size={15} color="gray" style={styles.icon} />
            </TouchableOpacity>
            {showEnd && (
              <DateTimePicker
                testID="endDateTimePicker"
                value={endDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeEnd}
              />
            )}
          </View>

          <Button
            mode="contained"
            onPress={handleSignUp}
            style={styles.button_signup}
            buttonColor="#516E9E"
            textColor="white"
            labelStyle={styles.button_label}>
            Search
          </Button>
        </View>
        <View
          style={{
            marginTop: 30,
            backgroundColor: 'white',
          }}>
          {showTable && (
            <MyCountTable
              species={species}
              startDate={startText}
              endDate={endText}
            />
          )}
        </View>
      </ScrollView>
   
    
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '55%',
    height: 150,
    marginLeft: 'auto',
    marginRight: 24,
    marginTop: '60%',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginRight: 15,
    marginTop: 0,
    alignItems: 'center',
  },
  title_container: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    marginTop: '2%',
  },
  text_input_gap: {
    marginBottom: 10,
  },
  whiteBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 230,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 80,
    paddingVertical: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  text_input: {
    backgroundColor: 'white',
    width: 350,
    borderRadius: 10,
  },
  button_signup: {
    width: '90%',
    marginTop: 20,
    fontFamily: 'Inter-regular',
    borderRadius: 8,
  },
  button_label: {
    fontSize: 18,
  },
  dateInput: {
    width: 180,
    height: 55,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#516E9E',
    borderRadius: 5,
  },
});

export default SearchCount;
