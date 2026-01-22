//import liraries
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import slides from './slides';
import OnboardingItem from './onboarding-item';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import paginator from './paginator';
import Paginator from './paginator';


// create a component
export default Onboarding = () => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollX = useRef(new Animated.Value(0)).current;

    const slidesRef = useRef(null);

    const viewableItemChanged = useRef(({ viewableItems }) => {

        setCurrentIndex(viewableItems[0].index);

    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    return (
        <View style={styles.container}>

            <View style={{ flex: 3 }}>

                <FlatList
                    data={slides}
                    renderItem={({ item }) => <OnboardingItem item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        {
                            useNativeDriver: false
                        })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}

                />

            </View>
            <Paginator data={slides} scrollX={scrollX} />
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#2c3e50',
    },
});

