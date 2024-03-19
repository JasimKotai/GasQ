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
import {addUserData} from './redux/gasStationSlice';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const EditName = ({navigation, route}) => {

  const {user} = route.params;
  // console.log(' EditName =>', user);
  const [newName, setNewName] = useState('');
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const handleChangeName = async () => {
    try {
      if (newName.length < 3) {
        Toast.show({
          type: 'error',
          text1: 'invalid name!',
        });
        return;
      }
      setLoader(true);
      let data = JSON.stringify({
        user_id: user.id,
        name: newName,
        phone: user.phone,
        vehicleNumber: user.vehicleLicense,
      });

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
      console.log('name change response =>', response.data);
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
            <Text style={styles.title}>Edit Name</Text>
          </View>
        </View>
        <TextInput
          placeholder="Enter Full Name"
          placeholderTextColor={'#696969'}
          value={newName}
          onChangeText={setNewName}
          style={styles.newName_input}
        />
        <TouchableOpacity
          onPress={() => {
            handleChangeName();
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

export default EditName;

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
    fontSize: 13,
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
