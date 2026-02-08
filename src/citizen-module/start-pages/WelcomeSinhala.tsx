//import libraries
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, BackHandler, TouchableOpacity, Animated } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// component
const WelcomeSinhala = () => {
    const [value, setValue] = useState('left');
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
        navigation.navigate('WelcomeTamil'); // Update with your next screen name
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
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ModuleSelector')}>
                    <Icon name="arrow-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Professional Frame Container */}

                    <View style={styles.contentContainer}>
                        {/* Welcome badge in Sinhala */}
                        <View style={styles.welcomeBadge}>
                            <Text style={styles.welcomeText}>සාදරයෙන් </Text>
                            <Text style={[styles.welcomeText1, { fontSize: 34 }]}>
                                                   පිළිගනිමු
</Text>

                        </View>

                        {/* Decorative divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.decorativeLine} />
                            <View style={styles.decorativeDot} />
                            <View style={styles.decorativeLine} />
                        </View>

                        {/* Main description text in Sinhala */}
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionText}>
                                මෙය ශ්‍රී ලංකාවේ පාරිසරික පද්ධති ප්‍රතිෂ්ඨාපන දත්ත කළමනාකරණය සඳහා යෙදුමකි.
                            </Text>
                        </View>

                        {/* Bottom additional text */}
                        <View style={styles.bottomTextContainer}>
                            <Text style={styles.bottomText}>ඔබටත් භාවිතයට ආරාධනා</Text>
                            <Text style={styles.bottomText}>එන්න අප හා එක්වන්න!</Text>
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
        paddingHorizontal: 40,
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
        fontSize: 30,
        fontFamily: 'Times New Roman',
        color: '#FFFFFF',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    welcomeText1: {
    fontSize: 30,
    fontFamily: 'Times New Roman',
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',   
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
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default WelcomeSinhala;