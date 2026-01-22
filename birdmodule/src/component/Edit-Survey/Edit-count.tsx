

// import { useRoute } from '@react-navigation/native';

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet,  Image,ImageBackground, ScrollView,TouchableOpacity, Alert,PermissionsAndroid,Dimensions} from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';
// import { Provider as PaperProvider, TextInput, DefaultTheme, Button,List, IconButton } from 'react-native-paper';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import GetLocation from 'react-native-get-location';
// import { launchImageLibrary } from 'react-native-image-picker';
// import DisplayTable from '../data-table/display-table';
// import MyDataTable from '../data-table/display-table';
// import axios from 'axios';
// import { API_URL } from '../../config';
// API_URL
// import CustomAlert from '../custom-alert/alert-design'

// const { width, height } = Dimensions.get('window');
// const EditCount = ({ count, setShowBirdCount }) => {
//   const route = useRoute();
//   // const { rowData } = route.params;

//   // Initialize state with rowData
//   const [value1, setValue1] = useState(rowData?.habitatType || '');
//   const [isFocus1, setIsFocus1] = useState(false);

//   const [value2, setValue2] = useState(rowData?.point || '');
//   const [isFocus2, setIsFocus2] = useState(false);

//   const [value3, setValue3] = useState(rowData?.pointTag || '');
//   const [isFocus3, setIsFocus3] = useState(false);

//   const [value4, setValue4] = useState(rowData?.weatherCondition || '');
//   const [isFocus4, setIsFocus4] = useState(false);

//   const [value5, setValue5] = useState(rowData?.presenceOfWater || '');
//   const [isFocus5, setIsFocus5] = useState(false);

//   const [value6, setValue6] = useState(rowData?.seasonOfPaddyField || '');
//   const [isFocus6, setIsFocus6] = useState(false);

//   const [value7, setValue7] = useState(rowData?.statusOfVegetation || '');
//   const [isFocus7, setIsFocus7] = useState(false);

//   const [value8, setValue8] = useState(rowData?.maturity || '');
//   const [isFocus8, setIsFocus8] = useState(false);

//   const [value9, setValue9] = useState(rowData?.sex || '');
//   const [isFocus9, setIsFocus9] = useState(false);

//   const [value10, setValue10] = useState(rowData?.behavior || '');
//   const [isFocus10, setIsFocus10] = useState(false);

//   const [value11, setValue11] = useState(rowData?.identification || '');
//   const [isFocus11, setIsFocus11] = useState(false);

//   const [value12, setValue12] = useState(rowData?.status || '');
//   const [isFocus12, setIsFocus12] = useState(false);

//   const [latitude, setLatitude] = useState(rowData?.latitude || '');
//   const [longitude, setLongitude] = useState(rowData?.longitude || '');

//   const [date, setDate] = useState(new Date(rowData?.date || Date.now()));
//   const [show, setShow] = useState(false);

//   const [radius, setRadius] = useState(rowData?.radiusOfArea || '');
//   const [observers, setObservers] = useState(rowData?.observers || '');
//   const [remark, setRemark] = useState(rowData?.remark || '');
//   const [species, setSpecies] = useState(rowData?.observedSpecies || '');
//   const [count, setCount] = useState(rowData?.count || '');
//   const [text, setText] = useState(date.toDateString());

//   const [showStartTimePicker, setShowStartTimePicker] = useState(false);
//   const [showEndTimePicker, setShowEndTimePicker] = useState(false);

//   const [selectedStartTime, setSelectedStartTime] = useState(new Date(rowData?.startTime || Date.now()));
//   const [selectedEndTime, setSelectedEndTime] = useState(new Date(rowData?.endTime || Date.now()));
//   const [imageUri, setImageUri] = useState(rowData?.imageUri || null);
//   const [isFormSubmitted, setIsFormSubmitted] = useState(false);



//   const resetForm = () => {
    
//     setCount('');
    
//   };
  
//   // const handleSignUp = async () => {
//   //   showAlert();
//   //   const formData = {
//   //     habitatType: value1,
//   //     point: value2,
//   //     pointTag: value3,
//   //     latitude,
//   //     longitude,
//   //     date,
//   //     observers,
//   //     startTime: selectedStartTime,
//   //     endTime: selectedEndTime,
//   //     Weather: value4,
//   //     water: value5,
//   //     season: value6,
//   //     statusOfVegy: value7,
//   //     species,
//   //     count,
//   //     maturity: value8,
//   //     sex: value9,
//   //     behaviour: value10,
//   //     identification: value11,
//   //     status: value12,
//   //     radiusOfArea: radius,
//   //     remark,
//   //     imageUri,
//   //   };
  
//   //     axios.post(`${API_URL}/form-entry`, formData)
//   //     .then(response => {
//   //       console.log('Form submitted successfully:', response.data);
//   //       resetForm(); 
//   //     })
//   //     .catch(error => {
//   //       console.error('Error submitting form:', error);
//   //     });
    
  
//   // };

//   const handleSignUp = async () => {
//     showAlert();
    
//     // Get the ID of the record you want to update
//     const recordId = rowData._id; // Ensure rowData is correctly passed and _id exists
  
//     const formData = {
//       habitatType: value1,
//       point: value2,
//       pointTag: value3,
//       latitude,
//       longitude,
//       date,
//       observers,
//       startTime: selectedStartTime,
//       endTime: selectedEndTime,
//       Weather: value4,
//       water: value5,
//       season: value6,
//       statusOfVegy: value7,
//       species,
//       count,
//       maturity: value8,
//       sex: value9,
//       behaviour: value10,
//       identification: value11,
//       status: value12,
//       radiusOfArea: radius,
//       remark,
//       imageUri,
//     };
  
//     try {
//       const response = await axios.put(`${API_URL}/form-entry/${recordId}`, formData);
//       console.log('Form updated successfully:', response.data);
//       resetForm();
//     } catch (error) {
//       console.error('Error updating form:', error);
//     }
//   };
  
  
//   const renderLabel = (label, value, isFocus) => {
//     if (value || isFocus) {
//       return label;
//     }
//     return `Select ${label.toLowerCase()}`;
//   };

//   useEffect(() => {
//     const requestLocationPermission = async () => {
//       if (Platform.OS === 'android') {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             {
//               title: "Location Permission",
//               message: "This app needs access to your location.",
//               buttonNeutral: "Ask Me Later",
//               buttonNegative: "Cancel",
//               buttonPositive: "OK"
//             }
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             console.log("You can use the location");
//             getCurrentLocation();
//           } else {
//             console.log("Location permission denied");
//           }
//         } catch (err) {
//           console.warn(err);
//         }
//       } else {
//         getCurrentLocation();
//       }
//     };

//     const getCurrentLocation = () => {
//       GetLocation.getCurrentPosition({
//         enableHighAccuracy: true,
//         timeout: 15000,
//       })
//       .then(location => {
//         setLatitude(location.latitude.toString());
//         setLongitude(location.longitude.toString());
//       })
//       .catch(error => {
//         const { code, message } = error;
//         console.warn(code, message);
//       });
//     };

//     requestLocationPermission();
//   }, []);
  
//   const [isAlertVisible, setIsAlertVisible] = useState(false);
  
//   const showAlert = () => {
//     setIsAlertVisible(true);
//   };

//   const hideAlert = () => {
//     setIsAlertVisible(false);
//   };

//   return (
   
//     <ImageBackground
//     source={require('./../../assets/image/imageD1.jpg')}
//     style={styles.backgroundImage}
// >
// <TouchableOpacity onPress={() => setShowBirdCount(false)}>
//         <IconButton
//           icon="keyboard-backspace"
//           iconColor="black"
//           size={30}
//           style={{marginRight: 20}}
//         />
//       </TouchableOpacity>
// <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {!isFormSubmitted ? ( // Conditional rendering based on form submission state
//           <View>
  

//     <View style={styles.container3}>
//     <Text style={styles.main_text3}>Bird Detail Record</Text>
   
//         <View>
        
//         <TextInput
//                                   mode="outlined"
//                                   placeholder="Count"
                        
//                                   value={count}
//                                   onChangeText={setCount}
//                                   style={[styles.text_input2, styles.text_input_gap]}
//                               />
                             
//         </View>
//         <CustomAlert
//                   visible={isAlertVisible}
//                   onClose={hideAlert}
//                   message="Successfully saved Edited count!"
//                 />
 
//             <Button
//               mode="contained"
//               onPress={handleSignUp}
//               style={[styles.button_signup, { borderRadius: 8 }]}
//               buttonColor='green'
//               textColor='white'
//               labelStyle={styles.button_label}
//             >
//               Submit
//             </Button>
//           </View>
//           </View>
//         ) : (
//           <View style={styles.container}>
//                 <Text style={styles.main_text3}>Bird Detail Record</Text>
//           <MyDataTable data={formEntries} />
//           </View>
//         )}

//     </ScrollView>
//     </ImageBackground>
    
//   );
// };

// export default EditCount;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'rgba(217,217,217,0.9)',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 15,
//     marginBottom: 15,
//     height: 380,
//     width: width * 0.95,
//   },
//   container2: {
//     backgroundColor: 'rgba(217,217,217,0.9)',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 15,
//     marginBottom: 15,

//   },
//   container3: {
//     backgroundColor: 'rgba(217,217,217,0.9)',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 55,
//     marginBottom: 15,

//   },
//   dropdown: {
//     height: 50,
//     width: width * 0.9,
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     backgroundColor: 'white',
//   },

//   dropdownFocused: {
//     borderColor: 'blue',
//   },
//   dropdown_after_text: {
//     height: 50,
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     justifyContent: 'center',
//   },
//   placeholderStyle: {
//     fontSize: 16,
//     color: 'gray',
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//     color: 'black',
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   text_input_after_drop: {
//     width: '95%',
//     height: 50,
//     borderRadius: 10,
//     marginTop: 15,
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//   },
//   scrollContainer: {
//     paddingBottom: 20,
//   },
//   title_container: {
//     flex: 1,
//     fontFamily: 'Inter-Bold',
//     marginTop: '20%',
//   },

//   main_text: {
//     fontSize: 20,
//     fontFamily: 'InriaSerif-Bold',
//     color: '#434343',
//     marginTop: 10,
//     marginBottom: 10,
//     justifyContent: 'center',
//     alignItems: 'center',

//   },
//   radioContainer: {
//     marginTop: 0,
//     marginBottom: 10,
//     display: 'flex',
//     flexDirection: 'row'
//   }
//   ,
//   iconButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#007bff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 15,
//     marginLeft: 10,
//   },
//   main_text3: {
//     fontSize: 20,
//     fontFamily: 'InriaSerif-Bold',
//     color: '#434343',
//     marginTop: 10,
//     marginBottom: 10,
//     justifyContent: 'center',

//   },
//   sub_text: {
//     fontSize: 16,
//     fontFamily: 'Inter-regular',
//     color: '#000000',
//     textAlign: 'center',
//   },
//   sub_text_bold: {
//     fontSize: 16,
//     fontFamily: 'Inter-regular',
//     color: '#000000',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   text_container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     height: 142,
//   },
//   whiteBox: {
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     height: 370,
//     backgroundColor: '#D9D9D9',
//     marginLeft: 14,
//     marginRight: 14,
//     marginTop: 10,
//   },
//   whiteBox2: {
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     height: 720,
//     backgroundColor: '#D9D9D9',
//     marginLeft: 14,
//     marginRight: 14,
//     marginTop: 15,
//   },
//   whiteBox3: {
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     height: 350,
//     backgroundColor: '#D9D9D9',
//     marginLeft: 14,
//     marginRight: 14,
//     marginTop: 15,
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   text_input: {
//     width: width * 0.9,
//     height: 50,
//     borderRadius: 16,

//   },
//   text_input2: {
//     height: 50,
//     borderRadius: 10,
//     width:400
//   },
//   text_input4: {
//     width: width * 0.9,
//     height: 50,
//     borderRadius: 16,
//     backgroundColor: 'white',
//   },

//   txtInputOutline: {
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: 'black',
//   },

//   dropdownNew: {
//     marginTop: 15,
//   },

//   dropdownNewTwo: {
//     marginBottom: 15,
//   },

//   text_input3: {
//     height: 100,
//     borderRadius: 10,
//   },

//   button_signup: {
//     width: '90%',
//     marginTop: 30,
//     marginBottom: 30,
//     fontFamily: 'Inter-regular',
//   },
//   button_label: {
//     fontSize: 18,
//   },
//   sub_text_A: {
//     fontSize: 16,
//     fontFamily: 'Inter-regular',
//     color: '#000000',
//     textAlign: 'right',
//   },
//   sub_text_B: {
//     fontSize: 16,
//     fontFamily: 'Inter-regular',
//     color: '#000000',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   bottom_container: {
//     flexDirection: 'row',
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   flex_container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   flex_container_text_input: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   box: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 15,
//     borderRadius: 6,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     color: '#fff',
//   },
//   label: {
//     marginBottom: 10,
//     fontSize: 18,
//   },
//   input: {
//     width: 300,
//     height: 40,
//     padding: 10,
//     marginTop: 5,
//     marginBottom: 15,
//     backgroundColor: 'white',
//     borderRadius: 5,
//     borderColor: '#ccc',
//     borderWidth: 1,
//   },
//   dateInput: {
//     height: 50,
//     paddingLeft: 10,
//     marginTop: 2,
//     borderRadius: 5,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexDirection: 'row',
//     fontSize: 18,
//   },
//   timeInput: {
//     height: 50,
//     padding: 10,
//     marginTop: 1,
//     marginBottom: 15,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   icon: {
//     marginRight: 10,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     marginTop: 10,
//   },
//   whiteBoxContainer: {
//     marginTop: 10,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dropdownTwo: {
//     height: 50,
//     width: width * 0.9,
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 15,
//     backgroundColor: 'white',
//     justifyContent: 'space-between',
//     display: 'flex',
//     alignContent: 'space-between',
//   },

//   calendarTxt: {
//     color: 'black',
//     fontSize: 16,
//   },

//   dropdownTree: {
//     width: '95%',
//     borderRadius: 8,
//     marginBottom: 15,
//     backgroundColor: 'white',
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Appearance,
  Modal
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native'; 

import { Dropdown } from 'react-native-element-dropdown';
import {
  Provider as PaperProvider,
  TextInput,
  DefaultTheme,
  Button,
  List,
  IconButton
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import GetLocation from 'react-native-get-location';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DisplayTable from '../data-table/display-table';
import MyDataTable from '../data-table/display-table';
import axios from 'axios';
import CustomAlert from '../custom-alert/alert-design';
import { Dimensions } from 'react-native';
import birdSpecies from '../survey-drafts/bird-list';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { API_URL } from '../../config';
import SQLite from 'react-native-sqlite-storage';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';

const data15 = birdSpecies;
const { width, height } = Dimensions.get('window');

const data = [
  { label: 'Tanks', value: 'Tanks' },
  { label: 'Dutch Canal', value: 'Dutch Canal' },
  { label: 'Beach', value: 'Beach' },
  { label: 'Paddy Field', value: 'Paddy Field' },
  { label: 'Woody Pathway', value: 'Woody Pathway' },
  { label: 'Grassland', value: 'Grassland' },
  { label: 'Monocrop-Coconut', value: 'Monocrop-Coconut' },
  { label: 'Home Garden', value: 'Home Garden' },
  { label: 'Natural Mangroves', value: 'Natural Mangroves' },
  { label: 'ANRM site', value: 'ANRM site' },
  { label: 'Other', value: 'Other' },
];
const data1 = [
  { label: 'Point 1', value: 'Point 1' },
  { label: 'Point 2', value: 'Point 2' },
  { label: 'Point 3', value: 'Point 3' },
  { label: 'Point 4', value: 'Point 4' },
  { label: 'Point 5', value: 'Point 5' },
];

const data2 = [
  { label: 'T1', value: 'T1' },
  { label: 'T2', value: 'T2' },
  { label: 'T3', value: 'T3' },
  { label: 'T4', value: 'T4' },
  { label: 'T5', value: 'T5' },
  { label: 'T6', value: 'T6' },
  { label: 'T7', value: 'T7' },
  { label: 'T8', value: 'T8' },
];

const data4 = [
  { label: 'Cloud Cover', value: 'Cloud Cover' },
  { label: 'Rain', value: 'Rain' },
  { label: 'Wind', value: 'Wind' },
  { label: 'Sunshine', value: 'Sunshine' },
];

const radio_props1 = [
  { label: 'None', value: 'None' },
  { label: 'Drizzle', value: 'Drizzle' },
  { label: 'Showers', value: 'Showers' },
  { label: 'Thunder Showers', value: 'Thunder Showers' },
];

const radio_props = [
  { label: '0-33%', value: '0-33%' },
  { label: '33%-66%', value: '33%-66%' },
  { label: '66%-100%', value: '66%-100%' },
];

const radio_props2 = [
  { label: 'Calm', value: 'Calm' },
  { label: 'Light', value: 'Light' },
  { label: 'Breezy', value: 'Breezy' },
  { label: 'Gale', value: 'Gale' },
];

const radio_props3 = [
  { label: 'Low', value: 'Low' },
  { label: 'Moderate', value: 'Moderate' },
  { label: 'High', value: 'High' },
];

const radio_props4 = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

const radio_props5 = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

const data5 = [
  { label: 'On Land', value: 'On Land' },
  { label: 'Water Resources', value: 'Water Resources' },
];

const data6 = [
  { label: 'Farming', value: 'Farming' },
  { label: 'Harvesting', value: 'Harvesting' },
  { label: 'Fallow Season', value: 'Fallow Season' },
];

const data7 = [
  { label: 'Flowering', value: 'Flowering' },
  { label: 'Fruiting', value: 'Fruiting' },
  { label: 'Dry Vegetation', value: 'Dry Vegetation' },
  { label: 'Harvesting (for paddy fields)', value: 'Harvesting (for paddy fields)' },
];

const data8 = [
  { label: 'Hatchlings', value: 'Hatchlings' },
  { label: 'Juvenile', value: 'Juvenile' },
  { label: 'Adult', value: 'Adult' },
  { label: 'Adult non breeding', value: 'Adult non breeding' },
  { label: 'Adult breeding', value: 'Adult breeding' },
];

const data9 = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Unknown', value: 'Unknown' },
];

const data10 = [
  { label: 'Nesting', value: 'Nesting' },
  { label: 'Flying', value: 'Flying' },
  { label: 'Resting', value: 'Resting' },
  { label: 'Singing', value: 'Singing' },
  { label: 'Swimming', value: 'Swimming' },
  { label: 'Walking', value: 'Walking' },
  { label: 'Feeding', value: 'Feeding' },
  { label: 'Roosting', value: 'Roosting' },
];

const data12 = [
  { label: 'Endemic', value: 'Endemic' },
  { label: 'Resident', value: 'Resident' },
  { label: 'Migrant', value: 'Migrant' },
  { label: 'Vagrant', value: 'Vagrant' },
  { label: 'Other', value: 'Other' },
];
const data11 = [
  { label: 'Sighting', value: 'Sighting' },
  { label: 'Listening', value: 'Listening' },
];

const addText = () => {
  if (text.trim()) {
    setContent([...content, { type: 'text', text }]);
    setRemark(prevRemark => prevRemark + text + "\n");
    setText('');
  }
};


const openCamera1 = () => {
  launchCamera({ mediaType: 'photo', quality: 1 }, response => {
    if (response.assets) {
      const uri = response.assets[0].uri;
      setContent([...content, { type: 'image', uri }]);
      setRemark(prevRemark => prevRemark + `Image URI: ${uri}\n`);
    }
  });
};

const openGallery1 = () => {
  launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
    if (response.assets) {
      const uri = response.assets[0].uri;
      setContent([...content, { type: 'image', uri }]);
      setRemark(prevRemark => prevRemark + `Image URI: ${uri}\n`); // Append image URI to remark
    }
  });
};


const WeatherConditionModal = ({ visible, onClose, onSelect }) => {
  const [cloudCover, setCloudCover] = useState(null);
  const [rain, setRain] = useState(null);
  const [wind, setWind] = useState(null);
  const [sunshine, setSunshine] = useState(null);
  const [weatherSummary, setWeatherSummary] = useState(""); // ✅ New state to store formatted text
  // const [theme, setTheme] = useState(Appearance.getColorScheme());
  // const isDarkMode = theme === 'dark';
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);
  // Function to update weather summary
  const updateWeatherSummary = (cloud, rain, wind, sun) => {
    let summary = [];

    if (cloud) summary.push(`Cloud - ${cloud}`);
    if (rain) summary.push(`Rain - ${rain}`);
    if (wind) summary.push(`Wind - ${wind}`);
    if (sun) summary.push(`Sunshine - ${sun}`);

    setWeatherSummary(summary.join(", "));
  };

  const handleSave = () => {
    onSelect(weatherSummary);
    console.log("Selected Weather Conditions:", weatherSummary);
    updateWeatherSummary(cloudCover, rain, wind, sunshine); // ✅ Update weather summary
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
      <View
          style={[
            styles.modalContent,
            { backgroundColor: isDarkMode ? 'white' : 'white' },
          ]}
        >
          <Text style={[styles.modalTitle, { color: isDarkMode ? '#000' : '#000' }]}>{weatherSummary || "Select Weather Condition"}</Text> 
          {/* ✅ Display selected values dynamically */}

          <Dropdown
  style={[
    styles.dropdown,
    {
      backgroundColor: 'white', // Always white background
    },
  ]}
  placeholderStyle={{
    color: 'black', // Black placeholder text
  }}
  selectedTextStyle={{
    color: 'black', // Black selected text
  }}
  itemTextStyle={{
    color: 'black', // Black dropdown item text
  }}
  containerStyle={{
    backgroundColor: 'white', // White background for dropdown menu
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  }}
  data={radio_props}
  labelField="label"
  valueField="value"
  placeholder="Cloud Cover"
  value={cloudCover}
  onChange={item => {
    setCloudCover(item.value);
    updateWeatherSummary(item.value, rain, wind, sunshine);
  }}
/>

<Dropdown
  style={[
    styles.dropdown,
    {
      backgroundColor: 'white', // Always white background
    },
  ]}
  placeholderStyle={{
    color: 'black', // Black placeholder text
  }}
  selectedTextStyle={{
    color: 'black', // Black selected text
  }}
  itemTextStyle={{
    color: 'black', // Black dropdown item text
  }}
  containerStyle={{
    backgroundColor: 'white', // White background for dropdown menu
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  }}
  data={radio_props1}
  labelField="label"
  valueField="value"
  placeholder="Rain"
  value={rain}
  onChange={item => {
    setRain(item.value);
    updateWeatherSummary(cloudCover, item.value, wind, sunshine);
  }}
/>
<Dropdown
  style={[
    styles.dropdown,
    {
      backgroundColor: 'white', // Always white background
    },
  ]}
  placeholderStyle={{
    color: 'black', // Black placeholder text
  }}
  selectedTextStyle={{
    color: 'black', // Black selected text
  }}
  itemTextStyle={{
    color: 'black', // Black dropdown item text
  }}
  containerStyle={{
    backgroundColor: 'white', // White background for dropdown menu
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  }}
  data={radio_props2}
  labelField="label"
  valueField="value"
  placeholder="Wind"
  value={wind}
  onChange={item => {
    setWind(item.value);
    updateWeatherSummary(cloudCover, rain, item.value, sunshine);
  }}
/>
<Dropdown
  style={[
    styles.dropdown,
    {
      backgroundColor: 'white', // Always white background
    },
  ]}
  placeholderStyle={{
    color: 'black', // Black placeholder text
  }}
  selectedTextStyle={{
    color: 'black', // Black selected text
  }}
  itemTextStyle={{
    color: 'black', // Black dropdown item text
  }}
  containerStyle={{
    backgroundColor: 'white', // White background for dropdown menu
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  }}
  data={radio_props3}
  labelField="label"
  valueField="value"
  placeholder="Sunshine"
  value={sunshine}
  onChange={item => {
    setWind(item.value);
    updateWeatherSummary(cloudCover, rain, wind, item.value);
  }}
/> 

         

          <Button mode="contained" onPress={handleSave}   style={[styles.button_signup, { backgroundColor: 'green' }]}  labelStyle={{ color: 'white' }}>
            Save
          </Button>
        </View>
      </View>
    </Modal>
  );
};


const WaterAvailabilityModal = ({ visible, onClose, onSelect }) => {
  const [onLand, setOnLand] = useState(null);
  const [waterReservoir, setWaterReservoir] = useState(null);
  const [showWaterLevelPopup, setShowWaterLevelPopup] = useState(false);
  const [waterLevel, setWaterLevel] = useState('');
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const handleSave = () => {
    if (waterReservoir === 'Yes') {
      setShowWaterLevelPopup(true);
    } else {
      onSelect({ onLand, waterReservoir, waterLevel: '' });
      onClose();
    }
  };

  const handleWaterLevelSave = () => {
    onSelect({ onLand, waterReservoir, waterLevel });
    setShowWaterLevelPopup(false);
    onClose();
  };

  return (
    <>
      {/* Water Availability Modal */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
 <View
          style={[
            styles.modalContent,
            { backgroundColor: isDarkMode ? 'white' : 'white' },
          ]}
        >
                      <Text style={[styles.modalTitle, { color: isDarkMode ? '#000' : '#000' }]}>Select Water Availability</Text>

                      <Dropdown
  style={[
    styles.dropdown,
    {
      backgroundColor: 'white', // Always white background
    },
  ]}
  placeholderStyle={{
    color: 'black', // Black placeholder text
  }}
  selectedTextStyle={{
    color: 'black', // Black selected text
  }}
  itemTextStyle={{
    color: 'black', // Black dropdown item text
  }}
  containerStyle={{
    backgroundColor: 'white', // White background for dropdown menu
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  }}
  data={radio_props5}
  labelField="label"
  valueField="value"
  placeholder="On Land"
  value={onLand}
  onChange={(item) => setOnLand(item.value)}
/>

          
<Dropdown
  style={[
    styles.dropdown,
    {
      backgroundColor: 'white', // Always white background
    },
  ]}
  placeholderStyle={{
    color: 'black', // Black placeholder text
  }}
  selectedTextStyle={{
    color: 'black', // Black selected text
  }}
  itemTextStyle={{
    color: 'black', // Black dropdown item text
  }}
  containerStyle={{
    backgroundColor: 'white', // White background for dropdown menu
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  }}
  data={radio_props5}
  labelField="label"
  valueField="value"
  placeholder="Water Reservoir"
  value={waterReservoir}
  onChange={(item) => setWaterReservoir(item.value)}
  
/>
        

            <Button mode="contained" onPress={handleSave}  style={[styles.button_signup, { backgroundColor: 'green' }]}  labelStyle={{ color: 'white' }}>
              Save
            </Button>
          </View>
        </View>
      </Modal>

      {/* Water Level Popup */}
      <Modal visible={showWaterLevelPopup} transparent animationType="slide">
        <View style={styles.modalOverlay}>
        
    <View
      style={[
        styles.modalContent,
        {
          backgroundColor: 'white', // Ensures White Background
        },
      ]}
    >
            <Text style={styles.modalTitle}>Enter Water Level (cm)</Text>
            <TextInput
              mode="outlined"
              placeholder="Water Level"
              value={waterLevel}
              onChangeText={(text) => setWaterLevel(text)}
              keyboardType="numeric"
              style={[
                styles.textInput,
                {
                  backgroundColor: 'white', // Forces White Background
                  color: 'black', // Ensures Text is Black
                },
              ]}
            />
            <Button mode="contained" onPress={handleWaterLevelSave} style={[styles.button_signup, { backgroundColor: 'green' }]}  labelStyle={{ color: 'white' }}>
              Save
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};



const EditCount = () => {
  const route = useRoute();
  const { selectedItemData } = route.params || {};
  console.log('Selected item data:', selectedItemData);
  const birdObservation = selectedItemData?.birdObservations[0];
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [newId, setNewId] = useState(null);
  const [isFocus1, setIsFocus1] = useState(false);

  const [isFocus2, setIsFocus2] = useState(false);

  const [isFocus3, setIsFocus3] = useState(false);

  const [isFocus4, setIsFocus4] = useState(false);

  const [isFocus6, setIsFocus6] = useState(false);

  const [isFocus7, setIsFocus7] = useState(false);

  const [isFocus8, setIsFocus8] = useState(false);

  const [isFocus9, setIsFocus9] = useState(false);

  const [isFocus10, setIsFocus10] = useState(false);

  const [isFocus11, setIsFocus11] = useState(false);

  const [isFocus12, setIsFocus12] = useState(false);

  // const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [selectedStartTime, setSelectedStartTime] = useState(
    selectedItemData?.startTime ? new Date(selectedItemData.startTime) : new Date()
  );
  const [selectedEndTime, setSelectedEndTime] = useState(
    selectedItemData?.endTime ? new Date(selectedItemData.endTime) : new Date()
  );
  const [date, setDate] = useState(
    selectedItemData?.date ? new Date(selectedItemData.date) : new Date()
  );
  const [text, setText] = useState(date.toDateString());
  
  const [formEntries, setFormEntries] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [cloudIntensity, setCloudIntensity] = useState('');
  const [rainIntensity, setRainIntensity] = useState('');
  const [windIntensity, setWindIntensity] = useState('');
  const [sunshineIntensity, setSunshineIntensity] = useState('');
  const [waterAvailability, setWaterAvailability] = useState(null);
  const [selectedWeatherConditions, setSelectedWeatherConditions] = useState(
    [],
  );
  const [value8, setValue8] = useState(birdObservation?.maturity || '');
  const [value9, setValue9] = useState(birdObservation?.sex || '');
  const [value10, setValue10] = useState(birdObservation?.behaviour || '');
  const [value11, setValue11] = useState(birdObservation?.identification || '');
  const [value12, setValue12] = useState(birdObservation?.status || '');
  const [selectedBehaviours, setSelectedBehaviours] = useState([]);
  const [selectedCloudIntensity, setSelectedCloudIntensity] = useState(null);
  const [errors, setErrors] = useState({});
  const [waterLevelWaterResources, setwaterLevelWaterResources] = useState('');
  const [waterAvailabilityWaterResources, setWaterAvailabilityWaterResources] =
    useState(null);
  const [selectedValues, setSelectedValues] = useState([]);

  const [waterLevel, setWaterLevel] = useState('');
  const [selectedWaterConditions, setSelectedWaterConditions] = useState([]);
  const [isFocus5, setIsFocus5] = useState(false);
  const [waterAvailabilityOnLand, setWaterAvailabilityOnLand] = useState(null);
  const [waterAvailabilityOnResources, setWaterAvailabilityOnResources] =
    useState(null);
  const [waterLevelOnLand, setWaterLevelOnLand] = useState('');
  const [waterLevelOnResources, setWaterLevelOnResources] = useState('');
  const [weather, setWeather] = useState(selectedItemData?.weather || '');
  const [email, setEmail] = useState('');
  const [behaviours, setBehaviours] = useState('');

  const [isWeatherModalVisible, setWeatherModalVisible] = useState(false);
  const [weatherSelection, setWeatherSelection] = useState({});
  const [isWaterModalVisible, setWaterModalVisible] = useState(false);
  const [waterSelection, setWaterSelection] = useState({});


  const [birdDataArray, setBirdDataArray] = useState([]);
  // const [selectedWeatherString, setSelectedWeatherString] = useState("");

  const [content, setContent] = useState([]);
  const [text1, setText1] = useState('');

  const [value1, setValue1] = useState(selectedItemData?.habitatType || '');
  const [value2, setValue2] = useState(selectedItemData?.point || '');
  const [value3, setValue3] = useState(selectedItemData?.pointTag || '');
  const [value4, setValue4] = useState(selectedItemData?.weather || '');
  const [value5, setValue5] = useState(selectedItemData?.water || '');
  const [value6, setValue6] = useState(selectedItemData?.season || '');
  const [value7, setValue7] = useState(selectedItemData?.statusOfVegy || '');
  const [latitude, setLatitude] = useState(selectedItemData?.latitude || '');
  const [longitude, setLongitude] = useState(selectedItemData?.longitude || '');
  const [radius, setRadius] = useState(selectedItemData?.radiusOfArea || '');
  const [observers, setObservers] = useState(selectedItemData?.observers || '');
  const [species, setSpecies] = useState(birdObservation?.species || '');
  const [count, setCount] = useState(birdObservation?.count || '');
  const [descriptor, setDescriptor] = useState(selectedItemData?.descriptor || '');
  const [remark, setRemark] = useState(birdObservation?.remarks || '');
  console.log('remark is ', birdObservation?.remarks);
  const [imageUri, setImageUri] = useState(birdObservation?.imageUri || '');
  const [selectedWeatherString, setSelectedWeatherString] = useState(
    selectedItemData?.weather ? selectedItemData.weather.replace(/"/g, '') : ''
  );
  
  const [selectedWeatherString1, setSelectedWeatherString1] = useState(
    selectedItemData?.water ? selectedItemData.water.replace(/"/g, '') : ''
  );
    const navigation = useNavigation(); 

  const db = SQLite.openDatabase(
    { name: 'user_db.db', location: 'default' },
    () => {
      console.log('Database opened successfully');
    },
    error => {
      console.error('Error opening database: ', error);
    },
  );



  useEffect(() => {
    retriveEmailFromSQLite();
    retriveAllFromDataSQLite();
  }, []);

  useEffect(() => {

    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS bird_survey (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT,
          uniqueId TEXT,
          habitatType TEXT,
          point TEXT,
          pointTag TEXT,
          latitude TEXT,
          longitude TEXT,
          date TEXT,
          observers TEXT,
          startTime TEXT,
          endTime TEXT,
          weather TEXT,
          water TEXT,
          season TEXT,
          statusOfVegy TEXT,
          species TEXT,
          count TEXT,
          maturity TEXT,
          sex TEXT,
          behaviour TEXT,
          identification TEXT,
          status TEXT,
          radiusOfArea TEXT,
          remark TEXT,
          imageUri TEXT,
          cloudIntensity TEXT,
          rainIntensity TEXT,
          windIntensity TEXT,
          sunshineIntensity TEXT,
          waterLevel TEXT
        );`,
        [],
        () => console.log('Table created successfully'),
        error => console.log('Error creating table: ', error),
      );
    });
  }, []);


  useEffect(() => {
    const handleNetworkChange = async state => {
      if (state.isConnected) {
        console.log('Internet connected, retrying failed submissions...');
        retryFailedSubmissions();
      }
    };

    const subscription = NetInfo.addEventListener(handleNetworkChange);

    return () => {
      subscription();
    };
  }, []);

  const retryFailedSubmissions = () => {
    console.log('Attempting to retry failed submissions...');
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM failed_submissions',
        [],
        (tx, results) => {
          console.log(`Found ${results.rows.length} failed submissions.`);
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              const formData = JSON.parse(row.formData);
              console.log('Retrying submission:', formData);


              axios
                .post(`${API_URL}/form-entry`, formData)
                .then(response => {
                  console.log(
                    'Form submitted successfully after retry:',
                    response.data,
                  );

                  const addedId = response.data._id;
                  const uniqueId = response.data.uniqueId;
                  const imageURI = response.data.imageUri;
                  console.log(
                    'added id new is ',
                    addedId,
                    ' unique id is ',
                    uniqueId,
                  );
                  deleteFailedSubmission(row.id);
                  console.log('next upload to image server ');
                  uploadImageToServer(imageURI, addedId);

                })
                .catch(error => {
                  console.error('Retry failed:', error);
                });
            }
          } else {
            console.log('No failed submissions to retry');
          }
        },
        error => {
          console.error('Error fetching failed submissions:', error);
        },
      );
    });
  };

  const deleteFailedSubmission = id => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM failed_submissions WHERE id = ?',
        [id],
        () => {
          console.log('Failed submission removed from the queue.');
          return;
        },
        error => {
          console.error('Error deleting failed submission:', error);
        },
      );
    });
  };

  const handleChoosePhoto = () => {
    Alert.alert(
      'Change Bird Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri);
        }
      },
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri);
        }
      },
    );
  };


  const uploadImageToServer = async (uri, addedId) => {
    console.log('uri is uploadImageToServer ', uri, ' ', addedId);
    if (!uri) {
      Alert.alert('No image selected', 'Please select an image before saving.');
      return;
    }

    console.log('Id in upload image ', addedId);
    const formData = new FormData();
    formData.append('profileImage', {
      uri,
      name: 'formImages.jpg',
      type: 'image/jpeg',
    });

    formData.append('id is', addedId);
    console.log('Image page email is ', addedId);

    try {
      const response = await fetch(`${API_URL}/api/upload-profile-image`, {

        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log('Server response:', responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);

        uploadPathToServer(data.filePath, addedId);

        console.log('Image uploaded successfully:', data.filePath);
      } else {
        console.error('Upload failed:', responseText);
        Alert.alert('Error', 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'An error occurred while uploading the image.');
    }
  };
  console.log(selectedBehaviours);


  const uploadPathToServer = async (uri, addedId) => {
    console.log('uri is ', uri, ' ', addedId);

    console.log('Image page newId is ', addedId);

    try {
      const response = await axios.put(
        `${API_URL}/post-image-path-form/${addedId}`,
        {
          uri,
        },
      );

      if (response.data.status === 'ok') {
        console.log('done and dusted');
        showAlert();
      } else {
        console.error('Upload failed:');
        Alert.alert('Error', 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'An error occurred while uploading the image.');
    }
  };



  const handleWaterChange = item => {
    if (selectedWaterConditions.includes(item.value)) {
      setSelectedWaterConditions(prevConditions =>
        prevConditions.filter(condition => condition !== item.value),
      );
    } else {
      setSelectedWaterConditions(prevConditions => [
        ...prevConditions,
        item.value,
      ]);
    }
  };

  const handleWeatherChange = item => {
    if (selectedWeatherConditions.includes(item.value)) {
      setSelectedWeatherConditions(
        selectedWeatherConditions.filter(condition => condition !== item.value),
      );
    } else {
      setSelectedWeatherConditions([...selectedWeatherConditions, item.value]);
    }
  };

  const renderSelectedWeatherConditions = () => {
    return selectedWeatherConditions.length > 0
      ? selectedWeatherConditions.join(', ')
      : 'Select Weather Condition';
  };

  const renderSelectedWaterConditions = () => {
    if (selectedWaterConditions.length === 0) {
      return 'Presence of Water';
    }
    return selectedWaterConditions.join(', ');
  };



  const renderSelectedBehaviours = () => {
    return selectedBehaviours.length > 0
      ? selectedBehaviours.join(', ')
      : 'Select Behaviour';
  };



  const handleBehaviourChange = item => {
    if (selectedBehaviours.includes(item.value)) {
      setSelectedBehaviours(
        selectedBehaviours.filter(behaviour => behaviour !== item.value),
      );
    } else {
      setSelectedBehaviours([...selectedBehaviours, item.value]);
    }
  };


  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || selectedStartTime;
    setShowStartTimePicker(Platform.OS === 'ios');
    setSelectedStartTime(currentTime);
  };

  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || selectedEndTime;
    setShowEndTimePicker(Platform.OS === 'ios');
    setSelectedEndTime(currentTime);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setText(currentDate.toLocaleDateString());
  };

  const showStartTimePickerHandler = () => {
    setShowStartTimePicker(true);
  };

  const showEndTimePickerHandler = () => {
    setShowEndTimePicker(true);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const [dob, setDOB] = useState(new Date());

  const handleDateChange = (date: Date) => {
    setDOB(date);
  };


  const compileWeatherConditions = () => {
    const cloud = cloudIntensity ? `Cloud - ${cloudIntensity}` : '';
    const rain = rainIntensity ? `Rain - ${rainIntensity}` : '';
    const wind = windIntensity ? `Wind - ${windIntensity}` : '';
    const sun = sunshineIntensity ? `Sunshine - ${sunshineIntensity}` : '';

    const weatherString = [cloud, rain, wind, sun].filter(Boolean).join(', ');
    setWeather(weatherString);
    return weatherString;
  };
  const compileBehaviours = () => {
    const behavioursString = selectedBehaviours.join(', ');
    setBehaviours(behavioursString);
    return behavioursString;
  };


  const compileWaterAvailability = () => {
    const onLand = waterAvailabilityOnLand
      ? `On Land - ${waterAvailabilityOnLand}`
      : '';
    const waterResources = waterAvailabilityOnResources
      ? `Water Resources - ${waterAvailabilityOnResources}`
      : '';

    const waterAvailabilityString = [onLand, waterResources]
      .filter(Boolean)
      .join(', ');
    return waterAvailabilityString;
  };

  const isFormValid = () => {
    let formErrors = {};
    // if (!value1) formErrors.value1 = 'Please select a habitat type';


    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const resetForm = () => {
    setValue1(null);
    setValue2(null);
    setValue3(null);
    setValue4(null);
    setValue5(null);
    setValue6(null);
    setValue7(null);
    setValue8(null);
    setValue9(null);
    setValue10(null);
    setValue11(null);
    setValue12(null);
    setLatitude('');
    setLongitude('');
    setDate(new Date());
    setDescriptor('');
    setRadius('');
    setObservers('');
    setRemark('');
    setSpecies('');
    setCount('');
    setText('');
    setSelectedStartTime(new Date());
    setSelectedEndTime(new Date());
    setImageUri(null);
    setIsFocus1(false);
    setIsFocus2(false);
    setIsFocus3(false);
    setIsFocus4(false);
    setIsFocus5(false);
    setIsFocus6(false);
    setIsFocus7(false);
    setIsFocus8(false);
    setIsFocus9(false);
    setIsFocus10(false);
    setIsFocus11(false);
    setIsFocus12(false);
    setCloudIntensity('');
    setRainIntensity('');
    setWindIntensity('');
    setSunshineIntensity('');
    // setwaterLevel('');
    setWaterAvailability(null);
    setWeather('');
    setSelectedWeatherConditions([]);
    setSelectedWaterConditions([]);
    setSelectedBehaviours([]);
    setWaterLevelOnLand('');
    setWaterLevelOnResources('');
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
            console.log('Retrieved email profile : ', email);
            return { email };
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


  const retriveAllFromDataSQLite = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM bird_survey',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              console.log('Bird Survey Data:', row);
            }
          } else {
            console.log('No bird survey data stored.');
            return null;
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  };

  const handleUpdate = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill required fields', [{ text: 'OK' }]);
      return;
    }
  
    // Prepare updated data for the form
    const updatedFormData = {
      email,
      uniqueId: selectedItemData?.uniqueId || '', // Use existing uniqueId
      habitatType: value1,
      behaviour: selectedBehaviours.join(', '),
      point: value2 || '',
      pointTag: value3 || '',
      latitude: latitude || '',
      longitude: longitude || '',
      date: date.toDateString(),
      observers: observers || '',
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      weather: value4 || '',
      water: value5 || '',
      season: value6 || '',
      statusOfVegy: value7 || '',
      descriptor: descriptor || '',
      radiusOfArea: radius || '',
      remark: remark || '',
      imageUri: imageUri || '',
  
      // Weather & Water Conditions
      cloudIntensity: value4 === 'Cloud Cover' ? cloudIntensity : '',
      rainIntensity: value4 === 'Rain' ? rainIntensity : '',
      windIntensity: value4 === 'Wind' ? windIntensity : '',
      sunshineIntensity: value4 === 'Sunshine' ? sunshineIntensity : '',
      waterAvailability: compileWaterAvailability(),
  
      // Bird Observation Details (retain existing if not updated)
      birdObservations: [
        {
          species: species || birdObservation?.species || '',
          count: count || birdObservation?.count || '',
          maturity: value8 || birdObservation?.maturity || '',
          sex: value9 || birdObservation?.sex || '',
          behaviour: selectedBehaviours.join(', ') || birdObservation?.behaviour || '',
          identification: value11 || birdObservation?.identification || '',
          status: value12 || birdObservation?.status || '',
          remarks: remark || birdObservation?.remarks || '',
          imageUri: imageUri || birdObservation?.imageUri || '',
        },
      ],
    };
  
    try {
      const response = await axios.put(`${API_URL}/form-entry/${selectedItemData._id}`, updatedFormData);
  
      if (response.status === 200) {
        console.log('Form updated successfully:', response.data);
        Alert.alert('Success', 'Form updated successfully');
        resetForm();
      } else {
        console.error('Update failed:', response.data);
        Alert.alert('Error', 'Failed to update form.');
      }
    } catch (error) {
      console.error('Error updating form:', error);
      Alert.alert('Error', 'An error occurred while updating the form.');
    }
  };
  
  const handleSignUp = async () => {
    if (!isFormValid()) {

      Alert.alert('Error', 'Please fill required fields', [{ text: 'OK' }]);
      return;
    }

    const usrEmail = email;
    console.log(' user email is : ', usrEmail);


    const now = new Date();


    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');


    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');


    const uniqueId = `${year}${month}${day}${hours}${minutes}${seconds}`;

    console.log('Unique ID is:', uniqueId);

    const formData = {
      email: usrEmail,
      uniqueId: uniqueId,
      habitatType: value1,
      behaviour: selectedBehaviours.join(', '),
      point: value2 || '',
      pointTag: value3 || '',
      latitude: latitude || '',
      longitude: longitude || '',
      date: date.toDateString(),
      observers: observers || '',
      startTime: selectedStartTime,
      endTime: selectedEndTime, // Optional field
      weather: value4 || '', // Optional field
      water: value5 || '', // Optional field
      season: value6 || '', // Optional field
      statusOfVegy: value7 || '',
      descriptor: descriptor || '',// Optional field
      species, // Required field
      count: count || '', // Optional field
      maturity: value8 || '', // Optional field
      sex: value9 || '', // Optional field
      // behaviour: value10 || '', // Optional field
      identification: value11 || '', // Optional field
      status: value12 || '', // Optional field
      radiusOfArea: radius || '', // Optional field
      remark: remark || '', // Optional field
      imageUri: imageUri || '', // Optional field
      cloudIntensity: value4 === 'Cloud Cover' ? cloudIntensity : '', // Conditional field
      rainIntensity: value4 === 'Rain' ? rainIntensity : '', // Conditional field
      windIntensity: value4 === 'Wind' ? windIntensity : '', // Conditional field
      sunshineIntensity: value4 === 'Sunshine' ? sunshineIntensity : '', // Conditional field
      // waterLevel: waterAvailability === 'Yes' ? waterLevel : '', // Conditional field
      waterAvailability: compileWaterAvailability(),
      waterLevelWaterResources,
      waterAvailabilityWaterResources,
      selectedValues,
      selectedBehaviours,
      waterLevel,
      selectedWaterConditions,
      waterAvailabilityOnLand,
      waterAvailabilityOnResources,
      waterLevelOnLand,
      waterLevelOnResources,
      Weather: weather,
    };

    saveFormDataSQL(formData);

    axios
      .post(`${API_URL}/form-entry`, formData)
      .then(response => {
        console.log('Form submitted successfully:', response.data);


        const addedId = response.data._id;
        console.log('added id new is ', addedId, ' unique id is ', uniqueId);

        if (addedId && addedId.length > 0) {
          console.log(addedId);
          uploadImageToServer(imageUri, addedId); // Upload the image only if ID is valid
        } else {
          console.error('Invalid _id:', addedId);
          Alert.alert('Error', 'Received invalid ID');
        }

        console.log('added id ', addedId);
        resetForm();
        // Alert.alert('Success', 'Form submitted successfully');
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        // saveFormDataSQL(formData);
        // Optionally, store the failed submission locally for retry later
        storeFailedSubmission(formData);
        // Alert.alert(
        //   'Error',
        //   'There was an error submitting the form in cloud storage. ',
        // );
      });
  };

  // Save failed submission data in a local queue for retry
  const storeFailedSubmission = formData => {
    // You can save failed submissions in a separate table/collection in SQLite for later retries
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO failed_submissions (formData) VALUES (?)',
        [JSON.stringify(formData)],
        () => {
          console.log('Failed submission saved locally.');
        },
        error => {
          console.error('Error saving failed submission:', error);
        },
      );
    });
  };

  const saveFormDataSQL = formData => {
    // Insert the form data into SQLite
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO bird_survey (
        email, uniqueId, habitatType, point, pointTag, latitude, longitude, date, observers,
        startTime, endTime, weather, water, season, statusOfVegy, species,
        count, maturity, sex, behaviour, identification, status, radiusOfArea,
        remark, imageUri, cloudIntensity, rainIntensity, windIntensity,
        sunshineIntensity, waterLevel
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);`,
        [
          formData.email,
          formData.uniqueId,
          formData.habitatType,
          formData.point,
          formData.pointTag,
          formData.latitude,
          formData.longitude,
          formData.date,
          formData.observers,
          formData.startTime,
          formData.endTime,
          formData.weather, // Fix: Ensure weather is included
          formData.water,
          formData.season,
          formData.statusOfVegy,
          formData.species,
          formData.count,
          formData.maturity,
          formData.sex,
          formData.behaviour,
          formData.identification,
          formData.status,
          formData.radiusOfArea,
          formData.remark,
          formData.imageUri,
          formData.cloudIntensity,
          formData.rainIntensity,
          formData.windIntensity,
          formData.sunshineIntensity,
          formData.waterLevel,
        ],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Data inserted successfully local db');
            saveImage(formData.imageUri, formData.uniqueId);
            resetForm();
          } else {
            console.log('Failed to insert data');
          }
        },
        error => {
          console.log('Error inserting data: ', error);
        },
      );
    });
  };

  const saveImage = async (imageURi, uniqueId) => {
    if (!imageURi) {
      Alert.alert('No image selected', 'Please select an image first.');
      return;
    }

    // Define the path where you want to save the image
    //const path = `${RNFS.DocumentDirectoryPath}/profile_image.jpg`; // You can save it to other directories as well
    const path = `${RNFS.CachesDirectoryPath}/${uniqueId}.jpg`;


    try {
      // Copy the file from the URI to the defined path
      await RNFS.copyFile(imageURi, path);
      //Alert.alert('Image saved', `Profile image saved at: ${path}`);
      console.log(path);
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save the image.');
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
              title: 'Location Permission',
              message: 'This app needs access to your location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
            getCurrentLocation();
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getCurrentLocation();
      }
    };

    const getCurrentLocation = () => {
      // Only update latitude and longitude if they are not already set
      if (!latitude || !longitude) {
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
      }
    };

    requestLocationPermission();
  }, [latitude, longitude]);


  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const showAlert = () => {
    setIsAlertVisible(true);
  };

  const hideAlert = () => {
    setIsAlertVisible(false);
  };

  const handleRadiusChange = text => {
    // Remove any non-numeric characters except "m" and check if it’s a valid number
    const numericValue = text.replace(/[^0-9.]/g, '');

    // If there’s no numeric value, show an alert
    if (numericValue === '') {
      Alert.alert(
        'Invalid Input',
        'Please enter a valid number for the radius.',
      );
      setRadius(''); // Clear the input if invalid
    } else {
      // Update state with the numeric value followed by "m"
      setRadius(`${numericValue}m`);
    }
  };

  const handleWaterLevelOnLandChange = text => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9.]/g, '');

    if (numericValue === '') {
      Alert.alert(
        'Invalid Input',
        'Please enter a valid integer for the water level.',
      );
      setWaterLevelOnLand(''); // Clear input if invalid
    } else {
      setWaterLevelOnLand(`${numericValue}cm`); // Append "cm" to the valid numeric input
    }
  };

  const handleWaterLevelOnResourcesChange = text => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9.]/g, '');

    if (numericValue === '') {
      Alert.alert(
        'Invalid Input',
        'Please enter a valid integer for the water level.',
      );
      setWaterLevelOnResources(''); // Clear input if invalid
    } else {
      setWaterLevelOnResources(`${numericValue}cm`); // Append "cm" to valid numeric input
    }
  };

  const handleCountChange = text => {
    // Allow only digits (integer values)
    const numericValue = text.replace(/\D/g, '');

    if (numericValue === '') {
      Alert.alert(
        'Invalid Input',
        'Please enter a valid integer for the count.',
      );
      setCount(''); // Clear input if invalid
    } else {
      setCount(numericValue); // Set valid integer value
    }
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode = theme === 'dark';

  
  return (
   
    <ImageBackground
    source={require('./../../assets/image/imageD1.jpg')}
    style={styles.backgroundImage}
>
 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <IconButton
                icon="arrow-left"
                iconColor="#000"
                size={30}
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
              onPress={handleUpdate}
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
    height: 490,
    width: width * 0.95,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: -10,
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
  dropdown1: {
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
    justifyContent: 'center',
  },
  radio_topic: {
    marginBottom: 10,
  },
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
    height: 400,
    backgroundColor: '#D9D9D9',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 30,
  },
  whiteBox2: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 750,
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
    // color:'black',
    backgroundColor: 'white',
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
    color: 'black',
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
    marginTop: 2.5,
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
    marginTop: 15,
  },

  dropdownThree: {
    height: 50,
    width: width * 0.9,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    display: 'flex',
    alignContent: 'space-between',
    marginTop: 2.5,
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
    marginTop: 15,
  },

  dropdownTree2: {
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
  container: {
    backgroundColor: 'rgba(217,217,217,0.9)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    height: 460,
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
    width: width * 0.95,
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
  dropdown1: {
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
    justifyContent: 'center',
  },
  radio_topic: {
    marginBottom: 10,
  },
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
    height: 400,
    backgroundColor: '#D9D9D9',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 30,
  },
  whiteBox2: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 750,
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
    // color:'black',
    backgroundColor: 'white',
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
    color: 'black',
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
    marginTop: 2.5,
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
    marginTop: 15,
  },

  dropdownThree: {
    height: 50,
    width: width * 0.9,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    display: 'flex',
    alignContent: 'space-between',
    marginTop: 2.5,
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
    marginTop: 15,
  },

  dropdownTreeremark: {
    width: '95%',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
    marginTop: 15,
    borderWidth: 1,  // Add a border
    borderColor: 'black', // Choose a color
    padding: 10,  // Ensure content isn't too close to the border
  },


  dropdownTree2: {
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
  // container: {
  //   flex: 1,
  //   padding: 20,
  //   backgroundColor: '#F5F5DC',
  // },
  contentContainer: {
    flex: 1,
    marginBottom: 10,
  },
  textContent: {
    fontSize: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
    // borderRadius: 5,
    marginVertical: 5,
    padding: 10,
    marginBottom: 5, // Reduce extra space
    marginTop: 0, // Ensure no top margin
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'white',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 30,
    marginLeft: 10,
  },
  iconButton1: {
    marginLeft: 7,
    marginRight: 7,
  },
  imagePreview: {
    width: '70%',
    height: 200,
    marginTop: 0,
    borderRadius: 10,
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  selectButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
    marginBottom: 10,
    width: width * 0.9,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedText: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
  },
});

