//import libraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Platform, Image, Modal, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../custom-alert/alert-design';
import PreviewModal from './PreviewModal';

// component
const HumanActivityDataCollection = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const category = route.params?.category || 'Human Activity';
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    const [activityType, setActivityType] = useState('');
    const [showActivityPicker, setShowActivityPicker] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeOfDay, setTimeOfDay] = useState('');
    const [description, setDescription] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Translation object
    const translations = {
        en: {
            title: 'Threats & Human Activities',
            activityType: 'Activity Type',
            selectActivityType: 'Select activity type',
            photo: 'Photo',
            date: 'Date',
            timeOfDay: 'Time of Day',
            description: 'Description (Optional)',
            submit: 'Submit',
            photoPlaceholder: 'Tap to upload or capture a photo',
            chooseOption: 'Choose an option',
            camera: 'Camera',
            gallery: 'Gallery',
            cancel: 'Cancel',
            requiredField: 'Required Field',
            selectActivityAlert: 'Please select an activity type',
            uploadPhoto: 'Please upload a photo',
            selectTimeOfDay: 'Please select time of day',
            descriptionPlaceholder: 'Add any additional notes about your observation...',
            // Activity categories
            threatsAndHumanActivities: 'Threats and Human Activities',
            // Activities
            fire: 'Fire',
            deforestation: 'Deforestation',
            mining: 'Mining',
            wasteDisposal: 'Waste disposal',
            construction: 'Construction',
            domesticAnimals: 'Domestic animals',
            huntingCollection: 'Hunting and collection of species',
            feedingWildAnimals: 'Feeding of wild animals',
            illegalBehaviour: 'Illegal behaviour',
            // Time options
            morning: 'Morning',
            noon: 'Noon',
            evening: 'Evening',
            night: 'Night',
            preview: 'Preview',
            type: 'Type'
        },
        si: {
            title: 'තර්ජන සහ මානව ක්‍රියාකාරකම්',
            activityType: ' ක්‍රියාකාරකම් කාණ්ඩය',
            selectActivityType: 'ක්‍රියාකාරකම් කාණ්ඩය තෝරන්න',
            photo: 'ඡායාරූපය',
            date: 'දිනය',
            timeOfDay: 'දවසේ වේලාව',
            description: 'විස්තරය (අත්‍යවශ්‍ය නොවේ)',
            submit: 'දත්ත ඇතුලත් කිරීම තහවුරු කරන්න',
            submitting: 'දත්ත ඇතුලත් කිරීම තහවුරු කරමින්...',
            photoPlaceholder: 'ඡායාරූපය ගැනීම/ ඇතුලත් කිරීම මෙහිදී සිදු කරන්න',
            chooseOption: ' තෝරන්න',
            camera: 'කැමරාව',
            gallery: 'ගැලරිය',
            cancel: 'අවලංගු කරන්න',
            requiredField: 'අවශ්‍ය ක්ෂේත්‍රය',
            selectActivityAlert: 'කරුණාකර ක්‍රියාකාරකම් වර්ගයක් තෝරන්න',
            uploadPhoto: 'කරුණාකර ඡායාරූපයක් උඩුගත කරන්න',
            selectTimeOfDay: 'කරුණාකර දවසේ වේලාව තෝරන්න',
            descriptionPlaceholder: 'ඔබේ නිරීක්ෂණය ගැන අමතර සටහන් එක් කරන්න...',
            // Activity categories
            threatsAndHumanActivities: 'තර්ජන සහ මානව ක්‍රියාකාරකම්',
            // Activities
            fire: 'ගිනි ගැනීම්',
            deforestation: 'වන හායනය',
            mining: 'කැණීම් කටයුතු',
            wasteDisposal: 'අපද්‍රව්‍ය බැහැර කිරීම',
            construction: 'ඉදිකිරීම් කටයුතු',
            domesticAnimals: 'ගෘහාශ්‍රිත සතුන්',
            huntingCollection: 'දඩයම් කිරීම / ජීවීන් එකතු කිරීම',
            feedingWildAnimals: 'වන සතුන්ට ආහාර දීම',
            illegalBehaviour: 'අවිනීතික හැසිරීම්',
            // Time options
            morning: 'උදෑසන',
            noon: 'මධ්‍යහනය',
            evening: 'සවස',
            night: 'රාත්‍රිය',
            preview: 'පෙරදසුන',
            type: 'වර්ගය'
        },
        ta: {
            title: 'அச்சுறுத்தல்கள் மற்றும் மனித செயற்பாடுகள்',
            activityType: 'செயற்பாட்டு வகை',
            selectActivityType: 'செயற்பாட்டு வகையைத் தேர்ந்தெடுக்கவும்',
            photo: 'புகைப்படம்',
            date: 'திகதி',
            timeOfDay: 'நாளின் நேரம்',
            description: 'விளக்கம் (விருப்பமானது)',
            submit: 'சமர்ப்பிக்கவும்',
            photoPlaceholder: 'புகைப்படத்தைப் பதிவேற்ற அழுத்தவும் எடுக்க தட்டவும்',
            chooseOption: 'ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்',
            camera: 'கேமரா',
            gallery: 'புகைப்படங்கள்',
            cancel: 'ரத்துசெய்',
            requiredField: 'தேவையான புலம்',
            selectActivityAlert: 'தயவுசெய்து ஒரு செயல்பாடு வகையைத் தேர்ந்தெடுக்கவும்',
            uploadPhoto: 'தயவுசெய்து ஒரு புகைப்படத்தைப் பதிவேற்றவும்',
            selectTimeOfDay: 'தயவுசெய்து நாளின் நேரத்தைத் தேர்ந்தெடுக்கவும்',
            descriptionPlaceholder: 'உங்கள் கவனிப்பு பற்றிய கூடுதல் குறிப்புகளைச் சேர்க்கவும்...',
            // Activity categories
            threatsAndHumanActivities: 'அச்சுறுத்தல் மற்றும் மனித நடவடிக்கைகள்',
            // Activities
            fire: 'தீ',
            deforestation: 'காடழிப்பு',
            mining: 'அகழ்வுப் பணிகள்',
            wasteDisposal: 'கழிவுகள்',
            construction: 'கட்டுமானம்',
            domesticAnimals: 'வீட்டு விலங்குகள்',
            huntingCollection: 'வேட்டையாடுதல் / உயிரினங்களை சேகரித்தல்',
            feedingWildAnimals: 'காட்டு விலங்குகளுக்கு உணவளித்தல்',
            illegalBehaviour: 'சட்டவிரோத நடத்தை',
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
    const t = translations[currentLanguage] || translations.en;

    const activityCategories = {
        [t.threatsAndHumanActivities]: [
            { value: 'Fire', label: t.fire },
            { value: 'Deforestation', label: t.deforestation },
            { value: 'Mining', label: t.mining },
            { value: 'Waste disposal', label: t.wasteDisposal },
            { value: 'Construction', label: t.construction },
            { value: 'Domestic animals', label: t.domesticAnimals },
            { value: 'Hunting and collection of species', label: t.huntingCollection },
            { value: 'Feeding of wild animals', label: t.feedingWildAnimals },
            { value: 'Illegal behaviour', label: t.illegalBehaviour }
        ]
    };

    const timeOptions = [
        { value: 'Morning', label: t.morning },
        { value: 'Noon', label: t.noon },
        { value: 'Evening', label: t.evening },
        { value: 'Night', label: t.night }
    ];

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
            quality: 1,
            saveToPhotos: true,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                // User cancelled, no need to show error
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
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                // User cancelled, no need to show error
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

    const handleActivitySelect = (activity) => {
        setActivityType(activity);
        setShowActivityPicker(false);
    };

    const handlePreview = () => {
        if (!activityType) {
            Alert.alert(t.requiredField, t.selectActivityAlert);
            return;
        }

        if (!photo) {
            Alert.alert(t.requiredField, t.uploadPhoto);
            return;
        }

        if (!timeOfDay) {
            Alert.alert(t.requiredField, t.selectTimeOfDay);
            return;
        }

        setShowPreview(true);
    };

    const handleSubmit = () => {
        setShowPreview(false);
        setIsSubmitting(true);

        const observationData = {
            category,
            activityType,
            photo,
            date: date.toISOString().split('T')[0],
            timeOfDay,
            description
        };
        setSubmittedData(observationData);
        setIsSubmitting(false);
        setIsAlertVisible(true);
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Get display label for current activity type
    const getCurrentActivityLabel = () => {
        for (const activities of Object.values(activityCategories)) {
            const found = activities.find(a => a.value === activityType);
            if (found) return found.label;
        }
        return t.selectActivityType;
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

                {/* Form Content */}
                <View style={styles.frameContainer}>
                <View style={styles.formContainer}>
                    {/* Activity Type Dropdown */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t.activityType}</Text>
                        <TouchableOpacity 
                            style={styles.dropdown}
                            onPress={() => setShowActivityPicker(true)}
                        >
                            <Text style={[styles.dropdownText, !activityType && styles.placeholder]}>
                                {getCurrentActivityLabel()}
                            </Text>
                            <Icon name="arrow-drop-down" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Photo Upload */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t.photo}</Text>
                        <TouchableOpacity 
                            style={styles.photoUploadArea}
                            onPress={handlePhotoUpload}
                            activeOpacity={0.7}
                        >
                            {photo ? (
                                <View style={styles.photoContainer}>
                                    <Image source={{ uri: photo }} style={styles.uploadedPhoto} />
                                    <TouchableOpacity 
                                        style={styles.removePhotoButton}
                                        onPress={() => setPhoto(null)}
                                        activeOpacity={0.8}
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
                            />
                        )}
                    </View>

                    {/* Time of Day */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t.timeOfDay}</Text>
                        <View style={styles.radioContainer}>
                            <View style={styles.radioRow}>
                                <TouchableOpacity 
                                    style={styles.radioItem}
                                    onPress={() => setTimeOfDay('Morning')}
                                >
                                    <RadioButton
                                        value="Morning"
                                        status={timeOfDay === 'Morning' ? 'checked' : 'unchecked'}
                                        onPress={() => setTimeOfDay('Morning')}
                                        color="#4A7856"
                                    />
                                    <Text style={styles.radioLabel}>{t.morning}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.radioItem}
                                    onPress={() => setTimeOfDay('Noon')}
                                >
                                    <RadioButton
                                        value="Noon"
                                        status={timeOfDay === 'Noon' ? 'checked' : 'unchecked'}
                                        onPress={() => setTimeOfDay('Noon')}
                                        color="#4A7856"
                                    />
                                    <Text style={styles.radioLabel}>{t.noon}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.radioRow}>
                                <TouchableOpacity 
                                    style={styles.radioItem}
                                    onPress={() => setTimeOfDay('Evening')}
                                >
                                    <RadioButton
                                        value="Evening"
                                        status={timeOfDay === 'Evening' ? 'checked' : 'unchecked'}
                                        onPress={() => setTimeOfDay('Evening')}
                                        color="#4A7856"
                                    />
                                    <Text style={styles.radioLabel}>{t.evening}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.radioItem}
                                    onPress={() => setTimeOfDay('Night')}
                                >
                                    <RadioButton
                                        value="Night"
                                        status={timeOfDay === 'Night' ? 'checked' : 'unchecked'}
                                        onPress={() => setTimeOfDay('Night')}
                                        color="#4A7856"
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
                        />
                    </View>

                    {/* Preview Button */}
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handlePreview}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.submitButtonText}>{t.preview}</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </ScrollView>

            {/* Activity Type Picker Modal */}
            <Modal
                visible={showActivityPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowActivityPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t.selectActivityType}</Text>
                            <TouchableOpacity 
                                onPress={() => setShowActivityPicker(false)}
                                style={styles.modalCloseButton}
                            >
                                <Icon name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            {Object.entries(activityCategories).map(([categoryName, activities]) => (
                                <View key={categoryName} style={styles.categorySection}>
                                    <Text style={styles.categoryTitle}>{categoryName}</Text>
                                    <View style={styles.activityGrid}>
                                        {activities.map((activity) => (
                                            <TouchableOpacity
                                                key={activity.value}
                                                style={[
                                                    styles.activityOption,
                                                    activityType === activity.value && styles.activityOptionSelected
                                                ]}
                                                onPress={() => handleActivitySelect(activity.value)}
                                            >
                                                <Text style={[
                                                    styles.activityOptionText,
                                                    activityType === activity.value && styles.activityOptionTextSelected
                                                ]}>
                                                    {activity.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}
                            
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
                        observationType: 'humanActivity'
                    });
                }}
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
                    { label: t.activityType, value: getCurrentActivityLabel() },
                    { label: t.photo, value: photo || '', isImage: true },
                    { label: t.date, value: formatDate(date) },
                    { label: t.timeOfDay, value: timeOptions.find(opt => opt.value === timeOfDay)?.label || timeOfDay },
                    { label: t.description, value: description || '-' },
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
        textAlign:'center'
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
        maxHeight: '80%',
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
    categorySection: {
        marginBottom: 25,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A7856',
        marginBottom: 12,
        fontFamily: 'Times New Roman',
    },
    activityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    activityOption: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        minWidth: '47%',
    },
    activityOptionSelected: {
        backgroundColor: '#4A7856',
        borderColor: '#4A7856',
    },
    activityOptionText: {
        fontSize: 15,
        color: '#333',
        fontFamily: 'Times New Roman',
    },
    activityOptionTextSelected: {
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

export default HumanActivityDataCollection;