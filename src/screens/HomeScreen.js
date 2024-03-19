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

import {isLocationEnabled} from 'react-native-android-location-enabler';
import {promptForEnableLocationIfNeeded} from 'react-native-android-location-enabler';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const HomeScreen = ({navigation}) => {
  const userData = useSelector(state => state.gasStation.user);

  const [search, setSearch] = useState('');
  const [gasStation, setGasStation] = useState([]);
  const [location, setLocation] = useState(null);
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();

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

    async function handleCheckPressed() {
      if (Platform.OS === 'android') {
        try {
          const enableResult = await promptForEnableLocationIfNeeded();
          console.log('enableResult', enableResult);
          if (enableResult == 'enabled' || enableResult == 'already-enabled') {
            requestLocationPermission();
          }
        } catch (error) {
          console.log('Error enabling location:', error);
          Toast.show({
            type: 'error',
            text1: 'please enable location services',
            timeout: 5000,
          });
        }
      }
    }

    handleCheckPressed();
    // requestLocationPermission();
    getStationList();
    // setTimeout(() => {
    //   requestLocationPermission;
    // }, 3000);
  }, []);

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const getStationList = async () => {
    try {
      const response = await axios.get(`${BASE_URL_LOCAL}/gas-stations-list`);
      // console.log('fetch StationList -------', response.data);
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

  const gas = useSelector(state => state.gasStation.gasStation);


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
