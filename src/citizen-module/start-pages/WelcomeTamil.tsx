//import libraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, BackHandler, TouchableOpacity } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// component
const WelcomeTamil = () => {
    const [value, setValue] = useState('right');
    const navigation = useNavigation<any>();

    useEffect(() => {
        // Add back button handler
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true; // Prevents the default back button action
        });

        return () => {
            backHandler.remove();
        };
    }, []);

    const handlePress = () => {
        navigation.navigate('WelcomeEnglish');
    };

    return (
        <ImageBackground
             source={require('../../assets/image/welcome.jpg')}
            style={styles.backgroundImage}
        >
            <TouchableOpacity 
                style={styles.overlay}
                activeOpacity={0.9}
                onPress={handlePress}
            >
                <View style={styles.contentContainer}>
                    {/* Logo at top */}
                    {/* <Text style={styles.logoText}>{'<Logo>'}</Text> */}

                    {/* Welcome badge in Tamil */}
                    <View style={styles.welcomeBadge}>
                        <Text style={styles.welcomeText}>வணக்கம்</Text>
                    </View>

                    {/* Main description text in Tamil */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>
                            இச் செயலியானது இலங்கையினுடைய இயற்கை மறுசீரமைப்பினை நிர்வகிக்க முயற்சிக்கிறது. 
                            மேலும் எமது வளத்தினை திறன்பட கையாள உதவுகிறது
                        </Text>
                    </View>

                    {/* Bottom additional text */}
                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.bottomText}>
                            உங்களுடைய பங்களிப்புக்கு நன்றி. 
                        </Text>
                    </View>
                </View>

                {/* Bottom navigation dots */}
                <View style={styles.buttonGroup}>
                    <ToggleButton.Row 
                        onValueChange={value => setValue(value)} 
                        value={value} 
                        style={styles.toggleButtonRow}
                    >
                        <ToggleButton 
                            icon="circle" 
                            value="left" 
                            iconColor='#DADADA' 
                            size={20} 
                            style={styles.toggleButton} 
                        />
                        <ToggleButton 
                            icon="circle" 
                            value="middle" 
                            iconColor='#DADADA' 
                            size={20} 
                            style={styles.toggleButton} 
                        />
                        <ToggleButton 
                            icon="circle" 
                            value="right" 
                            iconColor='white' 
                            size={20} 
                            style={styles.toggleButton} 
                        />
                    </ToggleButton.Row>
                </View>
            </TouchableOpacity>
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
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    logoText: {
        fontSize: 32,
        color: '#FFFFFF',
        fontFamily: 'JejuHallasan-Regular',
        marginBottom: 30,
        opacity: 0.8,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    welcomeBadge: {
        backgroundColor: 'rgba(76, 111, 87, 0.85)',
        paddingHorizontal: 45,
        paddingVertical: 15,
        borderRadius: 30,
        marginBottom: 40,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    welcomeText: {
        fontSize: 32,
        fontFamily: 'JejuHallasan-Regular',
        color: '#FFFFFF',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    descriptionContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    descriptionText: {
        fontSize: 22,
        fontFamily: 'IstokWeb-Bold',
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: 32,
        letterSpacing: 0.5,
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
    bottomTextContainer: {
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 20,
    },
    bottomText: {
        fontSize: 18,
        fontFamily: 'IstokWeb-Bold',
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: 26,
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
    buttonGroup: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButton: {
        borderWidth: 0,
    },
    toggleButtonRow: {
        borderWidth: 0, 
        backgroundColor: 'transparent',
    },
});

export default WelcomeTamil;