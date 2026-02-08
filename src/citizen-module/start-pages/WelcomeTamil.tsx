//import libraries
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, BackHandler, TouchableOpacity, Animated } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// component
const WelcomeTamil = () => {
    const [value, setValue] = useState('middle');
    const navigation = useNavigation();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Add back button handler
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true; // Prevents the default back button action
        });

        // Start pulse animation
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        return () => {
            backHandler.remove();
            pulse.stop();
        };
    }, []);

    const handlePress = () => {
        navigation.navigate('WelcomeEnglish'); // Update with your next screen name
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
                {/* Professional Frame Container */}
                
                    <View style={styles.contentContainer}>
                        {/* Welcome badge in Tamil */}
                        <View style={styles.welcomeBadge}>
                            <Text style={styles.welcomeText}>வணக்கம்</Text>
                        </View>

                        {/* Decorative divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.decorativeLine} />
                            <View style={styles.decorativeDot} />
                            <View style={styles.decorativeLine} />
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
                            <Text style={styles.bottomText}>உங்களுடைய பங்களிப்புக்கு நன்றி.</Text>
                        </View>

                        {/* Animated tap indicator */}
                        <Animated.View style={[styles.tapIndicator, { transform: [{ scale: pulseAnim }] }]}>
                            <Icon name="touch-app" size={32} color="rgba(255, 255, 255, 0.8)" />
                        </Animated.View>
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
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    welcomeBadge: {
        backgroundColor: 'rgba(74, 120, 86, 0.9)',
        paddingHorizontal: 45,
        paddingVertical: 18,
        borderRadius: 30,
        marginBottom: 25,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        ...Platform.select({
            ios: {
                shadowColor: '#4A7856',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    welcomeText: {
        fontSize: 32,
        fontFamily: 'Times New Roman',
        color: '#FFFFFF',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    decorativeLine: {
        width: 50,
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    decorativeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        marginHorizontal: 15,
    },
    descriptionContainer: {
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    descriptionText: {
        fontSize: 20,
        fontFamily: 'Times New Roman',
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: 30,
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
        marginTop: 30,
        paddingHorizontal: 20,
    },
    bottomText: {
        fontSize: 16,
        fontFamily: 'Times New Roman',
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: 24,
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
    tapIndicator: {
        marginTop: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(74, 120, 86, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
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