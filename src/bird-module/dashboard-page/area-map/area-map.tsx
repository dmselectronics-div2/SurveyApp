import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {API_KEY} from '../../../config';

const MapPage = () => {
  const navigation = useNavigation<any>();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 7.71642,
    longitude: 79.81175,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (Platform.OS === 'android') {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
        }
        const loc = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });
        setLatitude(loc.latitude);
        setLongitude(loc.longitude);
        setRegion({
          latitude: loc.latitude,
          longitude: loc.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
        // Fetch location name via weather API
        try {
          const res = await axios.get(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${loc.latitude},${loc.longitude}`,
          );
          const loc_data = res.data.location;
          setLocationName(`${loc_data.name}, ${loc_data.region}`);
        } catch (e) {
          console.log('Weather API error:', e);
        }
      } catch (error) {
        console.log('Location error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}>
          {latitude && longitude && (
            <Marker
              coordinate={{latitude, longitude}}
              title="Your Location"
              description="You are here"
              pinColor="#2e7d32"
            />
          )}
        </MapView>
      )}

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Location Info */}
      {latitude && longitude && (
        <View style={styles.infoCard}>
          <Icon name="location-on" size={22} color="#2e7d32" />
          <View style={styles.infoTextContainer}>
            {locationName ? (
              <Text style={styles.locationName}>{locationName}</Text>
            ) : null}
            <Text style={styles.infoText}>
              {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(46, 125, 50, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  infoCard: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoTextContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default MapPage;
