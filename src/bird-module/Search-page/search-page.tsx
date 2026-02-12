import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Appearance,
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyDataTable from '../data-table/display-table';
import SelectEditMode from '../Edit-Survey/Edit-permition';

const themes = {
  light: {
    colors: {
      background: '#ffffff',
      card: '#f2f2f2',
      text: '#000000',
      button: '#516E9E',
      placeholder: 'gray',
      border: '#cccccc',
    },
  },
  dark: {
    colors: {
      background: '#121212',
      card: '#1e1e1e',
      text: '#ffffff',
      button: '#BB86FC',
      placeholder: '#b0b0b0',
      border: '#444444',
    },
  },
};

const SearchPage = ({ setShowPointFilter }) => {
  const systemTheme = Appearance.getColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(systemTheme === 'dark');

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
  const [email] = useState('');
  const [rowEmail, setRowEmail] = useState('');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkTheme(colorScheme === 'dark');
    });

    return () => subscription.remove();
  }, []);

  const currentTheme = isDarkTheme ? themes.dark : themes.light;

  const handleSearch = () => {
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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.colors.background },
      ]}>
      
      <TouchableOpacity onPress={() => setShowPointFilter(false)}>
        <IconButton
          icon="keyboard-backspace"
          iconColor={currentTheme.colors.text}
          size={30}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>

      <ScrollView>
        <View
          style={[
            styles.card,
            { backgroundColor: currentTheme.colors.card },
          ]}>

          <Dropdown
            style={[
              styles.dropdown,
              isFocus2 && styles.dropdownFocused,
              {
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.background,
              },
            ]}
            placeholderStyle={[
              styles.placeholderStyle,
              { color: currentTheme.colors.placeholder },
            ]}
            selectedTextStyle={[
              styles.selectedTextStyle,
              { color: currentTheme.colors.text },
            ]}
            inputSearchStyle={[
              styles.inputSearchStyle,
              { color: currentTheme.colors.text },
            ]}
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
              <View
                style={[
                  styles.itemContainer,
                  { backgroundColor: currentTheme.colors.card },
                ]}>
                <Text
                  style={{
                    color: currentTheme.colors.text,
                    fontSize: 16,
                  }}>
                  {item.label}
                </Text>
              </View>
            )}
          />

          <View style={styles.dateContainer}>
            <TouchableOpacity
              onPress={() => setShowStart(true)}
              style={[
                styles.dateInput,
                {
                  backgroundColor: currentTheme.colors.background,
                  borderColor: currentTheme.colors.border,
                },
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
                display="default"
                onChange={onChangeStart}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowEnd(true)}
              style={[
                styles.dateInput,
                {
                  backgroundColor: currentTheme.colors.background,
                  borderColor: currentTheme.colors.border,
                },
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
                display="default"
                onChange={onChangeEnd}
              />
            )}
          </View>

          <Button
            mode="contained"
            onPress={handleSearch}
            style={[
              styles.button,
              { backgroundColor: currentTheme.colors.button },
            ]}
            labelStyle={{ fontSize: 18 }}>
            Search
          </Button>
        </View>

        {showTable && (
          <MyDataTable
            point={value2}
            startDate={startText}
            endDate={endText}
            handleEdit={handleEdit}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  dropdownFocused: {
    borderColor: '#2b83217d',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemContainer: {
    padding: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  dateInput: {
    width: '48%',
    height: 55,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    marginTop: 25,
    borderRadius: 8,
  },
});

export default SearchPage;
