import {
  Alert,
  Button,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Circle, Marker} from 'react-native-maps';
import BackgroundGeolocation from 'react-native-background-geolocation';
import PushNotification from 'react-native-push-notification';

const PaidLibrary = () => {
  const [location, setLocation] = useState(null);
  const geofenceLocation = {
    latitude: 22.5723893,
    longitude: 88.4364983,
  };
  const gasStations = [
    {
      id: 1,
      name: 'Khidderpore',
      latitude: 22.5372,
      longitude: 88.3231,
    },
    {
      id: 3,
      name: 'kotai latitude and longitude',
      latitude: 22.5723893,
      longitude: 88.4364983,
    },
    {id: 4, name: 'saltlake', latitude: 40.7608, longitude: 111.891},
    {id: 5, name: 'sector v', latitude: 22.5809, longitude: 88.4291},
    {
      id: 6,
      name: 'Home Mominpore',
      latitude: 22.5269625,
      longitude: 88.3230128,
    },
  ];

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          BackgroundGeolocation.watchPosition(
            location => {
              // console.log('[watchPosition] location ->', location);
              const {latitude, longitude} = location.coords;
              setLocation({latitude, longitude});
            },
            errorCode => {
              console.log('[watchPosition] ERROR -', errorCode);
            },
            {
              interval: 1000,
              desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
              persist: true,
              extras: {foo: 'bar'},
              timeout: 60000,
            },
          );
        } else {
          console.log(
            'Location permission denied. Geofence functionality will be disabled.',
          );
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestLocationPermission();
  }, []);

  //   useEffect(() => {
  //     // BackgroundGeolocation.addGeofences(geofences);
  //     // BackgroundGeolocation.onGeofence(geofence => {
  //     //   console.log('[geofence] ', geofence.identifier, geofence.action);
  //     //   Alert.alert(geofence.identifier, geofence.action);
  //     // });
  //     requestLocationPermission();
  //   }, []);

  //   BackgroundGeolocation.ready({
  //     desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  //     distanceFilter: 50,
  //     stopOnTerminate: false,
  //     //   startOnBoot: true,
  //   });
  //   // console.log('- BackgroundGeolocation is ready: ', state);
  //   BackgroundGeolocation.start();
  // -------------------------
  // let geofences = [
  //   {
  //     identifier: 'Mominpore Gas Station',
  //     radius: 200,
  //     latitude: 45.51921926,
  //     longitude: -73.61678581,
  //     notifyOnEntry: true,
  //   },
  //   {
  //     identifier: 'Kotai Gas Station',
  //     radius: 200,
  //     latitude: 22.5723893,
  //     longitude: 88.4364983,
  //     notifyOnEntry: true,
  //   },
  // ];

  // useEffect(() => {
  //   BackgroundGeolocation.ready(
  //     {
  //       desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  //       distanceFilter: 10,
  //       url: 'http://your.server.com/locations',
  //       autoSync: true,
  //       stopOnTerminate: false,
  //       startOnBoot: true,
  //     },
  //     state => {
  //       BackgroundGeolocation.startGeofences();
  //       BackgroundGeolocation.start();
  //     },
  //   );

  //   const addGeofences = async () => {
  //     try {
  //       await BackgroundGeolocation.addGeofences(geofences);
  //       console.log('Geofences added successfully');
  //     } catch (error) {
  //       console.error('Error adding geofences:', error);
  //     }
  //   };
  //   addGeofences();
  //   BackgroundGeolocation.onGeofence(geofence => {
  //     console.log('[geofence] ', geofence.identifier, geofence.action);
  //     if (geofence.action === 'ENTER') {
  //       PushNotification.localNotification({
  //         channelId: 'test-channel',
  //         title: geofence.identifier,
  //         message: 'you have reached geofence.identifier',
  //         invokeApp: true,
  //       });
  //     }
  //   });
  // }, []);

  //   the method getGeofences to retrieve the entire Array of Geofence stored in the SDK's database.
  // BackgroundGeolocation.getGeofences().then(geofences => {
  //   console.log('Total geofence added => ', geofences);
  // });

  //   Removing all geofences with removeGeofences:
  // BackgroundGeolocation.removeGeofences().then(success => {
  //   console.log('[removeGeofences] all geofences have been destroyed');
  // });
  return (
    <>
      <MapView
        style={StyleSheet.absoluteFill}
        region={{
          latitude: location !== null ? location.latitude : 20.5937,
          longitude: location !== null ? location.longitude : 78.9629,
          latitudeDelta: 0.02, // Increase this value for a less zoomed-in map
          longitudeDelta: 0.005,
        }}>
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            description="Your current location"
            pinColor="blue"
          />
        )}
        <Circle
          //   center={geofenceLocation}
          center={{latitude: 22.5723893, longitude: 88.4364983}}
          radius={150} // 200 meters
          strokeWidth={2}
          strokeColor="#ff0000"
          fillColor="#57FBCA42"
        />
      </MapView>
      {/* <Button
        title="press"
        onPress={() => {
          PushNotification.localNotification({
            channelId: 'test-channel',
            title: 'geofence.identifier',
            message: 'you have reached geofence.identifier',
            invokeApp: true,
          });
        }}
      /> */}
    </>
  );
};

export default PaidLibrary;

const styles = StyleSheet.create({});
