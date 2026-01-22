import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput,StyleSheet } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Test = () => {
  const [selectedValues, setSelectedValues] = useState([]); // To handle multiple selections
  const [waterAvailabilityOnLand, setWaterAvailabilityOnLand] = useState(null);
  const [waterAvailabilityWaterResources, setWaterAvailabilityWaterResources] = useState(null);
  const [waterLevelOnLand, setwaterLevelOnLand] = useState('');
  const [waterLevelWaterResources, setwaterLevelWaterResources] = useState('');
  const [isFocus5, setIsFocus5] = useState(false);

  const radio_props = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ];

  const data5 = [
    { label: 'On Land', value: 'On Land' },
    { label: 'Water Resources', value: 'Water Resources' }
  ];

  // Handle the multi-select behavior and reset values when necessary
  const handleChange = (item) => {
    if (!selectedValues.includes(item.value)) {
      setSelectedValues([...selectedValues, item.value]); // Add selected item
    } else {
      setSelectedValues(selectedValues.filter(value => value !== item.value)); // Remove deselected item
    }

    // Reset the water availability and levels if On Land or Water Resources are deselected
    if (item.value === 'On Land' && !selectedValues.includes(item.value)) {
      setWaterAvailabilityOnLand(null);
      setwaterLevelOnLand('');
    } else if (item.value === 'Water Resources' && !selectedValues.includes(item.value)) {
      setWaterAvailabilityWaterResources(null);
      setwaterLevelWaterResources('');
    }
  };

  // Render the dropdown and its content
  return (
    <View>
      {/* Dropdown Component */}
      <Dropdown
        style={[styles.dropdown, isFocus5 && styles.dropdownFocused]} // Styles
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data5}
        search
        maxHeight={400}
        labelField="label"
        valueField="value"
        placeholder={selectedValues.length > 0 ? selectedValues.join(', ') : 'Select Options'} // Show selected options in the placeholder
        searchPlaceholder="Search..."
        value={selectedValues}
        onFocus={() => setIsFocus5(true)}
        onBlur={() => setIsFocus5(false)}
        onChange={item => handleChange(item)}
        renderItem={(item) => (
          <>
            <TouchableOpacity onPress={() => handleChange(item)}>
              <View style={[styles.item, selectedValues.includes(item.value) ? styles.itemSelected : {}]}>
                <Text style={styles.itemText}>{item.label}</Text>
              </View>
            </TouchableOpacity>

            {/* Render Radio Buttons for "On Land" */}
            {item.value === 'On Land' && selectedValues.includes('On Land') && (
              <View style={styles.radioContainer}>
                <Text>Water Availability (On Land)</Text>
                <RadioForm
                  radio_props={radio_props}
                  initial={-1}
                  onPress={(value) => setWaterAvailabilityOnLand(value)}
                />
              </View>
            )}

            {/* Show Water Level input for "On Land" when water availability is "Yes" */}
            {selectedValues.includes('On Land') && waterAvailabilityOnLand === 'Yes' && (
              <View style={styles.textInputContainer}>
                <TextInput
                  placeholder="Water Level for On Land (cm)"
                  value={waterLevelOnLand}
                  onChangeText={setwaterLevelOnLand}
                  style={styles.text_input}
                />
              </View>
            )}

            {/* Render Radio Buttons for "Water Resources" */}
            {item.value === 'Water Resources' && selectedValues.includes('Water Resources') && (
              <View style={styles.radioContainer}>
                <Text>Water Availability (Water Resources)</Text>
                <RadioForm
                  radio_props={radio_props}
                  initial={-1}
                  onPress={(value) => setWaterAvailabilityWaterResources(value)}
                />
              </View>
            )}

            {/* Show Water Level input for "Water Resources" when water availability is "Yes" */}
            {selectedValues.includes('Water Resources') && waterAvailabilityWaterResources === 'Yes' && (
              <View style={styles.textInputContainer}>
                <TextInput
                  placeholder="Water Level for Water Resources (cm)"
                  value={waterLevelWaterResources}
                  onChangeText={setwaterLevelWaterResources}
                  style={styles.text_input}
                />
              </View>
            )}
          </>
        )}
      />

      {/* Display selected values in the placeholder */}
      <Text>{selectedValues.length > 0 ? selectedValues.join(', ') : 'Select Options'}</Text>
    </View>
  );
};


export default Test;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(217,217,217,0.9)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    height: 380,
    width: width * 0.95,
  },
  container2: {
    backgroundColor: 'rgba(217,217,217,0.9)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,

  },
  container3: {
    backgroundColor: 'rgba(217,217,217,0.9)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,

  },
  textRow: {
    marginBottom: 10, // space between text and radio buttons
  },
  dropdown: {
    height: 50,
    width: width * 0.9,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },

  dropdownFocused: {
    borderColor: 'blue',
  },
  textInputContainer: {
    padding: 10,
    marginVertical: 5,
  },
  dropdown_after_text: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  text_input_after_drop: {
    width: '95%',
    height: 50,
    borderRadius: 10,
    marginTop: 15,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title_container: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    marginTop: '20%',
  },

  main_text: {
    fontSize: 20,
    fontFamily: 'InriaSerif-Bold',
    color: '#434343',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',

  },
  radioContainer: {
    marginTop: 0,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  radio_topic: {
    marginBottom: 10
  }
  ,
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 10,
  },
  main_text3: {
    fontSize: 20,
    fontFamily: 'InriaSerif-Bold',
    color: '#434343',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',

  },
  sub_text: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
  },
  sub_text_bold: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
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
    height: 370,
    backgroundColor: '#D9D9D9',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 10,
  },
  whiteBox2: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 720,
    backgroundColor: '#D9D9D9',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 15,
  },
  whiteBox3: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 350,
    backgroundColor: '#D9D9D9',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 15,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  text_input: {
    width: width * 0.9,
    height: 50,
    borderRadius: 16,

  },
  text_input2: {
    height: 50,
    borderRadius: 10,
  },
  text_input4: {
    width: width * 0.9,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'white',
  },

  txtInputOutline: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
  },

  dropdownNew: {
    marginTop: 15,
  },

  dropdownNewTwo: {
    marginBottom: 15,
  },

  text_input3: {
    height: 100,
    borderRadius: 10,
  },

  button_signup: {
    width: '90%',
    marginTop: 30,
    marginBottom: 30,
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: '#fff',
  },
  label: {
    marginBottom: 10,
    fontSize: 18,
  },
  input: {
    width: 300,
    height: 40,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  dateInput: {
    height: 50,
    paddingLeft: 10,
    marginTop: 2,
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: 18,
  },
  timeInput: {
    height: 50,
    padding: 10,
    marginTop: 1,
    marginBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  whiteBoxContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownTwo: {
    height: 50,
    width: width * 0.9,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    display: 'flex',
    alignContent: 'space-between',
  },

  calendarTxt: {
    color: 'black',
    fontSize: 16,
  },

  dropdownTree: {
    width: '95%',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  errorBorder: {
    borderColor: 'red',
  },
});
