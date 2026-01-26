//import libraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, BackHandler, TouchableOpacity, Image } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// component
const StartPage = () => {
    const [value, setValue] = useState('left');
    const navigation = useNavigation();

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
        navigation.navigate('WelcomeSinhala');
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
                <View style={styles.contentContainer}>
                    {/* Logo Icon */}
                    <Image 
                        source={require('../../assets/image/logo.jpg')} 
                        style={styles.logoIcon}
                        resizeMode="contain"
                    />
                    
                    <Text style={[styles.text, styles.nameText]}>{'BluTally'}</Text>
                </View>

                <View style={styles.buttonGroup}>
                    <ToggleButton.Row 
                        onValueChange={value => setValue(value)} 
                        value={value} 
                        style={styles.toggleButtonRow}
                    >
                        <ToggleButton 
                            icon="circle" 
                            value="left" 
                            iconColor='white' 
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
        backgroundColor: 'rgba(0, 0, 0, 0.15)', // Subtle dark overlay for better text visibility
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
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
    logoIcon: {
        width: 800,
        height: 100,
        marginBottom: 20,
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
    logoText: {
        fontSize: 48,
        fontFamily: 'JejuHallasan-Regular',
        marginBottom: 20,
        letterSpacing: 2,
    },
    nameText: {
        fontSize: 52,
        fontFamily: 'JejuHallasan-Regular',
        letterSpacing: 3,
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

export default StartPage;