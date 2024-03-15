import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {BASE_URL_LOCAL} from '../config/Api';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const Login = ({navigation}) => {
  const [number, setNumber] = useState('');
  const [loader, setLoader] = useState(false);
  const images = [
    {
      id: 1,
      title: 'No More Waiting in Line',
      image: require('../assets/images/sliderImage_one.png'),
    },
    {
      id: 2,
      title: 'Real-Time Updates',
      image: require('../assets/images/sliderImage_two.png'),
    },
    {
      id: 3,
      title: 'Save Your Time',
      image: require('../assets/images/sliderImage_three.png'),
    },
  ];

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // console.log(currentIndex);

  useEffect(() => {
    // console.log('render --');
    const interval = setInterval(() => {
      if (currentIndex === images.length - 1) {
        flatListRef.current.scrollToIndex({
          animated: true,
          index: 0,
        });
        // setCurrentIndex(currentIndex + 1);
      } else {
        flatListRef.current.scrollToIndex({
          animated: true,
          index: currentIndex + 1,
        });
        setCurrentIndex(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const scrollX = useRef(new Animated.Value(0)).current;
  const viewableItemChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewconfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const handleUserLogin = async () => {
    try {
      if (number.length < 10) {
        // Alert.alert('warning!', 'number can not be less then 10 digits ');
        Toast.show({
          type: 'info',
          text1: 'invalid!',
          text2: 'number can not be less then 10 digits',
        });
        return;
      }
      const data = JSON.stringify({
        phone: number,
      });
      setLoader(true);
      Keyboard.dismiss();
      console.log(data);
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
      console.log('response =>', response.data.user_id.phone);
      if (response.data) {
        navigation.navigate('OtpVerification', {
          otp: response.data.otp,
          number: response.data.user_id.phone,
        });
      }
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
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <View style={styles.container}>
        <View style={styles.child_One}>
          <View>
            <Image
              source={require('../assets/images/Login_Img.png')}
              style={styles.background_Image}
            />
          </View>
          <View style={styles.slider_container}>
            <FlatList
              ref={flatListRef}
              data={images}
              onMomentumScrollEnd={event => {
                const newIndex = Math.round(
                  event.nativeEvent.contentOffset.x /
                    Dimensions.get('window').width,
                );
                setCurrentIndex(newIndex);
              }}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.FlatList_Con}>
                    <View>
                      <Image source={item.image} style={styles.slider_Img} />
                    </View>
                    <Text style={styles.slider_title}>{item.title}</Text>
                  </View>
                );
              }}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              bounces={false}
              keyExtractor={item => item.id}
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                {
                  useNativeDriver: false,
                },
              )}
              scrollEventThrottle={32}
              onViewableItemsChanged={viewableItemChanged}
              viewabilityConfig={viewconfig}
            />
            <View style={styles.indicator_con}>
              {images.map((_, index) => {
                const inputRange = [
                  (index - 1) * Width,
                  index * Width,
                  (index + 1) * Width,
                ];
                const dotWidth = scrollX.interpolate({
                  inputRange,
                  outputRange: [15, 30, 15],
                  extrapolate: 'clamp',
                });
                const dotWidthTwo = scrollX.interpolate({
                  inputRange,
                  outputRange: ['#fff', '#602D90', '#fff'],
                  extrapolate: 'clamp',
                });
                return (
                  <Animated.View
                    key={index} // Use a unique key, such as the index
                    style={[
                      styles.indicator,
                      {
                        width: dotWidth,
                        backgroundColor: dotWidthTwo,
                      },
                    ]}
                  />
                );
              })}
            </View>
            {/* {images.map((_, index) => (
                <View
                  key={index} // Use a unique key, such as the index
                  style={[
                    styles.indicator,
                    {
                      width: currentIndex === index ? 40 : 20,
                      backgroundColor:
                        currentIndex === index ? '#602D90' : '#fff',
                    },
                  ]}
                />
              ))}
            </View> */}
          </View>
        </View>
        <Text style={styles.Welcome_back}>Welcome back!</Text>
        <View style={styles.container_two}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.input_container}>
              <View style={styles.left_one}>
                <Image
                  source={require('../assets/images/india.png')}
                  style={{width: 18, height: 18}}
                />
                <Text style={styles.country_code}>+91</Text>
              </View>
              <TextInput
                placeholder="Enter Phone Number"
                placeholderTextColor={'#696969'}
                style={styles.user_num}
                value={number}
                onChangeText={setNumber}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
            {/* <TextInput
            placeholder="Enter Full Name"
            placeholderTextColor={'#696969'}
            style={styles.user_name}
          /> */}
          </KeyboardAvoidingView>
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('OtpVerification');
              handleUserLogin();
            }}
            style={styles.submit_btn}>
            <Text style={styles.submit_Txt}>Submit</Text>
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

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  child_One: {
    height: Height / 2.4,
    width: Width,
    paddingBottom: 5,
    // backgroundColor: '#460CE6',
  },
  background_Image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  slider_container: {
    position: 'absolute',
    width: Width,
    height: '95%',
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'green',
  },
  FlatList_Con: {
    width: Width,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#000',
  },
  slider_Img: {
    width: Width / 1.5,
    height: Width / 2.5,
    resizeMode: 'stretch',
    marginTop: 20,
  },
  slider_title: {
    color: '#602D90',
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    marginTop: 20,
  },
  indicator_con: {
    position: 'absolute',
    // backgroundColor: '#ff0000',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    bottom: 5,
    left: 0,
    right: 0,
    // padding: 10,
  },
  indicator: {
    width: 20,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 5,
  },

  Welcome_back: {
    color: '#602D90',
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 20,
  },
  container_two: {
    flex: 1,
    // backgroundColor: '#E60C0C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input_container: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#525252',
    flexDirection: 'row',
    borderRadius: 5,
    paddingVertical: 3,
    backgroundColor: '#fff',
    width: '90%',
    height: 45,
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
  },
  // user_name: {
  //   padding: 0,
  //   height: 40,
  //   marginHorizontal: 20,
  //   borderWidth: 1,
  //   borderColor: '#525252',
  //   color: '#404040',
  //   fontFamily: 'Poppins-Regular',
  //   marginVertical: 20,
  //   borderRadius: 5,
  //   paddingHorizontal: 15,
  //   backgroundColor: '#fff',
  // },
  submit_btn: {
    marginHorizontal: 15,
    backgroundColor: '#602D90',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 30,
    borderRadius: 5,
    width: '90%',
  },
  submit_Txt: {
    color: '#fff',
    fontFamily: 'Outfit-SemiBold',
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
