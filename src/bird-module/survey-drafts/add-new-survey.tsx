import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { Button } from 'react-native-paper';

const SurveyComponent = () => {
  const [surveyAdded, setSurveyAdded] = useState(false);
   const navigation = useNavigation<any>();

  const handleAddSurvey = () => {
    Alert.alert(
      'Survey Confirmation',
      'Do You Want to Add Survey for Today?',
     
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => { navigation.navigate('BirdSurveyForm');},
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {!surveyAdded ? (
        <Button
          mode="contained"
          onPress={handleAddSurvey}
          style={styles.button}
          buttonColor="green"
          textColor="white"
        >
          Add New Survey
        </Button>
      ) : (
        <Text style={styles.confirmationText}>Survey Added Successfully!</Text>
      )}
    </View>
  );
};

export default SurveyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  button: {
    borderRadius: 8,
    padding: 10,
  },
  confirmationText: {
    fontSize: 18,
    color: 'green',
    marginTop: 20,
  },
});
