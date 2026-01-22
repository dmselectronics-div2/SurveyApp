//import libraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, SafeAreaView, Platform, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// component
const CitizenDashboard = () => {
    const navigation = useNavigation();
    const [currentLanguage, setCurrentLanguage] = useState('en');

    // Translation object
    const translations = {
        en: {
            title1: 'Please Upload Your',
            title2: 'Observations',
            plants: 'Plants',
            nature: 'Nature',
            animals: 'Animals',
            humanActivity: 'Human Activity',
            home: 'Home',
            feed: 'Feed',
            explore: 'Explore',
            highlights: 'Highlights',
            adTitle: 'Special Offer!',
            adMessage: 'Discover amazing deals and offers',
            clickHere: 'Click Here'
        },
        si: {
            title1: 'කරුණාකර ඔබේ',
            title2: 'නිරීක්ෂණ උඩුගත කරන්න',
            plants: 'ශාක',
            nature: 'ස්වභාවධර්මය',
            animals: 'සතුන්',
            humanActivity: 'මානව ක්‍රියාකාරකම්',
            home: 'මුල් පිටුව',
            feed: 'පෝෂණය',
            explore: 'ගවේෂණය',
            highlights: 'විශේෂාංග',
            adTitle: 'විශේෂ දීමනාව!',
            adMessage: 'විශිෂ්ට දීමනා සොයා ගන්න',
            clickHere: 'මෙතන ක්ලික් කරන්න'
        },
        ta: {
            title1: 'தயவுசெய்து உங்கள்',
            title2: 'கண்காணிப்புகளைப் பதிவேற்றவும்',
            plants: 'தாவரங்கள்',
            nature: 'இயற்கை',
            animals: 'விலங்குகள்',
            humanActivity: 'மனித செயல்பாடு',
            home: 'முகப்பு',
            feed: 'ஊட்டம்',
            explore: 'ஆராயுங்கள்',
            highlights: 'சிறப்பம்சங்கள்',
            adTitle: 'சிறப்பு சலுகை!',
            adMessage: 'அற்புதமான சலுகைகளைக் கண்டறியுங்கள்',
            clickHere: 'இங்கே கிளிக் செய்யவும்'
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

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleCategoryPress = (category) => {
        navigation.navigate('ObservationForm', { category });
    };

    const handleNavigation = (screen) => {
        navigation.navigate(screen);
    };

    const handleAdClick = () => {
        // Replace with your advertisement URL
        const adUrl = 'https://www.example.com';
        Linking.openURL(adUrl).catch(err => console.error('Error opening URL:', err));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
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
                    <Text style={styles.title}>{t.title1}</Text>
                    <Text style={styles.title}>{t.title2}</Text>
                </View>

                {/* Category Grid */}
                <View style={styles.gridContainer}>
                    {/* Plants Card */}
                    <TouchableOpacity 
                        style={styles.card}
                        onPress={() => navigation.navigate('PlantDataCollection', { category: 'Plants' })}
                        activeOpacity={0.9}
                    >
                        <ImageBackground
                            source={require('../../assets/image/PlantNew.jpg')}
                            style={styles.cardImage}
                            imageStyle={styles.cardImageStyle}
                        >
                            <View style={styles.cardOverlay}>
                                <Text style={styles.cardText}>{t.plants}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>

                    {/* Nature Card */}
                    <TouchableOpacity 
                        style={styles.card}
                        onPress={() => navigation.navigate('NatureDataCollection', { category: 'Nature' })}
                        activeOpacity={0.9}
                    >
                        <ImageBackground
                            source={require('../../assets/image/NatureNew.jpg')}
                            style={styles.cardImage}
                            imageStyle={styles.cardImageStyle}
                        >
                            <View style={styles.cardOverlay}>
                                <Text style={styles.cardText}>{t.nature}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>

                    {/* Animals Card */}
                    <TouchableOpacity 
                        style={styles.card}
                        onPress={() => navigation.navigate('AnimalDataCollection', { category: 'Animals' })}
                        activeOpacity={0.9}
                    >
                        <ImageBackground
                            source={require('../../assets/image/AnimalNew.jpg')}
                            style={styles.cardImage}
                            imageStyle={styles.cardImageStyle}
                        >
                            <View style={styles.cardOverlay}>
                                <Text style={styles.cardText}>{t.animals}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>

                    {/* Human Activity Card */}
                    <TouchableOpacity 
                        style={styles.card}
                        onPress={() => navigation.navigate('HumanActivityDataCollection', { category: 'Human Activity' })}
                        activeOpacity={0.9}
                    >
                        <ImageBackground
                            source={require('../../assets/image/HumanActivityNew.jpg')}
                            style={styles.cardImage}
                            imageStyle={styles.cardImageStyle}
                        >
                            <View style={styles.cardOverlay}>
                                <Text style={styles.cardText}>{t.humanActivity}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

                {/* Advertisement Section */}
                {/* <View style={styles.adContainer}>
                    <View style={styles.adContent}>
                        <Icon name="local-offer" size={24} color="#4A7856" />
                        <View style={styles.adTextContainer}>
                            <Text style={styles.adTitle}>{t.adTitle}</Text>
                            <Text style={styles.adMessage}>{t.adMessage}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.adButton}
                        onPress={handleAdClick}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.adButtonText}>{t.clickHere}</Text>
                    </TouchableOpacity>
                </View> */}

                {/* Bottom Navigation */}
                {/* <View style={styles.bottomNav}>
                    <TouchableOpacity 
                        style={styles.navItem}
                        onPress={() => handleNavigation('Home')}
                        activeOpacity={0.7}
                    >
                        <Icon name="home" size={28} color="#666" />
                        <Text style={styles.navText}>{t.home}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.navItem}
                        onPress={() => handleNavigation('Feed')}
                        activeOpacity={0.7}
                    >
                        <Icon name="wb-sunny" size={28} color="#666" />
                        <Text style={styles.navText}>{t.feed}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.navItem}
                        onPress={() => handleNavigation('Explore')}
                        activeOpacity={0.7}
                    >
                        <Icon name="search" size={28} color="#666" />
                        <Text style={styles.navText}>{t.explore}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.navItem}
                        onPress={() => handleNavigation('Highlights')}
                        activeOpacity={0.7}
                    >
                        <Icon name="account-circle" size={28} color="#666" />
                        <Text style={styles.navText}>{t.highlights}</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
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
        marginTop: 20,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontFamily: 'JejuHallasan-Regular',
        color: '#4A7856',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    gridContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignContent: 'flex-start',
    },
    card: {
        width: '47%',
        height: 180,
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    cardImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    cardImageStyle: {
        borderRadius: 15,
    },
    cardOverlay: {
        backgroundColor: 'rgba(74, 120, 86, 0.85)',
        paddingVertical: 12,
        alignItems: 'center',
    },
    cardText: {
        fontSize: 20,
        fontFamily: 'JejuHallasan-Regular',
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
    },
    navText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontFamily: 'JejuHallasan-Regular',
    },
    adContainer: {
        marginHorizontal: 20,
        marginBottom: 15,
        backgroundColor: '#E8F5E9',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    adContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    adTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    adTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
        fontFamily: 'serif',
    },
    adMessage: {
        fontSize: 12,
        color: '#4A7856',
        marginTop: 2,
        fontFamily: 'serif',
    },
    adButton: {
        backgroundColor: '#4A7856',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    adButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'serif',
    },
});

export default CitizenDashboard;