import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import { getDatabase } from '../database/db';
import DateTimePicker from '@react-native-community/datetimepicker';

// Define the custom themes
const themes = {
  light: {
    colors: {
      background: '#ffffff',
      text: '#000000',
      button: '#086411a7',
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
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const currentTheme = isDarkTheme ? themes.dark : themes.light;

  const showData = async () => {
    const db = await getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Users',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            console.log('Results:', results.rows._array);
          }
        },
        error => {
          console.log('Error retrieving data: ', error);
        },
      );
    });
  };

  const retriveEmailFromSQLite = async () => {
    const db = await getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT email FROM LoginData LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const storedEmail = results.rows.item(0).email;
            setEmail(storedEmail);
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

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      
      <TouchableOpacity onPress={() => setShowBirdCount(false)}>
        <IconButton
          icon="keyboard-backspace"
          iconColor={currentTheme.colors.text}
          size={30}
        />
      </TouchableOpacity>

      <ScrollView style={styles.title_container}>
        <View style={[styles.whiteBox, { backgroundColor: currentTheme.colors.background }]}>
          
          <TextInput
            placeholder="Observed Species"
            value={species}
            onChangeText={setSpecies}
            style={[
              styles.text_input,
              styles.text_input_gap,
              {
                color: currentTheme.colors.text,
                borderColor: '#ccc',
                borderWidth: 1,
              },
            ]}
            placeholderTextColor={currentTheme.colors.placeholder}
          />

          <View style={styles.dateContainer}>
            
            <TouchableOpacity
              onPress={() => setShowStart(true)}
              style={[styles.dateInput, { backgroundColor: 'white' }]}>

              <Text style={{ color: currentTheme.colors.text }}>
                {startText || 'Start Date'}
              </Text>

              <Icon name="calendar" size={15} color="gray" />
            </TouchableOpacity>

            {showStart && (
              <DateTimePicker
                value={startDate}
                mode="date"
                is24Hour
                display="default"
                onChange={onChangeStart}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowEnd(true)}
              style={[styles.dateInput, { backgroundColor: 'white' }]}>

              <Text style={{ color: currentTheme.colors.text }}>
                {endText || 'End Date'}
              </Text>

              <Icon name="calendar" size={15} color="gray" />
            </TouchableOpacity>

            {showEnd && (
              <DateTimePicker
                value={endDate}
                mode="date"
                is24Hour
                display="default"
                onChange={onChangeEnd}
              />
            )}
          </View>

          <Button
            mode="contained"
            onPress={handleSignUp}
            style={styles.button_signup}
            buttonColor={currentTheme.colors.button}
            textColor="white"
            labelStyle={styles.button_label}>
            Search
          </Button>
        </View>

        <View style={{ marginTop: 30 }}>
          {showTable && (
            <MyCountTable
              species={species}
              startDate={startText}
              endDate={endText}
            />
          )}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
  },
  title_container: {
    flex: 1,
    marginTop: '2%',
  },
  text_input_gap: {
    marginBottom: 10,
  },
  whiteBox: {
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 80,
    paddingVertical: 20,
  },
  text_input: {
    backgroundColor: 'white',
    width: 350,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  button_signup: {
    width: '90%',
    marginTop: 20,
    borderRadius: 8,
  },
  button_label: {
    fontSize: 18,
  },
  dateInput: {
    width: 170,
    height: 55,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default SearchCount;
