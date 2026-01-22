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

// component
const PlantDataCollection = () => {
    const navigation = useNavigation();
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    const [activeTab, setActiveTab] = useState('Terrestrial');
    const [plantType, setPlantType] = useState('');
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeOfDay, setTimeOfDay] = useState('Morning');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [description, setDescription] = useState('');

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
            night: 'Night'
        },
        si: {
            title: 'ශාක',
            terrestrial: 'භූමිජ',
            aquatic: 'ජලජ',
            terrestrialPlants: 'භූමිජ ශාක',
            aquaticPlants: 'ජලජ ශාක',
            plantType: 'ශාක වර්ගය',
            photo: 'ඡායාරූපය',
            date: 'දිනය',
            timeOfDay: 'දවසේ වේලාව',
            description: 'විස්තරය (අත්‍යවශ්‍ය නොවේ)',
            submit: 'ඉදිරිපත් කරන්න',
            submitting: 'ඉදිරිපත් කරමින්...',
            photoPlaceholder: 'ඡායාරූපය ගැනීම/ ඇතුලත් කිරීම මෙහිදී සිදු කරන්න',
            chooseOption: 'විකල්පයක් තෝරන්න',
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
            // Plant types
            plant: 'ශාකය',
            epiphyte: 'එපිෆයිට්',
            lichen: 'ලයිකන්',
            bryophyte: 'බ්‍රයෝෆයිට්',
            fungi: 'දිලීර',
            other: 'වෙනත්',
            floating: 'පාවෙන',
            submerged: 'ජලයේ යටවූ',
            // Time options
            morning: 'උදෑසන',
            noon: 'මධ්‍යාහ්නය',
            evening: 'සවස',
            night: 'රාත්‍රිය'
        },
        ta: {
            title: 'தாவரம்',
            terrestrial: 'நிலவியல்',
            aquatic: 'நீர்வாழ்',
            terrestrialPlants: 'நிலவியல் தாவரங்கள்',
            aquaticPlants: 'நீர்வாழ் தாவரங்கள்',
            plantType: 'தாவர வகை',
            photo: 'புகைப்படம்',
            date: 'தேதி',
            timeOfDay: 'நாளின் நேரம்',
            description: 'விளக்கம் (விருப்பமானது)',
            submit: 'சமர்ப்பிக்கவும்',
            submitting: 'சமர்ப்பிக்கப்படுகிறது...',
            photoPlaceholder: 'புகைப்படத்தைப் பதிவேற்ற அல்லது எடுக்க தட்டவும்',
            chooseOption: 'ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்',
            camera: 'கேமரா',
            gallery: 'கேலரி',
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
            night: 'இரவு'
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
            console.error('Error loading language:', error);
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

    const timeOptions = [
        { value: 'Morning', label: t.morning },
        { value: 'Noon', label: t.noon },
        { value: 'Evening', label: t.evening },
        { value: 'Night', label: t.night }
    ];

    // Convert image to base64
    const convertImageToBase64 = async (uri) => {
        try {
            const cleanUri = Platform.OS === 'android' ? uri.replace('file://', '') : uri;
            const base64 = await RNFS.readFile(cleanUri, 'base64');
            return `data:image/jpeg;base64,${base64}`;
        } catch (error) {
            console.error('Error converting image to base64:', error);
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
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                Alert.alert('Error', 'Failed to open camera: ' + response.errorMessage);
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
                console.log('User cancelled gallery');
            } else if (response.errorCode) {
                Alert.alert('Error', 'Failed to open gallery: ' + response.errorMessage);
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

    const handleSubmit = async () => {
        // Validation
        if (!plantType) {
            Alert.alert(t.requiredField, t.selectPlantType);
            return;
        }

        if (!photo) {
            Alert.alert(t.requiredField, t.uploadPhoto);
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert image to base64
            console.log('Converting image to base64...');
            const base64Image = await convertImageToBase64(photo);

            // Prepare data for API
            const plantData = {
                plantCategory: activeTab,
                plantType,
                photo: base64Image,
                date: date.toISOString().split('T')[0],
                timeOfDay,
                description: description.trim() || undefined,
            };

            console.log('Submitting plant observation to backend...');

            // Send to backend
            const response = await plantApi.createPlant(plantData);

            if (response.success) {
                setSubmittedData(response.data);
                setIsAlertVisible(true);
            }
        } catch (error) {
            console.error('Error submitting plant observation:', error);
            Alert.alert(
                t.submissionFailed,
                error.message || t.tryAgain
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const currentPlantTypes = activeTab === 'Terrestrial' ? terrestrialPlantTypes : aquaticPlantTypes;
    const sectionTitle = activeTab === 'Terrestrial' ? t.terrestrialPlants : t.aquaticPlants;

    // Get display label for current time of day
    const getCurrentTimeLabel = () => {
        const timeOption = timeOptions.find(opt => opt.value === timeOfDay);
        return timeOption ? timeOption.label : timeOfDay;
    };

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
                <View style={styles.formContainer}>
                    {/* Plant Type Section */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
                        <Text style={styles.label}>{t.plantType}</Text>
                        
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

                    {/* Time of Day Dropdown */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t.timeOfDay}</Text>
                        <TouchableOpacity 
                            style={styles.dropdown}
                            onPress={() => setShowTimePicker(true)}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.dropdownText}>{getCurrentTimeLabel()}</Text>
                            <Icon name="arrow-drop-down" size={24} color="#666" />
                        </TouchableOpacity>
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

                    {/* Submit Button */}
                    <TouchableOpacity 
                        style={[
                            styles.submitButton,
                            isSubmitting && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <View style={styles.submitButtonContent}>
                                <ActivityIndicator color="#FFFFFF" size="small" />
                                <Text style={[styles.submitButtonText, { marginLeft: 10 }]}>
                                    {t.submitting}
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.submitButtonText}>{t.submit}</Text>
                        )}
                    </TouchableOpacity>
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

            {/* Time Picker Modal */}
            <Modal
                visible={showTimePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowTimePicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t.selectTimeOfDay}</Text>
                            <TouchableOpacity 
                                onPress={() => setShowTimePicker(false)}
                                style={styles.modalCloseButton}
                            >
                                <Icon name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            {timeOptions.map((time) => (
                                <TouchableOpacity
                                    key={time.value}
                                    style={[
                                        styles.timeOption,
                                        timeOfDay === time.value && styles.timeOptionSelected
                                    ]}
                                    onPress={() => {
                                        setTimeOfDay(time.value);
                                        setShowTimePicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.timeOptionText,
                                        timeOfDay === time.value && styles.timeOptionTextSelected
                                    ]}>
                                        {time.label}
                                    </Text>
                                    {timeOfDay === time.value && (
                                        <Icon name="check" size={24} color="#4A7856" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Success Alert */}
            <CustomAlert
                visible={isAlertVisible}
                onClose={() => {
                    setIsAlertVisible(false);
                    // Reset form
                    setPlantType('');
                    setPhoto(null);
                    setDate(new Date());
                    setTimeOfDay('Morning');
                    setDescription('');
                    navigation.goBack();
                }}
                language={currentLanguage as 'en' | 'si' | 'ta'}
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
    },
    submitButtonText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
    },
    timeOptionTextSelected: {
        color: '#4A7856',
        fontWeight: 'bold',
    },
});

export default PlantDataCollection;