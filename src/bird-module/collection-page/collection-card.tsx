



import * as React from 'react';
import { Avatar, Card, IconButton, Text } from 'react-native-paper';
import { StyleSheet, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CollectionCard = ({ entry }) => {
  const navigation = useNavigation();

  if (!entry || !entry.birdObservations || entry.birdObservations.length === 0) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const birdObservation = entry.birdObservations[0];  // Get the first bird observation
  const species = birdObservation.species;
  const description = `The ${species} was observed in a ${entry.habitatType} habitat at ${entry.pointTag}, characterized by ${entry.statusOfVegy} vegetation and ${entry.water} water availability. The bird, identified as a ${birdObservation.sex} ${birdObservation.maturity}, was seen ${birdObservation.behaviour}.`;

  const handleSurveyClick = () => {
    navigation.navigate('New', { selectedItemData: entry });
  };

  return (
    <TouchableOpacity onPress={handleSurveyClick}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Image source={{ uri: entry.imageUri }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{species}</Text>
            <Text style={styles.subtitle}>{description}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    alignSelf: 'center', 
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
  },
  cardContent: {
    width: '95%', 
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10, 
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'InriaSerif-Bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'justify',
  },
  avatar: {
    borderRadius: 10,
    width: 100,
    height: 100,
    marginRight: 10,
  },
});

export default CollectionCard;
