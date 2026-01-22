import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import EditCount from './Edit-count';
import SurveyFormPage from './Edit-survey';
import SQLite from 'react-native-sqlite-storage';
// import { useNavigation } from '@react-navigation/native'; 

// Define the custom theme
const theme = {
  colors: {
    primary: '#56FF64',
    text: 'red',
    placeholder: 'white',
    surface: 'rgba(217, 217, 217, 0.7)',
  },
};

const SelectEditMode = ({rowData, setIsEditMode}) => {
  const route = useRoute();
  // const { rowData } = route.params;
  const navigation = useNavigation();
  const [selectedArea, setSelectedArea] = useState('Select your GPS location');
  const [email, setEmail] = useState('');
  //  const route = useRoute();
    const { selectedItemData } = route.params || {};
    const birdObservation = selectedItemData?.birdObservations[0];
    console.log('Selected item datahuh:', selectedItemData);
    const [count, setCount] = useState(birdObservation?.count || ''); 

  // const handleFullSurvey = () => {
  //     console.log('Row data:', rowData);
  //     navigation.navigate('SurveyFormPage', { rowData });
  // };

  // const handleBirdCount = () => {
  //     console.log('Row data:', rowData);
  //     navigation.navigate('EditCount', { rowData });
  // };

  const [showBirdCount, setShowBirdCount] = useState(false);
  const [showBirdEditForm, setshowBirdEditForm] = useState(false);
  // const [isEditMode, setIsEditMode] = useState(false);

  const db = SQLite.openDatabase(
    {name: 'user_db.db', location: 'default'},
    () => {
      console.log('Database opened successfully');
    },
    error => {
      console.error('Error opening database: ', error);
    },
  );

  // console.log('row data email ', rowData.email);

  const showData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Users',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            console.log('Results:', results.rows._array); // This should give you an array of the rows
          } else {
            console.log('No data found.');
          }
        },
        error => {
          console.log('Error retrieving data: ', error);
        },
      );
    });
  };

  const retriveEmailFromSQLite = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT email FROM LoginData LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const email = results.rows.item(0).email;
            setEmail(email);
            console.log('Retrieved email edit permission : ', email);
            return {email};
          } else {
            console.log('No email and password stored.');
            return null;
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  };

  useEffect(() => {
    showData();
    retriveEmailFromSQLite();
  }, []);

  const handleFullSurvey = () => {
    navigation.navigate('New', {
      selectedItemData,  // Pass the entire item object to the next screen
    });
    console.log('count:', count);
  };

  const handleBirdCount = () => {
    navigation.navigate('EditCount', {
      selectedItemData,  // Pass the entire item object to the next screen
    });
  };

  

  // if (email === rowData.email) {
  //   if (showBirdEditForm) {
  //     return (
  //       <SurveyFormPage
  //         rowData={rowData}
  //         setEditSurvay={setshowBirdEditForm}
  //         email={email}
  //       />
  //     );
  //   }
  // } else {
  //   Alert.alert('Error', `You can't edit this form`);
  // }
  // if (showBirdEditForm) {
  //   return (
  //     <SurveyFormPage rowData={rowData} setEditSurvay={setshowBirdEditForm} email = {email} />
  //   );
  // }

  return (
    <ImageBackground
      source={require('./../../assets/image/imageD1.jpg')}
      style={styles.backgroundImage}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                   <IconButton
                     icon="arrow-left"
                     iconColor="#000"
                     size={30}
                   />
                 </TouchableOpacity>
      <ScrollView style={styles.title_container}>
        <View style={styles.whiteBox}>
          <View style={styles.text_container}>
            <Text style={styles.sub_text_bold}>
              Do You Want to Edit Full Survey Or Bird{' '}
            </Text>
            <Text style={styles.sub_text_bold}>Count?</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleFullSurvey}
              style={[styles.button_signup, {borderRadius: 8}]}
              buttonColor="#516E9E"
              textColor="white"
              labelStyle={styles.button_label}>
              Full Survey
            </Button>

            <Button
              mode="contained"
              onPress={handleBirdCount}
              style={[styles.button_signup, {borderRadius: 8}]}
              buttonColor="#516E9E"
              textColor="white"
              labelStyle={styles.button_label}>
              Bird Count
            </Button>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

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
    marginTop: '20%',
  },
  main_text: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  sub_text: {
    fontSize: 18,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
  },
  sub_text_bold: {
    fontSize: 20,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 5, // Adjusted margin for spacing between lines
  },
  text_container: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 80,
    borderRadius: 15,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  text_input: {
    width: 55,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  button_signup: {
    width: '48%', // Adjust width to fit both buttons in a row
    backgroundColor: 'green',
  },
  button_label: {
    fontSize: 18,
  },
  sub_text_A: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'right',
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
    alignItems: 'center',
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
    marginTop: 40,
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
  },
});

export default SelectEditMode;
