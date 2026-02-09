//import libraries
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, BackHandler, TouchableOpacity, Image, Animated } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// component
const StartPage = () => {
    
    const navigation = useNavigation();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Add back button handler
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
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
        (navigation as any).navigate('PrivacyPolicy', {fromCitizen: true});
    };

    return (
        <ImageBackground
            source={require('../../assets/image/Home.jpg')}
            style={styles.backgroundImage}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={0.9}
                onPress={handlePress}
            >
                {/* Professional Frame Container */}
                
                    <View style={styles.contentContainer}>
                        {/* Logo */}
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../assets/image/logo.jpg')}
                                style={styles.logoIcon}
                                resizeMode="cover"
                            />
                        </View>

                        {/* App Name with decorative line */}
                        <View style={styles.nameContainer}>
                            <View style={styles.decorativeLine} />
                            <Text style={[styles.text, styles.nameText]}>{'Blu Tally'}</Text>
                            <View style={styles.decorativeLine} />
                        </View>

                        {/* Tagline */}
                        <Text style={styles.tagline}>{'Data for blue carbon ecosystems'}</Text>

                        {/* Animated tap indicator */}
                        <Animated.View style={[styles.tapIndicator, { transform: [{ scale: pulseAnim }] }]}>
                            <Icon name="touch-app" size={32} color="rgba(255, 255, 255, 0.8)" />
                        </Animated.View>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    logoContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        marginBottom: 30,
        borderWidth: 3,
        borderColor: '#1a4a5e',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#4A7856',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 10,
            },
            android: {
                elevation: 15,
            },
        }),
    },
    logoIcon: {
        width: 210,
        height: 210,
    },
    text: {
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
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    decorativeLine: {
        width: 40,
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        marginHorizontal: 15,
    },
    nameText: {
        fontSize: 48,
        fontFamily: 'Times New Roman',
        letterSpacing: 4,
    },
    tagline: {
        fontSize: 18,
        fontFamily: 'Times New Roman',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 1,
        fontStyle: 'italic',
        opacity: 0.9,
    },
    tapIndicator: {
        marginTop: 40,
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

export default StartPage;