import {Alert, Linking, PermissionsAndroid} from 'react-native';
import React, {useEffect} from 'react';
import MainNav from './src/navigation/MainNav';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import BackgroundGeolocation from 'react-native-background-geolocation';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import {BASE_URL_LOCAL} from './src/config/Api';
import axios from 'axios';

const App = () => {
  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     // console.log('Authorization status:', authStatus); //Authorization status: 1
  //   }
  // }

  // const getToken = async () => {
  //   const token = await messaging().getToken();
  //   // console.log('Token => ', token); // Token =>  eTobdXxnQsOUIQHAzM2Jez:APA91bG-DdWCSlv28K3tp9Z50LoaZWPrd3UmPPjpDxapQWFebbbWNElD-67IxqgLX9A1UIwkxMW8rs1tJs4gI3NNc7pKt0r_qu2GNygKSX_3MFoCjI8uEiyBkTCRmfWLbvYAxp5-RXxD
  // };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        requestNotificationPermission();
      } else {
        console.log(
          'Location permission denied. Geofence functionality will be disabled.',
        );
        requestNotificationPermission();
        Alert.alert('location permission denied', 'please allow from settings');
        // Linking.openSettings();
      }
    } catch (err) {
      console.log('requestLocationPermission App.js', err);
    }
  };
  const requestNotificationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('Location permission granted');
      } else {
        console.log(
          'Location permission denied. Geofence functionality will be disabled.',
        );
      }
    } catch (err) {
      console.log('requestLocationPermission App.js', err);
    }
  };

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test-channel',
      channelName: 'Test Channel',
    });
  };

  // redux
  const gas = useSelector(state => state.gasStation.gasStation);
  // console.log('app.js gasStation ===> :', gas);
  // console.log('checkrender --------------------------------');

  useEffect(() => {
    // BackgroundGeolocation.onGeofence(geofence => {
    //   console.log(
    //     '[geofence] ',
    //     geofence.identifier,
    //     geofence.action,
    //     geofence.extras.gasStation_id,
    //   );

    //   if (geofence.action == 'ENTER') {
    //     handleInOut('IN', geofence.extras.gasStation_id);
    //     PushNotification.localNotification({
    //       channelId: 'test-channel',
    //       title: geofence.identifier.slice(0, -1),
    //       message: `you have reached ${geofence.identifier.slice(0, -1)}`,
    //       invokeApp: true,
    //       // color: 'white',
    //     });
    //     // BackgroundGeolocation.start(); // ye tha
    //     // BackgroundGeolocation.startGeofences();
    //   } else if (geofence.action == 'EXIT') {
    //     handleInOut('OUT', geofence.extras.gasStation_id);
    //     PushNotification.localNotification({
    //       channelId: 'test-channel',
    //       title: geofence.identifier.slice(0, -1),
    //       message: `you are out of ${geofence.identifier.slice(0, -1)}`,
    //       invokeApp: true,
    //       // color: 'white',
    //     });
    //     BackgroundGeolocation.startGeofences();
    //   }
    // });

    // const addGeofences = async () => {
    //   try {
    //     if (gas) {
    //       const geofences = gas.map(item => ({
    //         identifier: `${item.gas_station_name} ${item.id}`,
    //         radius: 200,
    //         latitude: parseFloat(item.latitude),
    //         longitude: parseFloat(item.longitude),
    //         notifyOnEntry: true,
    //         notifyOnExit: true,
    //         extras: {
    //           gasStation_id: item.id,
    //         },
    //       }));
    //       await BackgroundGeolocation.addGeofences(geofences);
    //       // console.log('geofences ------->', geofences);
    //       console.log('Geofences added successfully');
    //     }
    //   } catch (error) {
    //     console.error('Error adding geofences:', error);
    //   }
    // };
    // addGeofences();

    // BackgroundGeolocation.ready(
    //   {
    //     desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    //     distanceFilter: 10,
    //     // url: 'http://your.server.com/locations',
    //     autoSync: true,
    //     stopOnTerminate: false,
    //     startOnBoot: true,
    //     enableHeadless: true,
    //     debug: false,
    //     geofenceProximityRadius: 1000,
    //     // geofenceModeHighAccuracy: true,
    //     // forceReloadOnBoot: true,
    //   },
    //   state => {
    //     // if (!state.enabled) {
    //     // BackgroundGeolocation.startGeofences(); // ye pehle se the
    //     BackgroundGeolocation.start();
    //     // }
    //   },
    // );
    requestLocationPermission();
    createChannels();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const userData = useSelector(state => state.gasStation.user);

  const handleInOut = async (status, id) => {
    try {
      let data = JSON.stringify({
        gas_station_id: id,
        vehicleNumber: userData?.User_details.vehicleLicense,
        status: status,
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL_LOCAL}/vehicle-in-out`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      const response = await axios.request(config);
      // console.log('response app => ', response.data);
    } catch (error) {
      console.log('in out update error => ', error);
    }
  };

  return (
    <>
      <MainNav />
      <Toast />
    </>
  );
};

export default App;
