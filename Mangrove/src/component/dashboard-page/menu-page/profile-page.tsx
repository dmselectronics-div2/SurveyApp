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
  TouchableOpacity,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import {API_URL} from '../../../config';

const data = [
  {label: 'Birds', value: 'Birds'},
  {label: 'Bivalve', value: 'Bivalve'},
  {label: 'Trees', value: 'Trees'},
  {label: 'Soil', value: 'Soil'},
];

const ProfileMenu = () => {
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

  const uploadImageToServer = async uri => {
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

    try {
      const response = await fetch(`${API_URL}/upload`, {
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
        Alert.alert('Success', 'Image uploaded successfully!');
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

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${API_URL}/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        Alert.alert(
          'Request Sent',
          "Account delete request sent to admin. We'll inform you when it's accepted."
        );
      } else {
        const errorData = await response.json();
        console.error('Error deleting account:', errorData);
        Alert.alert('Error', 'Failed to send account delete request. Please try again.');
      }
    } catch (error) {
      console.error('Error sending delete request:', error);
      Alert.alert('Error', 'An error occurred while sending the request.');
    }
  };
  

  const handleSaveImage = () => {
    uploadImageToServer(avatarUri);
  };

  const handleAvatarChange = () => {
    navigation.navigate('ProfileImageChange', {email});
  };

  const openCamera = () => {
    launchCamera({}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setAvatarUri(response.assets[0].uri);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setAvatarUri(response.assets[0].uri);
      }
    });
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

  const retriveEmailFromSQLite = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT email FROM LoginData LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const email = results.rows.item(0).email;
            setEmail(email);
            console.log('Retrieved email profile : ', email);
            retrieveNameFromSQLite(email);
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
    // retrieveEmailSecurely();
    showData();
    retriveEmailFromSQLite();
  }, []);

  const handleLogoutClick = () => {
    navigation.navigate('LoginPage', {email});
    setShowDialog(false);
  };

  const handleShowLogoutConfirmation = () => {
    setShowDialog(true);
  };
  const closeDialog = () => {
    setShowDialog(false);
  };

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
            console.log('Name Email Image ', retrievedName, retrievedArea, retrieveImage);
            if (retrievedName) {
              setName(retrievedName); // Updating name state
            }

            if (retrievedArea) {
              setArea(retrievedArea); // Updating area state
            }

            if (retrieveImage) {
              setAvatarUri(retrieveImage); // Use the image from the database if it exists
            } else {
              setAvatarUri(''); // Default to a local placeholder if no image is found
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
              size={120}
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
          <View style={styles.textContainer}>
            {isEditingName ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                onBlur={() => handleEditToggle('name')}
              />
            ) : (
              <Text style={styles.title}>{name}</Text>
            )}
          </View>
          <View>
            <IconButton
              // style={styles.badge}
              size={18}
              icon={isEditingName ? 'check' : 'pencil'}
              iconColor={isDarkMode ? 'white' : 'black'}
              rippleColor="#D0BBFF"
              onPress={() => handleEditToggle('name')}></IconButton>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <View
          style={[
            styles.cardContent,
            {
              backgroundColor: isDarkMode
                ? 'rgba(177, 177, 177, 0.2)'
                : 'rgba(217, 217, 217, 0.9)',
            },
          ]}>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.subtitle,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              Email Address
            </Text>

            {/* <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                onBlur={() => handleEditToggle('email')}
              /> */}

            <Text style={styles.titleEmail}>{email}</Text>
          </View>
          {/* <View>
            <IconButton
              // style={styles.badge}
              size={18}
              icon={isEditingEmail ? 'check' : 'pencil'}
              iconColor={isDarkMode ? 'white' : 'black'}
              rippleColor="#D0BBFF"
              onPress={() => handleEditToggle('email')}></IconButton>
          </View> */}
        </View>
      </Card>

      <Card style={styles.card}>
        <View
          style={[
            styles.cardContent,
            {
              backgroundColor: isDarkMode
                ? 'rgba(177, 177, 177, 0.2)'
                : 'rgba(217, 217, 217, 0.9)',
            },
          ]}>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.subtitle,
                {color: isDarkMode ? 'white' : 'black'},
              ]}>
              Preferred Area
            </Text>
            {/* {isEditingArea ? (
              <Dropdown
                style={[styles.dropdown, isFocus1 && styles.dropdownFocused]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus1 && !value1 ? `Preferred Area` : ''}
                value={value1}
                onFocus={() => setIsFocus1(true)}
                onBlur={() => setIsFocus1(false)}
                onChange={item => {
                  setValue1(item.value);
                  setArea(item.value); // Update the area state as well
                  setIsFocus1(false);
                }}
              />
            ) : (
              <Text style={styles.title}>{area}</Text>
            )} */}

            <Text style={styles.title}>{area}</Text>
          </View>
          {/* <View>
            <IconButton
              // style={styles.badge}
              size={18}
              icon={isEditingArea ? 'check' : 'pencil'}
              iconColor={isDarkMode ? 'white' : 'black'}
              rippleColor="#D0BBFF"
              onPress={() => handleEditToggle('area')}></IconButton>
          </View> */}
        </View>
      </Card>

      {/* <Button
        mode="contained"
        onPress={handleSaveImage}
        style={styles.saveButton}>
        Save Image
      </Button> */}

      <Card style={styles.bottomCard} onPress={handleShowLogoutConfirmation}>
        <View style={styles.textContainer}>
          <Text style={styles.bottomTitle}>SIGN OUT</Text>
        </View>
      </Card>

      <Card style={styles.bottomCard2} onPress={handleDeleteAccount}>
        <View style={styles.textContainer}>
          <Text style={styles.bottomTitle2}>DELETE ACCOUNT</Text>
        </View>
      </Card>

      {/* <Card
  style={[styles.bottomCardSecondary, { backgroundColor: 'transparent', elevation: 0 }]}
  onPress={() => navigation.navigate('PrivacyPolicy')}
>
  <View style={styles.textContainer}>
    <Text style={styles.bottomTitleSecondary}>Privacy and Policies</Text>
  </View>
</Card> */}


<TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
  <Text
    style={[
      styles.privacyPolicyText,
      { color: isDarkMode ? 'blue' : 'blue' },
    ]}
  >
   Privacy and Policies
  </Text>
</TouchableOpacity>




      <Portal>
        <Dialog visible={showDialog} onDismiss={closeDialog}>
          <Dialog.Title>Logout Confirmation</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure to logout from application?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleLogoutClick}>Yes</Button>
            <Button onPress={closeDialog}>No</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  bottomCardSecondary: {
    padding: 5, // Adjust padding if necessary
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Ensure background is transparent
    elevation: 0, // Remove shadow
    marginTop: 420,
  },
  bottomTitleSecondary: {
    fontSize: 16,
    color: 'blue', // Make it look like a clickable link
    textDecorationLine: 'underline', // Optional, to emphasize it's a link
  },
  
  privacyPolicyText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginTop: 400,
    alignSelf: 'center', // Center aligns the button text
  },
  bottomCard2:{
    width: '95%',
    position: 'absolute',
    bottom: '7%',
    // marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 3,
    padding: 5,
    backgroundColor: 'rgba(67, 10, 255, 0.9)',

  },
  
  bottomCard: {
    width: '95%',
    position: 'absolute',
    bottom: '13%',
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
  bottomTitle2: {
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

export default ProfileMenu;
