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

    const [natureType, setNatureType] = useState('');
    const [showNaturePicker, setShowNaturePicker] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeOfDay, setTimeOfDay] = useState('');
    const [description, setDescription] = useState('');

    // Translation object
    const translations = {
        en: {
            title: 'Nature',
            category: 'Category',
            selectCategory: 'Select category',
            photo: 'Photo',
            date: 'Date',
            timeOfDay: 'Time of Day',
            description: 'Description (Optional)',
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
            // Nature types
            naturalEvents: 'Natural events',
            aesthetics: 'Aesthetics',
            other: 'Other',
            // Time options
            morning: 'Morning',
            noon: 'Noon',
            evening: 'Evening',
            night: 'Night'
        },
        si: {
            title: 'ස්වභාවධර්මය',
            category: 'කාණ්ඩය',
            selectCategory: 'කාණ්ඩය තෝරන්න',
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
            requiredField: 'අවශ්‍ය ක්ෂේත්‍රය',
            selectCategoryAlert: 'කරුණාකර කාණ්ඩයක් තෝරන්න',
            uploadPhoto: 'කරුණාකර ඡායාරූපයක් උඩුගත කරන්න',
            selectTimeOfDay: 'කරුණාකර දවසේ වේලාව තෝරන්න',
            descriptionPlaceholder: 'ඔබේ නිරීක්ෂණය ගැන අමතර සටහන් එක් කරන්න...',
            success: 'සාර්ථකයි',
            submissionSuccess: 'ස්වභාවධර්ම නිරීක්ෂණය සාර්ථකව ඉදිරිපත් කරන ලදී!',
            submissionFailed: 'ඉදිරිපත් කිරීම අසාර්ථක විය',
            tryAgain: 'නිරීක්ෂණය ඉදිරිපත් කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.',
            // Nature types
            naturalEvents: 'ස්වාභාවික සිදුවීම්',
            aesthetics: 'සෞන්දර්යය',
            other: 'වෙනත්',
            // Time options
            morning: 'උදෑසන',
            noon: 'මධ්‍යාහ්නය',
            evening: 'සවස',
            night: 'රාත්‍රිය'
        },
        ta: {
            title: 'இயற்கை',
            category: 'வகை',
            selectCategory: 'வகையைத் தேர்ந்தெடுக்கவும்',
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
            requiredField: 'தேவையான புலம்',
            selectCategoryAlert: 'தயவுசெய்து ஒரு வகையைத் தேர்ந்தெடுக்கவும்',
            uploadPhoto: 'தயவுசெய்து ஒரு புகைப்படத்தைப் பதிவேற்றவும்',
            selectTimeOfDay: 'தயவுசெய்து நாளின் நேரத்தைத் தேர்ந்தெடுக்கவும்',
            descriptionPlaceholder: 'உங்கள் கவனிப்பு பற்றிய கூடுதல் குறிப்புகளைச் சேர்க்கவும்...',
            success: 'வெற்றி',
            submissionSuccess: 'இயற்கை கவனிப்பு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
            submissionFailed: 'சமர்ப்பித்தல் தோல்வியடைந்தது',
            tryAgain: 'கவனிப்பை சமர்ப்பிக்க தோல்வி. மீண்டும் முயற்சிக்கவும்.',
            // Nature types
            naturalEvents: 'இயற்கை நிகழ்வுகள்',
            aesthetics: 'அழகியல்',
            other: 'மற்றவை',
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

    const handleNatureSelect = (nature) => {
        setNatureType(nature);
        setShowNaturePicker(false);
    };

    const handleSubmit = async () => {
        // Validation
        if (!natureType) {
            Alert.alert(lang.requiredField, lang.selectCategoryAlert);
            return;
        }

        if (!photo) {
            Alert.alert(lang.requiredField, lang.uploadPhoto);
            return;
        }

        if (!timeOfDay) {
            Alert.alert(lang.requiredField, lang.selectTimeOfDay);
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('Converting image to base64...');
            const base64Image = await convertImageToBase64(photo);

            const natureData = {
                natureType,
                photo: base64Image,
                date: date.toISOString().split('T')[0],
                timeOfDay,
                description: description.trim() || undefined,
            };

            console.log('Submitting nature observation to backend...');

            const response = await natureApi.createNature(natureData);

            if (response.success) {
                setIsAlertVisible(true);
            }
        } catch (error) {
            console.error('Error submitting nature observation:', error);
            Alert.alert(
                lang.submissionFailed,
                error.message || lang.tryAgain
            );
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

                    {/* Description */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{lang.description}</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder={lang.descriptionPlaceholder}
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
                                    {lang.submitting}
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.submitButtonText}>{lang.submit}</Text>
                        )}
                    </TouchableOpacity>
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
                    // Reset form
                    setNatureType('');
                    setPhoto(null);
                    setDate(new Date());
                    setTimeOfDay('');
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
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
        fontFamily: 'serif',
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
});

export default NatureDataCollection;