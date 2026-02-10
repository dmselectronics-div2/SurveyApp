import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Appearance, // Import the Appearance API
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyDataTable from '../data-table/display-table';
import SelectEditMode from '../Edit-Survey/Edit-permition';
import { getDatabase } from '../database/db';

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

const SearchPage = ({ setShowPointFilter }) => {
  const [selectedArea, setSelectedArea] = useState('Preferred Area');
  const [value2, setValue2] = useState(null);
  const [isFocus2, setIsFocus2] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startText, setStartText] = useState('');
  const [endText, setEndText] = useState('');
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [email, setEmail] = useState('');
  const [rowEmail, setRowEmail] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Add state for theme



  const handleSignUp = () => {
    console.log('Selected Point:', value2);
    console.log('Start Date A:', startText);
    console.log('End Date:', endText);
    setShowTable(true);
  };

  const handleEdit = (data) => {
    setRowData(data);
    setRowEmail(data.email);
    if (email === data.email) {
      setIsEditMode(true);
    } else {
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
      <TouchableOpacity onPress={() => setShowPointFilter(false)}>
        <IconButton
          icon="keyboard-backspace"
          iconColor={currentTheme.colors.text}
          size={30}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>
      <ScrollView style={styles.title_container}>
        <View style={[styles.whiteBox, { backgroundColor: currentTheme.colors.background }]}>
          <View style={styles.center_list}>
          <Dropdown
  style={[
    styles.dropdown,
    isFocus2 && styles.dropdownFocused,
    { borderColor: currentTheme.colors.border, backgroundColor: currentTheme.colors.background },
  ]}
  placeholderStyle={[styles.placeholderStyle, { color: currentTheme.colors.placeholder }]}
  selectedTextStyle={[styles.selectedTextStyle, { color: currentTheme.colors.text }]}
  inputSearchStyle={[styles.inputSearchStyle, { color: currentTheme.colors.text }]}
  iconStyle={styles.iconStyle}
  data={[
    { label: 'Point 1', value: 'Point 1' },
    { label: 'Point 2', value: 'Point 2' },
    { label: 'Point 3', value: 'Point 3' },
    { label: 'Point 4', value: 'Point 4' },
    { label: 'Point 5', value: 'Point 5' },
  ]}
  labelField="label"
  valueField="value"
  placeholder={!isFocus2 ? 'Select Point' : ''}
  value={value2}
  onFocus={() => setIsFocus2(true)}
  onBlur={() => setIsFocus2(false)}
  onChange={(item) => {
    setValue2(item.value);
    setIsFocus2(false);
  }}
  renderItem={(item) => (
    <View style={[styles.itemContainer, { backgroundColor: currentTheme.colors.background }]}>
      <Text style={[styles.itemText, { color: isDarkTheme ? '#000000' : currentTheme.colors.text }]}>
        {item.label}
      </Text>
    </View>
  )}
/>
          </View>

          <View style={styles.dateContainer}>
            <TouchableOpacity
              onPress={showStartDatepicker}
              style={[styles.dateInput, { backgroundColor: currentTheme.colors.background }]}>
              <Text style={{ color: currentTheme.colors.text }}>{startText || 'Start Date'}</Text>
              <Icon name="calendar" size={15} color={currentTheme.colors.placeholder} />
            </TouchableOpacity>
            {showStart && (
              <DateTimePicker
                testID="startDateTimePicker"
                value={startDate}
                mode="date"
                display="default"
                onChange={onChangeStart}
              />
            )}
            <TouchableOpacity
              onPress={showEndDatepicker}
              style={[styles.dateInput, { backgroundColor: currentTheme.colors.background }]}>
              <Text style={{ color: currentTheme.colors.text }}>{endText || 'End Date'}</Text>
              <Icon name="calendar" size={15} color={currentTheme.colors.placeholder} />
            </TouchableOpacity>
            {showEnd && (
              <DateTimePicker
                testID="endDateTimePicker"
                value={endDate}
                mode="date"
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

        <View style={{ marginTop: 30 }}>
          {showTable && (
            <MyDataTable
              point={value2}
              startDate={startText}
              endDate={endText}
              handleEdit={handleEdit}
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
    marginTop: '60%',
  },
  toggleButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: '#516E9E',
    borderRadius: 5,
    margin: 10,
  },
  backButtonText: {
    marginLeft: 5,
    color: 'white',
    fontSize: 18,
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
    marginTop: '1%',
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
    width: 170,
    height: 55,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
 
  },
  whiteBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 230,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 20,
    paddingVertical: 20,
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
    marginTop: 20,
    fontFamily: 'Inter-regular',
    borderRadius: 8,
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
    width: '90%',
    marginBottom: 20,
  },
  list_menu: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    maxHeight: 210,
  },
});

export default SearchPage;
