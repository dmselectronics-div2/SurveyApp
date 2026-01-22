import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyDataTable from '../data-table/display-table';
import MypureTable from '../data-table/search-table';
import { API_URL } from '../../config';
import SurveyFormPage from '../Edit-Survey/Edit-survey';
import SelectEditMode from '../Edit-Survey/Edit-permition';
import SQLite from 'react-native-sqlite-storage';
import MyCitizenTable from '../data-table/data-table-display';

// Define the themes
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

const CitySearchPage = ({ setShowCitizen }) => {
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
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Add state for theme
  console.log('Search by date page');
  const [email, setEmail] = useState('');

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
    console.log('Start Date:', startText);
    console.log('End Date:', endText);
    setShowTable(true);
  };

  const handleEdit = (data) => {
    setRowData(data);
    setRowEmail(data.email);
    if(email===data.email){
      console.log('Emails are same');
      setIsEditMode(true);
    }else {
      Alert.alert('Error', `You can't edit this form`);
    }
    
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

  if (isEditMode) {
    return <SelectEditMode rowData={rowData} setIsEditMode={setIsEditMode} />;
  }

  const currentTheme = isDarkTheme ? themes.dark : themes.light;

  return (
    <ImageBackground
      source={require('./../../assets/image/imageD1.jpg')}
      style={styles.backgroundImage}>
      <TouchableOpacity onPress={() => setShowCitizen(false)}>
        <IconButton
          icon="keyboard-backspace"
          iconColor="black"
          size={30}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>
      <ScrollView style={styles.title_container}>
        <View style={[styles.whiteBox, { backgroundColor: currentTheme.colors.background }]}>
          <View style={styles.dateContainer}>
            <TouchableOpacity
              onPress={showStartDatepicker}
              style={[styles.dateInput, { borderColor: currentTheme.colors.placeholder }]}>
              <Text style={{ color: currentTheme.colors.text }}>{startText || 'Start Date'}</Text>
              <Icon
                name="calendar"
                size={15}
                color={currentTheme.colors.placeholder}
                style={styles.icon}
              />
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
              style={[styles.dateInput, { borderColor: currentTheme.colors.placeholder }]}>
              <Text style={{ color: currentTheme.colors.text }}>{endText || 'End Date'}</Text>
              <Icon
                name="calendar"
                size={15}
                color={currentTheme.colors.placeholder}
                style={styles.icon}
              />
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
            style={[styles.button_signup, { backgroundColor: currentTheme.colors.button }]}
            textColor="white"
            labelStyle={styles.button_label}>
            Search
          </Button>
        </View>
        <View style={{marginTop:40}}>
          
            {showTable && (
              <MyCitizenTable
                startDate={startText}
                endDate={endText}
                // handleEdit={handleEdit}
                // rowData={rowEmail}
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
    height: 142,
    marginLeft: 'auto',
    marginRight: 24,
    marginTop: '10%',
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  icon: {
    marginLeft: 10,
  },
  dropdownFocused: {
    borderColor: 'blue',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 0,
    alignItems: 'center',
    marginRight:65
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  backButtonText: {
    marginLeft: 5,
    color: 'white',
    fontSize: 18,
  },
  dropdown_after_text: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  title_container: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    marginTop: '0',
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
  dateInput: {
    width: 180,
    height: 55,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight:2
  },
  whiteBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 160,
    width: '95%',
    marginTop: '5%',
    borderRadius: 15,
    padding: 20,
    marginLeft:10,
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default CitySearchPage;
