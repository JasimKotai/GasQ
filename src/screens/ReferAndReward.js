import {
  Alert,
  Dimensions,
  Image,
  NativeModules,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import BackgroundGeolocation from 'react-native-background-geolocation';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const ReferAndReward = ({navigation}) => {
  BackgroundGeolocation.getGeofences().then(geofences => {
    console.log('[getGeofences] ====> ', geofences);
  });

  const copyToClipboard = () => {
    Clipboard.setString('hello world');
  };
  const handleShare = async () => {
    try {
      Alert.alert('what should be share?');
      // await Share.share({
      //   message: 'sharing text',
      //   // You can also include other properties such as url:
      //   url: 'https://example.com',
      // });
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* header */}
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
          <Text style={styles.title}>Refer & Reward</Text>
        </View>
      </View>
      {/*  */}
      <View style={styles.parent}>
        {/* <Text style={styles.txt_one}>Refer yours friends and earn reward</Text> */}
        <Text style={styles.txt_one}>Invite your friends and get rewarded</Text>
        <Image
          source={require('../assets/images/giftbox.png')}
          style={{width: Width / 4, height: Width / 4, resizeMode: 'contain'}}
        />
        <View style={styles.child_one}>
          <Text style={styles.text_two}>
            Earn 10 points for every successful share, and accumulate 200 points
            to receive an incredible 100 rupees cashback on your next petrol/gas
            purchase. Boost your chances of winning with every new
            installation—collect points and enjoy the benefits of fueling up for
            free! Start sharing and saving today.
          </Text>
        </View>
        {/* coupon code */}
        <View style={styles.coupon_container}>
          <View style={styles.coupon_view}>
            <Text style={styles.coupon_txt}>FuelUpRewards2024</Text>
          </View>
          <TouchableOpacity
            onPress={() => copyToClipboard()}
            style={styles.copy_btn}>
            <Image
              source={require('../assets/images/copy.png')}
              style={{width: 20, height: 20}}
              tintColor={'#fff'}
            />
            <Text style={styles.copy_txt}>Copy</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 0.4}}>
        <Text style={styles.share_txt}>Share your refernal code via</Text>
        <View style={styles.shareBtn_con}>
          <TouchableOpacity
            onPress={() => {
              handleShare();
            }}>
            <Image
              source={require('../assets/images/facebook.png')}
              style={styles.share_icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleShare();
            }}>
            <Image
              source={require('../assets/images/whatsapp.png')}
              style={styles.share_icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleShare();
            }}>
            <Image
              source={require('../assets/images/instagram.png')}
              style={styles.share_icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleShare();
            }}>
            <Image
              source={require('../assets/images/twitter.png')}
              style={styles.share_icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReferAndReward;

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
    flex: 0.6,
    backgroundColor: '#602D90',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt_one: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
  },
  child_one: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    marginTop: 10,
  },
  text_two: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  coupon_container: {
    flexDirection: 'row',
    backgroundColor: '#2B084B',
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderStyle: 'dashed',
    // paddingHorizontal: 25,
    marginTop: 10,
  },
  coupon_view: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#fff',
    paddingRight: 20,
    paddingLeft: 10,
    paddingVertical: 8,
  },
  coupon_txt: {
    color: '#fff',
    fontFamily: 'Roboto-Medium',
  },
  copy_btn: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  copy_txt: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    marginLeft: 10,
  },
  share_txt: {
    color: '#525252',
    fontFamily: 'Rubik-Medium',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
  },
  shareBtn_con: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    // backgroundColor: 'red',
    justifyContent: 'space-around',
  },
  share_icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
