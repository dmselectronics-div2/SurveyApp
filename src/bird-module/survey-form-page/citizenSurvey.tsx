import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';
import RNFS from 'react-native-fs';
import {
  Provider as PaperProvider,
  TextInput,
  DefaultTheme,
  Button,
  List,
  IconButton
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import GetLocation from 'react-native-get-location';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DisplayTable from '../data-table/display-table';
import MyDataTable from '../data-table/display-table';
import axios from 'axios';
import CustomAlert from '../custom-alert/alert-design';
import { Dimensions } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { API_URL } from '../../config';
import { useNavigation } from '@react-navigation/native';
API_URL

const { width, height } = Dimensions.get('window');



const CitizenForm = () => {

  const [latitude, setLatitude] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const [formEntries, setFormEntries] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({}); // Error state to store validation messages
  const navigation = useNavigation();
   const [FormattedLatitude, setFormattedLatitude] = useState(false);
    const [FormattedLongitude, setFormattedLongitude] = useState(false);

  const handleChoosePhoto = () => {
    // const options = {
    //   mediaType: 'photo',
    //   quality: 1,
    // };
    Alert.alert(
      'Change Bird Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  const openCamera = () => {
    launchCamera({}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri);
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
        setImageUri(response.assets[0].uri);
      }
    });




    
  };


  const resetForm = () => {
   
    setLatitude('');
    setLongitude('');
    setName('');
    setMobile('');
    setImageUri(null);

  };

 const uploadImageToServer = async (uri, addedId) => {
    console.log('uri is uploadImageToServer ', uri, ' ', addedId);
    if (!uri) {
      // Alert.alert('No image selected', 'Please select an image before saving.');
      return;
    }

    console.log('Id in upload image ', addedId);
    const formData = new FormData();
    formData.append('profileImage', {
      uri,
      name: 'formImages.jpg', // Use the appropriate file name and extension
      type: 'image/jpeg', // Ensure this matches the file type
    });

    formData.append('id is', addedId);
    console.log('Image page email is ', addedId);

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
        // setAvatarUri(data.filePath);
        uploadPathToServer(data.filePath, addedId);
        // Alert.alert('Success', 'Form submitted successfully!');
        console.log('Image uploaded successfully:', data.filePath);
      } else {
        console.error('Upload failed:', responseText);
        Alert.alert('Error', 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Alert.alert('Error', 'An error occurred while uploading the image.');
    }
  };
  const uploadPathToServer = async (uri, addedId) => {
    console.log('uri is ', uri, ' ', addedId);
  
    console.log('Image page newId is ', addedId);
  
    try {
      const response = await axios.put(
        `${API_URL}/post-image-path-form/${addedId}`,
        {
          uri,
        },
      );
  
      if (response.data.status === 'ok') {
        console.log('done and dusted');
        showAlert();
      } else {
        console.error('Upload failed:');
        Alert.alert('Error', 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Alert.alert('Error', 'An error occurred while uploading the image.');
    }
  };

  const handleSignUp = async () => {
    const now = new Date();
    console.log('now is ', now);
    const uniqueId = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;
    showAlert();
    const formData = {
      latitude: latitude || null,
  longitude: longitude || null,
  imageUri: imageUri || null,
  name: name || null,
  mobile: mobile || null,
      now
    };

    axios
      .post(`${API_URL}/citizen-form`, formData)
      .then(response => {
        console.log('Form submitted successfully:', response.data);
        // console.log('Form :', response.data._id);
        console.log('Form ID:', response.data.data._id);
        const addedId = response.data.data._id || response.data.formEntry?._id;
         console.log('added id new is ', addedId, ' unique id is ', uniqueId);
                        const NewImageURL = imageUri;
                        console.log('NewImageURL ', NewImageURL);
                        if (addedId && addedId.length > 0) {
                          console.log(addedId);
                          // console.log('Image URL is: ', submittedData.Image URL)
                          uploadImageToServer(NewImageURL, addedId); // Upload the image only if ID is valid
                        } else {
                          console.error('Invalid _id:', addedId);
                          Alert.alert('Error', 'Received invalid ID');
                        }
                
                        console.log('added id ', addedId);
                        Alert.alert(
                          'Success',
                          'Entered Bird data submitted successfully! Thank you very much for your valuble contribution!',
                          [
                            {
                              text: 'OK',
                              onPress: () => {
                                console.log('Form submitted successfully');
                                navigation.navigate('LoginPage'); // Navigate to login page after successful submission
                              }
                            }
                          ],
                          { cancelable: false }
                        );
                              // navigation.navigate('BottomNav');
                              resetForm();
                            })
                            .catch(error => {
                              console.error("Error submitting form:", error);
                              // storeFailedSubmission(formData);
                            });
       
  };
const saveImage = async (imageURi, uniqueId) => {
    if (!imageURi) {
      // Alert.alert('No image selected', 'Please select an image first.');
      return;
    }

    // Define the path where you want to save the image
    //const path = `${RNFS.DocumentDirectoryPath}/profile_image.jpg`; // You can save it to other directories as well
    const path = `${RNFS.CachesDirectoryPath}/${uniqueId}.jpg`;


    try {
      // Copy the file from the URI to the defined path
      await RNFS.copyFile(imageURi, path);
      //Alert.alert('Image saved', `Profile image saved at: ${path}`);
      console.log(path);
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save the image.');
    }
  };



  const renderLabel = (label, value, isFocus) => {
    if (value || isFocus) {
      return label;
    }
    return `Select ${label.toLowerCase()}`;
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
            getCurrentLocation();
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getCurrentLocation();
      }
    };

    const getCurrentLocation = () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
    //       
    //     })
    
          // Set the full precision values for internal use
          setLatitude(location.latitude.toString());
          setLongitude(location.longitude.toString());
    
          // Format values to 2 decimal places for display (without altering stored values)
          setFormattedLatitude(parseFloat(location.latitude).toFixed(2));
          setFormattedLongitude(parseFloat(location.longitude).toFixed(2));
        })
        .catch(error => {
          const {code, message} = error;
          console.warn(code, message);
        });
    };

    requestLocationPermission();
  }, []);

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const showAlert = () => {
    setIsAlertVisible(true);
  };

  const hideAlert = () => {
    setIsAlertVisible(false);
  };




  return (
    <ImageBackground
      source={require('../../assets/image/imageD1.jpg')}
      style={styles.backgroundImage}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                      <IconButton
                        icon="arrow-left"
                        iconColor="#000"
                        size={30}
                      />
                    </TouchableOpacity>

      <View style={styles.whiteBoxContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {!isFormSubmitted ? (
            <View>
              <View style={styles.container3}>
              <Text style={styles.main_text}>Bird Data Collection</Text>
              <View style={styles.dropdownNew}>
                  <TextInput
                    mode="outlined"
                    placeholder="Latitude(N)"
                    outlineStyle={styles.txtInputOutline}
                    value={FormattedLatitude}
                    style={styles.text_input4}
                  />
                  
                </View>
                <View style={styles.dropdownNew}>
                  <TextInput
                    mode="outlined"
                    placeholder="Longitude(E)"
                    outlineStyle={styles.txtInputOutline}
                    value={FormattedLongitude}
                    style={styles.text_input4}
                  />
                </View>
                <View style={styles.dropdownNew}>
            
                    <TextInput
                    mode="outlined"
                    placeholder="Enter Your Name?"
                    value={name}
                    onChangeText={setName}
                    outlineStyle={styles.txtInputOutline}
                    style={[styles.text_input4]}
                    // textColor={'black'}
                  />
                    </View>
                
              
                <View style={styles.dropdownNew}>
            
                <TextInput
  mode="outlined"
  placeholder="Enter Your Mobile Number (if you like)?"
  value={mobile}
  onChangeText={(text) => {
    // Validate mobile number format
    const regex = /^[0-9]{0,10}$/; // This will accept up to 10 digits
    if (regex.test(text)) {
      setMobile(text);
    }
  }}
  outlineStyle={styles.txtInputOutline}
  style={[styles.text_input4]}
  keyboardType="phone-pad" // Ensures phone number keyboard layout
  maxLength={10} // Optionally restrict the number to 10 digits
/>

                    </View>
                <Text style={{ marginTop: 10 }}>Upload a Photo</Text>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleChoosePhoto}>
                  <Icon name="camera" size={30} color="#fff" />
                </TouchableOpacity>
                {imageUri && (
                  <Image source={{ uri: imageUri }} style={styles.image} />
                )}

                {/* <CustomAlert
                  visible={isAlertVisible}
                  onClose={hideAlert}
                  message="Successfully saved data!"
                /> */}

                <Button
                  mode="contained"
                  onPress={handleSignUp}
                  style={[styles.button_signup, { borderRadius: 8 }]}
                  buttonColor="green"
                  textColor="white"
                  labelStyle={styles.button_label}>
                  Submit
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.container}>
              <Text style={styles.main_text3}>Bird Detail Record</Text>
              <MyDataTable data={formEntries} />
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default CitizenForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(217,217,217,0.9)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    height: 380,
    width: width * 0.95,
  },
  container2: {
    backgroundColor: 'rgba(217,217,217,0.9)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,

  },
  container3: {
    backgroundColor: 'rgba(217,217,217,0.9)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,

  },
  textRow: {
    marginBottom: 10, // space between text and radio buttons
  },
  dropdown: {
    height: 50,
    width: width * 0.9,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },

  dropdownFocused: {
    borderColor: 'blue',
  },
  dropdown_after_text: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  text_input_after_drop: {
    width: '95%',
    height: 50,
    borderRadius: 10,
    marginTop: 15,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title_container: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    marginTop: '20%',
  },

  main_text: {
    fontSize: 20,
    fontFamily: 'InriaSerif-Bold',
    color: '#434343',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',

  },
  radioContainer: {
    marginTop: 0,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  radio_topic: {
    marginBottom: 10
  }
  ,
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 10,
  },
  main_text3: {
    fontSize: 20,
    fontFamily: 'InriaSerif-Bold',
    color: '#434343',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',

  },
  sub_text: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
  },
  sub_text_bold: {
    fontSize: 16,
    fontFamily: 'Inter-regular',
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text_container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 142,
  },
  whiteBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 370,
    width: width * 0.95,
    backgroundColor: '#D9D9D9',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 10,
  },
  whiteBox2: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 720,
    backgroundColor: '#D9D9D9',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 15,
  },
  whiteBox3: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 350,
    backgroundColor: '#D9D9D9',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 15,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  text_input: {
    width: width * 0.9,
    height: 50,
    borderRadius: 16,

  },
  text_input2: {
    height: 50,
    borderRadius: 10,
  },
  text_input4: {
    width: width * 0.9,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'white',
  },

  txtInputOutline: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
  },

  dropdownNew: {
    marginTop: 15,
  },

  dropdownNewTwo: {
    marginBottom: 15,
  },

  text_input3: {
    height: 100,
    borderRadius: 10,
  },

  button_signup: {
    width: '90%',
    marginTop: 30,
    marginBottom: 30,
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: '#fff',
  },
  label: {
    marginBottom: 10,
    fontSize: 18,
  },
  input: {
    width: 300,
    height: 40,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  dateInput: {
    height: 50,
    paddingLeft: 10,
    marginTop: 2,
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: 18,
  },
  timeInput: {
    height: 50,
    padding: 10,
    marginTop: 1,
    marginBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  whiteBoxContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownTwo: {
    height: 50,
    width: width * 0.9,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    display: 'flex',
    alignContent: 'space-between',
  },

  calendarTxt: {
    color: 'black',
    fontSize: 16,
  },

  dropdownTree: {
    width: '95%',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  errorBorder: {
    borderColor: 'red',
  },
});
