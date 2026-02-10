import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
  Appearance,
} from 'react-native';
import {Button, List} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import { getDatabase } from '../database/db';
import axios from 'axios';
import { API_URL } from '../../config';

const theme = {
  colors: {
    primary: '#56FF64',
    text: 'red',
    placeholder: 'white',
    surface: 'rgba(217, 217, 217, 0.7)',
  },
};

const SelectResearchArea = ({navigation, route}) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  //   const navigation = useNavigation();
  const [selectedArea, setSelectedArea] = useState('Preferred Area');
  const [expanded, setExpanded] = useState(true); // State to control dropdown

  // Get the email from route parameters
  const email = route?.params?.email || null;
  const gName = route?.params?.gName || null;

  // Function to update the pin in SQLite
  const updateAreaInSQLite = async (AreaName) => {
    const db = await getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Users SET area = ? WHERE email = ?',
        [AreaName, email], // Update the pin for the user
        (tx, result) => {
          console.log('Area updated in SQLite ', AreaName);
        },
        error => {
          console.error('Error updating PIN:', error.message);
        },
      );
    });
  };

  const handleSignUp = () => {
    Alert.alert('Please select the area!');
    // navigation.navigate('GetUserName');
  };

  const handlePostArea = (area) => {
    const userData = {
      email: email,
      area: area,
    };
    axios
      .post(`${API_URL}/add-area`, userData)
      .then(res => {
        if (res.data.status === 'ok') {
          // Save user to SQLite after backend success
          updateAreaInSQLite(area);
          if(gName !== null){
            navigation.navigate('Welcome');
            
          }else {
            navigation.navigate('GetUserName', {email});
          }
        } else {
          Alert.alert('Error', res.data.data);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'Error registering user. Please try again.');
      });
  };

  // Handle selection based on the area
  const handleAreaSelection = area => {
    setSelectedArea(area); // Set the selected area
    setExpanded(false); // Collapse the dropdown
    if (area === 'Birds') {
      handlePostArea(area);      
    } else if (area === 'Bivalve') {
      Alert.alert('Coming Soon', 'This area is not developed yet.');
    } else if (area === 'Preferred Area') {
      Alert.alert('Please select the area!');
    }
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode = theme === 'dark';

  return (
    <ImageBackground
      source={require('./../../assets/image/imageD.jpg')}
      style={styles.backgroundImage}>
      <ScrollView style={styles.title_container}>
        <View
          style={[
            styles.whiteBox,
            {
              backgroundColor: isDarkMode
                ? 'rgba(17, 17, 17, 0.8)'
                : 'rgba(217, 217, 217, 0.7)',
            },
          ]}>
          <Text
            style={[styles.main_text, {color: isDarkMode ? 'white' : 'black'}]}>
            Select Your Preferred Area
          </Text>
          <View style={styles.text_container}>
            <View style={styles.flex_container}>
              <Text
                style={[
                  styles.sub_text,
                  {color: isDarkMode ? 'white' : 'black'},
                ]}>
                Please select the{' '}
              </Text>
              <Text
                style={[
                  styles.sub_text_bold,
                  {color: isDarkMode ? 'white' : 'black'},
                ]}>
                {' '}
                area which you want to do{' '}
              </Text>
            </View>
            <View style={styles.flex_container}>
              <Text
                style={[
                  styles.sub_text_bold,
                  {color: isDarkMode ? 'white' : 'black'},
                ]}>
                {' '}
                your research{' '}
              </Text>
              <Text
                style={[
                  styles.sub_text,
                  {color: isDarkMode ? 'white' : 'black'},
                ]}>
                on according to this you will
              </Text>
            </View>
            <View style={styles.flex_container}>
              <Text
                style={[
                  styles.sub_text,
                  {color: isDarkMode ? 'white' : 'black'},
                ]}>
                navigated to your dashboard.
              </Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleSignUp}
            style={[styles.button_signup, {borderRadius: 8}]}
            buttonColor="#516E9E"
            textColor="white"
            labelStyle={styles.button_label}>
            Verify
          </Button>

          <View style={styles.center_list}>
            <List.AccordionGroup>
              <View
                style={[
                  styles.list_menu,
                  {
                    backgroundColor: isDarkMode
                      ? 'rgba(17, 17, 17, 0.8)'
                      : 'rgba(217, 217, 217, 0.7)',
                  },
                ]}>
                <List.Accordion
                  title={selectedArea}
                  id="1"
                  expanded={expanded} // Control the expansion
                  onPress={() => setExpanded(!expanded)} // Toggle on press
                >
                  <ScrollView>
                    <List.Item
                      title="Birds"
                      onPress={() => handleAreaSelection('Birds')}
                    />
                    <List.Item
                      title="Bivalve"
                      onPress={() => handleAreaSelection('Bivalve')}
                    />
                  </ScrollView>
                </List.Accordion>
              </View>
            </List.AccordionGroup>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Your existing styles here
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
    fontSize: 18,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text_container: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 442,
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 80,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  text_input: {
    width: 55,
  },
  button_signup: {
    width: '90%',
    marginTop: 180,
    fontFamily: 'Inter-regular',
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
    marginTop: -170,
    width: '90%',
  },
  list_menu: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    maxHeight: 210,
  },
});

export default SelectResearchArea;
