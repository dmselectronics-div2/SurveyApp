import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  TextInput,
  Dimensions,
  Platform,
  ActivityIndicator,
  Image,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconButton } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

// Helper function to format values for display
const formatValue = value => {
  if (value === null || value === undefined) return 'N/A';

  // For time fields, display only the time part
  if (typeof value === 'string' && (value.includes(':') && value.length <= 8)) {
    return value;
  }

  // Check if value is a valid date string
  if (typeof value === 'string') {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString();
    }
  }

  // If value is a Date object
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  // For numeric values, return with appropriate formatting
  if (typeof value === 'number') {
    // If it's a whole number or very close to it
    if (Math.abs(value - Math.round(value)) < 0.00001) {
      return value.toString();
    }
    // Otherwise format with 2 decimal places
    return value.toFixed(2);
  }

  return String(value);
};
//display
const MyDataTable = () => {
  const navigation = useNavigation();

  // State variables
  const [data, setData] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllColumns, setShowAllColumns] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(50);

  // Edit modal states
  const [editItem, setEditItem] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Date and Time picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeField, setTimeField] = useState('');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [yearPickerDate, setYearPickerDate] = useState(new Date());

  // Image states
  const [imageUri, setImageUri] = useState(null);
  const [content, setContent] = useState([]);
  const [text, setText] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Define habitat type constants for consistency
  const HABITAT_TYPES = {
    PRISTINE: 'Pristine mangroves',
    DEGRADED: 'Degraded mangroves',
    RESTORED: 'Restored mangroves',
    CONTROL: 'Control',
    CONTROL_AREA: 'Control Area',
    OTHER: 'Other'
  };

  // Dropdown options
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

  // Updated to match the format from GastropodBivalveForm
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

  // Default sampling method options for backward compatibility
  const defaultSamplingMethodOptions = [
    { label: 'Quadrat Sampling', value: 'Quadrat Sampling' },
    { label: 'Transect Sampling', value: 'Transect Sampling' },
    { label: 'Peterson Grab sampling', value: 'Peterson Grab sampling' },
    { label: 'Soil core sampling', value: 'Soil core sampling' },
  ];

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
    { label: 'Avicennia sp.dominant mature mangroves', value: 'Avicennia sp.dominant mature mangroves' },
    { label: 'Rhizophora sp.dominant mature mangroves', value: 'Rhizophora sp.dominant mature mangroves' },
    { label: 'Mixed saplings below 5m restored', value: 'Mixed saplings below 5m restored' },
    { label: 'Avicennia sp.saplings below 5m restored', value: 'Avicennia sp.saplings below 5m restored' },
    { label: 'Rhizophora sp. saplings below 5m restored', value: 'Rhizophora sp. saplings below 5m restored' },
    { label: 'Mixed seedlings below 1 m restored', value: 'Mixed seedlings below 1 m restored' },
    { label: 'Avicennia sp. dominant seedlings below 1m restored', value: 'Avicennia sp. dominant seedlings below 1m restored' },
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
    { label: 'Semi dry leaf litter', value: 'Semi dry leaf litter' },
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

  // Define custom field mappings for "Other" selections
  const customFieldMappings = {
    'Location': 'customLocation',
    'location': 'customLocation',
    'quadrat_location': 'customQuadratLocation',
    'quadratLocation': 'customQuadratLocation',
    'plot_habitat_type': 'customHabitatType',
    'habitatType': 'customHabitatType',
    'plot_vegetation': 'customVegetation',
    'vegetation': 'customVegetation',
    'quadrat_microhabitat': 'customMicrohabitat',
    'microhabitat': 'customMicrohabitat',
    'custom_Microhabitat': 'customMicrohabitat'
  };

  // Define remark field mappings
  const remarkFieldMappings = {
    'selectedWeatherConditions': 'weatherRemark',
    'weatherCondition': 'weatherRemark'
  };

  // Define field categories and types
  const dropdownFields = {
    'time_of_data_collection': timeOfDayOptions,
    'timeOfDataCollection': timeOfDayOptions,
    'Location': locationOptions,
    'location': locationOptions,
    'selectedWeatherConditions': weatherOptions,
    'weatherCondition': weatherOptions,
    'plot_habitat_type': habitatTypeOptions,
    'habitatType': habitatTypeOptions,
    'plot_vegetation': vegetationOptions,
    'vegetation': vegetationOptions,
    'quadrat_location': quadratLocationOptions,
    'quadratLocation': quadratLocationOptions,
    'quadrat_microhabitat': microhabitatOptions,
    'microhabitat': microhabitatOptions,
    'SamplingLayer': samplingLayerOptions,
    'samplingLayer': samplingLayerOptions,
    'sampling_method': defaultSamplingMethodOptions,
    'samplingMethod': defaultSamplingMethodOptions,
    'water_status': waterStatusOptions,
    'waterStatus': waterStatusOptions,
    'species_seen_clumped': yesNoOptions,
    'speciesClumped': yesNoOptions,
    'species_seen_on_root': yesNoOptions,
    'speciesOnRoot': yesNoOptions,
    'in_water': yesNoOptions,
    'isInWater': yesNoOptions,
  };

  const numericFields = [
    'latitude', 'longitude', 'quadrat_size_m', 'quadratSize', 'area_of_quadrat_size',
    'water_depth', 'clumped_count', 'transectLatitude', 'transectLongitude',
    'endPointLatitude', 'endPointLongitude', 'grabLatitude', 'grabLongitude',
    'coreLatitude', 'coreLongitude', 'waterDepth', 'clumpedCount',
    // All the gastropod and bivalve species counts
    'ellobium_gangeticum_eg', 'melampus_ceylonicus_mc', 'melampus_fasciatus_mf',
    'pythia_plicata_pp', 'littoraria_scabra_lc', 'nerita_polita_np',
    'cerithidea_quoyii_cq', 'pirenella_cingulata_pc1', 'pirinella_conica_pc2',
    'telescopium_telescopium_tr', 'terebralia_palustris_tp', 'haminoea_crocata_hc',
    'faunus_ater_fa', 'family_onchidiidae', 'meiniplotia_scabra_ms3',
    'meretrix_casta_MC', 'gelonia_coaxons_GC', 'magallana_belcheri_MB1',
    'magallana_bilineata_MB2', 'saccostra_scyphophilla_SS', 'saccostra_cucullata_SC',
    'martesia_striata_MS1', 'barnacle_sp_b', 'mytella_strigata_MS2',
    'corbicula_solida_cs', 'meretrix_casta_mc', 'gelonia_coaxans_gc',
    'magallana_belcheri_mb1', 'magallana_bilineata_mb2', 'saccostrea_scyphophilla_ss',
    'saccostrea_cucullata_sc', 'martesia_striata_ms', 'ballanus_sp_b',
    'mytella_strigata_ms2'
  ];

  const dateFields = ['select_date'];
  const timeFields = ['nearest_high_tide_time', 'time_of_sampling'];
  const imageFields = ['imageUri', 'photos'];
  const textAreaFields = ['remark'];

  // Define field mappings for normalized field names
  const fieldMappings = {
    'quadratSize': 'quadrat_size_m',
    'quadrat_size_m': 'quadratSize',
    'timeOfDataCollection': 'time_of_data_collection',
    'time_of_data_collection': 'timeOfDataCollection',
    'location': 'Location',
    'Location': 'location',
    'habitatType': 'plot_habitat_type',
    'plot_habitat_type': 'habitatType',
    'vegetation': 'plot_vegetation',
    'plot_vegetation': 'vegetation',
    'microhabitat': 'quadrat_microhabitat',
    'quadrat_microhabitat': 'microhabitat',
    'quadratLocation': 'quadrat_location',
    'quadrat_location': 'quadratLocation',
    'samplingLayer': 'SamplingLayer',
    'SamplingLayer': 'samplingLayer',
    'samplingMethod': 'sampling_method',
    'sampling_method': 'samplingMethod',
    'speciesClumped': 'species_seen_clumped',
    'species_seen_clumped': 'speciesClumped',
    'speciesOnRoot': 'species_seen_on_root',
    'species_seen_on_root': 'speciesOnRoot',
    'isInWater': 'in_water',
    'in_water': 'isInWater',
    'waterStatus': 'water_status',
    'water_status': 'waterStatus',
    'weatherCondition': 'selectedWeatherConditions',
    'selectedWeatherConditions': 'weatherCondition'
  };

  // Define all possible columns with display names
  const allColumns = [
    // Always show these columns
    { key: 'survey_no', displayName: 'Survey No', priority: 1 },
    { key: 'select_date', displayName: 'Date', priority: 1 },

    // Basic Information
    { key: 'teamMembers', displayName: 'Team Members', priority: 2 },
    { key: 'time_of_data_collection', displayName: 'Collection Time', priority: 2 },
    { key: 'nearest_high_tide_time', displayName: 'High Tide Time', priority: 2 },
    { key: 'time_of_sampling', displayName: 'Sampling Time', priority: 2 },
    { key: 'Location', displayName: 'Location', priority: 2 },

    // Weather Information
    { key: 'selectedWeatherConditions', displayName: 'Weather', priority: 2 },

    // Sampling Information
    { key: 'SamplingLayer', displayName: 'Sampling Layer', priority: 2 },
    { key: 'sampling_method', displayName: 'Sampling Method', priority: 2 },

    // Quadrat Information
    { key: 'quadratId', displayName: 'Quadrat ID', priority: 3 },
    { key: 'quadratObservedBy', displayName: 'Quadrat Observed By', priority: 3 },
    { key: 'dataEnteredBy', displayName: 'Data Entered By', priority: 3 },
    // { key: 'quadratSize', displayName: 'Quadrat Size', priority: 3 },
    { key: 'quadrat_size_m', displayName: 'Quadrat Size (m)', priority: 3 },
    // { key: 'area_of_quadrat_size', displayName: 'Quadrat Area (m²)', priority: 3 },
    { key: 'quadrat_location', displayName: 'Quadrat Location', priority: 3 },
    { key: 'latitude', displayName: 'Latitude', priority: 3 },
    { key: 'longitude', displayName: 'Longitude', priority: 3 },

    // Transect Information
    { key: 'transectId', displayName: 'Transect ID', priority: 3 },
    { key: 'transectObservedBy', displayName: 'Transect Observed By', priority: 3 },
    { key: 'transectDataEnteredBy', displayName: 'Transect Data Entered By', priority: 3 },
    { key: 'transectSize', displayName: 'Transect Size', priority: 3 },
    { key: 'transectLatitude', displayName: ' Starting Point Transect Latitude', priority: 3 },
    { key: 'transectLongitude', displayName: 'Starting Point Transect Longitude', priority: 3 },
    // { key: 'endPointLatitude', displayName: 'End Point Latitude', priority: 3 },
    // { key: 'endPointLongitude', displayName: 'End Point Longitude', priority: 3 },

    // Peterson Grab Information
    { key: 'grabId', displayName: 'Grab ID', priority: 3 },
    { key: 'grabObservedBy', displayName: 'Grab Observed By', priority: 3 },
    { key: 'grabDataEnteredBy', displayName: 'Grab Data Entered By', priority: 3 },
    { key: 'grabSize', displayName: 'Grab Size', priority: 3 },
    { key: 'grabLatitude', displayName: 'Grab Latitude', priority: 3 },
    { key: 'grabLongitude', displayName: 'Grab Longitude', priority: 3 },

    // Soil Core Information
    { key: 'coreId', displayName: 'Core ID', priority: 3 },
    { key: 'coreObservedBy', displayName: 'Core Observed By', priority: 3 },
    { key: 'coreDataEnteredBy', displayName: 'Core Data Entered By', priority: 3 },
    { key: 'coreDepth', displayName: 'Core Depth', priority: 3 },
    { key: 'sieveSize', displayName: 'Sieve Size', priority: 3 },
    { key: 'coreLatitude', displayName: 'Core Latitude', priority: 3 },
    { key: 'coreLongitude', displayName: 'Core Longitude', priority: 3 },

    // Habitat Information
    { key: 'plot_habitat_type', displayName: 'Habitat Type', priority: 2 },
    { key: 'if_restored_year_of_restoration', displayName: 'Restoration Year', priority: 3 },

    // Vegetation Information
    { key: 'plot_vegetation', displayName: 'Vegetation', priority: 2 },

    // Microhabitat Information
    { key: 'quadrat_microhabitat', displayName: 'Microhabitat', priority: 2 },

    // Species Clumping Information
    { key: 'species_seen_clumped', displayName: 'Species Clumped', priority: 2 },
    { key: 'species_seen_clumped_what', displayName: 'Clump No', priority: 3 },
    { key: 'clumped_species_name', displayName: 'Clumped Species Name', priority: 3 },
    { key: 'clumped_where', displayName: 'Clumped Where', priority: 3 },
    { key: 'clumped_count', displayName: 'Clumped Count', priority: 3 },

    // Species on Root Information
    { key: 'species_seen_on_root', displayName: 'Species on Root', priority: 2 },
    { key: 'species_on_root_where', displayName: 'Species on Root Where', priority: 3 },
    { key: 'species_on_root_what', displayName: 'Species on Root What', priority: 3 },

    // Water Information
    { key: 'in_water', displayName: 'In Water', priority: 2 },
    { key: 'water_status', displayName: 'Water Status', priority: 3 },
    { key: 'water_depth', displayName: 'Water Depth (cm)', priority: 3 },

    // Image and Notes fields
    { key: 'imageUri', displayName: 'Images', priority: 2 },
    // { key: 'remark', displayName: 'Remarks', priority: 2 },

    // Gastropod Species Counts
    { key: 'ellobium_gangeticum_eg', displayName: 'Ellobium gangeticum', priority: 4 },
    { key: 'melampus_ceylonicus_mc', displayName: 'Melampus ceylonicus', priority: 4 },
    { key: 'melampus_fasciatus_mf', displayName: 'Melampus fasciatus', priority: 4 },
    { key: 'pythia_plicata_pp', displayName: 'Pythia plicata', priority: 4 },
    { key: 'littoraria_scabra_lc', displayName: 'Littoraria scabra', priority: 4 },
    { key: 'nerita_polita_np', displayName: 'Nerita polita', priority: 4 },
    { key: 'cerithidea_quoyii_cq', displayName: 'Cerithidea quoyii', priority: 4 },
    { key: 'pirenella_cingulata_pc1', displayName: 'Pirenella cingulata', priority: 4 },
    { key: 'pirinella_conica_pc2', displayName: 'Pirinella conica', priority: 4 },
    { key: 'telescopium_telescopium_tr', displayName: 'Telescopium telescopium', priority: 4 },
    { key: 'terebralia_palustris_tp', displayName: 'Terebralia palustris', priority: 4 },
    { key: 'haminoea_crocata_hc', displayName: 'Haminoea crocata', priority: 4 },
    { key: 'faunus_ater_fa', displayName: 'Faunus ater', priority: 4 },
    { key: 'family_onchidiidae', displayName: 'Family onchidiidae', priority: 4 },
    { key: 'meiniplotia_scabra_ms3', displayName: 'Meiniplotia scabra', priority: 4 },

    // Bivalve Species Counts
    { key: 'meretrix_casta_MC', displayName: 'Meretrix casta (Cap)', priority: 4 },
    { key: 'gelonia_coaxons_GC', displayName: 'Gelonia coaxons', priority: 4 },
    { key: 'magallana_belcheri_MB1', displayName: 'Magallana belcheri', priority: 4 },
    { key: 'magallana_bilineata_MB2', displayName: 'Magallana bilineata', priority: 4 },
    { key: 'saccostra_scyphophilla_SS', displayName: 'Saccostra scyphophilla', priority: 4 },
    { key: 'saccostra_cucullata_SC', displayName: 'Saccostra cucullata', priority: 4 },
    { key: 'martesia_striata_MS1', displayName: 'Martesia striata', priority: 4 },
    { key: 'barnacle_sp_b', displayName: 'Barnacle sp.', priority: 4 },
    { key: 'mytella_strigata_MS2', displayName: 'Mytella strigata', priority: 4 },
    { key: 'corbicula_solida_cs', displayName: 'Corbicula solida', priority: 4 },
    { key: 'meretrix_casta_mc', displayName: 'Meretrix casta', priority: 4 },
    { key: 'gelonia_coaxans_gc', displayName: 'Gelonia coaxans', priority: 4 },
    { key: 'magallana_belcheri_mb1', displayName: 'Magallana belcheri', priority: 4 },
    { key: 'magallana_bilineata_mb2', displayName: 'Magallana bilineata', priority: 4 },
    { key: 'saccostrea_scyphophilla_ss', displayName: 'Saccostrea scyphophilla', priority: 4 },
    { key: 'saccostrea_cucullata_sc', displayName: 'Saccostrea cucullata', priority: 4 },
    { key: 'martesia_striata_ms', displayName: 'Martesia striata', priority: 4 },
    { key: 'ballanus_sp_b', displayName: 'Ballanus sp.', priority: 4 },
    { key: 'mytella_strigata_ms2', displayName: 'Mytella strigata', priority: 4 }
  ];

  // Function to determine which columns have data and should be displayed
  const determineVisibleColumns = (dataArray) => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      // Default to showing only priority 1 columns when no data
      setVisibleColumns(allColumns.filter(col => col.priority === 1));
      return;
    }

    if (showAllColumns) {
      // Show all columns when toggle is enabled
      setVisibleColumns(allColumns);
      return;
    }

    // Priority 1 columns are always shown
    const priority1Columns = allColumns.filter(col => col.priority === 1);
    const columnsWithData = new Set();

    // Add priority 1 columns
    priority1Columns.forEach(col => columnsWithData.add(col.key));

    // Check all other columns
    allColumns.filter(col => col.priority > 1).forEach(column => {
      // Check if any row has a value for this column
      const hasValue = dataArray.some(row => {
        const value = row[column.key];
        return value !== undefined && value !== null && value !== '';
      });

      // If at least one row has a value, add this column
      if (hasValue) {
        columnsWithData.add(column.key);
      }
    });

    // Create the final visible columns array
    const visibleColumnsArray = allColumns.filter(col =>
      columnsWithData.has(col.key)
    );

    setVisibleColumns(visibleColumnsArray);
  };

  // Extract image URI from remarks
  const extractImageUri = (remark) => {
    if (!remark || typeof remark !== 'string') return null;

    const match = remark.match(/Image URI:\s*(\S+)/);
    return match ? match[1] : null;
  };

  // Fetch data from the API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Add pagination parameters to the request
      const response = await fetch(`${API_URL}/bivalvi-form-entries?page=${currentPage}&limit=${entriesPerPage}`);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      let processedData = [];
      if (result.data && Array.isArray(result.data)) {
        processedData = result.data;

        // Set pagination information if available
        if (result.pagination) {
          setTotalPages(result.pagination.pages);
          setTotalEntries(result.pagination.total);
        }
      } else if (Array.isArray(result)) {
        processedData = result;
      } else {
        console.warn('Unexpected data format:', result);
        processedData = [];
      }

      // Process and format the data
      const formattedData = processDataForDisplay(processedData);
      setData(formattedData);

      // Determine which columns to display based on data
      determineVisibleColumns(formattedData);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setIsLoading(false);
      setData([]);
    }
  };

  // Process data for display
  const processDataForDisplay = (dataArray) => {
    if (!Array.isArray(dataArray)) return [];

    return dataArray.map(item => {
      const processedItem = { ...item };

      // Process time fields to ensure they're in HH:MM format
      timeFields.forEach(field => {
        if (processedItem[field]) {
          processedItem[field] = formatTimeForDisplay(processedItem[field]);
        }
      });

      // Process date fields
      dateFields.forEach(field => {
        if (processedItem[field]) {
          try {
            const date = new Date(processedItem[field]);
            if (!isNaN(date.getTime())) {
              processedItem[field] = date.toISOString();
            }
          } catch (error) {
            console.error('Error processing date field:', error);
          }
        }
      });

      // Ensure numeric fields are numbers
      numericFields.forEach(field => {
        if (processedItem[field] !== undefined && processedItem[field] !== null) {
          if (typeof processedItem[field] === 'string') {
            const numValue = parseFloat(processedItem[field]);
            if (!isNaN(numValue)) {
              processedItem[field] = numValue;
            }
          }
        }
      });

      // Check for image URI in remarks if imageUri is not present
      if (!processedItem.imageUri && processedItem.remark) {
        const uriFromRemark = extractImageUri(processedItem.remark);
        if (uriFromRemark) {
          processedItem.imageUri = uriFromRemark;
        }
      }

      // Process content array if it exists
      if (processedItem.content && Array.isArray(processedItem.content)) {
        // Ensure proper structure with type, text, and uri fields
        processedItem.content = processedItem.content.map(item => {
          if (typeof item === 'string') {
            // Try to parse if it's a JSON string
            try {
              return JSON.parse(item);
            } catch {
              // If not a valid JSON, assume it's text
              return { type: 'text', text: item };
            }
          }
          return item;
        });
      } else if (!processedItem.content) {
        processedItem.content = [];
      }

      // Fix for quadratSize and area_of_quadrat_size
      // If quadratSize exists but quadrat_size_m does not, copy it
      if (processedItem.quadratSize !== undefined && processedItem.quadrat_size_m === undefined) {
        processedItem.quadrat_size_m = processedItem.quadratSize;
      }
      // If quadrat_size_m exists but quadratSize does not, copy it
      else if (processedItem.quadrat_size_m !== undefined && processedItem.quadratSize === undefined) {
        processedItem.quadratSize = processedItem.quadrat_size_m;
      }

      // Calculate area_of_quadrat_size if it doesn't exist but we have the size
      if (processedItem.area_of_quadrat_size === undefined || processedItem.area_of_quadrat_size === null) {
        const size = processedItem.quadratSize || processedItem.quadrat_size_m;
        if (size !== undefined && size !== null) {
          // Assuming the quadrat is square, area = size²
          const numSize = parseFloat(size);
          if (!isNaN(numSize)) {
            processedItem.area_of_quadrat_size = numSize * numSize;
          }
        }
      }

      return processedItem;
    });
  };

  // Format time for display
  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return '';

    // If it's already in HH:MM format, return as is
    if (typeof timeString === 'string' && timeString.includes(':') && timeString.length <= 8) {
      return timeString;
    }

    try {
      // Try to parse as date object
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        // Return only the time part
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      return timeString;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Parse time string to Date object
  const parseTimeString = (timeString) => {
    if (!timeString) return new Date();

    try {
      let hours = 0;
      let minutes = 0;

      if (timeString.includes(':')) {
        // Format: "HH:MM"
        const [h, m] = timeString.split(':');
        hours = parseInt(h, 10) || 0;
        minutes = parseInt(m, 10) || 0;
      } else {
        // Just use the string as is
        return new Date();
      }

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    } catch (error) {
      console.error('Error parsing time:', error);
      return new Date();
    }
  };

  // Date and time picker handler functions
  const showDatePickerFor = (fieldName) => {
    setDateField(fieldName);
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      // Update the form data with the new date
      const formattedDate = selectedDate.toISOString();
      setEditFormData(prev => ({
        ...prev,
        [dateField]: formattedDate
      }));
    }
  };

  const showTimePickerFor = (fieldName) => {
    setTimeField(fieldName);
    setShowTimePicker(true);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');

    if (selectedTime) {
      // Format the time as a string (HH:MM format)
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      setEditFormData(prev => ({
        ...prev,
        [timeField]: formattedTime
      }));
    }
  };

  // Handle year picker for restoration year
  const showYearPickerFor = (fieldName) => {
    setDateField(fieldName);
    // Use current year as default or existing value if present
    const currentYear = new Date().getFullYear();
    const existingYear = editFormData[fieldName] ? parseInt(editFormData[fieldName], 10) : null;
    const initialDate = existingYear
      ? new Date(existingYear, 0, 1)
      : new Date(currentYear - 5, 0, 1);

    setYearPickerDate(initialDate);
    setShowYearPicker(true);
  };

  const handleYearChange = (event, selectedDate) => {
    setShowYearPicker(Platform.OS === 'ios');

    if (selectedDate) {
      // Extract just the year from the date
      const year = selectedDate.getFullYear().toString();
      setEditFormData(prev => ({
        ...prev,
        [dateField]: year
      }));
    }
  };

  // Calculate quadrat area when size changes
  const calculateQuadratArea = (size) => {
    const numSize = parseFloat(size);
    if (!isNaN(numSize)) {
      // Update both the size field variants
      const area = numSize * numSize;
      setEditFormData(prev => ({
        ...prev,
        area_of_quadrat_size: area
      }));
    }
  };

  // Handle image upload via camera
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
        const uri = response.assets[0].uri;
        setImageUri(uri);
        // Add to content array
        const newContent = [...(editFormData.content || []), { type: 'image', uri }];
        setEditFormData(prev => ({
          ...prev,
          imageUri: uri,
          content: newContent
        }));
      }
    });
  };

  // Handle image pick from gallery
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
        const uri = response.assets[0].uri;
        setImageUri(uri);
        // Add to content array
        const newContent = [...(editFormData.content || []), { type: 'image', uri }];
        setEditFormData(prev => ({
          ...prev,
          imageUri: uri,
          content: newContent
        }));
      }
    });
  };

  // Add text to notes/content
  const addTextToContent = () => {
    if (text.trim()) {
      const newContent = [...(editFormData.content || []), { type: 'text', text }];
      const newRemark = editFormData.remark ? `${editFormData.remark}\n${text}` : text;

      setEditFormData(prev => ({
        ...prev,
        content: newContent,
        remark: newRemark
      }));

      setText('');
    }
  };

  // Handle choosing photo method (camera or gallery)
  const handleChoosePhoto = () => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  // Handle input changes in the edit modal
  const handleInputChange = (field, value) => {
    // Update the form data with the value
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Special handling for quadratSize/quadrat_size_m fields
    if (field === 'quadratSize' || field === 'quadrat_size_m') {
      // Update the corresponding field pair
      const correspondingField = field === 'quadratSize' ? 'quadrat_size_m' : 'quadratSize';
      setEditFormData(prev => ({
        ...prev,
        [correspondingField]: value
      }));

      // Calculate area when size changes
      calculateQuadratArea(value);
    }

    // Special handling for fields with "Other" selection
    if (value === 'Other' && customFieldMappings[field]) {
      // Initialize the custom field if it doesn't exist
      if (!editFormData[customFieldMappings[field]]) {
        setEditFormData(prev => ({
          ...prev,
          [customFieldMappings[field]]: ''
        }));
      }
    }

    // Special handling for "Remark" in weather conditions
    if ((field === 'selectedWeatherConditions' || field === 'weatherCondition') && value === 'Remark') {
      if (!editFormData.weatherRemark) {
        setEditFormData(prev => ({
          ...prev,
          weatherRemark: ''
        }));
      }
    }

    // Handle conditional fields
    if (field === 'SamplingLayer' || field === 'samplingLayer') {
      // Reset sampling method when layer changes
      setEditFormData(prev => ({
        ...prev,
        sampling_method: null,
        samplingMethod: null
      }));
    }
  };

  // Get sampling method options based on sampling layer
  const getSamplingMethodOptions = (layer) => {
    if (layer && samplingMethodOptions[layer]) {
      return samplingMethodOptions[layer];
    }
    return defaultSamplingMethodOptions;
  };

  // Check if a value is one of the standard options in a dropdown
  const isStandardOption = (field, value) => {
    if (!dropdownFields[field] || !value) return false;
    return dropdownFields[field].some(option => option.value === value);
  };

  // Open the edit modal
  const openEditModal = (item) => {
    // Create a fresh copy of the item for editing
    const formattedItem = { ...item };

    // Format date field if it exists
    if (formattedItem.select_date) {
      try {
        // Ensure it's stored as ISO string for consistency
        const date = new Date(formattedItem.select_date);
        if (!isNaN(date.getTime())) {
          formattedItem.select_date = date.toISOString();
        }
      } catch (error) {
        console.error('Error formatting date:', error);
      }
    }

    // Normalize quadratSize/quadrat_size_m fields
    if (formattedItem.quadratSize !== undefined && formattedItem.quadrat_size_m === undefined) {
      formattedItem.quadrat_size_m = formattedItem.quadratSize;
    } else if (formattedItem.quadrat_size_m !== undefined && formattedItem.quadratSize === undefined) {
      formattedItem.quadratSize = formattedItem.quadrat_size_m;
    }

    // Check for image URI in remarks if imageUri is not present
    if (!formattedItem.imageUri && formattedItem.remark) {
      const uriFromRemark = extractImageUri(formattedItem.remark);
      if (uriFromRemark) {
        formattedItem.imageUri = uriFromRemark;
      }
    }

    // Parse content if it's a string
    if (formattedItem.content && typeof formattedItem.content === 'string') {
      try {
        formattedItem.content = JSON.parse(formattedItem.content);
      } catch (e) {
        console.error('Error parsing content JSON:', e);
        formattedItem.content = [];
      }
    } else if (!Array.isArray(formattedItem.content)) {
      formattedItem.content = [];
    }

    // Handle "Other" selections
    Object.keys(customFieldMappings).forEach(field => {
      const customField = customFieldMappings[field];

      // If field value is not one of standard options and we have a custom field,
      // set up the data for displaying in the edit form
      if (formattedItem[field] && !isStandardOption(field, formattedItem[field])) {
        // Store the custom value
        formattedItem[customField] = formattedItem[field];
        // Set the field to "Other" for the dropdown
        formattedItem[field] = 'Other';
      }
    });

    // Handle "Remark" weather condition
    if ((formattedItem.selectedWeatherConditions === 'Remark' ||
      formattedItem.weatherCondition === 'Remark') &&
      !formattedItem.weatherRemark) {
      formattedItem.weatherRemark = '';
    }

    // Set the formatted item for editing
    setEditFormData(formattedItem);
    setEditItem(item);
    setIsEditModalVisible(true);

    // Set imageUri if it exists
    if (formattedItem.imageUri) {
      setImageUri(formattedItem.imageUri);
    } else {
      setImageUri(null);
    }

    // Set content state based on formattedItem.content
    setContent(formattedItem.content || []);
  };

  // Handle update of an item
  const handleUpdate = async () => {
    try {
      if (!editItem || !editItem._id) {
        Alert.alert('Error', 'No item selected for update');
        return;
      }

      // Create a copy of the edit form data
      const itemToUpdate = { ...editFormData };

      // Remove the survey_no field so it won't be updated
      delete itemToUpdate.survey_no;

      // Also remove the _id field from the request body
      delete itemToUpdate._id;

      // Ensure both quadratSize and quadrat_size_m are synchronized
      if (itemToUpdate.quadratSize !== undefined) {
        itemToUpdate.quadrat_size_m = itemToUpdate.quadratSize;
      } else if (itemToUpdate.quadrat_size_m !== undefined) {
        itemToUpdate.quadratSize = itemToUpdate.quadrat_size_m;
      }

      // Handle "Other" selections - if the main field is "Other", use the custom value
      Object.keys(customFieldMappings).forEach(field => {
        const customField = customFieldMappings[field];

        if (itemToUpdate[field] === 'Other' && itemToUpdate[customField]) {
          // Store the custom value in the main field for display and storage
          itemToUpdate[field] = itemToUpdate[customField];
        }
      });

      // Handle remarks in weather condition
      if (editFormData.selectedWeatherConditions === 'Remark' && editFormData.weatherRemark) {
        // Keep the remark field for display along with 'Remark' selection
        itemToUpdate.selectedWeatherConditions = 'Remark';
      }

      // Format date field explicitly if needed
      if (itemToUpdate.select_date) {
        try {
          // Ensure the date is in the format the server expects
          const date = new Date(itemToUpdate.select_date);
          if (!isNaN(date.getTime())) {
            itemToUpdate.select_date = date.toISOString();
          }
        } catch (error) {
          console.error('Error formatting date for update:', error);
        }
      }

      // Convert data types as needed
      Object.keys(itemToUpdate).forEach(key => {
        // Convert numeric fields to numbers
        if (numericFields.includes(key) && typeof itemToUpdate[key] === 'string' && !isNaN(itemToUpdate[key])) {
          itemToUpdate[key] = parseFloat(itemToUpdate[key]);
        }
      });

      console.log('Sending update with data:', JSON.stringify(itemToUpdate, null, 2));

      const response = await fetch(`${API_URL}/bivalvi-form-entry/${editItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemToUpdate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Update failed with status ${response.status}`);
      }

      // Close the modal
      setIsEditModalVisible(false);

      // Refresh data after successful update
      fetchData();
      Alert.alert('Success', 'Entry updated successfully');
    } catch (error) {
      console.error('Error updating entry:', error);
      Alert.alert('Error', `Failed to update: ${error.message}`);
    }
  };

  // Handle deletion of an item
  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/bivalvi-form-entry/${id}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error(`Delete failed with status ${response.status}`);
              }

              // Remove the deleted item from the state
              setData(data.filter(item => item._id !== id));

              // Recalculate visible columns after deletion
              determineVisibleColumns(data.filter(item => item._id !== id));

              // Show success message
              Alert.alert('Success', 'Entry deleted successfully');
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', `Failed to delete: ${error.message}`);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Toggle showing all columns
  const toggleAllColumns = () => {
    setShowAllColumns(!showAllColumns);
    determineVisibleColumns(data);
  };

  // Load data on component mount and when pagination changes
  useEffect(() => {
    fetchData();
  }, [currentPage, entriesPerPage]);

  // Navigate back
  const handleBack = () => {
    navigation.navigate('MangroveNew');
  };

  // Column width for table display
  const columnWidth = 150;

  // Get display value for a cell
  const getCellDisplayValue = (item, colKey) => {
    let displayValue = item[colKey];

    // Special handling for image fields
    if (imageFields.includes(colKey) && item[colKey]) {
      return '[Image]'; // Text representation in the table, the actual image is shown on edit
    }

    // Special handling for remark field
    if (textAreaFields.includes(colKey) && item[colKey]) {
      // Return truncated text for display
      const text = item[colKey].toString();
      return text.length > 30 ? text.substring(0, 30) + '...' : text;
    }

    // Special handling for "Other" selections that have custom values
    if (Object.keys(customFieldMappings).includes(colKey)) {
      const customField = customFieldMappings[colKey];
      if (item[colKey] === 'Other' && item[customField] && item[customField].trim() !== '') {
        displayValue = item[customField];
      }
      // If the value is already a custom value (not in standard options), display it as is
      else if (item[colKey] && !isStandardOption(colKey, item[colKey])) {
        displayValue = item[colKey];
      }
    }

    // Special handling for weather conditions with "Remark"
    if ((colKey === 'selectedWeatherConditions' || colKey === 'weatherCondition') &&
      item[colKey] === 'Remark' && item.weatherRemark) {
      displayValue = `Remark: ${item.weatherRemark}`;
    }

    // Special formatting for time fields
    if (timeFields.includes(colKey) && displayValue) {
      displayValue = formatTimeForDisplay(displayValue);
    } else if (dateFields.includes(colKey) && displayValue) {
      displayValue = formatDateForDisplay(displayValue);
    } else {
      displayValue = formatValue(displayValue);
    }

    return displayValue;
  };

  // Cell with image - displays thumbnails that can be clicked to show full image
  const renderImageCell = (item, colKey) => {
    const imageUrl = item[colKey];
    if (!imageUrl) return <Text style={styles.noImageText}>No Image</Text>;

    const isLocalImage = imageUrl.startsWith('file://');

    return (
      <TouchableOpacity onPress={() => {
        setSelectedImage(imageUrl);
        setImageModalVisible(true);
      }}>
        <View style={styles.imageThumbnailContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.imageThumbnail}
            resizeMode="cover"
          />
          <Text style={styles.viewText}>View</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render input field based on field type
  const renderInputField = (key, displayName) => {
    // Skip the _id field and internal fields
    if (key === '_id' || key === '__v' || key === 'survey_no') return null;

    // Skip rendering custom fields directly - they're now handled with the main field
    if (Object.values(customFieldMappings).includes(key)) return null;

    // Skip duplicate fields
    const mappedFields = {
      'location': 'Location',
      'timeOfDataCollection': 'time_of_data_collection',
      'habitatType': 'plot_habitat_type',
      'vegetation': 'plot_vegetation',
      'microhabitat': 'quadrat_microhabitat',
      'quadratLocation': 'quadrat_location',
      'samplingLayer': 'SamplingLayer',
      'samplingMethod': 'sampling_method',
      'speciesClumped': 'species_seen_clumped',
      'speciesOnRoot': 'species_seen_on_root',
      'isInWater': 'in_water',
      'waterStatus': 'water_status',
      'waterDepth': 'water_depth',
      'weatherCondition': 'selectedWeatherConditions'
    };

    // Special case for quadratSize and quadrat_size_m - only show one of them
    if (key === 'quadrat_size_m' && editFormData.quadratSize !== undefined) {
      return null;
    }

    if (mappedFields[key] && editFormData[mappedFields[key]] !== undefined) {
      return null;
    }

    // Find the column display name if not provided
    if (!displayName) {
      const column = allColumns.find(col => col.key === key);
      displayName = column ? column.displayName : key;
    }

    // Get the current value
    const value = editFormData[key] !== null && editFormData[key] !== undefined
      ? editFormData[key]
      : '';

    // Image fields get special handling
    if (imageFields.includes(key)) {
      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
            {displayName}
          </Text>

          <View style={styles.imageUploadContainer}>
            {imageUri ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={handleChoosePhoto}
                >
                  <Text style={styles.changeImageText}>Change</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleChoosePhoto}
              >
                <Icon name="camera" size={24} color={isDarkTheme ? "#64B5F6" : "#1976D2"} />
                <Text style={[styles.uploadButtonText, isDarkTheme ? styles.darkText : styles.lightText]}>
                  Add Photo
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    // Content array (notes and images) field
    if (key === 'content') {
      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
            Images
          </Text>

          <View style={styles.addContentContainer}>
            <View style={styles.contentButtons}>
              <TouchableOpacity
                style={[styles.contentButton, isDarkTheme ? styles.darkContentButton : styles.lightContentButton]}
                onPress={handleChoosePhoto}
              >
                <Icon name="camera" size={18} color={isDarkTheme ? "#fff" : "#333"} />
                <Text style={isDarkTheme ? styles.darkButtonText : styles.lightButtonText}>
                  Add Image
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      );
    }

    // // Remarks - textArea field
    // if (textAreaFields.includes(key)) {
    //   return (
    //     <View key={key} style={styles.inputContainer}>
    //       <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
    //         {displayName}
    //       </Text>
    //       <TextInput
    //         style={[
    //           styles.textAreaInput,
    //           isDarkTheme ? styles.darkInput : styles.lightInput
    //         ]}
    //         value={String(value || '')}
    //         onChangeText={(text) => handleInputChange(key, text)}
    //         placeholder={`Enter ${displayName.toLowerCase()}`}
    //         placeholderTextColor={isDarkTheme ? "#999" : "#666"}
    //         multiline={true}
    //         numberOfLines={4}
    //         textAlignVertical="top"
    //       />
    //     </View>
    //   );
    // }

    // Species count fields in a more compact layout
    if (numericFields.includes(key) && key.includes('_') && allColumns.find(col => col.key === key && col.priority === 4)) {
      return (
        <View key={key} style={styles.speciesCountField}>
          <Text style={[styles.speciesLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
            {displayName}
          </Text>
          <TextInput
            style={[
              styles.speciesInput,
              isDarkTheme ? styles.darkInput : styles.lightInput
            ]}
            value={String(value)}
            onChangeText={(text) => handleInputChange(key, text)}
            keyboardType="numeric"
            placeholderTextColor={isDarkTheme ? "#999" : "#666"}
          />
        </View>
      );
    }

    // Special handling for date fields
    if (dateFields.includes(key)) {
      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
            {displayName}
          </Text>
          <TouchableOpacity
            style={[
              styles.dateTimeInput,
              isDarkTheme ? styles.darkInput : styles.lightInput,
            ]}
            onPress={() => showDatePickerFor(key)}
          >
            <Text style={[styles.dateTimeText, isDarkTheme ? styles.darkText : styles.lightText]}>
              {formatDateForDisplay(value) || 'Select Date'}
            </Text>
            <Icon name="calendar-today" size={20} color={isDarkTheme ? "#64B5F6" : "#1976D2"} />
          </TouchableOpacity>
        </View>
      );
    }

    // Special handling for time fields
    else if (timeFields.includes(key)) {
      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
            {displayName}
          </Text>
          <TouchableOpacity
            style={[
              styles.dateTimeInput,
              isDarkTheme ? styles.darkInput : styles.lightInput,
            ]}
            onPress={() => showTimePickerFor(key)}
          >
            <Text style={[styles.dateTimeText, isDarkTheme ? styles.darkText : styles.lightText]}>
              {value || 'Select Time'}
            </Text>
            <Icon name="access-time" size={20} color={isDarkTheme ? "#64B5F6" : "#1976D2"} />
          </TouchableOpacity>
        </View>
      );
    }

    // Special handling for restoration year
    else if (key === 'if_restored_year_of_restoration' || key === 'restorationYear') {
      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
            {displayName}
          </Text>
          <TouchableOpacity
            style={[
              styles.dateTimeInput,
              isDarkTheme ? styles.darkInput : styles.lightInput,
            ]}
            onPress={() => showYearPickerFor(key)}
          >
            <Text style={[styles.dateTimeText, isDarkTheme ? styles.darkText : styles.lightText]}>
              {value || 'Select Year'}
            </Text>
            <Icon name="calendar-today" size={20} color={isDarkTheme ? "#64B5F6" : "#1976D2"} />
          </TouchableOpacity>
        </View>
      );
    }

    // Special handling for the quadrat area field (read-only, calculated from size)
    else if (key === 'area_of_quadrat_size') {
      const size = editFormData.quadratSize || editFormData.quadrat_size_m;
      const area = size ? parseFloat(size) * parseFloat(size) : value;

      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
            {displayName}
          </Text>
          <View
            style={[
              styles.readOnlyField,
              isDarkTheme ? styles.darkReadOnlyField : styles.lightReadOnlyField
            ]}
          >
            <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
              {area || 'Calculated from size'}
            </Text>
          </View>
        </View>
      );
    }

    // Special handling for the sampling method field (dependent on sampling layer)
    else if (key === 'sampling_method' || key === 'samplingMethod') {
      const samplingLayer = editFormData.SamplingLayer || editFormData.samplingLayer;
      const methodOptions = getSamplingMethodOptions(samplingLayer);

      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
            {displayName}
          </Text>
          <Dropdown
            style={[
              styles.dropdown,
              isDarkTheme ? styles.darkInput : styles.lightInput
            ]}
            placeholderStyle={[styles.placeholderStyle, isDarkTheme ? styles.darkText : styles.lightText]}
            selectedTextStyle={[styles.selectedTextStyle, isDarkTheme ? styles.darkText : styles.lightText]}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={methodOptions}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={`Select ${displayName}`}
            searchPlaceholder="Search..."
            value={value}
            onChange={item => handleInputChange(key, item.value)}
            renderRightIcon={() => (
              <Icon name="arrow-drop-down" size={24} color={isDarkTheme ? "#aaa" : "#666"} />
            )}
            itemTextStyle={{ color: isDarkTheme ? '#fff' : '#000' }}
            containerStyle={{
              backgroundColor: isDarkTheme ? '#333' : '#fff',
              borderRadius: 8
            }}
          />
        </View>
      );
    }

    // Special handling for weather remark field
    else if (key === 'weatherRemark') {
      // Only show if weather condition is "Remark"
      if (editFormData.selectedWeatherConditions !== 'Remark' &&
        editFormData.weatherCondition !== 'Remark') {
        return null;
      }

      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
            {displayName}
          </Text>
          <TextInput
            style={[
              styles.input,
              isDarkTheme ? styles.darkInput : styles.lightInput
            ]}
            value={String(value || '')}
            onChangeText={(text) => handleInputChange(key, text)}
            placeholder="Enter weather remark"
            placeholderTextColor={isDarkTheme ? "#999" : "#666"}
          />
        </View>
      );
    }

    // Check if this field should use a dropdown
    else if (dropdownFields[key]) {
      const customField = customFieldMappings[key];
      const isOtherSelected = value === 'Other';

      // For non-standard values, treat as "Other" with custom value
      const isCustomValue = value && !isStandardOption(key, value);
      let dropdownValue = value;

      if (isCustomValue) {
        dropdownValue = 'Other';
      }

      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
            {displayName}
          </Text>
          <Dropdown
            style={[
              styles.dropdown,
              isDarkTheme ? styles.darkInput : styles.lightInput
            ]}
            placeholderStyle={[styles.placeholderStyle, isDarkTheme ? styles.darkText : styles.lightText]}
            selectedTextStyle={[styles.selectedTextStyle, isDarkTheme ? styles.darkText : styles.lightText]}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dropdownFields[key]}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={`Select ${displayName}`}
            searchPlaceholder="Search..."
            value={dropdownValue}
            onChange={item => handleInputChange(key, item.value)}
            renderRightIcon={() => (
              <Icon name="arrow-drop-down" size={24} color={isDarkTheme ? "#aaa" : "#666"} />
            )}
            itemTextStyle={{ color: isDarkTheme ? '#fff' : '#000' }}
            containerStyle={{
              backgroundColor: isDarkTheme ? '#333' : '#fff',
              borderRadius: 8
            }}
          />

          {/* Render the custom field input if "Other" is selected */}
          {(isOtherSelected || isCustomValue) && customField && (
            <View style={styles.customFieldContainer}>
              <Text style={[styles.customFieldLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
                Custom {displayName}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  isDarkTheme ? styles.darkInput : styles.lightInput
                ]}
                value={isCustomValue ? value : (editFormData[customField] || '')}
                onChangeText={(text) => handleInputChange(customField, text)}
                placeholder={`Enter custom ${displayName.toLowerCase()}`}
                placeholderTextColor={isDarkTheme ? "#999" : "#666"}
              />
            </View>
          )}
        </View>
      );
    }

    // For numeric fields
    else if (numericFields.includes(key)) {
      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
            {displayName}
          </Text>
          <View style={styles.numericInputContainer}>
            <TextInput
              style={[
                styles.input,
                isDarkTheme ? styles.darkInput : styles.lightInput
              ]}
              value={String(value)}
              onChangeText={(text) => handleInputChange(key, text)}
              keyboardType="numeric"
              placeholderTextColor={isDarkTheme ? "#999" : "#666"}
            />
            <View style={styles.numericControls}>
              <TouchableOpacity
                style={[styles.numericButton, isDarkTheme ? styles.darkNumericButton : styles.lightNumericButton]}
                onPress={() => handleInputChange(key, String(parseFloat(value || '0') + 1))}
              >
                <Icon name="add" size={18} color={isDarkTheme ? "#fff" : "#333"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.numericButton, isDarkTheme ? styles.darkNumericButton : styles.lightNumericButton]}
                onPress={() => handleInputChange(key, String(Math.max(0, parseFloat(value || '0') - 1)))}
              >
                <Icon name="remove" size={18} color={isDarkTheme ? "#fff" : "#333"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    // Default to text input
    else {
      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
            {displayName}
          </Text>
          <TextInput
            style={[
              styles.input,
              isDarkTheme ? styles.darkInput : styles.lightInput
            ]}
            value={String(value)}
            onChangeText={(text) => handleInputChange(key, text)}
            placeholderTextColor={isDarkTheme ? "#999" : "#666"}
          />
        </View>
      );
    }
  };

  // Filter out duploicates from the edit form data
  const getUniqueFields = () => {
    const primaryFields = {
      'Location': true,
      'time_of_data_collection': true,
      'plot_habitat_type': true,
      'plot_vegetation': true,
      'quadrat_microhabitat': true,
      'quadrat_location': true,
      'SamplingLayer': true,
      'sampling_method': true,
      'species_seen_clumped': true,
      'species_seen_on_root': true,
      'in_water': true,
      'water_status': true,
      'water_depth': true,
      'selectedWeatherConditions': true
    };

    // Only include fields that exist in the edit form data
    return Object.keys(primaryFields).filter(field =>
      editFormData[field] !== undefined);
  };

  // Render the edit modal with all fields from GastropodBivalveForm
  const renderEditModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isEditModalVisible}
      onRequestClose={() => setIsEditModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            isDarkTheme ? styles.darkModalContent : styles.lightModalContent
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDarkTheme ? styles.darkText : styles.lightText]}>
              Edit Survey Entry
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsEditModalVisible(false)}
            >
              <Icon name="close" size={24} color={isDarkTheme ? "#fff" : "#555"} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Survey number - read only */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
                Survey No
              </Text>
              <View
                style={[
                  styles.readOnlyField,
                  isDarkTheme ? styles.darkReadOnlyField : styles.lightReadOnlyField
                ]}
              >
                <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
                  {editFormData.survey_no || 'N/A'}
                </Text>
              </View>
            </View>

            {/* Basic Information Section */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderContainer}>
                <Icon
                  name="info-outline"
                  size={20}
                  color={isDarkTheme ? "#64B5F6" : "#1976D2"}
                  style={styles.sectionIcon}
                />
                <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                  Basic Information
                </Text>
              </View>
              <View style={styles.sectionContent}>
                {renderInputField('select_date', 'Date')}
                {renderInputField('teamMembers', 'Team Members')}
                {getUniqueFields().includes('time_of_data_collection') ?
                  renderInputField('time_of_data_collection', 'Collection Time') :
                  renderInputField('timeOfDataCollection', 'Collection Time')}
                {renderInputField('nearest_high_tide_time', 'High Tide Time')}
                {renderInputField('time_of_sampling', 'Time of Sampling')}
              </View>
            </View>

            {/* Location Information */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderContainer}>
                <Icon
                  name="place"
                  size={20}
                  color={isDarkTheme ? "#81C784" : "#388E3C"}
                  style={styles.sectionIcon}
                />
                <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                  Location Information
                </Text>
              </View>
              <View style={styles.sectionContent}>
                {getUniqueFields().includes('Location') ?
                  renderInputField('Location', 'Location') :
                  renderInputField('location', 'Location')}
              </View>
            </View>

            {/* Weather Information */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderContainer}>
                <Icon
                  name="cloud"
                  size={20}
                  color={isDarkTheme ? "#90CAF9" : "#1565C0"}
                  style={styles.sectionIcon}
                />
                <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                  Weather Information
                </Text>
              </View>
              <View style={styles.sectionContent}>
                {getUniqueFields().includes('selectedWeatherConditions') ?
                  renderInputField('selectedWeatherConditions', 'Weather') :
                  renderInputField('weatherCondition', 'Weather')}
                {renderInputField('weatherRemark', 'Weather Remark')}
              </View>
            </View>

            {/* Sampling Information */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderContainer}>
                <Icon
                  name="science"
                  size={20}
                  color={isDarkTheme ? "#FFB74D" : "#E65100"}
                  style={styles.sectionIcon}
                />
                <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                  Sampling Information
                </Text>
              </View>
              <View style={styles.sectionContent}>
                {getUniqueFields().includes('SamplingLayer') ?
                  renderInputField('SamplingLayer', 'Sampling Layer') :
                  renderInputField('samplingLayer', 'Sampling Layer')}
                {getUniqueFields().includes('sampling_method') ?
                  renderInputField('sampling_method', 'Sampling Method') :
                  renderInputField('samplingMethod', 'Sampling Method')}
              </View>
            </View>

            {/* Conditionally render sampling-specific fields based on method */}
            {(editFormData.sampling_method === 'Quadrat Sampling' || editFormData.samplingMethod === 'Quadrat Sampling') && (
              <View style={styles.formSection}>
                <View style={styles.sectionHeaderContainer}>
                  <Icon
                    name="grid-on"
                    size={20}
                    color={isDarkTheme ? "#CE93D8" : "#7B1FA2"}
                    style={styles.sectionIcon}
                  />
                  <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                    Quadrat Information
                  </Text>
                </View>
                <View style={styles.sectionContent}>
                  {renderInputField('quadratId', 'Quadrat ID')}
                  {renderInputField('quadratObservedBy', 'Observed By')}
                  {renderInputField('dataEnteredBy', 'Data Entered By')}
                  {renderInputField('quadratSize', 'Quadrat Size (m)')}
                  {/* {renderInputField('area_of_quadrat_size', 'Quadrat Area (m²)')} */}
                  {renderInputField('latitude', 'Latitude')}
                  {renderInputField('longitude', 'Longitude')}
                </View>
              </View>
            )}

            {(editFormData.sampling_method === 'Transect Sampling' || editFormData.samplingMethod === 'Transect Sampling') && (
              <View style={styles.formSection}>
                <View style={styles.sectionHeaderContainer}>
                  <Icon
                    name="straighten"
                    size={20}
                    color={isDarkTheme ? "#CE93D8" : "#7B1FA2"}
                    style={styles.sectionIcon}
                  />
                  <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                    Transect Information
                  </Text>
                </View>
                <View style={styles.sectionContent}>
                  {renderInputField('transectId', 'Transect ID')}
                  {renderInputField('transectObservedBy', 'Observed By')}
                  {renderInputField('transectDataEnteredBy', 'Data Entered By')}
                  {renderInputField('transectSize', 'Transect Size')}
                  {renderInputField('transectLatitude', 'Start Latitude')}
                  {renderInputField('transectLongitude', 'Start Longitude')}
                  {renderInputField('endPointLatitude', 'End Latitude')}
                  {renderInputField('endPointLongitude', 'End Longitude')}
                </View>
              </View>
            )}

            {(editFormData.sampling_method === 'Peterson Grab sampling' || editFormData.samplingMethod === 'Peterson Grab sampling') && (
              <View style={styles.formSection}>
                <View style={styles.sectionHeaderContainer}>
                  <Icon
                    name="pan-tool"
                    size={20}
                    color={isDarkTheme ? "#CE93D8" : "#7B1FA2"}
                    style={styles.sectionIcon}
                  />
                  <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                    Peterson Grab Information
                  </Text>
                </View>
                <View style={styles.sectionContent}>
                  {renderInputField('grabId', 'Grab ID')}
                  {renderInputField('grabObservedBy', 'Observed By')}
                  {renderInputField('grabDataEnteredBy', 'Data Entered By')}
                  {renderInputField('grabSize', 'Grab Size')}
                  {renderInputField('grabLatitude', 'Latitude')}
                  {renderInputField('grabLongitude', 'Longitude')}
                </View>
              </View>
            )}

            {(editFormData.sampling_method === 'Soil core sampling' || editFormData.samplingMethod === 'Soil core sampling') && (
              <View style={styles.formSection}>
                <View style={styles.sectionHeaderContainer}>
                  <Icon
                    name="opacity"
                    size={20}
                    color={isDarkTheme ? "#CE93D8" : "#7B1FA2"}
                    style={styles.sectionIcon}
                  />
                  <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                    Soil Core Information
                  </Text>
                </View>
                <View style={styles.sectionContent}>
                  {renderInputField('coreId', 'Core ID')}
                  {renderInputField('coreObservedBy', 'Observed By')}
                  {renderInputField('coreDataEnteredBy', 'Data Entered By')}
                  {renderInputField('coreDepth', 'Core Depth')}
                  {renderInputField('sieveSize', 'Sieve Size')}
                  {renderInputField('coreLatitude', 'Latitude')}
                  {renderInputField('coreLongitude', 'Longitude')}
                </View>
              </View>
            )}

            {/* Habitat Information */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderContainer}>
                <Icon
                  name="terrain"
                  size={20}
                  color={isDarkTheme ? "#A5D6A7" : "#2E7D32"}
                  style={styles.sectionIcon}
                />
                <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                  Habitat Information
                </Text>
              </View>
              <View style={styles.sectionContent}>
                {getUniqueFields().includes('quadrat_location') ?
                  renderInputField('quadrat_location', 'Location') :
                  renderInputField('quadratLocation', 'Location')}
                {getUniqueFields().includes('plot_habitat_type') ?
                  renderInputField('plot_habitat_type', 'Habitat Type') :
                  renderInputField('habitatType', 'Habitat Type')}
                {(editFormData.plot_habitat_type === HABITAT_TYPES.RESTORED || editFormData.habitatType === HABITAT_TYPES.RESTORED) &&
                  renderInputField('if_restored_year_of_restoration', 'Restoration Year')}
                {getUniqueFields().includes('plot_vegetation') ?
                  renderInputField('plot_vegetation', 'Vegetation') :
                  renderInputField('vegetation', 'Vegetation')}
                {getUniqueFields().includes('quadrat_microhabitat') ?
                  renderInputField('quadrat_microhabitat', 'Microhabitat') :
                  renderInputField('microhabitat', 'Microhabitat')}
              </View>
            </View>

            {/* Species Information */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderContainer}>
                <Icon
                  name="pets"
                  size={20}
                  color={isDarkTheme ? "#FFCC80" : "#EF6C00"}
                  style={styles.sectionIcon}
                />
                <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                  Species Information
                </Text>
              </View>
              <View style={styles.sectionContent}>
                {getUniqueFields().includes('species_seen_clumped') ?
                  renderInputField('species_seen_clumped', 'Species Clumped') :
                  renderInputField('speciesClumped', 'Species Clumped')}
                {(editFormData.species_seen_clumped === 'Yes' || editFormData.speciesClumped === 'Yes') && (
                  <View style={styles.nestedFields}>
                    {renderInputField('species_seen_clumped_what', 'Clump No')}
                    {renderInputField('clumped_species_name', 'Species Name')}
                    {renderInputField('clumped_where', 'Clumped Where')}
                    {renderInputField('clumped_count', 'Count')}
                  </View>
                )}
                {getUniqueFields().includes('species_seen_on_root') ?
                  renderInputField('species_seen_on_root', 'Species on Root') :
                  renderInputField('speciesOnRoot', 'Species on Root')}
                {(editFormData.species_seen_on_root === 'Yes' || editFormData.speciesOnRoot === 'Yes') && (
                  <View style={styles.nestedFields}>
                    {renderInputField('species_on_root_where', 'Where')}
                    {renderInputField('species_on_root_what', 'What Species')}
                  </View>
                )}
              </View>
            </View>

            {/* Water Information */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderContainer}>
                <Icon
                  name="water"
                  size={20}
                  color={isDarkTheme ? "#90CAF9" : "#0D47A1"}
                  stylename="water"
                  size={20}
                  color={isDarkTheme ? "#90CAF9" : "#0D47A1"}
                  style={styles.sectionIcon}
                />
                <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                  Water Information
                </Text>
              </View>
              <View style={styles.sectionContent}>
                {getUniqueFields().includes('in_water') ?
                  renderInputField('in_water', 'In Water') :
                  renderInputField('isInWater', 'In Water')}
                {(editFormData.in_water === 'Yes' || editFormData.isInWater === 'Yes') && (
                  <View style={styles.nestedFields}>
                    {getUniqueFields().includes('water_status') ?
                      renderInputField('water_status', 'Water Status') :
                      renderInputField('waterStatus', 'Water Status')}
                    {getUniqueFields().includes('water_depth') ?
                      renderInputField('water_depth', 'Water Depth (cm)') :
                      renderInputField('waterDepth', 'Water Depth')}
                  </View>
                )}
              </View>
            </View>

            {/* Images Section */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderContainer}>
                <Icon
                  name="photo-library"
                  size={20}
                  color={isDarkTheme ? "#FF8A65" : "#D84315"}
                  style={styles.sectionIcon}
                />
                <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                  Upload a Image 
                </Text>
              </View>
              <View style={styles.sectionContent}>
                {renderInputField('imageUri', 'Add Image ')}
                {/* {renderInputField('content', ' Additional Images')} */}
                {/* {renderInputField('remark', 'Remarks')} */}
              </View>
            </View>

            {/* Species Counts */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderContainer}>
                <Icon
                  name="format-list-numbered"
                  size={20}
                  color={isDarkTheme ? "#F48FB1" : "#C2185B"}
                  style={styles.sectionIcon}
                />
                <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                  Gastropod Species Counts
                </Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.speciesGrid}>
                  {allColumns
                    .filter(col => col.priority === 4 && col.displayName.includes('Ellobium') &&
                      (editFormData[col.key] !== undefined && editFormData[col.key] !== null || showAllColumns))
                    .map(col => renderInputField(col.key, col.displayName))}
                  {allColumns
                    .filter(col => col.priority === 4 && col.displayName.includes('Melampus') &&
                      (editFormData[col.key] !== undefined && editFormData[col.key] !== null || showAllColumns))
                    .map(col => renderInputField(col.key, col.displayName))}
                  {allColumns
                    .filter(col => col.priority === 4 &&
                      !col.displayName.includes('Ellobium') &&
                      !col.displayName.includes('Melampus') &&
                      !col.displayName.includes('Meretrix') &&
                      !col.displayName.includes('Gelonia') &&
                      !col.displayName.includes('Magallana') &&
                      !col.displayName.includes('Saccostra') &&
                      !col.displayName.includes('Martesia') &&
                      !col.displayName.includes('Barnacle') &&
                      !col.displayName.includes('Mytella') &&
                      !col.displayName.includes('Corbicula') &&
                      !col.displayName.includes('Ballanus') &&
                      (editFormData[col.key] !== undefined && editFormData[col.key] !== null || showAllColumns))
                    .map(col => renderInputField(col.key, col.displayName))}
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <View style={styles.sectionHeaderContainer}>
                <Icon
                  name="format-list-numbered"
                  size={20}
                  color={isDarkTheme ? "#80DEEA" : "#00838F"}
                  style={styles.sectionIcon}
                />
                <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkSectionTitle : styles.lightSectionTitle]}>
                  Bivalve Species Counts
                </Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.speciesGrid}>
                  {allColumns
                    .filter(col => col.priority === 4 &&
                      (col.displayName.includes('Meretrix') ||
                        col.displayName.includes('Gelonia') ||
                        col.displayName.includes('Magallana') ||
                        col.displayName.includes('Saccostra') ||
                        col.displayName.includes('Saccostrea') ||
                        col.displayName.includes('Martesia') ||
                        col.displayName.includes('Barnacle') ||
                        col.displayName.includes('Ballanus') ||
                        col.displayName.includes('Mytella') ||
                        col.displayName.includes('Corbicula')) &&
                      (editFormData[col.key] !== undefined && editFormData[col.key] !== null || showAllColumns))
                    .map(col => renderInputField(col.key, col.displayName))}
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsEditModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleUpdate}
            >
              <Icon name="save" size={18} color="white" style={styles.buttonIcon} />
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(editFormData[dateField] || new Date())}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Time Picker */}
          {showTimePicker && (
            <DateTimePicker
              testID="timeTimePicker"
              value={parseTimeString(editFormData[timeField])}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}

          {/* Year Picker */}
          {showYearPicker && (
            <DateTimePicker
              testID="yearPicker"
              value={yearPickerDate}
              mode="date"
              display="spinner"
              onChange={handleYearChange}
            />
          )}
        </View>
      </View>
    </Modal>
  );

  // Render the image modal for full-screen image viewing
  const renderImageModal = () => (
    <Modal
      visible={imageModalVisible}
      transparent={true}
      onRequestClose={() => setImageModalVisible(false)}
    >
      <View style={styles.imageModalContainer}>
        <TouchableOpacity
          style={styles.imageModalCloseButton}
          onPress={() => setImageModalVisible(false)}
        >
          <Icon name="close" size={30} color="#fff" />
        </TouchableOpacity>
        <Image
          source={{ uri: selectedImage }}
          style={styles.fullScreenImage}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );

  // Render back button
  const renderBackButton = () => (
    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
      <IconButton
        icon="arrow-left"
        iconColor={isDarkTheme ? "#fff" : "#000"}
        size={24}
      />
      <Text style={[styles.backButtonText, isDarkTheme ? styles.darkText : styles.lightText]}>
        Back
      </Text>
    </TouchableOpacity>
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
        {renderBackButton()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkTheme ? "#fff" : "#4CAF50"} />
          <Text style={[styles.loadingText, isDarkTheme ? styles.darkText : styles.lightText]}>
            Loading data...
          </Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
        {renderBackButton()}
        <View style={styles.errorContainer}>
          <Icon name="error" size={50} color="red" />
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsLoading(true);
              fetchData();
            }}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      {renderBackButton()}

      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, isDarkTheme ? styles.darkText : styles.lightText]}>
          Gastropod and Bivalve Data
        </Text>

        <View style={styles.controlsContainer}>
          <View style={styles.themeSwitchContainer}>
            <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
              Dark Theme
            </Text>
            <Switch
              value={isDarkTheme}
              onValueChange={setIsDarkTheme}
              style={styles.switchControl}
            />
          </View>

          <View style={styles.columnToggleContainer}>
            <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
              Show All Columns
            </Text>
            <Switch
              value={showAllColumns}
              onValueChange={toggleAllColumns}
              style={styles.switchControl}
            />
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchData}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      {data.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Icon name="inbox" size={50} color={isDarkTheme ? "#888" : "#ccc"} />
          <Text style={[styles.noDataText, isDarkTheme ? styles.darkText : styles.lightText]}>
            No data available
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('GastropodBivalveForm')}>
            <Text style={styles.addButtonText}>Add New Data</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.tableHeaderContainer}>
            <Text style={[styles.entriesText, isDarkTheme ? styles.darkText : styles.lightText]}>
              Showing {Math.min(entriesPerPage, data.length)} of {totalEntries} entries
            </Text>
            <Text style={[styles.scrollIndicatorText, isDarkTheme ? styles.darkText : styles.lightText]}>
              Scroll horizontally to see all columns →
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.table}>
              <View
                style={[
                  styles.headerRow,
                  isDarkTheme ? styles.darkHeaderRow : styles.lightHeaderRow,
                ]}>
                {/* Render column headers */}
                {visibleColumns.map((col, index) => (
                  <View
                    key={index}
                    style={[styles.headerCell, { width: columnWidth }]}>
                    <Text
                      style={[
                        styles.headerText,
                        isDarkTheme ? styles.darkText : styles.lightText,
                      ]}>
                      {col.displayName}
                    </Text>
                  </View>
                ))}
                <View style={[styles.headerCell, { width: columnWidth }]}>
                  <Text
                    style={[
                      styles.headerText,
                      isDarkTheme ? styles.darkText : styles.lightText,
                    ]}>
                    Actions
                  </Text>
                </View>
              </View>

              <ScrollView>
                {/* Render data rows */}
                {data.map((item, rowIndex) => (
                  <View
                    key={rowIndex}
                    style={[
                      styles.row,
                      rowIndex % 2 === 0 ?
                        (isDarkTheme ? styles.darkRowEven : styles.lightRowEven) :
                        (isDarkTheme ? styles.darkRowOdd : styles.lightRowOdd),
                    ]}>
                    {visibleColumns.map((col, colIndex) => (
                      <View
                        key={colIndex}
                        style={[styles.cell, { width: columnWidth }]}>
                        {imageFields.includes(col.key) && item[col.key] ? (
                          renderImageCell(item, col.key)
                        ) : (
                          <Text
                            style={[
                              styles.cellText,
                              isDarkTheme ? styles.darkText : styles.lightText,
                            ]}>
                            {getCellDisplayValue(item, col.key)}
                          </Text>
                        )}
                      </View>
                    ))}
                    <View
                      style={[
                        styles.cell,
                        {
                          width: columnWidth,
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        },
                      ]}>
                      <TouchableOpacity onPress={() => openEditModal(item)}>
                        <Icon name="edit" size={24} color={isDarkTheme ? "#4CAF50" : "green"} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item._id)}>
                        <Icon name="delete" size={24} color={isDarkTheme ? "#ff6b6b" : "red"} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                onPress={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <Icon name="navigate-before" size={20} color="white" />
                <Text style={styles.paginationButtonText}>Previous</Text>
              </TouchableOpacity>

              <Text style={[styles.paginationText, isDarkTheme ? styles.darkText : styles.lightText]}>
                Page {currentPage} of {totalPages}
              </Text>

              <TouchableOpacity
                style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                onPress={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.paginationButtonText}>Next</Text>
                <Icon name="navigate-next" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Add button */}
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigation.navigate('GastropodBivalveForm')}
          >
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        </>
      )}

      {/* Render the edit modal */}
      {renderEditModal()}

      {/* Render image modal */}
      {renderImageModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#222',
  },
  headerContainer: {
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 5,
  },
  themeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  columnToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  switchControl: {
    marginLeft: 8,
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  entriesText: {
    fontSize: 14,
  },
  scrollIndicatorText: {
    fontStyle: 'italic',
    fontSize: 14,
  },
  table: {
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
  },
  lightHeaderRow: {
    borderBottomColor: '#ccc',
    backgroundColor: '#e6e6e6',
  },
  darkHeaderRow: {
    borderBottomColor: '#555',
    backgroundColor: '#444',
  },
  headerCell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    minHeight: 48,
  },
  lightRowEven: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#eee',
  },
  lightRowOdd: {
    backgroundColor: '#f9f9f9',
    borderBottomColor: '#eee',
  },
  darkRowEven: {
    backgroundColor: '#333',
    borderBottomColor: '#444',
  },
  darkRowOdd: {
    backgroundColor: '#3a3a3a',
    borderBottomColor: '#444',
  },
  cell: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  cellText: {
    textAlign: 'center',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#f5f5f5',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
 
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  retryButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Pagination styles
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  paginationButton: {
    backgroundColor: '#4285F4',
    padding: 8,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  paginationButtonDisabled: {
    backgroundColor: '#aaa',
  },
  paginationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  paginationText: {
    fontSize: 14,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  lightModalContent: {
    backgroundColor: '#f9f9f9',
  },
  darkModalContent: {
    backgroundColor: '#262626',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  lightModalHeader: {
    borderBottomColor: '#ddd',
    backgroundColor: '#f0f0f0',
  },
  darkModalHeader: {
    borderBottomColor: '#444',
    backgroundColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  modalScrollView: {
    padding: 15,
    maxHeight: '80%',
  },

  // Form section styles
  formSection: {
    marginBottom: 22,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lightFormSection: {
    backgroundColor: '#fff',
  },
  darkFormSection: {
    backgroundColor: '#333',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  lightSectionHeader: {
    borderBottomColor: '#eee',
    backgroundColor: '#f5f5f5',
  },
  darkSectionHeader: {
    borderBottomColor: '#444',
    backgroundColor: '#383838',
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  darkSectionTitle: {
    color: '#f0f0f0',
  },
  lightSectionTitle: {
    color: '#333',
  },
  sectionContent: {
    padding: 12,
  },
  nestedFields: {
    marginLeft: 15,
    borderLeftWidth: 2,
    paddingLeft: 15,
    marginTop: 8,
  },
  lightNestedFields: {
    borderLeftColor: '#ddd',
  },
  darkNestedFields: {
    borderLeftColor: '#555',
  },

  // Input styles
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  darkLabel: {
    color: '#ddd',
  },
  lightLabel: {
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 46,
  },
  darkInput: {
    borderColor: '#555',
    color: '#fff',
    backgroundColor: '#3a3a3a',
  },
  lightInput: {
    borderColor: '#ddd',
    color: '#333',
    backgroundColor: '#fff',
  },
  textAreaInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  readOnlyField: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 46,
  },
  darkReadOnlyField: {
    borderColor: '#444',
    backgroundColor: '#333',
    color: '#aaa',
  },
  lightReadOnlyField: {
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
    color: '#777',
  },
  dateTimeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 46,
  },
  dateTimeText: {
    fontSize: 15,
  },

  // Dropdown styles
  dropdown: {
    height: 46,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 15,
  },
  selectedTextStyle: {
    fontSize: 15,
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 15,
    borderRadius: 6,
  },

  // Custom field styles
  customFieldContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  lightCustomFieldContainer: {
    borderTopColor: '#eee',
  },
  darkCustomFieldContainer: {
    borderTopColor: '#444',
  },
  customFieldLabel: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 6,
  },

  // Numeric input styles
  numericInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numericControls: {
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 46,
  },
  numericButton: {
    width: 28,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  darkNumericButton: {
    backgroundColor: '#555',
  },
  lightNumericButton: {
    backgroundColor: '#ddd',
  },

  // Species count field styles
  speciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  speciesCountField: {
    width: '48%',
    marginBottom: 10,
  },
  speciesLabel: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  speciesInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    minHeight: 38,
  },

  // Button styles
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
  },
  lightModalButtonContainer: {
    borderTopColor: '#eee',
    backgroundColor: '#f0f0f0',
  },
  darkModalButtonContainer: {
    borderTopColor: '#444',
    backgroundColor: '#333',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    minWidth: '45%',
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
  },
  darkCancelButton: {
    backgroundColor: '#555',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonIcon: {
    marginRight: 8,
  },

  // Image field styles
  imageUploadContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: '#f9f9f9',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 6,
    justifyContent: 'center',
    width: '100%',
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    width: '100%',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  changeImageButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  changeImageText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Content array field styles
  contentContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  contentList: {
    maxHeight: 200,
    marginBottom: 10,
  },
  contentItem: {
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  contentImage: {
    width: '100%',
    height: 120,
    borderRadius: 4,
  },
  noContentText: {
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
  addContentContainer: {
    marginTop: 10,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  contentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    justifyContent: 'center',
    flex: 0.48,
  },
  darkContentButton: {
    backgroundColor: '#555',
  },
  lightContentButton: {
    backgroundColor: '#e0e0e0',
  },
  darkButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  lightButtonText: {
    color: '#333',
    marginLeft: 5,
  },

  // Image thumbnail in table styles
  imageThumbnailContainer: {
    alignItems: 'center',
  },
  imageThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginBottom: 4,
  },
  viewText: {
    color: '#4285F4',
    fontSize: 12,
  },
  noImageText: {
    color: '#999',
    fontStyle: 'italic',
    fontSize: 12,
  },

  // Full screen image modal styles
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  imageModalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  }
});

export default MyDataTable;