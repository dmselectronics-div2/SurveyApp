//import libraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, SafeAreaView, Platform, Linking, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import NetworkStatusBanner from '../../components/NetworkStatusBanner';
import {getTotalPendingCount} from '../../assets/sql_lite/db_connection';

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
            humanActivity: 'Threats & Human Activities',
            home: 'Home',
            feed: 'Feed',
            explore: 'Explore',
            highlights: 'Highlights',
            viewData: 'View Submitted Data',
            adTitle: 'Special Offer!',
            adMessage: 'Discover amazing deals and offers',
            clickHere: 'Click Here'
        },
        si: {
            title1: 'කරුණාකර ඔබේ',
            title2: 'නිරීක්ෂණ ඇතුලත් කරන්න',
            plants: 'ශාක',
            nature: 'පරිසරය',
            animals: 'සතුන්',
            humanActivity: 'තර්ජන සහ මානව ක්‍රියාකාරකම්',
            home: 'මුල් පිටුව',
            feed: 'පෝෂණය',
            explore: 'ගවේෂණය',
            highlights: 'විශේෂාංග',
            viewData: 'ඉදිරිපත් කළ දත්ත බලන්න',
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
            humanActivity: 'அச்சுறுத்தல்கள் மற்றும் மனித செயற்பாடுகள்',
            home: 'முகப்பு',
            feed: 'ஊட்டம்',
            explore: 'ஆராயுங்கள்',
            highlights: 'சிறப்பம்சங்கள்',
            viewData: 'சமர்ப்பிக்கப்பட்ட தரவைப் பார்க்கவும்',
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
        navigation.navigate('CitizenLanguageSelection');
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
            <ScrollView style={styles.container}>
                {/* Network & Sync Status */}
                <NetworkStatusBanner showSyncButton={true} />

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

                {/* View Submitted Data Button */}
                <TouchableOpacity
                    style={styles.viewDataButton}
                    onPress={() => navigation.navigate('CitizenDataTable' as never)}
                    activeOpacity={0.8}
                >
                    <Icon name="list-alt" size={24} color="#FFFFFF" />
                    <Text style={styles.viewDataButtonText}>{t.viewData}</Text>
                </TouchableOpacity>

                {/* Charts Section */}
                <View style={styles.chartsSection}>
                    <Text style={styles.chartsSectionTitle}>📊 Observation Analytics</Text>

                    {/* Bar Chart */}
                    <View style={styles.chartCard}>
                        <Text style={styles.chartCardTitle}>Observations by Category</Text>
                        <BarChart
                            data={{
                                labels: ['Plants', 'Nature', 'Animals', 'Human Activity'],
                                datasets: [
                                    {
                                        data: [32, 28, 41, 18],
                                    },
                                ],
                            }}
                            width={320}
                            height={200}
                            yAxisLabel=""
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(74, 120, 86, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 8,
                                },
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 8,
                                marginHorizontal: -20,
                            }}
                            verticalLabelRotation={30}
                        />
                    </View>

                    {/* Summary Cards */}
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Submissions</Text>
                            <Text style={styles.summaryValue}>119</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Categories</Text>
                            <Text style={styles.summaryValue}>4</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>This Month</Text>
                            <Text style={styles.summaryValue}>42</Text>
                        </View>
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
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 3,
        borderColor: '#4A7856',
        borderRadius: 15,
        margin: 10,
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
        textAlign: 'center',
        fontSize:5,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Times New Roman',
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
    fontSize: 16,         
    fontFamily: 'Times New Roman',
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',   
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
        fontFamily: 'Times New Roman',
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
        fontFamily: 'Times New Roman',
    },
    adMessage: {
        fontSize: 12,
        color: '#4A7856',
        marginTop: 2,
        fontFamily: 'Times New Roman',
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
        fontFamily: 'Times New Roman',
    },
    viewDataButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4A7856',
        marginHorizontal: 20,
        marginBottom: 15,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 10,
    },
    viewDataButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Times New Roman',
    },
    chartsSection: {
        paddingHorizontal: 20,
        marginTop: 30,
        marginBottom: 30,
    },
    chartsSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A7856',
        marginBottom: 15,
        fontFamily: 'Times New Roman',
    },
    chartCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
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
    chartCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
        fontFamily: 'Times New Roman',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
        fontFamily: 'Times New Roman',
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
        fontFamily: 'Times New Roman',
    },
});

export default CitizenDashboard;