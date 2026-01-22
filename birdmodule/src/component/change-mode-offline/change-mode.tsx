import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Button, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Define the custom theme
const theme = {
    colors: {
        primary: '#56FF64',
        text: 'red',
        placeholder: 'white',
        surface: 'rgba(217, 217, 217, 0.7)',
    },
};

const SelectLocation = () => {
    const navigation = useNavigation();
    const [selectedArea, setSelectedArea] = useState("Select your GPS location");

    const handleSignUp = () => {
        navigation.navigate('Welcome');
    };

    return (
        <ImageBackground
            source={require('./../../assets/image/imageD.jpg')}
            style={styles.backgroundImage}
        >
            <ScrollView style={styles.title_container}>
                <View style={styles.whiteBox}>
                    <View style={styles.text_container}>
                        <View style={styles.flex_container}>
                            <Text style={styles.sub_text_bold}> You are offline. Please Select your GPS location. </Text>
                        </View>
                       
                    </View>
                    <View style={styles.center_list}>
                        <List.AccordionGroup>
                            <View style={styles.list_menu}>
                                <List.Accordion
                                    title={selectedArea}
                                    id="1"
                                >
                                    <ScrollView>
                                        <List.Item
                                            title="Birds"
                                            onPress={() => setSelectedArea("Birds")}
                                        />
                                        <List.Item
                                            title="Bivalve"
                                            onPress={() => setSelectedArea("Bivalve")}
                                        />
                                    </ScrollView>
                                </List.Accordion>
                            </View>
                        </List.AccordionGroup>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
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
        marginTop: '20%'
    },
    main_text: {
        fontSize: 40,
        fontFamily: 'Inter-Bold',
        color: 'black',
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center'
    },
    sub_text: {
        fontSize: 18,
        fontFamily: 'Inter-regular',
        color: '#000000',
        textAlign: 'center'
    },
    sub_text_bold: {
        fontSize: 20,
        fontFamily: 'Inter-regular',
        color: '#000000',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop:20
    },
    text_container: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    whiteBox: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 240,
        backgroundColor: 'rgba(217, 217, 217, 0.7)',
        marginLeft: 14,
        marginRight: 14,
        marginTop: 80,
       borderRadius:15
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover'
    },
    text_input: {
        width: 55,
    },
    button_signup: {
        width: '90%',
        marginTop: 180,
        fontFamily: 'Inter-regular',
    },
    button_label: {
        fontSize: 18
    },
    sub_text_A: {
        fontSize: 16,
        fontFamily: 'Inter-regular',
        color: '#000000',
        textAlign: 'right'
    },
    sub_text_B: {
        fontSize: 16,
        fontFamily: 'Inter-regular',
        color: '#000000',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    bottom_container: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center'
    },
    flex_container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flex_container_text_input: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 40
    },
    center_list: {
        marginTop: 20,
        width: '90%',
    },
    list_menu: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        overflow: 'hidden',
        maxHeight: 210,
    }
});

export default SelectLocation;
