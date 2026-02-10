import React, {useState, useEffect} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Modal,
  Platform,
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
import { useNavigation } from '@react-navigation/native'; 


const {width, height} = Dimensions.get('window');

const data = [
  {label: 'Tanks', value: 'Tanks'},
  {label: 'Dutch Canal', value: 'Dutch Canal'},
  {label: 'Beach', value: 'Beach'},
  {label: 'Paddy Field', value: 'Paddy Field'},
  {label: 'Woody Pathway', value: 'Woody Pathway'},
  {label: 'Grassland', value: 'Grassland'},
  {label: 'Monocrop-Coconut', value: 'Monocrop-Coconut'},
  {label: 'Home Garden', value: 'Home Garden'},
  {label: 'Natural Mangroves', value: 'Natural Mangroves'},
  {label: 'ANRM site', value: 'ANRM site'},
  {label: 'Other', value: 'Other'},
];
const data1 = [
  {label: 'Point 1', value: 'Point 1'},
  {label: 'Point 2', value: 'Point 2'},
  {label: 'Point 3', value: 'Point 3'},
  {label: 'Point 4', value: 'Point 4'},
  {label: 'Point 5', value: 'Point 5'},
];

const data2 = [
  {label: 'T1', value: 'T1'},
  {label: 'T2', value: 'T2'},
  {label: 'T3', value: 'T3'},
  {label: 'T4', value: 'T4'},
  {label: 'T5', value: 'T5'},
  {label: 'T6', value: 'T6'},
  {label: 'T7', value: 'T7'},
  {label: 'T8', value: 'T8'},
];

const data4 = [
  {label: 'Cloud Cover', value: 'Cloud Cover'},
  {label: 'Rain', value: 'Rain'},
  {label: 'Wind', value: 'Wind'},
  {label: 'Sunshine', value: 'Sunshine'},
];

const radio_props1 = [
  {label: 'None', value: 'None'},
  {label: 'Drizzle', value: 'Drizzle'},
  {label: 'Showers', value: 'Showers'},
  {label: 'Thunder Showers', value: 'Thunder Showers'},
];

const radio_props = [
  {label: '0-33%', value: '0-33%'},
  {label: '33%-66%', value: '33%-66%'},
  {label: '66%-100%', value: '66%-100%'},
];

const radio_props2 = [
  {label: 'Calm', value: 'Calm'},
  {label: 'Light', value: 'Light'},
  {label: 'Breezy', value: 'Breezy'},
  {label: 'Gale', value: 'Gale'},
];

const radio_props3 = [
  {label: 'Low', value: 'Low'},
  {label: 'Moderate', value: 'Moderate'},
  {label: 'High', value: 'High'},
];

const radio_props4 = [
  {label: 'Yes', value: 'Yes'},
  {label: 'No', value: 'No'},
];

const radio_props5 = [
  {label: 'Yes', value: 'Yes'},
  {label: 'No', value: 'No'},
];

const data5 = [
  {label: 'On Land', value: 'On Land'},
  {label: 'Water Resources', value: 'Water Resources'},
];

const data6 = [
  {label: 'Farming', value: 'Farming'},
  {label: 'Harvesting', value: 'Harvesting'},
  {label: 'Fallow Season', value: 'Fallow Season'},
];

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


const WeatherConditionModal = ({ visible, onClose, onSelect }) => {
  const [cloudCover, setCloudCover] = useState(null);
  const [rain, setRain] = useState(null);
  const [wind, setWind] = useState(null);
  const [sunshine, setSunshine] = useState(null);
  const [weatherSummary, setWeatherSummary] = useState(""); //  New state to store formatted text
  // Function to update weather summary
  const updateWeatherSummary = (cloud, rain, wind, sun) => {
    let summary = [];

    if (cloud) summary.push(`Cloud - ${cloud}`);
    if (rain) summary.push(`Rain - ${rain}`);
    if (wind) summary.push(`Wind - ${wind}`);
    if (sun) summary.push(`Sunshine - ${sun}`);

    setWeatherSummary(summary.join(", "));
  };

  // const handleSave = () => {
  //   onSelect(weatherSummary);
  //   console.log("Selected Weather Conditions:", weatherSummary);
  //   updateWeatherSummary(cloudCover, rain, wind, sunshine); // ✅ Update weather summary
  //   onClose();
  // };
  const handleSave = () => {
    const updatedSummary = `${weatherSummary || "Select Weather Condition"}`;
    onSelect(updatedSummary); // ✅ Pass weatherSummary to parent component
    console.log("Selected Weather Conditions:", updatedSummary);
    onClose();
  };
  

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
      <View
          style={[
            styles.modalContent,
          ]}
        >
          <Text style={styles.modalTitle}>{weatherSummary || "Select Weather Condition"}</Text>
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
    setCloudCover(prevValue => (prevValue === item.value ? null : item.value));
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
    setRain(prevValue => (prevValue === item.value ? null : item.value));
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
    setWind(prevValue => (prevValue === item.value ? null : item.value));
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
    setWind(prevValue => (prevValue === item.value ? null : item.value));
    updateWeatherSummary(cloudCover, rain, wind, item.value);
  }}
/> 
          <Button mode="contained" onPress={handleSave}   style={[styles.button_signup, { backgroundColor: '#4A7856' }]}  labelStyle={{ color: 'white' }}>
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
  const handleSave = () => {
    if (waterReservoir === 'Yes') {
      setShowWaterLevelPopup(true);
    } else {
      onSelect([{ onLand, waterReservoir, waterLevel: '' }]); // Wrap in array
      onClose();
    }
  };
  
  const handleWaterLevelSave = () => {
    onSelect([{ onLand, waterReservoir, waterLevel }]); // Wrap in array
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
          ]}
        >
                      <Text style={styles.modalTitle}>Select Water Availability</Text>

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
  onChange={(item) => setOnLand(prevValue => (prevValue === item.value ? null : item.value))}
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
  onChange={(item) => setWaterReservoir(prevValue => (prevValue === item.value ? null : item.value))}
  
/>
        

            <Button mode="contained" onPress={handleSave}  style={[styles.button_signup, { backgroundColor: '#4A7856' }]}  labelStyle={{ color: 'white' }}>
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
            <Button mode="contained" onPress={handleWaterLevelSave} style={[styles.button_signup, { backgroundColor: '#4A7856' }]}  labelStyle={{ color: 'white' }}>
              Save
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};


const CommonData = ({ route,navigation }) => {
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
   const [descriptor, setDescriptor] = useState('');
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
const [isWeatherModalVisible, setWeatherModalVisible] = useState(false);
  const [weatherSelection, setWeatherSelection] = useState({});
const [isWaterModalVisible, setWaterModalVisible] = useState(false);
  const [waterSelection, setWaterSelection] = useState({});
  // const navigation = useNavigation();  
  const { surveyPoint, teamMembers, submittedData,formData } = route.params || {};
  const [birdDataArray, setBirdDataArray] = useState([]);
  const [isFocusObservers, setIsFocusObservers] = useState(false);
  const [birdCount, setBirdCount] = useState(1);
  
  // Team Members State
  const [teamMemberInput, setTeamMemberInput] = useState('');
  const [teamMembersList, setTeamMembersList] = useState(teamMembers || []);
  const [editTeamIndex, setEditTeamIndex] = useState<number | null>(null);

  useEffect(() => {
    if (surveyPoint) {
      surveyPoint.forEach(item => {
        const parts = item.split(': ');
        const key = parts[0]?.trim();
        const value = parts[1]?.trim();
  
        if (key === 'Habitat Type') setValue1(value);
        if (key === 'Point') setValue2(value);  // Ensures only "Point" sets value2
        if (key === 'Point Tag') setValue3(value); // Ensures only "Point Tag" sets value3
        if (key === 'Radius of Area') setRadius(value);
        if (key === 'Descriptor') setDescriptor(value);
      });
  
      console.log("Survey Point Data:", surveyPoint);
      console.log("Habitat Type:", value1);
      console.log("Point:", value2);  // Now correctly holds "Point" value only
      console.log("Point Tag:", value3); // Now correctly holds "Point Tag" value
      console.log("Radius of Area:", radius);
      console.log("Descriptor:", descriptor);
    }
  }, [surveyPoint]);
  

  useEffect(() => {
    console.log("Selected Date:", text);
    console.log("Observers:", observers);
    console.log("Start Time:", selectedStartTime ? new Date(selectedStartTime).toLocaleTimeString('en-GB', {hour12: false}) : '');
    console.log("End Time:", selectedEndTime ? new Date(selectedEndTime).toLocaleTimeString('en-GB', {hour12: false}) : '');
    console.log("Selected Weather Condition:", weatherSelection);
    console.log("Selected Water Availability:", JSON.stringify(waterSelection));
    console.log("Status of Vegetation:", value7);
  }, [text, observers, selectedStartTime, selectedEndTime, selectedWeatherString, waterSelection, value7]);
  
  

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.submittedData) {
        setBirdDataArray(prevData => {
          const updatedData = [...prevData, route.params.submittedData];
          console.log("👥 Updated Bird Data:", JSON.stringify(updatedData, null, 2)); // Log the array
          return updatedData;
        });
      }
    }, [route.params?.submittedData])
  );
  
  useEffect(() => {
    const handleNetworkChange = async (state) => {
      if (state.isConnected) {
        console.log('Internet connected, retrying failed submissions...');
        retryFailedSubmissions(); // Retry syncing data with MongoDB
      }
    };
  
    const subscription = NetInfo.addEventListener(handleNetworkChange);
  
    return () => {
      subscription(); // Unsubscribe when component is unmounted
    };
  }, []);

  useEffect(() => {
    const initDb = async () => {
      try {
        const database = await getDatabase();

        // Create bird_survey table
        database.transaction((tx: any) => {
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
    descriptor TEXT,
    radiusOfArea TEXT,
    remark TEXT,
    imageUri TEXT,
    cloudIntensity TEXT,
    rainIntensity TEXT,
    windIntensity TEXT,
    sunshineIntensity TEXT,
    waterAvailability TEXT,
    waterLevelOnLand TEXT,
    waterLevelOnResources TEXT,
    teamMembers TEXT
);`,
            [],
            () => console.log('bird_survey table created successfully'),
            (_tx: any, error: any) => console.log('Error creating table: ', error),
          );
        });

        // Create bird_observations table
        database.transaction((tx: any) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS bird_observations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uniqueId TEXT,
    species TEXT,
    count TEXT,
    maturity TEXT,
    sex TEXT,
    behaviour TEXT,
    identification TEXT,
    status TEXT,
    remarks TEXT,
    imageUri TEXT
);`,
            [],
            () => console.log('bird_observations table created successfully'),
            (_tx: any, error: any) => console.log('Error creating table: ', error),
          );
        });

        retriveEmailFromSQLite();
        retriveAllFromDataSQLite();
      } catch (error) {
        console.error('Error opening database: ', error);
      }
    };
    initDb();
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

  const [selectedWeatherString, setSelectedWeatherString] = useState("");
  const [selectedWaterString, setselectedWaterString] = useState("");

const handleWeatherSelect = (data) => {
  setWeatherSelection(data);
  const weatherText = `Cloud Cover: ${data.cloudCover || "N/A"}, Rain: ${data.rain || "N/A"}, Wind: ${data.wind || "N/A"}, Sunshine: ${data.sunshine || "N/A"}`;
  setSelectedWeatherString(weatherText);
};


  const retryFailedSubmissions = async () => {
    console.log('Attempting to retry failed submissions...');
    const db = await getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM failed_submissions',  // Assuming you have a table for failed submissions
        [],
        (tx, results) => {
          console.log(`Found ${results.rows.length} failed submissions.`);
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              const formData = JSON.parse(row.formData);
              console.log('Retrying submission:', formData);
  
              // Retry the submission to MongoDB
              axios
                .post(`${API_URL}/form-entry`, formData)
                .then(response => {
                  console.log('Form submitted successfully after retry:', response.data);
                  const addedId = response.data._id;
  
                  // After successful submission, delete the failed record from SQLite
                  deleteFailedSubmission(row.id);
  
                  // If the form submission has an image, upload it to your image server
                  uploadImageToServer(response.data.imageUri, addedId);
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
        }
      );
    });
  };

 const deleteFailedSubmission = async (id) => {
    const db = await getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM failed_submissions WHERE id = ?',
        [id],
        () => {
          console.log('Failed submission removed from the queue.');
        },
        error => {
          console.error('Error deleting failed submission:', error);
        }
      );
    });
  };
  const storeFailedSubmission = async (formData) => {
    const db = await getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO failed_submissions (formData) VALUES (?)`,
        [JSON.stringify(formData)],  // Store the form data as a string
        () => {
          console.log('Failed submission saved for retry');
        },
        error => {
          console.error('Error saving failed submission:', error);
        }
      );
    });
  };

  const handleChoosePhoto = () => {
    Alert.alert(
      'Change Bird Image',
      'Choose an option',
      [
        {text: 'Camera', onPress: () => openCamera()},
        {text: 'Gallery', onPress: () => openGallery()},
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
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

  // image file capture
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
      name: 'formImages.jpg', // Use the appropriate file name and extension
      type: 'image/jpeg', // Ensure this matches the file type
    });

    formData.append('id is', addedId);
    console.log('Image page email is ', addedId);

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
        uploadPathToServer(data.filePath, addedId);
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
      : 'Select Behaviour'; // Placeholder text when no behaviour is selected
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

    if (!text.trim()) {
        formErrors.date = "Date field is required.";
    }
    
    if (!observers) {
        formErrors.observers = "Observer field is required.";
    }
    
    if (!selectedStartTime) {
        formErrors.startTime = "Start time field is required.";
    }

    if (!selectedEndTime) {
        formErrors.endTime = "End time field is required.";
    }

    if (!selectedWeatherString.trim()) {
        formErrors.weather = "Weather field is required.";
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
};



  // const isFormValid = () => {
  //   let formErrors = {};
  // //   if (!observers.trim()) {
  // //     formErrors.observers = "Observers field is required.";
  // // }

  //   setErrors(formErrors);

  //   return Object.keys(formErrors).length === 0;
  // };

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
  const retriveEmailFromSQLite = async () => {
    const db = await getDatabase();
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
  const retriveAllFromDataSQLite = async () => {
    const db = await getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
          bs.*, 
          bo.species, 
          bo.count, 
          bo.maturity, 
          bo.sex, 
          bo.behaviour, 
          bo.remarks, 
          bo.imageUri AS birdImage
        FROM bird_survey AS bs
        INNER JOIN bird_observations AS bo
        ON bs.uniqueId = bo.uniqueId`,
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i); 
              console.log('Combined Data:', row); 
            }
          } else {
            console.log('No combined data found.');
          }
        },
        error => {
          console.log('Error querying joined data: ' + error.message);
        }
      );
    });
  };

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
    // Alert.alert('Error', 'An error occurred while uploading the image.');
  }
};

  // Team Members Management Functions
  const addTeamMember = () => {
    if (teamMemberInput.trim() !== '' && !teamMembersList.includes(teamMemberInput)) {
      setTeamMembersList([...teamMembersList, teamMemberInput]);
      setTeamMemberInput('');
    } else {
      Alert.alert('Error', 'Please enter a valid and unique name.');
    }
  };

  const editTeamMember = (index) => {
    setTeamMemberInput(teamMembersList[index]);
    setEditTeamIndex(index);
  };

  const saveTeamMemberEdit = () => {
    if (editTeamIndex !== null) {
      const updated = [...teamMembersList];
      updated[editTeamIndex] = teamMemberInput;
      setTeamMembersList(updated);
      setTeamMemberInput('');
      setEditTeamIndex(null);
    }
  };

  const deleteTeamMember = (index) => {
    setTeamMembersList(teamMembersList.filter((_, i) => i !== index));
  };

  const handleSignUp = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill required fields', [{ text: 'OK' }]);
      return;
    }
  
    if (birdDataArray.length === 0) {
      Alert.alert(
        'Confirm Submission',
        'Are you sure you don’t want to add bird data?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Proceed',
            onPress: () => submitSurvey(), 
          },
        ],
        { cancelable: false }
      );
    } else {
      submitSurvey(); // Call the function directly if bird data exists
    }
  };
  
  const submitSurvey = async () => {
    console.log("Selected Date:", text);
    console.log("Observers:", observers);
    console.log("Start Time:", selectedStartTime ? new Date(selectedStartTime).toLocaleTimeString('en-GB', { hour12: false }) : '');
    console.log("End Time:", selectedEndTime ? new Date(selectedEndTime).toLocaleTimeString('en-GB', { hour12: false }) : '');
    console.log("Selected Weather Condition:", weatherSelection);
    console.log("Selected Water Availability:", JSON.stringify(waterSelection));
    console.log("Status of Vegetation:", value7);
  
    const usrEmail = email;
    const now = new Date();
    const uniqueId = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;
    console.log("Selected Date:", value2);
    console.log('image uri ',imageUri);
    const formData = {
      email: usrEmail,
      uniqueId: uniqueId,
      habitatType: value1,
      point: value2 || "",
      pointTag: value3 || "",
      latitude: latitude || "",
      longitude: longitude || "",
      date: date,
      observers: observers || "",
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      weather: selectedWeatherString ? JSON.stringify(selectedWeatherString) : "",
      water: JSON.stringify(selectedWaterString) || "",
      season: value6 || "",
      statusOfVegy: value7 || "",
      descriptor: descriptor || "",
      radiusOfArea: radius || "",
      remark: remark || "",
      imageUri: imageUri || "",
      cloudIntensity: cloudIntensity || "",
      rainIntensity: rainIntensity || "",
      windIntensity: windIntensity || "",
      sunshineIntensity: sunshineIntensity || "",
      waterAvailability: compileWaterAvailability(),
      waterLevelOnLand,
      waterLevelOnResources,
      teamMembers: teamMembersList,
  
      birdObservations: birdDataArray.map(bird => ({
        uniqueId: bird.find(item => item.label === "Unique ID")?.value,
        species: bird.find(item => item.label === "Observed Species")?.value,
        count: bird.find(item => item.label === "Count")?.value,
        maturity: bird.find(item => item.label === "Maturity")?.value,
        sex: bird.find(item => item.label === "Sex")?.value,
        behaviour: bird.find(item => item.label === "Behaviours")?.value,
        identification: bird.find(item => item.label === "Identification")?.value,
        status: bird.find(item => item.label === "Status")?.value,
        latitude: bird.find(item => item.label === "Latitude")?.value,
        longitude: bird.find(item => item.label === "Longitude")?.value,
        weather: bird.find(item => item.label === "Weather")?.value,
        waterConditions: bird.find(item => item.label === "Water Conditions")?.value,
        remarks: bird.find(item => item.label === "Remarks")?.value,
        imageUri: bird.find(item => item.label === "Image URL")?.value || imageUri,
      })),
    };
  
    console.log("Form Data with Bird Observations:", formData);
    saveFormDataSQL(formData,navigation, resetForm);
    axios.post(`${API_URL}/form-entry`, formData)
      .then(response => {
        console.log("Form submitted successfully:", response.data);

        const addedId = response.data._id || response.data.formEntry?._id; // or try another property if needed

        
                console.log('added id new is ', addedId, ' unique id is ', uniqueId);
                const NewImageURL = imageUri;
                console.log('NewImageURL ', NewImageURL);
                if (addedId && addedId.length > 0) {
                  console.log(addedId);
                  // console.log('Image URL is: ', submittedData.Image URL)
                  uploadImageToServer(NewImageURL, addedId); // Upload the image only if ID is valid
                } else {
                  console.error('Invalid _id:', addedId);
                  Alert.alert('Error', 'Received invalid ID');
                }
        
                console.log('added id ', addedId);
              
        Alert.alert(
          'Success',
          'Form submitted successfully!',
          [{ text: 'OK', onPress: () => console.log('Form submitted successfully') }],
          { cancelable: false }
        );
        navigation.navigate('BirdBottomNav');
        resetForm();
      })
      .catch(error => {
        console.error("Error submitting form:", error);
        storeFailedSubmission(formData);
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


  // Save failed submission data in a local queue for retry
  const getImageUrl = (submittedData) => {
    if (!submittedData || !Array.isArray(submittedData)) {
      console.log('Error: submittedData is undefined or not an array.');
      return null;  // Return null if `submittedData` is invalid
    }
  
    // Find the object with label "Image URL" and return its value
    const imageObject = submittedData.find(item => item.label === "Image URL");
  
    // Return the value if found, otherwise return null
    return imageObject ? imageObject.value : null;
  };
  

  useEffect(() => {
    if (!submittedData) {
      console.log("Error: submittedData is undefined.");
    } else {
      console.log("📌 Survey Point Data:", surveyPoint);
      console.log("👥 Team Members Data:", teamMembers);
      console.log("👥 Bird Data:", submittedData);
    }
  
    const imageUrl = getImageUrl(submittedData);
    console.log("🖼️ Image URL:", imageUrl);  // Log the image URL
    setNewImageUri(imageUrl);
    setImageUri(imageUrl);
    console.log("Image URL:", newImageUri);
  }, [surveyPoint, teamMembers, submittedData]);
  

  const saveFormDataSQL = async (formData, navigation, resetForm) => {
    const db = await getDatabase();
    db.transaction((tx) => {
      // Track successful inserts
      let successfulObservations = 0;
  
      // Insert Main Survey Data
      tx.executeSql(
        `INSERT INTO bird_survey (
          email, uniqueId, habitatType, point, pointTag, latitude, longitude,
          date, observers, startTime, endTime, weather, water, season, 
          statusOfVegy, descriptor, radiusOfArea, remark, imageUri, 
          cloudIntensity, rainIntensity, windIntensity, sunshineIntensity, 
          waterAvailability, waterLevelOnLand, waterLevelOnResources, 
          teamMembers
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
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
          JSON.stringify(formData.weather),
          JSON.stringify(formData.water),
          formData.season,
          formData.statusOfVegy,
          formData.descriptor,
          formData.radiusOfArea,
          formData.remark,
          formData.imageUri,
          formData.cloudIntensity,
          formData.rainIntensity,
          formData.windIntensity,
          formData.sunshineIntensity,
          formData.waterAvailability,
          formData.waterLevelOnLand,
          formData.waterLevelOnResources,
          JSON.stringify(formData.teamMembers)
        ],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Data inserted successfully into local db', results);
  
            // Insert Bird Observation Data
            formData.birdObservations.forEach((bird, index) => {
              tx.executeSql(
                `INSERT INTO bird_observations (
                  uniqueId, species, count, maturity, sex, behaviour, identification, 
                  status, remarks, imageUri
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                  bird.uniqueId,
                  bird.species,
                  bird.count,
                  bird.maturity,
                  bird.sex,
                  bird.behaviour,
                  bird.identification,
                  bird.status,
                  bird.remarks,
                  bird.imageUri
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    console.log('Bird observation saved successfully', results);
                    successfulObservations++;
  
                    // Check if all bird observations are saved
                    if (successfulObservations === formData.birdObservations.length) {
                      Alert.alert(
                        'Success',
                        'Form submitted successfully!',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              console.log('Form submitted successfully');
                              navigation.navigate('BirdBottomNav');
                              resetForm();
                            }
                          }
                        ],
                        { cancelable: false }
                      );
                    }
                  } else {
                    console.log('Failed to insert bird observation');
                  }
                },
                (error) => {
                  console.log('Error inserting bird observation: ', error);
                }
              );
            });
          } else {
            console.log('Failed to insert data');
          }
        },
        (error) => {
          console.log('Error inserting data: ', error);
        }
      );
    });
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
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          setLatitude(location.latitude.toString());
          setLongitude(location.longitude.toString());
        })
        .catch(error => {
          const {code, message} = error;
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

  const formatWaterSelection = (selection = []) => {
    return selection
      .map((item) => {
        const onLandText = item.onLand
          ? `On Land - ${item.onLand === 'Yes' ? `Yes ` : 'No'}`
          : '';
  
        const waterReservoirText = item.waterReservoir
          ? `Water Reservoir - ${item.waterReservoir === 'Yes' ? `Yes (Level: ${item.waterLevel})` : 'No'}`
          : '';
  
        return [onLandText, waterReservoirText].filter(Boolean).join(', ');
      })
      .join(', ');
  };
  
  useEffect(() => {
    if (route.params?.formData) {
        const { formData } = route.params;

        setBirdDataArray(formData.birdDataArray || []);
        setText(formData.text || "");
        setObservers(formData.observers || "");
        setSelectedStartTime(formData.selectedStartTime 
            ? new Date(formData.selectedStartTime) 
            : ""
        );
        setSelectedEndTime(formData.selectedEndTime 
            ? new Date(formData.selectedEndTime) 
            : ""
        );
        setWeatherSelection(formData.weatherSelection || []);
        setWaterSelection(formData.waterSelection || []);
        setValue7(formData.value7 || "");
    }
}, [route.params?.formData]);




  
  return (
    <View style={styles.safeArea}>
         <TouchableOpacity 
    onPress={() => navigation.navigate('SurveyPointData')}
    style={styles.backButton}
>
    <IconButton icon="arrow-left" iconColor="#4A7856" size={28} />
</TouchableOpacity>


      <View style={styles.whiteBoxContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {!isFormSubmitted ? (
            <View>
          <View style={styles.container2}>
                <Text style={styles.main_text}>Common Detail Record</Text>
                <View style={styles.dropdownTwo}>
                  <TouchableOpacity
                    onPress={showDatepicker}
                    style={styles.dateInput}>
                    <Text
                      style={[
                        styles.calendarTxt,
                        {color: '#333'},
                      ]}>
                      {text || 'Select Date'}
                    </Text>
                    <Icon
                      name="calendar"
                      size={15}
                      color="black"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="date"
                      is24Hour={true}
                      display="default"
                      onChange={onChange}
                    />
                  )}
                  {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

                </View>
                {/* <View style={styles.dropdownNewTwo}>
                  <TextInput
                    mode="outlined"
                    placeholder="Observers"
                    value={observers}
                    onChangeText={setObservers}
                    outlineStyle={styles.txtInputOutline}
                    style={[styles.text_input, errors.observers && styles.errorBorder]}
                    textColor="#333"
                  />
                  {errors.observers ? <Text style={styles.errorText}>{errors.observers}</Text> : null}
                </View> */}

<View style={styles.dropdownNewTwo}>
  <Dropdown
    style={[
      styles.dropdown,
      styles.dropdownNewTwo,
      isFocusObservers && styles.dropdownFocused, // Apply focused style when isFocusObservers is true
      {
        backgroundColor: 'white',
      },
    ]}
    placeholderStyle={styles.placeholderStyle}
    selectedTextStyle={styles.selectedTextStyle}
    inputSearchStyle={styles.inputSearchStyle}
    iconStyle={styles.iconStyle}
    itemTextStyle={{
      color: '#333',
    }}
    data={teamMembers.map(member => ({
      label: member, // Since teamMembers is a simple array of strings, use the value as label
      value: member, // The value will be the same as the label
    }))}
    search
    maxHeight={300}
    labelField="label"
    valueField="value"
    placeholder={!isFocusObservers && !observers ? 'Select Observer' : ''}
    searchPlaceholder="Search..."
    value={observers}  // Ensure this is bound to the state
    onFocus={() => setIsFocusObservers(true)} // Set focus state to true on focus
    onBlur={() => setIsFocusObservers(false)}  // Set focus state to false on blur
    onChange={item => {
      setObservers(prevValue => (prevValue === item.value ? null : item.value)); // Set the value to observers state
      setIsFocusObservers(false); // Close focus when an item is selected
    }}
  >
    <Text>
      {renderLabel('Observer', observers, isFocusObservers)} {/* Show selected observer */}
    </Text>
  </Dropdown>
  {errors.observers ? <Text style={styles.errorText}>{errors.observers}</Text> : null}
</View>


                <View style={styles.dropdownTwo}>
                  <TouchableOpacity
                    onPress={showStartTimePickerHandler}
                    style={styles.timeInput}>
                    <Text
                      style={[
                        styles.calendarTxt,
                        {color: '#333'},
                      ]}>
                      {/* {selectedStartTime.toLocaleTimeString() || 'Start Time'} */}
                      {selectedStartTime
                        ? new Date(selectedStartTime).toLocaleTimeString(
                            'en-GB',
                            {hour12: false},
                          )
                        : 'Start Time'}
                    </Text>
                    <Icon
                      name="clock-o"
                      size={20}
                      color="gray"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  {showStartTimePicker && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={selectedStartTime || new Date()}
                      // value={selectedStartTime}
                      mode={'time'}
                      is24Hour={true}
                      display="default"
                      onChange={onChangeStartTime}
                    />
                  )}
                  {errors.startTime && <Text style={styles.errorText}>{errors.startTime}</Text>}

                </View>
                <View style={styles.dropdownThree}>
                  <TouchableOpacity
                    onPress={showEndTimePickerHandler}
                    style={styles.timeInput}>
                    <Text
                      style={[
                        styles.calendarTxt,
                        {color: '#333'},
                      ]}>
                      {/* {selectedEndTime.toLocaleTimeString() || 'End Time'} */}
                      {selectedEndTime
                        ? new Date(selectedEndTime).toLocaleTimeString(
                            'en-GB',
                            {hour12: false},
                          )
                        : 'End Time'}
                    </Text>
                    <Icon
                      name="clock-o"
                      size={20}
                      color="gray"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  {showEndTimePicker && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      // value={selectedEndTime}
                      value={selectedEndTime || new Date()}
                      mode={'time'}
                      is24Hour={true}
                      display="default"
                      onChange={onChangeEndTime}
                    />
                  )}
                  {errors.endTime && <Text style={styles.errorText}>{errors.endTime}</Text>}

                </View>
                <TouchableOpacity onPress={() => setWeatherModalVisible(true)}>
  <View style={styles.dropdownNewTwo}>
    <TextInput
      mode="outlined"
      placeholder="Select Weather Condition"
      value={selectedWeatherString} // Updated to reflect selected weather
      onPressIn={() => setWeatherModalVisible(true)} // Ensures modal opens on press
      outlineStyle={styles.txtInputOutline}
      style={styles.text_input}
      textColor="#333"
      editable={false} // Makes input non-editable, acts like a dropdown
    />
  </View>
  {errors.weather && <Text style={styles.errorText}>{errors.weather}</Text>}

</TouchableOpacity>


                           <WeatherConditionModal
                                      visible={isWeatherModalVisible}
                                      onClose={() => setWeatherModalVisible(false)}
                                      onSelect={(data) => setSelectedWeatherString(data)}
                                    />
                          
                                    {/* <Text>Selected Weather: {JSON.stringify(weatherSelection)}</Text> */}
                              

                                    

                                              <TouchableOpacity onPress={() => setWaterModalVisible(true)}>
  <View style={styles.dropdownNewTwo}>
    <TextInput
      mode="outlined"
      placeholder="Select Water Availability"
      value={selectedWaterString} // Updated to reflect selected weather
      onPressIn={() => setWaterModalVisible(true)} // Ensures modal opens on press
      outlineStyle={styles.txtInputOutline}
      style={styles.text_input}
      textColor="#333"
      editable={false} // Makes input non-editable, acts like a dropdown
    />
  </View>
</TouchableOpacity>
                                    
                                              {/* Water Availability Modal */}
                                              {/* <WaterAvailabilityModal
                                                visible={isWaterModalVisible}
                                                onClose={() => setWaterModalVisible(false)}
                                                // onSelect={(data) => setWaterSelection(data)}
                                                onSelect={(data) => {
                                                  const formattedSelection = formatWaterSelection(data);
                                                  setSelectedWeatherString(formattedSelection);
                                                }}
                                              /> */}
                                              <WaterAvailabilityModal
  visible={isWaterModalVisible}
  onClose={() => setWaterModalVisible(false)}
  onSelect={(data) => {
    const formattedSelection = formatWaterSelection(data);
    setselectedWaterString(formattedSelection);
  }}
/>

                                    
                                              {/* Display Selected Water Availability */}
                                              {/* <Text style={styles.selectedText}>Selected Water Availability: {JSON.stringify(waterSelection)}</Text> */}

<View style={{ marginBottom: 10 }}>
                {value1 === 'Paddy Field' && (
                  <Dropdown
                    style={[
                      styles.dropdown,
                      styles.dropdownNewTwo,
                      isFocus6 && styles.dropdownFocused,
                      {
                        backgroundColor: 'white',
                      },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    itemTextStyle={{
                      color: '#333',
                    }}
                    data={data6}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={
                      !isFocus6 && !value6 ? `Season of Paddy Field` : ''
                    }
                    searchPlaceholder="Search..."
                    value={value6}
                    onFocus={() => setIsFocus6(true)}
                    onBlur={() => setIsFocus6(false)}
                    onChange={item => {
                      setValue6(prevValue => (prevValue === item.value ? null : item.value));
                      setIsFocus6(false);
                    }}>
                    <Text>
                      {renderLabel('Season of Paddy Field', value6, isFocus6)}
                    </Text>
                  </Dropdown>
                )}
                </View>
                <View style={{ marginBottom: 0 }}>
                <Dropdown
                  style={[
                    styles.dropdown,
                    styles.dropdownNewTwo,
                    isFocus3 && styles.dropdownFocused,
                    {
                      backgroundColor: 'white',
                    },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  itemTextStyle={{
                    color: '#333',
                  }}
                  data={data7}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={
                    !isFocus7 && !value7 ? `Status Of Vegetation` : ''
                  }
                  searchPlaceholder="Search..."
                  value={value7}
                  onFocus={() => setIsFocus7(true)}
                  onBlur={() => setIsFocus7(false)}
                  onChange={item => {
                    setValue7(prevValue => (prevValue === item.value ? null : item.value));
                    setIsFocus7(false);
                  }}>
                  <Text>
                    {renderLabel('Status Of Vegetation', value7, isFocus7)}
                  </Text>
                </Dropdown>
            
              </View>
              </View>
                <CustomAlert
                  visible={isAlertVisible}
                  onClose={hideAlert}
                  message="Successfully saved data!"
                />

<Button
  mode="contained"
  onPress={() => {
    if (isFormValid()) {
    navigation.navigate('BirdDataRecord', {
      surveyPoint,
      teamMembers: teamMembersList,
      birdDataArray
    });
    setBirdCount((prevCount) => prevCount + 1); // Increment bird count on click
   } }}
  
  style={[styles.button_signup, { borderRadius: 8 }]}
  buttonColor="#4A7856"
  textColor="white"
  labelStyle={styles.button_label}
>
  {`Add ${birdCount === 1 ? 'First Observed Bird Data ' : `Observed Bird Data ${birdCount}`}`} 
</Button>

                {/* Team Members Section */}
                <View style={styles.teamMembersSection}>
                  <Text style={styles.sectionTitle}>Team Members</Text>
                  
                  <View style={styles.inputContainer}>
                    <TextInput
                      mode="outlined"
                      placeholder="Enter team member name"
                      value={teamMemberInput}
                      onChangeText={setTeamMemberInput}
                      style={styles.textInput}
                      outlineColor="#4A7856"
                      activeOutlineColor="#4A7856"
                      placeholderTextColor="#999"
                    />
                    <TouchableOpacity 
                      onPress={editTeamIndex !== null ? saveTeamMemberEdit : addTeamMember}
                      style={styles.addButton}
                    >
                      <Icon name={editTeamIndex !== null ? "check" : "plus"} size={20} color="white" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.teamMembersContainer}>
                    {teamMembersList.length > 0 ? (
                      teamMembersList.map((member, index) => (
                        <View key={index} style={styles.teamMemberItem}>
                          <Text style={styles.teamMemberText}>{member}</Text>
                          <View style={styles.actionsContainer}>
                            <TouchableOpacity 
                              onPress={() => editTeamMember(index)}
                              style={styles.editButton}
                            >
                              <Icon name="edit" size={18} color="#4A7856" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              onPress={() => deleteTeamMember(index)}
                              style={styles.deleteButton}
                            >
                              <Icon name="trash" size={18} color="#D32F2F" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noMembersText}>No team members added yet.</Text>
                    )}
                  </View>
                </View>

                <View>
                <Button
                  mode="contained"
                  onPress={handleSignUp}
                  style={[styles.button_signup, {borderRadius: 8}]}
                  buttonColor="#4A7856"
                  textColor="white"
                  labelStyle={styles.button_label}>
                 Submit your full Survey
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
    </View>
  );
};

export default CommonData;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    height: 460,
    width: width * 0.95,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  container2: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    width: width * 0.95,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  container3: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
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
    borderColor: '#4A7856',
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
  // inputSearchStyle: {
  //   height: 40,
  //   fontSize: 16,
  // },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
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
    backgroundColor: '#4A7856',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 10,
  },
  main_text3: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 30,
  },
  whiteBox2: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 750,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 15,
  },
  whiteBox3: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
    borderColor: '#E0E0E0',
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
    marginTop: 20,
    marginBottom: 50,
    borderRadius: 25,
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
    color: 'black',
  },
  textInput: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    color: 'black',
  },
  selectButton: {
    padding: 10,
    backgroundColor: '#4A7856',
    borderRadius: 25,
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
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: -10,
  },
  // Team Members Styles
  teamMembersSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginVertical: 15,
    marginHorizontal: 5,
    width: width * 0.9,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    height: 50,
    marginRight: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#4A7856',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamMembersContainer: {
    width: '100%',
  },
  teamMemberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  teamMemberText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginLeft: 10,
    padding: 5,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  noMembersText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 10,
  },
});
