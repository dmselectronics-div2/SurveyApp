// LanguageSelection.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LanguageSelection = () => {
    const navigation = useNavigation();
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const languages = [
        { code: 'si', name: 'සිංහල', label: 'Sinhala' },
        { code: 'ta', name: 'தமிழ்', label: 'Tamil' },
        { code: 'en', name: 'English', label: 'English' }
    ];

    const handleLanguageSelect = (langCode) => {
        setSelectedLanguage(langCode);
    };

    const handleContinue = async () => {
        if (!selectedLanguage) {
            return;
        }

        try {
            // Save language preference
            await AsyncStorage.setItem('userLanguage', selectedLanguage);
            
            // Navigate to citizen dashboard
            navigation.navigate('CitizenDashboard');
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    const getButtonText = () => {
        switch (selectedLanguage) {
            case 'si':
                return 'ඉදිරියට';
            case 'ta':
                return 'தொடரவும்';
            default:
                return 'Continue';
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/image/welcome.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header Card */}
                    <View style={styles.headerCard}>
                        <Icon name="language" size={40} color="#FFFFFF" />
                        <Text style={styles.headerTitle}>භාෂාව තෝරන්න Select Language மொழியைத் தேர்ந்தெடுக்கவும்  </Text>
                        {/* <Text style={styles.headerSubtitle}>Please choose your preferred language</Text> */}
                    </View>

                    {/* Language Options Card */}
                    <View style={styles.languageCard}>
                        {languages.map((language) => (
                            <TouchableOpacity
                                key={language.code}
                                style={[
                                    styles.languageOption,
                                    selectedLanguage === language.code && styles.languageOptionSelected
                                ]}
                                onPress={() => handleLanguageSelect(language.code)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.languageText,
                                    selectedLanguage === language.code && styles.languageTextSelected
                                ]}>
                                    {language.name}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {/* Continue Button */}
                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                !selectedLanguage && styles.continueButtonDisabled
                            ]}
                            onPress={handleContinue}
                            disabled={!selectedLanguage}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.continueButtonText}>{getButtonText()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerCard: {
        backgroundColor: '#4A7856',
        borderRadius: 15,
        padding: 30,
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 15,
        fontFamily: 'JejuHallasan-Regular',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#E8F5E9',
        marginTop: 8,
        textAlign: 'center',
        fontFamily: 'JejuHallasan-Regular',
    },
    languageCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 25,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    languageOption: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 18,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        alignItems: 'center',
    },
    languageOptionSelected: {
        backgroundColor: '#E8F5E9',
        borderColor: '#4A7856',
        borderWidth: 3,
    },
    languageText: {
        fontSize: 22,
        color: '#333',
        fontWeight: '600',
        fontFamily: 'JejuHallasan-Regular',
    },
    languageTextSelected: {
        color: '#4A7856',
        fontWeight: 'bold',
    },
    continueButton: {
        backgroundColor: '#4A7856',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    continueButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    continueButtonText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'JejuHallasan-Regular',
    },
});

export default LanguageSelection;