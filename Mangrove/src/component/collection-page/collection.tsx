// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ImageBackground,
//   Platform,
//   TouchableOpacity,
//   Image,
//   Alert,
//   Dimensions,
//   ScrollView,
// } from 'react-native';
// import {
//   Provider as PaperProvider,
//   TextInput,
//   DefaultTheme,
//   Button,
//   Icon,
// } from 'react-native-paper';
// import {
//   LineChart,
//   BarChart,
//   PieChart,
//   ProgressChart,
//   ContributionGraph,
//   StackedBarChart,
// } from 'react-native-chart-kit';
// import {useNavigation} from '@react-navigation/native';
// import axios from 'axios';
// import CollectionCard from './collection-card';

// const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#56FF64',
//     text: 'red',
//     placeholder: 'white',
//     surface: 'rgba(217, 217, 217, 0.7)',
//   },
// };

// const CollectionPage = () => {
//   const navigation = useNavigation();

//   return (
//     <ImageBackground
//       source={require('../../assets/image/imageD1.jpg')}
//       style={styles.backgroundImage}>
//       <ScrollView>
//         <View style={styles.title_container}>
//           <View>
//             <CollectionCard />
//             <CollectionCard />
//             <CollectionCard />
//             <CollectionCard />
//             <CollectionCard />
//             <CollectionCard />
//             <CollectionCard />
//             <CollectionCard />
//             <CollectionCard />
//             <CollectionCard />
//             <CollectionCard />
//             <CollectionCard />
//           </View>
//         </View>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//     title_container: {
//       flex: 1,
//       marginTop: '2%',
//       marginBottom: '2%',
//       width: Dimensions.get('window').width,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//     },
//     backgroundImage: {
//       flex: 1,
//       resizeMode: 'cover',
//     },
//   });

// export default CollectionPage;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import CollectionCard from './collection-card'; // Adjust the path as needed
import { API_URL } from '../../config';
API_URL

const CollectionPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/form-entries`)
      .then(response => {
        setEntries(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching form entries:', error);
        setLoading(false);
      });
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/image/imageD1.jpg')}
      style={styles.backgroundImage}>
      <ScrollView>
        <View style={styles.title_container}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            entries.map((entry, index) => (
              <CollectionCard key={index} entry={entry} />
            ))
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  title_container: {
    flex: 1,
    marginTop: '2%',
    marginBottom: '2%',
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default CollectionPage;
