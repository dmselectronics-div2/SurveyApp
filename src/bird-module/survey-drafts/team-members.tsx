import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';
import axios from 'axios';
import { useNetInfo } from '@react-native-community/netinfo';
import { getDatabase } from '../database/db';

const { width } = Dimensions.get('window');
 

const TeamData = ({ route }: any) => {
  const [teamMember, setTeamMember] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const navigation = useNavigation<any>();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const netInfo = useNetInfo();

  useEffect(() => {
    const init = async () => {
      try {
        const db = await getDatabase();
        db.transaction((tx: any) => {
          tx.executeSql(
            'SELECT email FROM LoginData LIMIT 1',
            [],
            (_tx: any, results: any) => {
              if (results.rows.length > 0) {
                const emailVal = results.rows.item(0).email;
                setEmail(emailVal);
                console.log('Retrieved email profile : ', emailVal);
              } else {
                console.log('No email and password stored.');
              }
            },
            (_tx: any, error: any) => {
              console.log('Error querying Users table: ' + error.message);
            },
          );
        });
      } catch (error) {
        console.error('Error opening database: ', error);
      }
    };
    init();
  }, []);

  // Retrieve surveyPoint data from route.params
  const { surveyPoint } = route.params || {};
  const { formData } = route.params || {};
  

  
  















  // Function to add a new team member
  const addTeamMember = () => {
    if (teamMember.trim() !== '' && !teamMembers.includes(teamMember)) {
      setTeamMembers([...teamMembers, teamMember]);
      setTeamMember(''); // Clear the input field after adding the member
    } else {
      Alert.alert('Error', 'Please enter a valid and unique name.');
    }
  };

  // Function to handle editing of team member name
  const handleEditTeamMember = (index) => {
    setTeamMember(teamMembers[index]);
    setEditIndex(index); // Set the index of the team member being edited
  };

  // Function to save the edited team member
  const handleSaveEdit = () => {
    const updatedMembers = [...teamMembers];
    updatedMembers[editIndex] = teamMember; // Update the team member at the edit index
    setTeamMembers(updatedMembers);
    setTeamMember(''); // Clear the input field
    setEditIndex(null); // Reset the edit state
  };

  // Function to handle the deletion of a team member
  const handleDeleteTeamMember = (index) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedMembers);
  };

  useEffect(() => {
    if (route.params?.teamMembers) {
      setTeamMembers(route.params.teamMembers); // Restore the data
    }
  }, [route.params?.teamMembers]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${API_URL}/getTeamMembers`, {
          params: { email }
        });
  
        if (response.data.teamMembers) {
          setTeamMembers(response.data.teamMembers);
          console.log('team members:', response.data.teamMembers);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };
  
    if (email) {
      fetchTeamMembers();
    }
  }, [email]);
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${API_URL}/getTeamMembers`, {
          params: { email }
        });
  
        if (response.data.teamMembers) {
          setTeamMembers(response.data.teamMembers);
          console.log('team members:', response.data.teamMembers);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };
  
    if (email) {
      fetchTeamMembers();
    }
  }, [email]);
  
  const fetchTeamMembersFromSQLite = async () => {
    try {
      const db = await getDatabase();
      db.transaction((tx: any) => {
        tx.executeSql(
          'SELECT teamMembers FROM bird_survey LIMIT 1',
          [],
          (_tx: any, results: any) => {
            if (results.rows.length > 0) {
              const members = JSON.parse(results.rows.item(0).teamMembers);
              setTeamMembers(members);
            } else {
              console.log('No team members found in SQLite');
            }
          },
          (_tx: any, error: any) => {
            console.log('Error querying team members table: ', error);
          }
        );
      });
    } catch (error) {
      console.error('Error fetching team members from SQLite:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`${API_URL}/getTeamMembers`, {
        params: { email }
      });

      if (response.data.teamMembers) {
        setTeamMembers(response.data.teamMembers);
        console.log('team members:', response.data.teamMembers);
      }
    } catch (error) {
      // console.error('Error fetching team members:', error);
    }
  };

  const saveTeamMembersToSQLite = async (members: string[]) => {
    try {
      const db = await getDatabase();
      const teamMembersString = JSON.stringify(members);
      db.transaction((tx: any) => {
        tx.executeSql(
          'INSERT INTO bird_survey (email, teamMembers) VALUES (?, ?)',
          [email, teamMembersString],
          (_tx: any, results: any) => {
            if (results.rowsAffected > 0) {
              console.log('Team members saved locally.');
            } else {
              console.log('Failed to save team members locally.');
            }
          },
          (_tx: any, error: any) => {
            console.log('Error saving team members to SQLite: ', error);
          }
        );
      });
    } catch (error) {
      console.error('Error saving team members to SQLite:', error);
    }
  };

  return (
    <ImageBackground source={require('../../assets/image/imageD1.jpg')} style={styles.backgroundImage}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <IconButton icon="arrow-left" iconColor="#000" size={30} />
      </TouchableOpacity> */}
      <TouchableOpacity 
  onPress={() => navigation.navigate('SurveyPointData', { teamMembers })}
  style={styles.backButton}
>
  <IconButton icon="arrow-left" iconColor="#000" size={30} />
</TouchableOpacity>

      <View style={styles.whiteBoxContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.container2}>
            <Text style={styles.mainText}>Team Members</Text>

            {/* Text input to enter or edit team member names */}
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                placeholder="Enter Team Member"
                value={teamMember}
                onChangeText={setTeamMember}
                style={styles.textInput}
                theme={{
                  colors: {
                    text: 'black',
                    placeholder: 'black',
                    primary: 'green',
                  },
                }}
                placeholderTextColor="black"
              />

              <TouchableOpacity onPress={editIndex !== null ? handleSaveEdit : addTeamMember} style={styles.addButton}>
                <Icon name={editIndex !== null ? "check" : "plus"} size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Display the list of added team members with edit and delete buttons */}
            <View style={styles.teamMembersContainer}>
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <View key={index} style={styles.teamMemberContainer}>
                    <Text style={styles.teamMember}>{member}</Text>

                    <View style={styles.actionsContainer}>
                      <TouchableOpacity onPress={() => handleEditTeamMember(index)} style={styles.editButton}>
                        <Icon name="edit" size={18} color="green" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteTeamMember(index)} style={styles.deleteButton}>
                        <Icon name="trash" size={18} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noMembersText}>No team members added yet.</Text>
              )}
            </View>

            {/* Button to navigate to CommonData, passing both surveyPoint & teamMembers */}
            {/* <Button
              mode="contained"
              onPress={() => {
                if (teamMembers.length === 0) {
                  Alert.alert('Error', 'Please add at least one team member before proceeding.');
                  return; // Stop execution if no team members
                }

                console.log('Survey Point Data:', surveyPoint);
                console.log('Team Members Array:', teamMembers);
                console.log('Team Members Array:', formData);

                navigation.navigate('CommonData', { surveyPoint, teamMembers,formData });
              }}
              style={styles.button}
              buttonColor="green"
              textColor="white"
            >
              Go to Next
            </Button> */}
           <Button
  mode="contained"
  onPress={async () => {
    if (teamMembers.length === 0) {
      Alert.alert('Error', 'Please add at least one team member before proceeding.');
      return;
    }

    if (netInfo.isConnected) {
      try {
        const response = await axios.post(`${API_URL}/saveOrUpdateTeamData`, {
          surveyPoint,
          teamMembers,
          formData,
          email,
        });

        if (response.data.updated) {
          Alert.alert('Success', 'Team data updated successfully!');
        } else {
          Alert.alert('Success', 'Team data saved successfully!');
        }

        console.log(response.data);

        navigation.navigate('CommonData', { surveyPoint, teamMembers, formData });
      } catch (error) {
        console.error('Error saving or updating data:', error);
        Alert.alert('Error', 'Failed to save or update team data.');
      }
    } else {
      // Save to SQLite if offline
      saveTeamMembersToSQLite(teamMembers);
      Alert.alert('Offline', 'Team data saved locally, will sync once online.');
      navigation.navigate('CommonData', { surveyPoint, teamMembers, formData });
    }
  }}
  style={styles.button}
  buttonColor="green"
  textColor="white"
>
  Go to Next
</Button>


          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default TeamData;

// Styles
const styles = StyleSheet.create({
  whiteBoxContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  container2: {
    backgroundColor: 'rgba(217,217,217,0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    width: width * 0.93,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  mainText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
    color: '#444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    color: 'black',
    marginBottom: 15,
    width: width * 0.9,
  },
  textInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'gray',
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 5,
  },
  teamMembersContainer: {
    width: width * 0.9,
    marginTop: 20,
    alignItems: 'center',
  },
  teamMemberContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  teamMember: {
    fontSize: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '80%',
    textAlign: 'center',
    color: 'black',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginLeft: 10,
    padding: 5,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  noMembersText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    width: width * 0.9,
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: -10,
  },
});
