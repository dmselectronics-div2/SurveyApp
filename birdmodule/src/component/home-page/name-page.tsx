import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { TextInput,Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';

const AddName = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');


    const handleSignUp = async () => {
        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }), // Replace with the actual email
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Profile saved successfully:', data);
                navigation.navigate('SelectResearchArea');
            } else {
                console.error('Error:', data.message);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };
    

    return (
        <ImageBackground
            source={require('./../../assets/image/imageD.jpg')}
            style={styles.backgroundImage}
        >
            <ScrollView contentContainerStyle={styles.titleContainer}>
                <View style={styles.whiteBox}>
                    <Text style={styles.subTextBold}>Enter your Name</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="Name"
                        outlineStyle={styles.txtInputOutline}
                        value={name}
                        style={styles.textInput}
                        onChangeText={setName}
                    />
                        <View style={styles.bottom_container}>
                        <Button
                            mode="text"
                            onPress={() =>handleSignUp() }
                            
                            theme={{ colors: { primary: 'green' } }}
                        >
                            <Text style={styles.sub_text_B}>Save</Text>
                        </Button>
                      
                    </View>
                </View>
            
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start', // Align content at the top
        alignItems: 'center',
        paddingTop: '10%', // Adjust the padding to move the content up
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
    sub_text_A: {
        fontSize: 16,
        fontFamily: 'Inter-regular',
        color: '#000000',
        textAlign: 'right'
    },
    subTextBold: {
        fontSize: 30,
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold',
      
    },
    txtInputOutline: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'black',
    },
    textInput: {
        height: 50,
        borderRadius: 16,
        backgroundColor: 'white',
        width: '90%',
        marginTop: 25,
    },
    whiteBox: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 340,
        backgroundColor: 'rgba(217, 217, 217, 0.7)',
        marginLeft: 14,
        marginRight: 14,
        borderRadius: 15,
        width: '90%',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
});

export default AddName;
