import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import axios from 'axios';
import {BASE_URL_LOCAL} from '../config/Api';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addUserData} from '../components/redux/gasStationSlice';
import {useDispatch} from 'react-redux';

const CELL_COUNT = 4;
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const OtpVerification = ({navigation, route}) => {
  const {otp, number} = route.params;
  console.log('otp =>', otp, number);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(60);
  console.log(timer);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState('');
  // console.log('---', value, '---');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (isTimerRunning) {
      const intervalId = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer === 1) {
            clearInterval(intervalId);
            setIsTimerRunning(false);
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isTimerRunning]);

  const handleOTPVerification = async () => {
    try {
      if (value.length < 4) {
        Toast.show({
          type: 'error',
          text1: 'warning',
          text2: 'OTP must be four digits',
        });
        return;
      }
      setLoader(true);
      const data = JSON.stringify({
        phone: number,
        otp: value,
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL_LOCAL}/verify-otp`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      if (response.data.message === 'New User') {
        navigation.replace('GetUserName', {number: response.data.phone});
      } else if (response.data.message === 'Already User') {
        const jsonValue = JSON.stringify(response.data);
        dispatch(addUserData(response.data));
        await AsyncStorage.setItem('user-details', jsonValue);
        navigation.replace('TempHome');
      } else if (response.data.message === 'Invalid OTP.') {
        Toast.show({
          type: 'error',
          text1: response.data.message,
        });
      }
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
      Alert.alert('error', 'something wrong..!');
    }
  };

  const handleResendOTP = async () => {
    setTimer(30);
    setIsTimerRunning(true);
    try {
      const data = JSON.stringify({
        phone: number,
      });
      setLoader(true);

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL_LOCAL}/login`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log('response =>', response.data);
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
      Toast.show({
        type: 'error',
        text1: 'error',
        text2: 'something wrong..!',
      });
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.parent_One}>
          <Text style={styles.Txt_One}>OTP VERIFICATION</Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={styles.Txt_Two}>Enter the OTP sent to</Text>
            <Text style={styles.Txt_Three}> - {number ? number : 'null'}</Text>
          </View>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <View style={styles.child_one}>
            <Text>00:{timer} Sec</Text>
          </View>
          <View style={styles.child_Two}>
            <Text style={styles.Txt_Four}>Don't receive code ? </Text>
            <TouchableOpacity
              disabled={isTimerRunning}
              onPress={() => {
                handleResendOTP();
              }}>
              <Text
                style={[
                  styles.resend_Txt,
                  {color: timer == 0 ? '#602D90' : '#383737'},
                ]}>
                Re-send
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.btn_container}>
          <TouchableOpacity
            onPress={() => {
              // navigation.replace('GetUserName');
              handleOTPVerification();
            }}
            style={styles.Verify_btn}>
            <Text style={styles.Verify_txt}>Verify</Text>
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

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  parent_One: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue',
  },
  Txt_One: {
    color: '#000',
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
  },
  Txt_Two: {
    color: '#4E4D4D',
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
  },
  Txt_Three: {
    color: '#000',
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
  },
  // CodeField style
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    // borderColor: '#00000030',
    borderColor: '#f2f2f2',
    textAlign: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#F6F6F6',
    elevation: 5,
  },
  focusCell: {
    // borderColor: '#000',
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },

  child_one: {
    paddingVertical: 15,
    paddingTop: 20,
  },
  child_Two: {
    flexDirection: 'row',
  },
  Txt_Four: {
    color: '#5A5A5A',
    fontFamily: 'Outfit-Regular',
  },
  resend_Txt: {
    color: '#383737',
    fontFamily: 'Outfit-SemiBold',
  },
  btn_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  Verify_btn: {
    backgroundColor: '#602D90',
    width: '85%',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Verify_txt: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
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
