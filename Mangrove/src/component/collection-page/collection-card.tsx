// import * as React from 'react';
// import { Avatar, Card, IconButton, Text } from 'react-native-paper';
// import { StyleSheet, View,Image } from 'react-native';

// const CollectionCard = () => (
//   <Card style={styles.card}>
//     <View style={styles.cardContent}>
//       <Image source={require('../../assets/image/bordGroup.jpeg')} style={styles.avatar} />
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>King Fishier</Text>
//         <Text style={styles.subtitle}>
//           The Sri Lanka Spurfowl inhabits primary and secondary forests, often
//           found in the undergrowth and dense shrubbery.
//         </Text>
//       </View>
//     </View>
//   </Card>
// );

// const styles = StyleSheet.create({
//   card: {
//     marginTop: 10,
//     alignSelf: 'center', 
//     alignItems: 'center',
//     borderRadius:5,
//     backgroundColor: 'rgba(217, 217, 217, 0.7)',
//   },
//   cardContent: {
//     width: '95%', 
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10, 
//     backgroundColor: 'rgba(217, 217, 217, 0.7)',
//     borderRadius:5,
//   },
//   textContainer: {
//     flex: 1,
//     // marginLeft: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     fontFamily: 'InriaSerif-Bold',
//   },
//   subtitle: {
//     fontSize: 14,
//     fontFamily: 'Inter-regular',
//     color: '#000000',
//     textAlign:'justify',
//   },
//   avatar: {
//     borderRadius:10,
//     width:100,
//     height:100,
//     marginRight:10,
//   },
// });

// export default CollectionCard;



import * as React from 'react';
import { Avatar, Card, IconButton, Text } from 'react-native-paper';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';

const CollectionCard = ({ entry }) => {
  if (!entry) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const description = `The ${entry.species} was observed in a ${entry.habitatType} habitat at ${entry.pointTag}, characterized by ${entry.statusOfVegy} vegetation and ${entry.waterAvailability} water availability. The bird, identified as a ${entry.sex} ${entry.maturity}, was seen ${entry.behaviour}.`;

  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={{ uri: entry.imageUri }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{entry.species}</Text>
          <Text style={styles.subtitle}>{description}</Text>
        </View>
      </View>
    </Card>
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
