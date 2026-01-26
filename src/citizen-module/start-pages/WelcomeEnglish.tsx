//import libraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, BackHandler, TouchableOpacity } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// component
const StartPageA = () => {
    const [value, setValue] = useState('middle');
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
        navigation.navigate('CitizenLanguageSelection');
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

                    {/* Welcome badge */}
                    <View style={styles.welcomeBadge}>
                        <Text style={styles.welcomeText}>Welcome</Text>
                    </View>

                    {/* Main description text */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>
                            THIS APP IS AN INITIATIVE TO MANAGE ECOSYSTEM RESTORATION DATA IN SRI LANKA.</Text>
                        <Text style={styles.descriptionText}>USE IT TO RECORD ANY OBSERVATION YOU BELIEVE IS IMPORTANT FOR OUR CONSERVATION EFFORTS.</Text>    
                        
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
                            iconColor='white' 
                            size={20} 
                            style={styles.toggleButton} 
                        />
                        <ToggleButton 
                            icon="circle" 
                            value="right" 
                            iconColor='#DADADA' 
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
        paddingHorizontal: 50,
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
        fontSize: 36,
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
        fontSize: 20,
        fontFamily: 'IstokWeb-Bold',
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: 28,
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

export default StartPageA;