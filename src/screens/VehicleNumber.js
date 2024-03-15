import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import {BASE_URL_LOCAL} from '../config/Api';
import axios from 'axios';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addUserData} from '../components/redux/gasStationSlice';
import {useDispatch} from 'react-redux';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const VehicleNumber = ({navigation, route}) => {
  const {number, name, isCNG} = route.params;
  console.log(number, name, isCNG, 'VehicleNumber screen');
  const [loader, setLoader] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const dispatch = useDispatch();

  const handleUserRegister = async () => {
    Keyboard.dismiss();
    try {
      if (vehicleNumber.length < 4) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Vehicle Number',
        });
        return;
      }
      setLoader(true);
      const data = JSON.stringify({
        phone: number,
        name: name,
        isCNG: isCNG,
        vehicleNumber: vehicleNumber,
      });
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL_LOCAL}/sign-up`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      if (response.data.message === 'Sign-up successful.') {
        const jsonValue = JSON.stringify(response.data);
        await AsyncStorage.setItem('user-details', jsonValue);
        dispatch(addUserData(response.data));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'TempHome'}],
          }),
        );

        Toast.show({
          type: 'success',
          text1: 'Welcome',
          text2: 'Sign-up successful.',
        });
      } else if (response.data.message !== 'Sign-up successful.') {
        Toast.show({
          type: 'error',
          text1: response.data.message,
        });
      }
      setLoader(false);
    } catch (error) {
      console.log('get user name screen error => ', error);
      setLoader(false);
      Alert.alert('error', 'something wrong..!');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.child}>
          <Image
            source={require('../assets/images/Vehicle_type_Img.png')}
            style={{
              width: Width / 1.3,
              height: Width / 1.6,
              resizeMode: 'contain',
            }}
          />
          <Text style={styles.Txt_one}>Your vehicle number</Text>
          <TextInput
            placeholder="Enter vehicle number"
            placeholderTextColor={'#696969'}
            style={styles.Vehicle_Number}
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('TempHome');
              handleUserRegister();
            }}
            style={styles.continue}>
            <Text style={styles.continue_txt}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* loader */}
      {loader && (
        <View style={styles.loader_con}>
          <ActivityIndicator size={50} color={'#fff'} />
        </View>
      )}
    </>
  );
};

export default VehicleNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    paddingTop: Height / 20,
  },
  child: {
    flex: 0.7,
    // backgroundColor: '#05D49D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Txt_one: {
    color: '#525252',
    fontFamily: 'Rubik-Medium',
    textAlign: 'center',
    fontSize: 18,
  },
  Vehicle_Number: {
    borderWidth: 1,
    borderColor: '#525252',
    width: '90%',
    height: 40,
    padding: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#696969',
    fontFamily: 'Poppins-Regular',
    marginVertical: 20,
  },
  continue: {
    width: '90%',
    backgroundColor: '#602D90',
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  continue_txt: {
    fontFamily: 'Outfit-Medium',
    color: '#fff',
    fontSize: 18,
  },
  loader_con: {
    position: 'absolute',
    width: Width,
    height: Height,
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
  },
});
