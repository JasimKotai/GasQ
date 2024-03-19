import PushNotification from 'react-native-push-notification';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {BASE_URL_LOCAL} from '../config/Api';
import axios from 'axios';

export const handleGeofencing = (gasStations, userData) => {
  // console.log('gasStations ======> ', gasStations, 'userData ===> ', userData);
  const handleInOut = async (status, id) => {
    try {
      let data = JSON.stringify({
        gas_station_id: id,
        vehicleNumber: userData?.User_details?.vehicleLicense,
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

  BackgroundGeolocation.onGeofence(geofence => {
    console.log(
      '[geofence] ',
      geofence.identifier,
      geofence.action,
      geofence.extras.gasStation_id,
    );

    if (geofence.action == 'ENTER') {
      handleInOut('IN', geofence.extras.gasStation_id);
      PushNotification.localNotification({
        channelId: 'test-channel',
        title: geofence.identifier.slice(0, -1),
        message: `you have reached ${geofence.identifier.slice(0, -1)}`,
        invokeApp: true,
        // color: 'white',
      });
      // BackgroundGeolocation.start(); // ye tha
      // BackgroundGeolocation.startGeofences();
    } else if (geofence.action == 'EXIT') {
      handleInOut('OUT', geofence.extras.gasStation_id);
      PushNotification.localNotification({
        channelId: 'test-channel',
        title: geofence.identifier.slice(0, -1),
        message: `you are out of ${geofence.identifier.slice(0, -1)}`,
        invokeApp: true,
        // color: 'white',
      });
      BackgroundGeolocation.startGeofences();
    }
  });

  const addGeofences = async () => {
    try {
      if (gasStations && gasStations.length > 0) {
        const geofences = gasStations.map(item => ({
          identifier: `${item.gas_station_name} ${item.id}`,
          radius: 200,
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
          notifyOnEntry: true,
          notifyOnExit: true,
          extras: {
            gasStation_id: item.id,
          },
        }));
        await BackgroundGeolocation.addGeofences(geofences);
        // console.log('geofences ------->', geofences);
        console.log('Geofences added successfully');
      }
    } catch (error) {
      console.error('Error adding geofences:', error);
    }
  };
  addGeofences();

  BackgroundGeolocation.ready(
    {
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // url: 'http://your.server.com/locations',
      autoSync: true,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      debug: false,
      geofenceProximityRadius: 1000,
      // geofenceModeHighAccuracy: true,
      // forceReloadOnBoot: true,
    },
    state => {
      if (!state.enabled) {
        // BackgroundGeolocation.startGeofences(); // ye pehle se the
        BackgroundGeolocation.start();
      }
    },
  );
};
