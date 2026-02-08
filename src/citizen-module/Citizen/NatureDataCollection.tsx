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
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { natureApi } from '../../api/natureApi';
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
const NatureDataCollection = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const category = route.params?.category || 'Nature';
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
    const [errorAlertType, setErrorAlertType] = useState<'error' | 'network'>('error');
    const [errorAlertTitle, setErrorAlertTitle] = useState('');
    const [errorAlertMessage, setErrorAlertMessage] = useState('');
    const [submittedData, setSubmittedData] = useState(null);

    const [natureType, setNatureType] = useState('');
    const [showNaturePicker, setShowNaturePicker] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeOfDay, setTimeOfDay] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    // Translation object
    const translations = {
        en: {
            title: 'Nature',
            category: 'Category',
            selectCategory: 'Select category',
            photo: 'Photo',
            date: 'Date',
            timeOfDay: 'Time of Day',
            submit: 'Submit',
            submitting: 'Submitting...',
            photoPlaceholder: 'Tap to upload or capture a photo',
            chooseOption: 'Choose an option',
            camera: 'Camera',
            gallery: 'Gallery',
            cancel: 'Cancel',
            requiredField: 'Required Field',
            selectCategoryAlert: 'Please select a category',
            uploadPhoto: 'Please upload a photo',
            selectTimeOfDay: 'Please select time of day',
            descriptionPlaceholder: 'Add any additional notes about your observation...',
            success: 'Success',
            submissionSuccess: 'Nature observation submitted successfully!',
            submissionFailed: 'Submission Failed',
            tryAgain: 'Failed to submit observation. Please try again.',
            networkIssue: 'Network Issue',
            networkError: 'Unable to connect. Please check your internet connection and try again.',
            // Nature types
            naturalEvents: 'Natural events',
            aesthetics: 'Aesthetics',
            other: 'Other',
            // Time options
            morning: 'Morning',
            noon: 'Noon',
            evening: 'Evening',
            night: 'Night',
            preview: 'Preview',
            type: 'Type'
        },
        si: {
            title: 'පරිසරය',
            category: ' කාණ්ඩය',
            selectCategory: ' කාණ්ඩය තෝරන්න',
            photo: 'ඡායාරූපය',
            date: 'දිනය',
            timeOfDay: 'දවසේ වේලාව',
            submit: 'දත්ත ඇතුලත් කිරීම තහවුරු කරන්න',
            submitting: 'දත්ත ඇතුලත් කිරීම තහවුරු කරමින්...',
            photoPlaceholder: 'ඡායාරූපය ගැනීම/ ඇතුලත් කිරීම මෙහිදී සිදු කරන්න',
            chooseOption: ' තෝරන්න',
            camera: 'කැමරාව',
            gallery: 'ගැලරිය',
            cancel: 'අවලංගු කරන්න',
            requiredField: 'අවශ්‍ය ක්ෂේත්‍රය',
            selectCategoryAlert: 'කරුණාකර කාණ්ඩයක් තෝරන්න',
            uploadPhoto: 'කරුණාකර ඡායාරූපයක් ඇතුලත්  කරන්න',
            selectTimeOfDay: 'කරුණාකර දවසේ වේලාව තෝරන්න',
            descriptionPlaceholder: 'ඔබේ නිරීක්ෂණය ගැන අමතර සටහන් එක් කරන්න...',
            success: 'සාර්ථකයි',
            submissionSuccess: 'ස්වභාවධර්ම නිරීක්ෂණය සාර්ථකව ඉදිරිපත් කරන ලදී!',
            submissionFailed: 'ඉදිරිපත් කිරීම අසාර්ථක විය',
            tryAgain: 'නිරීක්ෂණය ඉදිරිපත් කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.',
            networkIssue: 'ජාල ගැටලුව',
            networkError: 'සංයෝගය ස්ථාපිත කිරීමට නොහැකි විය. කරුණාකර ඔබේ අන්තර්ජාල සංයෝගය පරීක්ෂා කරන්න සහ නැවත උත්සාහ කරන්න.',
            // Nature types
            naturalEvents: 'ස්වභාවික සංසිද්ධි',
            aesthetics: 'සෞන්දර්යාත්මක අවස්ථා',
            other: 'වෙනත් අවස්ථා',
            // Time options
            morning: 'උදෑසන',
            noon: 'මධ්‍යහනය',
            evening: 'සවස',
            night: 'රාත්‍රිය',
            preview: 'පෙරදසුන',
            type: 'වර්ගය'
        },
        ta: {
            title: 'இயற்கை',
            category: 'வகை',
            selectCategory: 'வகையைத் தேர்ந்தெடுக்கவும்',
            photo: 'புகைப்படம்',
            date: 'திகதி',
            timeOfDay: 'நாளின் நேரம்',
            submit: 'சமர்ப்பிக்கவும்',
            submitting: 'சமர்ப்பிக்கப்படுகிறது...',
            photoPlaceholder: 'புகைப்படத்தைப் பதிவேற்ற அழுத்தவும் எடுக்க தட்டவும்',
            chooseOption: 'ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்',
            camera: 'கேமரா',
            gallery: 'புகைப்படங்கள்',
            cancel: 'ரத்துசெய்',
            requiredField: 'தேவையான புலம்',
            selectCategoryAlert: 'தயவுசெய்து ஒரு வகையைத் தேர்ந்தெடுக்கவும்',
            uploadPhoto: 'தயவுசெய்து ஒரு புகைப்படத்தைப் பதிவேற்றவும்',
            selectTimeOfDay: 'தயவுசெய்து நாளின் நேரத்தைத் தேர்ந்தெடுக்கவும்',
            descriptionPlaceholder: 'உங்கள் கவனிப்பு பற்றிய கூடுதல் குறிப்புகளைச் சேர்க்கவும்...',
            success: 'வெற்றி',
            submissionSuccess: 'இயற்கை கவனிப்பு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
            submissionFailed: 'சமர்ப்பித்தல் தோல்வியடைந்தது',
            tryAgain: 'கவனிப்பை சமர்ப்பிக்க தோல்வி. மீண்டும் முயற்சிக்கவும்.',
            networkIssue: 'நெட்வொர்க் சிக்கல்',
            networkError: 'இணைப்பை நிறுவ முடியவில்லை. தயவுசெய்து உங்கள் இணைய இணைப்பை சரிபார்க்கவும் மற்றும் மீண்டும் முயற்சிக்கவும்.',
            // Nature types
            naturalEvents: 'இயற்கை நிகழ்வுகள்',
            aesthetics: 'அழகியல்',
            other: 'மற்றவை',
            // Time options
            morning: 'காலை',
            noon: 'மதியம்',
            evening: 'மாலை',
            night: 'இரவு',
            preview: 'முன்னோட்டம்',
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
    const lang = translations[currentLanguage] || translations.en;

    const natureTypes = [
        { value: 'Natural events', label: lang.naturalEvents },
        { value: 'Aesthetics', label: lang.aesthetics },
        { value: 'Other', label: lang.other }
    ];

    const timeOptions = [
        { value: 'Morning', label: lang.morning },
        { value: 'Noon', label: lang.noon },
        { value: 'Evening', label: lang.evening },
        { value: 'Night', label: lang.night }
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

    const handleNatureSelect = (nature) => {
        setNatureType(nature);
        setShowNaturePicker(false);
    };

    const handlePreview = () => {
        // Validation
        if (!natureType) {
            setErrorAlertType('error');
            setErrorAlertTitle(lang.requiredField);
            setErrorAlertMessage(lang.selectCategoryAlert);
            setIsErrorAlertVisible(true);
            return;
        }

        if (!photo) {
            setErrorAlertType('error');
            setErrorAlertTitle(lang.requiredField);
            setErrorAlertMessage(lang.uploadPhoto);
            setIsErrorAlertVisible(true);
            return;
        }

        if (!timeOfDay) {
            setErrorAlertType('error');
            setErrorAlertTitle(lang.requiredField);
            setErrorAlertMessage(lang.selectTimeOfDay);
            setIsErrorAlertVisible(true);
            return;
        }

        setShowPreview(true);
    };

    const handleSubmit = async () => {
        setShowPreview(false);
        setIsSubmitting(true);

        try {
            const base64Image = await convertImageToBase64(photo);

            const natureData = {
                natureType,
                photo: base64Image,
                date: date.toISOString().split('T')[0],
                timeOfDay,
            };

            const response = await natureApi.createNature(natureData);

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
            let errorMessage = error.message || lang.tryAgain;
            if (errorMessage && errorMessage.includes('(')) {
                errorMessage = errorMessage.split('(')[0].trim();
            }
            
            setErrorAlertType(isNetworkError ? 'network' : 'error');
            setErrorAlertTitle(isNetworkError ? lang.networkIssue : lang.submissionFailed);
            setErrorAlertMessage(isNetworkError ? lang.networkError : errorMessage);
            setIsErrorAlertVisible(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Get display label for current nature type
    const getCurrentNatureLabel = () => {
        const nature = natureTypes.find(n => n.value === natureType);
        return nature ? nature.label : lang.selectCategory;
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
                    <Text style={styles.title}>{lang.title}</Text>
                </View>

                {/* Form Content */}
                <View style={styles.frameContainer}>
                <View style={styles.formContainer}>
                    {/* Category Dropdown */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            {lang.category}                        </Text>
                        <TouchableOpacity 
                            style={styles.dropdown}
                            onPress={() => setShowNaturePicker(true)}
                            disabled={isSubmitting}
                        >
                            <Text style={[styles.dropdownText, !natureType && styles.placeholder]}>
                                {getCurrentNatureLabel()}
                            </Text>
                            <Icon name="arrow-drop-down" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Photo Upload */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            {lang.photo}                        </Text>
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
                                        {lang.photoPlaceholder}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Date Picker */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            {lang.date}                        </Text>
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

                    {/* Time of Day - Using Custom Radio Buttons */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            {lang.timeOfDay}                        </Text>
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
                                    <Text style={styles.radioLabel}>{lang.morning}</Text>
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
                                    <Text style={styles.radioLabel}>{lang.noon}</Text>
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
                                    <Text style={styles.radioLabel}>{lang.evening}</Text>
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
                                    <Text style={styles.radioLabel}>{lang.night}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
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
                                {lang.preview}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                </View>
            </ScrollView>

            {/* Nature Type Picker Modal */}
            <Modal
                visible={showNaturePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowNaturePicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{lang.selectCategory}</Text>
                            <TouchableOpacity 
                                onPress={() => setShowNaturePicker(false)}
                                style={styles.modalCloseButton}
                            >
                                <Icon name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            <View style={styles.natureGrid}>
                                {natureTypes.map((nature) => (
                                    <TouchableOpacity
                                        key={nature.value}
                                        style={[
                                            styles.natureOption,
                                            natureType === nature.value && styles.natureOptionSelected
                                        ]}
                                        onPress={() => handleNatureSelect(nature.value)}
                                    >
                                        <Text style={[
                                            styles.natureOptionText,
                                            natureType === nature.value && styles.natureOptionTextSelected
                                        ]}>
                                            {nature.label}
                                        </Text>
                                        {natureType === nature.value && (
                                            <Icon name="check" size={24} color="#FFFFFF" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Image Picker Modal */}
            <Modal
                visible={showImagePicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowImagePicker(false)}
            >
                <View style={styles.imagePickerOverlay}>
                    <View style={styles.imagePickerContainer}>
                        <Text style={styles.imagePickerTitle}>{lang.chooseOption}</Text>
                        
                        <View style={styles.imagePickerOptions}>
                            <TouchableOpacity 
                                style={styles.imagePickerOption}
                                onPress={handleCamera}
                                activeOpacity={0.7}
                            >
                                <Icon name="photo-camera" size={50} color="#4A7856" />
                                <Text style={styles.imagePickerOptionText}>{lang.camera}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.imagePickerOption}
                                onPress={handleGallery}
                                activeOpacity={0.7}
                            >
                                <Icon name="photo-library" size={50} color="#4A7856" />
                                <Text style={styles.imagePickerOptionText}>{lang.gallery}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={styles.imagePickerCancelButton}
                            onPress={() => setShowImagePicker(false)}
                        >
                            <Text style={styles.imagePickerCancelText}>{lang.cancel}</Text>
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
                        observationType: 'nature'
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
                title={lang.title}
                isSubmitting={isSubmitting}
                language={currentLanguage as 'en' | 'si' | 'ta'}
                fields={[
                    { label: lang.category, value: natureTypes.find(n => n.value === natureType)?.label || natureType },
                    { label: lang.photo, value: photo || undefined, isImage: true },
                    { label: lang.date, value: formatDate(date) },
                    { label: lang.timeOfDay, value: timeOfDay === 'Morning' ? lang.morning : timeOfDay === 'Noon' ? lang.noon : timeOfDay === 'Evening' ? lang.evening : timeOfDay === 'Night' ? lang.night : timeOfDay },
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
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Times New Roman',
        color: '#4A7856',
        fontWeight: 'bold',
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontFamily: 'Times New Roman',
    },
    required: {
        color: '#E74C3C',
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
    placeholder: {
        color: '#999',
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
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '40%',
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
        paddingVertical: 15,
    },
    natureGrid: {
        gap: 10,
    },
    natureOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 10,
    },
    natureOptionSelected: {
        backgroundColor: '#4A7856',
        borderColor: '#4A7856',
    },
    natureOptionText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Times New Roman',
    },
    natureOptionTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
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

export default NatureDataCollection;