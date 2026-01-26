//import libraries
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform, BackHandler, Alert } from 'react-native';
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
        navigation.navigate('LanguageSelection'); // Navigate to Citizen Dashboard
    };

    const handleScientistPress = () => {
        Alert.alert('Coming Soon', 'Scientist Dashboard is under development.');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleHomePress = () => {
        navigation.navigate('StartPage'); // Navigate to Home screen
    };

    const handleLanguagePress = () => {
        navigation.navigate('LanguageSelection'); // Navigate to Language Selection
    };

    return (
        <ImageBackground
            source={require('../../assets/image/Option.jpg')}
            style={styles.backgroundImage}
        >
            {/* Top Navigation Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity 
                    style={styles.topButton}
                    onPress={handleBackPress}
                    activeOpacity={0.7}
                >
                    <Icon name="arrow-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.topRight}>
                    <TouchableOpacity 
                        style={styles.topButton}
                        onPress={handleLanguagePress}
                        activeOpacity={0.7}
                    >
                        <Icon name="language" size={28} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.topButton}
                        onPress={handleHomePress}
                        activeOpacity={0.7}
                    >
                        <Icon name="home" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Title */}
            {/* <View style={styles.titleContainer}>
                <Text style={styles.title}>Select Your Role</Text>
            </View> */}

            {/* Main Content - Selection Buttons */}
            <View style={styles.container}>
                {/* Citizen Button */}
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleCitizenPress}
                    activeOpacity={0.8}
                >
                    <View style={styles.buttonContent}>
                        {/* <Icon name="person" size={32} color="#4A7856" style={styles.buttonIcon} /> */}
                        <Text style={styles.buttonText}>පොදු    ජනතාව
                                                        பொது  மக்கள்
                                                        General Public</Text>
                    </View>
                </TouchableOpacity>

                {/* Scientist Button */}
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleScientistPress}
                    activeOpacity={0.8}
                >
                    <View style={styles.buttonContent}>
                        {/* <Icon name="science" size={32} color="#4A7856" style={styles.buttonIcon} /> */}
                        <Text style={styles.buttonText}>Scientist</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Bottom Skip Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity 
                    style={styles.skipButton}
                    onPress={handleHomePress}
                    activeOpacity={0.7}
                >
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
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
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
    },
    topButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
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
    topRight: {
        flexDirection: 'row',
        gap: 12,
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontFamily: 'JejuHallasan-Regular',
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
        paddingHorizontal: 40,
    },
    button: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 40,
        paddingVertical: 20,
        borderRadius: 30,
        marginVertical: 40,
        minWidth: 240,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 12,
    },
    buttonText: {
        fontSize: 28,
        fontFamily: 'JejuHallasan-Regular',
        color: '#000000',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    bottomContainer: {
        alignItems: 'center',
        paddingBottom: 40,
    },
    skipButton: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    skipText: {
        fontSize: 16,
        fontFamily: 'JejuHallasan-Regular',
        color: '#FFFFFF',
        fontWeight: '500',
    },
});

export default OptionSelection;