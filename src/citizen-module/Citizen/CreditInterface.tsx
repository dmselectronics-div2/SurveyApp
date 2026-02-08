import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { plantApi } from '../../api/plantapi';
import { natureApi } from '../../api/natureApi';
import { animalApi } from '../../api/animalApi';
import CustomAlert from '../custom-alert/alert-design';

const PhotoInformation = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { observationData, observationType } = route.params || {};
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
    const [errorAlertType, setErrorAlertType] = useState<'error' | 'network'>('error');
    const [errorAlertTitle, setErrorAlertTitle] = useState('');
    const [errorAlertMessage, setErrorAlertMessage] = useState('');

    const [contactInfo, setContactInfo] = useState('');
    const [canUsePhoto, setCanUsePhoto] = useState('Yes');
    const [photoCredit, setPhotoCredit] = useState('');

    const translations = {
        en: {
            headerTitle: 'Photo Information',
            sectionTitle: 'Photo Credits Information',
            infoText: 'If you wish to know more about your uploaded photo, please leave your contact details.',
            contactLabel: 'Mobile number or email (optional)',
            contactPlaceholder: 'Your contact information',
            helperText: 'This information will be shared with the admin.',
            permissionQuestion: 'Please indicate whether we can use this photo:',
            yes: 'Yes',
            no: 'No',
            photoCreditLabel: 'Photo credit:',
            photoCreditPlaceholder: 'How should we credit this photo?',
            submit: 'Submit',
            success: 'Success',
            submissionSuccess: 'Photo information saved successfully!',
            submissionFailed: 'Submission Failed',
            tryAgain: 'Please try again later.',
            networkIssue: 'Network Issue',
            networkError: 'Unable to connect. Please check your internet connection and try again.',
            validationError: 'Validation Error',
            invalidEmail: 'Please enter a valid email address.',
            invalidPhone: 'Please enter a valid phone number (at least 10 digits).',
            invalidContact: 'Please enter a valid email or phone number.',
            contactRequired: 'Contact information is required when providing photo credit or usage permission.'
        },
        si: {
            headerTitle: 'ඡායාරූපය පිළිබද තොරතුරු',
            sectionTitle: 'ඡායාරූපයේ හිමිකාරීත්වය සඳහා තොරතුරු',
            infoText: 'ඔබ ලබා දුන් ඡායාරූපය පිළිබඳ වැඩිදුර තොරතුරු අවශ්‍ය නම් පහත තොරතුරු ලබා දෙන්න.',
            contactLabel: 'දුරකථන අංකය / විද්‍යුත් තැපැල් ලිපිනය',
            contactPlaceholder: 'ඔබව සම්බන්ධ කර ගත හැකි විස්තර',
            helperText: 'මෙම තොරතුරු පරිපාලක සමග හුවමාරු වීම සිදුවේ.',
            permissionQuestion: 'ඔබගේ ඡායාරූපය අප හට භාවිතා කිරීමට අවසර ලබා දෙන්නේ ද ?',
            yes: 'ඔව්',
            no: 'නැත',
            photoCreditLabel: 'ඡායාරූපයේ හිමිකාරීත්වය:',
            photoCreditPlaceholder: 'ඡායාරූපයේ හිමිකාරිත්වය සඳහන් විය යුතු ආකාරය පහත දක්වන්න?',
            submit: 'දත්ත ඇතුලත් කිරීම තහවුරු කරන්න',
            success: 'සාර්ථකයි',
            submissionSuccess: 'ඡායාරූප තොරතුරු සාර්ථකව සුරකින ලදී!',
            submissionFailed: 'ඉදිරිපත් කිරීම අසාර්ථකයි',
            tryAgain: 'කරුණාකර පසුව නැවත උත්සාහ කරන්න.',
            networkIssue: 'ජාල ගැටලුව',
            networkError: 'සංයෝගය ස්ථාපිත කිරීමට නොහැකි විය. කරුණාකර ඔබේ අන්තර්ජාල සංයෝගය පරීක්ෂා කරන්න සහ නැවත උත්සාහ කරන්න.',
            validationError: 'වලංගුතා දෝෂය',
            invalidEmail: 'කරුණාකර වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළු කරන්න.',
            invalidPhone: 'කරුණාකර වලංගු දුරකථන අංකයක් ඇතුළු කරන්න (අවම වශයෙන් ඉලක්කම් 10).',
            invalidContact: 'කරුණාකර වලංගු විද්‍යුත් තැපැල් ලිපිනයක් හෝ දුරකථන අංකයක් ඇතුළු කරන්න.',
            contactRequired: 'ඡායාරූප හිමිකාරිත්වය හෝ භාවිතා කිරීමේ අවසර ලබා දෙන විට සම්බන්ධතා තොරතුරු අවශ්‍ය වේ.'
        },
        ta: {
            headerTitle: 'புகைப்பட தகவல்',
            sectionTitle: 'புகைப்பட வரவுகள் தகவல்',
            infoText: 'நீங்கள் பதிவேற்றிய புகைப்படத்தைப் பற்றி மேலும் அறிய விரும்பினால், உங்கள் தொடர்பு விவரங்களை பகிரவும்.',
            contactLabel: 'தொலைபேசி இலக்கம் அல்லது மின்னஞ்சல் (விருப்பமானது)',
            contactPlaceholder: 'உங்கள் தொடர்பு தகவல்',
            helperText: 'இந்தத் தகவல் நிர்வாகியுடன் பகிரப்படும்.',
            permissionQuestion: 'இந்த புகைப்படத்தை நாங்கள் பயன்படுத்தலாமா என்பதைக் குறிப்பிடுங்கள்:',
            yes: 'ஆம்',
            no: 'இல்லை',
            photoCreditLabel: 'புகைப்பட வரவு:',
            photoCreditPlaceholder: 'இந்த புகைப்படத்தை எவ்வாறு வரவு வைக்க வேண்டும்?',
            submit: 'சமர்ப்பிக்கவும்',
            success: 'வெற்றி',
            submissionSuccess: 'புகைப்பட தகவல் வெற்றிகரமாக சேமிக்கப்பட்டது!',
            submissionFailed: 'சமர்ப்பிப்பு தோல்வியடைந்தது',
            tryAgain: 'பின்னர் மீண்டும் முயற்சிக்கவும்.',
            networkIssue: 'நெட்வொர்க் சிக்கல்',
            networkError: 'இணைப்பை நிறுவ முடியவில்லை. தயவுசெய்து உங்கள் இணைய இணைப்பை சரிபார்க்கவும் மற்றும் மீண்டும் முயற்சிக்கவும்.',
            validationError: 'சரிபடுத்தல் பிழை',
            invalidEmail: 'தயவுசெய்து சரியான மின்னஞ்சல் முகவரி உள்ளிடவும்.',
            invalidPhone: 'தயவுசெய்து சரியான தொலைபேசி இலக்கத்தை உள்ளிடவும் (குறைந்தபட்சம் 10 இலக்கங்கள்).',
            invalidContact: 'தயவுசெய்து சரியான மின்னஞ்சல் முகவரி அல்லது தொலைபேசி இலக்கத்தை உள்ளிடவும்.',
            contactRequired: 'புகைப்பட வரவு அல்லது பயன்பாட்டு அனுமதி வழங்கும் போது தொடர்பு தகவல் தேவை.'
        }
    };

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('userLanguage');
            if (savedLanguage) setCurrentLanguage(savedLanguage);
        } catch (error) {
            console.error('Error loading language:', error);
        }
    };

    const t = translations[currentLanguage] || translations.en;

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^\d{10,}$/;
        return phoneRegex.test(phone.replace(/[^\d]/g, ''));
    };

    const validateContact = (contact: string, isRequired: boolean): string | null => {
        // Check if contact is required
        if (isRequired && (!contact || contact.trim() === '')) {
            return t.contactRequired;
        }

        // If not required and empty, validation passes
        if (!contact || contact.trim() === '') {
            return null;
        }

        const trimmedContact = contact.trim();
        const isEmail = trimmedContact.includes('@');
        const isPhone = /^\d/.test(trimmedContact);

        if (isEmail) {
            if (!validateEmail(trimmedContact)) {
                return t.invalidEmail;
            }
        } else if (isPhone) {
            if (!validatePhone(trimmedContact)) {
                return t.invalidPhone;
            }
        } else {
            return t.invalidContact;
        }

        return null; // Valid
    };

    const handleSubmit = async () => {
        // Determine if contact info is required
        // Contact is required if photo credit is provided OR user allows photo usage
        const isContactRequired = (photoCredit && photoCredit.trim() !== '') || canUsePhoto === 'Yes';

        // Validate contact info based on requirement
        const contactValidationError = validateContact(contactInfo, isContactRequired);
        if (contactValidationError) {
            setErrorAlertType('error');
            setErrorAlertTitle(t.validationError);
            setErrorAlertMessage(contactValidationError);
            setIsErrorAlertVisible(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const photoInfo = {
                contactInfo: contactInfo.trim() || undefined,
                canUsePhoto: canUsePhoto === 'Yes',
                photoCredit: photoCredit.trim() || undefined
            };

            const observationId = observationData?._id || observationData?.id;

            if (observationId) {
                switch (observationType) {
                    case 'plant':
                        await plantApi.updatePlantPhotoInfo(observationId, photoInfo);
                        break;
                    case 'nature':
                        await natureApi.updateNaturePhotoInfo(observationId, photoInfo);
                        break;
                    case 'animal':
                        await animalApi.updateAnimalPhotoInfo(observationId, photoInfo);
                        break;
                    case 'humanActivity':
                        // Log actual observation data values
                        console.log('=== Human Activity Observation Submitted ===');
                        console.log('Type: Human Activity');
                        console.log('Photo Credit:', photoCredit || 'Not provided');
                        console.log('Contact:', contactInfo || 'Not provided');
                        console.log('Can Use Photo:', canUsePhoto);
                        console.log('Observation Date:', observationData?.date || 'N/A');
                        console.log('Time of Day:', observationData?.timeOfDay || 'N/A');
                        console.log('Description:', observationData?.description || 'N/A');
                        console.log('=====================================');
                        break;
                    default:
                        // Log actual observation data values for unknown types
                        console.log('=== Observation Submitted ===');
                        console.log('Type:', observationType);
                        console.log('Photo Credit:', photoCredit || 'Not provided');
                        console.log('Contact:', contactInfo || 'Not provided');
                        console.log('Can Use Photo:', canUsePhoto);
                        if (observationData) {
                            console.log('Date:', observationData.date || 'N/A');
                            console.log('Time of Day:', observationData.timeOfDay || 'N/A');
                            console.log('Description:', observationData.description || 'N/A');
                        }
                        console.log('============================');
                }
            }

            setIsAlertVisible(true);
        } catch (error) {
            // Determine if it's a network error
            const isNetworkError = error.message && 
                (error.message.includes('Network') || 
                 error.message.includes('timeout') ||
                 error.message.includes('fetch'));
            
            setErrorAlertType(isNetworkError ? 'network' : 'error');
            setErrorAlertTitle(isNetworkError ? t.networkIssue : t.submissionFailed);
            setErrorAlertMessage(isNetworkError ? t.networkError : (error.message || t.tryAgain));
            setIsErrorAlertVisible(true);
            
            console.error('Error submitting photo information:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t.headerTitle}</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.frameContainer}>
                    <View style={styles.formContainer}>
                        <Text style={styles.sectionTitle}>{t.sectionTitle}</Text>

                        <Text style={styles.infoText}>{t.infoText}</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t.contactLabel}</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={t.contactPlaceholder}
                                placeholderTextColor="#AAA"
                                value={contactInfo}
                                onChangeText={setContactInfo}
                            />
                            <Text style={styles.helperText}>{t.helperText}</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t.photoCreditLabel}</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={t.photoCreditPlaceholder}
                                placeholderTextColor="#AAA"
                                value={photoCredit}
                                onChangeText={setPhotoCredit}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.questionText}>{t.permissionQuestion}</Text>
                            <View style={styles.radioGroup}>
                                <TouchableOpacity
                                    style={styles.radioOption}
                                    onPress={() => setCanUsePhoto('Yes')}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.radioButton}>
                                        {canUsePhoto === 'Yes' && <View style={styles.radioButtonSelected} />}
                                    </View>
                                    <Text style={styles.radioLabel}>{t.yes}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.radioOption}
                                    onPress={() => setCanUsePhoto('No')}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.radioButton}>
                                        {canUsePhoto === 'No' && <View style={styles.radioButtonSelected} />}
                                    </View>
                                    <Text style={styles.radioLabel}>{t.no}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            activeOpacity={0.8}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.submitButtonText}>{t.submit}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Success Alert */}
            <CustomAlert
                visible={isAlertVisible}
                onClose={() => {
                    setIsAlertVisible(false);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'CitizenDashboard' }],
                    });
                }}
                type="success"
                title={t.success}
                message={t.submissionSuccess}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingVertical: 15,
    },
    frameContainer: {
        marginHorizontal: 15,
        marginVertical: 15,
        borderWidth: 2,
        borderColor: '#4A7856',
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        paddingBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
            },
            android: {
                elevation: 7,
            },
        }),
    },
    header: {
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Times New Roman',
        color: '#4A7856',
        fontWeight: 'bold',
        marginTop: 9,
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 25,
        fontFamily: 'Times New Roman',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 30,
        fontFamily: 'Times New Roman',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        fontFamily: 'Times New Roman',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 15,
        color: '#333',
        backgroundColor: '#FAFAFA',
        fontFamily: 'Times New Roman',
        textAlign: 'center',
    },
    helperText: {
        fontSize: 12,
        color: '#999',
        marginTop: 6,
        marginBottom: 20,
        fontFamily: 'Times New Roman',
    },
    questionText: {
        fontSize: 15,
        color: '#666',
        marginBottom: 15,
        fontWeight: '500',
        fontFamily: 'Times New Roman',
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#4A7856',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    radioButtonSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4A7856',
    },
    radioLabel: {
        fontSize: 15,
        color: '#333',
        fontFamily: 'Times New Roman',
    },
    submitButton: {
        backgroundColor: '#4A7856',
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    submitButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Times New Roman',
        textAlign: 'center'
        
    },
    submitButtonDisabled: {
        backgroundColor: '#8AAB91',
    },
});

export default PhotoInformation;
