import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const ProfileScreen = ({navigation}) => {
  const [user, setUser] = useState();
  // console.log('user ProfileScreen =>', user);
  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('user-details');
          if (jsonValue != null) {
            setUser(JSON.parse(jsonValue));
          }
        } catch (e) {
          console.log('profile screen async err =>', e);
        }
      };
      getUserData();
    }, []),
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header_child}>
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
          <Text style={styles.title}>Profile</Text>
        </View>
      </View>
      {/* user name  */}
      <View style={styles.phoneNum_con}>
        <View style={{flex: 0.9}}>
          <Text style={styles.number_txt}>Name</Text>
          <Text style={styles.number_txt_two}>
            {user ? user?.User_details?.name : 'user name'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              '',
              'Do you want to change current name?',
              [
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () =>
                    navigation.navigate('EditName', {
                      user: user?.User_details,
                    }),
                },
              ],
              {cancelable: false},
            );
          }}
          style={styles.edit_btn}>
          <Image
            source={require('../assets/images/edit.png')}
            style={{width: 25, height: 25, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </View>
      {/* phone number */}
      <View style={styles.phoneNum_con}>
        <View style={{flex: 0.9}}>
          <Text style={styles.number_txt}>Phone number</Text>
          <Text style={styles.number_txt_two}>
            +91 {user ? user.User_details.phone : '123456789'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              '',
              'Do you want to use a new phone number?',
              [
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () =>
                    navigation.navigate('EditNumber', {
                      user: user?.User_details,
                    }),
                },
              ],
              {cancelable: false},
            );
          }}
          style={styles.edit_btn}>
          <Image
            source={require('../assets/images/edit.png')}
            style={{width: 25, height: 25, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </View>
      {/* vehicle number */}
      <View style={styles.phoneNum_con}>
        <View style={{flex: 0.9}}>
          <Text style={styles.number_txt}>Vehicle number</Text>
          <Text style={styles.number_txt_two}>
            {user ? user.User_details.vehicleLicense : 'wb 11 wb0000'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              '',
              'Do you want to use a new vehicle number?',
              [
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () =>
                    navigation.navigate('EditVehicleNumber', {
                      user: user?.User_details,
                    }),
                },
              ],
              {cancelable: false},
            );
          }}
          style={styles.edit_btn}>
          <Image
            source={require('../assets/images/edit.png')}
            style={{width: 25, height: 25, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

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
    elevation: 1,
  },
  drawer_icon: {
    width: Width / 18,
    height: Width / 18,
    resizeMode: 'contain',
  },
  title: {
    color: '#525252',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    marginLeft: 10,
  },
  phoneNum_con: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingLeft: 25,
    // backgroundColor: 'red',
    flexDirection: 'row',
  },
  number_txt: {
    color: '#3B3B3B',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  number_txt_two: {
    color: '#525252',
    // fontFamily: 'Roboto-Medium',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  edit_btn: {
    flex: 0.1,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
