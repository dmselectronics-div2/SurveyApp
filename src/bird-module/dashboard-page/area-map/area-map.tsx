// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, PermissionsAndroid, Platform } from 'react-native';
// import MapView, { Marker, Geojson } from 'react-native-maps';
// import geojson from './custom.geo.json'; // Import your GeoJSON data
// import GetLocation from 'react-native-get-location';

// const MapPage = () => {
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [locationEnabled, setLocationEnabled] = useState(false);
//   const [region, setRegion] = useState({
//     latitude: 7.70642, 
//     longitude: 79.81175, 
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });

  
//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         region={region} // Use dynamic region state
//         showsUserLocation={locationEnabled} // Show user location if enabled
//       >
//         {geojson && <Geojson geojson={geojson} />}
//         {latitude && longitude && (
//           <Marker
//             coordinate={{ latitude, longitude }}
//             title="Your Location"
//             description="This is where you are currently located."
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

// export default MapPage;


import React, {useState, useEffect} from 'react';
import {StyleSheet, View, PermissionsAndroid, Platform} from 'react-native';
import MapView, {Marker, Geojson} from 'react-native-maps';
import geojson from './custom.geo.json'; // Import your GeoJSON data
import GetLocation from 'react-native-get-location';

const MapPage = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [region, setRegion] = useState({
    latitude: 7.71642,
    longitude: 79.81175,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0321,
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region} // Use dynamic region state
        showsUserLocation={locationEnabled} // Show user location if enabled
      >
        {geojson && <Geojson geojson={geojson} />}
        {latitude && longitude && (
          <Marker
            coordinate={{latitude, longitude}}
            title="Your Location"
            description="This is where you are currently located."
          />
        )}

        <Marker
          coordinate={{latitude: 7.70642, longitude: 79.81175}}
          title="Point 1"
          description="First point location"
        />
        <Marker
          coordinate={{ latitude: 7.721604965437575, longitude: 79.79773320877126 }} //7.721604965437575, 79.79773320877126,  //7.722893179660175, 79.80795990528384
          title="Point 2"
          description="Second point location"
        />
        <Marker
          coordinate={{latitude: 7.722893179660175, longitude: 79.80795990528384}}
          title="Point 3"
          description="Third point location"
        />
        <Marker
          coordinate={{latitude: 7.714047362917181, longitude: 79.82494662152509}} //7.714047362917181, 79.82494662152509
          title="Point 4"
          description="Fourth point location"
        />
        <Marker
          coordinate={{latitude: 7.70657550950061, longitude: 79.82676662683664}} //7.70657550950061, 79.82676662683664
          title="Point 5"
          description="Fifth point location"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapPage;