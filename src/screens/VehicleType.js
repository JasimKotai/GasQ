import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';

const Width = Dimensions.get('window').width;

const VehicleType = ({navigation, route}) => {
  const {number, name} = route.params;
  // console.log(number, name, 'VehicleType');
  const handleVehicleType = isCNG => {
    navigation.navigate('VehicleNumber', {
      name: name,
      number: number,
      isCNG: isCNG,
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.parent_one}>
        <Image
          source={require('../assets/images/Vehicle_type_Img.png')}
          style={{
            width: Width / 1.1,
            height: Width / 1.7,
            resizeMode: 'contain',
          }}
        />
        <View style={styles.child_one}>
          <Text style={styles.Txt_one}>Is your vehicle runs on CNG?</Text>
        </View>
      </View>
      <View style={styles.parent_two}>
        <View style={styles.child_two}>
          <TouchableOpacity
            onPress={() => {
              handleVehicleType(true);
            }}
            style={styles.button}>
            <Text style={styles.button_txt}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleVehicleType(false);
            }}
            style={styles.No}>
            <Text style={styles.No_txt}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VehicleType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  parent_one: {
    flex: 1,
    // backgroundColor: '#E20202',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parent_two: {
    flex: 1,
    // backgroundColor: '#0567B2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  child_one: {
    width: '90%',
    // backgroundColor: '#B205A4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Txt_one: {
    color: '#525252',
    fontFamily: 'Rubik-Medium',
    textAlign: 'center',
    fontSize: 18,
  },
  child_two: {
    // backgroundColor: 'red',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  button: {
    width: '90%',
    backgroundColor: '#602D90',
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_txt: {
    fontFamily: 'Outfit-Medium',
    color: '#fff',
    fontSize: 18,
  },
  No: {
    width: '90%',
    height: 45,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 5,
  },
  No_txt: {
    fontFamily: 'Outfit-Medium',
    color: '#000',
    fontSize: 18,
  },
});
