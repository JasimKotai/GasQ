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

const LocationPermission = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.parent_one}>
        <Image
          source={require('../assets/images/Location_Per_Img.png')}
          style={{
            width: Width / 1.1,
            height: Width / 1.7,
            resizeMode: 'contain',
          }}
        />
        <View style={styles.child_one}>
          <Text style={styles.Txt_one}>
            We need your location to provide you with personalized content and
            enhance your experience
          </Text>
        </View>
      </View>
      <View style={styles.parent_two}>
        <View style={styles.child_two}>
          <TouchableOpacity
            onPress={() => navigation.navigate('VehicleType')}
            style={styles.button}>
            <Text style={styles.button_txt}>Enable Location Access</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('VehicleType')}
            style={styles.skip}>
            <Text style={styles.skip_txt}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LocationPermission;

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
    fontFamily: 'Outfit-SemiBold',
    color: '#fff',
    fontSize: 18,
  },
  skip: {
    width: '90%',
    height: 45,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 5,
  },
  skip_txt: {
    fontFamily: 'Outfit-SemiBold',
    color: '#000',
    fontSize: 18,
  },
});
