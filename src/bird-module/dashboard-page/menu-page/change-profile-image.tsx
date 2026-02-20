import React, {useEffect, useState} from 'react';
import {
  Text,
  Avatar,
  IconButton,
  Button,
} from 'react-native-paper';
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import { getDatabase } from '../../database/db';
import {API_URL} from '../../../config';
import axios from 'axios';
import {getLoginEmail} from '../../../assets/sql_lite/db_connection';

const ProfileImageChange = () => {
  const navigation = useNavigation();
  const [avatarUri, setAvatarUri] = useState('');
  const [email, setEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);

  useEffect(() => {
    retrieveEmailFromSession();
  }, []);

  const retrieveEmailFromSession = async () => {
    try {
      const sessionEmail = await getLoginEmail();
      if (sessionEmail) {
        setEmail(sessionEmail);
        retrieveCurrentImageFromSQLite(sessionEmail);
      }
    } catch (error) {
      console.error('Failed to retrieve email from session', error);
    }
  };

  const retrieveCurrentImageFromSQLite = async (userEmail: string) => {
    const db = await getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT userImageUrl FROM Users WHERE email = ?',
        [userEmail],
        (_tx, results) => {
          if (results.rows.length > 0) {
            const uri = results.rows.item(0).userImageUrl;
            if (uri) setAvatarUri(uri);
          }
        },
        error => {
          console.error('Error retrieving image from SQLite: ', error.message);
        },
      );
    });
  };

  const handleAvatarChange = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        {text: 'Take Photo', onPress: () => openCamera()},
        {text: 'Choose from Gallery', onPress: () => openGallery()},
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const openCamera = () => {
    launchCamera(
      {mediaType: 'photo', quality: 0.8},
      response => {
        if (!response.didCancel && !response.errorCode && response.assets?.length) {
          setAvatarUri(response.assets[0].uri || '');
          setImageSelected(true);
        }
      },
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {mediaType: 'photo', quality: 0.8},
      response => {
        if (!response.didCancel && !response.errorCode && response.assets?.length) {
          setAvatarUri(response.assets[0].uri || '');
          setImageSelected(true);
        }
      },
    );
  };

  const uploadImageToServer = async (uri: string) => {
    if (!uri) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }
    if (!email) {
      Alert.alert('Error', 'Could not retrieve your account. Please try again.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('profileImage', {
      uri,
      name: 'profileImage.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('email', email);

    try {
      const response = await fetch(`${API_URL}/api/upload-profile-image`, {
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data'},
        body: formData,
      });

      const responseText = await response.text();
      if (response.ok) {
        const data = JSON.parse(responseText);
        const filePath = data.filePath;
        await uploadPathToServer(filePath);
      } else {
        console.error('Upload failed:', responseText);
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'An error occurred while uploading the image.');
    } finally {
      setUploading(false);
    }
  };

  const uploadPathToServer = async (uri: string) => {
    try {
      const response = await axios.post(`${API_URL}/post-image-path`, {email, uri});
      if (response.data.status === 'ok') {
        await saveImageToSQLite(uri);
      } else {
        Alert.alert('Error', 'Failed to save image path.');
      }
    } catch (error) {
      console.error('Error saving image path:', error);
      Alert.alert('Error', 'An error occurred while saving the image.');
    }
  };

  const saveImageToSQLite = async (url: string) => {
    try {
      const db = await getDatabase();
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE Users SET userImageUrl = ? WHERE email = ?',
          [url, email],
          () => {
            Alert.alert('Success', 'Profile photo updated successfully!');
            navigation.goBack();
          },
          error => {
            console.log('Error updating image in SQLite: ' + error.message);
            Alert.alert('Success', 'Profile photo uploaded!');
            navigation.goBack();
          },
        );
      });
    } catch (e) {
      console.log('SQLite error:', e);
      Alert.alert('Success', 'Profile photo uploaded!');
      navigation.goBack();
    }
  };

  const handleSaveImage = () => {
    if (!imageSelected) {
      Alert.alert('No Image Selected', 'Please select a photo first by tapping the camera icon.');
      return;
    }
    uploadImageToServer(avatarUri);
  };

  return (
    <ImageBackground
      source={require('./../../../assets/image/Nature.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.overlay}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Content Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Change Profile Photo</Text>
          <Text style={styles.subtitle}>Tap the photo to select a new image</Text>

          {/* Avatar with camera badge */}
          <View style={styles.avatarWrapper}>
            <Avatar.Image
              size={130}
              source={
                avatarUri
                  ? {uri: avatarUri}
                  : require('../../../assets/image/prof.jpg')
              }
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.cameraBadge}
              onPress={handleAvatarChange}
              activeOpacity={0.8}>
              <IconButton
                icon="camera"
                size={20}
                iconColor="#FFFFFF"
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
          </View>

          {imageSelected && (
            <Text style={styles.selectedText}>New photo selected — tap Save to apply</Text>
          )}

          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleAvatarChange}
            activeOpacity={0.8}>
            <Text style={styles.selectButtonText}>Select Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, uploading && styles.saveButtonDisabled]}
            onPress={handleSaveImage}
            disabled={uploading}
            activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>
              {uploading ? 'Uploading...' : 'Save Photo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {flex: 1, resizeMode: 'cover'},
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
  },
  backIcon: {fontSize: 22, color: '#FFFFFF', marginRight: 4, fontWeight: '600'},
  backText: {fontSize: 15, color: '#FFFFFF', fontWeight: '600'},
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    ...Platform.select({
      ios: {shadowColor: 'black', shadowOffset: {width: 0, height: 5}, shadowOpacity: 0.35, shadowRadius: 10},
      android: {elevation: 10},
    }),
  },
  title: {fontSize: 22, fontWeight: '700', color: '#4A7856', marginBottom: 6},
  subtitle: {fontSize: 13, color: '#666', marginBottom: 28, textAlign: 'center'},
  avatarWrapper: {position: 'relative', marginBottom: 16},
  avatar: {backgroundColor: '#E0E0E0'},
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: '#4A7856',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
  },
  cameraIcon: {margin: 0, padding: 0},
  selectedText: {
    fontSize: 12,
    color: '#4A7856',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  selectButton: {
    borderWidth: 2,
    borderColor: '#4A7856',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  selectButtonText: {fontSize: 14, fontWeight: '600', color: '#4A7856'},
  saveButton: {
    backgroundColor: '#4A7856',
    paddingVertical: 13,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    ...Platform.select({
      ios: {shadowColor: 'black', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.25, shadowRadius: 5},
      android: {elevation: 6},
    }),
  },
  saveButtonDisabled: {opacity: 0.6},
  saveButtonText: {fontSize: 15, fontWeight: '700', color: '#FFFFFF'},
});

export default ProfileImageChange;
