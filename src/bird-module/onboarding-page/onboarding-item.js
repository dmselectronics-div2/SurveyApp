//import liraries
import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, ImageBackground } from 'react-native';
import Paginator from './paginator';


// create a component
export default OnboardingItem = ({ item }) => {

    const { width } = useWindowDimensions();

    return (

        <ImageBackground source={item.image} style={[styles.image, { width }]} >
            <View style={[styles.container, { width }]}>
                <View style={{ flex: 1 }}>
                    <View style={styles.whiteBox}>
                        <Text style={styles.title}>{item.title}</Text>
                    </View>
                    <View style={styles.title_container}>
                        <Text style={styles.description}>{item.descriptionA}</Text>
                        <Text style={styles.description}>{item.descriptionB}</Text>
                        <Text style={styles.description}>{item.descriptionC}</Text>
                        <Text style={styles.description}>{item.descriptionD}</Text>
                        <Text style={styles.description}>{item.descriptionE}</Text>
                        <Text style={styles.description}>{item.descriptionF}</Text>
                    </View>
                </View>
            </View>
        </ImageBackground>

    );
};

// define your styles
const styles = StyleSheet.create({
    whiteBox: {
        justifyContent: 'center',
        alignItems: 'center',
        // width: '100%',
        height: 142,
        backgroundColor: 'rgba(217, 217, 217, 0.33)',
        marginLeft: 14,
        marginRight: 14,
        marginTop: '40%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#2c3e50',
    },
    title_container: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '55%',
        height: 142,
        marginLeft: 'auto',
        marginRight: 24,
        marginTop: '60%',
    },

    image: {
        flex: 1,
        resizeMode: 'cover',

    },
    title: {
        fontSize: 74,
        fontFamily: 'JejuHallasan-Regular',
        color: 'black'
    },
    description: {
        fontSize: 28,
        fontFamily: 'IstokWeb-Bold',
        color: '#FFFFFF',
        fontWeight: 'bold',
    }
});

