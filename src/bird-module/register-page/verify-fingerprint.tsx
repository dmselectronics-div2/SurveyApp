//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform } from 'react-native';
import { Provider as PaperProvider, TextInput, DefaultTheme, Button, Icon, MD3Colors  } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#56FF64',
        text: 'red',
        placeholder: 'white',
        surface: 'rgba(217, 217, 217, 0.7)',
    },
};
// component
const VerifyFingerPrint = () => {

    const navigation = useNavigation();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const handleSignUp = () => {
        navigation.navigate('SetPin');
    };

    return (
        <ImageBackground
            source={require('./../../assets/image/imageD.jpg')}
            style={styles.backgroundImage}
        >
            <View style={styles.title_container}>
                <View style={styles.whiteBox}>
                    <Text style={styles.main_text}>Verify your Finger Print</Text>
                    <View style={styles.flex_container}>
                        <Text style={styles.sub_text}>Please </Text>
                        <Text style={styles.sub_text_bold}> place your finger on the sensor </Text>
                        <Text style={styles.sub_text}> to  </Text>
                    </View>
                    <View style={styles.flex_container}>
                        <Text style={styles.sub_text}>complete the fingerprint verification process.</Text>
                    </View>

                    <View style={styles.center_icon}>
                        <Icon
                            source="fingerprint"
                            color='white'
                            size={80}
                        />
                        
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSignUp}
                        style={[styles.button_signup, { borderRadius: 8 }]}
                        buttonColor='#516E9E'
                        textColor='white'
                        labelStyle={styles.button_label}
                    >
                        Verify
                    </Button>

                </View>
            </View>
        </ImageBackground>
    );

}

// styles
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
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start',
        // backgroundColor: 'white',
        fontFamily: 'Inter-Bold',
        marginTop: '20%'
    },
    main_text: {
        fontSize: 38,
        fontFamily: 'Inter-Bold',
        color: 'black',
        fontWeight: 'bold',
        marginTop: 10
    },
    sub_text: {
        fontSize: 16,
        fontFamily: 'Inter-regular',
        color: '#000000',
        textAlign: 'center'
    },
    sub_text_bold: {
        fontSize: 16,
        fontFamily: 'Inter-regular',
        color: '#000000',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    text_container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 142,
    },
    whiteBox: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        // width: '100%',
        height: 442,
        backgroundColor: 'rgba(217, 217, 217, 0.7)',
        marginLeft: 14,
        marginRight: 14,
        marginTop: 80,
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
        marginTop: 85,
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
        alignItems: 'center'
    },
    flex_container_text_input: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 40
    },
    center_icon : {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    }

});

export default VerifyFingerPrint;
