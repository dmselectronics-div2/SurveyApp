import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Appearance,
  Platform,
  ActivityIndicator,
  ImageBackground,
  Modal as RNModal,
  Image,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {
  TextInput,
  Button,
  Provider as PaperProvider,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import GetLocation from 'react-native-get-location';
import { Dimensions } from 'react-native';
import { API_URL } from '../../config';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import SQLite from 'react-native-sqlite-storage';
import { Modal, FlatList } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// Define habitat type constants for consistency and to prevent errors
const HABITAT_TYPES = {
  PRISTINE: 'Pristine mangroves',
  DEGRADED: 'Degraded mangroves',
  RESTORED: 'Restored mangroves',
  CONTROL: 'Control',
  CONTROL_AREA: 'Control Area',
  OTHER: 'Other'
};

// Initialize the database connection
const db = SQLite.openDatabase(
  {
    name: 'gastropodData.db',
    location: 'default',
  },
  () => console.log('Database opened successfully'),
  error => console.error('Error opening database:', error)
);

const { width } = Dimensions.get('window');

// Dropdown options based on PDF structure
const timeOfDayOptions = [
  { label: 'Morning', value: 'Morning' },
  { label: 'Noon', value: 'Noon' },
  { label: 'Evening', value: 'Evening' },
  { label: 'Night', value: 'Night' },
];

const locationOptions = [
  { label: 'Anawilundawa', value: 'Anawilundawa' },
  { label: 'Pubudugama', value: 'Pubudugama' },
  { label: 'Other', value: 'Other' },
];

const weatherOptions = [
  { label: 'Extremely Dry Weather', value: 'Extreamely Dry Weather' },
  { label: 'Dry', value: 'Dry' },
  { label: 'Wet', value: 'Wet' },
  { label: 'Extremely Wet', value: 'Extreamely Wet' },
  { label: 'Remark', value: 'Remark' },
];

const samplingLayerOptions = [
  { label: 'Epifauna', value: 'Epifauna' },
  { label: 'Infauna', value: 'Infauna' },

];

const samplingMethodOptions = {
  'Epifauna': [
    { label: 'Quadrat Sampling', value: 'Quadrat Sampling' },
    { label: 'Transect Sampling', value: 'Transect Sampling' },
    { label: 'Peterson Grab sampling', value: 'Peterson Grab sampling' },
  ],
  'Infauna': [
    { label: 'Soil core sampling', value: 'Soil core sampling' },
  ],

};

const quadratLocationOptions = [
  { label: 'Main Canel', value: 'Main Canel' },
  { label: 'Sub Canel', value: 'Sub Canel' },
  { label: 'Land Area', value: 'Land Area' },
  { label: 'Control Area', value: 'Control Area' },
  { label: 'Other', value: 'Other' },
];

const habitatTypeOptions = [
  { label: 'Pristine mangroves', value: HABITAT_TYPES.PRISTINE },
  { label: 'Degraded mangroves', value: HABITAT_TYPES.DEGRADED },
  { label: 'Restored mangroves', value: HABITAT_TYPES.RESTORED },
  { label: 'Control', value: HABITAT_TYPES.CONTROL },
  { label: 'Control Area', value: HABITAT_TYPES.CONTROL_AREA },
  { label: 'Other', value: HABITAT_TYPES.OTHER },
];

const vegetationOptions = [
  { label: 'Mature mixed mangroves', value: 'Mature mixed mangroves' },
  { label: 'Avicennia sp.dominant mature mangroves', value: 'dominant mature mangroves' },
  { label: 'Rhizophora sp.dominant mature mangroves', value: 'dominant mature mangroves ' },
  { label: 'Mixed saplings below 5m restored ', value: ' Mixed saplings below 5m restored ' },
  { label: 'Avicennia sp.saplings below 5m restored ', value: ' saplings below 5m restored ' },
  { label: 'Rhizophora sp. saplings below 5m restored', value: ' saplings below 5m restored' },
  { label: 'Mixed seedlings below 1 m restored ', value: ' Mixed seedlings below 1 m restored ' },
  { label: 'Avicennia sp. dominant seedlings below 1m restored ', value: 'Avicennia sp. dominant seedlings below 1m restored ' },
  { label: 'Rhizophora dominant seedlings below 1m restored', value: 'Rhizophora dominant seedlings below 1m restored' },
  { label: 'Salt marsh Vegetation', value: 'Salt marsh Vegetation' },
  { label: 'Barren Land', value: 'Barren Land' },
  { label: 'Grassland', value: 'Grassland' },
  { label: 'Other', value: 'Other' },
];

const microhabitatOptions = [
  { label: 'Shallow water sandy bottom', value: 'Shallow water sandy bottom' },
  { label: 'Shallow water mud bottom', value: 'Shallow water mud bottom' },
  { label: 'Shallow water leaf litter bottom', value: 'Shallow water leaf litter bottom' },
  { label: 'Semi dry leaf litter', value: 'Semi dry leaf litterght' },
  { label: 'Mud flat wet', value: 'Mud flat wet' },
  { label: 'Mud flat dry', value: 'Mud flat dry' },
  { label: 'Sandy flat', value: 'Sandy flat' },
  { label: 'Mangrove tree (pneumataphores, parts, stems, leaves, roots)', value: 'Mangrove tree (pneumataphores, parts, stems, leaves, roots)' },
  { label: 'Grassy area', value: 'Grassy area' },
  { label: 'Parts of mangroves with mud', value: 'Parts of mangroves with mud' },
  { label: 'Parts of mangroves with sand', value: 'Parts of mangroves with sand' },
  { label: 'Other', value: 'Other' },
];

const yesNoOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

const waterStatusOptions = [
  { label: 'Very Clear', value: 'Very Clear' },
  { label: 'Partially Clear', value: 'Partially Clear' },
  { label: 'Murky', value: 'Murky' },
];

// List of gastropod and bivalve species from the PDF
const gastropodSpecies = [
  { id: 'ellobium_gangeticum_eg', name: 'Ellobium gangeticum (EG)' },
  { id: 'melampus_ceylonicus_mc', name: 'Melampus ceylonicus (MC)' },
  { id: 'melampus_fasciatus_mf', name: 'Melampus fasciatus (MF)' },
  { id: 'pythia_plicata_pp', name: 'Pythia plicata (PP)' },
  { id: 'littoraria_scabra_lc', name: 'Littoraria scabra (LC)' },
  { id: 'nerita_polita_np', name: 'Nerita polita (NP)' },
  { id: 'Cerithidea_quoyii_cq', name: 'Cerithidea quoyii (CQ)' },
  { id: 'pirenella_cingulata_pc1', name: 'Pirenella cingulata (PC1)' },
  { id: 'pirinella_conica_pc2', name: 'Pirinella conica (PC2)' },
  { id: 'telescopium_telescopium_tr', name: 'Telescopium telescopium (TR)' },
  { id: 'terebralia_palustris_tp', name: 'Terebralia palustris (TP)' },
  { id: 'haminoea_crocata_hc', name: 'Haminoea crocata (HC)' },
  { id: 'faunus_ater_fa', name: 'Faunus ater (FA)' },
  { id: 'Meiniplotia_scabra_ms3', name: 'Meiniplotia Scabra (MS3)' },
  { id: 'Meretrix_casta_MC ', name: 'Meretrix_casta (MC)' },
  { id: 'Gelonia_Coaxons_GC', name: 'Gelonia Coaxons (GC)' },
  { id: 'Magallana_belcheri_MB1', name: 'Magallana belcheri (MB1)' },
  { id: 'Magallana_bilineata_MB2', name: 'Magallana bilineata (MB2)' },
  { id: 'Saccostra_Scyphophilla_SS', name: 'Saccostra Scyphophilla (SS)' },
  { id: 'Saccostra_cucullata_SC', name: 'Saccostra cucullata (SC)' },
  { id: 'Martesia_striata_MS1', name: 'Martesia striata (MS1)' },
  { id: 'Barnacle_sp_B', name: 'Barnacle sp.(B)' },
  { id: 'Mytella_strigata_MS2', name: 'Mytella strigata (MS2)' },

];

const bivalveSpecies = [
  { id: 'corbicula_solida_cs', name: 'Corbicula solida (CS)' },
  { id: 'meretrix_casta_mc', name: 'Meretrix casta (MC)' },
  { id: 'gelonia_coaxans_gc', name: 'Gelonia coaxans (GC)' },
  { id: 'magallana_belcheri_mb1', name: 'Magallana belcheri (MB1)' },
  { id: 'magallana_bilineata_mb2', name: 'Magallana bilineata (MB2)' },
  { id: 'saccostrea_scyphophilla_ss', name: 'Saccostrea scyphophilla (SS)' },
  { id: 'saccostrea_cucullata_sc', name: 'Saccostrea cucullata (SC)' },
  { id: 'martesia_striata_ms', name: 'Martesia striata (MS)' },
  { id: 'ballanus_sp_b', name: 'Ballanus sp. (B)' },
];

const GastropodBivalveForm = () => {
  // Theme state
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  // State for loading and network
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // State for basic information
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [teamMembers, setTeamMembers] = useState('');
  const [timeOfDataCollection, setTimeOfDataCollection] = useState(null);
  const [isTimeOfDataFocused, setIsTimeOfDataFocused] = useState(false);

  // State for high tide time and sampling time
  const [nearestHighTideTime, setNearestHighTideTime] = useState(new Date());
  const [showHighTidePicker, setShowHighTidePicker] = useState(false);
  const [timeOfSampling, setTimeOfSampling] = useState(new Date());
  const [showSamplingTimePicker, setShowSamplingTimePicker] = useState(false);

  // Location state
  const [location, setLocation] = useState(null);
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Weather state
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [isWeatherFocused, setIsWeatherFocused] = useState(false);
  const [weatherRemark, setWeatherRemark] = useState('');

  // Sampling layer and method state
  const [samplingLayer, setSamplingLayer] = useState(null);
  const [isSamplingLayerFocused, setIsSamplingLayerFocused] = useState(false);
  const [samplingMethod, setSamplingMethod] = useState(null);
  const [isSamplingMethodFocused, setIsSamplingMethodFocused] = useState(false);

  // Quadrat information (for Quadrat sampling)
  const [quadratId, setQuadratId] = useState('');
  const [quadratObservedBy, setQuadratObservedBy] = useState('');
  const [dataEnteredBy, setDataEnteredBy] = useState('');
  const [quadratSize, setQuadratSize] = useState('');
  const [quadratLocation, setQuadratLocation] = useState(null);
  const [isQuadratLocationFocused, setIsQuadratLocationFocused] = useState(false);
  const [customQuadratLocation, setCustomQuadratLocation] = useState('');

  // Transect information (for Transect sampling)
  const [transectId, setTransectId] = useState('');
  const [transectObservedBy, setTransectObservedBy] = useState('');
  const [transectDataEnteredBy, setTransectDataEnteredBy] = useState('');
  const [transectSize, setTransectSize] = useState('');
  const [transectLatitude, setTransectLatitude] = useState('');
  const [transectLongitude, setTransectLongitude] = useState('');
  const [endPointLatitude, setEndPointLatitude] = useState('');
  const [endPointLongitude, setEndPointLongitude] = useState('');

  // Peterson Grab information (for Peterson Grab sampling)
  const [grabId, setGrabId] = useState('');
  const [grabObservedBy, setGrabObservedBy] = useState('');
  const [grabDataEnteredBy, setGrabDataEnteredBy] = useState('');
  const [grabSize, setGrabSize] = useState('');
  const [grabLatitude, setGrabLatitude] = useState('');
  const [grabLongitude, setGrabLongitude] = useState('');

  // Soil Core information (for Soil core sampling)
  const [coreId, setCoreId] = useState('');
  const [coreObservedBy, setCoreObservedBy] = useState('');
  const [coreDataEnteredBy, setCoreDataEnteredBy] = useState('');
  const [coreDepth, setCoreDepth] = useState('');
  const [sieveSize, setSieveSize] = useState('');
  const [coreLatitude, setCoreLatitude] = useState('');
  const [coreLongitude, setCoreLongitude] = useState('');

  // Habitat information
  const [habitatType, setHabitatType] = useState(null);
  const [isHabitatTypeFocused, setIsHabitatTypeFocused] = useState(false);
  const [customHabitatType, setCustomHabitatType] = useState('');
  const [restorationYear, setRestorationYear] = useState('');

  // Vegetation information
  const [vegetation, setVegetation] = useState(null);
  const [isVegetationFocused, setIsVegetationFocused] = useState(false);
  const [customVegetation, setCustomVegetation] = useState('');

  // Microhabitat information
  const [microhabitat, setMicrohabitat] = useState(null);
  const [isMicrohabitatFocused, setIsMicrohabitatFocused] = useState(false);
  const [customMicrohabitat, setCustomMicrohabitat] = useState('');

  // Species clumping information
  const [speciesClumped, setSpeciesClumped] = useState(null);
  const [isSpeciesClumpedFocused, setIsSpeciesClumpedFocused] = useState(false);
  const [species_seen_clumped_what, setSpeciesSeenClumpedWhat] = useState('');
  const [clumpedSpeciesName, setClumpedSpeciesName] = useState('');
  const [clumpedWhere, setClumpedWhere] = useState('');
  const [clumpedCount, setClumpedCount] = useState('');

  // Species on objects above soil
  const [speciesOnRoot, setSpeciesOnRoot] = useState(null);
  const [isSpeciesOnRootFocused, setIsSpeciesOnRootFocused] = useState(false);
  const [speciesOnRootWhere, setSpeciesOnRootWhere] = useState('');
  const [speciesOnRootWhat, setSpeciesOnRootWhat] = useState('');

  // Water information
  const [isInWater, setIsInWater] = useState(null);
  const [isInWaterFocused, setIsInWaterFocused] = useState(false);
  const [waterStatus, setWaterStatus] = useState(null);
  const [isWaterStatusFocused, setIsWaterStatusFocused] = useState(false);
  const [waterDepth, setWaterDepth] = useState('');

  // Species counts (dynamically generated)
  const [speciesCounts, setSpeciesCounts] = useState({});

  // Add these to your state variables
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [yearPickerDate, setYearPickerDate] = useState(new Date());

  // Image upload state
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  // Notes and remarks state
  const [remark, setRemark] = useState('');
  const [text, setText] = useState('');
  const [content, setContent] = useState([]);

  // Error state
  const [errors, setErrors] = useState({});

  // Navigation
  const navigation = useNavigation();

  // Handle date picker change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // Handle high tide time picker change
  const handleHighTideTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || nearestHighTideTime;
    setShowHighTidePicker(Platform.OS === 'ios');
    setNearestHighTideTime(currentTime);
  };

  // Handle sampling time picker change
  const handleSamplingTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || timeOfSampling;
    setShowSamplingTimePicker(Platform.OS === 'ios');
    setTimeOfSampling(currentTime);
  };

  // Handle species count change
  const handleSpeciesCountChange = (id, count) => {
    setSpeciesCounts({
      ...speciesCounts,
      [id]: count
    });
  };

  // Validate numeric input for grab size
  const validateNumericInput = (value, setter) => {
    // Only allow digits and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  // Validate integer input for core depth and sieve size
  const validateIntegerInput = (value, setter) => {
    // Only allow digits (no decimal point)
    if (value === '' || /^\d*$/.test(value)) {
      setter(value);
    }
  };

  // Add text to notes
  const addText = () => {
    if (text.trim()) {
      setContent([...content, { type: 'text', text }]);
      setRemark(prevRemark => prevRemark + text + "\n");
      setText('');
    }
  };

  // Add camera image to notes
  const openCamera1 = () => {
    launchCamera({ mediaType: 'photo', quality: 1 }, response => {
      if (response.assets) {
        const uri = response.assets[0].uri;
        setContent([...content, { type: 'image', uri }]);
        setRemark(prevRemark => prevRemark + `Image URI: ${uri}\n`);
      }
    });
  };

  // Add gallery image to notes
  const openGallery1 = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
      if (response.assets) {
        const uri = response.assets[0].uri;
        setContent([...content, { type: 'image', uri }]);
        setRemark(prevRemark => prevRemark + `Image URI: ${uri}\n`);
      }
    });
  };

  const handleChoosePhoto = () => {
    Alert.alert(
      'Change Image',
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
    launchCamera({
      mediaType: 'photo',
      quality: 1,
    }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  // Get device location
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
          setTransectLatitude(location.latitude.toString());
          setTransectLongitude(location.longitude.toString());
          setGrabLatitude(location.latitude.toString());
          setGrabLongitude(location.longitude.toString());
          setCoreLatitude(location.latitude.toString());
          setCoreLongitude(location.longitude.toString());
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
        });
    };

    requestLocationPermission();
  }, []);

  // Theme change listener
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  // Network connectivity listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Initialize database tables on component mount
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS pending_submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          data TEXT NOT NULL,
          timestamp INTEGER NOT NULL
        );`,
        [],
        () => console.log('Pending submissions table created successfully'),
        error => console.error('Error creating table:', error)
      );
    });
  }, []);

  const isDarkMode = theme === 'dark';

  // Store failed submission to SQLite for later synchronization
  const storeFailedSubmission = (formData) => {
    const timestamp = Date.now();

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO pending_submissions (data, timestamp) VALUES (?, ?)',
        [JSON.stringify(formData), timestamp],
        () => {
          console.log('Submission stored locally');
          Alert.alert(
            'Offline Mode',
            'Data has been saved locally and will be submitted when connection is restored.',
            [{ text: 'OK', onPress: () => resetForm() }]
          );
        },
        error => {
          console.error('Error storing submission:', error);
          Alert.alert('Error', 'Failed to store data locally.');
        }
      );
    });
  };

  // Helper function to convert empty values to "N/A"
  const convertEmptyToNA = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return value;
  };

  // Form validation
  const validateForm = () => {
    let newErrors = {};

    // Validate required fields
    if (!date) newErrors.date = 'Date is required';
    if (!teamMembers) newErrors.teamMembers = 'Team members are required';
    if (!timeOfDataCollection) newErrors.timeOfDataCollection = 'Time of data collection is required';
    if (!location) newErrors.location = 'Location is required';
    if (location === 'Other' && !customLocation) newErrors.customLocation = 'Custom location is required';
    if (!weatherCondition) newErrors.weatherCondition = 'Weather condition is required';
    if (weatherCondition === 'Remark' && !weatherRemark) newErrors.weatherRemark = 'Weather remark is required';
    if (!samplingLayer) newErrors.samplingLayer = 'Sampling layer is required';
    if (!samplingMethod) newErrors.samplingMethod = 'Sampling method is required';

    // Validate sampling method specific information
    if (samplingMethod === 'Quadrat Sampling') {
      if (!quadratId) newErrors.quadratId = 'Quadrat ID is required';
      if (!quadratObservedBy) newErrors.quadratObservedBy = 'Observer name is required';
      if (!dataEnteredBy) newErrors.dataEnteredBy = 'Data entry person is required';
      if (!quadratSize) newErrors.quadratSize = 'Quadrat size is required';
      if (!quadratLocation) newErrors.quadratLocation = 'Quadrat location is required';
      if (quadratLocation === 'Other' && !customQuadratLocation)
        newErrors.customQuadratLocation = 'Custom quadrat location is required';
    }

    // Validate Transect information if Transect sampling selected
    if (samplingMethod === 'Transect Sampling') {
      if (!transectId) newErrors.transectId = 'Transect ID is required';
      if (!transectObservedBy) newErrors.transectObservedBy = 'Observer name is required';
      if (!transectDataEnteredBy) newErrors.transectDataEnteredBy = 'Data entry person is required';
      if (!transectSize) newErrors.transectSize = 'Transect length is required';
      if (!quadratLocation) newErrors.quadratLocation = 'Transect location is required';
      if (quadratLocation === 'Other' && !customQuadratLocation)
        newErrors.customQuadratLocation = 'Custom transect location is required';
    }

    // Validate Peterson Grab information if Peterson Grab sampling selected
    if (samplingMethod === 'Peterson Grab sampling') {
      if (!grabId) newErrors.grabId = 'Sample ID is required';
      if (!grabObservedBy) newErrors.grabObservedBy = 'Observer name is required';
      if (!grabDataEnteredBy) newErrors.grabDataEnteredBy = 'Data entry person is required';
      if (!grabSize) newErrors.grabSize = 'Grab sampler size is required';
      if (!quadratLocation) newErrors.quadratLocation = 'Sample location is required';
      if (quadratLocation === 'Other' && !customQuadratLocation)
        newErrors.customQuadratLocation = 'Custom sample location is required';


    }

    // Validate Soil Core information if Soil core sampling selected
    if (samplingMethod === 'Soil core sampling') {
      if (!coreId) newErrors.coreId = 'Core ID is required';
      if (!coreObservedBy) newErrors.coreObservedBy = 'Observer name is required';
      if (!coreDataEnteredBy) newErrors.coreDataEnteredBy = 'Data entry person is required';
      if (!coreDepth) newErrors.coreDepth = 'Core depth is required';
      if (!sieveSize) newErrors.sieveSize = 'Sieve size is required';
      if (!quadratLocation) newErrors.quadratLocation = 'Sample location is required';
      if (quadratLocation === 'Other' && !customQuadratLocation)
        newErrors.customQuadratLocation = 'Custom sample location is required';
    }

    // Validate habitat information
    if (!habitatType) newErrors.habitatType = 'Habitat type is required';
    if (habitatType === HABITAT_TYPES.RESTORED && !restorationYear) newErrors.restorationYear = 'Restoration year is required';

    // Validate vegetation information
    if (!vegetation) newErrors.vegetation = 'Vegetation is required';
    if (vegetation === 'Other' && !customVegetation) newErrors.customVegetation = 'Custom vegetation is required';

    // Validate microhabitat information
    if (!microhabitat) newErrors.microhabitat = 'Microhabitat is required';
    if (microhabitat === 'Other' && !customMicrohabitat)
      newErrors.customMicrohabitat = 'Custom microhabitat is required';

    // Validate species clumping
    if (!speciesClumped) newErrors.speciesClumped = 'Species clumping information is required';
    if (speciesClumped === 'Yes' && (!species_seen_clumped_what || !clumpedSpeciesName || !clumpedWhere || !clumpedCount)) {
      if (!species_seen_clumped_what) newErrors.speciesSeenClumpedWhat = 'Species clumped information is required';
      if (!clumpedSpeciesName) newErrors.clumpedSpeciesName = 'Clumped species name is required';
      if (!clumpedWhere) newErrors.clumpedWhere = 'Clumping location is required';
      if (!clumpedCount) newErrors.clumpedCount = 'Number of individuals is required';
    }

    // Validate species on root
    if (!speciesOnRoot) newErrors.speciesOnRoot = 'Species on root information is required';
    if (speciesOnRoot === 'Yes' && (!speciesOnRootWhere || !speciesOnRootWhat)) {
      if (!speciesOnRootWhere) newErrors.speciesOnRootWhere = 'Location is required';
      if (!speciesOnRootWhat) newErrors.speciesOnRootWhat = 'Species name is required';
    }

    // Validate water information
    if (!isInWater) newErrors.isInWater = 'Water presence information is required';
    if (isInWater === 'Yes' && (!waterStatus || !waterDepth)) {
      if (!waterStatus) newErrors.waterStatus = 'Water status is required';
      if (!waterDepth) newErrors.waterDepth = 'Water depth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors in the form.');
      return;
    }

    console.log("Starting form submission process");
    setIsSubmitting(true);

    try {
      // Generate a unique survey number using timestamp
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const surveyNo = `${year}${month}${day}${hours}${minutes}${seconds}`;

      // Format time
      const formatTime = (date) => {
        if (!date) return 'N/A';
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      // Get species counts from the form - ensure all species fields are included
      const speciesCountsData = {};
      for (const species of [...gastropodSpecies, ...bivalveSpecies]) {
        speciesCountsData[species.id] = parseInt(speciesCounts[species.id], 10) || 0;
      }

      // Create the base data object with common fields
      let formData = {
        // Basic information - with exact field names from backend schema
        survey_no: surveyNo,
        select_date: date.toISOString(),
        teamMembers: convertEmptyToNA(teamMembers),
        time_of_data_collection: convertEmptyToNA(timeOfDataCollection),
        nearest_high_tide_time: formatTime(nearestHighTideTime),
        time_of_sampling: formatTime(timeOfSampling),
        samplingMethod: convertEmptyToNA(samplingMethod),
        SamplingLayer: convertEmptyToNA(samplingLayer),
        Location: location === 'Other' ? convertEmptyToNA(customLocation) : convertEmptyToNA(location),
        customLocation: convertEmptyToNA(customLocation),

        // Weather information
        selectedWeatherConditions: weatherCondition === 'Remark' ? convertEmptyToNA(weatherRemark) : convertEmptyToNA(weatherCondition),
        weatherRemark: convertEmptyToNA(weatherRemark),

        // Location and habitat information
        plot_habitat_type: habitatType === HABITAT_TYPES.OTHER ? convertEmptyToNA(customHabitatType) : convertEmptyToNA(habitatType),
        customHabitatType: convertEmptyToNA(customHabitatType),
        plot_vegetation: vegetation === 'Other' ? convertEmptyToNA(customVegetation) : convertEmptyToNA(vegetation),
        customVegetation: convertEmptyToNA(customVegetation),
        quadratLocation: quadratLocation === 'Other' ? convertEmptyToNA(customQuadratLocation) : convertEmptyToNA(quadratLocation),
        customQuadratLocation: convertEmptyToNA(customQuadratLocation),
        quadrat_microhabitat: microhabitat === 'Other' ? convertEmptyToNA(customMicrohabitat) : convertEmptyToNA(microhabitat),
        customMicrohabitat: convertEmptyToNA(customMicrohabitat),

        // Species clumping information
        species_seen_clumped: convertEmptyToNA(speciesClumped) || 'No',
        clumped_species: speciesClumped === 'Yes' ? [
          {
            species_seen_clumped_what: convertEmptyToNA(species_seen_clumped_what),
            clumped_species_name: convertEmptyToNA(clumpedSpeciesName),
            clumped_where: convertEmptyToNA(clumpedWhere),
            clumped_count: parseInt(clumpedCount, 10) || 0
          }
        ] : [],

        // Species on objects above soil information
        species_seen_on_root: convertEmptyToNA(speciesOnRoot) || 'No',
        species_on_root_info: speciesOnRoot === 'Yes' ? [
          {
            species_on_root_where: convertEmptyToNA(speciesOnRootWhere),
            species_on_root_what: convertEmptyToNA(speciesOnRootWhat)
          }
        ] : [],

        // For backward compatibility, also include the individual fields
        clumped_species_name: speciesClumped === 'Yes' ? convertEmptyToNA(clumpedSpeciesName) : 'N/A',
        clumped_where: speciesClumped === 'Yes' ? convertEmptyToNA(clumpedWhere) : 'N/A',
        clumped_count: speciesClumped === 'Yes' ? (parseInt(clumpedCount, 10) || 0) : 0,
        species_on_root_where: speciesOnRoot === 'Yes' ? convertEmptyToNA(speciesOnRootWhere) : 'N/A',
        species_on_root_what: speciesOnRoot === 'Yes' ? convertEmptyToNA(speciesOnRootWhat) : 'N/A',

        // Water information
        is_in_water: convertEmptyToNA(isInWater) || 'No',
        water_status: (isInWater === 'Yes') ? convertEmptyToNA(waterStatus) : 'N/A',
        water_depth: (isInWater === 'Yes') ? (parseFloat(waterDepth) || 0) : 0,

        // Store restoration year if habitat type is Restored mangroves
        if_restored_year_of_restoration: habitatType === HABITAT_TYPES.RESTORED ? convertEmptyToNA(restorationYear) : 'N/A',

        // Notes and remarks
        remark: convertEmptyToNA(remark),
        imageUri: imageUri || '',
      };

      // Add all species counts
      const speciesDataObj = {};
      for (const species of gastropodSpecies) {
        speciesDataObj[species.id] = parseInt(speciesCounts[species.id], 10) || 0;
      }
      for (const species of bivalveSpecies) {
        speciesDataObj[species.id] = parseInt(speciesCounts[species.id], 10) || 0;
      }

      // Merge species data with form data
      formData = { ...formData, ...speciesDataObj };

      // Add method-specific fields
      if (samplingMethod === 'Quadrat Sampling') {
        formData = {
          ...formData,
          quadratId: convertEmptyToNA(quadratId),
          quadratObservedBy: convertEmptyToNA(quadratObservedBy),
          dataEnteredBy: convertEmptyToNA(dataEnteredBy),
          quadrat_size_m: parseInt(quadratSize, 10) || 0,
          area_of_quadrat_size: parseInt(quadratSize, 10) || 0,
          latitude: parseFloat(latitude) || 0,
          longitude: parseFloat(longitude) || 0,
        };
      } else if (samplingMethod === 'Transect Sampling') {
        formData = {
          ...formData,
          transectId: convertEmptyToNA(transectId),
          transectObservedBy: convertEmptyToNA(transectObservedBy),
          transectDataEnteredBy: convertEmptyToNA(transectDataEnteredBy),
          transectSize: parseFloat(transectSize) || 0,
          transectLatitude: parseFloat(transectLatitude) || 0,
          transectLongitude: parseFloat(transectLongitude) || 0,
          endPointLatitude: parseFloat(endPointLatitude) || 0,
          endPointLongitude: parseFloat(endPointLongitude) || 0,
          latitude: parseFloat(transectLatitude) || 0,
          longitude: parseFloat(transectLongitude) || 0,
        };
      } else if (samplingMethod === 'Peterson Grab sampling') {
        formData = {
          ...formData,
          grabId: convertEmptyToNA(grabId),
          grabObservedBy: convertEmptyToNA(grabObservedBy),
          grabDataEnteredBy: convertEmptyToNA(grabDataEnteredBy),
          grabSize: parseFloat(grabSize) || 0,
          grabLatitude: parseFloat(grabLatitude) || 0,
          grabLongitude: parseFloat(grabLongitude) || 0,
          latitude: parseFloat(grabLatitude) || 0,
          longitude: parseFloat(grabLongitude) || 0,
        };
      } else if (samplingMethod === 'Soil core sampling') {
        formData = {
          ...formData,
          coreId: convertEmptyToNA(coreId),
          coreObservedBy: convertEmptyToNA(coreObservedBy),
          coreDataEnteredBy: convertEmptyToNA(coreDataEnteredBy),
          coreDepth: parseInt(coreDepth, 10) || 0,
          sieveSize: parseInt(sieveSize, 10) || 0,
          coreLatitude: parseFloat(coreLatitude) || 0,
          coreLongitude: parseFloat(coreLongitude) || 0,
          latitude: parseFloat(coreLatitude) || 0,
          longitude: parseFloat(coreLongitude) || 0,
        };
      }

      console.log('Form data prepared:', JSON.stringify(formData, null, 2));

      if (!isConnected) {
        storeFailedSubmission(formData);
        setIsSubmitting(false);
        return;
      }

      console.log(`Sending POST request to ${API_URL}/submit-bivalvi-form`);
      const response = await axios.post(`${API_URL}/submit-bivalvi-form`, formData);
      console.log('API response:', JSON.stringify(response.data, null, 2));

      // Upload image if available
      if (imageUri && response.data && response.data._id) {
        const uploadResponse = await uploadImageToServer(imageUri, response.data._id);
        console.log('Image upload response:', uploadResponse);
      }

      Alert.alert(
        'Success',
        'Form data submitted successfully!',
        [{
          text: 'OK',
          onPress: () => {
            resetForm();
            navigation.navigate('MyDataTable');
          }
        }]
      );
    } catch (error) {
      console.error('Overall submission error:', error);

      if (error.response) {
        console.error('Response data:', error.response.data);
        Alert.alert('Server Error', JSON.stringify(error.response.data));
      } else if (error.request) {
        console.error('Request error:', error.request);
        if (error.message && error.message.includes('Network Error')) {
          storeFailedSubmission(formData);
        } else {
          Alert.alert('Request Error', 'No response received');
        }
      } else {
        Alert.alert('Error', error.message || 'Unknown error');
      }
    } finally {
      console.log("Submission process completed");
      setIsSubmitting(false);
    }
  };

  // Upload image to server - similar to bird survey functionality
  const uploadImageToServer = async (uri, addedId) => {
    console.log('Uploading image to server:', uri, addedId);
    if (!uri) {
      console.log('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', {
      uri,
      name: 'gastropodImage.jpg',
      type: 'image/jpeg',
    });

    formData.append('id', addedId);

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
        console.log('Image uploaded successfully:', data.filePath);
        return uploadPathToServer(data.filePath, addedId);
      } else {
        console.error('Upload failed:', responseText);
        Alert.alert('Error', 'Failed to upload image.');
        return false;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'An error occurred while uploading the image.');
      return false;
    }
  };

  // Update image path in database
  const uploadPathToServer = async (uri, addedId) => {
    console.log('Updating image path in database:', uri, addedId);

    try {
      const response = await axios.put(
        `${API_URL}/post-image-path-form/${addedId}`,
        {
          uri,
        },
      );

      if (response.data.status === 'ok') {
        console.log('Image path updated successfully');
        return true;
      } else {
        console.error('Image path update failed:');
        return false;
      }
    } catch (error) {
      console.error('Error updating image path:', error);
      return false;
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setTeamMembers('');
    setTimeOfDataCollection(null);
    setNearestHighTideTime(new Date());
    setTimeOfSampling(new Date());
    setLocation(null);
    setCustomLocation('');
    setWeatherCondition(null);
    setWeatherRemark('');
    setSamplingLayer(null);
    setSamplingMethod(null);

    setQuadratId('');
    setQuadratObservedBy('');
    setDataEnteredBy('');
    setQuadratSize('');
    setQuadratLocation(null);
    setCustomQuadratLocation('');

    setTransectId('');
    setTransectObservedBy('');
    setTransectDataEnteredBy('');
    setTransectSize('');
    setTransectLatitude('');
    setTransectLongitude('');
    setEndPointLatitude('');
    setEndPointLongitude('');

    setGrabId('');
    setGrabObservedBy('');
    setGrabDataEnteredBy('');
    setGrabSize('');
    setGrabLatitude('');
    setGrabLongitude('');

    setCoreId('');
    setCoreObservedBy('');
    setCoreDataEnteredBy('');
    setCoreDepth('');
    setSieveSize('');
    setCoreLatitude('');
    setCoreLongitude('');

    setHabitatType(null);
    setCustomHabitatType('');
    setRestorationYear('');
    setVegetation(null);
    setCustomVegetation('');
    setMicrohabitat(null);
    setCustomMicrohabitat('');

    setSpeciesClumped(null);
    setSpeciesSeenClumpedWhat('');
    setClumpedSpeciesName('');
    setClumpedWhere('');
    setClumpedCount('');
    setSpeciesOnRoot(null);
    setSpeciesOnRootWhere('');
    setSpeciesOnRootWhat('');

    setIsInWater(null);
    setWaterStatus(null);
    setWaterDepth('');

    setSpeciesCounts({});
    setRemark('');
    setText('');
    setContent([]);
    setImageUri(null);

    setErrors({});
  };

  return (
    <PaperProvider>
      {/* Loading overlay */}
      {isSubmitting && (
        <RNModal
          visible={true}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.modalText}>Submitting data...</Text>
            </View>
          </View>
        </RNModal>
      )}
      <ImageBackground
        source={require('../../assets/image/mangroveplace.jpg')}
        style={styles.backgroundImage}
      >
        <ScrollView style={styles.container}>
          {!isConnected && (
            <View style={styles.networkBanner}>
              <Icon name="wifi" size={16} color="#fff" />
              <Text style={styles.networkBannerText}>
                You are offline. Data will be saved locally and submitted when connection is restored.
              </Text>
            </View>
          )}

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Gastropod and Bivalve Data Collection</Text>

            {/* Basic Information Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              {/* Date Picker */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date</Text>
                <TouchableOpacity
                  style={[styles.dateInput, errors.date && styles.inputError]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {date ? date.toLocaleDateString() : 'Select Date'}
                  </Text>
                  <Icon name="calendar" size={20} color="#333" />
                </TouchableOpacity>
                {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              {/* Team Members */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Team Members</Text>
                <TextInput
                  style={[styles.textInput, errors.teamMembers && styles.inputError]}
                  value={teamMembers}
                  onChangeText={setTeamMembers}
                  placeholder="Enter team members"
                  multiline
                />
                {errors.teamMembers && <Text style={styles.errorText}>{errors.teamMembers}</Text>}
              </View>

              {/* Time of Data Collection */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Time of Data Collection</Text>
                <Dropdown
                  style={[styles.dropdown, isTimeOfDataFocused && styles.dropdownFocused, errors.timeOfDataCollection && styles.inputError]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={timeOfDayOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select time of day"
                  value={timeOfDataCollection}
                  onFocus={() => setIsTimeOfDataFocused(true)}
                  onBlur={() => setIsTimeOfDataFocused(false)}
                  onChange={item => {
                    setTimeOfDataCollection(item.value);
                    setIsTimeOfDataFocused(false);
                  }}
                />
                {errors.timeOfDataCollection && <Text style={styles.errorText}>{errors.timeOfDataCollection}</Text>}
              </View>

              {/* Nearest High Tide Time */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nearest High Tide Time</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowHighTidePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {nearestHighTideTime ? nearestHighTideTime.toLocaleTimeString('en-GB', { hour12: false }) : 'Select Time'}
                  </Text>
                  <Icon name="clock-o" size={20} color="#333" />
                </TouchableOpacity>
                {showHighTidePicker && (
                  <DateTimePicker
                    value={nearestHighTideTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleHighTideTimeChange}
                  />
                )}
              </View>

              {/* Time of Sampling */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Time of Sampling</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowSamplingTimePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {timeOfSampling ? timeOfSampling.toLocaleTimeString('en-GB', { hour12: false }) : 'Select Time'}
                  </Text>
                  <Icon name="clock-o" size={20} color="#333" />
                </TouchableOpacity>
                {showSamplingTimePicker && (
                  <DateTimePicker
                    value={timeOfSampling}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleSamplingTimeChange}
                  />
                )}
              </View>
            </View>

            {/* Location Information */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Location Information</Text>

              {/* Location */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location</Text>
                <Dropdown
                  style={[styles.dropdown, isLocationFocused && styles.dropdownFocused, errors.location && styles.inputError]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={locationOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select location"
                  value={location}
                  onFocus={() => setIsLocationFocused(true)}
                  onBlur={() => setIsLocationFocused(false)}
                  onChange={item => {
                    setLocation(item.value);
                    setIsLocationFocused(false);
                    if (item.value !== 'Other') {
                      setCustomLocation('');
                    }
                  }}
                />
                {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
              </View>

              {/* Custom Location (conditional) */}
              {location === 'Other' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Custom Location</Text>
                  <TextInput
                    style={[styles.textInput, errors.customLocation && styles.inputError]}
                    value={customLocation}
                    onChangeText={setCustomLocation}
                    placeholder="Enter custom location"
                  />
                  {errors.customLocation && <Text style={styles.errorText}>{errors.customLocation}</Text>}
                </View>
              )}
            </View>

            {/* Weather Information */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Weather Information</Text>

              {/* Weather Condition */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>General Weather during the Week</Text>
                <Dropdown
                  style={[styles.dropdown, isWeatherFocused && styles.dropdownFocused, errors.weatherCondition && styles.inputError]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={weatherOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select weather condition"
                  value={weatherCondition}
                  onFocus={() => setIsWeatherFocused(true)}
                  onBlur={() => setIsWeatherFocused(false)}
                  onChange={item => {
                    setWeatherCondition(item.value);
                    setIsWeatherFocused(false);
                    if (item.value !== 'Remark') {
                      setWeatherRemark('');
                    }
                  }}
                />
                {errors.weatherCondition && <Text style={styles.errorText}>{errors.weatherCondition}</Text>}
              </View>

              {/* Weather Remark (conditional) */}
              {weatherCondition === 'Remark' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Weather Remark</Text>
                  <TextInput
                    style={[styles.textInput, errors.weatherRemark && styles.inputError]}
                    value={weatherRemark}
                    onChangeText={setWeatherRemark}
                    placeholder="Enter weather remark"
                    multiline
                  />
                  {errors.weatherRemark && <Text style={styles.errorText}>{errors.weatherRemark}</Text>}
                </View>
              )}
            </View>

            {/* Sampling Information */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Sampling Information</Text>

              {/* Sampling Layer */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Sampling Layer</Text>
                <Dropdown
                  style={[styles.dropdown, isSamplingLayerFocused && styles.dropdownFocused, errors.samplingLayer && styles.inputError]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={samplingLayerOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select sampling layer"
                  value={samplingLayer}
                  onFocus={() => setIsSamplingLayerFocused(true)}
                  onBlur={() => setIsSamplingLayerFocused(false)}
                  onChange={item => {
                    setSamplingLayer(item.value);
                    setIsSamplingLayerFocused(false);
                    // Reset sampling method when layer changes
                    setSamplingMethod(null);
                  }}
                />
                {errors.samplingLayer && <Text style={styles.errorText}>{errors.samplingLayer}</Text>}
              </View>

              {/* Sampling Method (conditional based on layer) */}
              {samplingLayer && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Sampling Method</Text>
                  <Dropdown
                    style={[styles.dropdown, isSamplingMethodFocused && styles.dropdownFocused, errors.samplingMethod && styles.inputError]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={samplingMethodOptions[samplingLayer] || []}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select sampling method"
                    value={samplingMethod}
                    onFocus={() => setIsSamplingMethodFocused(true)}
                    onBlur={() => setIsSamplingMethodFocused(false)}
                    onChange={item => {
                      setSamplingMethod(item.value);
                      setIsSamplingMethodFocused(false);
                    }}
                  />
                  {errors.samplingMethod && <Text style={styles.errorText}>{errors.samplingMethod}</Text>}
                </View>
              )}
            </View>

            {/* Quadrat Information (conditional based on sampling method) */}
            {samplingMethod === 'Quadrat Sampling' && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Quadrat Information</Text>

                {/* Quadrat ID */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Quadrat ID</Text>
                  <TextInput
                    style={[styles.textInput, errors.quadratId && styles.inputError]}
                    value={quadratId}
                    onChangeText={setQuadratId}
                    placeholder="Enter quadrat ID"
                  />
                  {errors.quadratId && <Text style={styles.errorText}>{errors.quadratId}</Text>}
                </View>

                {/* Quadrat Observed By */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Quadrat Observed By</Text>
                  <TextInput
                    style={[styles.textInput, errors.quadratObservedBy && styles.inputError]}
                    value={quadratObservedBy}
                    onChangeText={setQuadratObservedBy}
                    placeholder="Enter observer name"
                  />
                  {errors.quadratObservedBy && <Text style={styles.errorText}>{errors.quadratObservedBy}</Text>}
                </View>

                {/* Data Entered By */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Data Entered By</Text>
                  <TextInput
                    style={[styles.textInput, errors.dataEnteredBy && styles.inputError]}
                    value={dataEnteredBy}
                    onChangeText={setDataEnteredBy}
                    placeholder="Enter data entry person"
                  />
                  {errors.dataEnteredBy && <Text style={styles.errorText}>{errors.dataEnteredBy}</Text>}
                </View>

                {/* Quadrat Size */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Size of the Quadrat (m)</Text>
                  <TextInput
                    style={[styles.textInput, errors.quadratSize && styles.inputError]}
                    value={quadratSize}
                    onChangeText={(value) => validateNumericInput(value, setQuadratSize)}
                    placeholder="Enter quadrat size"
                    keyboardType="numeric"
                  />
                  {errors.quadratSize && <Text style={styles.errorText}>{errors.quadratSize}</Text>}
                </View>

                {/* GPS Coordinates */}
                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, { flex: 1, marginRight: 5 }]}>
                    <Text style={styles.inputLabel}>Quadrat Latitude</Text>
                    <TextInput
                      style={styles.textInput}
                      value={latitude}
                      onChangeText={(value) => validateNumericInput(value, setLatitude)}
                      placeholder="Latitude"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.inputContainer, { flex: 1, marginLeft: 5 }]}>
                    <Text style={styles.inputLabel}>Quadrat Longitude</Text>
                    <TextInput
                      style={styles.textInput}
                      value={longitude}
                      onChangeText={(value) => validateNumericInput(value, setLongitude)}
                      placeholder="Longitude"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Transect Information (conditional based on sampling method) */}
            {samplingMethod === 'Transect Sampling' && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Transect Information</Text>

                {/* Transect ID */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Transect ID</Text>
                  <TextInput
                    style={[styles.textInput, errors.transectId && styles.inputError]}
                    value={transectId}
                    onChangeText={setTransectId}
                    placeholder="Enter transect ID"
                  />
                  {errors.transectId && <Text style={styles.errorText}>{errors.transectId}</Text>}
                </View>

                {/* Transect Observed By */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Transect Observed By</Text>
                  <TextInput
                    style={[styles.textInput, errors.transectObservedBy && styles.inputError]}
                    value={transectObservedBy}
                    onChangeText={setTransectObservedBy}
                    placeholder="Enter observer name"
                  />
                  {errors.transectObservedBy && <Text style={styles.errorText}>{errors.transectObservedBy}</Text>}
                </View>

                {/* Data Entered By */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Data Entered By</Text>
                  <TextInput
                    style={[styles.textInput, errors.transectDataEnteredBy && styles.inputError]}
                    value={transectDataEnteredBy}
                    onChangeText={setTransectDataEnteredBy}
                    placeholder="Enter data entry person"
                  />
                  {errors.transectDataEnteredBy && <Text style={styles.errorText}>{errors.transectDataEnteredBy}</Text>}
                </View>

                {/* Transect Size */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Length of the Transect (m)</Text>
                  <TextInput
                    style={[styles.textInput, errors.transectSize && styles.inputError]}
                    value={transectSize}
                    onChangeText={(value) => validateNumericInput(value, setTransectSize)}
                    placeholder="Enter transect size"
                    keyboardType="numeric"
                  />
                  {errors.transectSize && <Text style={styles.errorText}>{errors.transectSize}</Text>}
                </View>

                {/* Starting Point Coordinates */}
                <Text style={styles.subSectionTitle}>Starting Point Coordinates</Text>
                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, { flex: 1, marginRight: 5 }]}>
                    <Text style={styles.inputLabel}>Latitude</Text>
                    <TextInput
                      style={styles.textInput}
                      value={transectLatitude}
                      onChangeText={(value) => validateNumericInput(value, setTransectLatitude)}
                      placeholder="Latitude"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.inputContainer, { flex: 1, marginLeft: 5 }]}>
                    <Text style={styles.inputLabel}>Longitude</Text>
                    <TextInput
                      style={styles.textInput}
                      value={transectLongitude}
                      onChangeText={(value) => validateNumericInput(value, setTransectLongitude)}
                      placeholder="Longitude"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* End Point Coordinates */}
                <Text style={styles.subSectionTitle}>End Point Coordinates</Text>
                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, { flex: 1, marginRight: 5 }]}>
                    <Text style={styles.inputLabel}>Latitude</Text>
                    <TextInput
                      style={styles.textInput}
                      value={endPointLatitude}
                      onChangeText={setEndPointLatitude}
                      placeholder="Latitude"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.inputContainer, { flex: 1, marginLeft: 5 }]}>
                    <Text style={styles.inputLabel}>Longitude</Text>
                    <TextInput
                      style={styles.textInput}
                      value={endPointLongitude}
                      onChangeText={setEndPointLongitude}
                      placeholder="Longitude"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Peterson Grab Information (conditional based on sampling method) */}
            {samplingMethod === 'Peterson Grab sampling' && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Peterson Grab Information</Text>

                {/* Sample ID */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Sample ID</Text>
                  <TextInput
                    style={[styles.textInput, errors.grabId && styles.inputError]}
                    value={grabId}
                    onChangeText={setGrabId}
                    placeholder="Enter sample ID"
                  />
                  {errors.grabId && <Text style={styles.errorText}>{errors.grabId}</Text>}
                </View>

                {/* Sample Observed By */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Sample Observed By</Text>
                  <TextInput
                    style={[styles.textInput, errors.grabObservedBy && styles.inputError]}
                    value={grabObservedBy}
                    onChangeText={setGrabObservedBy}
                    placeholder="Enter observer name"
                  />
                  {errors.grabObservedBy && <Text style={styles.errorText}>{errors.grabObservedBy}</Text>}
                </View>

                {/* Data Entered By */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Data Entered By</Text>
                  <TextInput
                    style={[styles.textInput, errors.grabDataEnteredBy && styles.inputError]}
                    value={grabDataEnteredBy}
                    onChangeText={setGrabDataEnteredBy}
                    placeholder="Enter data entry person"
                  />
                  {errors.grabDataEnteredBy && <Text style={styles.errorText}>{errors.grabDataEnteredBy}</Text>}
                </View>

                {/* Grab Size */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Size of the Grab Sampler (cm²)</Text>
                  <TextInput
                    style={[styles.textInput, errors.grabSize && styles.inputError]}
                    value={grabSize}
                    onChangeText={(value) => validateNumericInput(value, setGrabSize)}
                    placeholder="Enter grab sampler size"
                    keyboardType="numeric"
                  />
                  {errors.grabSize && <Text style={styles.errorText}>{errors.grabSize}</Text>}
                </View>

                {/* Sampling Point Coordinates */}
                <Text style={styles.subSectionTitle}>Sampling Point Coordinates</Text>
                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, { flex: 1, marginRight: 5 }]}>
                    <Text style={styles.inputLabel}>Latitude</Text>
                    <TextInput
                      style={styles.textInput}
                      value={grabLatitude}
                      onChangeText={(value) => validateNumericInput(value, setGrabLatitude)}
                      placeholder="Latitude"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.inputContainer, { flex: 1, marginLeft: 5 }]}>
                    <Text style={styles.inputLabel}>Longitude</Text>
                    <TextInput
                      style={styles.textInput}
                      value={grabLongitude}
                      onChangeText={(value) => validateNumericInput(value, setGrabLongitude)}
                      placeholder="Longitude"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Soil Core Information (conditional based on sampling method) */}
            {samplingMethod === 'Soil core sampling' && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Soil Core Information</Text>

                {/* Core ID */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Core ID</Text>
                  <TextInput
                    style={[styles.textInput, errors.coreId && styles.inputError]}
                    value={coreId}
                    onChangeText={setCoreId}
                    placeholder="Enter core ID"
                  />
                  {errors.coreId && <Text style={styles.errorText}>{errors.coreId}</Text>}
                </View>

                {/* Core Observed By */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Core Observed By</Text>
                  <TextInput
                    style={[styles.textInput, errors.coreObservedBy && styles.inputError]}
                    value={coreObservedBy}
                    onChangeText={setCoreObservedBy}
                    placeholder="Enter observer name"
                  />
                  {errors.coreObservedBy && <Text style={styles.errorText}>{errors.coreObservedBy}</Text>}
                </View>

                {/* Data Entered By */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Data Entered By</Text>
                  <TextInput
                    style={[styles.textInput, errors.coreDataEnteredBy && styles.inputError]}
                    value={coreDataEnteredBy}
                    onChangeText={setCoreDataEnteredBy}
                    placeholder="Enter data entry person"
                  />
                  {errors.coreDataEnteredBy && <Text style={styles.errorText}>{errors.coreDataEnteredBy}</Text>}
                </View>

                {/* Core Depth */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Depth of the Core (cm)</Text>
                  <TextInput
                    style={[styles.textInput, errors.coreDepth && styles.inputError]}
                    value={coreDepth}
                    onChangeText={(value) => validateIntegerInput(value, setCoreDepth)}
                    placeholder="Enter core depth (integer only)"
                    keyboardType="numeric"
                  />
                  {errors.coreDepth && <Text style={styles.errorText}>{errors.coreDepth}</Text>}
                </View>

                {/* Sieve Size */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Size of the Sieve Set (mm)</Text>
                  <TextInput
                    style={[styles.textInput, errors.sieveSize && styles.inputError]}
                    value={sieveSize}
                    onChangeText={(value) => validateIntegerInput(value, setSieveSize)}
                    placeholder="Enter sieve size (integer only)"
                    keyboardType="numeric"
                  />
                  {errors.sieveSize && <Text style={styles.errorText}>{errors.sieveSize}</Text>}
                </View>

                {/* Sampling Point Coordinates */}
                <Text style={styles.subSectionTitle}>Sampling Point Coordinates</Text>
                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, { flex: 1, marginRight: 5 }]}>
                    <Text style={styles.inputLabel}>Latitude</Text>
                    <TextInput
                      style={styles.textInput}
                      value={coreLatitude}
                      onChangeText={(value) => validateNumericInput(value, setCoreLatitude)}
                      placeholder="Latitude"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.inputContainer, { flex: 1, marginLeft: 5 }]}>
                    <Text style={styles.inputLabel}>Longitude</Text>
                    <TextInput
                      style={styles.textInput}
                      value={coreLongitude}
                      onChangeText={(value) => validateNumericInput(value, setCoreLongitude)}
                      placeholder="Longitude"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Habitat Information */}
            {samplingMethod && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Habitat Information</Text>

                {/* Sampling Location */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{samplingMethod === 'Quadrat Sampling' ? 'Quadrat Location' :
                    samplingMethod === 'Transect Sampling' ? 'Transect Location' :
                      samplingMethod === 'Peterson Grab sampling' ? 'Sampling Point Location' :
                        'Sampling Point Location'}</Text>
                  <Dropdown
                    style={[styles.dropdown, isQuadratLocationFocused && styles.dropdownFocused, errors.quadratLocation && styles.inputError]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={quadratLocationOptions}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={`Select ${samplingMethod === 'Quadrat Sampling' ? 'quadrat' :
                      samplingMethod === 'Transect Sampling' ? 'transect' :
                        'sampling point'} location`}
                    value={quadratLocation}
                    onFocus={() => setIsQuadratLocationFocused(true)}
                    onBlur={() => setIsQuadratLocationFocused(false)}
                    onChange={item => {
                      setQuadratLocation(item.value);
                      setIsQuadratLocationFocused(false);
                      if (item.value !== 'Other') {
                        setCustomQuadratLocation('');
                      }
                    }}
                  />
                  {errors.quadratLocation && <Text style={styles.errorText}>{errors.quadratLocation}</Text>}
                </View>

                {/* Custom Location (conditional) */}
                {quadratLocation === 'Other' && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Other Location</Text>
                    <TextInput
                      style={[styles.textInput, errors.customQuadratLocation && styles.inputError]}
                      value={customQuadratLocation}
                      onChangeText={setCustomQuadratLocation}
                      placeholder="Type other location"
                    />
                    {errors.customQuadratLocation && <Text style={styles.errorText}>{errors.customQuadratLocation}</Text>}
                  </View>
                )}

                {/* Habitat Type */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Plot Habitat Type</Text>
                  <Dropdown
                    style={[styles.dropdown, isHabitatTypeFocused && styles.dropdownFocused, errors.habitatType && styles.inputError]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={habitatTypeOptions}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select habitat type"
                    value={habitatType}
                    onFocus={() => setIsHabitatTypeFocused(true)}
                    onBlur={() => setIsHabitatTypeFocused(false)}
                    onChange={item => {
                      setHabitatType(item.value);
                      setIsHabitatTypeFocused(false);
                      if (item.value !== 'Other') {
                        setCustomHabitatType('');
                      }
                      if (item.value !== HABITAT_TYPES.RESTORED) {
                        setRestorationYear('');
                      }
                    }}
                  />
                  {errors.habitatType && <Text style={styles.errorText}>{errors.habitatType}</Text>}
                </View>
                {/* Custom Habitat Type (conditional) */}
                {habitatType === 'Other' && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Custom Habitat Type</Text>
                    <TextInput
                      style={[styles.textInput, errors.customHabitatType && styles.inputError]}
                      value={customHabitatType}
                      onChangeText={setCustomHabitatType}
                      placeholder="Type other habitat type"
                    />
                    {errors.customHabitatType && <Text style={styles.errorText}>{errors.customHabitatType}</Text>}
                  </View>
                )}

                {habitatType === HABITAT_TYPES.RESTORED && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Year of Restoration</Text>
                    <TouchableOpacity
                      style={[
                        styles.dateInput,
                        errors.restorationYear && styles.inputError
                      ]}
                      onPress={() => setShowYearPicker(true)}
                    >
                      <Text style={styles.dateText}>
                        {restorationYear || 'Select Year of Restoration'}
                      </Text>
                      <Icon name="calendar" size={20} color="#333" />
                    </TouchableOpacity>
                    {errors.restorationYear && <Text style={styles.errorText}>{errors.restorationYear}</Text>}

                    {/* Custom Year Picker Modal */}
                    <Modal visible={showYearPicker} transparent animationType="slide">
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                          <FlatList
                            data={Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString())}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                onPress={() => {
                                  setRestorationYear(item); // Just use the year string directly
                                  setShowYearPicker(false);
                                }}
                                style={styles.yearOption}
                              >
                                <Text style={styles.yearText}>{item}</Text>
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      </View>
                    </Modal>
                  </View>
                )}

                {/* Vegetation */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Plot Vegetation</Text>
                  <Dropdown
                    style={[styles.dropdown, isVegetationFocused && styles.dropdownFocused, errors.vegetation && styles.inputError]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={vegetationOptions}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select vegetation"
                    value={vegetation}
                    onFocus={() => setIsVegetationFocused(true)}
                    onBlur={() => setIsVegetationFocused(false)}
                    onChange={item => {
                      setVegetation(item.value);
                      setIsVegetationFocused(false);
                      if (item.value !== 'Other') {
                        setCustomVegetation('');
                      }
                    }}
                  />
                  {errors.vegetation && <Text style={styles.errorText}>{errors.vegetation}</Text>}
                </View>

                {/* Custom Vegetation (conditional) */}
                {vegetation === 'Other' && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Custom Vegetation</Text>
                    <TextInput
                      style={[styles.textInput, errors.customVegetation && styles.inputError]}
                      value={customVegetation}
                      onChangeText={setCustomVegetation}
                      placeholder="Type other vegetation"
                    />
                    {errors.customVegetation && <Text style={styles.errorText}>{errors.customVegetation}</Text>}
                  </View>
                )}

                {/* Microhabitat */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Microhabitat</Text>
                  <Dropdown
                    style={[styles.dropdown, isMicrohabitatFocused && styles.dropdownFocused, errors.microhabitat && styles.inputError]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={microhabitatOptions}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select microhabitat"
                    value={microhabitat}
                    onFocus={() => setIsMicrohabitatFocused(true)}
                    onBlur={() => setIsMicrohabitatFocused(false)}
                    onChange={item => {
                      setMicrohabitat(item.value);
                      setIsMicrohabitatFocused(false);
                      if (item.value !== 'Other') {
                        setCustomMicrohabitat('');
                      }
                    }}
                  />
                  {errors.microhabitat && <Text style={styles.errorText}>{errors.microhabitat}</Text>}
                </View>

                {/* Custom Microhabitat (conditional) */}
                {microhabitat === 'Other' && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Other Microhabitat</Text>
                    <TextInput
                      style={[styles.textInput, errors.customMicrohabitat && styles.inputError]}
                      value={customMicrohabitat}
                      onChangeText={setCustomMicrohabitat}
                      placeholder="Type microhabitat"
                    />
                    {errors.customMicrohabitat && <Text style={styles.errorText}>{errors.customMicrohabitat}</Text>}
                  </View>
                )}
              </View>
            )}

            {/* Species Clumping Information */}
            {samplingMethod && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Species Clumping Information</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Species Clumped</Text>
                  <Dropdown
                    style={[styles.dropdown, isSpeciesClumpedFocused && styles.dropdownFocused, errors.speciesClumped && styles.inputError]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={yesNoOptions}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select option"
                    value={speciesClumped}
                    onFocus={() => setIsSpeciesClumpedFocused(true)}
                    onBlur={() => setIsSpeciesClumpedFocused(false)}
                    onChange={item => {
                      setSpeciesClumped(item.value);
                      setIsSpeciesClumpedFocused(false);
                      if (item.value === 'No') {
                        setSpeciesSeenClumpedWhat('');
                        setClumpedSpeciesName('');
                        setClumpedWhere('');
                        setClumpedCount('');
                      }
                    }}
                  />
                  {errors.speciesClumped && <Text style={styles.errorText}>{errors.speciesClumped}</Text>}
                </View>

                {speciesClumped === 'Yes' && (
                  <View style={styles.subSectionContainer}>
                    {/* Add the missing field first */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Species Observed Clumped</Text>
                      <TextInput
                        style={[styles.textInput, errors.speciesSeenClumpedWhat && styles.inputError]}
                        value={species_seen_clumped_what}
                        onChangeText={setSpeciesSeenClumpedWhat}
                        placeholder="Enter species observed clumped"
                      />
                      {errors.speciesSeenClumpedWhat && <Text style={styles.errorText}>{errors.speciesSeenClumpedWhat}</Text>}
                    </View>

                    {/* Existing fields */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Clumped Species Name</Text>
                      <TextInput
                        style={[styles.textInput, errors.clumpedSpeciesName && styles.inputError]}
                        value={clumpedSpeciesName}
                        onChangeText={setClumpedSpeciesName}
                        placeholder="Enter species name"
                      />
                      {errors.clumpedSpeciesName && <Text style={styles.errorText}>{errors.clumpedSpeciesName}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Clumped Where</Text>
                      <TextInput
                        style={[styles.textInput, errors.clumpedWhere && styles.inputError]}
                        value={clumpedWhere}
                        onChangeText={setClumpedWhere}
                        placeholder="Enter clumping location"
                      />
                      {errors.clumpedWhere && <Text style={styles.errorText}>{errors.clumpedWhere}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Number of Individuals</Text>
                      <TextInput
                        style={[styles.textInput, errors.clumpedCount && styles.inputError]}
                        value={clumpedCount}
                        onChangeText={(value) => validateIntegerInput(value, setClumpedCount)}
                        placeholder="Enter count"
                        keyboardType="numeric"
                      />
                      {errors.clumpedCount && <Text style={styles.errorText}>{errors.clumpedCount}</Text>}
                    </View>
                  </View>
                )}

                {/* Species on Root */}

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Species Observed on Objects above the Soil Layer</Text>
                  <Dropdown
                    style={[styles.dropdown, isSpeciesOnRootFocused && styles.dropdownFocused, errors.speciesOnRoot && styles.inputError]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={yesNoOptions}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select option"
                    value={speciesOnRoot}
                    onFocus={() => setIsSpeciesOnRootFocused(true)}
                    onBlur={() => setIsSpeciesOnRootFocused(false)}
                    onChange={item => {
                      setSpeciesOnRoot(item.value);
                      setIsSpeciesOnRootFocused(false);
                      if (item.value === 'No') {
                        setSpeciesOnRootWhere('');
                        setSpeciesOnRootWhat('');
                      }
                    }}
                  />
                  {errors.speciesOnRoot && <Text style={styles.errorText}>{errors.speciesOnRoot}</Text>}
                </View>


                {speciesOnRoot === 'Yes' && (
                  <View style={styles.subSectionContainer}>
                    {/* Where */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Where</Text>
                      <TextInput
                        style={[styles.textInput, errors.speciesOnRootWhere && styles.inputError]}
                        value={speciesOnRootWhere}
                        onChangeText={setSpeciesOnRootWhere}
                        placeholder="Enter location"
                      />
                      {errors.speciesOnRootWhere && <Text style={styles.errorText}>{errors.speciesOnRootWhere}</Text>}
                    </View>


                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>What Species</Text>
                      <TextInput
                        style={[styles.textInput, errors.speciesOnRootWhat && styles.inputError]}
                        value={speciesOnRootWhat}
                        onChangeText={setSpeciesOnRootWhat}
                        placeholder="Enter species"
                      />
                      {errors.speciesOnRootWhat && <Text style={styles.errorText}>{errors.speciesOnRootWhat}</Text>}
                    </View>
                  </View>
                )}
              </View>
            )}


            {samplingMethod && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Water Information</Text>


                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    {samplingMethod === 'Quadrat Sampling' ? 'Does Quadrat Laid in Water' :
                      samplingMethod === 'Transect Sampling' ? 'Does Transect Laid in Water' :
                        samplingMethod === 'Peterson Grab sampling' ? 'Was Sample Taken in Water' :
                          'Was Sample Taken in Water'}
                  </Text>
                  <Dropdown
                    style={[styles.dropdown, isInWaterFocused && styles.dropdownFocused, errors.isInWater && styles.inputError]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={yesNoOptions}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select option"
                    value={isInWater}
                    onFocus={() => setIsInWaterFocused(true)}
                    onBlur={() => setIsInWaterFocused(false)}
                    onChange={item => {
                      setIsInWater(item.value);
                      setIsInWaterFocused(false);
                      if (item.value === 'No') {
                        setWaterStatus(null);
                        setWaterDepth('');
                      }
                    }}
                  />
                  {errors.isInWater && <Text style={styles.errorText}>{errors.isInWater}</Text>}
                </View>


                {isInWater === 'Yes' && (
                  <View style={styles.subSectionContainer}>
                    {/* Status of the Water */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Status of the Water</Text>
                      <Dropdown
                        style={[styles.dropdown, isWaterStatusFocused && styles.dropdownFocused, errors.waterStatus && styles.inputError]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={waterStatusOptions}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select water status"
                        value={waterStatus}
                        onFocus={() => setIsWaterStatusFocused(true)}
                        onBlur={() => setIsWaterStatusFocused(false)}
                        onChange={item => {
                          setWaterStatus(item.value);
                          setIsWaterStatusFocused(false);
                        }}
                      />
                      {errors.waterStatus && <Text style={styles.errorText}>{errors.waterStatus}</Text>}
                    </View>


                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Depth of the Water (cm)</Text>
                      <TextInput
                        style={[styles.textInput, errors.waterDepth && styles.inputError]}
                        value={waterDepth}
                        onChangeText={(value) => validateNumericInput(value, setWaterDepth)}
                        placeholder="Enter water depth"
                        keyboardType="numeric"
                      />
                      {errors.waterDepth && <Text style={styles.errorText}>{errors.waterDepth}</Text>}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Species Counts */}
            {samplingMethod && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Observed Species</Text>

                {/* Gastropods */}
                <Text style={styles.subSectionTitle}>Gastropods</Text>
                {gastropodSpecies.map((species) => (
                  <View key={species.id} style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{species.name}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={speciesCounts[species.id] || ''}
                      onChangeText={(text) => handleSpeciesCountChange(species.id, text)}
                      placeholder="Enter count"
                      keyboardType="numeric"
                    />
                  </View>
                ))}

                {/* Bivalves */}
                <Text style={styles.subSectionTitle}>Bivalves</Text>
                {bivalveSpecies.map((species) => (
                  <View key={species.id} style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{species.name}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={speciesCounts[species.id] || ''}
                      onChangeText={(text) => handleSpeciesCountChange(species.id, text)}
                      placeholder="Enter count"
                      keyboardType="numeric"
                    />
                  </View>
                ))}
                <Text
                  style={[
                    { marginTop: 10 },
                    { color: isDarkMode ? 'black' : 'black' },
                  ]}>
                  Upload a Photo
                </Text>
                <View style={styles.dropdownTreeremark}>
                  <View style={styles.contentContainer}>
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
                  </View>
                  <View style={styles.inputContainer}>



                    <View style={styles.inputContainer1}>
                      <TouchableOpacity onPress={openCamera1} style={styles.iconButton1}>
                        <Icon name="camera" size={18} color="black" />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={openGallery1} style={styles.iconButton2}>
                        <Icon name="image" size={18} color="black" />
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>


              </View>
            )}

            {/* Form Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={[styles.submitButton, { borderRadius: 6 }]}
                buttonColor="green"
                textColor="white"
                labelStyle={styles.button_label}
              >
                Submit
              </Button>
              <Button
                mode="outlined"
                onPress={resetForm}
                style={[styles.resetButton, { borderRadius: 6 }]}
                textColor="white"
                labelStyle={styles.button_label}
              >
                Reset
              </Button>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formTitle: {
    color: '#F2F2F2',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subSectionContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#555',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  dropdownFocused: {
    borderColor: '#2196F3',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#aaa',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dateInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  resetButton: {
    padding: 12,
    backgroundColor: '#e63946',
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
  },
  submitButton: {
    padding: 12,
    backgroundColor: '#77B254',
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    elevation: 5,
  },
  modalText: {
    marginTop: 16,
    fontSize: 16,
  },
  // Network banner styles
  networkBanner: {
    backgroundColor: '#f44336',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkBannerText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    maxHeight: '50%',
  },
  yearOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  yearText: {
    fontSize: 18,
    textAlign: 'center',
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
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
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
  // Updated image upload styles
  dropdownTreeremark: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 15,
  },
  contentContainer: {
    marginBottom: 10,
  },
  textContent: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 8,
    minHeight: 60,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    marginBottom: 5,
  },
  inputContainer1: {
    flexDirection: 'row',        
    justifyContent: 'space-between', 
    alignItems: 'center',        
    marginTop: 10,
  },
  
  iconButton1: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f4e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },

  iconButton2: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f4e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  button_label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0088ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photoText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  photoIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  photoIcon: {
    alignItems: 'center',
  },
  photoIconText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
});

export default GastropodBivalveForm;