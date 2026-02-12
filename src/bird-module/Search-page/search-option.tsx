import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import PureSearchPage from './search-by-date';
import SearchPage from './search-page';
import SearchCount from './search-count';
import CitySearchPage from './search-citizen';


const theme = {
    colors: {
        primary: '#227729',
        text: 'red',
        placeholder: 'white',
        surface: 'rgba(217, 217, 217, 0.7)',
    },
};

const SearchOption = () => {
    const route = useRoute();
    // const { rowData } = route.params;
    const navigation = useNavigation();
    const [selectedArea, setSelectedArea] = useState("Select your GPS location");

    const [showDateFilter, setShowDateFilter] = useState(false);
    const [showPointFilter, setShowPointFilter] = useState(false);
    const [showBirdCount, setShowBirdCount] = useState(false);
    const [showCitizen, setShowCitizen] = useState(false);
    console.log('Search Option Page');

    const handlePoint = () => {
        // console.log('Row data:', rowData);
        // navigation.navigate('SearchPage');
        setShowPointFilter(true);
    };
    const handleCitizenData = () => {
        // console.log('Row data:', rowData);
        // navigation.navigate('SearchPage');
        setShowCitizen(true);
    };

    const handleDate = () => {
        // console.log('Row data:', rowData);
        // navigation.navigate('PureSearchPage', );
        setShowDateFilter(true);
    };
    const handleCount = () => {
        // console.log('Row data:', rowData);
        // navigation.navigate('SearchCount', );
        setShowBirdCount(true);
    };

    if (showDateFilter) {
        return (
            <PureSearchPage setShowDateFilter={setShowDateFilter} />
        );
    }

    if (showPointFilter) {
        return (
            <SearchPage setShowPointFilter={setShowPointFilter} />
        );
    }

    if (showBirdCount) {
        return (
            <SearchCount setShowBirdCount={setShowBirdCount} />
        );
    }
    if (showCitizen) {
        return (
            < CitySearchPage setShowCitizen={setShowCitizen} />
        );
    }

    return (
        
            <ScrollView style={styles.title_container}>
                <View style={styles.whiteBox}>
                    <View style={styles.text_container}>
                        <Text style={styles.sub_text_bold}>Select the preferred search option </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            mode="contained"
                            onPress={handleDate}
                            style={styles.button_signup}
                            buttonColor='rgba(13, 100, 58, 0.86)'
                            textColor='white'
                            labelStyle={styles.button_label}
                        >
                            Date Filter
                        </Button>

                        <Button
                            mode="contained"
                            onPress={handlePoint}
                            style={styles.button_signup}
                            buttonColor='rgba(13, 100, 58, 0.86)'
                            textColor='white'
                            labelStyle={styles.button_label}
                        >
                            Date & Point Filter
                        </Button>

                        <Button
                            mode="contained"
                            onPress={handleCount}
                            style={styles.button_signup}
                            buttonColor='rgba(13, 100, 58, 0.86)'
                            textColor='white'
                            labelStyle={styles.button_label}
                        >
                            Count Filter
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleCitizenData}
                            style={styles.button_signup}
                            buttonColor='rgba(13, 100, 58, 0.86)'
                            textColor='white'
                            labelStyle={styles.button_label}
                        >
                            Citizen Data
                        </Button>
                    </View>
                </View>
            </ScrollView>
        
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '55%',
        height: 142,
        marginLeft: 'auto',
        marginRight: 24,
        marginTop: '60%',
    },
    title_container: {
        flex: 1,
        fontFamily: 'Inter-Bold',
        marginTop: '20%',
    },
    main_text: {
        fontSize: 40,
        fontFamily: 'Inter-Bold',
        color: 'black',
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    sub_text: {
        fontSize: 18,
        fontFamily: 'Inter-regular',
        color: '#000000',
        textAlign: 'center',
    },
    sub_text_bold: {
        fontSize: 20,
        fontFamily: 'Inter-regular',
        color: '#000000',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 5,
    },
    text_container: {
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    whiteBox: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 350,
        backgroundColor: 'rgba(217, 217, 217, 0.7)',
        marginLeft: 14,
        marginRight: 14,
        marginTop: 80,
        borderRadius: 15,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    buttonContainer: {
        width: '90%',
        marginTop: 20,
    },
    button_signup: {
        width: '100%',
        marginVertical: 10, // Adds equal spacing between buttons
    },
    button_label: {
        fontSize: 18,
    },
});

export default SearchOption;
