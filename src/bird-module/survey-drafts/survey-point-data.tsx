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
} from 'react-native';
import { Switch } from 'react-native-elements';

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
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { API_URL } from '../../config';
import SQLite from 'react-native-sqlite-storage';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import CustomDropdown from '../reusable-components/dropdown';

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

const SurveyPointData = ({ route }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [newId, setNewId] = useState(null);
  const [value1, setValue1] = useState(null);
  const [isFocus1, setIsFocus1] = useState(false);
  const [value2, setValue2] = useState(null);
  const [isFocus2, setIsFocus2] = useState(false);
  const [value3, setValue3] = useState(null);
  const [isFocus3, setIsFocus3] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [descriptor, setDescriptor] = useState('');
  const [show, setShow] = useState(false);
  const [radius, setRadius] = useState('');
  const [observers, setObservers] = useState('');
  const [formEntries, setFormEntries] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [FormattedLatitude, setFormattedLatitude] = useState(false);
  const [FormattedLongitude, setFormattedLongitude] = useState(false);

  const [isFocus5, setIsFocus5] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const { teamMembers } = route.params || {};



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
    // Create the table if it doesn't exist
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS bird_survey_points (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT,
          uniqueId TEXT,
          habitatType TEXT,
          point TEXT,
          pointTag TEXT,
          latitude TEXT,
          longitude TEXT,
          observers TEXT,
          radiusOfArea TEXT
        );`,
        [],
        () => console.log('Table created successfully'),
        error => console.log('Error creating table: ', error),
      );
    });
  }, []);

  // if connection back, save form data in cloud
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

              // Retry the submission
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




  const isFormValid = () => {
    const newErrors = {};

    if (!value1) {
      newErrors.habitatType = 'Habitat Type is required';
    }



    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setValue1(null);
    setValue2(null);
    setValue3(null);
    setLatitude('');
    setLongitude('');
    setRadius('');
    setObservers('');
    setDescriptor('');
    setIsFocus1(false);
    setIsFocus2(false);
    setIsFocus3(false);
    setIsFocus5(false);
  };


  // get email from sqlite
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

  // get email from sqlite
  const retriveAllFromDataSQLite = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM bird_survey',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i); // Get each row
              console.log('Bird Survey Data:', row); // Log each row's data
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

  const handleSignUp = async () => {
    const surveyPoint = [
      // `Email: ${email || 'N/A'}`,
      `Habitat Type: ${value1 || 'N/A'}`,
      `Point: ${value2 || 'N/A'}`,
      `Point Tag: ${value3 || 'N/A'}`,
      `Latitude: ${latitude || 'N/A'}`,
      `Longitude: ${longitude || 'N/A'}`,
      `Observers: ${observers || 'N/A'}`,
      `Radius of Area: ${radius || 'N/A'}`,
      `Descriptor: ${descriptor || 'N/A'}`
    ];

    console.log("Survey Point:", surveyPoint);

    console.log("Submitting Form Data:", formData);
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill required fields', [{ text: 'OK' }]);
      return;
    }


    // Navigate to the CommonData screen and pass the surveyPoint array
    navigation.navigate('TeamData', { surveyPoint, teamMembers });

    // Reset the form after submission
    // resetForm();


    if (!email) {
      console.log("Error: Email not found");
      Alert.alert("Error", "User email not found.");
      return;
    }

    const now = new Date();
    const uniqueId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    console.log('Unique ID is:', uniqueId);

    const formData = {
      email: email,
      uniqueId: uniqueId,
      habitatType: value1,
      point: value2 || '',
      pointTag: value3 || '',
      latitude: latitude || '',
      longitude: longitude || '',
      observers: observers || '',
      radiusOfArea: radius || '',
      descriptor: descriptor || '',
    };

    console.log("Submitting Form Data:", formData);

    // Navigate to the CommonData screen and pass the surveyPoint array
    navigation.navigate('TeamData', { surveyPoint });

    // Reset the form after submission
    resetForm();
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

    // const getCurrentLocation = () => {
    //   GetLocation.getCurrentPosition({
    //     enableHighAccuracy: true,
    //     timeout: 15000,
    //   })
    //     .then(location => {
    //       setLatitude(location.latitude.toString());
    //       setLongitude(location.longitude.toString());
    //     })
    //     .catch(error => {
    //       const {code, message} = error;
    //       console.warn(code, message);
    //     });
    // };

    const getCurrentLocation = () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          //       
          //     })

          // Set the full precision values for internal use
          setLatitude(location.latitude.toString());
          setLongitude(location.longitude.toString());

          // Format values to 2 decimal places for display (without altering stored values)
          setFormattedLatitude(parseFloat(location.latitude).toFixed(2));
          setFormattedLongitude(parseFloat(location.longitude).toFixed(2));
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


  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode = theme === 'dark';

  return (
    <ImageBackground
      source={require('../../assets/image/imageD1.jpg')}
      style={styles.backgroundImage}>


      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            "Confirm Navigation",
            "Are you sure you want to go back? When you go back, filled data will be lost.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "OK", onPress: () => navigation.goBack() }
            ],
            { cancelable: true }
          );
        }}
        style={styles.backButton}
      >
        <IconButton
          icon="arrow-left"
          iconColor="#000"
          size={30}
        />
      </TouchableOpacity>

      <View style={styles.whiteBoxContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {!isFormSubmitted ? (
            <View>
              <View
                style={[
                  styles.container,
                  {
                    backgroundColor: isDarkMode
                      ? 'rgba(217, 217, 217, 0.7)'
                      : 'rgba(217, 217, 217, 0.7)',
                  },
                ]}>
                <Text
                  style={[
                    styles.main_text,
                    { color: isDarkMode ? 'black' : 'black' },
                  ]}>
                  Survey Point Details
                </Text>
                <View style={{ marginHorizontal: 20, width: '90%' }}>
                <CustomDropdown
                  tableName="habitat_types"
                  apiEndpoint="http://82.180.155.215:5001/habitats"
                  placeholder="Select Habitat Type"
                  value={value1}
                  setValue={setValue1}
                  updateSummary={() => console.log('Selected:', value1)}
                  isDarkMode={false}
                  error={errors.value1}
                />
                </View>
               
             

                <View style={{ height: 16 }} />

                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus2 && styles.dropdownFocused,
                    {
                      backgroundColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.9)'
                        : 'rgba(255, 255, 255, 0.9)',
                      color: isDarkMode ? 'black' : 'black',
                    },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  itemTextStyle={{
                    color: isDarkMode ? 'black' : 'black',
                  }}
                  data={data1}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus2 && !value2 ? `Point` : ''}
                  searchPlaceholder="Search..."
                  value={value2}
                  onFocus={() => setIsFocus2(true)}
                  onBlur={() => setIsFocus2(false)}
                  onChange={item => {
                    setValue2(prevValue => (prevValue === item.value ? null : item.value));
                    setIsFocus2(false);
                    console.log('Selected value:', item.value);
                  }}>
                  <Text>{renderLabel('Point', value2, isFocus2)}</Text>
                  {errors.value2 && <Text style={styles.errorText}>{errors.value2}</Text>}
                </Dropdown>

                <View style={{ height: 16 }} />

                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus3 && styles.dropdownFocused,
                    {
                      backgroundColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.9)'
                        : 'rgba(255, 255, 255, 0.9)',
                      color: isDarkMode ? 'black' : 'black',
                    },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  itemTextStyle={{
                    color: isDarkMode ? 'black' : 'black',
                  }}
                  data={data2}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus3 && !value3 ? `Point Tag` : ''}
                  searchPlaceholder="Search..."
                  value={value3}
                  onFocus={() => setIsFocus3(true)}
                  onBlur={() => setIsFocus3(false)}
                  onChange={item => {
                    setValue3(prevValue => (prevValue === item.value ? null : item.value));
                    setIsFocus3(false);
                  }}>
                  <Text style={[{ color: isDarkMode ? 'black' : 'black' }]}>
                    {renderLabel('Point Tag', value3, isFocus3)}
                  </Text>
                  {errors.value3 && (
                    <Text style={styles.errorText}>{errors.value3}</Text>
                  )}
                </Dropdown>
                <View style={styles.dropdownNew}>
                  <TextInput
                    mode="outlined"
                    placeholder="Descriptor"
                    outlineStyle={styles.txtInputOutline}
                    value={descriptor}
                    style={styles.text_input4}
                    onChangeText={text => setDescriptor(text)}
                    textColor={isDarkMode ? 'black' : 'black'}
                  />
                </View>
                <View style={styles.dropdownNew}>
                  <TextInput
                    mode="outlined"
                    placeholder="Latitude(N)"
                    outlineStyle={styles.txtInputOutline}
                    value={FormattedLatitude}
                    style={styles.text_input4}
                    textColor={isDarkMode ? 'black' : 'black'}
                  />
                </View>
                <View style={styles.dropdownNew}>
                  <TextInput
                    mode="outlined"
                    placeholder="Longitude(E)"
                    outlineStyle={styles.txtInputOutline}
                    value={FormattedLongitude}
                    style={styles.text_input4}
                    textColor={isDarkMode ? 'black' : 'black'}
                  />
                </View>

                <View style={styles.dropdownNew}>
                  <TextInput
                    mode="outlined"
                    placeholder="Radius of Area(m)"
                    value={radius}
                    onChangeText={handleRadiusChange}
                    outlineStyle={styles.txtInputOutline}
                    style={styles.text_input}
                    textColor={isDarkMode ? 'black' : 'black'}
                  />
                  {errors.radius && (
                    <Text style={styles.errorText}>{errors.radius}</Text>
                  )}
                </View>
              </View>
              <CustomAlert
                visible={isAlertVisible}
                onClose={hideAlert}
                message="Successfully saved data!"
              />
              <Button
                mode="contained"
                onPress={handleSignUp}
                style={[styles.button_signup, { borderRadius: 8 }]}
                buttonColor="green"
                textColor="white"
                labelStyle={styles.button_label}>
                Go To Next Step
              </Button>
            </View>

          ) : (
            <View style={styles.container}>

              <MyDataTable data={formEntries} />
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default SurveyPointData;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(217,217,217,0.9)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    height: 520,
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
    width: '98%',
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
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: -10,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
});
