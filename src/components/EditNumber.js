import {
  ActivityIndicator,
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
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {BASE_URL_LOCAL} from '../config/Api';
import {useDispatch} from 'react-redux';
import {addUserData} from './redux/gasStationSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const EditNumber = ({navigation, route}) => {
  const {user} = route.params;
  // console.log('---------------------------', user);
  const [newNumber, setNewNumber] = useState('');
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const handleChangeNumber = async () => {
    try {
      if (newNumber.length < 10) {
        Toast.show({
          type: 'error',
          text1: 'invalid number!',
        });
        return;
      }
      let data = JSON.stringify({
        user_id: user.id,
        name: user.name,
        phone: newNumber,
        vehicleNumber: user.vehicleLicense,
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
            <Text style={styles.title}>change number</Text>
          </View>
        </View>

        <View style={styles.child_one}>
          <Text style={styles.Txt_one}>
            Your account and data will be linked to the new number
          </Text>
        </View>

        <View style={styles.input_container}>
          <View style={styles.left_one}>
            <Image
              source={require('../assets/images/india.png')}
              style={{width: 18, height: 18}}
            />
            <Text style={styles.country_code}>+91</Text>
          </View>
          <TextInput
            placeholder="Enter New Number"
            placeholderTextColor={'#696969'}
            style={styles.user_num}
            value={newNumber}
            onChangeText={setNewNumber}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            handleChangeNumber();
          }}
          style={styles.submit_btn}>
          <Text style={styles.submit_Txt}>Save</Text>
        </TouchableOpacity>
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

export default EditNumber;

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

  child_one: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  Txt_one: {
    color: '#525252',
    fontFamily: 'Poppins-Medium',
  },
  input_container: {
    borderWidth: 1,
    borderColor: '#525252',
    flexDirection: 'row',
    borderRadius: 5,
    paddingVertical: 3,
    backgroundColor: '#fff',
    height: 45,
    marginTop: 20,
    marginHorizontal: 25,
  },
  left_one: {
    // backgroundColor: '#ff0',
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRightWidth: 1,
    borderRightColor: '#525252',
    flexDirection: 'row',
  },
  country_code: {
    color: '#404040',
    fontFamily: 'Rubik-Regular',
  },
  user_num: {
    // height: 38,
    padding: 0,
    paddingHorizontal: 10,
    flex: 0.8,
    color: '#404040',
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#fff',
    fontSize: 13,
  },
  submit_btn: {
    backgroundColor: '#602D90',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 30,
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
