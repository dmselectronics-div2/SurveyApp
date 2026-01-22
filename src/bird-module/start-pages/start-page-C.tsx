//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, BackHandler } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// component
const StartPageC = () => {

    const [status, setStatus] = useState<'checked' | 'unchecked' | undefined>('checked');

    const [value, setValue] = React.useState('left');

    const navigation = useNavigation();

    const onButtonToggle = () => {
        setStatus(status === 'checked' ? 'unchecked' : 'checked');
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('LoginPage');
        }, 2000);

        // Add back button handler
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true; // Prevents the default back button action
        });

        return () => {
            clearTimeout(timer); // Cleanup the timer
            backHandler.remove(); // Remove the back button listener
        };
    }, []);

    return (
        <ImageBackground
            source={require('./../../assets/image/imageC.jpg')}
            style={styles.backgroundImage}
        >
            <View style={styles.title_container}>
                <View style={styles.whiteBox}>
                    <Text style={styles.main_text}>MANGROVE</Text>
                </View>
                <View style={styles.container}>
                    <View style={shadowStyles.shadow}>
                        <Text style={styles.sub_text}>“Mangroves can </Text>
                        <Text style={styles.sub_text}>store large</Text>
                        <Text style={styles.sub_text}>amounts of</Text>
                        <Text style={styles.sub_text}>carbon, helping to </Text>
                        <Text style={styles.sub_text}>fight</Text>
                        <Text style={styles.sub_text}>climate change”</Text>
                    </View>
                </View>
            </View>
            <View style={styles.button_group}>
                <ToggleButton.Row onValueChange={value => setValue(value)} value={value} style={styles.toggleButtonRow} >
                    <ToggleButton icon="circle" value="left" iconColor='white' size={20} style={styles.toggleButton} />
                    <ToggleButton icon="circle" value="middle" iconColor='#DADADA' size={20} />
                    <ToggleButton icon="circle" value="right" iconColor='#DADADA' size={20} />
                </ToggleButton.Row>
            </View>
        </ImageBackground>
    );

}

// styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '55%',
        height: 142,
        marginLeft: 24,
        marginRight: 24,
        marginTop: '60%',
    },
    title_container: {
        flex: 1,
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start',
        // backgroundColor: 'white',
        fontFamily: 'JejuHallasan-Regular',
    },
    main_text: {
        fontSize: 74,
        fontFamily: 'JejuHallasan-Regular',
        color: 'black'
    },
    sub_text: {
        fontSize: 28,
        fontFamily: 'IstokWeb-Bold',
        color: '#FFFFFF',
        fontWeight: 'bold',

    },
    text_container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 142,
    },
    whiteBox: {
        justifyContent: 'center',
        alignItems: 'center',
        // width: '100%',
        height: 142,
        backgroundColor: 'rgba(217, 217, 217, 0.33)',
        marginLeft: 14,
        marginRight: 14,
        marginTop: 80,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover'
    },
    button_group: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButton: {
        borderWidth: 0,
    },
    toggleButtonRow: {
        borderWidth: 0, 
        backgroundColor: 'transparent',
    }
});

const shadowStyles = StyleSheet.create({
    shadow: {
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            },
        }),
    },
});

//make this component available to the app
export default StartPageC;
