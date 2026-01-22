import React, {useEffect, useState} from 'react';
import {
  Menu,
  Text,
  Avatar,
  Divider,
  Card,
  Badge,
  IconButton,
  Appbar,
  Button,
  Dialog,
  Portal,
} from 'react-native-paper';
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Appearance,
  ImageBackground,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import {API_URL} from '../../../config';
import axios from 'axios';

const data = [
  {label: 'Birds', value: 'Birds'},
  {label: 'Bivalve', value: 'Bivalve'},
  {label: 'Trees', value: 'Trees'},
  {label: 'Soil', value: 'Soil'},
];

const ProfileImageChange = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const navigation = useNavigation();
  const [avatarUri, setAvatarUri] = useState('');

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingArea, setIsEditingArea] = useState(false);
  // const [name, setName] = useState('your name');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [area, setArea] = useState('Birds');

  const [value1, setValue1] = useState(null);
  const [isFocus1, setIsFocus1] = useState(false);

  const [showDialog, setShowDialog] = useState(false);

  const handleEditToggle = field => {
    switch (field) {
      case 'name':
        setIsEditingName(!isEditingName);
        break;
      case 'email':
        setIsEditingEmail(!isEditingEmail);
        break;
      case 'area':
        setIsEditingArea(!isEditingArea);
        break;
      default:
        break;
    }
  };

  const _goBack = () => console.log('Went back');
  const _handleSearch = () => console.log('Searching');
  const _handleMore = () => console.log('Shown more');

  const uploadImageToServer = async uri => {
    console.log('uri is ', uri);
    if (!uri) {
      Alert.alert('No image selected', 'Please select an image before saving.');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', {
      uri,
      name: 'profileImage.jpg', // Use the appropriate file name and extension
      type: 'image/jpeg', // Ensure this matches the file type
    });

    formData.append('email', email);
    console.log('Image page email is ', email);

    try {
      const response = await fetch(`${API_URL}/api/upload-profile-image`, {
        // Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseText = await response.text(); // Log the response text for inspection
      console.log('Server response:', responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        setAvatarUri(data.filePath);
        uploadPathToServer(data.filePath, email);
        // Alert.alert('Success', 'Image uploaded successfully!');
        console.log('Image uploaded successfully:', data.filePath);
      } else {
        console.error('Upload failed:', responseText);
        Alert.alert('Error', 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'An error occurred while uploading the image.');
    }
  };

  const handleSaveImage = () => {
    uploadImageToServer(avatarUri);
  };

  // update mongo db image path
  const uploadPathToServer = async (uri, email) => {
    console.log('uri is uploadPathToServer ', uri);

    console.log('Image page email is uploadPathToServer ', email, ' ', uri );

    try {
      const response = await axios.post(`${API_URL}/post-image-path`, {
        email,
        uri,
      });

      if (response.data.status === 'ok') {
        saveUserToSQLite(uri, email);
      } else {
        console.error('Upload failed:');
        Alert.alert('Error', 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'An error occurred while uploading the image.');
    }
  };

  // Save data in SQLite
  const saveUserToSQLite = (url, email) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Users LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            // If a row already exists, update it
            tx.executeSql(
              `UPDATE Users SET userImageUrl = ? WHERE email = ?`,
              [url, email],
              () => {
                Alert.alert('Success', 'Image uploaded successfully!');
                console.log('Image uploaded successfully: ');
                // navigation.navigate('ProfileMenu');
                navigation.goBack();
              },
              error => {
                console.log('Error updating user in SQLite: ' + error.message);
              },
            );
          } else {
            // If no row exists, insert a new one
            tx.executeSql(
              `INSERT INTO Users (userImageUrl, email) VALUES(?, ?)`,
              [url, email],
              () => {
                Alert.alert('Success', 'Image uploaded successfully!');
                console.log('Image uploaded successfully: ');
                // navigation.navigate('ProfileMenu');
                navigation.goBack();
              },
              error => {
                console.log('Error updating user in SQLite: ' + error.message);
              },
            );
          }
        },
        error => {
          console.log('Error querying Users table: ' + error.message);
        },
      );
    });
  };

  const handleAvatarChange = () => {
    Alert.alert(
      'Change Profile Image',
      'Choose an option',
      [
        {text: 'Camera', onPress: () => openCamera()},
        {text: 'Gallery', onPress: () => openGallery()},
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setAvatarUri(response.assets[0].uri);
        }
      },
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setAvatarUri(response.assets[0].uri);
        }
      },
    );
  };

  const renderLabel = (label, value, isFocus) => {
    if (value || isFocus) {
      return label;
    }
    return `Select ${label.toLowerCase()}`;
  };

  // Retrieving the email
  const retrieveEmailSecurely = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();

      if (credentials) {
        const email = credentials.username; // This will give you the email
        setEmail(email);
        console.log('Retrieved email profile : ', email);
        retrieveNameFromSQLite(email);
        return {email}; // Return the email and password
      } else {
        console.log('No email and password stored.');
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve email and password', error);
    }
  };

  useEffect(() => {
    retrieveEmailSecurely();
  }, []);

  // Open the SQLite database
  const db = SQLite.openDatabase(
    {name: 'user_db.db', location: 'default'},
    () => {
      console.log('Database opened successfully');
    },
    error => {
      console.error('Error opening database: ', error);
    },
  );

  // Function to retrieve email from SQLite
  const retrieveNameFromSQLite = userEmail => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT name, area, userImageUrl FROM Users WHERE email = ?',
        [userEmail],
        (tx, results) => {
          if (results.rows.length > 0) {
            const retrievedName = results.rows.item(0).name; // Fetching name
            const retrievedArea = results.rows.item(0).area; // Fetching area
            const retrieveImage = results.rows.item(0).userImageUrl;
            if (retrievedName) {
              setName(retrievedName); // Updating name state
            }

            if (retrievedArea) {
              setArea(retrievedArea); // Updating area state
            }

            if (retrieveImage) {
              setAvatarUri(retrieveImage); // Use the image from the database if it exists
            } else {
              setAvatarUri('../../../assets/image/prof.jpg'); // Default to a local placeholder if no image is found
            }

            console.log('Name retrieved from SQLite: ', retrievedName);
            console.log('Area retrieved from SQLite: ', retrievedArea);
          } else {
            console.log('No user found in SQLite');
          }
        },
        error => {
          console.error('Error retrieving user from SQLite: ', error.message);
        },
      );
    });
  };

  // useEffect(() => {
  //   retrieveNameFromSQLite();
  // }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode = theme === 'dark';

  return (
    <ImageBackground
      source={require('./../../../assets/image/Bird.jpeg')}
      style={styles.backgroundImage}>
      <Card style={styles.card}>
        <View
          style={[
            styles.cardContent,
            {
              backgroundColor: isDarkMode
                ? 'rgba(177, 177, 177, 0.2)'
                : 'rgba(217, 217, 217, 0.7)',
            },
          ]}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={300}
              source={
                avatarUri
                  ? {uri: avatarUri}
                  : require('../../../assets/image/prof.jpg')
              }
              style={styles.avatar}
            />

            <IconButton
              style={[
                styles.badge,
                {
                  backgroundColor: isDarkMode ? 'black' : 'white',
                  borderColor: isDarkMode ? 'white' : 'black',
                },
              ]}
              size={22}
              icon="plus"
              mode="contained"
              iconColor={isDarkMode ? 'white' : 'black'}
              rippleColor="#D0BBFF"
              onPress={handleAvatarChange}></IconButton>
          </View>
        </View>
      </Card>

      <Button
        mode="contained"
        onPress={handleSaveImage}
        style={styles.saveButton}>
        Save Image
      </Button>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  card: {
    marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // backgroundColor: 'rgba(217, 217, 217, 0.9)',
  },
  bottomCard: {
    width: '95%',
    position: 'absolute',
    bottom: '5%',
    // marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 3,
    padding: 5,
    backgroundColor: 'rgba(255, 10, 10, 0.9)',
  },
  cardContent: {
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(217, 217, 217, 0.9)',
    borderRadius: 10,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    marginRight: 10,
  },
  badge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'InriaSerif-Bold',
    marginLeft: 20,
  },
  bottomTitle: {
    fontSize: 20,
    fontWeight: 600,
    // fontFamily: 'InriaSerif-Bold',
    // marginLeft: 20,
    color: 'white',
  },
  titleEmail: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'InriaSerif-Bold',
    marginLeft: 20,
  },
  subtitle: {
    fontSize: 14,
    marginLeft: 20,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'justify',
  },
  input: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'InriaSerif-Bold',
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  pickerInput: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'InriaSerif-Bold',
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  dropdownFocused: {
    borderColor: 'blue',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  saveButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#4CAF50', // Customize button color as needed
  },
});

export default ProfileImageChange;
