import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Callout, Circle, Marker} from 'react-native-maps';
import MapView from 'react-native-map-clustering';
// import Geolocation from '@react-native-community/geolocation';
// import Geolocation from 'react-native-geolocation-service';
import PushNotification from 'react-native-push-notification';

import BackgroundGeolocation from 'react-native-background-geolocation';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {BASE_URL_LOCAL} from '../config/Api';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import {addGasStationList} from '../components/redux/gasStationSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleGeofencing} from './geofenceHandler';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const HomeScreen = ({navigation}) => {
  const userData = useSelector(state => state.gasStation.user);

  const [search, setSearch] = useState('');
  const [gasStation, setGasStation] = useState([]);
  const [location, setLocation] = useState(null);
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   const requestLocationPermission = async () => {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log('Location permission granted');
  //         const locationUpdate = Geolocation.getCurrentPosition(
  //           position => {
  //             console.log('True position => ', position);
  //             const {latitude, longitude} = position.coords;
  //             setLocation({latitude, longitude});
  //           },
  //           error => {
  //             // See error code charts below.
  //             console.warn('false => ', error.code, error.message);
  //           },
  //           {enableHighAccuracy: true, timeout: 15000},
  //         );
  //       } else {
  //         console.log(
  //           'Location permission denied. Geofence functionality will be disabled.',
  //         );
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   };
  //   requestLocationPermission();
  //   const locationUpdateInterval = setInterval(requestLocationPermission, 5000);
  //   return () => clearInterval(locationUpdateInterval);
  // }, []);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted home screen');
          BackgroundGeolocation.watchPosition(
            location => {
              // if (!initialLocationSet) {
              const {latitude, longitude} = location.coords;
              // console.log(latitude, longitude, '-------------------');
              setLocation({latitude, longitude});
              // setInitialLocationSet(true);
              // }
            },
            errorCode => {
              console.log('[watchPosition] ERROR -', errorCode);
            },
            {
              interval: 2000,
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
          Alert.alert(
            'Permission Denied',
            'To use this feature, you need to grant location permission. Do you want to open app settings?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Permission denied by user'),
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () => openAppSettings(),
              },
            ],
          );
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();
    getStationList();
    setTimeout(() => {
      requestLocationPermission;
    }, 3000);
  }, []);

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const getStationList = async () => {
    try {
      const response = await axios.get(`${BASE_URL_LOCAL}/gas-stations-list`);
      console.log('fetch StationList -------', response.data);
      if (response.data) {
        setGasStation(response.data.data);
        const jsonValue = JSON.stringify(response.data.data);
        const gasStations = response.data.data;
        handleGeofencing(gasStations, userData); // geofencing
        await AsyncStorage.setItem('Gas-Stations', jsonValue);
        dispatch(addGasStationList(response.data.data));
      }
    } catch (error) {
      console.log('fetch StationList err==> ', error);
    }
  };

  const handleCalloutMarker = async Station => {
    // console.log(Station, '--------------------------------');
    Keyboard.dismiss();
    try {
      setLoader(true);
      let data = JSON.stringify({
        gas_station_id: Station ? Station.id : '',
        search: search,
      });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL_LOCAL}/gas-stations-search`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };
      const response = await axios.request(config);
      // console.log('response -->', response.data);
      if (response.data.status) {
        setSearch('');
        navigation.navigate('SearchList', {
          searchedData: response.data,
          searchName: search,
          searchID: Station ? Station.id : '',
        });
      }
      setLoader(false);
    } catch (error) {
      console.log('handleCalloutMarker err :', error);
      setLoader(false);
      Alert.alert('something wrong!', 'pls try again');
    }
  };

  // redux
  const gas = useSelector(state => state.gasStation.gasStation);
  // console.log('app.js gasStation ===> :', gas);
  // console.log('checkrender --------------------------------');

  // useEffect(() => {
  //   BackgroundGeolocation.onGeofence(geofence => {
  //     console.log(
  //       '[geofence] ',
  //       geofence.identifier,
  //       geofence.action,
  //       geofence.extras.gasStation_id,
  //     );

  //     if (geofence.action == 'ENTER') {
  //       handleInOut('IN', geofence.extras.gasStation_id);
  //       PushNotification.localNotification({
  //         channelId: 'test-channel',
  //         title: geofence.identifier.slice(0, -1),
  //         message: `you have reached ${geofence.identifier.slice(0, -1)}`,
  //         invokeApp: true,
  //         // color: 'white',
  //       });
  //       // BackgroundGeolocation.start(); // ye tha
  //       // BackgroundGeolocation.startGeofences();
  //     } else if (geofence.action == 'EXIT') {
  //       handleInOut('OUT', geofence.extras.gasStation_id);
  //       PushNotification.localNotification({
  //         channelId: 'test-channel',
  //         title: geofence.identifier.slice(0, -1),
  //         message: `you are out of ${geofence.identifier.slice(0, -1)}`,
  //         invokeApp: true,
  //         // color: 'white',
  //       });
  //       BackgroundGeolocation.startGeofences();
  //     }
  //   });

  //   const addGeofences = async () => {
  //     try {
  //       if (gas) {
  //         const geofences = gas.map(item => ({
  //           identifier: `${item.gas_station_name} ${item.id}`,
  //           radius: 200,
  //           latitude: parseFloat(item.latitude),
  //           longitude: parseFloat(item.longitude),
  //           notifyOnEntry: true,
  //           notifyOnExit: true,
  //           extras: {
  //             gasStation_id: item.id,
  //           },
  //         }));
  //         await BackgroundGeolocation.addGeofences(geofences);
  //         // console.log('geofences ------->', geofences);
  //         console.log('Geofences added successfully');
  //       }
  //     } catch (error) {
  //       console.error('Error adding geofences:', error);
  //     }
  //   };
  //   addGeofences();

  //   BackgroundGeolocation.ready(
  //     {
  //       desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  //       distanceFilter: 10,
  //       // url: 'http://your.server.com/locations',
  //       // autoSync: true,
  //       stopOnTerminate: false,
  //       startOnBoot: true,
  //       enableHeadless: true,
  //       // geofenceModeHighAccuracy: true,
  //       // forceReloadOnBoot: true,
  //     },
  //     state => {
  //       // if (!state.enabled) {
  //       // BackgroundGeolocation.startGeofences(); // ye pehle se the
  //       BackgroundGeolocation.start();
  //       // }
  //     },
  //   );
  // }, []);

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
      <View style={styles.container}>
        {location && (
          <MapView
            style={StyleSheet.absoluteFill}
            animationEnabled={true}
            showsUserLocation={true}
            showsCompass={true}
            followsUserLocation={true}
            mapType="standard"
            scrollEnabled={true}
            zoomEnabled={true}
            // compassOffset={{x: 100, y: 200}}
            initialRegion={{
              latitude: location && location.latitude,
              longitude: location && location.longitude,
              // latitudeDelta: 0.02, // Increase this value for a less zoomed-in map
              // longitudeDelta: 0.005,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={e => {
              console.log(e.nativeEvent.coordinate);
              const {latitude, longitude} = e.nativeEvent.coordinate;
              console.log('latitude :', latitude, 'longitude :', longitude);
            }}>
            {gasStation.length > 1 &&
              gasStation.map((val, index) => {
                // console.log('-=-=', val.latitude);
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: parseFloat(val.latitude),
                      longitude: parseFloat(val.longitude),
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                      }}>
                      <Text style={styles.marker_txt_one}>Gas Station</Text>
                      <Image
                        source={require('../assets/images/gas-station.png')}
                        style={styles.marker_icon}
                      />
                    </View>
                    <Callout
                      style={styles.Callout_style}
                      onPress={() => {
                        if (search.length != 0) {
                          setSearch('');
                        }
                        handleCalloutMarker(val);
                      }}>
                      <Text style={styles.marker_txt_two}>
                        {`Get Status    >`}
                      </Text>
                    </Callout>
                  </Marker>
                );
              })}

            <Circle
              //   center={geofenceLocation}
              center={{latitude: 22.5723893, longitude: 88.4364983}}
              radius={150} // 200 meters
              strokeWidth={2}
              strokeColor="#ff0000"
              fillColor="#57FBCA42"
            />
          </MapView>
        )}
        {!location && (
          <View style={styles.loader_view}>
            <Text>Loading Map..</Text>
            <LottieView
              source={require('../components/lottie/lottie-loader7.json')}
              style={{width: 30, height: 30}}
              autoPlay
              loop
            />
          </View>
        )}

        <View style={styles.drawer_con}>
          <TouchableOpacity
            onPress={() => {
              navigation.openDrawer();
            }}
            style={styles.drawer_btn}>
            <Image
              source={require('../assets/images/drawer.png')}
              style={styles.drawer_icon}
            />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.parent}>
          <View style={styles.search_con}>
            <Image
              source={require('../assets/images/location.png')}
              style={{width: 25, height: 25}}
              tintColor={'#807D7C'}
            />
            <TextInput
              placeholder="Search Gas Station"
              style={styles.search_bar}
              placeholderTextColor={'#525252'}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('SearchList');
              if (search.length === 0) {
                Toast.show({
                  type: 'error',
                  text1: 'error',
                  text2: `empty search.!`,
                });
              } else {
                handleCalloutMarker();
              }
            }}
            style={styles.search_btn}>
            <Text style={styles.search_btn_txt}>Find</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>

      {/* loader */}
      {loader && (
        <View style={styles.loader_con}>
          <LottieView
            source={require('../components/lottie/lottie-loader7.json')}
            style={{width: 60, height: 60}}
            autoPlay
            loop
          />
        </View>
      )}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // backgroundColor: '#602D90',
  },
  loader_view: {
    flex: 1,
    backgroundColor: 'aliceblue',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: -1,
  },
  drawer_con: {
    position: 'absolute',
    width: Width,
    // backgroundColor: '#ff0000',
    flexDirection: 'row',
    marginTop: 60,
    paddingLeft: 10,
  },
  drawer_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    elevation: 1,
  },
  drawer_icon: {
    width: Width / 18,
    height: Width / 18,
    resizeMode: 'contain',
  },
  parent: {
    position: 'absolute',
    width: Width,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  search_con: {
    marginVertical: 10,
    flexDirection: 'row',
    // backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  search_bar: {
    paddingHorizontal: 10,
    color: '#404040',
    flex: 1,
    // backgroundColor: 'red',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#999',
    fontFamily: 'Rubik-Regular',
    fontSize: 15,
  },
  search_btn: {
    margin: 10,
    backgroundColor: '#602D90',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 8,
  },
  search_btn_txt: {
    color: '#fff',
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
  },
  //custom marker style
  marker_txt_one: {
    fontFamily: 'Outfit-Regular',
    color: '#ff0000',
  },
  marker_icon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  Callout_style: {
    alignItems: 'center',
    width: 100,
    // backgroundColor: '#FC6067',
  },
  marker_txt_two: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#000',
  },

  loader_con: {
    position: 'absolute',
    width: Width,
    height: Height,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    zIndex: 1,
  },
});
