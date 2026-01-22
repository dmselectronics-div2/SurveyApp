import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => (
    <View>
        <Icon name="circle" size={30} color="#900" onPress={() => console.log('Pressed')} />
    </View>
);

export default HomeScreen;
