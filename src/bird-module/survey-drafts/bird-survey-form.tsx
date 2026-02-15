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
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import GetLocation from 'react-native-get-location';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {API_URL} from '../../config';
import {getDatabase} from '../database/db';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation, useRoute} from '@react-navigation/native';
import {birdSpecies} from './bird-list';
import CustomAlert from '../custom-alert/alert-design';

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

const defaultSurveyPoints = [
  {label: 'Point 1', value: 'Point 1'},
  {label: 'Point 2', value: 'Point 2'},
  {label: 'Point 3', value: 'Point 3'},
  {label: 'Point 4', value: 'Point 4'},
  {label: 'Point 5', value: 'Point 5'},
  {label: 'Other', value: 'Other'},
];

const defaultPointTags = [
  {label: 'T1', value: 'T1'},
  {label: 'T2', value: 'T2'},
  {label: 'T3', value: 'T3'},
  {label: 'T4', value: 'T4'},
  {label: 'T5', value: 'T5'},
  {label: 'T6', value: 'T6'},
  {label: 'T7', value: 'T7'},
  {label: 'T8', value: 'T8'},
  {label: 'Other', value: 'Other'},
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
  // {label: 'Thunder Showers', value: 'Thunder Showers'},
];

const windOptions = [
  {label: 'Calm', value: 'Calm'},
  {label: 'Light', value: 'Light'},
  {label: 'Breezy', value: 'Breezy'},
  // {label: 'Gale', value: 'Gale'},
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

const visibilityOptions = [
  {label: 'Good', value: 'Good'},
  {label: 'Moderate', value: 'Moderate'},
  {label: 'Poor', value: 'Poor'},
];

const vegetationStatuses = [
  {label: 'Flowering', value: 'Flowering'},
  {label: 'Fruiting', value: 'Fruiting'},
  {label: 'Dry Vegetation', value: 'Dry Vegetation'},
  {label: 'Other', value: 'Other'},
];

const dominantVegetationTypes = [
  {label: 'Seedlings', value: 'Seedlings'},
  {label: 'Young plants', value: 'Young plants'},
  {label: 'Matured plants', value: 'Matured plants'},
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
  customStatus: '',
  showCustomStatus: false,
  remark: '',
  imageUri: null as string | null,
  imageUris: [] as string[],
  expanded: true,
});

// ========================================
// BIRD OBSERVATION CARD
// ========================================
const BirdObservationCard = ({observation, index, onUpdate, onDelete, onToggle, customBirdStatuses, onAddCustomStatus}: any) => {
  const [speciesFocus, setSpeciesFocus] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const statusData = [
    ...birdStatusOptions.filter(s => s.value !== 'Other'),
    ...(customBirdStatuses || []).map((v: string) => ({label: v, value: v})),
    {label: 'Other', value: 'Other'},
  ];

  const handleBehaviourChange = (item: any) => {
    const current = observation.behaviours || [];
    const updated = current.includes(item.value)
      ? current.filter((b: string) => b !== item.value)
      : [...current, item.value];
    onUpdate({...observation, behaviours: updated});
  };

  const handleCamera = () => {
    setShowPhotoModal(false);
    launchCamera({mediaType: 'photo', quality: 1}, response => {
      if (response.assets && response.assets.length > 0) {
        const newUris = [...(observation.imageUris || []), ...response.assets.map(a => a.uri)];
        onUpdate({...observation, imageUri: newUris[0], imageUris: newUris});
      }
    });
  };

  const handleGallery = () => {
    setShowPhotoModal(false);
    launchImageLibrary({mediaType: 'photo', quality: 1, selectionLimit: 0}, response => {
      if (response.assets && response.assets.length > 0) {
        const newUris = [...(observation.imageUris || []), ...response.assets.map(a => a.uri)];
        onUpdate({...observation, imageUri: newUris[0], imageUris: newUris});
      }
    });
  };

  const removePhoto = (photoIndex: number) => {
    const updated = (observation.imageUris || []).filter((_: any, i: number) => i !== photoIndex);
    onUpdate({...observation, imageUri: updated[0] || null, imageUris: updated});
  };

  return (
    <View style={cardStyles.card}>
      <TouchableOpacity onPress={onToggle} style={cardStyles.cardHeader}>
        <Text style={cardStyles.cardTitle}>
          Bird Record Form {index + 1}
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
            data={statusData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={observation.status || 'Status'}
            value={observation.status}
            onChange={item => {
              if (item.value === 'Other') {
                onUpdate({...observation, showCustomStatus: true});
              } else {
                onUpdate({...observation, status: item.value, showCustomStatus: false});
              }
            }}
          />
          {observation.showCustomStatus && (
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 4}}>
              <TextInput
                mode="outlined"
                placeholder="Enter new status"
                value={observation.customStatus || ''}
                onChangeText={val => onUpdate({...observation, customStatus: val})}
                outlineStyle={cardStyles.txtInputOutline}
                style={[cardStyles.textInput, {flex: 1, marginRight: 8, marginBottom: 0}]}
                textColor="#333"
              />
              <TouchableOpacity
                onPress={() => {
                  const val = (observation.customStatus || '').trim();
                  if (val && onAddCustomStatus) {
                    onAddCustomStatus(val);
                    onUpdate({...observation, status: val, showCustomStatus: false, customStatus: ''});
                  }
                }}
                style={{backgroundColor: '#4A7856', padding: 10, borderRadius: 8, marginRight: 4}}>
                <Icon name="plus" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onUpdate({...observation, showCustomStatus: false, customStatus: ''})}
                style={{padding: 10}}>
                <Icon name="times" size={16} color="#999" />
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            mode="outlined"
            placeholder="Note"
            value={observation.remark}
            onChangeText={val => onUpdate({...observation, remark: val})}
            outlineStyle={cardStyles.txtInputOutline}
            style={[cardStyles.textInput, {height: 80}]}
            textColor="#333"
            multiline
          />

          <Text style={cardStyles.photoLabel}>Photos</Text>
          {(observation.imageUris || []).length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 10}}>
              {(observation.imageUris || []).map((uri: string, photoIdx: number) => (
                <View key={photoIdx} style={{marginRight: 8, position: 'relative'}}>
                  <Image source={{uri}} style={{width: 80, height: 80, borderRadius: 8}} />
                  <TouchableOpacity
                    style={cardStyles.removePhotoButton}
                    onPress={() => removePhoto(photoIdx)}
                    activeOpacity={0.8}>
                    <MaterialIcon name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
          <TouchableOpacity
            style={cardStyles.photoUploadArea}
            onPress={() => setShowPhotoModal(true)}
            activeOpacity={0.7}>
            <View style={cardStyles.photoPlaceholder}>
              <MaterialIcon name="add-a-photo" size={40} color="#CCC" />
              <Text style={cardStyles.photoPlaceholderText}>
                {(observation.imageUris || []).length > 0 ? 'Add more photos' : 'Tap to upload or capture photos'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Photo Picker Modal */}
          <Modal visible={showPhotoModal} transparent animationType="fade">
            <View style={cardStyles.imagePickerOverlay}>
              <View style={cardStyles.imagePickerContainer}>
                <Text style={cardStyles.imagePickerTitle}>Choose an option</Text>
                <View style={cardStyles.imagePickerOptions}>
                  <TouchableOpacity style={cardStyles.imagePickerOption} onPress={handleCamera} activeOpacity={0.7}>
                    <MaterialIcon name="photo-camera" size={50} color={GREEN} />
                    <Text style={cardStyles.imagePickerOptionText}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={cardStyles.imagePickerOption} onPress={handleGallery} activeOpacity={0.7}>
                    <MaterialIcon name="photo-library" size={50} color={GREEN} />
                    <Text style={cardStyles.imagePickerOptionText}>Gallery</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={cardStyles.imagePickerCancelButton} onPress={() => setShowPhotoModal(false)}>
                  <Text style={cardStyles.imagePickerCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  const [visibilityVal, setVisibilityVal] = useState<string | null>(null);
  const [summary, setSummary] = useState('');

  const updateSummary = (c: string | null, r: string | null, w: string | null, s: string | null, v: string | null) => {
    const parts = [];
    if (c) parts.push(`Cloud - ${c}`);
    if (r) parts.push(`Rain - ${r}`);
    if (w) parts.push(`Wind - ${w}`);
    if (s) parts.push(`Sunshine - ${s}`);
    if (v) parts.push(`Visibility - ${v}`);
    setSummary(parts.join(', '));
  };

  const modalDd = {height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 8, backgroundColor: 'white', marginBottom: 10, width: '100%' as const};
  const containerS = {backgroundColor: 'white', borderColor: '#ccc', borderWidth: 1, borderRadius: 8};

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{summary || 'Select Weather Condition'}</Text>
          <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
            data={cloudCoverOptions} labelField="label" valueField="value" placeholder="Cloud Cover" value={cloudCover}
            onChange={item => { setCloudCover(p => p === item.value ? null : item.value); updateSummary(item.value, rain, wind, sunshine, visibilityVal); }} />
          <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
            data={rainOptions} labelField="label" valueField="value" placeholder="Rain" value={rain}
            onChange={item => { setRain(p => p === item.value ? null : item.value); updateSummary(cloudCover, item.value, wind, sunshine, visibilityVal); }} />
          <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
            data={windOptions} labelField="label" valueField="value" placeholder="Wind" value={wind}
            onChange={item => { setWind(p => p === item.value ? null : item.value); updateSummary(cloudCover, rain, item.value, sunshine, visibilityVal); }} />
          <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
            data={sunshineOptions} labelField="label" valueField="value" placeholder="Sunshine" value={sunshine}
            onChange={item => { setSunshine(p => p === item.value ? null : item.value); updateSummary(cloudCover, rain, wind, item.value, visibilityVal); }} />
          <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
            data={visibilityOptions} labelField="label" valueField="value" placeholder="Visibility" value={visibilityVal}
            onChange={item => { setVisibilityVal(p => p === item.value ? null : item.value); updateSummary(cloudCover, rain, wind, sunshine, item.value); }} />
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
  const [onLandWaterLevel, setOnLandWaterLevel] = useState('');
  const [waterReservoir, setWaterReservoir] = useState<string | null>(null);
  const [waterLevel, setWaterLevel] = useState('');

  const modalDd = {height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 8, backgroundColor: 'white', marginBottom: 10, width: '100%' as const};
  const containerS = {backgroundColor: 'white', borderColor: '#ccc', borderWidth: 1, borderRadius: 8};

  const buildResult = () => {
    const parts = [];
    if (onLand === 'Yes' && onLandWaterLevel) parts.push(`On Land - Yes (Level: ${onLandWaterLevel} cm)`);
    else if (onLand) parts.push(`On Land - ${onLand}`);
    if (waterReservoir === 'Yes' && waterLevel) parts.push(`Water Status - Yes (Level: ${waterLevel} cm)`);
    else if (waterReservoir) parts.push(`Water Status - ${waterReservoir}`);
    return parts.join(', ');
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Water Availability</Text>
            <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
              data={yesNoOptions} labelField="label" valueField="value" placeholder="On Land" value={onLand}
              onChange={item => setOnLand(p => p === item.value ? null : item.value)} />
            {onLand === 'Yes' && (
              <View style={{width: '100%', marginBottom: 10}}>
                <TextInput mode="outlined" placeholder="Water Level"
                  value={onLandWaterLevel}
                  onChangeText={text => setOnLandWaterLevel(text.replace(/[^0-9.]/g, ''))}
                  keyboardType="numeric" style={{width: '100%', backgroundColor: 'white'}} textColor="#333"
                  right={<TextInput.Affix text="cm" textStyle={{color: '#666'}} />}
                />
              </View>
            )}
            <Dropdown style={modalDd} placeholderStyle={{color: 'black'}} selectedTextStyle={{color: 'black'}} itemTextStyle={{color: 'black'}} containerStyle={containerS}
              data={yesNoOptions} labelField="label" valueField="value" placeholder="Water Status" value={waterReservoir}
              onChange={item => setWaterReservoir(p => p === item.value ? null : item.value)} />
            {waterReservoir === 'Yes' && (
              <View style={{width: '100%', marginBottom: 10}}>
                <TextInput mode="outlined" placeholder="Water Level"
                  value={waterLevel}
                  onChangeText={text => setWaterLevel(text.replace(/[^0-9.]/g, ''))}
                  keyboardType="numeric" style={{width: '100%', backgroundColor: 'white'}} textColor="#333"
                  right={<TextInput.Affix text="cm" textStyle={{color: '#666'}} />}
                />
              </View>
            )}
            <Button mode="contained" onPress={() => { onSelect(buildResult()); onClose(); }}
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
  const route = useRoute<any>();
  const draftData = route?.params?.draftData || null;
  const existingDraftId = route?.params?.draftId || null;
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<any>({});
  // Step 1: Survey Point Details
  const [habitatType, setHabitatType] = useState<string | null>(null);
  const [point, setPoint] = useState<string | null>(null);
  const [pointTag, setPointTag] = useState<string | null>(null);
  const [descriptor, setDescriptor] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');

  // Custom categories (user-added "Other" values)
  const [customHabitatTypes, setCustomHabitatTypes] = useState<string[]>([]);
  const [customPoints, setCustomPoints] = useState<string[]>([]);
  const [customPointTags, setCustomPointTags] = useState<string[]>([]);
  const [customVegetationStatuses, setCustomVegetationStatuses] = useState<string[]>([]);
  const [customBirdStatuses, setCustomBirdStatuses] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState<{[key: string]: boolean}>({});
  const [customInputValue, setCustomInputValue] = useState('');

  // Team members (inline management in Step 1)
  const [memberInput, setMemberInput] = useState('');
  const [editMemberIndex, setEditMemberIndex] = useState<number | null>(null);
  const [rawTeamMembers, setRawTeamMembers] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState('');

  // Step 2: Common Data
  const [date, setDate] = useState(new Date());
  const [dateText, setDateText] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [observers, setObservers] = useState('');
  const [teamMembers, setTeamMembers] = useState<{label: string; value: string}[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedWeatherString, setSelectedWeatherString] = useState('');
  const [isWeatherModalVisible, setWeatherModalVisible] = useState(false);
  const [selectedWaterString, setSelectedWaterString] = useState('');
  const [isWaterModalVisible, setWaterModalVisible] = useState(false);
  const [paddySeason, setPaddySeason] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<string | null>(null);
  const [vegetationStatus, setVegetationStatus] = useState<string | null>(null);
  const [dominantVegetation, setDominantVegetation] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Step 3: Bird Observations
  const [birdDataArray, setBirdDataArray] = useState<any[]>([]);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Focus states
  const [focusStates, setFocusStates] = useState<{[key: string]: boolean}>({});
  const setFocus = (key: string, val: boolean) => setFocusStates(prev => ({...prev, [key]: val}));

  // ===== INITIALIZATION =====
  useEffect(() => {
    initDatabase();
    requestLocationPermission();
    initUserData();
    const subscription = NetInfo.addEventListener(state => {
      if (state.isConnected) retryFailedSubmissions();
    });
    return () => subscription();
  }, []);

  const getUserEmail = async (): Promise<string> => {
    return new Promise((resolve) => {
      getDatabase().then(db => {
        db.transaction((tx: any) => {
          tx.executeSql('SELECT email FROM LoginData LIMIT 1', [], (_: any, results: any) => {
            if (results.rows.length > 0) {
              const email = results.rows.item(0).email;
              setUserEmail(email);
              resolve(email);
            } else {
              resolve('');
            }
          });
        });
      }).catch(() => resolve(''));
    });
  };

  const initUserData = async () => {
    const email = await getUserEmail();
    if (email) {
      fetchTeamMembers(email);
      fetchCustomCategories(email);
    }
  };

  const fetchTeamMembers = async (email?: string) => {
    const emailToUse = email || userEmail;
    if (!emailToUse) return;
    try {
      const response = await axios.get(`${API_URL}/getTeamMembers`, {
        params: {email: emailToUse, moduleType: 'bird'},
      });
      if (response.data.teamMembers) {
        setRawTeamMembers(response.data.teamMembers);
        setTeamMembers(
          response.data.teamMembers.map((name: string) => ({label: name, value: name})),
        );
      }
    } catch (error) {
      console.log('Could not fetch team members:', error);
    }
  };

  const fetchCustomCategories = async (email?: string) => {
    const emailToUse = email || userEmail;
    if (!emailToUse) return;
    try {
      const response = await axios.get(`${API_URL}/getCustomCategories`, {
        params: {email: emailToUse},
      });
      if (response.data.customHabitatTypes) setCustomHabitatTypes(response.data.customHabitatTypes);
      if (response.data.customPoints) setCustomPoints(response.data.customPoints);
      if (response.data.customPointTags) setCustomPointTags(response.data.customPointTags);
      if (response.data.customVegetationStatuses) setCustomVegetationStatuses(response.data.customVegetationStatuses);
      if (response.data.customBirdStatuses) setCustomBirdStatuses(response.data.customBirdStatuses);
    } catch (error) {
      console.log('Could not fetch custom categories:', error);
    }
  };

  const addCustomCategory = async (categoryType: string, value: string) => {
    if (!userEmail || !value.trim()) return;
    try {
      await axios.post(`${API_URL}/addCustomCategory`, {
        email: userEmail, categoryType, value: value.trim(),
      });
      if (categoryType === 'customHabitatTypes') {
        setCustomHabitatTypes(prev => [...prev, value.trim()]);
        setHabitatType(value.trim());
      } else if (categoryType === 'customPoints') {
        setCustomPoints(prev => [...prev, value.trim()]);
        setPoint(value.trim());
      } else if (categoryType === 'customPointTags') {
        setCustomPointTags(prev => [...prev, value.trim()]);
        setPointTag(value.trim());
      } else if (categoryType === 'customVegetationStatuses') {
        setCustomVegetationStatuses(prev => [...prev, value.trim()]);
        setVegetationStatus(value.trim());
      } else if (categoryType === 'customBirdStatuses') {
        setCustomBirdStatuses(prev => [...prev, value.trim()]);
      }
      setShowCustomInput({});
      setCustomInputValue('');
    } catch (error) {
      console.log('Could not save custom category:', error);
    }
  };

  const saveTeamMembers = async (updatedMembers: string[]) => {
    if (!userEmail) return;
    try {
      await axios.post(`${API_URL}/saveOrUpdateTeamData`, {
        email: userEmail, teamMembers: updatedMembers, moduleType: 'bird',
      });
    } catch (error) {
      console.log('Team save error:', error);
    }
  };

  const addTeamMember = () => {
    const name = memberInput.trim();
    if (!name) { Alert.alert('Error', 'Please enter a valid name.'); return; }
    if (rawTeamMembers.includes(name)) { Alert.alert('Duplicate', 'This team member already exists.'); return; }
    const updated = [...rawTeamMembers, name];
    setRawTeamMembers(updated);
    setTeamMembers(updated.map(n => ({label: n, value: n})));
    setMemberInput('');
    saveTeamMembers(updated);
  };

  const saveEditMember = () => {
    if (editMemberIndex === null) return;
    const name = memberInput.trim();
    if (!name) { Alert.alert('Error', 'Please enter a valid name.'); return; }
    const updated = [...rawTeamMembers];
    updated[editMemberIndex] = name;
    setRawTeamMembers(updated);
    setTeamMembers(updated.map(n => ({label: n, value: n})));
    setMemberInput('');
    setEditMemberIndex(null);
    saveTeamMembers(updated);
  };

  const deleteTeamMember = (index: number) => {
    Alert.alert('Delete Member', `Remove "${rawTeamMembers[index]}" from the team?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete', style: 'destructive',
        onPress: () => {
          if (editMemberIndex === index) { setEditMemberIndex(null); setMemberInput(''); }
          const updated = rawTeamMembers.filter((_, i) => i !== index);
          setRawTeamMembers(updated);
          setTeamMembers(updated.map(n => ({label: n, value: n})));
          saveTeamMembers(updated);
        },
      },
    ]);
  };

  // Load draft data if navigated from Drafts page
  useEffect(() => {
    if (draftData) {
      if (draftData.habitatType) setHabitatType(draftData.habitatType);
      if (draftData.point) setPoint(draftData.point);
      if (draftData.pointTag) setPointTag(draftData.pointTag);
      if (draftData.descriptor) setDescriptor(draftData.descriptor);
      if (draftData.latitude) setLatitude(draftData.latitude);
      if (draftData.longitude) setLongitude(draftData.longitude);
      if (draftData.radius) setRadius(draftData.radius);
      if (draftData.dateText) setDateText(draftData.dateText);
      if (draftData.date) setDate(new Date(draftData.date));
      if (draftData.observers) setObservers(draftData.observers);
      if (draftData.startTime) setSelectedStartTime(new Date(draftData.startTime));
      if (draftData.endTime) setSelectedEndTime(new Date(draftData.endTime));
      if (draftData.weather) setSelectedWeatherString(draftData.weather);
      if (draftData.visibility) setVisibility(draftData.visibility);
      if (draftData.water) setSelectedWaterString(draftData.water);
      if (draftData.paddySeason) setPaddySeason(draftData.paddySeason);
      if (draftData.vegetationStatus) setVegetationStatus(draftData.vegetationStatus);
      if (draftData.dominantVegetation) setDominantVegetation(draftData.dominantVegetation);
      if (draftData.imageUri) setImageUri(draftData.imageUri);
      if (draftData.birdDataArray && draftData.birdDataArray.length > 0) {
        setBirdDataArray(draftData.birdDataArray);
      }
      if (draftData.currentStep !== undefined) {
        setCurrentStep(draftData.currentStep);
      }
    }
  }, []);

  // ===== DRAFT HELPERS =====
  const collectFormState = () => ({
    habitatType, point, pointTag, descriptor,
    latitude, longitude, radius,
    dateText, date: date.toISOString(),
    observers,
    startTime: selectedStartTime.toISOString(),
    endTime: selectedEndTime.toISOString(),
    weather: selectedWeatherString,
    visibility,
    water: selectedWaterString,
    paddySeason, vegetationStatus, dominantVegetation, imageUri,
    birdDataArray, currentStep,
  });

  const saveDraft = async () => {
    try {
      const db = await getDatabase();
      const now = new Date();
      const draftIdToUse = existingDraftId ||
        `DRAFT_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;

      const formState = collectFormState();
      const lastModified = now.toISOString();

      db.transaction((tx: any) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS bird_drafts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            draftId TEXT UNIQUE,
            habitatType TEXT,
            pointTag TEXT,
            date TEXT,
            lastModified TEXT,
            currentStep INTEGER DEFAULT 0,
            formData TEXT
          );`,
        );
        tx.executeSql(
          `INSERT OR REPLACE INTO bird_drafts
            (draftId, habitatType, pointTag, date, lastModified, currentStep, formData)
           VALUES (?, ?, ?, ?, ?, ?, ?);`,
          [
            draftIdToUse,
            habitatType || '',
            pointTag || '',
            dateText || '',
            lastModified,
            currentStep,
            JSON.stringify(formState),
          ],
          () => {
            Alert.alert('Draft Saved', 'Your incomplete survey has been saved as a draft.', [
              {text: 'OK', onPress: () => navigation.navigate('BirdBottomNav')}
            ]);
          },
          (_: any, error: any) => {
            console.log('Error saving draft:', error);
            Alert.alert('Error', 'Failed to save draft.');
          },
        );
      });
    } catch (error) {
      console.error('saveDraft error:', error);
    }
  };

  const deleteDraft = async (draftIdToDelete: string) => {
    try {
      const db = await getDatabase();
      db.transaction((tx: any) => {
        tx.executeSql('DELETE FROM bird_drafts WHERE draftId = ?;', [draftIdToDelete]);
      });
    } catch (error) {
      console.error('deleteDraft error:', error);
    }
  };

  const initDatabase = async () => {
    try {
      const db = await getDatabase();
      db.transaction((tx: any) => {
        // Drop and recreate to fix schema mismatches
        tx.executeSql('DROP TABLE IF EXISTS bird_survey;');
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS bird_survey (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uniqueId TEXT, habitatType TEXT, point TEXT, pointTag TEXT,
            latitude TEXT, longitude TEXT, date TEXT, observers TEXT,
            startTime TEXT, endTime TEXT, weather TEXT, water TEXT,
            season TEXT, statusOfVegy TEXT, descriptor TEXT, radiusOfArea TEXT,
            remark TEXT, imageUri TEXT
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
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS bird_drafts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            draftId TEXT UNIQUE,
            habitatType TEXT,
            pointTag TEXT,
            date TEXT,
            lastModified TEXT,
            currentStep INTEGER DEFAULT 0,
            formData TEXT
          );`, [], () => {}, (_: any, e: any) => console.log('Error:', e),
        );
      });
    } catch (error) {
      console.error('DB init error:', error);
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
      setCurrentStep(1);
      setErrors({});
    } else if (currentStep === 1 && validateStep2()) {
      setCurrentStep(2);
      setErrors({});
      if (birdDataArray.length === 0) {
        setBirdDataArray([createEmptyBirdObservation()]);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) { setCurrentStep(currentStep - 1); setErrors({}); }
    else navigation.navigate('BirdBottomNav');
  };

  // ===== SUBMIT =====
  const handleSubmitFullSurvey = async () => {
    const step1Valid = !!habitatType;
    const step2Valid = dateText && observers && selectedWeatherString;

    if (!step1Valid || !step2Valid) {
      Alert.alert(
        'Incomplete Form',
        'Please fill in all required fields (Habitat Type, Date, Observer, Weather) before submitting.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Save as Draft', onPress: saveDraft},
        ],
      );
      return;
    }

    setShowSubmitConfirm(true);
  };

  const handleSubmit = async () => {
    const step1Valid = !!habitatType;
    const step2Valid = dateText && observers && selectedWeatherString;
    const step3Valid = birdDataArray.length > 0 && birdDataArray.every((bird: any) => bird.species && bird.count);

    if (!step1Valid || !step2Valid || !step3Valid) {
      Alert.alert(
        'Incomplete Form',
        'Some required fields are missing. Would you like to save this as a draft?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Save as Draft', onPress: saveDraft},
        ],
      );
      return;
    }

    setShowSubmitConfirm(true);
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
      uniqueId, email: userEmail, habitatType,
      point: point || '', pointTag: pointTag || '',
      latitude, longitude, date: dateStr,
      observers, startTime: startTimeStr, endTime: endTimeStr,
      weather: selectedWeatherString || '',
      visibility: visibility || '',
      water: selectedWaterString || '',
      season: paddySeason || '', statusOfVegy: vegetationStatus || '', dominantVegetation: dominantVegetation || '',
      descriptor, radiusOfArea: radius,
      remark: '', imageUri: imageUri || '',
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

    // Save locally first
    await saveFormDataSQL(formData);
    console.log('Local save completed for uniqueId:', formData.uniqueId);

    // Then try cloud
    try {
      const response = await axios.post(`${API_URL}/form-entry`, formData);
      setIsSubmitting(false);
      const addedId = response.data._id || response.data.formEntry?._id;
      if (addedId) uploadImageToServer(imageUri, addedId);
      if (existingDraftId) await deleteDraft(existingDraftId);
      setShowSuccessAlert(true);
    } catch (error: any) {
      setIsSubmitting(false);
      console.log('Submit error:', error?.message);
      console.log('Server response:', error?.response?.status, error?.response?.data);
      storeFailedSubmission(formData);
      if (existingDraftId) await deleteDraft(existingDraftId);
      setShowSuccessAlert(true);
    }
  };

  const saveFormDataSQL = (formData: any): Promise<void> => {
    return new Promise(async (resolve) => {
      try {
        const db = await getDatabase();
        db.transaction(
          (tx: any) => {
            // Insert survey
            tx.executeSql(
              `INSERT INTO bird_survey (
                uniqueId, habitatType, point, pointTag, latitude, longitude,
                date, observers, startTime, endTime, weather, water, season,
                statusOfVegy, descriptor, radiusOfArea, remark, imageUri
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
              [
                formData.uniqueId, formData.habitatType || '',
                formData.point || '', formData.pointTag || '', formData.latitude || '', formData.longitude || '',
                formData.date || '', formData.observers || '', formData.startTime || '', formData.endTime || '',
                formData.weather || '', formData.water || '', formData.season || '',
                formData.statusOfVegy || '', formData.descriptor || '', formData.radiusOfArea || '',
                formData.remark || '', formData.imageUri || '',
              ],
            );
            // Insert bird observations
            if (formData.birdObservations) {
              formData.birdObservations.forEach((bird: any) => {
                tx.executeSql(
                  `INSERT INTO bird_observations (uniqueId, species, count, maturity, sex, behaviour, identification, status, remarks, imageUri)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                  [bird.uniqueId || '', bird.species || '', bird.count || '', bird.maturity || '', bird.sex || '',
                   bird.behaviour || '', bird.identification || '', bird.status || '', bird.remarks || '', bird.imageUri || ''],
                );
              });
            }
          },
          (error: any) => {
            console.log('Transaction error:', error.message || error);
            resolve();
          },
          () => {
            console.log('Survey saved to SQLite successfully');
            resolve();
          },
        );
      } catch (err) {
        console.log('saveFormDataSQL error:', err);
        resolve();
      }
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
  // RENDER STEP 1: Survey Point Details
  // ========================================
  // Build dynamic dropdown data with custom categories merged in
  const habitatTypeData = [
    ...habitatTypes.filter(h => h.value !== 'Other'),
    ...customHabitatTypes.map(v => ({label: v, value: v})),
    {label: 'Other', value: 'Other'},
  ];
  const surveyPointData = [
    ...defaultSurveyPoints.filter(p => p.value !== 'Other'),
    ...customPoints.map(v => ({label: v, value: v})),
    {label: 'Other', value: 'Other'},
  ];
  const pointTagData = [
    ...defaultPointTags.filter(t => t.value !== 'Other'),
    ...customPointTags.map(v => ({label: v, value: v})),
    {label: 'Other', value: 'Other'},
  ];
  const vegetationStatusData = [
    ...vegetationStatuses.filter(v => v.value !== 'Other'),
    ...customVegetationStatuses.map(v => ({label: v, value: v})),
    {label: 'Other', value: 'Other'},
  ];

  const renderCustomInput = (categoryType: string, fieldKey: string, placeholder: string) => (
    showCustomInput[fieldKey] ? (
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 4}}>
        <TextInput
          mode="outlined"
          placeholder={`Enter new ${placeholder}`}
          value={customInputValue}
          onChangeText={setCustomInputValue}
          outlineStyle={styles.inputOutline}
          style={[styles.formInput, {flex: 1, marginRight: 8, marginBottom: 0}]}
          textColor="#333"
        />
        <TouchableOpacity
          onPress={() => addCustomCategory(categoryType, customInputValue)}
          style={{backgroundColor: GREEN, padding: 10, borderRadius: 8, marginRight: 4}}>
          <Icon name="plus" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setShowCustomInput({}); setCustomInputValue(''); }}
          style={{padding: 10}}>
          <Icon name="times" size={16} color="#999" />
        </TouchableOpacity>
      </View>
    ) : null
  );

  const renderStepOne = () => (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Survey Point Details</Text>

        <Dropdown
          style={[styles.formDropdown, focusStates.habitat && styles.dropdownFocused]}
          placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle} iconStyle={styles.iconStyle}
          itemTextStyle={{color: '#333'}} data={habitatTypeData} search maxHeight={300}
          labelField="label" valueField="value" placeholder="Habitat type"
          searchPlaceholder="Search..." value={habitatType}
          onFocus={() => setFocus('habitat', true)} onBlur={() => setFocus('habitat', false)}
          onChange={item => {
            if (item.value === 'Other') {
              setShowCustomInput({habitat: true});
              setCustomInputValue('');
            } else {
              setHabitatType(item.value);
              setShowCustomInput({});
            }
            setFocus('habitat', false);
          }}
        />
        {renderCustomInput('customHabitatTypes', 'habitat', 'habitat type')}
        {errors.habitatType && <Text style={styles.errorText}>{errors.habitatType}</Text>}

        <Dropdown
          style={[styles.formDropdown, focusStates.point && styles.dropdownFocused]}
          placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle} itemTextStyle={{color: '#333'}} data={surveyPointData}
          maxHeight={300} labelField="label" valueField="value" placeholder="Point" value={point}
          onFocus={() => setFocus('point', true)} onBlur={() => setFocus('point', false)}
          onChange={item => {
            if (item.value === 'Other') {
              setShowCustomInput({point: true});
              setCustomInputValue('');
            } else {
              setPoint(item.value);
              setShowCustomInput({});
            }
            setFocus('point', false);
          }}
        />
        {renderCustomInput('customPoints', 'point', 'point')}

        <Dropdown
          style={[styles.formDropdown, focusStates.tag && styles.dropdownFocused]}
          placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle} itemTextStyle={{color: '#333'}} data={pointTagData}
          maxHeight={300} labelField="label" valueField="value" placeholder="Point Tag" value={pointTag}
          onFocus={() => setFocus('tag', true)} onBlur={() => setFocus('tag', false)}
          onChange={item => {
            if (item.value === 'Other') {
              setShowCustomInput({tag: true});
              setCustomInputValue('');
            } else {
              setPointTag(item.value);
              setShowCustomInput({});
            }
            setFocus('tag', false);
          }}
        />
        {renderCustomInput('customPointTags', 'tag', 'point tag')}

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

      {/* Team Members Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Team Members</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <TextInput
            mode="outlined"
            placeholder="Enter member name"
            value={memberInput}
            onChangeText={setMemberInput}
            outlineStyle={styles.inputOutline}
            style={[styles.formInput, {flex: 1, marginRight: 8, marginBottom: 0}]}
            textColor="#333"
          />
          {memberInput.length > 0 && (
            <TouchableOpacity onPress={() => { setMemberInput(''); setEditMemberIndex(null); }} style={{padding: 6, marginRight: 4}}>
              <Icon name="times-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={editMemberIndex !== null ? saveEditMember : addTeamMember}
            style={{backgroundColor: GREEN, padding: 10, borderRadius: 8}}>
            <Icon name={editMemberIndex !== null ? 'check' : 'plus'} size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        {editMemberIndex !== null && (
          <Text style={{fontSize: 12, color: GREEN, fontStyle: 'italic', marginBottom: 6}}>
            Editing: {rawTeamMembers[editMemberIndex]}
          </Text>
        )}
        {rawTeamMembers.length > 0 ? (
          rawTeamMembers.map((member, index) => (
            <View key={index} style={{
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              paddingVertical: 10, paddingHorizontal: 8,
              borderBottomWidth: 1, borderBottomColor: '#E0E0E0',
              ...(editMemberIndex === index ? {backgroundColor: '#e8f5e9', borderLeftWidth: 3, borderLeftColor: GREEN, borderRadius: 6} : {}),
            }}>
              <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <View style={{width: 28, height: 28, borderRadius: 14, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center', marginRight: 8}}>
                  <Icon name="user" size={14} color={GREEN} />
                </View>
                <Text style={{fontSize: 14, color: '#333', flex: 1}}>{member}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => { setMemberInput(rawTeamMembers[index]); setEditMemberIndex(index); }} style={{marginLeft: 10, padding: 4}}>
                  <Icon name="edit" size={16} color={GREEN} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTeamMember(index)} style={{marginLeft: 10, padding: 4}}>
                  <Icon name="trash" size={16} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={{alignItems: 'center', paddingVertical: 16}}>
            <Icon name="users" size={30} color="#ccc" />
            <Text style={{fontSize: 13, color: '#999', marginTop: 6}}>No team members yet</Text>
          </View>
        )}
      </View>

      <View style={styles.step1ActionCard}>
        <TouchableOpacity onPress={handleNext} style={styles.nextStepBtn} activeOpacity={0.8}>
          <Text style={styles.nextStepBtnText}>Continue to Common Details</Text>
          <Icon name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={saveDraft} style={styles.saveDraftBtn} activeOpacity={0.7}>
          <Icon name="floppy-o" size={15} color={GREEN} />
          <Text style={styles.saveDraftBtnText}>Save as Draft</Text>
        </TouchableOpacity>
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
          style={[styles.formDropdown, focusStates.observers && styles.dropdownFocused]}
          placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle} iconStyle={styles.iconStyle}
          itemTextStyle={{color: '#333'}} data={teamMembers} search maxHeight={300}
          labelField="label" valueField="value" placeholder="Select Observer"
          searchPlaceholder="Search observer..." value={observers}
          onFocus={() => setFocus('observers', true)} onBlur={() => setFocus('observers', false)}
          onChange={item => { setObservers(item.value); setFocus('observers', false); }}
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

        <Dropdown
          style={[styles.formDropdown, focusStates.vegetation && styles.dropdownFocused]}
          placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle} iconStyle={styles.iconStyle}
          itemTextStyle={{color: '#333'}} data={vegetationStatusData} search maxHeight={300}
          labelField="label" valueField="value" placeholder="Status Of Vegetation"
          searchPlaceholder="Search..." value={vegetationStatus}
          onFocus={() => setFocus('vegetation', true)} onBlur={() => setFocus('vegetation', false)}
          onChange={item => {
            if (item.value === 'Other') {
              setShowCustomInput({vegetation: true});
              setCustomInputValue('');
            } else {
              setVegetationStatus(item.value);
              setShowCustomInput({});
            }
            setFocus('vegetation', false);
          }}
        />
        {renderCustomInput('customVegetationStatuses', 'vegetation', 'vegetation status')}

        <Dropdown
          style={[styles.formDropdown, focusStates.season && styles.dropdownFocused]}
          placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle} itemTextStyle={{color: '#333'}} data={paddySeasons}
          maxHeight={300} labelField="label" valueField="value" placeholder="Season of Paddy Field"
          value={paddySeason} onChange={item => setPaddySeason(item.value)}
        />

        <Dropdown
          style={[styles.formDropdown, focusStates.dominantVeg && styles.dropdownFocused]}
          placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle} itemTextStyle={{color: '#333'}} data={dominantVegetationTypes}
          maxHeight={300} labelField="label" valueField="value" placeholder="Type of Dominant Vegetation"
          value={dominantVegetation}
          onFocus={() => setFocus('dominantVeg', true)} onBlur={() => setFocus('dominantVeg', false)}
          onChange={item => { setDominantVegetation(item.value); setFocus('dominantVeg', false); }}
        />

      </View>

      {/* Action Buttons */}
      <View style={styles.step2ActionCard}>
        <TouchableOpacity
          onPress={() => {
            if (validateStep2()) {
              setCurrentStep(2);
              setErrors({});
              if (birdDataArray.length === 0) {
                setBirdDataArray([createEmptyBirdObservation()]);
              }
            }
          }}
          style={styles.birdDetailBtn}
          activeOpacity={0.8}>
          <View style={styles.actionBtnIconCircle}>
            <Icon name="plus" size={16} color="#fff" />
          </View>
          <View style={styles.actionBtnTextWrap}>
            <Text style={styles.actionBtnTitle}>Bird Detail Record</Text>
            <Text style={styles.actionBtnSub}>Add bird observations to this survey</Text>
          </View>
          <Icon name="chevron-right" size={16} color={GREEN} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmitFullSurvey}
          disabled={isSubmitting}
          style={[styles.submitFullBtn, isSubmitting && {opacity: 0.6}]}
          activeOpacity={0.8}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Icon name="cloud-upload" size={18} color="#FFFFFF" />
              <Text style={styles.submitFullBtnText}>Submit Full Survey</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={saveDraft} style={styles.saveDraftBtn} activeOpacity={0.7}>
          <Icon name="floppy-o" size={15} color={GREEN} />
          <Text style={styles.saveDraftBtnText}>Save as Draft</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ========================================
  // RENDER STEP 3: Bird Detail Record
  // ========================================
  const renderStepThree = () => (
    <View>
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Bird Detail Record</Text>
          <TouchableOpacity style={styles.addBirdSmallBtn} onPress={addBirdObservation}>
            <Icon name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {birdDataArray.map((obs: any, idx: number) => (
          <BirdObservationCard
            key={obs.id} observation={obs} index={idx}
            onUpdate={updateBirdObservation}
            onDelete={() => deleteBirdObservation(obs.id)}
            onToggle={() => toggleBirdObservation(obs.id)}
            customBirdStatuses={customBirdStatuses}
            onAddCustomStatus={(val: string) => addCustomCategory('customBirdStatuses', val)}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.step3ActionCard}>
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
            style={[styles.submitBirdBtn, isSubmitting && {opacity: 0.6}]}
            activeOpacity={0.8}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Icon name="cloud-upload" size={18} color="#FFFFFF" />
                <Text style={styles.submitBirdBtnText}>Submit Bird Record</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={saveDraft} style={styles.saveDraftBtn} activeOpacity={0.7}>
          <Icon name="floppy-o" size={15} color={GREEN} />
          <Text style={styles.saveDraftBtnText}>Save as Draft</Text>
        </TouchableOpacity>
      </View>

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

      {/* Submit Confirmation Modal */}
      <Modal visible={showSubmitConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={styles.confirmIconCircle}>
              <Icon name="paper-plane" size={30} color={GREEN} />
            </View>
            <Text style={styles.confirmTitle}>Submit Survey?</Text>
            <Text style={styles.confirmText}>
              You are about to submit a survey
              {birdDataArray.length > 0 && birdDataArray[0].species ? (
                <Text> with <Text style={{fontWeight: 'bold'}}>{birdDataArray.length} bird observation(s)</Text></Text>
              ) : (
                <Text> <Text style={{fontWeight: 'bold'}}>without bird observations</Text></Text>
              )}
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

      {/* Success Alert */}
      <CustomAlert
        visible={showSuccessAlert}
        onClose={() => {
          setShowSuccessAlert(false);
          navigation.navigate('BirdBottomNav');
        }}
        message="Survey Submitted Successfully!"
      />
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
  photoLabel: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
    marginBottom: 6,
  },
  photoUploadArea: {
    borderWidth: 2,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  photoPlaceholderText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  uploadedPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#E74C3C',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  imagePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  imagePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    borderWidth: 3,
    borderColor: '#4A7856',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  imagePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  imagePickerOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  imagePickerOption: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    width: 130,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imagePickerOptionText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    fontWeight: '600',
  },
  imagePickerCancelButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imagePickerCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
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
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addBirdSmallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
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
  modalCloseBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 4,
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
  saveDraftLink: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 12,
    marginTop: 4,
    gap: 8,
  },
  saveDraftText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  // Step 1 Action Card
  step1ActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4},
      android: {elevation: 4},
    }),
  },
  nextStepBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: GREEN,
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  nextStepBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  // Step 2 Action Card
  step2ActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4},
      android: {elevation: 4},
    }),
  },
  birdDetailBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: GREEN,
    marginBottom: 12,
  },
  actionBtnIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GREEN,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  actionBtnTextWrap: {
    flex: 1,
  },
  actionBtnTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: GREEN_DARK,
  },
  actionBtnSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  submitFullBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: GREEN_DARK,
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
    elevation: 3,
    marginBottom: 4,
  },
  submitFullBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  saveDraftBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    marginTop: 8,
    gap: 8,
  },
  saveDraftBtnText: {
    color: GREEN,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  // Step 3 Action Card
  step3ActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4},
      android: {elevation: 4},
    }),
  },
  submitBirdBtn: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: GREEN_DARK,
    elevation: 3,
    gap: 8,
  },
  submitBirdBtnText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});