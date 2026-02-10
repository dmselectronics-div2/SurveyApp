import React, {useState, useEffect} from 'react';
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

import {Dropdown} from 'react-native-element-dropdown';
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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DisplayTable from '../data-table/display-table';
import MyDataTable from '../data-table/display-table';
import axios from 'axios';
import CustomAlert from '../custom-alert/alert-design';
import {Dimensions} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {API_URL} from '../../config';
import { getDatabase } from '../database/db';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import birdSpecies from './bird-list';
import { useNavigation } from '@react-navigation/native'; 


const {width, height} = Dimensions.get('window');

const data15=birdSpecies;

const data7 = [
  {label: 'Flowering', value: 'Flowering'},
  {label: 'Fruiting', value: 'Fruiting'},
  {label: 'Dry Vegetation', value: 'Dry Vegetation'},
  {label: 'Harvesting (for paddy fields)', value: 'Harvesting (for paddy fields)'},
  {label: 'Fallow Season (for paddy fields)', value: 'Fallow Season (for paddy fields)'},
  {label: 'Farming season (for paddy fields)', value: 'Farming season (for paddy fields)'},
];


const data8 = [
  {label: 'Hatchlings', value: 'Hatchlings'},
  {label: 'Juvenile', value: 'Juvenile'},
  {label: 'Adult', value: 'Adult'},
  {label: 'Adult non breeding', value: 'Adult non breeding'},
  {label: 'Adult breeding', value: 'Adult breeding'},
];

const data9 = [
  {label: 'Male', value: 'Male'},
  {label: 'Female', value: 'Female'},
  {label: 'Unknown', value: 'Unknown'},
];

const data10 = [
  {label: 'Nesting', value: 'Nesting'},
  {label: 'Flying', value: 'Flying'},
  {label: 'Resting', value: 'Resting'},
  {label: 'Singing', value: 'Singing'},
  {label: 'Swimming', value: 'Swimming'},
  {label: 'Walking', value: 'Walking'},
  {label: 'Feeding', value: 'Feeding'},
  {label: 'Roosting', value: 'Roosting'},
];

const data12 = [
  {label: 'Endemic', value: 'Endemic'},
  {label: 'Resident', value: 'Resident'},
  {label: 'Migrant', value: 'Migrant'},
  {label: 'Vagrant', value: 'Vagrant'},
  {label: 'Other', value: 'Other'},
];
const data11 = [
  {label: 'Sighting', value: 'Sighting'},
  {label: 'Listening', value: 'Listening'},
];

const BirdData = ({route}) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [newId, setNewId] = useState(null);
  const [value1, setValue1] = useState(null);
  const [isFocus1, setIsFocus1] = useState(false);
  const [value2, setValue2] = useState(null);
  const [isFocus2, setIsFocus2] = useState(false);
  const [value3, setValue3] = useState(null);
  const [isFocus3, setIsFocus3] = useState(false);
  const [value4, setValue4] = useState(null);
  const [isFocus4, setIsFocus4] = useState(false);
  const [value5, setValue5] = useState(null);
  const [value6, setValue6] = useState(null);
  const [isFocus6, setIsFocus6] = useState(false);
  const [value7, setValue7] = useState(null);
  const [isFocus7, setIsFocus7] = useState(false);
  const [value8, setValue8] = useState(null);
  const [isFocus8, setIsFocus8] = useState(false);
  const [value9, setValue9] = useState(null);
  const [isFocus9, setIsFocus9] = useState(false);
  const [value10, setValue10] = useState(null);
  const [isFocus10, setIsFocus10] = useState(false);
  const [value11, setValue11] = useState(null);
  const [isFocus11, setIsFocus11] = useState(false);
  const [value12, setValue12] = useState(null);
  const [isFocus12, setIsFocus12] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [radius, setRadius] = useState('');
  const [observers, setObservers] = useState('');
  const [remark, setRemark] = useState('');
  const [species, setSpecies] = useState('');
  const [count, setCount] = useState('');
  const [text, setText] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [imageUri, setImageUri] = useState(null);
   const [newImageUri, setNewImageUri] = useState([]);
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
  const [weather, setWeather] = useState('');
  const [email, setEmail] = useState('');
  const [behaviours, setBehaviours] = useState('');
  const [content, setContent] = useState([]);
  const [text1, setText1] = useState('');
  const navigation = useNavigation();  
  const { surveyPoint, teamMembers, submittedData } = route.params || {};


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
      setRemark(prevRemark => prevRemark + `Image URI: ${uri}\n`); 
    }
  });
};


  useEffect(() => {
    retriveEmailFromSQLite();
    retriveAllFromDataSQLite();
  }, []);

  useEffect(() => {
    const initDb = async () => {
      const db = await getDatabase();
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

//   const saveImage = async (imageURi, uniqueId) => {
//     if (!imageURi) {
//       // Alert.alert('No image selected', 'Please select an image first.');
//       return;
//     }

//     // Define the path where you want to save the image
//     //const path = `${RNFS.DocumentDirectoryPath}/profile_image.jpg`; // You can save it to other directories as well
//     const path = `${RNFS.CachesDirectoryPath}/${uniqueId}.jpg`;


//     try {
//       // Copy the file from the URI to the defined path
//       await RNFS.copyFile(imageURi, path);
//       //Alert.alert('Image saved', `Profile image saved at: ${path}`);
//       console.log(path);
//     } catch (error) {
//       console.error('Error saving image:', error);
//       Alert.alert('Error', 'Failed to save the image.');
//     }
//   };


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


  const uploadImageToServer = async (uri, uniqueId) => {
     console.log('uri is uploadImageToServer ', uri, ' ', uniqueId);
     if (!uri) {
       Alert.alert('No image selected', 'Please select an image before saving.');
       return;
     }
 
     console.log('Id in upload image ', uniqueId);
     const formData = new FormData();
     formData.append('profileImage', {
       uri,
       name: 'formImages.jpg', // Use the appropriate file name and extension
       type: 'image/jpeg', // Ensure this matches the file type
     });
 
     formData.append('id is', uniqueId);
     console.log('Image page email is ', uniqueId);
 
     try {
       const response = await fetch(`${API_URL}/api/upload-profile-image`, {
         // Updated endpoint
         method: 'POST',
         headers: {
           'Content-Type': 'multipart/form-data',
         },
         body: formData,
       });
 
       const responseText = await response.text(); // Log the response text for inspection
       console.log('Server response:', responseText);
 
       if (response.ok) {
         const data = JSON.parse(responseText);
         // setAvatarUri(data.filePath);
         uploadPathToServer(data.filePath, uniqueId);
         // Alert.alert('Success', 'Form submitted successfully!');
         console.log('Image uploaded successfully:', data.filePath);
       } else {
         console.error('Upload failed:', responseText);
         Alert.alert('Error', 'Failed to upload image.');
       }
     } catch (error) {
       console.error('Error uploading image:', error);
       // Alert.alert('Error', 'An error occurred while uploading the image.');
     }
   };
 
  console.log(selectedBehaviours);

  const uploadPathToServer = async (uri, uniqueId) => {
    console.log('uri is ', uri, ' ', uniqueId);
  
    console.log('Image page newId is ', uniqueId);
  
    try {
      const response = await axios.put(
        `${API_URL}/post-image-path-form/${uniqueId}`,
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
      // Alert.alert('Error', 'An error occurred while uploading the image.');
    }
  };


  // end image post methods

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

  // const renderSelectedBehaviours = () => {
  //   if (selectedBehaviours.length === 0) {
  //     return 'Select Behaviour';
  //   }
  //   return selectedBehaviours.join(', ');
  // };

  const renderSelectedBehaviours = () => {
    return selectedBehaviours.length > 0
      ? selectedBehaviours.join(', ')
      : 'Select Behaviour'; // Placeholder text when no behaviour is selected
  };

  // const handleBehaviourChange = item => {
  //   if (selectedBehaviours.includes(item.value)) {
  //     setSelectedBehaviours(selectedBehaviours.filter(i => i !== item.value));
  //   } else {
  //     setSelectedBehaviours([...selectedBehaviours, item.value]);
  //   }
  // };

  const handleBehaviourChange = item => {
    if (selectedBehaviours.includes(item.value)) {
      setSelectedBehaviours(
        selectedBehaviours.filter(behaviour => behaviour !== item.value),
      );
    } else {
      setSelectedBehaviours([...selectedBehaviours, item.value]);
    }
  };

  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   setShow(Platform.OS === 'ios');
  //   setDate(currentDate);
  //   setText(currentDate.toDateString());
  // };

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
    setText(currentDate.toLocaleDateString()); // Local date for UI
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
    setWeather(weatherString); // Update weather state here
    return weatherString;
  };
  const compileBehaviours = () => {
    const behavioursString = selectedBehaviours.join(', '); // Combine selected behaviours into a single string
    setBehaviours(behavioursString); // Update the behaviours state here
    return behavioursString;
  };
  // const compileBehaviours = () => selectedBehaviours.join(', ');

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
    if (!species) {
      formErrors.species = "Please select a bird species.";
    }
    if (!count) {
      formErrors.count = "Please select a bird count.";
    }

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
    setSelectedWaterConditions([]); // Reset selected water conditions
    setSelectedBehaviours([]);
    setWaterLevelOnLand('');
    setWaterLevelOnResources('');
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
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill required fields', [{ text: 'OK' }]);
      return;
    }
  
    const usrEmail = email;
    console.log('User Email:', usrEmail);
  
    // Generate Unique ID
    const now = new Date();
    const uniqueId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  
    console.log('Unique ID:', uniqueId);
  
    // **Create an array with form data**
    const submittedData = [
      { label: "Email", value: usrEmail || "N/A" },
      { label: "Unique ID", value: uniqueId },
      { label: "Observed Species", value: species || "N/A" },
      { label: "Count", value: count || "N/A" },
      { label: "Maturity", value: value8 || "N/A" },
      { label: "Sex", value: value9 || "N/A" },
      { label: "Behaviours", value: selectedBehaviours.join(', ') || "N/A" },
      { label: "Identification", value: value11 || "N/A" },
      { label: "Status", value: value12 || "N/A" },
      { label: "Remarks", value: remark || "N/A" },
      { label: "Image URL", value: imageUri || "No Image Uploaded" }
    ];
    const NewImageURL = imageUri;
     console.log('NewImageURL ', NewImageURL);
                    if (uniqueId && uniqueId.length > 0) {
                      console.log(uniqueId);
                      // console.log('Image URL is: ', submittedData.Image URL)
                      uploadImageToServer(NewImageURL, uniqueId); // Upload the image only if ID is valid
                    } else {
                      console.error('Invalid _id:', uniqueId);
                      Alert.alert('Error', 'Received invalid ID');
                    }
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
                    
            
    // **Log the array**
    console.log("Submitted Data:", submittedData);
  navigation.navigate('CommonData', { submittedData,surveyPoint, teamMembers });
    // **Optional: Convert to JSON and Log**
    console.log("Bird Data (JSON):", JSON.stringify(submittedData, null, 2));
  
    // Reset Form
    resetForm();
  };
  

  // Save failed submission data in a local queue for retry



  const renderLabel = (label, value, isFocus) => {
    if (value || isFocus) {
      return label;
    }
    return `Select ${label.toLowerCase()}`;
  };

 
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const showAlert = () => {
    setIsAlertVisible(true);
  };

  const hideAlert = () => {
    setIsAlertVisible(false);
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
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode = theme === 'dark';

  return (
    <ImageBackground
      source={require('../../assets/image/imageD1.jpg')}
      style={styles.backgroundImage}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
              <View style={styles.container3}>
                <Text style={styles.main_text3}>Bird Detail Record</Text>
                <Dropdown
  style={[
    styles.dropdown,
    isFocus1 && styles.dropdownFocused,
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
  data={data15}  // Use the bird species list
  search
  maxHeight={300}
  labelField="label"
  valueField="value"
  placeholder={!isFocus1 && !species ? `Select Observed Species` : ''}
  searchPlaceholder="Search species..."
  value={species}
  onFocus={() => setIsFocus1(true)}
  onBlur={() => setIsFocus1(false)}
  onChange={item => {
    // setSpecies(item.value);
    // setIsFocus1(false);
    setSpecies(prevValue => (prevValue === item.value ? null : item.value));
  setIsFocus1(false);
  }}>
  <Text>{renderLabel('Observed Species', species, isFocus1)}</Text>
  {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}

</Dropdown>
<View style={styles.dropdownTree}>
  <TextInput
    mode="outlined"
    placeholder="Observed Species"
    value={species}
    onChangeText={setSpecies}
    outlineStyle={styles.txtInputOutline}
    style={[
      styles.text_input,
      {
        backgroundColor: isDarkMode
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(255, 255, 255, 0.9)',
        color: isDarkMode ? 'black' : 'black',
      },
    ]}
    textColor={isDarkMode ? 'black' : 'black'}
  />
</View>


                <View style={styles.dropdownTree2}>
                  <TextInput
                    mode="outlined"
                    placeholder="Count"
                    value={count}
                    onChangeText={handleCountChange}
                    outlineStyle={styles.txtInputOutline}
                    style={[
                      styles.text_input2,
                      {
                        backgroundColor: isDarkMode
                          ? 'rgba(255, 255, 255, 0.9)'
                          : 'rgba(255, 255, 255, 0.9)',
                        color: isDarkMode ? 'black' : 'black',
                      },
                    ]}
                    textColor={isDarkMode ? 'black' : 'black'}
                  />
                </View>
                {errors.count && <Text style={styles.errorText}>{errors.count}</Text>}
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus8 && styles.dropdownFocused,
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
                  data={data8}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus8 && !value8 ? `Maturity` : ''}
                  searchPlaceholder="Search..."
                  value={value8}
                  onFocus={() => setIsFocus8(true)}
                  onBlur={() => setIsFocus8(false)}
                  onChange={item => {
                    setValue8(prevValue => (prevValue === item.value ? null : item.value));
                    setIsFocus8(false);
                  }}>
                  <Text>{renderLabel('Maturity', value8, isFocus8)}</Text>
                </Dropdown>

                <View style={{height: 16}} />

                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus9 && styles.dropdownFocused,
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
                  data={data9}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus9 && !value9 ? `Sex` : ''}
                  searchPlaceholder="Search..."
                  value={value2}
                  onFocus={() => setIsFocus9(true)}
                  onBlur={() => setIsFocus9(false)}
                  onChange={item => {
                    setValue9(prevValue => (prevValue === item.value ? null : item.value));
                    setIsFocus9(false);
                  }}>
                  <Text>{renderLabel('Sex', value9, isFocus9)}</Text>
                </Dropdown>

                <View style={{height: 16}} />

                <Dropdown
  style={[
    styles.dropdown,
    styles.dropdownNewTwo,
    isFocus4 && styles.dropdownFocused,
    {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      color: isDarkMode ? 'black' : 'black',
    },
  ]}
  placeholderStyle={styles.placeholderStyle}
  selectedTextStyle={styles.selectedTextStyle}
  inputSearchStyle={styles.inputSearchStyle}
  iconStyle={styles.iconStyle}
  data={data10} 
  itemTextStyle={{
    color: isDarkMode ? 'black' : 'black',
  }}
  search
  maxHeight={400}
  labelField="label"
  valueField="value"
  placeholder={renderSelectedBehaviours()} // Display selected behaviours in the placeholder
  searchPlaceholder="Search..."
  value={null} // No single value, handling multiple selections
  onFocus={() => setIsFocus10(true)}
  onBlur={() => setIsFocus10(false)}
  onChange={handleBehaviourChange} // Custom handler for multiple selections
  renderItem={(item, selected) => (
    <>
      <TouchableOpacity onPress={() => handleBehaviourChange(item)}>
        <View
          style={[
            styles.item,
            selectedBehaviours.includes(item.value) ? styles.itemSelected : {},
          ]}>
          <Text
            style={[
              styles.itemText,
              { color: isDarkMode ? 'black' : 'black' },
            ]}>
            {item.label}
          </Text>
          {selectedBehaviours.includes(item.value) && (
            <Icon name="check" size={20} color="green" />
          )}
        </View>
      </TouchableOpacity>

      {/* Additional conditional rendering for behaviours (if needed) */}
      {/* Example for handling extra options based on selection */}
    </>
  )}>
  <Text>
    {renderLabel(
      'Behaviour',
      selectedBehaviours.join(', '), // Show selected behaviours
      isFocus4,
    )}
  </Text>
</Dropdown>

                <View style={{height: 16}} />

                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus11 && styles.dropdownFocused,
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
                  data={data11}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus11 && !value11 ? `Identification` : ''}
                  searchPlaceholder="Search..."
                  value={value11}
                  onFocus={() => setIsFocus11(true)}
                  onBlur={() => setIsFocus11(false)}
                  onChange={item => {
                    setValue11(prevValue => (prevValue === item.value ? null : item.value));
                    setIsFocus11(false);
                  }}>
                  <Text>
                    {renderLabel('Identification', value11, isFocus11)}
                  </Text>
                </Dropdown>
                <View style={{height: 16}} />

                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus12 && styles.dropdownFocused,
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
                  data={data12}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus12 && !value12 ? `Status` : ''}
                  searchPlaceholder="Search..."
                  value={value12}
                  onFocus={() => setIsFocus12(true)}
                  onBlur={() => setIsFocus12(false)}
                  onChange={item => {
                    setValue12(prevValue => (prevValue === item.value ? null : item.value));
                    setIsFocus12(false);
                  }}>
                  <Text>{renderLabel('Status', value12, isFocus12)}</Text>
                </Dropdown>
              
                 <View style={styles.dropdownTreeremark}>
  <ScrollView style={styles.contentContainer}>
    {content.map((item, index) => (
      item.type === 'text' ? (
        <TextInput
          key={index}
          style={styles.textContent}
          value={item.text}
          editable={false}
          multiline
        />
      ) : (
        <Image key={index} source={{ uri: item.uri }} style={styles.imagePreview} />
      )
    ))}
  </ScrollView>

  <View style={styles.inputContainer}>
    <TextInput
      style={styles.textInput}
      placeholder="Write your note..."
      value={text}
      onChangeText={setText}
      multiline
    />
    <TouchableOpacity onPress={addText} style={styles.iconButton1}>
      <Icon name="check" size={18} color="black" />
    </TouchableOpacity>
    <TouchableOpacity onPress={openCamera1} style={styles.iconButton1}>
      <Icon name="camera" size={18} color="black" />
    </TouchableOpacity>
    <TouchableOpacity onPress={openGallery1} style={styles.iconButton1}>
      <Icon name="image" size={18} color="black" />
    </TouchableOpacity>
  </View>
</View>
                <Text
                  style={[
                    {marginTop: 10},
                    {color: isDarkMode ? 'black' : 'black'},
                  ]}>
                  Upload a Photo
                </Text>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleChoosePhoto}>
                  <Icon name="camera" size={30} color="#fff" />
                </TouchableOpacity>
                {imageUri && (
                  <Image source={{uri: imageUri}} style={styles.image} />
                )}

                <CustomAlert
                  visible={isAlertVisible}
                  onClose={hideAlert}
                  message="Successfully saved data!"
                />

                <Button
                  mode="contained"
                  onPress={handleSignUp}
                  style={[styles.button_signup, {borderRadius: 8}]}
                  buttonColor="green"
                  textColor="white"
                  labelStyle={styles.button_label}>
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
      </View>
    </ImageBackground>
  );
};

export default BirdData;

const styles = StyleSheet.create({
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
    color: 'black',
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
    color: 'black',
  },
  textContent: {
    fontSize: 16,
    paddingVertical: 10,
    backgroundColor: 'gray',
    // borderRadius: 5,
    marginVertical: 5,
    padding: 10,
    marginBottom: 5, // Reduce extra space
    marginTop: 0, // Ensure no top margin
    color: 'black',
    
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'white',
    paddingBottom: 5,
    color: 'black',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 30,
    marginLeft: 10,
    color: 'black',
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
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: -10,
  },
});
