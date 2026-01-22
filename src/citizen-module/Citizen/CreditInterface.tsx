import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { plantApi } from '../../api/plantapi';
import { natureApi } from '../../api/natureApi';
import { animalApi } from '../../api/animalApi';

// component
const PhotoInformation = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { observationData, observationType } = route.params || {};
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [contactInfo, setContactInfo] = useState('');
    const [canUsePhoto, setCanUsePhoto] = useState('Yes');
    const [photoCredit, setPhotoCredit] = useState('');

    // Translation object
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
            tryAgain: 'Please try again later.'
        },
        si: {
            headerTitle: 'ඡායාරූප තොරතුරු',
            sectionTitle: 'ඡායාරූප ණය තොරතුරු',
            infoText: 'ඔබ උඩුගත කළ ඡායාරූපය ගැන වැඩිදුර දැනගැනීමට අවශ්‍ය නම්, කරුණාකර ඔබගේ සම්බන්ධතා විස්තර තබන්න.',
            contactLabel: 'ජංගම දුරකථන අංකය හෝ විද්‍යුත් තැපෑල (අත්‍යවශ්‍ය නොවේ)',
            contactPlaceholder: 'ඔබේ සම්බන්ධතා තොරතුරු',
            helperText: 'මෙම තොරතුරු පරිපාලකයා සමඟ බෙදා ගනු ඇත.',
            permissionQuestion: 'කරුණාකර අපට මෙම ඡායාරූපය භාවිතා කළ හැකිද යන්න සඳහන් කරන්න:',
            yes: 'ඔව්',
            no: 'නැත',
            photoCreditLabel: 'ඡායාරූප ණය:',
            photoCreditPlaceholder: 'මෙම ඡායාරූපය සඳහා අප කෙසේ ණය දිය යුතුද?',
            submit: 'ඉදිරිපත් කරන්න',
            success: 'සාර්ථකයි',
            submissionSuccess: 'ඡායාරූප තොරතුරු සාර්ථකව සුරකින ලදී!',
            submissionFailed: 'ඉදිරිපත් කිරීම අසාර්ථකයි',
            tryAgain: 'කරුණාකර පසුව නැවත උත්සාහ කරන්න.'
        },
        ta: {
            headerTitle: 'புகைப்பட தகவல்',
            sectionTitle: 'புகைப்பட வரவுகள் தகவல்',
            infoText: 'நீங்கள் பதிவேற்றிய புகைப்படத்தைப் பற்றி மேலும் அறிய விரும்பினால், உங்கள் தொடர்பு விவரங்களை விட்டுவிடுங்கள்.',
            contactLabel: 'மொபைல் எண் அல்லது மின்னஞ்சல் (விருப்பமானது)',
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
            tryAgain: 'பின்னர் மீண்டும் முயற்சிக்கவும்.'
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

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const photoInfo = {
                contactInfo: contactInfo.trim() || undefined,
                canUsePhoto: canUsePhoto === 'Yes',
                photoCredit: photoCredit.trim() || undefined
            };

            console.log('Submitting photo information:', photoInfo);
            console.log('Observation type:', observationType);

            // Get the observation ID
            const observationId = observationData?._id || observationData?.id;

            if (observationId) {
                // Call the appropriate API based on observation type
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
                        // Human activity doesn't have a backend yet, just log
                        console.log('Human activity photo info (no backend):', photoInfo);
                        break;
                    default:
                        console.log('Unknown observation type:', observationType);
                }
            }

            Alert.alert(
                t.success,
                t.submissionSuccess,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Navigate to CitizenDashboard
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'CitizenDashboard' }],
                            });
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Error submitting photo information:', error);
            Alert.alert(
                t.submissionFailed,
                error.message || t.tryAgain
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{t.headerTitle}</Text>
                </View>

                {/* Form Container */}
                <View style={styles.formContainer}>
                    {/* Photo Credits Information Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.sectionTitle}</Text>
                        
                        <Text style={styles.infoText}>
                            {t.infoText}
                        </Text>

                        {/* Contact Information Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t.contactLabel}</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={t.contactPlaceholder}
                                placeholderTextColor="#CCC"
                                value={contactInfo}
                                onChangeText={setContactInfo}
                            />
                            <Text style={styles.helperText}>
                                {t.helperText}
                            </Text>
                        </View>

                        {/* Permission Section */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.questionText}>
                                {t.permissionQuestion}
                            </Text>
                            
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

                        {/* Photo Credit Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t.photoCreditLabel}</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={t.photoCreditPlaceholder}
                                placeholderTextColor="#CCC"
                                value={photoCredit}
                                onChangeText={setPhotoCredit}
                            />
                        </View>

                        {/* Submit Button */}
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
        </SafeAreaView>
    );
}

// styles
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#E8E8E8',
    },
    container: {
        flex: 1,
        backgroundColor: '#E8E8E8',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'JejuHallasan-Regular',
        color: '#4A7856',
        fontWeight: 'bold',
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        fontFamily: 'JejuHallasan-Regular',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 20,
        fontFamily: 'JejuHallasan-Regular',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontFamily: 'JejuHallasan-Regular',
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
        fontFamily: 'JejuHallasan-Regular',
    },
    helperText: {
        fontSize: 12,
        color: '#999',
        marginTop: 6,
        fontFamily: 'JejuHallasan-Regular',
    },
    questionText: {
        fontSize: 15,
        color: '#666',
        marginBottom: 15,
        fontWeight: '500',
        fontFamily: 'JejuHallasan-Regular',
    },
    radioGroup: {
        flexDirection: 'row',
        gap: 30,
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
        fontFamily: 'JejuHallasan-Regular',
    },
    submitButton: {
        backgroundColor: '#4A7856',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
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
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'JejuHallasan-Regular',
    },
    submitButtonDisabled: {
        backgroundColor: '#8AAB91',
    },
});

export default PhotoInformation;