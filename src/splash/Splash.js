import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {
  addGasStationList,
  addUserData,
} from '../components/redux/gasStationSlice';

const windowWidth = Dimensions.get('window').width;

const Splash = ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user-details');
        // console.log(jsonValue != null ? JSON.parse(jsonValue) : null);
        const userData = JSON.parse(jsonValue);
        const jsonValue2 = await AsyncStorage.getItem('Gas-Stations');
        if (jsonValue != null) {
          navigation.replace('TempHome');
          dispatch(addUserData(userData));
          dispatch(addGasStationList(JSON.parse(jsonValue2)));
        } else {
          navigation.replace('Login');
        }
      } catch (e) {
        // error reading value
        console.log('splash scren async err =>', e);
      }
    };

    const intervalId = setInterval(getData, 3000);
    // Clean up function for interval setup
    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <View style={styles.container}>
        <View style={styles.child}>
          <Image
            source={require('../assets/images/splash_img.png')}
            style={styles.img}
          />
          {/* <Text style={styles.Txt_one}>Rapid</Text> */}
          {/* <Text style={styles.Txt_Two}>Queue</Text> */}
          {/* <Text style={styles.Txt_one}>Pro</Text> */}
        </View>
      </View>
    </>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  child: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Txt_one: {
    color: '#602D90',
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24,
  },
  Txt_Two: {
    color: '#F5B200',
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24,
  },
  img: {
    width: windowWidth / 2,
    height: windowWidth / 2.5,
    resizeMode: 'contain',
  },
});
