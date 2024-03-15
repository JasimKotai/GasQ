import React, {useEffect, useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {Alert, Image, LogBox, StyleSheet, Text, View} from 'react-native';
import AboutScreen from '../screens/AboutScreen';
import ReferAndReward from '../screens/ReferAndReward';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {handleLogout} from '../components/redux/gasStationSlice';
import BackgroundGeolocation from 'react-native-background-geolocation';
LogBox.ignoreLogs(['new NativeEventEmitter']);

const Drawer = createDrawerNavigator();
const CustomDrawerContent = ({handleUserLogout, user, ...props}) => {
  // console.log('-----=>', user);
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Text style={styles.profileText}>
            Hey! {user ? user?.User_details?.name : 'user name'}
          </Text>
          <View style={styles.child_one}>
            <View style={{flex: 0.3}}>
              <View style={styles.star_con}>
                <Image
                  source={require('../assets/images/star_one.png')}
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.child_two}>
                <Text style={styles.One_Hun_txt}>100</Text>
                <Text style={styles.pointTxt}>Point</Text>
              </View>
            </View>

            <View style={styles.child_Three}>
              <Text style={styles.Txt_One}>
                Unlock exciting rewards with our new referral
              </Text>
            </View>
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerItem
        style={{
          marginHorizontal: 50,
          marginBottom: 0,
        }}
        label=""
        onPress={() => {
          Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel logout'),
                style: 'cancel',
              },
              {
                text: 'Logout',
                onPress: () => {
                  console.log('Logout success');
                  handleUserLogout();
                },
              },
            ],
            {cancelable: false},
          );
        }}
        icon={() => (
          <View style={[styles.logout_btn, {backgroundColor: '#FB4B11'}]}>
            <Text style={styles.logout_btn_Txt}>Logout account</Text>
          </View>
        )}
      />
      {/* <DrawerItem
        label=""
        style={{marginHorizontal: 50, marginTop: 0}}
        // onPress={handleDeleteAccount}
        icon={() => (
          <View style={[styles.logout_btn]}>
            <Text style={styles.delete_btn_Txt}>Delete account</Text>
          </View>
        )}
      /> */}
    </View>
  );
};

const DrawerNav = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const handleAsyncstorageClear = async () => {
    try {
      dispatch(handleLogout());
      BackgroundGeolocation.removeGeofences().then(success => {
        console.log('[removeGeofences] all geofences have been destroyed');
      });
      BackgroundGeolocation.stop();
      await AsyncStorage.clear();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
      Toast.show({
        type: 'error',
        text1: 'Logout Successful.!',
      });
    } catch (e) {
      console.log('logout async storage clear err', e);
    }
  };
  // const [user, setUser] = useState();
  const [user, setUser] = useState(useSelector(state => state.gasStation.user));
  // console.log('user drawer =>', user);
  // const userName = useSelector(state => state.gasStation.user);
  console.log('userName -==> ', user);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('----');
  //     const getUserData = async () => {
  //       try {
  //         const jsonValue = await AsyncStorage.getItem('user-details');
  //         if (jsonValue) {
  //           setUser(JSON.parse(jsonValue));
  //         }
  //       } catch (e) {
  //         console.log('profile screen async err =>', e);
  //       }
  //     };
  //     getUserData();
  //   }, []),
  // );
  return (
    <Drawer.Navigator
      drawerContent={props => (
        <CustomDrawerContent
          {...props}
          handleUserLogout={handleAsyncstorageClear}
          user={user}
        />
      )}
      initialRouteName="Home"
      screenOptions={{
        drawerType: 'slide',
        headerShown: false,
        drawerActiveBackgroundColor: '#F6F6F6',
        drawerActiveTintColor: '#525252',
        drawerStyle: {
          backgroundColor: '#ffffff',
        },
        // drawerHideStatusBarOnOpen: true,
      }}>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '',
          drawerIcon: ({color, size}) => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../assets/images/home.png')}
                style={styles.drawerIcon}
                tintColor={color}
              />
              <Text style={[styles.drawer_Txt, {color: color}]}>Home</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '',
          drawerIcon: ({color, size}) => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../assets/images/profile.png')}
                style={styles.drawerIcon}
                tintColor={color}
              />
              <Text style={[styles.drawer_Txt, {color: color}]}>Profile</Text>
            </View>
          ),
        }}
      />

      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: '',
          drawerIcon: ({color, size}) => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../assets/images/about.png')}
                style={[styles.drawerIcon, {resizeMode: 'cover'}]}
                tintColor={color}
              />
              <Text style={[styles.drawer_Txt, {color: color}]}>About</Text>
            </View>
          ),
        }}
      />

      <Drawer.Screen
        name="Refer & Reward"
        component={ReferAndReward}
        options={{
          title: '',
          drawerIcon: ({color, size}) => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../assets/images/refer.png')}
                style={styles.drawerIcon}
                tintColor={color}
              />
              <Text style={[styles.drawer_Txt, {color: color}]}>
                Refer & Reward
              </Text>
            </View>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNav;

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#602D90',
    marginBottom: 20,
  },
  profileImage: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginRight: 10,
  },
  profileText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Rubik-Medium',
  },
  One_Hun_txt: {
    color: '#FFA218',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  pointTxt: {
    color: '#525252',
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
  },
  drawerIcon: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
  },
  drawer_Txt: {
    color: '#404040',
    // fontFamily: 'Roboto-Bold',
    // fontFamily: 'RobotoMono-Medium',
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
    marginLeft: 10,
  },
  // custom style
  child_one: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  star_con: {
    position: 'absolute',
    zIndex: 1,
    top: -12,
    left: -12,
  },
  child_two: {
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  child_Three: {
    flex: 0.7,
    // backgroundColor: 'blue',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  Txt_One: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
  },
  logout_btn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    // backgroundColor: '#f2f2f2',
  },
  logout_btn_Txt: {
    color: '#fff',
    fontFamily: 'Outfit-SemiBold',
    fontSize: 15,
  },
  delete_btn_Txt: {
    color: '#646463',
    fontFamily: 'Outfit-SemiBold',
    fontSize: 15,
  },
});
