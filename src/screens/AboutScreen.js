import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const AboutScreen = ({navigation}) => {
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
          <Text style={styles.title}>About</Text>
        </View>
      </View>
      <View style={styles.parent}>
        <Image
          source={require('../assets/images/devIcon.png')}
          style={{width: 60, height: 60, resizeMode: 'contain'}}
        />
        <Text style={styles.txt_one}>Developed by</Text>
        <Text style={styles.txt_two}>Kotai Electronic Pvt. Ltd.</Text>
        <Text style={styles.txt_three}>
          Incase any support required reach to us at
        </Text>
        <Pressable style={styles.mail_btn}>
          <Text style={styles.mail_btn_txt}>sales@kotaielectronics.com</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AboutScreen;

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

  parent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt_one: {
    fontFamily: 'Poppins-Medium',
    color: '#323233',
  },
  txt_two: {
    fontFamily: 'Poppins-Medium',
    color: '#602D90',
    fontSize: 24,
  },
  txt_three: {
    fontFamily: 'Poppins-Medium',
    color: '#8C8C8E',
    fontSize: 12,
  },
  mail_btn: {
    backgroundColor: '#FB4B11',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 11
  },
  mail_btn_txt: {
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    fontSize: 13,
  },
});
