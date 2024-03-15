import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BASE_URL_LOCAL} from '../config/Api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {CommonActions} from '@react-navigation/native';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const GetUserName = ({navigation, route}) => {
  const {number} = route.params;
  // console.log('GetUserName screen =>', number);
  const [name, setName] = useState('');

  const handleUserRegister = async () => {
    Keyboard.dismiss();
    if (name.length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Invalid',
        text2: 'Type Full Name',
      });
      return;
    }
    navigation.navigate('VehicleType', {number: number, name: name});
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user-details');
        console.log(
          'AsyncStorage user-details => ',
          jsonValue != null ? JSON.parse(jsonValue) : null,
        );
      } catch (e) {
        // error reading value
      }
    };
    // getData();
  }, []);

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Welcome',
      text2: 'Sign-up successful.',
    });
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.parent_one}>
          <Image
            source={require('../assets/images/user_name_screen_img.png')}
            style={styles.img}
          />
          <Text style={styles.title}>What Is Your name?</Text>
        </View>
        <View style={styles.parent_two}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.KeyboardAvoiding_style}>
            <TextInput
              placeholder="Enter Full Name"
              placeholderTextColor={'#696969'}
              style={styles.enterName}
              value={name}
              onChangeText={setName}
            />
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('LocationPermission');
                handleUserRegister();
                // showToast();
              }}
              style={styles.submit}>
              <Text style={styles.submit_txt}>Continue</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </View>
    </>
  );
};

export default GetUserName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  parent_one: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#CF10C2',
  },
  title: {
    color: '#525252',
    fontSize: 20,
    fontFamily: 'Rubik-Bold',
  },
  img: {
    width: Width / 1.2,
    height: Width / 1.7,
    resizeMode: 'contain',
  },
  parent_two: {
    flex: 1,
  },
  enterName: {
    borderWidth: 1,
    borderColor: '#525252',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 45,
    padding: 0,
    paddingHorizontal: 10,
    color: '#525252',
    fontFamily: 'Poppins-Medium',
  },
  submit: {
    width: '90%',
    backgroundColor: '#602D90',
    borderRadius: 5,
    height: 45,
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'center',
  },
  submit_txt: {
    fontFamily: 'Outfit-Medium',
    color: '#fff',
    fontSize: 18,
  },
  KeyboardAvoiding_style: {
    // backgroundColor: 'red',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
