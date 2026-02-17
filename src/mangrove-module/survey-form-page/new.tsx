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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';

// Custom theme with green primary color for react-native-paper components
const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4A7856',
    accent: '#4A7856',
    onSurfaceVariant: '#4A7856',
    outline: '#4A7856',
  },
};
// Custom time/date picker - no native module required
import Icon from 'react-native-vector-icons/FontAwesome';
import GetLocation from 'react-native-get-location';
import { Dimensions } from 'react-native';
import { API_URL } from '../../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { Modal, FlatList } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CustomAlert from '../../bird-module/custom-alert/alert-design';


// Define habitat type constants for consistency and to prevent errors
const HABITAT_TYPES = {
  PRISTINE: 'Pristine mangroves',
  DEGRADED: 'Degraded mangroves',
  RESTORED: 'Restored mangroves',
  CONTROL: 'Control',
  CONTROL_AREA: 'Control Area',
  OTHER: 'Other'
};


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
  { label: 'Mature mixed mangroves', value: 'Mature mixed mangroves', scientificPart: '' },
  { label: 'Avicennia sp. dominant mature mangroves', value: 'Avicennia sp. dominant mature mangroves', scientificPart: 'Avicennia sp.' },
  { label: 'Rhizophora sp. dominant mature mangroves', value: 'Rhizophora sp. dominant mature mangroves', scientificPart: 'Rhizophora sp.' },
  { label: 'Mixed saplings below 5m restored', value: 'Mixed saplings below 5m restored', scientificPart: '' },
  { label: 'Avicennia sp. saplings below 5m restored', value: 'Avicennia sp. saplings below 5m restored', scientificPart: 'Avicennia sp.' },
  { label: 'Rhizophora sp. saplings below 5m restored', value: 'Rhizophora sp. saplings below 5m restored', scientificPart: 'Rhizophora sp.' },
  { label: 'Mixed seedlings below 1m restored', value: 'Mixed seedlings below 1m restored', scientificPart: '' },
  { label: 'Avicennia sp. dominant seedlings below 1m restored', value: 'Avicennia sp. dominant seedlings below 1m restored', scientificPart: 'Avicennia sp.' },
  { label: 'Rhizophora sp. dominant seedlings below 1m restored', value: 'Rhizophora sp. dominant seedlings below 1m restored', scientificPart: 'Rhizophora sp.' },
  { label: 'Salt marsh Vegetation', value: 'Salt marsh Vegetation', scientificPart: '' },
  { label: 'Barren Land', value: 'Barren Land', scientificPart: '' },
  { label: 'Grassland', value: 'Grassland', scientificPart: '' },
  { label: 'Other', value: 'Other', scientificPart: '' },
];

// Helper function to render vegetation item with italic scientific names
const renderVegetationItem = (item: any, selected?: boolean) => {
  if (item.scientificPart) {
    const parts = item.label.split(item.scientificPart);
    return (
      <View style={{
        padding: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: selected ? '#E8F5E9' : 'transparent',
      }}>
        <Text style={{ fontStyle: 'italic', fontFamily: 'Times New Roman', fontSize: 14, color: '#333' }}>
          {item.scientificPart}
        </Text>
        <Text style={{ fontFamily: 'Times New Roman', fontSize: 14, color: '#333' }}>
          {parts[1] || ''}
        </Text>
      </View>
    );
  }
  return (
    <View style={{
      padding: 12,
      backgroundColor: selected ? '#E8F5E9' : 'transparent',
    }}>
      <Text style={{ fontFamily: 'Times New Roman', fontSize: 14, color: '#333' }}>{item.label}</Text>
    </View>
  );
};

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
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // State for basic information
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeOfDataCollection, setTimeOfDataCollection] = useState(null);
  const [isTimeOfDataFocused, setIsTimeOfDataFocused] = useState(false);

  // State for high tide time and sampling time
  const [nearestHighTideTime, setNearestHighTideTime] = useState(new Date());
  const [showHighTidePicker, setShowHighTidePicker] = useState(false);
  const [timeOfSampling, setTimeOfSampling] = useState(new Date());
  const [showSamplingTimePicker, setShowSamplingTimePicker] = useState(false);

  // Custom picker temp state
  const [tempSelectedHour, setTempSelectedHour] = useState(0);
  const [tempSelectedMinute, setTempSelectedMinute] = useState(0);
  const [tempSelectedDay, setTempSelectedDay] = useState(1);
  const [tempSelectedMonth, setTempSelectedMonth] = useState(0);
  const [tempSelectedYear, setTempSelectedYear] = useState(new Date().getFullYear());

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

  // Team members state
  const [teamMembersList, setTeamMembersList] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState('');
  const [editMemberIndex, setEditMemberIndex] = useState<number | null>(null);

  // Error state
  const [errors, setErrors] = useState({});

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  // Navigation
  const navigation = useNavigation();
  const route = useRoute();

  // Check if we're in edit mode and populate form data
  useEffect(() => {
    if (route.params?.editData) {
      const data = route.params.editData;
      setIsEditMode(true);
      setEditItemId(data._id);

      // Populate basic information
      if (data.select_date) setDate(new Date(data.select_date));
      if (data.time_of_data_collection && data.time_of_data_collection !== 'N/A') setTimeOfDataCollection(data.time_of_data_collection);

      // Parse time strings to Date objects
      const parseTime = (timeStr) => {
        if (!timeStr || timeStr === 'N/A') return new Date();
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours || 0, minutes || 0, 0, 0);
        return date;
      };

      if (data.nearest_high_tide_time) setNearestHighTideTime(parseTime(data.nearest_high_tide_time));
      if (data.time_of_sampling) setTimeOfSampling(parseTime(data.time_of_sampling));

      // Location
      if (data.Location && data.Location !== 'N/A') {
        if (['Anawilundawa', 'Pubudugama'].includes(data.Location)) {
          setLocation(data.Location);
        } else {
          setLocation('Other');
          setCustomLocation(data.Location);
        }
      }
      if (data.latitude) setLatitude(String(data.latitude));
      if (data.longitude) setLongitude(String(data.longitude));

      // Weather
      if (data.selectedWeatherConditions && data.selectedWeatherConditions !== 'N/A') {
        const weatherOptions = ['Extreamely Dry Weather', 'Dry', 'Wet', 'Extreamely Wet', 'Remark'];
        if (weatherOptions.includes(data.selectedWeatherConditions)) {
          setWeatherCondition(data.selectedWeatherConditions);
        } else {
          setWeatherCondition('Remark');
          setWeatherRemark(data.selectedWeatherConditions);
        }
      }
      if (data.weatherRemark && data.weatherRemark !== 'N/A') setWeatherRemark(data.weatherRemark);

      // Sampling layer and method
      if (data.SamplingLayer && data.SamplingLayer !== 'N/A') setSamplingLayer(data.SamplingLayer);
      if (data.samplingMethod && data.samplingMethod !== 'N/A') setSamplingMethod(data.samplingMethod);

      // Quadrat information
      if (data.quadratId && data.quadratId !== 'N/A') setQuadratId(data.quadratId);
      if (data.quadratObservedBy && data.quadratObservedBy !== 'N/A') setQuadratObservedBy(data.quadratObservedBy);
      if (data.dataEnteredBy && data.dataEnteredBy !== 'N/A') setDataEnteredBy(data.dataEnteredBy);
      if (data.quadrat_size_m) setQuadratSize(String(data.quadrat_size_m));
      if (data.quadratLocation && data.quadratLocation !== 'N/A') {
        const standardLocations = ['Main Canel', 'Sub Canel', 'Land Area', 'Control Area'];
        if (standardLocations.includes(data.quadratLocation)) {
          setQuadratLocation(data.quadratLocation);
        } else {
          setQuadratLocation('Other');
          setCustomQuadratLocation(data.quadratLocation);
        }
      }

      // Transect information
      if (data.transectId && data.transectId !== 'N/A') setTransectId(data.transectId);
      if (data.transectObservedBy && data.transectObservedBy !== 'N/A') setTransectObservedBy(data.transectObservedBy);
      if (data.transectDataEnteredBy && data.transectDataEnteredBy !== 'N/A') setTransectDataEnteredBy(data.transectDataEnteredBy);
      if (data.transectSize) setTransectSize(String(data.transectSize));
      if (data.transectLatitude) setTransectLatitude(String(data.transectLatitude));
      if (data.transectLongitude) setTransectLongitude(String(data.transectLongitude));
      if (data.endPointLatitude) setEndPointLatitude(String(data.endPointLatitude));
      if (data.endPointLongitude) setEndPointLongitude(String(data.endPointLongitude));

      // Peterson Grab information
      if (data.grabId && data.grabId !== 'N/A') setGrabId(data.grabId);
      if (data.grabObservedBy && data.grabObservedBy !== 'N/A') setGrabObservedBy(data.grabObservedBy);
      if (data.grabDataEnteredBy && data.grabDataEnteredBy !== 'N/A') setGrabDataEnteredBy(data.grabDataEnteredBy);
      if (data.grabSize) setGrabSize(String(data.grabSize));
      if (data.grabLatitude) setGrabLatitude(String(data.grabLatitude));
      if (data.grabLongitude) setGrabLongitude(String(data.grabLongitude));

      // Soil Core information
      if (data.coreId && data.coreId !== 'N/A') setCoreId(data.coreId);
      if (data.coreObservedBy && data.coreObservedBy !== 'N/A') setCoreObservedBy(data.coreObservedBy);
      if (data.coreDataEnteredBy && data.coreDataEnteredBy !== 'N/A') setCoreDataEnteredBy(data.coreDataEnteredBy);
      if (data.coreDepth) setCoreDepth(String(data.coreDepth));
      if (data.sieveSize) setSieveSize(String(data.sieveSize));
      if (data.coreLatitude) setCoreLatitude(String(data.coreLatitude));
      if (data.coreLongitude) setCoreLongitude(String(data.coreLongitude));

      // Habitat information
      if (data.plot_habitat_type && data.plot_habitat_type !== 'N/A') {
        const standardHabitats = ['Pristine mangroves', 'Degraded mangroves', 'Restored mangroves', 'Control', 'Control Area'];
        if (standardHabitats.includes(data.plot_habitat_type)) {
          setHabitatType(data.plot_habitat_type);
        } else {
          setHabitatType('Other');
          setCustomHabitatType(data.plot_habitat_type);
        }
      }
      if (data.if_restored_year_of_restoration && data.if_restored_year_of_restoration !== 'N/A') {
        setRestorationYear(String(data.if_restored_year_of_restoration));
      }

      // Vegetation
      if (data.plot_vegetation && data.plot_vegetation !== 'N/A') {
        const standardVegetations = vegetationOptions.map(v => v.value);
        if (standardVegetations.includes(data.plot_vegetation)) {
          setVegetation(data.plot_vegetation);
        } else {
          setVegetation('Other');
          setCustomVegetation(data.plot_vegetation);
        }
      }

      // Microhabitat
      if (data.quadrat_microhabitat && data.quadrat_microhabitat !== 'N/A') {
        const standardMicrohabitats = microhabitatOptions.map(m => m.value);
        if (standardMicrohabitats.includes(data.quadrat_microhabitat)) {
          setMicrohabitat(data.quadrat_microhabitat);
        } else {
          setMicrohabitat('Other');
          setCustomMicrohabitat(data.quadrat_microhabitat);
        }
      }

      // Species clumping
      if (data.species_seen_clumped && data.species_seen_clumped !== 'N/A') setSpeciesClumped(data.species_seen_clumped);
      if (data.species_seen_clumped_what && data.species_seen_clumped_what !== 'N/A') setSpeciesSeenClumpedWhat(data.species_seen_clumped_what);
      if (data.clumped_species_name && data.clumped_species_name !== 'N/A') setClumpedSpeciesName(data.clumped_species_name);
      if (data.clumped_where && data.clumped_where !== 'N/A') setClumpedWhere(data.clumped_where);
      if (data.clumped_count) setClumpedCount(String(data.clumped_count));

      // Species on root
      if (data.species_seen_on_root && data.species_seen_on_root !== 'N/A') setSpeciesOnRoot(data.species_seen_on_root);
      if (data.species_on_root_where && data.species_on_root_where !== 'N/A') setSpeciesOnRootWhere(data.species_on_root_where);
      if (data.species_on_root_what && data.species_on_root_what !== 'N/A') setSpeciesOnRootWhat(data.species_on_root_what);

      // Water information
      if (data.is_in_water && data.is_in_water !== 'N/A') setIsInWater(data.is_in_water);
      if (data.water_status && data.water_status !== 'N/A') setWaterStatus(data.water_status);
      if (data.water_depth) setWaterDepth(String(data.water_depth));

      // Species counts
      const counts = {};
      [...gastropodSpecies, ...bivalveSpecies].forEach(species => {
        if (data[species.id] !== undefined && data[species.id] !== null) {
          counts[species.id] = String(data[species.id]);
        }
      });
      if (Object.keys(counts).length > 0) setSpeciesCounts(counts);

      // Remarks and image
      if (data.remark && data.remark !== 'N/A') setRemark(data.remark);
      if (data.imageUri) setImageUri(data.imageUri);
    }
  }, [route.params?.editData]);

  // Handle date picker confirm
  const handleDateConfirm = (selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate);
  };

  // Handle date picker cancel
  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  // Handle high tide time picker confirm
  const handleHighTideTimeConfirm = (selectedTime) => {
    setShowHighTidePicker(false);
    setNearestHighTideTime(selectedTime);
  };

  // Handle high tide time picker cancel
  const handleHighTideTimeCancel = () => {
    setShowHighTidePicker(false);
  };

  // Handle sampling time picker confirm
  const handleSamplingTimeConfirm = (selectedTime) => {
    setShowSamplingTimePicker(false);
    setTimeOfSampling(selectedTime);
  };

  // Handle sampling time picker cancel
  const handleSamplingTimeCancel = () => {
    setShowSamplingTimePicker(false);
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


  const isDarkMode = theme === 'dark';

  // Handle offline submission
  const storeFailedSubmission = (formData) => {
    Alert.alert(
      'Offline Mode',
      'You are offline. Please connect to the internet and try again.',
      [{ text: 'OK' }]
    );
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
      // Generate a unique survey number using timestamp (only for new submissions)
      let surveyNo;
      const params = route.params as any;
      if (isEditMode && params?.editData?.survey_no) {
        surveyNo = params.editData.survey_no; // Keep original survey number
      } else {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        surveyNo = `${year}${month}${day}${hours}${minutes}${seconds}`;
      }

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
        teamMembers: teamMembersList.join(', '),
        select_date: date.toISOString(),
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

      let response;
      if (isEditMode && editItemId) {
        // Update existing entry
        console.log(`Sending PUT request to ${API_URL}/bivalvi-form-entry/${editItemId}`);
        response = await axios.put(`${API_URL}/bivalvi-form-entry/${editItemId}`, formData);
        console.log('API response:', JSON.stringify(response.data, null, 2));
      } else {
        // Create new entry
        console.log(`Sending POST request to ${API_URL}/submit-bivalvi-form`);
        response = await axios.post(`${API_URL}/submit-bivalvi-form`, formData);
        console.log('API response:', JSON.stringify(response.data, null, 2));
      }

      // Upload image if available
      const entryId = isEditMode ? editItemId : response.data?._id;
      if (imageUri && entryId) {
        const uploadResponse = await uploadImageToServer(imageUri, entryId);
        console.log('Image upload response:', uploadResponse);
      }

      resetForm();
      setIsEditMode(false);
      setEditItemId(null);
      setIsAlertVisible(true);
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
    <PaperProvider theme={customTheme}>
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
      <CustomAlert
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
        type="success"
        title="Success !"
        message="Your form has been successfully submitted! You can now fill a new form."
        buttonText="Continue"
      />
      <ImageBackground
        source={require('../../assets/image/bivalvi.jpeg')}
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

          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButtonContainer}
              onPress={() => (navigation as any).navigate('ModuleSelector')}
            >
              <Icon name="arrow-left" size={20} color="#333" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextButtonContainer}
              onPress={() => (navigation as any).navigate('MangroveDataTable')}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Icon name="arrow-right" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {isEditMode ? 'Edit Gastropod and Bivalve Data' : 'Gastropod and Bivalve Data Collection'}
            </Text>

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
                <DateTimePickerModal
                  isVisible={showDatePicker}
                  mode="date"
                  date={date}
                  onConfirm={handleDateConfirm}
                  onCancel={handleDateCancel}
                />
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
                  itemTextStyle={styles.dropdownItemStyle}
                  containerStyle={styles.dropdownContainerStyle}
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
                <DateTimePickerModal
                  isVisible={showHighTidePicker}
                  mode="time"
                  date={nearestHighTideTime}
                  is24Hour={true}
                  onConfirm={handleHighTideTimeConfirm}
                  onCancel={handleHighTideTimeCancel}
                />
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
                <DateTimePickerModal
                  isVisible={showSamplingTimePicker}
                  mode="time"
                  date={timeOfSampling}
                  is24Hour={true}
                  onConfirm={handleSamplingTimeConfirm}
                  onCancel={handleSamplingTimeCancel}
                />
              </View>
            </View>

            {/* Team Members Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Team Members</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Add Member</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    style={[styles.textInput, {flex: 1, marginRight: 8}]}
                    value={memberInput}
                    onChangeText={setMemberInput}
                    placeholder="Enter member name"
                  />
                  <TouchableOpacity
                    style={{
                      backgroundColor: editMemberIndex !== null ? '#43a047' : '#2e7d32',
                      borderRadius: 8,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                    }}
                    onPress={() => {
                      const name = memberInput.trim();
                      if (!name) return;
                      if (editMemberIndex !== null) {
                        const updated = [...teamMembersList];
                        updated[editMemberIndex] = name;
                        setTeamMembersList(updated);
                        setEditMemberIndex(null);
                      } else {
                        if (teamMembersList.includes(name)) {
                          Alert.alert('Duplicate', 'This member is already added.');
                          return;
                        }
                        setTeamMembersList([...teamMembersList, name]);
                      }
                      setMemberInput('');
                    }}>
                    <Text style={{color: '#fff', fontWeight: '700', fontSize: 13}}>
                      {editMemberIndex !== null ? 'Update' : 'Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {teamMembersList.length > 0 && (
                <View style={{marginTop: 8}}>
                  {teamMembersList.map((member, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: editMemberIndex === index ? '#e8f5e9' : '#f5f5f5',
                        borderRadius: 8,
                        padding: 10,
                        marginBottom: 6,
                        borderLeftWidth: 3,
                        borderLeftColor: '#2e7d32',
                      }}>
                      <Text style={{flex: 1, fontSize: 14, color: '#333'}}>{member}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setMemberInput(member);
                          setEditMemberIndex(index);
                        }}
                        style={{marginRight: 12}}>
                        <Icon name="edit" size={16} color="#2e7d32" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setTeamMembersList(teamMembersList.filter((_, i) => i !== index));
                          if (editMemberIndex === index) {
                            setEditMemberIndex(null);
                            setMemberInput('');
                          }
                        }}>
                        <Icon name="trash" size={16} color="#c62828" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
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
                  itemTextStyle={styles.dropdownItemStyle}
                  containerStyle={styles.dropdownContainerStyle}
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
                  itemTextStyle={styles.dropdownItemStyle}
                  containerStyle={styles.dropdownContainerStyle}
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
                  itemTextStyle={styles.dropdownItemStyle}
                  containerStyle={styles.dropdownContainerStyle}
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
                    itemTextStyle={styles.dropdownItemStyle}
                    containerStyle={styles.dropdownContainerStyle}
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
                    activeUnderlineColor="#4A7856"
                    underlineColor="#DDD"
                    selectionColor="#4A7856"
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
                    activeUnderlineColor="#4A7856"
                    underlineColor="#DDD"
                    selectionColor="#4A7856"
                  />
                  {errors.dataEnteredBy && <Text style={styles.errorText}>{errors.dataEnteredBy}</Text>}
                </View>

                {/* Quadrat Size */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Size of the Quadrat</Text>
                  <View style={styles.inputWithSuffix}>
                    <TextInput
                      style={[styles.textInputWithSuffix, errors.quadratSize && styles.inputError]}
                      value={quadratSize}
                      onChangeText={(value) => validateNumericInput(value, setQuadratSize)}
                      placeholder="Enter quadrat size"
                      keyboardType="numeric"
                    />
                    <View style={styles.suffixContainer}>
                      <Text style={styles.suffixText}>m</Text>
                    </View>
                  </View>
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
                    itemTextStyle={styles.dropdownItemStyle}
                    containerStyle={styles.dropdownContainerStyle}
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
                    itemTextStyle={styles.dropdownItemStyle}
                    containerStyle={styles.dropdownContainerStyle}
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
                    containerStyle={styles.dropdownContainerStyle}
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
                    renderItem={(item, selected) => renderVegetationItem(item, selected)}
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
                    itemTextStyle={styles.dropdownItemStyle}
                    containerStyle={styles.dropdownContainerStyle}
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
                    itemTextStyle={styles.dropdownItemStyle}
                    containerStyle={styles.dropdownContainerStyle}
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
                    itemTextStyle={styles.dropdownItemStyle}
                    containerStyle={styles.dropdownContainerStyle}
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
                    itemTextStyle={styles.dropdownItemStyle}
                    containerStyle={styles.dropdownContainerStyle}
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
                        itemTextStyle={styles.dropdownItemStyle}
                        containerStyle={styles.dropdownContainerStyle}
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
                      <Text style={styles.inputLabel}>Depth of the Water</Text>
                      <View style={styles.inputWithSuffix}>
                        <TextInput
                          style={[styles.textInputWithSuffix, errors.waterDepth && styles.inputError]}
                          value={waterDepth}
                          onChangeText={(value) => validateNumericInput(value, setWaterDepth)}
                          placeholder="Enter water depth"
                          keyboardType="numeric"
                        />
                        <View style={styles.suffixContainer}>
                          <Text style={styles.suffixText}>cm</Text>
                        </View>
                      </View>
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
                    <Text style={styles.scientificName}>{species.name}</Text>
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
                    <Text style={styles.scientificName}>{species.name}</Text>
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
                buttonColor="#4A7856"
                textColor="white"
                labelStyle={styles.button_label}
              >
                {isEditMode ? 'Update' : 'Submit'}
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
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  nextButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A7856',
    marginLeft: 8,
    fontWeight: '500',
    fontFamily: 'Times New Roman',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#4A7856',
    marginRight: 8,
    fontWeight: '500',
    fontFamily: 'Times New Roman',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  formTitle: {
    color: '#4A7856',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Times New Roman',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4A7856',
    fontFamily: 'Times New Roman',
  },
  subSectionContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    fontFamily: 'Times New Roman',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontFamily: 'Times New Roman',
  },
  scientificName: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontFamily: 'Times New Roman',
    fontStyle: 'italic',
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333',
    fontFamily: 'Times New Roman',
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
  },
  dropdownFocused: {
    borderColor: '#4A7856',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#AAA',
    fontFamily: 'Times New Roman',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Times New Roman',
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: 'Times New Roman',
  },
  dropdownContainerStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  dropdownItemStyle: {
    color: '#333',
    fontFamily: 'Times New Roman',
  },
  dateInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Times New Roman',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Times New Roman',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 32,
  },
  resetButton: {
    padding: 15,
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  submitButton: {
    padding: 15,
    backgroundColor: '#4A7856',
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Times New Roman',
  },
  resetText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Times New Roman',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Times New Roman',
    color: '#333',
  },
  // Network banner styles
  networkBanner: {
    backgroundColor: '#E74C3C',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkBannerText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Times New Roman',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    maxHeight: '50%',
  },
  yearOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  yearText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Times New Roman',
    color: '#333',
  },
  imageUploadButton: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#4A7856',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: '#4A7856',
    fontFamily: 'Times New Roman',
    fontWeight: '600',
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
    backgroundColor: '#4A7856',
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
    fontFamily: 'Times New Roman',
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A7856',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  photoText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
    fontFamily: 'Times New Roman',
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
    fontFamily: 'Times New Roman',
  },
  // Quadrat size input with meter suffix
  inputWithSuffix: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputWithSuffix: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightWidth: 0,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333',
    fontFamily: 'Times New Roman',
  },
  suffixContainer: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4A7856',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suffixText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A7856',
    fontFamily: 'Times New Roman',
  },
});

export default GastropodBivalveForm;