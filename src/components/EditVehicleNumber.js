import {

  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {BASE_URL_LOCAL} from '../config/Api';
import { addUserData } from './redux/gasStationSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const EditVehicleNumber = ({navigation, route}) => {
  const {user} = route.params;
  // console.log('-=-=-=', user);
  const [newVehicleNumber, setNewVehicleNumber] = useState('');
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const handleChangeVehicleNumber = async () => {
    try {
      if (newVehicleNumber.length < 4) {
        Toast.show({
          type: 'error',
          text1: 'invalid vehicle number!',
        });
        return;
      }
      let data = JSON.stringify({
        user_id: user.id,
        name: user.name,
        phone: user.phone,
        vehicleNumber: newVehicleNumber,
      });

      setLoader(true);
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL_LOCAL}/edit`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };
      const response = await axios.request(config);
      console.log('response =>', response.data);
      if (response.data) {
        dispatch(addUserData(response.data));
        const jsonValue = JSON.stringify(response.data);
        await AsyncStorage.setItem('user-details', jsonValue);
        Alert.alert('Success', 'updated successfully ');
        navigation.goBack();
      }
      setLoader(false);
    } catch (error) {
      console.log('handleChangeName Err', error);
      setLoader(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.header_child}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={styles.drawer_btn}>
              <Image
                source={require('../assets/images/back-arrow.png')}
                style={styles.drawer_icon}
                tintColor={'#525252'}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Change Vehicle Number</Text>
          </View>
        </View>

        <TextInput
          placeholder="Enter New Vehicle Number"
          placeholderTextColor={'#696969'}
          value={newVehicleNumber}
          onChangeText={setNewVehicleNumber}
          style={styles.newName_input}
          autoCapitalize="characters"
        />
        <TouchableOpacity
          onPress={() => {
            handleChangeVehicleNumber();
          }}
          style={styles.submit_btn}>
          <Text style={styles.submit_Txt}>Save</Text>
        </TouchableOpacity>
      </View>
      {/* loader */}
      {loader && (
        <View style={styles.loader_con}>
          <LottieView
            source={require('../components/lottie/lottie-loader7.json')}
            autoPlay
            loop
            style={{width: 60, height: 60}}
          />
        </View>
      )}
    </>
  );
};

export default EditVehicleNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    height: Height / 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  header_child: {
    flexDirection: 'row',
    // backgroundColor: '#000',
    alignItems: 'center',
  },
  drawer_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    // elevation: 1,
  },
  drawer_icon: {
    width: Width / 19,
    height: Width / 19,
    resizeMode: 'cover',
  },
  title: {
    color: '#525252',
    // fontFamily: 'Roboto-Medium',
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    marginLeft: 10,
  },

  newName_input: {
    padding: 6,
    paddingHorizontal: 10,
    color: '#404040',
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#fff',
    marginVertical: 40,
    marginHorizontal: 25,
    borderWidth: 1,
    borderColor: '#525252',
    borderRadius: 5,
  },
  submit_btn: {
    backgroundColor: '#602D90',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 25,
  },
  submit_Txt: {
    color: '#fff',
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
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
