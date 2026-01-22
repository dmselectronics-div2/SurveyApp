import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, PermissionsAndroid, Platform } from 'react-native';
import GetLocation from 'react-native-get-location';

const LocationForm = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "This app needs access to your location.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the location");
            getCurrentLocation();
          } else {
            console.log("Location permission denied");
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
        setLatitude(location.latitude.toString());
        setLongitude(location.longitude.toString());
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      });
    };

    requestLocationPermission();
  }, []);

  return (
    <View>
      <Text>Latitude</Text>
      <TextInput
        value={latitude}
        placeholder="Latitude"
        editable={false}
      />
      <Text>Longitude</Text>
      <TextInput
        value={longitude}
        placeholder="Longitude"
        editable={false}
      />
    </View>
  );
};

export default LocationForm;
