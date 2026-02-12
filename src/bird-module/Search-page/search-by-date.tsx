import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MypureTable from '../data-table/search-table';
import SelectEditMode from '../Edit-Survey/Edit-permition';
import { getDatabase } from '../database/db';

// Define the themes
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

const PureSearchPage = ({ setShowDateFilter }) => {
  const navigation = useNavigation();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startText, setStartText] = useState('');
  const [endText, setEndText] = useState('');
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [rowEmail, setRowEmail] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [email, setEmail] = useState('');

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
            console.log('Retrieved email edit permission:', storedEmail);
          } else {
            console.log('No email stored.');
          }
        },
        error => {
          console.log('Error querying LoginData table: ' + error.message);
        },
      );
    });
  };

  useEffect(() => {
    showData();
    retriveEmailFromSQLite();
  }, []);

  const handleSearch = () => {
    console.log('Start Date:', startText);
    console.log('End Date:', endText);
    setShowTable(true);
  };

  const handleEdit = data => {
    setRowData(data);
    setRowEmail(data.email);

    if (email === data.email) {
      setIsEditMode(true);
    } else {
      Alert.alert('Error', `You can't edit this form`);
    }
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

  if (isEditMode) {
    return (
      <SelectEditMode
        rowData={rowData}
        setIsEditMode={setIsEditMode}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <TouchableOpacity onPress={() => setShowDateFilter(false)}>
        <IconButton
          icon="keyboard-backspace"
          iconColor={currentTheme.colors.text}
          size={30}
        />
      </TouchableOpacity>

      <ScrollView style={styles.title_container}>
        <View style={[styles.whiteBox, { backgroundColor: currentTheme.colors.background }]}>
          <View style={styles.dateContainer}>
            {/* Start Date */}
            <TouchableOpacity
              onPress={() => setShowStart(true)}
              style={[
                styles.dateInput,
                { borderColor: currentTheme.colors.placeholder },
              ]}>
              <Text style={{ color: currentTheme.colors.text }}>
                {startText || 'Start Date'}
              </Text>
              <Icon
                name="calendar"
                size={15}
                color={currentTheme.colors.placeholder}
              />
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

            {/* End Date */}
            <TouchableOpacity
              onPress={() => setShowEnd(true)}
              style={[
                styles.dateInput,
                { borderColor: currentTheme.colors.placeholder },
              ]}>
              <Text style={{ color: currentTheme.colors.text }}>
                {endText || 'End Date'}
              </Text>
              <Icon
                name="calendar"
                size={15}
                color={currentTheme.colors.placeholder}
              />
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
            onPress={handleSearch}
            style={[
              styles.button_signup,
              { backgroundColor: currentTheme.colors.button },
            ]}
            textColor="white"
            labelStyle={styles.button_label}>
            Search
          </Button>
        </View>

        <View style={{ marginTop: 40 }}>
          {showTable && (
            <MypureTable
              startDate={startText}
              endDate={endText}
              handleEdit={handleEdit}
              rowData={rowEmail}
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
  title_container: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
  },
  dateInput: {
    width: 160,
    height: 55,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  whiteBox: {
    alignItems: 'center',
    height: 160,
    width: '95%',
    marginTop: '5%',
    borderRadius: 15,
    padding: 20,
    alignSelf: 'center',
  },
  button_signup: {
    marginTop: 20,
    borderRadius: 10,
    height: 50,
    width: 150,
  },
  button_label: {
    fontSize: 16,
  },
});

export default PureSearchPage;
