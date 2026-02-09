//import libraries
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform, BackHandler, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// component
const OptionSelection = () => {
    const navigation = useNavigation();

    useEffect(() => {
        // Add back button handler
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
        });

        return () => {
            backHandler.remove();
        };
    }, []);

    const handleCitizenPress = () => {
        navigation.navigate('CitizenLanguageSelection'); // Navigate to Citizen Dashboard
    };

    const handleScientistPress = () => {
        Alert.alert('Coming Soon', 'Scientist Dashboard is under development.');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleHomePress = () => {
        navigation.navigate('CitizenStartPage'); // Navigate to Home screen
    };

    const handleLanguagePress = () => {
        navigation.navigate('CitizenLanguageSelection'); // Navigate to Language Selection
    };

    return (
        <ImageBackground
            source={require('../../assets/image/Option.jpg')}
            style={styles.backgroundImage}
        >
            <View style={styles.overlay}>
                {/* Professional Frame Container */}
                
                    {/* Top Navigation Bar */}
                    <View style={styles.topBar}>
                        <TouchableOpacity
                            style={styles.topButton}
                            onPress={handleBackPress}
                            activeOpacity={0.7}
                        >
                            <Icon name="arrow-back" size={28} color="#FFFFFF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.topButton}
                            onPress={handleHomePress}
                            activeOpacity={0.7}
                        >
                            <Icon name="home" size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Title */}
                    <View style={styles.titleContainer}>
                        {/* <View style={styles.decorativeLine} />
                        <Text style={styles.title}>Select Your Role</Text>
                        <View style={styles.decorativeLine} /> */}
                    </View>

                    {/* Main Content - Selection Buttons */}
                    <View style={styles.container}>
                        {/* Citizen Button */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleCitizenPress}
                            activeOpacity={0.8}
                        >
                            <View style={styles.buttonIconContainer}>
                                <Icon name="people" size={36} color="#FFFFFF" />
                            </View>
                            <View style={styles.buttonContentColumn}>
                                <Text style={styles.buttonText}>පොදු ජනතාව</Text>
                                <Text style={styles.buttonText}>பொது மக்கள்</Text>
                                <Text style={styles.buttonTextEnglish}>General Public</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Scientist Button */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleScientistPress}
                            activeOpacity={0.8}
                        >
                            <View style={styles.buttonIconContainer}>
                                <Icon name="science" size={36} color="#FFFFFF" />
                            </View>
                            <View style={styles.buttonContent}>
                                <Text style={styles.buttonTextEnglish}>Scientists</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom hint */}
                    {/* <Text style={styles.hintText}>Choose your role to continue</Text> */}
                </View>

            {/* Preload CitizenDashboard card images */}
            <View style={styles.preloadContainer}>
                <Image source={require('../../assets/image/PlantNew.jpg')} style={styles.preloadImage} />
                <Image source={require('../../assets/image/NatureNew.jpg')} style={styles.preloadImage} />
                <Image source={require('../../assets/image/AnimalNew.jpg')} style={styles.preloadImage} />
                <Image source={require('../../assets/image/HumanActivityNew.jpg')} style={styles.preloadImage} />
            </View>
        </ImageBackground>
    );
}

// styles
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    frameContainer: {
        flex: 1,
        margin: 20,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 20,
        backgroundColor: 'rgba(74, 120, 86, 0.15)',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'ios' ? 20 : 15,
        paddingBottom: 10,
    },
    topButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(74, 120, 86, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    decorativeLine: {
        width: 40,
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        marginHorizontal: 15,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Times New Roman',
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderRadius: 20,
        marginVertical: 15,
        minWidth: 280,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#4A7856',
        ...Platform.select({
            ios: {
                shadowColor: '#4A7856',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    buttonIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4A7856',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContentColumn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Times New Roman',
        color: '#333333',
        fontWeight: '500',
        letterSpacing: 0.5,
        textAlign: 'center',
        marginVertical: 2,
    },
    buttonTextEnglish: {
        fontSize: 20,
        fontFamily: 'Times New Roman',
        color: '#4A7856',
        fontWeight: 'bold',
        letterSpacing: 1,
        textAlign: 'center',
        marginTop: 5,
    },
    hintText: {
        fontSize: 14,
        fontFamily: 'Times New Roman',
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginBottom: 30,
        letterSpacing: 0.5,
    },
    preloadContainer: {
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
    },
    preloadImage: {
        width: 1,
        height: 1,
    },
});

export default OptionSelection;