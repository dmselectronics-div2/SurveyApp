import React, {useState, useEffect} from 'react';
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
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {TextInput, Button} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import GetLocation from 'react-native-get-location';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {API_URL} from '../../config';
import {getDatabase} from '../database/db';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import {birdSpecies} from './bird-list';

const {width} = Dimensions.get('window');

// ========================================
// CONSTANTS
// ========================================
const GREEN = '#4A7856';
const GREEN_DARK = '#2E7D32';

const habitatTypes = [
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

const surveyPoints = [
  {label: 'Point 1', value: 'Point 1'},
  {label: 'Point 2', value: 'Point 2'},
  {label: 'Point 3', value: 'Point 3'},
  {label: 'Point 4', value: 'Point 4'},
  {label: 'Point 5', value: 'Point 5'},
];

const pointTags = [
  {label: 'T1', value: 'T1'},
  {label: 'T2', value: 'T2'},
  {label: 'T3', value: 'T3'},
  {label: 'T4', value: 'T4'},
  {label: 'T5', value: 'T5'},
  {label: 'T6', value: 'T6'},
  {label: 'T7', value: 'T7'},
  {label: 'T8', value: 'T8'},
];

const cloudCoverOptions = [
  {label: '0-33%', value: '0-33%'},
  {label: '33%-66%', value: '33%-66%'},
  {label: '66%-100%', value: '66%-100%'},
];

const rainOptions = [
  {label: 'None', value: 'None'},
  {label: 'Drizzle', value: 'Drizzle'},
  {label: 'Showers', value: 'Showers'},
  {label: 'Thunder Showers', value: 'Thunder Showers'},
];

const windOptions = [
  {label: 'Calm', value: 'Calm'},
  {label: 'Light', value: 'Light'},
  {label: 'Breezy', value: 'Breezy'},
  {label: 'Gale', value: 'Gale'},
];

const sunshineOptions = [
  {label: 'Low', value: 'Low'},
  {label: 'Moderate', value: 'Moderate'},
  {label: 'High', value: 'High'},
];

const yesNoOptions = [
  {label: 'Yes', value: 'Yes'},
  {label: 'No', value: 'No'},
];

const paddySeasons = [
  {label: 'Farming', value: 'Farming'},
  {label: 'Harvesting', value: 'Harvesting'},
  {label: 'Fallow Season', value: 'Fallow Season'},
];

const vegetationStatuses = [
  {label: 'Flowering', value: 'Flowering'},
  {label: 'Fruiting', value: 'Fruiting'},
  {label: 'Dry Vegetation', value: 'Dry Vegetation'},
  {label: 'Harvesting (for paddy fields)', value: 'Harvesting (for paddy fields)'},
  {label: 'Fallow Season (for paddy fields)', value: 'Fallow Season (for paddy fields)'},
  {label: 'Farming season (for paddy fields)', value: 'Farming season (for paddy fields)'},
];

const maturityOptions = [
  {label: 'Hatchlings', value: 'Hatchlings'},
  {label: 'Juvenile', value: 'Juvenile'},
  {label: 'Adult', value: 'Adult'},
  {label: 'Adult non breeding', value: 'Adult non breeding'},
  {label: 'Adult breeding', value: 'Adult breeding'},
];

const sexOptions = [
  {label: 'Male', value: 'Male'},
  {label: 'Female', value: 'Female'},
  {label: 'Unknown', value: 'Unknown'},
];

const behaviourOptions = [
  {label: 'Nesting', value: 'Nesting'},
  {label: 'Flying', value: 'Flying'},
  {label: 'Resting', value: 'Resting'},
  {label: 'Singing', value: 'Singing'},
  {label: 'Swimming', value: 'Swimming'},
  {label: 'Walking', value: 'Walking'},
  {label: 'Feeding', value: 'Feeding'},
  {label: 'Roosting', value: 'Roosting'},
];

const identificationOptions = [
  {label: 'Sighting', value: 'Sighting'},
  {label: 'Listening', value: 'Listening'},
];

const birdStatusOptions = [
  {label: 'Endemic', value: 'Endemic'},
  {label: 'Resident', value: 'Resident'},
  {label: 'Migrant', value: 'Migrant'},
  {label: 'Vagrant', value: 'Vagrant'},
  {label: 'Other', value: 'Other'},
];

const birdSpeciesData = birdSpecies.map(item => {
  const regex = /^(.*)\(([^)]+)\)$/;
  const match = item.label.match(regex);
  const name = match ? match[1].trim() : item.label;
  const scientificName = match ? match[2].trim() : '';
  return {...item, customLabel: `${name} (${scientificName})`};
});

const stepTitles = ['Survey Point Details', 'Common Detail Record', 'Bird Detail Record'];

const parseSpeciesName = (speciesStr: string) => {
  const match = speciesStr.match(/^(.*?)\s*\(([^)]+)\)$/);
  if (match) return {common: match[1].trim(), scientific: match[2].trim()};
  return {common: speciesStr, scientific: ''};
};

// ========================================
// HELPERS
// ========================================
const getOrdinalText = (num: number): string => {
  const ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];
  return ordinals[num] || `${num + 1}th`;
};

const createEmptyBirdObservation = () => ({
  id: Date.now().toString(),
  species: '',
  count: '',
  maturity: null as string | null,
  sex: null as string | null,
  behaviours: [] as string[],
  identification: null as string | null,
  status: null as string | null,
  remark: '',
  imageUri: null as string | null,
  expanded: true,
});

// ========================================
// BIRD OBSERVATION CARD
// ========================================
const BirdObservationCard = ({observation, index, onUpdate, onDelete, onToggle}: any) => {
  const [speciesFocus, setSpeciesFocus] = useState(false);

  const handleBehaviourChange = (item: any) => {
    const current = observation.behaviours || [];
    const updated = current.includes(item.value)
      ? current.filter((b: string) => b !== item.value)
      : [...current, item.value];
    onUpdate({...observation, behaviours: updated});
  };

  const handleChoosePhoto = () => {
    Alert.alert('Bird Photo', 'Choose an option', [
      {text: 'Camera', onPress: () => {
        launchCamera({mediaType: 'photo', quality: 1}, response => {
          if (response.assets && response.assets.length > 0) {
            onUpdate({...observation, imageUri: response.assets[0].uri});
          }
        });
      }},
      {text: 'Gallery', onPress: () => {
        launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
          if (response.assets && response.assets.length > 0) {
            onUpdate({...observation, imageUri: response.assets[0].uri});
          }
        });
      }},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  return (
    <View style={cardStyles.card}>
      <TouchableOpacity onPress={onToggle} style={cardStyles.cardHeader}>
        <Text style={cardStyles.cardTitle}>
          Bird #{index + 1}
          {observation.species ? (() => {
            const parsed = parseSpeciesName(observation.species);
            return <Text>{` - ${parsed.common}`}{parsed.scientific ? <Text style={{fontStyle: 'italic'}}>{` (${parsed.scientific})`}</Text> : null}</Text>;
          })() : ''}
        </Text>
        <View style={cardStyles.headerActions}>
          <Icon name={observation.expanded ? 'chevron-up' : 'chevron-down'} size={16} color={GREEN} />
          <TouchableOpacity onPress={onDelete} style={cardStyles.deleteBtn}>
            <Icon name="trash" size={16} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {observation.expanded && (
        <View style={cardStyles.cardBody}>
          <Dropdown
            style={[cardStyles.dropdown, speciesFocus && {borderColor: GREEN}]}
            placeholderStyle={cardStyles.placeholderStyle}
            selectedTextStyle={cardStyles.selectedTextStyle}
            inputSearchStyle={cardStyles.inputSearchStyle}
            iconStyle={cardStyles.iconStyle}
            data={birdSpeciesData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Observed Species"
            searchPlaceholder="Search species..."
            value={observation.species}
            onFocus={() => setSpeciesFocus(true)}
            onBlur={() => setSpeciesFocus(false)}
            onChange={item => {
              onUpdate({...observation, species: item.value});
              setSpeciesFocus(false);
            }}
            renderItem={(item: any) => {
              const parsed = parseSpeciesName(item.label);
              return (
                <View style={cardStyles.speciesDropdownItem}>
                  <Text style={cardStyles.speciesCommon}>{parsed.common}</Text>
                  {parsed.scientific ? <Text style={cardStyles.speciesScientific}> ({parsed.scientific})</Text> : null}
                </View>
              );
            }}
          />

          <TextInput
            mode="outlined"
            placeholder="Observed Species (type manually)"
            value={observation.species}
            onChangeText={val => onUpdate({...observation, species: val})}
            outlineStyle={cardStyles.txtInputOutline}
            style={cardStyles.textInput}
            textColor="#333"
          />

          <TextInput
            mode="outlined"
            placeholder="Count *"
            value={observation.count}
            onChangeText={text => {
              const numericValue = text.replace(/\D/g, '');
              onUpdate({...observation, count: numericValue});
            }}
            keyboardType="numeric"
            outlineStyle={cardStyles.txtInputOutline}
            style={cardStyles.textInput}
            textColor="#333"
          />

          <Dropdown
            style={cardStyles.dropdown}
            placeholderStyle={cardStyles.placeholderStyle}
            selectedTextStyle={cardStyles.selectedTextStyle}
            iconStyle={cardStyles.iconStyle}
            itemTextStyle={{color: '#333'}}
            data={maturityOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={observation.maturity || 'Maturity'}
            value={observation.maturity}
            onChange={item => onUpdate({...observation, maturity: item.value})}
          />

          <Dropdown
            style={cardStyles.dropdown}
            placeholderStyle={cardStyles.placeholderStyle}
            selectedTextStyle={cardStyles.selectedTextStyle}
            iconStyle={cardStyles.iconStyle}
            itemTextStyle={{color: '#333'}}
            data={sexOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={observation.sex || 'Sex'}
            value={observation.sex}
            onChange={item => onUpdate({...observation, sex: item.value})}
          />

          <Dropdown
            style={cardStyles.dropdown}
            placeholderStyle={cardStyles.placeholderStyle}
            selectedTextStyle={cardStyles.selectedTextStyle}
            iconStyle={cardStyles.iconStyle}
            itemTextStyle={{color: '#333'}}
            data={behaviourOptions}
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder={observation.behaviours.length > 0 ? observation.behaviours.join(', ') : 'Select Behaviour'}
            value={null}
            onChange={handleBehaviourChange}
            renderItem={(item: any) => (
              <TouchableOpacity onPress={() => handleBehaviourChange(item)}>
                <View style={[cardStyles.item, observation.behaviours.includes(item.value) && cardStyles.itemSelected]}>
                  <Text style={{color: '#333'}}>{item.label}</Text>
                  {observation.behaviours.includes(item.value) && <Icon name="check" size={20} color={GREEN} />}
                </View>
              </TouchableOpacity>
            )}
          />

          <Dropdown
            style={cardStyles.dropdown}
            placeholderStyle={cardStyles.placeholderStyle}
            selectedTextStyle={cardStyles.selectedTextStyle}
            iconStyle={cardStyles.iconStyle}
            itemTextStyle={{color: '#333'}}
            data={identificationOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={observation.identification || 'Identification'}
            value={observation.identification}
            onChange={item => onUpdate({...observation, identification: item.value})}
          />

          <Dropdown
            style={cardStyles.dropdown}
            placeholderStyle={cardStyles.placeholderStyle}
            selectedTextStyle={cardStyles.selectedTextStyle}
            iconStyle={cardStyles.iconStyle}
            itemTextStyle={{color: '#333'}}
            data={birdStatusOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={observation.status || 'Status'}
            value={observation.status}
            onChange={item => onUpdate({...observation, status: item.value})}
          />

          <TextInput
            mode="outlined"
            placeholder="Write your note..."
            value={observation.remark}
            onChangeText={val => onUpdate({...observation, remark: val})}
            outlineStyle={cardStyles.txtInputOutline}
            style={[cardStyles.textInput, {height: 80}]}
            textColor="#333"
            multiline
          />

          <View style={cardStyles.photoRow}>
            <Text style={{color: '#333', marginRight: 10}}>Upload a Photo</Text>
            <TouchableOpacity style={cardStyles.photoButton} onPress={handleChoosePhoto}>
              <Icon name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {observation.imageUri && (
            <Image source={{uri: observation.imageUri}} style={cardStyles.imagePreview} />
          )}
        </View>
      )}
    </View>
  );
};

// ========================================
// WEATHER CONDITION MODAL
// ========================================
const WeatherConditionModal = ({visible, onClose, onSelect}: any) => {
  const [cloudCover, setCloudCover] = useState<string | null>(null);
  const [rain, setRain] = useState<string | null>(null);
  const [wind, setWind] = useState<string | null>(null);
  const [sunshine, setSunshine] = useState<string | null>(null);
  const [summary, setSummary] = useState('');

  const updateSummary = (c: string | null, r: string | null, w: string | null, s: string | null) => {
    const parts = [];
    if (c) parts.push(`Cloud - ${c}`);
    if (r) parts.push(`Rain - ${r}`);
    if (w) parts.push(`Wind - ${w}`);
    if (s) parts.push(`Sunshine - ${s}`);
    setSummary(parts.join(', '));
  };

  const modalDd = {height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 8, backgroundColor: 'white', marginBottom: 10, width: '100%' as const};
  const containerS = {backgroundColor: 'white', borderColor: '#ccc', borderWidth: 1, borderRadius: 8};

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{summary || 'Select Weather Condition'}</Text>
          <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
            data={cloudCoverOptions} labelField="label" valueField="value" placeholder="Cloud Cover" value={cloudCover}
            onChange={item => { setCloudCover(p => p === item.value ? null : item.value); updateSummary(item.value, rain, wind, sunshine); }} />
          <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
            data={rainOptions} labelField="label" valueField="value" placeholder="Rain" value={rain}
            onChange={item => { setRain(p => p === item.value ? null : item.value); updateSummary(cloudCover, item.value, wind, sunshine); }} />
          <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
            data={windOptions} labelField="label" valueField="value" placeholder="Wind" value={wind}
            onChange={item => { setWind(p => p === item.value ? null : item.value); updateSummary(cloudCover, rain, item.value, sunshine); }} />
          <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
            data={sunshineOptions} labelField="label" valueField="value" placeholder="Sunshine" value={sunshine}
            onChange={item => { setSunshine(p => p === item.value ? null : item.value); updateSummary(cloudCover, rain, wind, item.value); }} />
          <Button mode="contained" onPress={() => { onSelect(summary || ''); onClose(); }} style={styles.modalButton} buttonColor={GREEN} textColor="white">Save</Button>
        </View>
      </View>
    </Modal>
  );
};

// ========================================
// WATER AVAILABILITY MODAL
// ========================================
const WaterAvailabilityModal = ({visible, onClose, onSelect}: any) => {
  const [onLand, setOnLand] = useState<string | null>(null);
  const [waterReservoir, setWaterReservoir] = useState<string | null>(null);
  const [showWaterLevel, setShowWaterLevel] = useState(false);
  const [waterLevel, setWaterLevel] = useState('');

  const modalDd = {height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 8, backgroundColor: 'white', marginBottom: 10, width: '100%' as const};
  const containerS = {backgroundColor: 'white', borderColor: '#ccc', borderWidth: 1, borderRadius: 8};

  const buildResult = (level?: string) => {
    const parts = [];
    if (onLand) parts.push(`On Land - ${onLand}`);
    if (waterReservoir === 'Yes') parts.push(`Water Reservoir - Yes (Level: ${level || waterLevel})`);
    else if (waterReservoir) parts.push(`Water Reservoir - ${waterReservoir}`);
    return parts.join(', ');
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Water Availability</Text>
            <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
              data={yesNoOptions} labelField="label" valueField="value" placeholder="On Land" value={onLand}
              onChange={item => setOnLand(p => p === item.value ? null : item.value)} />
            <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
              data={yesNoOptions} labelField="label" valueField="value" placeholder="Water Reservoir" value={waterReservoir}
              onChange={item => setWaterReservoir(p => p === item.value ? null : item.value)} />
            <Button mode="contained" onPress={() => {
              if (waterReservoir === 'Yes') { setShowWaterLevel(true); }
              else { onSelect(buildResult()); onClose(); }
            }} style={styles.modalButton} buttonColor={GREEN} textColor="white">Save</Button>
          </View>
        </View>
      </Modal>
      <Modal visible={showWaterLevel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Water Level (cm)</Text>
            <TextInput mode="outlined" placeholder="Water Level" value={waterLevel} onChangeText={setWaterLevel}
              keyboardType="numeric" style={{width: '100%', backgroundColor: 'white'}} textColor="#333" />
            <Button mode="contained" onPress={() => { onSelect(buildResult(waterLevel)); setShowWaterLevel(false); onClose(); }}
              style={styles.modalButton} buttonColor={GREEN} textColor="white">Save</Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

// ========================================
// MAIN FORM COMPONENT
// ========================================
const BirdSurveyForm = () => {
  const navigation = useNavigation<any>();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<any>({});
  const [email, setEmail] = useState('');

  // Step 1: Survey Point Details
  const [habitatType, setHabitatType] = useState<string | null>(null);
  const [point, setPoint] = useState<string | null>(null);
  const [pointTag, setPointTag] = useState<string | null>(null);
  const [descriptor, setDescriptor] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');

  // Team Members (part of step 1)
  const [teamMemberInput, setTeamMemberInput] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [editTeamIndex, setEditTeamIndex] = useState<number | null>(null);

  // Step 2: Common Data
  const [date, setDate] = useState(new Date());
  const [dateText, setDateText] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [observers, setObservers] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedWeatherString, setSelectedWeatherString] = useState('');
  const [isWeatherModalVisible, setWeatherModalVisible] = useState(false);
  const [selectedWaterString, setSelectedWaterString] = useState('');
  const [isWaterModalVisible, setWaterModalVisible] = useState(false);
  const [paddySeason, setPaddySeason] = useState<string | null>(null);
  const [vegetationStatus, setVegetationStatus] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Step 3: Bird Observations
  const [birdDataArray, setBirdDataArray] = useState<any[]>([]);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Focus states
  const [focusStates, setFocusStates] = useState<{[key: string]: boolean}>({});
  const setFocus = (key: string, val: boolean) => setFocusStates(prev => ({...prev, [key]: val}));

  // ===== INITIALIZATION =====
  useEffect(() => {
    initDatabase();
    requestLocationPermission();
    retrieveEmail();
    const subscription = NetInfo.addEventListener(state => {
      if (state.isConnected) retryFailedSubmissions();
    });
    return () => subscription();
  }, []);

  // Fetch team members when email is ready
  useEffect(() => {
    if (email) fetchTeamMembers();
  }, [email]);

  const initDatabase = async () => {
    try {
      const db = await getDatabase();
      db.transaction((tx: any) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS bird_survey (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT, uniqueId TEXT, habitatType TEXT, point TEXT, pointTag TEXT,
            latitude TEXT, longitude TEXT, date TEXT, observers TEXT,
            startTime TEXT, endTime TEXT, weather TEXT, water TEXT,
            season TEXT, statusOfVegy TEXT, descriptor TEXT, radiusOfArea TEXT,
            remark TEXT, imageUri TEXT, cloudIntensity TEXT, rainIntensity TEXT,
            windIntensity TEXT, sunshineIntensity TEXT, waterAvailability TEXT,
            waterLevelOnLand TEXT, waterLevelOnResources TEXT, teamMembers TEXT
          );`, [], () => {}, (_: any, e: any) => console.log('Error:', e),
        );
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS bird_observations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uniqueId TEXT, species TEXT, count TEXT, maturity TEXT,
            sex TEXT, behaviour TEXT, identification TEXT, status TEXT,
            remarks TEXT, imageUri TEXT
          );`, [], () => {}, (_: any, e: any) => console.log('Error:', e),
        );
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS failed_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT, formData TEXT
          );`, [], () => {}, (_: any, e: any) => console.log('Error:', e),
        );
      });
    } catch (error) {
      console.error('DB init error:', error);
    }
  };

  const retrieveEmail = async () => {
    try {
      const db = await getDatabase();
      db.transaction((tx: any) => {
        tx.executeSql('SELECT email FROM LoginData LIMIT 1', [], (_: any, results: any) => {
          if (results.rows.length > 0) setEmail(results.rows.item(0).email);
        });
      });
    } catch (error) {
      console.error('Error retrieving email:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`${API_URL}/getTeamMembers`, {params: {email}});
      if (response.data.teamMembers) setTeamMembers(response.data.teamMembers);
    } catch (error) {
      console.log('Could not fetch team members from server');
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {title: 'Location Permission', message: 'This app needs access to your location.', buttonPositive: 'OK', buttonNegative: 'Cancel', buttonNeutral: 'Ask Me Later'},
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) getCurrentLocation();
      } catch (err) { console.warn(err); }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({enableHighAccuracy: true, timeout: 15000})
      .then(location => {
        setLatitude(location.latitude.toFixed(2));
        setLongitude(location.longitude.toFixed(2));
      })
      .catch(error => console.warn(error.code, error.message));
  };

  // ===== FAILED SUBMISSIONS =====
  const retryFailedSubmissions = async () => {
    const db = await getDatabase();
    db.transaction((tx: any) => {
      tx.executeSql('SELECT * FROM failed_submissions', [], (_: any, results: any) => {
        for (let i = 0; i < results.rows.length; i++) {
          const row = results.rows.item(i);
          const formData = JSON.parse(row.formData);
          axios.post(`${API_URL}/form-entry`, formData)
            .then(response => {
              deleteFailedSubmission(row.id);
              const addedId = response.data._id || response.data.formEntry?._id;
              if (addedId) uploadImageToServer(formData.imageUri, addedId);
            })
            .catch(() => {});
        }
      });
    });
  };

  const deleteFailedSubmission = async (id: number) => {
    const db = await getDatabase();
    db.transaction((tx: any) => {
      tx.executeSql('DELETE FROM failed_submissions WHERE id = ?', [id]);
    });
  };

  const storeFailedSubmission = async (formData: any) => {
    const db = await getDatabase();
    db.transaction((tx: any) => {
      tx.executeSql('INSERT INTO failed_submissions (formData) VALUES (?)', [JSON.stringify(formData)]);
    });
  };

  // ===== IMAGE UPLOAD =====
  const uploadImageToServer = async (uri: string | null, addedId: string) => {
    if (!uri) return;
    const fd = new FormData();
    fd.append('profileImage', {uri, name: 'formImages.jpg', type: 'image/jpeg'} as any);
    fd.append('id is', addedId);
    try {
      const response = await fetch(`${API_URL}/api/upload-profile-image`, {
        method: 'POST', headers: {'Content-Type': 'multipart/form-data'}, body: fd,
      });
      if (response.ok) {
        const data = await response.json();
        uploadPathToServer(data.filePath, addedId);
      }
    } catch (error) { console.error('Image upload error:', error); }
  };

  const uploadPathToServer = async (uri: string, addedId: string) => {
    try {
      await axios.put(`${API_URL}/post-image-path-form/${addedId}`, {uri});
    } catch (error) { console.error('Path upload error:', error); }
  };

  const handleChoosePhoto = () => {
    Alert.alert('Photo', 'Choose an option', [
      {text: 'Camera', onPress: () => launchCamera({mediaType: 'photo', quality: 1}, r => {
        if (r.assets?.[0]?.uri) setImageUri(r.assets[0].uri);
      })},
      {text: 'Gallery', onPress: () => launchImageLibrary({mediaType: 'photo', quality: 1}, r => {
        if (r.assets?.[0]?.uri) setImageUri(r.assets[0].uri);
      })},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  // ===== TEAM MEMBERS =====
  const addTeamMember = () => {
    if (teamMemberInput.trim() && !teamMembers.includes(teamMemberInput.trim())) {
      setTeamMembers([...teamMembers, teamMemberInput.trim()]);
      setTeamMemberInput('');
    } else if (teamMembers.includes(teamMemberInput.trim())) {
      Alert.alert('Duplicate', 'This team member already exists.');
    } else {
      Alert.alert('Error', 'Please enter a valid name.');
    }
  };

  const saveTeamMemberEdit = () => {
    if (editTeamIndex !== null) {
      const updated = [...teamMembers];
      updated[editTeamIndex] = teamMemberInput.trim();
      setTeamMembers(updated);
      setTeamMemberInput('');
      setEditTeamIndex(null);
    }
  };

  // ===== BIRD OBSERVATIONS =====
  const addBirdObservation = () => setBirdDataArray(prev => [...prev, createEmptyBirdObservation()]);

  const updateBirdObservation = (updated: any) =>
    setBirdDataArray(prev => prev.map((b: any) => b.id === updated.id ? updated : b));

  const deleteBirdObservation = (id: string) => {
    Alert.alert('Delete', 'Remove this bird observation?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: () => setBirdDataArray(prev => prev.filter((b: any) => b.id !== id))},
    ]);
  };

  const toggleBirdObservation = (id: string) =>
    setBirdDataArray(prev => prev.map((b: any) => b.id === id ? {...b, expanded: !b.expanded} : b));

  // ===== VALIDATION =====
  const validateStep1 = () => {
    const e: any = {};
    if (!habitatType) e.habitatType = 'Habitat Type is required';
    if (teamMembers.length === 0) e.teamMembers = 'Add at least one team member';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: any = {};
    if (!dateText) e.date = 'Date is required';
    if (!observers) e.observers = 'Observer is required';
    if (!selectedWeatherString) e.weather = 'Weather condition is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    for (const bird of birdDataArray) {
      if (!bird.species || !bird.count) {
        Alert.alert('Error', 'Bird species and count are mandatory for all observations.');
        return false;
      }
    }
    return true;
  };

  // ===== STEP NAVIGATION =====
  const handleNext = () => {
    if (currentStep === 0 && validateStep1()) {
      saveTeamData();
      setCurrentStep(1);
      setErrors({});
    } else if (currentStep === 1 && validateStep2()) {
      setCurrentStep(2);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (currentStep > 0) { setCurrentStep(currentStep - 1); setErrors({}); }
    else navigation.navigate('BirdBottomNav');
  };

  const saveTeamData = async () => {
    try {
      const netState = await NetInfo.fetch();
      if (netState.isConnected) {
        await axios.post(`${API_URL}/saveOrUpdateTeamData`, {
          surveyPoint: [habitatType, point, pointTag],
          teamMembers, email,
        });
      }
    } catch (error) { console.log('Team save (will sync later):', error); }
  };

  // ===== SUBMIT =====
  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'User email not found. Please login again.');
      return;
    }
    if (!validateStep3()) return;
    if (birdDataArray.length === 0) {
      Alert.alert('Confirm', 'Submit without bird observations?', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Proceed', onPress: () => setShowSubmitConfirm(true)},
      ]);
    } else {
      setShowSubmitConfirm(true);
    }
  };

  const submitSurvey = async () => {
    setShowSubmitConfirm(false);
    setIsSubmitting(true);

    const now = new Date();
    const uniqueId = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;

    const dateStr = date.toISOString().split('T')[0];
    const startTimeStr = selectedStartTime.toISOString();
    const endTimeStr = selectedEndTime.toISOString();

    const formData = {
      email, uniqueId, habitatType,
      point: point || '', pointTag: pointTag || '',
      latitude, longitude, date: dateStr,
      observers, startTime: startTimeStr, endTime: endTimeStr,
      weather: selectedWeatherString || '',
      water: selectedWaterString || '',
      season: paddySeason || '', statusOfVegy: vegetationStatus || '',
      descriptor, radiusOfArea: radius,
      remark: '', imageUri: imageUri || '', teamMembers,
      birdObservations: birdDataArray.map((bird: any) => ({
        uniqueId, species: bird.species || '', count: bird.count || '',
        maturity: bird.maturity || '', sex: bird.sex || '',
        behaviour: (bird.behaviours || []).join(', '),
        identification: bird.identification || '', status: bird.status || '',
        latitude, longitude,
        weather: selectedWeatherString || '', waterConditions: selectedWaterString || '',
        remarks: bird.remark || '', imageUri: bird.imageUri || imageUri || '',
      })),
    };

    saveFormDataSQL(formData);

    axios.post(`${API_URL}/form-entry`, formData)
      .then(response => {
        setIsSubmitting(false);
        const addedId = response.data._id || response.data.formEntry?._id;
        if (addedId) uploadImageToServer(imageUri, addedId);
        Alert.alert('Success', 'Survey submitted successfully!', [{text: 'OK'}]);
        navigation.navigate('BirdBottomNav');
      })
      .catch(error => {
        setIsSubmitting(false);
        console.error('Submit error:', error);
        storeFailedSubmission(formData);
        Alert.alert('Saved Offline', 'Survey saved locally. Will sync when online.');
        navigation.navigate('BirdBottomNav');
      });
  };

  const saveFormDataSQL = async (formData: any) => {
    const db = await getDatabase();
    db.transaction((tx: any) => {
      tx.executeSql(
        `INSERT INTO bird_survey (
          email, uniqueId, habitatType, point, pointTag, latitude, longitude,
          date, observers, startTime, endTime, weather, water, season,
          statusOfVegy, descriptor, radiusOfArea, remark, imageUri, teamMembers
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          formData.email, formData.uniqueId, formData.habitatType,
          formData.point, formData.pointTag, formData.latitude, formData.longitude,
          formData.date, formData.observers, formData.startTime, formData.endTime,
          formData.weather, formData.water, formData.season,
          formData.statusOfVegy, formData.descriptor, formData.radiusOfArea,
          formData.remark, formData.imageUri, JSON.stringify(formData.teamMembers),
        ],
        (_: any, results: any) => {
          if (results.rowsAffected > 0) {
            formData.birdObservations.forEach((bird: any) => {
              tx.executeSql(
                `INSERT INTO bird_observations (uniqueId, species, count, maturity, sex, behaviour, identification, status, remarks, imageUri)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [bird.uniqueId, bird.species, bird.count, bird.maturity, bird.sex, bird.behaviour, bird.identification, bird.status, bird.remarks, bird.imageUri],
              );
            });
          }
        },
      );
    });
  };

  // ===== DATE/TIME HANDLERS =====
  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) { setDate(selectedDate); setDateText(selectedDate.toLocaleDateString()); }
  };

  const onStartTimeChange = (_: any, selectedTime?: Date) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (selectedTime) setSelectedStartTime(selectedTime);
  };

  const onEndTimeChange = (_: any, selectedTime?: Date) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (selectedTime) setSelectedEndTime(selectedTime);
  };

  // ========================================
  // RENDER STEP 1: Survey Point Details + Team Members
  // ========================================
  const renderStepOne = () => (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Survey Point Details</Text>

        <Dropdown
          style={[styles.formDropdown, focusStates.habitat && styles.dropdownFocused]}
          placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle} iconStyle={styles.iconStyle}
          itemTextStyle={{color: '#333'}} data={habitatTypes} search maxHeight={300}
          labelField="label" valueField="value" placeholder="Habitat type"
          searchPlaceholder="Search..." value={habitatType}
          onFocus={() => setFocus('habitat', true)} onBlur={() => setFocus('habitat', false)}
          onChange={item => { setHabitatType(item.value); setFocus('habitat', false); }}
        />
        {errors.habitatType && <Text style={styles.errorText}>{errors.habitatType}</Text>}

        <Dropdown
          style={[styles.formDropdown, focusStates.point && styles.dropdownFocused]}
          placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle} itemTextStyle={{color: '#333'}} data={surveyPoints}
          maxHeight={300} labelField="label" valueField="value" placeholder="Point" value={point}
          onFocus={() => setFocus('point', true)} onBlur={() => setFocus('point', false)}
          onChange={item => { setPoint(item.value); setFocus('point', false); }}
        />

        <Dropdown
          style={[styles.formDropdown, focusStates.tag && styles.dropdownFocused]}
          placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle} itemTextStyle={{color: '#333'}} data={pointTags}
          maxHeight={300} labelField="label" valueField="value" placeholder="Point Tag" value={pointTag}
          onFocus={() => setFocus('tag', true)} onBlur={() => setFocus('tag', false)}
          onChange={item => { setPointTag(item.value); setFocus('tag', false); }}
        />

        <TextInput mode="outlined" placeholder="Descriptor" value={descriptor} onChangeText={setDescriptor}
          outlineStyle={styles.inputOutline} style={styles.formInput} textColor="#333" />

        <TextInput mode="outlined" placeholder="Latitude" value={latitude} onChangeText={setLatitude}
          keyboardType="numeric" outlineStyle={styles.inputOutline} style={styles.formInput} textColor="#333" />

        <TextInput mode="outlined" placeholder="Longitude" value={longitude} onChangeText={setLongitude}
          keyboardType="numeric" outlineStyle={styles.inputOutline} style={styles.formInput} textColor="#333" />

        <TextInput mode="outlined" placeholder="Radius of Area(m)" value={radius}
          onChangeText={text => { const num = text.replace(/[^0-9.]/g, ''); setRadius(num ? `${num}m` : ''); }}
          keyboardType="numeric" outlineStyle={styles.inputOutline} style={styles.formInput} textColor="#333" />
      </View>

      {/* Team Members */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Team Members</Text>
        <View style={styles.teamInputRow}>
          <TextInput 
            mode="outlined" 
            placeholder="Enter Team Member" 
            value={teamMemberInput}
            onChangeText={setTeamMemberInput} 
            style={styles.teamInput}
            outlineColor={GREEN} 
            activeOutlineColor={GREEN} 
            placeholderTextColor="#999"
            textColor="#333"
          />
          {teamMemberInput.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                setTeamMemberInput('');
                setEditTeamIndex(null);
              }} 
              style={styles.teamClearButton}>
              <Icon name="times-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={editTeamIndex !== null ? saveTeamMemberEdit : addTeamMember} 
            style={styles.teamAddButton}>
            <Icon name={editTeamIndex !== null ? 'check' : 'plus'} size={20} color="white" />
          </TouchableOpacity>
        </View>
        {editTeamIndex !== null && (
          <Text style={styles.editingHint}>
            Editing: {teamMembers[editTeamIndex]}
          </Text>
        )}
        {errors.teamMembers && <Text style={styles.errorText}>{errors.teamMembers}</Text>}
        <View style={styles.teamList}>
          {teamMembers.length > 0 ? teamMembers.map((member, index) => (
            <View 
              key={index} 
              style={[
                styles.teamItem,
                editTeamIndex === index && styles.teamItemEditing
              ]}>
              <Text style={styles.teamItemText}>{member}</Text>
              <View style={styles.teamActions}>
                <TouchableOpacity 
                  onPress={() => { 
                    setTeamMemberInput(member); 
                    setEditTeamIndex(index); 
                  }} 
                  style={styles.teamActionBtn}>
                  <Icon name="edit" size={18} color={GREEN} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    if (editTeamIndex === index) {
                      setEditTeamIndex(null);
                      setTeamMemberInput('');
                    }
                    setTeamMembers(teamMembers.filter((_, i) => i !== index));
                  }} 
                  style={styles.teamActionBtn}>
                  <Icon name="trash" size={18} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            </View>
          )) : <Text style={styles.noDataText}>No team members added yet.</Text>}
        </View>

        <Button mode="contained" onPress={handleNext} style={styles.nextButton} buttonColor={GREEN} textColor="white" labelStyle={styles.buttonLabel}>
          Go To Next Step
        </Button>
      </View>
    </View>
  );

  // ========================================
  // RENDER STEP 2: Common Detail Record
  // ========================================
  const renderStepTwo = () => (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Common Detail Record</Text>

        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeInput}>
          <Text style={styles.dateTimeText}>{dateText || 'Select Date'}</Text>
          <Icon name="calendar" size={15} color="black" />
        </TouchableOpacity>
        {showDatePicker && <DateTimePicker value={date} mode="date" is24Hour display="default" onChange={onDateChange} />}
        {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

        <Dropdown
          style={[styles.formDropdown, focusStates.observer && styles.dropdownFocused]}
          placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle} iconStyle={styles.iconStyle}
          itemTextStyle={{color: '#333'}} data={teamMembers.map(m => ({label: m, value: m}))}
          search maxHeight={300} labelField="label" valueField="value"
          placeholder="Select Observer" searchPlaceholder="Search..." value={observers}
          onFocus={() => setFocus('observer', true)} onBlur={() => setFocus('observer', false)}
          onChange={item => { setObservers(item.value); setFocus('observer', false); }}
        />
        {errors.observers && <Text style={styles.errorText}>{errors.observers}</Text>}

        <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.dateTimeInput}>
          <Text style={styles.dateTimeText}>
            {selectedStartTime ? new Date(selectedStartTime).toLocaleTimeString('en-GB', {hour12: false}) : 'Start Time'}
          </Text>
          <Icon name="clock-o" size={20} color="gray" />
        </TouchableOpacity>
        {showStartTimePicker && <DateTimePicker value={selectedStartTime} mode="time" is24Hour display="default" onChange={onStartTimeChange} />}

        <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.dateTimeInput}>
          <Text style={styles.dateTimeText}>
            {selectedEndTime ? new Date(selectedEndTime).toLocaleTimeString('en-GB', {hour12: false}) : 'End Time'}
          </Text>
          <Icon name="clock-o" size={20} color="gray" />
        </TouchableOpacity>
        {showEndTimePicker && <DateTimePicker value={selectedEndTime} mode="time" is24Hour display="default" onChange={onEndTimeChange} />}

        <TouchableOpacity onPress={() => setWeatherModalVisible(true)}>
          <TextInput mode="outlined" placeholder="Select Weather Condition" value={selectedWeatherString}
            outlineStyle={styles.inputOutline} style={styles.formInput} textColor="#333" editable={false}
            onPressIn={() => setWeatherModalVisible(true)} />
        </TouchableOpacity>
        {errors.weather && <Text style={styles.errorText}>{errors.weather}</Text>}
        <WeatherConditionModal visible={isWeatherModalVisible} onClose={() => setWeatherModalVisible(false)} onSelect={setSelectedWeatherString} />

        <TouchableOpacity onPress={() => setWaterModalVisible(true)}>
          <TextInput mode="outlined" placeholder="Select Water Availability" value={selectedWaterString}
            outlineStyle={styles.inputOutline} style={styles.formInput} textColor="#333" editable={false}
            onPressIn={() => setWaterModalVisible(true)} />
        </TouchableOpacity>
        <WaterAvailabilityModal visible={isWaterModalVisible} onClose={() => setWaterModalVisible(false)} onSelect={setSelectedWaterString} />

        {habitatType === 'Paddy Field' && (
          <Dropdown
            style={[styles.formDropdown, focusStates.season && styles.dropdownFocused]}
            placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle} itemTextStyle={{color: '#333'}} data={paddySeasons}
            maxHeight={300} labelField="label" valueField="value" placeholder="Season of Paddy Field"
            value={paddySeason} onChange={item => setPaddySeason(item.value)}
          />
        )}

        <Dropdown
          style={[styles.formDropdown, focusStates.vegetation && styles.dropdownFocused]}
          placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle} iconStyle={styles.iconStyle}
          itemTextStyle={{color: '#333'}} data={vegetationStatuses} search maxHeight={300}
          labelField="label" valueField="value" placeholder="Status Of Vegetation"
          searchPlaceholder="Search..." value={vegetationStatus}
          onFocus={() => setFocus('vegetation', true)} onBlur={() => setFocus('vegetation', false)}
          onChange={item => { setVegetationStatus(item.value); setFocus('vegetation', false); }}
        />

        <Button mode="contained" onPress={handleNext} style={styles.nextButton} buttonColor={GREEN} textColor="white" labelStyle={styles.buttonLabel}>
          Go To Next Step
        </Button>
      </View>
    </View>
  );

  // ========================================
  // RENDER STEP 3: Bird Detail Record
  // ========================================
  const renderStepThree = () => (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bird Detail Record</Text>

        {birdDataArray.map((obs: any, idx: number) => (
          <BirdObservationCard
            key={obs.id} observation={obs} index={idx}
            onUpdate={updateBirdObservation}
            onDelete={() => deleteBirdObservation(obs.id)}
            onToggle={() => toggleBirdObservation(obs.id)}
          />
        ))}

        <Button mode="contained" onPress={addBirdObservation} style={styles.addBirdButton}
          buttonColor={GREEN} textColor="white" labelStyle={styles.buttonLabel} icon="plus">
          {`Add ${getOrdinalText(birdDataArray.length)} Observed Bird Data`}
        </Button>
      </View>

      {/* Survey Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Survey Summary</Text>
        <View style={styles.summaryRow}>
          <Icon name="tree" size={14} color={GREEN} />
          <Text style={styles.summaryLabel}>Habitat:</Text>
          <Text style={styles.summaryValue}>{habitatType || 'Not set'}</Text>
        </View>
        {point && (
          <View style={styles.summaryRow}>
            <Icon name="map-marker" size={14} color={GREEN} />
            <Text style={styles.summaryLabel}>Point:</Text>
            <Text style={styles.summaryValue}>{point}{pointTag ? ` (${pointTag})` : ''}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Icon name="calendar" size={14} color={GREEN} />
          <Text style={styles.summaryLabel}>Date:</Text>
          <Text style={styles.summaryValue}>{dateText || 'Not set'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Icon name="user" size={14} color={GREEN} />
          <Text style={styles.summaryLabel}>Observer:</Text>
          <Text style={styles.summaryValue}>{observers || 'Not set'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Icon name="users" size={14} color={GREEN} />
          <Text style={styles.summaryLabel}>Team:</Text>
          <Text style={styles.summaryValue}>{teamMembers.length} member(s)</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Icon name="binoculars" size={14} color={GREEN} />
          <Text style={styles.summaryLabel}>Birds Observed:</Text>
          <Text style={[styles.summaryValue, {fontWeight: 'bold', color: GREEN_DARK}]}>
            {birdDataArray.length}
          </Text>
        </View>
        {birdDataArray.length > 0 && (
          <View style={styles.summaryRow}>
            <Icon name="calculator" size={14} color={GREEN} />
            <Text style={styles.summaryLabel}>Total Count:</Text>
            <Text style={[styles.summaryValue, {fontWeight: 'bold', color: GREEN_DARK}]}>
              {birdDataArray.reduce((sum: number, b: any) => sum + (parseInt(b.count) || 0), 0)}
            </Text>
          </View>
        )}
      </View>

      {/* Submit Buttons */}
      <View style={styles.submitRow}>
        <TouchableOpacity
          onPress={() => { setCurrentStep(1); setErrors({}); }}
          style={styles.backStepButton}>
          <Icon name="arrow-left" size={16} color={GREEN} />
          <Text style={styles.backStepText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={[styles.submitBtn, isSubmitting && {opacity: 0.6}]}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Icon name="cloud-upload" size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Submit Survey</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Submit Confirmation Modal */}
      <Modal visible={showSubmitConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={styles.confirmIconCircle}>
              <Icon name="paper-plane" size={30} color={GREEN} />
            </View>
            <Text style={styles.confirmTitle}>Submit Survey?</Text>
            <Text style={styles.confirmText}>
              You are about to submit a survey with{' '}
              <Text style={{fontWeight: 'bold'}}>{birdDataArray.length} bird observation(s)</Text>
              {' '}at <Text style={{fontWeight: 'bold'}}>{habitatType}</Text>.
              {'\n\n'}This will save to the database and sync with the server.
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                onPress={() => setShowSubmitConfirm(false)}
                style={styles.confirmCancelBtn}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitSurvey} style={styles.confirmSubmitBtn}>
                <Icon name="check" size={16} color="#FFFFFF" />
                <Text style={styles.confirmSubmitText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isSubmitting && (
        <Modal visible={isSubmitting} transparent animationType="fade">
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={GREEN} />
              <Text style={styles.loadingText}>Submitting survey...</Text>
              <Text style={styles.loadingSubtext}>Please wait while we save your data</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );

  // ========================================
  // MAIN RENDER
  // ========================================
  return (
    <View style={styles.safeArea}>
      {/* Green Header */}
      <View style={styles.greenHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBackBtn}>
          <Icon name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{stepTitles[currentStep]}</Text>
        <Text style={styles.headerStep}>{currentStep + 1}/3</Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {[0, 1, 2].map(step => (
          <View key={step} style={styles.stepRow}>
            <View style={[styles.stepDot, currentStep >= step && styles.stepDotActive]} />
            {step < 2 && <View style={[styles.stepLine, currentStep > step && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {currentStep === 0 && renderStepOne()}
        {currentStep === 1 && renderStepTwo()}
        {currentStep === 2 && renderStepThree()}
      </ScrollView>
    </View>
  );
};

export default BirdSurveyForm;

// ========================================
// STYLES: Bird Observation Card
// ========================================
const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginVertical: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#E8F5E9',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GREEN,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteBtn: {
    marginLeft: 15,
    padding: 4,
  },
  cardBody: {
    padding: 12,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  placeholderStyle: {fontSize: 16, color: 'gray'},
  selectedTextStyle: {fontSize: 16, color: '#333'},
  inputSearchStyle: {height: 40, fontSize: 16, color: 'black'},
  iconStyle: {width: 20, height: 20},
  txtInputOutline: {borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0'},
  textInput: {marginBottom: 10, backgroundColor: 'white'},
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  itemSelected: {backgroundColor: '#E8F5E9'},
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  photoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
  speciesDropdownItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 10,
  },
  speciesCommon: {
    color: '#333',
    fontSize: 15,
  },
  speciesScientific: {
    color: '#666',
    fontSize: 13,
    fontStyle: 'italic',
  },
});

// ========================================
// STYLES: Main Form
// ========================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  greenHeader: {
    backgroundColor: GREEN,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBackBtn: {
    marginRight: 15,
    padding: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  headerStep: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  stepDotActive: {
    backgroundColor: GREEN,
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  stepLineActive: {
    backgroundColor: GREEN,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.15, shadowRadius: 8},
      android: {elevation: 6},
    }),
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  formDropdown: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  dropdownFocused: {
    borderColor: GREEN,
  },
  formInput: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  inputOutline: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  placeholderStyle: {fontSize: 16, color: 'gray'},
  selectedTextStyle: {fontSize: 16, color: 'black'},
  inputSearchStyle: {height: 40, fontSize: 16, color: 'black'},
  iconStyle: {width: 20, height: 20},
  dateTimeInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 12,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
  nextButton: {
    width: '100%',
    marginTop: 16,
    borderRadius: 25,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Team Members
  teamInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  teamInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    marginRight: 10,
  },
  teamClearButton: {
    position: 'absolute',
    right: 70,
    padding: 5,
    zIndex: 1,
  },
  teamAddButton: {
    backgroundColor: GREEN,
    padding: 12,
    borderRadius: 8,
  },
  editingHint: {
    fontSize: 12,
    color: GREEN,
    fontStyle: 'italic',
    marginTop: -10,
    marginBottom: 10,
  },
  teamList: {
    width: '100%',
  },
  teamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  teamItemEditing: {
    backgroundColor: '#FFF9C4',
    borderLeftWidth: 3,
    borderLeftColor: GREEN,
    paddingLeft: 10,
  },
  teamItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  teamActions: {
    flexDirection: 'row',
  },
  teamActionBtn: {
    marginLeft: 10,
    padding: 5,
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  // Bird Section
  addBirdButton: {
    borderRadius: 8,
    marginTop: 10,
  },
  submitButton: {
    borderRadius: 8,
    marginBottom: 30,
  },
  // Summary Card
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: GREEN,
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4},
      android: {elevation: 4},
    }),
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginRight: 4,
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 8,
  },
  // Submit Row
  submitRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 30,
    gap: 12,
  },
  backStepButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: GREEN,
    backgroundColor: '#FFFFFF',
  },
  backStepText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: GREEN,
    marginLeft: 8,
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: GREEN_DARK,
    elevation: 3,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  // Confirm Modal
  confirmModal: {
    width: '85%' as any,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center' as const,
  },
  confirmIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center' as const,
    lineHeight: 20,
  },
  confirmButtons: {
    flexDirection: 'row' as const,
    marginTop: 20,
    gap: 12,
    width: '100%' as any,
  },
  confirmCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DDD',
    alignItems: 'center' as const,
  },
  confirmCancelText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#777',
  },
  confirmSubmitBtn: {
    flex: 1,
    flexDirection: 'row' as const,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: GREEN_DARK,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
  },
  confirmSubmitText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  // Loading Overlay
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center' as const,
    width: '75%' as any,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#333',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
    textAlign: 'center' as const,
  },
  // Modals
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
  modalButton: {
    width: '100%',
    marginTop: 15,
    borderRadius: 25,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});