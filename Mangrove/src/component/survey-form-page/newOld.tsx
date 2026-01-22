// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ImageBackground,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   PermissionsAndroid,
//   Appearance,
// } from 'react-native';

// import {Dropdown} from 'react-native-element-dropdown';
// import {
//   Provider as PaperProvider,
//   TextInput,
//   DefaultTheme,
//   Button,
//   List,
// } from 'react-native-paper';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import GetLocation from 'react-native-get-location';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import DisplayTable from '../data-table/display-table';
// import MyDataTable from '../data-table/display-table';
// import axios from 'axios';
// import CustomAlert from '../custom-alert/alert-design';
// import {Dimensions} from 'react-native';
// import RadioForm, {
//   RadioButton,
//   RadioButtonInput,
//   RadioButtonLabel,
// } from 'react-native-simple-radio-button';
// import {API_URL} from '../../config';

// const {width, height} = Dimensions.get('window');

// const data = [
//   {label: 'Tanks', value: 'Tanks'},
//   {label: 'Dutch Canal', value: 'Dutch Canal'},
//   {label: 'Beach', value: 'Beach'},
//   {label: 'Paddy Field', value: 'Paddy Field'},
//   {label: 'Woody Pathway', value: 'Woody Pathway'},
//   {label: 'Grassland', value: 'Grassland'},
//   {label: 'Monocrop-Coconut', value: 'Monocrop-Coconut'},
//   {label: 'Home Garden', value: 'Home Garden'},
//   {label: 'Natural Mangroves', value: 'Natural Mangroves'},
//   {label: 'ANRM site', value: 'ANRM site'},
//   {label: 'Other', value: 'Other'},
// ];
// const data1 = [
//   {label: 'Anawilundawa Tank Point 1', value: 'Anawilundawa Tank Point 1'},
//   {label: 'Anawilundawa Tank Point 2', value: 'Anawilundawa Tank Point 2'},
//   {label: 'Maiyawa Tank Point 1', value: 'Maiyawa Tank Point 1'},
//   {label: 'Suruwila Tank Point 1', value: 'Suruwila Tank Point 1'},
//   {label: 'Suruwila Tank Point 2', value: 'Suruwila Tank Point 2'},
// ];

// const data2 = [
//   {label: 'T1', value: 'T1'},
//   {label: 'T2', value: 'T2'},
//   {label: 'T3', value: 'T3'},
//   {label: 'T4', value: 'T4'},
//   {label: 'T5', value: 'T5'},
// ];

// const data4 = [
//   {label: 'Cloud Cover', value: 'Cloud Cover'},
//   {label: 'Rain', value: 'Rain'},
//   {label: 'Wind', value: 'Wind'},
//   {label: 'Sunshine', value: 'Sunshine'},
// ];

// const radio_props1 = [
//   {label: 'None', value: 'None'},
//   {label: 'Drizzle', value: 'Drizzle'},
//   {label: 'Showers', value: 'Showers'},
// ];

// const radio_props = [
//   {label: '0-33%', value: '0-33%'},
//   {label: '33%-66%', value: '33%-66%'},
//   {label: '66%-100%', value: '66%-100%'},
// ];

// const radio_props2 = [
//   {label: 'Calm', value: 'Calm'},
//   {label: 'Light', value: 'Light'},
//   {label: 'Breezy', value: 'Breezy'},
// ];

// const radio_props3 = [
//   {label: 'Low', value: 'Low'},
//   {label: 'Moderate', value: 'Moderate'},
//   {label: 'High', value: 'High'},
// ];

// const radio_props4 = [
//   {label: 'Yes', value: 'Yes'},
//   {label: 'No', value: 'No'},
// ];

// const radio_props5 = [
//   {label: 'Yes', value: 'Yes'},
//   {label: 'No', value: 'No'},
// ];

// const data5 = [
//   {label: 'On Land', value: 'On Land'},
//   {label: 'Water Resources', value: 'Water Resources'},
// ];

// const data6 = [
//   {label: 'Farming', value: 'Farming'},
//   {label: 'Harvesting', value: 'Harvesting'},
//   {label: 'Fallow Season', value: 'Fallow Season'},
// ];

// const data7 = [
//   {label: 'Flowering', value: 'Flowering'},
//   {label: 'Fruiting', value: 'Fruiting'},
// ];

// const data8 = [
//   {label: 'Hatchlings', value: 'Hatchlings'},
//   {label: 'Juvenile', value: 'Juvenile'},
//   {label: 'Adult', value: 'Adult'},
//   {label: 'Adult non breeding', value: 'Adult non breeding'},
//   {label: 'Adult breeding', value: 'Adult breeding'},
// ];

// const data9 = [
//   {label: 'Male', value: 'Male'},
//   {label: 'Female', value: 'Female'},
// ];

// const data10 = [
//   {label: 'Nesting', value: 'Nesting'},
//   {label: 'Flying', value: 'Flying'},
//   {label: 'Resting', value: 'Resting'},
//   {label: 'Singing', value: 'Singing'},
//   {label: 'Swimming', value: 'Swimming'},
//   {label: 'Walking', value: 'Walking'},
//   {label: 'Feeding', value: 'Feeding'},
//   {label: 'Roosting', value: 'Roosting'},
// ];

// const data12 = [
//   {label: 'Endemic', value: 'Endemic'},
//   {label: 'Resident', value: 'Resident'},
//   {label: 'Migrant', value: 'Migrant'},
//   {label: 'Vagrant', value: 'Vagrant'},
//   {label: 'Other', value: 'Other'},
// ];
// const data11 = [
//   {label: 'Sighting', value: 'Sighting'},
//   {label: 'Listening', value: 'Listening'},
// ];

// const DropdownComponent = () => {
//   const [theme, setTheme] = useState(Appearance.getColorScheme());

//   const [value1, setValue1] = useState(null);
//   const [isFocus1, setIsFocus1] = useState(false);

//   const [value2, setValue2] = useState(null);
//   const [isFocus2, setIsFocus2] = useState(false);

//   const [value3, setValue3] = useState(null);
//   const [isFocus3, setIsFocus3] = useState(false);

//   const [value4, setValue4] = useState(null);
//   const [isFocus4, setIsFocus4] = useState(false);

//   const [value5, setValue5] = useState(null);
//   const [isFocus5, setIsFocus5] = useState(false);

//   const [value6, setValue6] = useState(null);
//   const [isFocus6, setIsFocus6] = useState(false);

//   const [value7, setValue7] = useState(null);
//   const [isFocus7, setIsFocus7] = useState(false);

//   const [value8, setValue8] = useState(null);
//   const [isFocus8, setIsFocus8] = useState(false);

//   const [value9, setValue9] = useState(null);
//   const [isFocus9, setIsFocus9] = useState(false);

//   const [value10, setValue10] = useState(null);
//   const [isFocus10, setIsFocus10] = useState(false);

//   const [value11, setValue11] = useState(null);
//   const [isFocus11, setIsFocus11] = useState(false);

//   const [value12, setValue12] = useState(null);
//   const [isFocus12, setIsFocus12] = useState(false);

//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');

//   const [date, setDate] = useState(new Date());
//   const [show, setShow] = useState(false);
//   const [radius, setRadius] = useState('');
//   const [observers, setObservers] = useState('');
//   const [remark, setRemark] = useState('');
//   const [species, setSpecies] = useState('');
//   const [count, setCount] = useState('');
//   const [text, setText] = useState('');
//   const [showStartTimePicker, setShowStartTimePicker] = useState(false);
//   const [showEndTimePicker, setShowEndTimePicker] = useState(false);
//   const [selectedStartTime, setSelectedStartTime] = useState(new Date());
//   const [selectedEndTime, setSelectedEndTime] = useState(new Date());
//   const [imageUri, setImageUri] = useState(null);

//   const [formEntries, setFormEntries] = useState([]);
//   const [isFormVisible, setIsFormVisible] = useState(true);
//   const [isFormSubmitted, setIsFormSubmitted] = useState(false);
//   const [waterLevel, setwaterLevel] = useState('');
//   const [cloudIntensity, setCloudIntensity] = useState('');
//   const [rainIntensity, setRainIntensity] = useState('');
//   const [windIntensity, setWindIntensity] = useState('');
//   const [sunshineIntensity, setSunshineIntensity] = useState('');
//   // const [waterAvailability, setWaterAvailability] = useState(null);
//   const [selectedWeatherConditions, setSelectedWeatherConditions] = useState(
//     [],
//   );
//   const [selectedCloudIntensity, setSelectedCloudIntensity] = useState(null);
//   const [errors, setErrors] = useState({}); // Error state to store validation messages
//   const [waterLevelOnLand, setwaterLevelOnLand] = useState(''); // Water level for On Land
//   const [waterLevelWaterResources, setwaterLevelWaterResources] = useState('');
//   const [waterAvailabilityOnLand, setWaterAvailabilityOnLand] = useState(null);
//   const [waterAvailabilityWaterResources, setWaterAvailabilityWaterResources] =
//     useState(null);
//   const [selectedValues, setSelectedValues] = useState([]);

//   const handleChoosePhoto = () => {
//     // const options = {
//     //   mediaType: 'photo',
//     //   quality: 1,
//     // };
//     Alert.alert(
//       'Change Bird Image',
//       'Choose an option',
//       [
//         {text: 'Camera', onPress: () => openCamera()},
//         {text: 'Gallery', onPress: () => openGallery()},
//         {text: 'Cancel', style: 'cancel'},
//       ],
//       {cancelable: true},
//     );
//   };

//   const openCamera = () => {
//     launchCamera({}, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error: ', response.errorMessage);
//       } else {
//         setImageUri(response.assets[0].uri);
//       }
//     });
//   };

//   const openGallery = () => {
//     launchImageLibrary({}, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error: ', response.errorMessage);
//       } else {
//         setImageUri(response.assets[0].uri);
//       }
//     });

//     // launchImageLibrary(options, response => {
//     //   if (response.didCancel) {
//     //     console.log('User cancelled image picker');
//     //   } else if (response.error) {
//     //     console.log('ImagePicker Error: ', response.error);
//     //   } else {
//     //     setImageUri(response.assets[0].uri);
//     //   }
//     // });
//   };

//   // const handleWeatherChange = (item) => {
//   //   setValue4(item.value);
//   //   setCloudIntensity('');
//   //   setRainIntensity('');
//   //   setWindIntensity('');
//   //   setSunshineIntensity('');
//   //   setIsFocus4(false);
//   // };

//   const handleWeatherChange = item => {
//     if (selectedWeatherConditions.includes(item.value)) {
//       // Remove the selected condition if already selected
//       setSelectedWeatherConditions(
//         selectedWeatherConditions.filter(condition => condition !== item.value),
//       );
//     } else {
//       // Add the new selected condition
//       setSelectedWeatherConditions([...selectedWeatherConditions, item.value]);
//     }
//   };

//   const renderSelectedWeatherConditions = () => {
//     return selectedWeatherConditions.length > 0
//       ? selectedWeatherConditions.join(', ')
//       : 'Select Weather Condition';
//   };

//   const renderSelectedWaterPresence = () => {
//     return value5 ? value5 : 'Presence of Water';
//   };

//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === 'ios');
//     setDate(currentDate);
//     setText(currentDate.toDateString());
//   };

//   const onChangeStartTime = (event, selectedTime) => {
//     const currentTime = selectedTime || selectedStartTime;
//     setShowStartTimePicker(Platform.OS === 'ios');
//     setSelectedStartTime(currentTime);
//   };

//   const onChangeEndTime = (event, selectedTime) => {
//     const currentTime = selectedTime || selectedEndTime;
//     setShowEndTimePicker(Platform.OS === 'ios');
//     setSelectedEndTime(currentTime);
//   };

//   const showStartTimePickerHandler = () => {
//     setShowStartTimePicker(true);
//   };

//   const showEndTimePickerHandler = () => {
//     setShowEndTimePicker(true);
//   };

//   const showDatepicker = () => {
//     setShow(true);
//   };

//   const [dob, setDOB] = useState(new Date());

//   const handleDateChange = (date: Date) => {
//     setDOB(date);
//   };

//   const isFormValid = () => {
//     let formErrors = {};
//     if (!value1) formErrors.value1 = 'Please select a habitat type';
//     if (!value2) formErrors.value2 = 'Please select a point';
//     if (!value3) formErrors.value3 = 'Please select a point tag';
//     if (!latitude) formErrors.latitude = 'Please enter latitude';
//     if (!longitude) formErrors.longitude = 'Please enter longitude';
//     if (!observers) formErrors.observers = 'Please enter observers';
//     if (!selectedStartTime)
//       formErrors.selectedStartTime = 'Please select start time';
//     if (!selectedEndTime) formErrors.selectedEndTime = 'Please select end time';
//     if (!selectedStartT)
//       formErrors.selectedStartTime = 'Please select start time';
//     if (!selectedEndTime) formErrors.selectedEndTime = 'Please select end time';
//     if (!selectedWeatherConditions.length)
//       formErrors.selectedWeatherConditions = 'Please select weather conditions';
//     if (!radius) formErrors.radius = 'Please enter radius of the area';
//     // if (!value5) formErrors.value5 = 'Please select presence of water';
//     // if (value5 === 'On Land' || value5 === 'Water Resources') {
//     //     if (!waterAvailability) formErrors.waterAvailability = 'Please select water availability';
//     //     if (waterAvailability === 'Yes' && !waterLevel) formErrors.waterLevel = 'Please enter water level';
//     // }
//     // if (!value7) formErrors.value7 = 'Please select status of vegetation';
//     // if (!species) formErrors.species = 'Please enter observed species';
//     // if (!count) formErrors.count = 'Please enter count of birds';
//     // if (!value8) formErrors.value8 = 'Please select maturity of the bird';
//     // if (!value9) formErrors.value9 = 'Please select sex of the bird';
//     // if (!value10) formErrors.value10 = 'Please select behavior of the bird';
//     // if (!value11) formErrors.value11 = 'Please select identification method';
//     // if (!value12) formErrors.value12 = 'Please select status of the bird';
//     // if (!remark) formErrors.remark = 'Please add a remark';

//     setErrors(formErrors);

//     // If there are no errors, form is valid
//     return Object.keys(formErrors).length === 0;
//   };

//   const resetForm = () => {
//     setValue1(null);
//     setValue2(null);
//     setValue3(null);
//     setValue4(null);
//     setValue5(null);
//     setValue6(null);
//     setValue7(null);
//     setValue8(null);
//     setValue9(null);
//     setValue10(null);
//     setValue11(null);
//     setValue12(null);
//     setLatitude('');
//     setLongitude('');
//     setDate(new Date());
//     setRadius('');
//     setObservers('');
//     setRemark('');
//     setSpecies('');
//     setCount('');
//     setText('');
//     setSelectedStartTime(new Date());
//     setSelectedEndTime(new Date());
//     setImageUri(null);
//     setIsFocus1(false);
//     setIsFocus2(false);
//     setIsFocus3(false);
//     setIsFocus4(false);
//     setIsFocus5(false);
//     setIsFocus6(false);
//     setIsFocus7(false);
//     setIsFocus8(false);
//     setIsFocus9(false);
//     setIsFocus10(false);
//     setIsFocus11(false);
//     setIsFocus12(false);
//     setCloudIntensity('');
//     setRainIntensity('');
//     setWindIntensity('');
//     setSunshineIntensity('');
//     setwaterLevel('');
//     setWaterAvailability(null);
//   };

//   const handleSignUp = async () => {
//     if (!isFormValid()) {
//       // If form is invalid, do not submit
//       Alert.alert('Error', 'Please fill required fields', [{text: 'OK'}]);
//       return;
//     }

//     showAlert();
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
//       cloudIntensity: value4 === 'Cloud Cover' ? cloudIntensity : null,
//       rainIntensity: value4 === 'Rain' ? rainIntensity : null,
//       windIntensity: value4 === 'Wind' ? windIntensity : null,
//       sunshineIntensity: value4 === 'Sunshine' ? sunshineIntensity : null,
//       waterAvailability:
//         value5 === 'On Land' || 'Water Resources' ? waterAvailability : null,
//       // waterAvailability: value5 === 'Water Resources' ? waterAvailability : null,
//       waterLevel: waterAvailability === 'Yes' ? waterLevel : null,
//     };

//     axios
//       .post(`${API_URL}/form-entry`, formData)
//       .then(response => {
//         console.log('Form submitted successfully:', response.data);
//         resetForm();
//       })
//       .catch(error => {
//         console.error('Error submitting form:', error);
//       });
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
//               title: 'Location Permission',
//               message: 'This app needs access to your location.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             },
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             console.log('You can use the location');
//             getCurrentLocation();
//           } else {
//             console.log('Location permission denied');
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
//         .then(location => {
//           setLatitude(location.latitude.toString());
//           setLongitude(location.longitude.toString());
//         })
//         .catch(error => {
//           const {code, message} = error;
//           console.warn(code, message);
//         });
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

//   const handleRadiusChange = text => {
//     // Check if the input is a valid number
//     const numericValue = text.replace(/[^\d]/g, ''); // Remove any non-numeric characters
//     setRadius(numericValue ? `${numericValue}m` : ''); // Append 'm' only if there's a value
//   };

//   const handleChange = item => {
//     if (!selectedValues.includes(item.value)) {
//       setSelectedValues([...selectedValues, item.value]); // Add selected item
//     } else {
//       setSelectedValues(selectedValues.filter(value => value !== item.value)); // Remove item
//     }

//     // Reset state for water availability and level when switching options
//     if (item.value === 'On Land') {
//       setWaterAvailabilityOnLand(null);
//       setwaterLevelOnLand('');
//     } else if (item.value === 'Water Resources') {
//       setWaterAvailabilityWaterResources(null);
//       setwaterLevelWaterResources('');
//     }
//   };

//   useEffect(() => {
//     const subscription = Appearance.addChangeListener(({colorScheme}) => {
//       setTheme(colorScheme);
//     });
//     return () => subscription.remove();
//   }, []);

//   const isDarkMode = theme === 'dark';

//   return (
//     <ImageBackground
//       source={require('../../assets/image/imageD1.jpg')}
//       style={styles.backgroundImage}>
//       <View style={styles.whiteBoxContainer}>
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           {!isFormSubmitted ? (
//             <View>
//               <View
//                 style={[
//                   styles.container,
//                   {
//                     backgroundColor: isDarkMode
//                       ? 'rgba(217, 217, 217, 0.7)'
//                       : 'rgba(217, 217, 217, 0.7)',
//                   },
//                 ]}>
//                 <Text
//                   style={[
//                     styles.main_text,
//                     {color: isDarkMode ? 'black' : 'black'},
//                   ]}>
//                   Survey Point Details
//                 </Text>
//                 <Dropdown
//                   style={[
//                     styles.dropdown,
//                     isFocus1 && styles.dropdownFocused,
//                     errors.value1 && styles.errorBorder,
//                     {
//                       backgroundColor: isDarkMode
//                         ? 'rgba(255, 255, 255, 0.9)'
//                         : 'rgba(255, 255, 255, 0.9)', 
//                       color: isDarkMode ? 'black' : 'black',
//                     },
//                   ]}
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   itemTextStyle={{
//                     color: isDarkMode ? 'black' : 'black',
//                   }}
//                   data={data}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder={!isFocus1 && !value1 ? `Habitat type` : ''}
//                   searchPlaceholder="Search..."
//                   value={value1}
//                   onFocus={() => setIsFocus1(true)}
//                   onBlur={() => setIsFocus1(false)}
//                   onChange={item => {
//                     setValue1(item.value);
//                     setIsFocus1(false);
//                     console.log('Selected value:', item.value);
//                   }}>
//                   {/* <Text>{renderLabel('Habitat type', value1, isFocus1)}</Text> */}
//                   {errors.value1 && (
//                     <Text style={styles.errorText}>{errors.value1}</Text>
//                   )}
//                 </Dropdown>

//                 <View style={{height: 16}} />

//                 <Dropdown
//                   style={[
//                     styles.dropdown,
//                     isFocus2 && styles.dropdownFocused,
//                     errors.value2 && styles.errorBorder,
//                     {
//                       backgroundColor: isDarkMode
//                         ? 'rgba(255, 255, 255, 0.9)'
//                         : 'rgba(255, 255, 255, 0.9)', // Adjust background color for dark mode
//                       color: isDarkMode ? 'black' : 'black', // Adjust text color based on the mode
//                     },
//                   ]}
//                   placeholderStyle={styles.placeholderStyle}
//                   itemTextStyle={{
//                     color: isDarkMode ? 'black' : 'black',
//                     // backgroundColor: isDarkMode ? 'rgba(17, 17, 17, 0.9)' : 'rgba(255, 255, 255, 0.9)',
//                   }}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   data={data1}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder={!isFocus2 && !value2 ? `Point` : ''}
//                   searchPlaceholder="Search..."
//                   value={value2}
//                   onFocus={() => setIsFocus2(true)}
//                   onBlur={() => setIsFocus2(false)}
//                   onChange={item => {
//                     setValue2(item.value);
//                     setIsFocus2(false);
//                     console.log('Selected value:', item.value);
//                   }}>
//                   {/* <Text>{renderLabel('Point', value2, isFocus2)}</Text> */}
//                   {errors.value2 && (
//                     <Text style={styles.errorText}>{errors.value2}</Text>
//                   )}
//                 </Dropdown>

//                 <View style={{height: 16}} />

//                 <Dropdown
//                   style={[
//                     styles.dropdown,
//                     isFocus3 && styles.dropdownFocused,
//                     {
//                       backgroundColor: isDarkMode
//                         ? 'rgba(255, 255, 255, 0.9)'
//                         : 'rgba(255, 255, 255, 0.9)', // Adjust background color for dark mode
//                       color: isDarkMode ? 'black' : 'black', // Adjust text color based on the mode
//                     },
//                   ]}
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   itemTextStyle={{
//                     color: isDarkMode ? 'black' : 'black',
//                     // backgroundColor: isDarkMode ? 'rgba(17, 17, 17, 0.9)' : 'rgba(255, 255, 255, 0.9)',
//                   }}
//                   data={data2}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder={!isFocus3 && !value3 ? `Point Tag` : ''}
//                   searchPlaceholder="Search..."
//                   value={value3}
//                   onFocus={() => setIsFocus3(true)}
//                   onBlur={() => setIsFocus3(false)}
//                   onChange={item => {
//                     setValue3(item.value);
//                     setIsFocus3(false);
//                   }}>
//                   <Text>{renderLabel('Point Tag', value3, isFocus3)}</Text>
//                 </Dropdown>
//                 <View style={styles.dropdownNew}>
//                   <TextInput
//                     mode="outlined"
//                     placeholder="Latitude(N)"
//                     outlineStyle={styles.txtInputOutline}
//                     value={latitude}
//                     style={[styles.text_input4, {color: isDarkMode ? 'black' : 'black'}]}
//                   />
//                 </View>
//                 <View style={styles.dropdownNew}>
//                   <TextInput
//                     mode="outlined"
//                     placeholder="Longitude(E)"
//                     outlineStyle={styles.txtInputOutline}
//                     value={longitude}
//                     style={styles.text_input4}
//                   />
//                 </View>
//               </View>

//               <View
//                 style={[
//                   styles.container2,
//                   {
//                     backgroundColor: isDarkMode
//                     ? 'rgba(217, 217, 217, 0.7)'
//                     : 'rgba(217, 217, 217, 0.7)',
//                   },
//                 ]}>
//                 <Text
//                   style={[
//                     styles.main_text,
//                     {color: isDarkMode ? 'black' : 'black'},
//                   ]}>
//                   Common Detail Record
//                 </Text>
//                 <View style={styles.dropdownTwo}>
//                   <TouchableOpacity
//                     onPress={showDatepicker}
//                     style={styles.dateInput}>
//                     <Text style={styles.calendarTxt}>
//                       {text || 'Select Date'}
//                     </Text>
//                     <Icon
//                       name="calendar"
//                       size={15}
//                       color="black"
//                       style={styles.icon}
//                     />
//                   </TouchableOpacity>
//                   {show && (
//                     <DateTimePicker
//                       testID="dateTimePicker"
//                       value={date}
//                       mode="date"
//                       is24Hour={true}
//                       display="default"
//                       onChange={onChange}
//                     />
//                   )}
//                 </View>
//                 <View style={[styles.dropdownNewTwo,  {
//                       backgroundColor: isDarkMode
//                         ? 'rgba(255, 255, 255, 0.9)'
//                         : 'rgba(255, 255, 255, 0.9)', 
//                     }]}>
//                   <TextInput
//                     mode="outlined"
//                     placeholder="Observers"
//                     value={observers}
//                     onChangeText={setObservers}
//                     outlineStyle={styles.txtInputOutline}
//                     style={[styles.text_input,  {color: isDarkMode ? 'black' : 'black'}, {
//                       backgroundColor: isDarkMode
//                         ? 'rgba(255, 255, 255, 0.9)'
//                         : 'rgba(255, 255, 255, 0.9)', 
//                     }]}
//                   />
//                 </View>

//                 <View style={styles.dropdownTwo}>
//                   <TouchableOpacity
//                     onPress={showStartTimePickerHandler}
//                     style={styles.timeInput}>
//                     <Text style={styles.calendarTxt}>
//                       {selectedStartTime.toLocaleTimeString() || 'Start Time'}
//                     </Text>
//                     <Icon
//                       name="clock-o"
//                       size={20}
//                       color="gray"
//                       style={styles.icon}
//                     />
//                   </TouchableOpacity>
//                   {showStartTimePicker && (
//                     <DateTimePicker
//                       testID="dateTimePicker"
//                       value={selectedStartTime}
//                       mode={'time'}
//                       is24Hour={true}
//                       display="default"
//                       onChange={onChangeStartTime}
//                     />
//                   )}
//                 </View>
//                 <View style={styles.dropdownTwo}>
//                   <TouchableOpacity
//                     onPress={showEndTimePickerHandler}
//                     style={styles.timeInput}>
//                     <Text style={styles.calendarTxt}>
//                       {selectedEndTime.toLocaleTimeString() || 'End Time'}
//                     </Text>
//                     <Icon
//                       name="clock-o"
//                       size={20}
//                       color="gray"
//                       style={styles.icon}
//                     />
//                   </TouchableOpacity>
//                   {showEndTimePicker && (
//                     <DateTimePicker
//                       testID="dateTimePicker"
//                       value={selectedEndTime}
//                       mode={'time'}
//                       is24Hour={true}
//                       display="default"
//                       onChange={onChangeEndTime}
//                     />
//                   )}
//                 </View>

//                 <Dropdown
//                   style={[
//                     styles.dropdown,
//                     styles.dropdownNewTwo,
//                     isFocus4 && styles.dropdownFocused,
//                     {
//                       backgroundColor: isDarkMode
//                         ? 'rgba(255, 255, 255, 0.9)'
//                         : 'rgba(255, 255, 255, 0.9)', // Adjust background color for dark mode
//                       color: isDarkMode ? 'black' : 'black', // Adjust text color based on the mode
//                     },
//                   ]} // Apply the same styles
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   itemTextStyle={{
//                     color: isDarkMode ? 'black' : 'black',
//                     // backgroundColor: isDarkMode ? 'rgba(17, 17, 17, 0.9)' : 'rgba(255, 255, 255, 0.9)',
//                   }}
//                   data={data4} // Weather data options
//                   search // Add the search bar
//                   maxHeight={400}
//                   labelField="label"
//                   valueField="value"
//                   placeholder={renderSelectedWeatherConditions()} // Show selected weather conditions in the placeholder
//                   searchPlaceholder="Search..." // Add search placeholder
//                   value={null} // No single value, we are handling multiple selections
//                   onFocus={() => setIsFocus4(true)}
//                   onBlur={() => setIsFocus4(false)}
//                   onChange={handleWeatherChange} // Custom handler for multiple selections
//                   renderItem={(item, selected) => (
//                     <>
//                       <TouchableOpacity
//                         onPress={() => handleWeatherChange(item)}>
//                         <View
//                           style={[
//                             styles.item,
//                             {color: isDarkMode ? 'black' : 'black'},
//                             selectedWeatherConditions.includes(item.value)
//                               ? styles.itemSelected
//                               : {},
//                           ]}>
//                           <Text style={[styles.itemText, {color: isDarkMode ? 'black' : 'black'}]}>{item.label}</Text>
//                           {selectedWeatherConditions.includes(item.value) && (
//                             <Icon name="check" size={20} color="green" />
//                           )}
//                         </View>
//                       </TouchableOpacity>

//                       {/* Render Radio Buttons based on selection */}
//                       {selectedWeatherConditions.includes('Cloud Cover') &&
//                         item.value === 'Cloud Cover' && (
//                           <View style={styles.radioContainer}>
//                             <RadioForm
//                               radio_props={radio_props}
//                               initial={0}
//                               onPress={value => setCloudIntensity(value)}
//                             />
//                           </View>
//                         )}

//                       {selectedWeatherConditions.includes('Rain') &&
//                         item.value === 'Rain' && (
//                           <View style={styles.radioContainer}>
//                             <RadioForm
//                               radio_props={radio_props1}
//                               initial={0}
//                               onPress={value => setCloudIntensity(value)}
//                             />
//                           </View>
//                         )}

//                       {selectedWeatherConditions.includes('Wind') &&
//                         item.value === 'Wind' && (
//                           <View style={styles.radioContainer}>
//                             <RadioForm
//                               radio_props={radio_props2}
//                               initial={0}
//                               onPress={value => setCloudIntensity(value)}
//                             />
//                           </View>
//                         )}

//                       {selectedWeatherConditions.includes('Sunshine') &&
//                         item.value === 'Sunshine' && (
//                           <View style={styles.radioContainer}>
//                             <RadioForm
//                               radio_props={radio_props3}
//                               initial={0}
//                               onPress={value => setCloudIntensity(value)}
//                             />
//                           </View>
//                         )}
//                     </>
//                   )}>
//                   <Text>
//                     {renderLabel(
//                       'Weather Condition',
//                       selectedWeatherConditions.join(', '),
//                       isFocus4,
//                     )}
//                   </Text>
//                 </Dropdown>

//                 <View style={styles.dropdownNewTwo}>
//                   <TextInput
//                     mode="outlined"
//                     placeholder="Radius of Area(m)"
//                     value={radius}
//                     onChangeText={handleRadiusChange}
//                     outlineStyle={styles.txtInputOutline}
//                     style={styles.text_input}
//                   />
//                 </View>

//                 <View>
//                   {/* Dropdown Component */}
//                   <Dropdown
//                     style={[
//                       styles.dropdown,
//                       isFocus5 && styles.dropdownFocused,
//                     ]} // Styles
//                     placeholderStyle={styles.placeholderStyle}
//                     selectedTextStyle={styles.selectedTextStyle}
//                     inputSearchStyle={styles.inputSearchStyle}
//                     iconStyle={styles.iconStyle}
//                     data={data5}
//                     search
//                     maxHeight={400}
//                     labelField="label"
//                     valueField="value"
//                     placeholder={
//                       selectedValues.length > 0
//                         ? selectedValues.join(', ')
//                         : 'Select Options'
//                     } // Show selected options in the placeholder
//                     searchPlaceholder="Search..."
//                     value={selectedValues}
//                     onFocus={() => setIsFocus5(true)}
//                     onBlur={() => setIsFocus5(false)}
//                     onChange={item => handleChange(item)}
//                     renderItem={item => (
//                       <>
//                         <TouchableOpacity onPress={() => handleChange(item)}>
//                           <View
//                             style={[
//                               styles.item,
//                               selectedValues.includes(item.value)
//                                 ? styles.itemSelected
//                                 : {},
//                             ]}>
//                             <Text style={styles.itemText}>{item.label}</Text>
//                           </View>
//                         </TouchableOpacity>

//                         {/* Render Radio Buttons for "On Land" */}
//                         {item.value === 'On Land' &&
//                           selectedValues.includes('On Land') && (
//                             <View style={styles.radioContainer}>
//                               <Text>Water Availability (On Land)</Text>
//                               <RadioForm
//                                 radio_props={radio_props4}
//                                 initial={-1}
//                                 onPress={value =>
//                                   setWaterAvailabilityOnLand(value)
//                                 }
//                               />
//                             </View>
//                           )}

//                         {/* Show Water Level input for "On Land" when water availability is "Yes" */}
//                         {selectedValues.includes('On Land') &&
//                           waterAvailabilityOnLand === 'Yes' && (
//                             <View style={styles.textInputContainer}>
//                               <TextInput
//                                 placeholder="Water Level for On Land (cm)"
//                                 value={waterLevelOnLand}
//                                 onChangeText={setwaterLevelOnLand}
//                                 style={styles.text_input}
//                               />
//                             </View>
//                           )}

//                         {/* Render Radio Buttons for "Water Resources" */}
//                         {item.value === 'Water Resources' &&
//                           selectedValues.includes('Water Resources') && (
//                             <View style={styles.radioContainer}>
//                               <Text>Water Availability (Water Resources)</Text>
//                               <RadioForm
//                                 radio_props={radio_props5}
//                                 initial={-1}
//                                 onPress={value =>
//                                   setWaterAvailabilityWaterResources(value)
//                                 }
//                               />
//                             </View>
//                           )}

//                         {/* Show Water Level input for "Water Resources" when water availability is "Yes" */}
//                         {selectedValues.includes('Water Resources') &&
//                           waterAvailabilityWaterResources === 'Yes' && (
//                             <View style={styles.textInputContainer}>
//                               <TextInput
//                                 placeholder="Water Level for Water Resources (cm)"
//                                 value={waterLevelWaterResources}
//                                 onChangeText={setwaterLevelWaterResources}
//                                 style={styles.text_input}
//                               />
//                             </View>
//                           )}
//                       </>
//                     )}
//                   />

//                   {/* Display selected values in the placeholder */}
//                   <Text>
//                     {selectedValues.length > 0
//                       ? selectedValues.join(', ')
//                       : 'Select Options'}
//                   </Text>
//                 </View>

//                 {value1 === 'Paddy Field' && (
//                   <Dropdown
//                     style={[
//                       styles.dropdown,
//                       styles.dropdownNewTwo,
//                       isFocus6 && styles.dropdownFocused,
//                     ]}
//                     placeholderStyle={styles.placeholderStyle}
//                     selectedTextStyle={styles.selectedTextStyle}
//                     inputSearchStyle={styles.inputSearchStyle}
//                     iconStyle={styles.iconStyle}
//                     data={data6}
//                     search
//                     maxHeight={300}
//                     labelField="label"
//                     valueField="value"
//                     placeholder={
//                       !isFocus6 && !value6 ? `Season of Paddy Field` : ''
//                     }
//                     searchPlaceholder="Search..."
//                     value={value6}
//                     onFocus={() => setIsFocus6(true)}
//                     onBlur={() => setIsFocus6(false)}
//                     onChange={item => {
//                       setValue6(item.value);
//                       setIsFocus6(false);
//                     }}>
//                     <Text>
//                       {renderLabel('Season of Paddy Field', value6, isFocus6)}
//                     </Text>
//                   </Dropdown>
//                 )}
//                 <Dropdown
//                   style={[
//                     styles.dropdown,
//                     styles.dropdownNewTwo,
//                     isFocus3 && styles.dropdownFocused,
//                   ]}
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   data={data7}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder={
//                     !isFocus7 && !value7 ? `Status Of Vegetation` : ''
//                   }
//                   searchPlaceholder="Search..."
//                   value={value7}
//                   onFocus={() => setIsFocus7(true)}
//                   onBlur={() => setIsFocus7(false)}
//                   onChange={item => {
//                     setValue7(item.value);
//                     setIsFocus7(false);
//                   }}>
//                   <Text>
//                     {renderLabel('Status Of Vegetation', value7, isFocus7)}
//                   </Text>
//                 </Dropdown>
//                 <View style={styles.dropdownTree}>
//                   <TextInput
//                     mode="outlined"
//                     placeholder="Remark"
//                     value={remark}
//                     outlineStyle={styles.txtInputOutline}
//                     onChangeText={setRemark}
//                     style={styles.text_input3}
//                   />
//                 </View>
//               </View>

//               <View
//                 style={[
//                   styles.container3,
//                   {
//                     backgroundColor: isDarkMode
//                       ? 'rgba(17, 17, 17, 0.8)'
//                       : 'rgba(217, 217, 217, 0.7)',
//                   },
//                 ]}>
//                 <Text
//                   style={[
//                     styles.main_text3,
//                     {color: isDarkMode ? 'white' : 'black'},
//                   ]}>
//                   Bird Detail Record
//                 </Text>
//                 <View style={styles.dropdownTree}>
//                   <TextInput
//                     mode="outlined"
//                     placeholder="Observed Species"
//                     value={species}
//                     onChangeText={setSpecies}
//                     outlineStyle={styles.txtInputOutline}
//                     style={styles.text_input}
//                   />
//                 </View>
//                 <View style={styles.dropdownTree}>
//                   <TextInput
//                     mode="outlined"
//                     placeholder="Count"
//                     value={count}
//                     onChangeText={setCount}
//                     outlineStyle={styles.txtInputOutline}
//                     style={styles.text_input2}
//                   />
//                 </View>
//                 <Dropdown
//                   style={[styles.dropdown, isFocus8 && styles.dropdownFocused]}
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   data={data8}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder={!isFocus8 && !value8 ? `Maturity` : ''}
//                   searchPlaceholder="Search..."
//                   value={value8}
//                   onFocus={() => setIsFocus8(true)}
//                   onBlur={() => setIsFocus8(false)}
//                   onChange={item => {
//                     setValue8(item.value);
//                     setIsFocus8(false);
//                   }}>
//                   <Text>{renderLabel('Maturity', value8, isFocus8)}</Text>
//                 </Dropdown>

//                 <View style={{height: 16}} />

//                 <Dropdown
//                   style={[styles.dropdown, isFocus9 && styles.dropdownFocused]}
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   data={data9}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder={!isFocus9 && !value9 ? `Sex` : ''}
//                   searchPlaceholder="Search..."
//                   value={value2}
//                   onFocus={() => setIsFocus9(true)}
//                   onBlur={() => setIsFocus9(false)}
//                   onChange={item => {
//                     setValue9(item.value);
//                     setIsFocus9(false);
//                   }}>
//                   <Text>{renderLabel('Sex', value9, isFocus9)}</Text>
//                 </Dropdown>

//                 <View style={{height: 16}} />

//                 <Dropdown
//                   style={[styles.dropdown, isFocus10 && styles.dropdownFocused]}
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   data={data10}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder={!isFocus10 && !value10 ? `Behaviour` : ''}
//                   searchPlaceholder="Search..."
//                   value={value10}
//                   onFocus={() => setIsFocus10(true)}
//                   onBlur={() => setIsFocus10(false)}
//                   onChange={item => {
//                     setValue10(item.value);
//                     setIsFocus10(false);
//                   }}>
//                   <Text>{renderLabel('Behaviour', value10, isFocus10)}</Text>
//                 </Dropdown>
//                 <View style={{height: 16}} />

//                 <Dropdown
//                   style={[styles.dropdown, isFocus11 && styles.dropdownFocused]}
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   data={data11}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder={!isFocus11 && !value11 ? `Identification` : ''}
//                   searchPlaceholder="Search..."
//                   value={value11}
//                   onFocus={() => setIsFocus11(true)}
//                   onBlur={() => setIsFocus11(false)}
//                   onChange={item => {
//                     setValue11(item.value);
//                     setIsFocus11(false);
//                   }}>
//                   <Text>
//                     {renderLabel('Identification', value11, isFocus11)}
//                   </Text>
//                 </Dropdown>
//                 <View style={{height: 16}} />

//                 <Dropdown
//                   style={[styles.dropdown, isFocus12 && styles.dropdownFocused]}
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   data={data12}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder={!isFocus12 && !value12 ? `Status` : ''}
//                   searchPlaceholder="Search..."
//                   value={value12}
//                   onFocus={() => setIsFocus12(true)}
//                   onBlur={() => setIsFocus12(false)}
//                   onChange={item => {
//                     setValue12(item.value);
//                     setIsFocus12(false);
//                   }}>
//                   <Text>{renderLabel('Status', value12, isFocus12)}</Text>
//                 </Dropdown>

//                 <Text style={{marginTop: 10}}>Upload a Photo</Text>
//                 <TouchableOpacity
//                   style={styles.iconButton}
//                   onPress={handleChoosePhoto}>
//                   <Icon name="camera" size={30} color="#fff" />
//                 </TouchableOpacity>
//                 {imageUri && (
//                   <Image source={{uri: imageUri}} style={styles.image} />
//                 )}

//                 <CustomAlert
//                   visible={isAlertVisible}
//                   onClose={hideAlert}
//                   message="Successfully saved data!"
//                 />

//                 <Button
//                   mode="contained"
//                   onPress={handleSignUp}
//                   style={[styles.button_signup, {borderRadius: 8}]}
//                   buttonColor="green"
//                   textColor="white"
//                   labelStyle={styles.button_label}>
//                   Submit
//                 </Button>
//               </View>
//             </View>
//           ) : (
//             <View style={styles.container}>
//               <Text
//                 style={[
//                   styles.main_text3,
//                   {color: isDarkMode ? 'white' : 'black'},
//                 ]}>
//                 Bird Detail Record
//               </Text>
//               <MyDataTable data={formEntries} />
//             </View>
//           )}
//         </ScrollView>
//       </View>
//     </ImageBackground>
//   );
// };

// export default DropdownComponent;

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
//     marginTop: 15,
//     marginBottom: 15,
//   },
//   textRow: {
//     marginBottom: 10, // space between text and radio buttons
//   },
//   dropdown: {
//     height: 50,
//     width: width * 0.9,
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     // backgroundColor: 'white',
//   },

//   dropdownFocused: {
//     borderColor: 'blue',
//   },
//   textInputContainer: {
//     padding: 10,
//     marginVertical: 5,
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
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   radio_topic: {
//     marginBottom: 10,
//   },
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
//   errorText: {
//     color: 'red',
//     marginBottom: 10,
//   },
//   errorBorder: {
//     borderColor: 'red',
//   },
// });


import React, { useState } from 'react';
import CheckBox from 'react-native-check-box';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// MultipleSelect Component
const MultipleSelect = ({
  options,
  selectedItems,
  onSelect,
}: {
  options: string[];
  selectedItems: string[];
  onSelect: (items: string[]) => void;
}) => {
  const toggleSelect = (item: string) => {
    if (selectedItems.includes(item)) {
      onSelect(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      onSelect([...selectedItems, item]);
    }
  };

  const renderOption = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => toggleSelect(item)} style={styles.option}>
      <CheckBox
        isChecked={selectedItems.includes(item)}
        onClick={() => toggleSelect(item)}
      />
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={options}
      renderItem={renderOption}
      keyExtractor={(item) => item}
      extraData={selectedItems}
    />
  );
};

const MultipleChoice = ({
  options,
  selectedOption,
  onSelect,
}: {
  options: string[];
  selectedOption: string | null;
  onSelect: (item: string) => void;
}) => {
  return (
    <FlatList
      data={options}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect(item)} style={styles.option}>
          <CheckBox
            isChecked={selectedOption === item}
            onClick={() => onSelect(item)}
          />
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item}
      extraData={selectedOption}
    />
  );
};

type Question = {
  text: string;
  type: string;
  required: boolean;
  options?: string[];
};

const QuestionsScreen = ({ route }: { route: { params: { questions: Question[]; formTitle: string } } }) => {
  const { questions, formTitle } = route.params;
  const [answers, setAnswers] = useState<any[]>(new Array(questions.length).fill(''));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [isTimePickerVisible, setTimePickerVisibility] = useState<boolean[]>(new Array(questions.length).fill(false));

  const handleAnswerChange = (index: number, value: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleImageUpload = (index: number) => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, (response) => {
      if (response.assets) {
        const imageUri = response.assets[0].uri;
        setSelectedImage(imageUri);
        handleAnswerChange(index, imageUri);
        Alert.alert('Picture Selected');
      }
    });
  };

  const validateForm = () => {
    if (formTitle.trim() === '') {
      Alert.alert('Validation Error', 'Form title cannot be empty.');
      return false;
    }

    if (questions.length === 0) {
      Alert.alert('Validation Error', 'You must add at least one question.');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      // Check for empty question text
      if (question.text.trim() === '') {
        Alert.alert('Validation Error', `Question ${i + 1} cannot be empty.`);
        return false;
      }

      // Check for multipleChoice or multipleSelect without options
      if ((question.type === 'multipleChoice' || question.type === 'multipleSelect') && question.options.length === 0) {
        Alert.alert(
          'Validation Error',
          `Question ${i + 1} must have at least one option for the selected type.`
        );
        return false;
      }

      // Email validation
      if (question.type === 'email') {
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailRegex.test(question.text.toLowerCase())) {
          Alert.alert('Validation Error', `Invalid email format in Question ${i + 1}.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert('Submitted Answers', JSON.stringify(answers, null, 2));
    }
  };

  const showDatePicker = (index: number) => {
    setDatePickerVisibility((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const hideDatePicker = (index: number) => {
    setDatePickerVisibility((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  const handleDateConfirm = (index: number, date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    handleAnswerChange(index, formattedDate);
    hideDatePicker(index);
  };

  const showTimePicker = (index: number) => {
    setTimePickerVisibility((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const hideTimePicker = (index: number) => {
    setTimePickerVisibility((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  const handleTimeConfirm = (index: number, time: Date) => {
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    handleAnswerChange(index, formattedTime);
    hideTimePicker(index);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{formTitle}</Text>
      {questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          {question.type === 'shortText' && (
            <TextInput
              placeholder={`${question.text}${question.required ? ' *' : ''}`}
              value={answers[index]}
              onChangeText={(value) => handleAnswerChange(index, value)}
              style={styles.input}
            />
          )}
          {question.type === 'email' && (
            <TextInput
              placeholder={`${question.text}${question.required ? ' *' : ''}`}
              value={answers[index]}
              onChangeText={(value) => handleAnswerChange(index, value)}
              keyboardType="email-address"
              style={styles.input}
            />
          )}
          {question.type === 'date' && (
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder={`${question.text}${question.required ? ' *' : ''}`}
                value={answers[index]}
                onChangeText={(value) => handleAnswerChange(index, value)}
                style={[styles.input, styles.inputWithIcon]}
              />
              <TouchableOpacity onPress={() => showDatePicker(index)} style={styles.iconWrapper}>
                <Icon name="calendar" size={15} color="#000" />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible[index]}
                mode="date"
                onConfirm={(date) => handleDateConfirm(index, date)}
                onCancel={() => hideDatePicker(index)}
              />
            </View>
          )}
          {question.type === 'time' && (
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder={`${question.text}${question.required ? ' *' : ''}`}
                value={answers[index]}
                onChangeText={(value) => handleAnswerChange(index, value)}
                style={[styles.input, styles.inputWithIcon]}
              />
              <TouchableOpacity onPress={() => showTimePicker(index)} style={styles.iconWrapper}>
                <Icon name="clock-o" size={15} color="#000" />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isTimePickerVisible[index]}
                mode="time"
                onConfirm={(time) => handleTimeConfirm(index, time)}
                onCancel={() => hideTimePicker(index)}
              />
            </View>
          )}
          {question.type === 'multipleSelect' && question.options && (
            <TouchableOpacity style={styles.input} onPress={() => setDropdownVisible(prev => {
              const updated = [...prev];
              updated[index] = !prev[index];
              return updated;
            })}>
              <Text style={styles.placeholderText}>
                {answers[index]?.length > 0 ? answers[index].join(', ') : `${question.text}${question.required ? ' *' : ''}`}
              </Text>
              <Icon name="chevron-down" size={15} style={styles.dropdownIcon} />
              {dropdownVisible[index] && (
                <MultipleSelect
                  options={question.options}
                  selectedItems={answers[index]}
                  onSelect={(selectedItems) => {
                    handleAnswerChange(index, selectedItems);
                    setDropdownVisible(prev => {
                      const updated = [...prev];
                     // updated[index] = false; // Close dropdown after selection
                      return updated;
                    });
                  }}
                />
              )}
            </TouchableOpacity>
          )}
          {question.type === 'multipleChoice' && question.options && (
            <TouchableOpacity style={styles.input} onPress={() => setDropdownVisible(prev => {
              const updated = [...prev];
              updated[index] = !prev[index];
              return updated;
            })}>
              <Text style={styles.placeholderText}>
                {answers[index] || `${question.text}${question.required ? ' *' : ''}`}
              </Text>
              <Icon name="chevron-down" size={15} style={styles.dropdownIcon} />
              {dropdownVisible[index] && (
                <MultipleChoice
                  options={question.options}
                  selectedOption={answers[index]}
                  onSelect={(selectedOption) => {
                    handleAnswerChange(index, selectedOption);
                    setDropdownVisible(prev => {
                      const updated = [...prev];
                      updated[index] = false; // Close dropdown after selection
                      return updated;
                    });
                  }}
                />
              )}
            </TouchableOpacity>
          )}
          {question.type === 'picture' && (
  <View style={styles.inputWrapper}>
    <TextInput
      placeholder={`${question.text}${question.required ? ' *' : ''}`}
      value={answers[index]}
      editable={false} // Prevent editing directly
      style={[styles.input, styles.inputWithIcon]}
    />
    <TouchableOpacity onPress={() => handleImageUpload(index)} style={styles.iconWrapper}>
      <Icon name="camera" size={15} color="#000" />
    </TouchableOpacity>
    {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}
  </View>
)}
        </View>
      ))}
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      questionContainer: {
        marginBottom: 20,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: 'white',
      },
      inputWrapper: {
        position: 'relative',
      },
      inputWithIcon: {
        paddingRight: 40,
      },
      iconWrapper: {
        position: 'absolute',
        right: 10,
        top: 15,
      },
      placeholderText: {
        color: '#999',
      },
      dropdownIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
      },
      option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      },
      optionText: {
        marginLeft: 10,
      },
      imageUploadButton: {
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
      },
      uploadButtonText: {
        color: '#007BFF',
      },
      imagePreview: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 8, 
        borderWidth: 1,
        borderColor: '#ccc',
      },
    });
    
    

export default QuestionsScreen;