//import libraries
import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    TextInput, 
    ScrollView, 
    SafeAreaView, 
    Platform, 
    Image, 
    Modal, 
    Alert,
    ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { plantApi } from '../../api/plantapi';
import CustomAlert from '../custom-alert/alert-design';
import PreviewModal from './PreviewModal';

// Custom Radio Button Component
const CustomRadioButton = ({ selected, onPress, disabled }) => (
    <TouchableOpacity
        style={styles.customRadio}
        onPress={onPress}
        disabled={disabled}
    >
        <View style={[
            styles.customRadioOuter,
            selected && styles.customRadioOuterSelected
        ]}>
            {selected && <View style={styles.customRadioInner} />}
        </View>
    </TouchableOpacity>
);

// component
const PlantDataCollection = () => {
    const navigation = useNavigation();
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
    const [errorAlertType, setErrorAlertType] = useState<'error' | 'network'>('error');
    const [errorAlertTitle, setErrorAlertTitle] = useState('');
    const [errorAlertMessage, setErrorAlertMessage] = useState('');
    const [submittedData, setSubmittedData] = useState(null);

    const [activeTab, setActiveTab] = useState('Terrestrial');
    const [plantType, setPlantType] = useState('');
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeOfDay, setTimeOfDay] = useState('');
    const [description, setDescription] = useState('');
    const [commonName, setCommonName] = useState('');
    const [scientificName, setScientificName] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    // Translation object
    const translations = {
        en: {
            title: 'Plant',
            terrestrial: 'Terrestrial',
            aquatic: 'Aquatic',
            terrestrialPlants: 'Terrestrial Plants',
            aquaticPlants: 'Aquatic Plants',
            plantType: 'Plant Type',
            photo: 'Photo',
            date: 'Date',
            timeOfDay: 'Time of Day',
            description: 'Description (optional)',
            submit: 'Submit',
            submitting: 'Submitting...',
            photoPlaceholder: 'Tap to upload or capture a photo',
            chooseOption: 'Choose an option',
            camera: 'Camera',
            gallery: 'Gallery',
            cancel: 'Cancel',
            selectTimeOfDay: 'Select Time of Day',
            requiredField: 'Required Field',
            selectPlantType: 'Please select a plant type',
            uploadPhoto: 'Please upload a photo',
            descriptionPlaceholder: 'Add any additional notes about your observation...',
            success: 'Success',
            submissionSuccess: 'Plant observation submitted successfully!',
            submissionFailed: 'Submission Failed',
            tryAgain: 'Failed to submit observation. Please try again.',
            networkIssue: 'Network Issue',
            networkError: 'Unable to connect. Please check your internet connection and try again.',
            aquaticExamples: 'Examples of Aquatic Species',
            // Plant types
            plant: 'Plant',
            epiphyte: 'Epiphyte',
            lichen: 'Lichen',
            bryophyte: 'Bryophyte',
            fungi: 'Fungi',
            other: 'Other',
            floating: 'Floating',
            submerged: 'Submerged',
            // Time options
            morning: 'Morning',
            noon: 'Noon',
            evening: 'Evening',
            night: 'Night',
            // Identification fields
            identificationSection: 'If you can identify the observation (Optional)',
            commonName: 'Common Name',
            scientificName: 'Scientific Name',
            commonNamePlaceholder: 'Enter common name',
            scientificNamePlaceholder: 'Enter scientific name',
            preview: 'Preview',
            category: 'Category',
            type: 'Type'
        },
        si: {
            title: 'ශාක',
            terrestrial: 'භෞමික',
            aquatic: 'ජලජ',
            terrestrialPlants: 'භෞමික ශාක',
            aquaticPlants: 'ජලජ ශාක',
            plantType: 'ශාක කාණ්ඩය',
            photo: 'ඡායාරූපය',
            date: 'දිනය',
            timeOfDay: 'දවසේ වේලාව',
            description: 'විස්තරය (අත්‍යවශ්‍ය නොවේ)',
            submit: 'දත්ත ඇතුලත් කිරීම තහවුරු කරන්න',
            submitting: 'දත්ත ඇතුලත් කිරීම තහවුරු කරමින්...',
            photoPlaceholder: 'ඡායාරූපය ගැනීම/ ඇතුලත් කිරීම මෙහිදී සිදු කරන්න',
            chooseOption: 'තෝරන්න',
            camera: 'කැමරාව',
            gallery: 'ගැලරිය',
            cancel: 'අවලංගු කරන්න',
            selectTimeOfDay: 'දවසේ වේලාව තෝරන්න',
            requiredField: 'අවශ්‍ය ක්ෂේත්‍රය',
            selectPlantType: 'කරුණාකර ශාක වර්ගයක් තෝරන්න',
            uploadPhoto: 'කරුණාකර ඡායාරූපයක් උඩුගත කරන්න',
            descriptionPlaceholder: 'ඔබේ නිරීක්ෂණය ගැන අමතර සටහන් එක් කරන්න...',
            success: 'සාර්ථකයි',
            submissionSuccess: 'ශාක නිරීක්ෂණය සාර්ථකව ඉදිරිපත් කරන ලදී!',
            submissionFailed: 'ඉදිරිපත් කිරීම අසාර්ථක විය',
            tryAgain: 'නිරීක්ෂණය ඉදිරිපත් කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.',
            networkIssue: 'ජාල ගැටලුව',
            networkError: 'සංයෝගය ස්ථාපිත කිරීමට නොහැකි විය. කරුණාකර ඔබේ අන්තර්ජාල සංයෝගය පරීක්ෂා කරන්න සහ නැවත උත්සාහ කරන්න.',
            aquaticExamples: 'ජලජ ශාක සඳහා නිදසුන්',
            // Plant types
            plant: 'ශාක',
            epiphyte: 'අපිශාක',
            lichen: 'ලයිකන',
            bryophyte: 'අක්මා ශාක',
            fungi: 'දිලීර',
            other: 'වෙනත්',
            floating: 'පාවෙන',
            submerged: 'ජලයේ යටවූ',
            // Time options
            morning: 'උදෑසන',
            noon: 'මධ්‍යහනය',
            evening: 'සවස',
            night: 'රාත්‍රිය',
            // Identification fields
            identificationSection: 'නිරීක්ෂණය හඳුනාගත්තේ නම් (අත්‍යවශ්‍ය නොවේ)',
            commonName: 'පොදු නාමය',
            scientificName: 'විද්‍යාත්මක  නාමය',
            commonNamePlaceholder: 'පොදු නාමය ඇතුළත් කරන්න',
            scientificNamePlaceholder: 'විද්‍යාත්මක  නාමය ඇතුළත් කරන්න',
            preview: 'පෙරදසුන',
            category: 'වර්ගය',
            type: 'වර්ගය'
        },
        ta: {
            title: 'தாவரம்',
            terrestrial: 'நில வாழ்',
            aquatic: 'நீர்வாழ்',
            terrestrialPlants: 'நில வாழ் தாவரங்கள்',
            aquaticPlants: 'நீர்வாழ் தாவரங்கள்',
            plantType: 'தாவர வகை',
            photo: 'புகைப்படம்',
            date: 'திகதி',
            timeOfDay: 'நாளின் நேரம்',
            description: 'விளக்கம் (விருப்பமானது)',
            submit: 'சமர்ப்பிக்கவும்',
            submitting: 'சமர்ப்பிக்கப்படுகிறது...',
            photoPlaceholder: 'புகைப்படத்தைப் பதிவேற்ற அழுத்தவும் எடுக்க தட்டவும்',
            chooseOption: 'ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்',
            camera: 'கேமரா',
            gallery: 'புகைப்படங்கள்',
            cancel: 'ரத்துசெய்',
            selectTimeOfDay: 'நாளின் நேரத்தைத் தேர்ந்தெடுக்கவும்',
            requiredField: 'தேவையான புலம்',
            selectPlantType: 'தயவுசெய்து ஒரு தாவர வகையைத் தேர்ந்தெடுக்கவும்',
            uploadPhoto: 'தயவுசெய்து ஒரு புகைப்படத்தைப் பதிவேற்றவும்',
            descriptionPlaceholder: 'உங்கள் கவனிப்பு பற்றிய கூடுதல் குறிப்புகளைச் சேர்க்கவும்...',
            success: 'வெற்றி',
            submissionSuccess: 'தாவர கவனிப்பு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
            submissionFailed: 'சமர்ப்பித்தல் தோல்வியடைந்தது',
            tryAgain: 'கவனிப்பை சமர்ப்பிக்க தோல்வி. மீண்டும் முயற்சிக்கவும்.',
            networkIssue: 'நெட்வொர்க் சிக்கல்',
            networkError: 'இணைப்பை நிறுவ முடியவில்லை. தயவுசெய்து உங்கள் இணைய இணைப்பை சரிபார்க்கவும் மற்றும் மீண்டும் முயற்சிக்கவும்.',
            aquaticExamples: 'நீர்வாழ் தாவரங்களுக்கான உதாரணங்கள்',
            // Plant types
            plant: 'தாவரம்',
            epiphyte: 'எபிஃபைட்',
            lichen: 'லைக்கன்',
            bryophyte: 'பிரையோஃபைட்',
            fungi: 'பூஞ்சை',
            other: 'மற்றவை',
            floating: 'மிதக்கும்',
            submerged: 'நீரில் மூழ்கியது',
            // Time options
            morning: 'காலை',
            noon: 'மதியம்',
            evening: 'மாலை',
            night: 'இரவு',
            // Identification fields
            identificationSection: 'கவனிப்பை அடையாளம் காண முடிந்தால் (விருப்பமானது)',
            commonName: 'பொதுப் பெயர்',
            scientificName: 'அறிவியல் பெயர்',
            commonNamePlaceholder: 'பொதுப் பெயரை உள்ளிடவும்',
            scientificNamePlaceholder: 'அறிவியல் பெயரை உள்ளிடவும்',
            preview: 'முன்னோட்டம்',
            category: 'வகை',
            type: 'வகை'
        }
    };

    // Load saved language preference
    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('userLanguage');
            if (savedLanguage) {
                setCurrentLanguage(savedLanguage);
            }
        } catch (error) {
            // Error silently handled
        }
    };

    // Get current translations
    const t = translations[currentLanguage] || translations.en;

    const terrestrialPlantTypes = [
        { id: 'plant', label: t.plant, image: require('../../assets/image/Plant.jpeg') },
        { id: 'epiphyte', label: t.epiphyte, image: require('../../assets/image/Epiphyte.jpeg') },
        { id: 'lichen', label: t.lichen, image: require('../../assets/image/Lichen.jpg') },
        { id: 'bryophyte', label: t.bryophyte, image: require('../../assets/image/Bryophyte.jpg') },
        { id: 'fungi', label: t.fungi, image: require('../../assets/image/Fungi.png') },
        { id: 'other', label: t.other },
    ];

    const aquaticPlantTypes = [
        { id: 'floating', label: t.floating, image: require('../../assets/image/Lotus.jpg') },
        { id: 'submerged', label: t.submerged, image: require('../../assets/image/Aquatic.jpeg') },
    ];

    // Convert image to base64
    const convertImageToBase64 = async (uri) => {
        try {
            const cleanUri = Platform.OS === 'android' ? uri.replace('file://', '') : uri;
            const base64 = await RNFS.readFile(cleanUri, 'base64');
            return `data:image/jpeg;base64,${base64}`;
        } catch (error) {
            setErrorAlertType('error');
            setErrorAlertTitle(t.submissionFailed);
            setErrorAlertMessage('Failed to process image. Please try again.');
            setIsErrorAlertVisible(true);
            throw error;
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handlePhotoUpload = () => {
        setShowImagePicker(true);
    };

    const handleCamera = () => {
        setShowImagePicker(false);
        const options = {
            mediaType: 'photo',
            quality: 0.8,
            maxWidth: 1024,
            maxHeight: 1024,
            saveToPhotos: true,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                // User cancelled, no need to show error
            } else if (response.errorCode) {
                setErrorAlertType('error');
                setErrorAlertTitle(t.submissionFailed);
                setErrorAlertMessage('Failed to open camera. Please try again.');
                setIsErrorAlertVisible(true);
            } else if (response.assets && response.assets[0]) {
                setPhoto(response.assets[0].uri);
            }
        });
    };

    const handleGallery = () => {
        setShowImagePicker(false);
        const options = {
            mediaType: 'photo',
            quality: 0.8,
            maxWidth: 1024,
            maxHeight: 1024,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                // User cancelled, no need to show error
            } else if (response.errorCode) {
                setErrorAlertType('error');
                setErrorAlertTitle(t.submissionFailed);
                setErrorAlertMessage('Failed to open gallery. Please try again.');
                setIsErrorAlertVisible(true);
            } else if (response.assets && response.assets[0]) {
                setPhoto(response.assets[0].uri);
            }
        });
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handlePreview = () => {
        // Validation before showing preview
        if (!plantType) {
            setErrorAlertType('error');
            setErrorAlertTitle(t.requiredField);
            setErrorAlertMessage(t.selectPlantType);
            setIsErrorAlertVisible(true);
            return;
        }

        if (!photo) {
            setErrorAlertType('error');
            setErrorAlertTitle(t.requiredField);
            setErrorAlertMessage(t.uploadPhoto);
            setIsErrorAlertVisible(true);
            return;
        }

        if (!timeOfDay) {
            setErrorAlertType('error');
            setErrorAlertTitle(t.requiredField);
            setErrorAlertMessage(t.selectTimeOfDay);
            setIsErrorAlertVisible(true);
            return;
        }

        // Show preview modal
        setShowPreview(true);
    };

    const handleSubmit = async () => {
        setShowPreview(false);
        setIsSubmitting(true);

        try {
            // Convert image to base64
            const base64Image = await convertImageToBase64(photo);

            // Prepare data for API
            const plantData = {
                plantCategory: activeTab,
                plantType,
                photo: base64Image,
                date: date.toISOString().split('T')[0],
                timeOfDay,
                description: description.trim() || undefined,
                commonName: commonName.trim() || undefined,
                scientificName: scientificName.trim() || undefined,
            };

            // Send to backend
            const response = await plantApi.createPlant(plantData);

            if (response.success) {
                setSubmittedData(response.data);
                setIsAlertVisible(true);
            }
        } catch (error) {
            // Determine if it's a network error
            const isNetworkError = error.message && 
                (error.message.includes('Network') || 
                 error.message.includes('timeout') ||
                 error.message.includes('fetch'));
            
            // Remove field list from error message if present
            let errorMessage = error.message || t.tryAgain;
            if (errorMessage && errorMessage.includes('(')) {
                errorMessage = errorMessage.split('(')[0].trim();
            }
            
            setErrorAlertType(isNetworkError ? 'network' : 'error');
            setErrorAlertTitle(isNetworkError ? t.networkIssue : t.submissionFailed);
            setErrorAlertMessage(isNetworkError ? t.networkError : errorMessage);
            setIsErrorAlertVisible(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const currentPlantTypes = activeTab === 'Terrestrial' ? terrestrialPlantTypes : aquaticPlantTypes;
    const sectionTitle = activeTab === 'Terrestrial' ? t.terrestrialPlants : t.aquaticPlants;

    return (
        <SafeAreaView style={styles.safeArea}>
            
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={handleBackPress}
                        activeOpacity={0.7}
                    >
                        <Icon name="arrow-back" size={28} color="#4A7856" />
                    </TouchableOpacity>
                </View>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{t.title}</Text>
                </View>

                {/* Tab Navigation */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'Terrestrial' && styles.tabActive]}
                        onPress={() => setActiveTab('Terrestrial')}
                        disabled={isSubmitting}
                    >
                        <Text style={[styles.tabText, activeTab === 'Terrestrial' && styles.tabTextActive]}>
                            {t.terrestrial}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'Aquatic' && styles.tabActive]}
                        onPress={() => setActiveTab('Aquatic')}
                        disabled={isSubmitting}
                    >
                        <Text style={[styles.tabText, activeTab === 'Aquatic' && styles.tabTextActive]}>
                            {t.aquatic}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Form Content */}
                <View style={styles.frameContainer}>
                <View style={styles.formContainer}>
                    {/* Plant Type Section */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
                       {activeTab === 'Terrestrial' && (
    <Text style={styles.label}>{t.plantType}</Text>
)}


                        {activeTab === 'Aquatic' && (
                            <Text style={styles.examplesText}>{t.aquaticExamples}</Text>
                        )}

                        <View style={styles.plantTypeGrid}>
                            {currentPlantTypes.map((type) => (
                                <TouchableOpacity 
                                    key={type.id}
                                    style={styles.plantTypeCard}
                                    onPress={() => setPlantType(type.id)}
                                    activeOpacity={0.8}
                                    disabled={isSubmitting}
                                >
                                    {type.image ? (
                                        <>
                                            <Image source={type.image} style={styles.plantTypeImage} />
                                            {activeTab === 'Terrestrial' && (
                                                <View style={styles.plantTypeOverlay}>
                                                    <Text style={styles.plantTypeText}>{type.label}</Text>
                                                </View>
                                            )}
                                        </>
                                    ) : (
                                        <View style={[styles.plantTypeOverlay, styles.plantTypeOverlayFull]}>
                                            <Text style={styles.plantTypeText}>{type.label}</Text>
                                        </View>
                                    )}
                                    {plantType === type.id && (
                                        <View style={styles.selectedBadge}>
                                            <Icon name="check-circle" size={28} color="#4A7856" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Photo Upload */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t.photo}</Text>
                        <TouchableOpacity 
                            style={styles.photoUploadArea}
                            onPress={handlePhotoUpload}
                            activeOpacity={0.7}
                            disabled={isSubmitting}
                        >
                            {photo ? (
                                <View style={styles.photoContainer}>
                                    <Image source={{ uri: photo }} style={styles.uploadedPhoto} />
                                    <TouchableOpacity 
                                        style={styles.removePhotoButton}
                                        onPress={() => setPhoto(null)}
                                        activeOpacity={0.8}
                                        disabled={isSubmitting}
                                    >
                                        <Icon name="close" size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.photoPlaceholder}>
                                    <Icon name="photo-camera" size={50} color="#CCC" />
                                    <Text style={styles.photoPlaceholderText}>
                                        {t.photoPlaceholder}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Date Picker */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t.date}</Text>
                        <TouchableOpacity 
                            style={styles.dateInput}
                            onPress={() => setShowDatePicker(true)}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.dateText}>{formatDate(date)}</Text>
                            <Icon name="calendar-today" size={20} color="#666" />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    {/* Time of Day - Custom Radio Buttons */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t.timeOfDay}</Text>
                        <View style={styles.radioContainer}>
                            <View style={styles.radioRow}>
                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={() => setTimeOfDay('Morning')}
                                    disabled={isSubmitting}
                                >
                                    <CustomRadioButton
                                        selected={timeOfDay === 'Morning'}
                                        onPress={() => setTimeOfDay('Morning')}
                                        disabled={isSubmitting}
                                    />
                                    <Text style={styles.radioLabel}>{t.morning}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={() => setTimeOfDay('Noon')}
                                    disabled={isSubmitting}
                                >
                                    <CustomRadioButton
                                        selected={timeOfDay === 'Noon'}
                                        onPress={() => setTimeOfDay('Noon')}
                                        disabled={isSubmitting}
                                    />
                                    <Text style={styles.radioLabel}>{t.noon}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.radioRow}>
                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={() => setTimeOfDay('Evening')}
                                    disabled={isSubmitting}
                                >
                                    <CustomRadioButton
                                        selected={timeOfDay === 'Evening'}
                                        onPress={() => setTimeOfDay('Evening')}
                                        disabled={isSubmitting}
                                    />
                                    <Text style={styles.radioLabel}>{t.evening}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={() => setTimeOfDay('Night')}
                                    disabled={isSubmitting}
                                >
                                    <CustomRadioButton
                                        selected={timeOfDay === 'Night'}
                                        onPress={() => setTimeOfDay('Night')}
                                        disabled={isSubmitting}
                                    />
                                    <Text style={styles.radioLabel}>{t.night}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t.description}</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder={t.descriptionPlaceholder}
                            placeholderTextColor="#AAA"
                            multiline
                            numberOfLines={4}
                            value={description}
                            onChangeText={setDescription}
                            textAlignVertical="top"
                            editable={!isSubmitting}
                        />
                    </View>

                    {/* Identification Section - Optional */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.identificationTitle}>{t.identificationSection}</Text>

                        {/* Common Name */}
                        <Text style={styles.label}>{t.commonName}</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={t.commonNamePlaceholder}
                            placeholderTextColor="#AAA"
                            value={commonName}
                            onChangeText={setCommonName}
                            editable={!isSubmitting}
                        />

                        {/* Scientific Name */}
                        <Text style={[styles.label, { marginTop: 12 }]}>{t.scientificName}</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={t.scientificNamePlaceholder}
                            placeholderTextColor="#AAA"
                            value={scientificName}
                            onChangeText={setScientificName}
                            editable={!isSubmitting}
                        />
                    </View>

                    {/* Preview Button */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            isSubmitting && styles.submitButtonDisabled
                        ]}
                        onPress={handlePreview}
                        activeOpacity={0.8}
                        disabled={isSubmitting}
                    >
                        <View style={styles.submitButtonContent}>
                            <Icon name="visibility" size={24} color="#FFFFFF" />
                            <Text style={[styles.submitButtonText, { marginLeft: 10 }]}>
                                {t.preview}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                </View>
            </ScrollView>

            {/* Image Picker Modal */}
            <Modal
                visible={showImagePicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowImagePicker(false)}
            >
                <View style={styles.imagePickerOverlay}>
                    <View style={styles.imagePickerContainer}>
                        <Text style={styles.imagePickerTitle}>{t.chooseOption}</Text>
                        
                        <View style={styles.imagePickerOptions}>
                            <TouchableOpacity 
                                style={styles.imagePickerOption}
                                onPress={handleCamera}
                                activeOpacity={0.7}
                            >
                                <Icon name="photo-camera" size={50} color="#4A7856" />
                                <Text style={styles.imagePickerOptionText}>{t.camera}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.imagePickerOption}
                                onPress={handleGallery}
                                activeOpacity={0.7}
                            >
                                <Icon name="photo-library" size={50} color="#4A7856" />
                                <Text style={styles.imagePickerOptionText}>{t.gallery}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={styles.imagePickerCancelButton}
                            onPress={() => setShowImagePicker(false)}
                        >
                            <Text style={styles.imagePickerCancelText}>{t.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Success Alert */}
            <CustomAlert
                visible={isAlertVisible}
                onClose={() => {
                    setIsAlertVisible(false);
                    // Navigate to CreditInterface
                    navigation.navigate('CreditInterface', {
                        observationData: submittedData,
                        observationType: 'plant'
                    });
                }}
                language={currentLanguage as 'en' | 'si' | 'ta'}
            />

            {/* Error/Network Alert */}
            <CustomAlert
                visible={isErrorAlertVisible}
                onClose={() => setIsErrorAlertVisible(false)}
                type={errorAlertType}
                title={errorAlertTitle}
                message={errorAlertMessage}
                language={currentLanguage as 'en' | 'si' | 'ta'}
            />

            {/* Preview Modal */}
            <PreviewModal
                visible={showPreview}
                onClose={() => setShowPreview(false)}
                onConfirm={handleSubmit}
                title={t.title}
                isSubmitting={isSubmitting}
                language={currentLanguage as 'en' | 'si' | 'ta'}
                fields={[
                    { label: t.category, value: activeTab === 'Terrestrial' ? t.terrestrial : t.aquatic },
                    { label: t.plantType, value: currentPlantTypes.find(p => p.id === plantType)?.label || plantType },
                    { label: t.photo, value: photo || undefined, isImage: true },
                    { label: t.date, value: formatDate(date) },
                    { label: t.timeOfDay, value: timeOfDay === 'Morning' ? t.morning : timeOfDay === 'Noon' ? t.noon : timeOfDay === 'Evening' ? t.evening : timeOfDay === 'Night' ? t.night : timeOfDay },
                    { label: t.description, value: description || undefined },
                    { label: t.commonName, value: commonName || undefined },
                    { label: t.scientificName, value: scientificName || undefined },
                ]}
            />
        </SafeAreaView>
    );
}

// styles
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Times New Roman',
        color: '#4A7856',
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    tabActive: {
        backgroundColor: '#C8E6C9',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Times New Roman',
    },
    tabTextActive: {
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        fontFamily: 'Times New Roman',
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontFamily: 'Times New Roman',
    },
    identificationTitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 12,
        fontFamily: 'Times New Roman',
        fontWeight: '500',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Times New Roman',
    },
    examplesText: {
        fontSize: 14,
        color: '#4A7856',
        marginBottom: 10,
        fontFamily: 'Times New Roman',
        fontStyle: 'italic',
    },
    plantTypeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    plantTypeCard: {
        width: '48%',
        height: 120,
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    plantTypeImage: {
        width: '100%',
        height: '100%',
    },
    plantTypeOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(74, 120, 86, 0.85)',
        paddingVertical: 8,
        alignItems: 'center',
    },
    plantTypeOverlayFull: {
        height: '100%',
        justifyContent: 'center',
        bottom: 'auto',
    },
    plantTypeText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Times New Roman',
    },
    selectedBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    photoUploadArea: {
        borderWidth: 2,
        borderColor: '#DDD',
        borderStyle: 'dashed',
        borderRadius: 8,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    photoPlaceholder: {
        alignItems: 'center',
    },
    photoPlaceholderText: {
        marginTop: 10,
        fontSize: 14,
        color: '#999',
        fontFamily: 'Times New Roman',
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
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Times New Roman',
    },
    // Custom Radio Button Styles
    customRadio: {
        marginRight: 8,
    },
    customRadioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#CCC',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    customRadioOuterSelected: {
        borderColor: '#4A7856',
    },
    customRadioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4A7856',
    },
    radioContainer: {
        marginTop: 5,
    },
    radioRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    radioLabel: {
        fontSize: 16,
        color: '#333',
        marginLeft: 5,
        fontFamily: 'Times New Roman',
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Times New Roman',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        minHeight: 100,
        fontFamily: 'Times New Roman',
    },
    submitButton: {
        backgroundColor: '#4A7856',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    submitButtonDisabled: {
        backgroundColor: '#A8B8AA',
        opacity: 0.7,
    },
    submitButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Times New Roman',
        textAlign: 'center',
    },
    // Image Picker Modal Styles
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
                shadowOffset: { width: 0, height: 4 },
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
        fontFamily: 'Times New Roman',
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
        fontFamily: 'Times New Roman',
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
        fontFamily: 'Times New Roman',
    },
    // Time Picker Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Times New Roman',
    },
    modalCloseButton: {
        padding: 5,
    },
    modalContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    timeOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    timeOptionSelected: {
        backgroundColor: '#E8F5E9',
    },
    timeOptionText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Times New Roman',
    },
    timeOptionTextSelected: {
        color: '#4A7856',
        fontWeight: 'bold',
    },
    frameContainer: {
    marginHorizontal: 15,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#4A7856',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    ...Platform.select({
        ios: {
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
        },
        android: {
            elevation: 6,
        },
    }),
},
});

export default PlantDataCollection;