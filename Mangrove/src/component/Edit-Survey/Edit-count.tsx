

import { useRoute } from '@react-navigation/native';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  Image,ImageBackground, ScrollView,TouchableOpacity, Alert,PermissionsAndroid,Dimensions} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Provider as PaperProvider, TextInput, DefaultTheme, Button,List, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import GetLocation from 'react-native-get-location';
import { launchImageLibrary } from 'react-native-image-picker';
import DisplayTable from '../data-table/display-table';
import MyDataTable from '../data-table/display-table';
import axios from 'axios';
import { API_URL } from '../../config';
API_URL
import CustomAlert from '../custom-alert/alert-design'

const { width, height } = Dimensions.get('window');
const EditCount = ({ rowData, setShowBirdCount }) => {
  const route = useRoute();
  // const { rowData } = route.params;

  // Initialize state with rowData
  const [value1, setValue1] = useState(rowData?.habitatType || '');
  const [isFocus1, setIsFocus1] = useState(false);

  const [value2, setValue2] = useState(rowData?.point || '');
  const [isFocus2, setIsFocus2] = useState(false);

  const [value3, setValue3] = useState(rowData?.pointTag || '');
  const [isFocus3, setIsFocus3] = useState(false);

  const [value4, setValue4] = useState(rowData?.weatherCondition || '');
  const [isFocus4, setIsFocus4] = useState(false);

  const [value5, setValue5] = useState(rowData?.presenceOfWater || '');
  const [isFocus5, setIsFocus5] = useState(false);

  const [value6, setValue6] = useState(rowData?.seasonOfPaddyField || '');
  const [isFocus6, setIsFocus6] = useState(false);

  const [value7, setValue7] = useState(rowData?.statusOfVegetation || '');
  const [isFocus7, setIsFocus7] = useState(false);

  const [value8, setValue8] = useState(rowData?.maturity || '');
  const [isFocus8, setIsFocus8] = useState(false);

  const [value9, setValue9] = useState(rowData?.sex || '');
  const [isFocus9, setIsFocus9] = useState(false);

  const [value10, setValue10] = useState(rowData?.behavior || '');
  const [isFocus10, setIsFocus10] = useState(false);

  const [value11, setValue11] = useState(rowData?.identification || '');
  const [isFocus11, setIsFocus11] = useState(false);

  const [value12, setValue12] = useState(rowData?.status || '');
  const [isFocus12, setIsFocus12] = useState(false);

  const [latitude, setLatitude] = useState(rowData?.latitude || '');
  const [longitude, setLongitude] = useState(rowData?.longitude || '');

  const [date, setDate] = useState(new Date(rowData?.date || Date.now()));
  const [show, setShow] = useState(false);

  const [radius, setRadius] = useState(rowData?.radiusOfArea || '');
  const [observers, setObservers] = useState(rowData?.observers || '');
  const [remark, setRemark] = useState(rowData?.remark || '');
  const [species, setSpecies] = useState(rowData?.observedSpecies || '');
  const [count, setCount] = useState(rowData?.count || '');
  const [text, setText] = useState(date.toDateString());

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [selectedStartTime, setSelectedStartTime] = useState(new Date(rowData?.startTime || Date.now()));
  const [selectedEndTime, setSelectedEndTime] = useState(new Date(rowData?.endTime || Date.now()));
  const [imageUri, setImageUri] = useState(rowData?.imageUri || null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);



  const resetForm = () => {
    
    setCount('');
    
  };
  
  // const handleSignUp = async () => {
  //   showAlert();
  //   const formData = {
  //     habitatType: value1,
  //     point: value2,
  //     pointTag: value3,
  //     latitude,
  //     longitude,
  //     date,
  //     observers,
  //     startTime: selectedStartTime,
  //     endTime: selectedEndTime,
  //     Weather: value4,
  //     water: value5,
  //     season: value6,
  //     statusOfVegy: value7,
  //     species,
  //     count,
  //     maturity: value8,
  //     sex: value9,
  //     behaviour: value10,
  //     identification: value11,
  //     status: value12,
  //     radiusOfArea: radius,
  //     remark,
  //     imageUri,
  //   };
  
  //     axios.post(`${API_URL}/form-entry`, formData)
  //     .then(response => {
  //       console.log('Form submitted successfully:', response.data);
  //       resetForm(); 
  //     })
  //     .catch(error => {
  //       console.error('Error submitting form:', error);
  //     });
    
  
  // };

  const handleSignUp = async () => {
    showAlert();
    
    // Get the ID of the record you want to update
    const recordId = rowData._id; // Ensure rowData is correctly passed and _id exists
  
    const formData = {
      habitatType: value1,
      point: value2,
      pointTag: value3,
      latitude,
      longitude,
      date,
      observers,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      Weather: value4,
      water: value5,
      season: value6,
      statusOfVegy: value7,
      species,
      count,
      maturity: value8,
      sex: value9,
      behaviour: value10,
      identification: value11,
      status: value12,
      radiusOfArea: radius,
      remark,
      imageUri,
    };
  
    try {
      const response = await axios.put(`${API_URL}/form-entry/${recordId}`, formData);
      console.log('Form updated successfully:', response.data);
      resetForm();
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };
  
  
  const renderLabel = (label, value, isFocus) => {
    if (value || isFocus) {
      return label;
    }
    return `Select ${label.toLowerCase()}`;
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "This app needs access to your location.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the location");
            getCurrentLocation();
          } else {
            console.log("Location permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getCurrentLocation();
      }
    };

    const getCurrentLocation = () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
      .then(location => {
        setLatitude(location.latitude.toString());
        setLongitude(location.longitude.toString());
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      });
    };

    requestLocationPermission();
  }, []);
  
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  
  const showAlert = () => {
    setIsAlertVisible(true);
  };

  const hideAlert = () => {
    setIsAlertVisible(false);
  };

  return (
   
    <ImageBackground
    source={require('./../../assets/image/imageD1.jpg')}
    style={styles.backgroundImage}
>
<TouchableOpacity onPress={() => setShowBirdCount(false)}>
        <IconButton
          icon="keyboard-backspace"
          iconColor="black"
          size={30}
          style={{marginRight: 20}}
        />
      </TouchableOpacity>
<ScrollView contentContainerStyle={styles.scrollContainer}>
        {!isFormSubmitted ? ( // Conditional rendering based on form submission state
          <View>
  

    <View style={styles.container3}>
    <Text style={styles.main_text3}>Bird Detail Record</Text>
   
        <View>
        
        <TextInput
                                  mode="outlined"
                                  placeholder="Count"
                        
                                  value={count}
                                  onChangeText={setCount}
                                  style={[styles.text_input2, styles.text_input_gap]}
                              />
                             
        </View>
        <CustomAlert
                  visible={isAlertVisible}
                  onClose={hideAlert}
                  message="Successfully saved Edited count!"
                />
 
            <Button
              mode="contained"
              onPress={handleSignUp}
              style={[styles.button_signup, { borderRadius: 8 }]}
              buttonColor='green'
              textColor='white'
              labelStyle={styles.button_label}
            >
              Submit
            </Button>
          </View>
          </View>
        ) : (
          <View style={styles.container}>
                <Text style={styles.main_text3}>Bird Detail Record</Text>
          <MyDataTable data={formEntries} />
          </View>
        )}

    </ScrollView>
    </ImageBackground>
    
  );
};

export default EditCount;

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
    marginTop: 55,
    marginBottom: 15,

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
    flexDirection: 'row'
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
    width:400
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
});


