import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import ViewShot, {captureRef} from 'react-native-view-shot';
import Share from 'react-native-share';
import {BASE_URL_LOCAL} from '../config/Api';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const SearchList = ({navigation, route}) => {
  const {searchedData, searchName, searchID} = route.params;
  // console.log(
  //   'routes =>',
  //   searchedData,
  //   'searchName --->',
  //   searchName,
  //   'searchID------>',
  //   searchID,
  // );
  const userData = useSelector(state => state.gasStation.user);

  const [bookmarkedIndices, setBookmarkedIndices] = useState([]);
  const [loader, setLoader] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [search, setSearch] = useState('');
  console.log(search);
  const [data, setData] = useState(searchedData?.gasStations);

  const toggleBookmark = index => {
    const isBookmarked = bookmarkedIndices.includes(index);

    if (isBookmarked) {
      const updatedBookmarkedIndices = bookmarkedIndices.filter(
        i => i !== index,
      );
      setBookmarkedIndices(updatedBookmarkedIndices);
    } else {
      setBookmarkedIndices([...bookmarkedIndices, index]);
    }
  };

  const isBookmarked = index => {
    return bookmarkedIndices.includes(index);
  };

  const handleOpenMaps = (lat, long) => {
    const destinationLatitude = lat;
    const destinationLongitude = long;
    console.log(destinationLatitude, destinationLongitude);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLatitude},${destinationLongitude}`;
    Linking.openURL(url).catch(err =>
      console.error('Error opening Google Maps:', err),
    );
  };

  const handleRefresh = async () => {
    try {
      setLoader(true);
      let refreshData = JSON.stringify({
        gas_station_id: searchID ? searchID : null,
        search: searchName ? searchName : null,
      });
      // console.log('refreshData  -----', refreshData);
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL_LOCAL}/gas-stations-search`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: refreshData,
      };
      const response = await axios.request(config);
      // console.log('response -->:', response.data);
      if (response.data) {
        setData(response.data.gasStations);
      }
      setLoader(false);
    } catch (error) {
      console.log('handleCalloutMarker err :', error);
      setLoader(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoader(true);
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL_LOCAL}/gas-stations-search`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {search: search},
      };
      const response = await axios.request(config);
      console.log('response -->:', response.data);
      if (response.data) {
        setData(response.data.gasStations);
      }
      setLoader(false);
    } catch (error) {
      console.log('handleCalloutMarker err :', error);
      setLoader(false);
    }
  };

  const flatListRefs = useRef([]);

  const captureListScreenshot = async index => {
    try {
      const uri = await captureRef(flatListRefs.current[index], {
        format: 'jpg', // or 'png'
        quality: 0.8, // Image quality (from 0 to 1)
      });
      console.log('Screenshot URI:', uri);
      setScreenshot(uri);
      if (uri) {
        shareScreenshot(uri);
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };
  const shareScreenshot = async uri => {
    try {
      const options = {
        url: uri,
      };
      await Share.open(options);
    } catch (error) {
      console.log('Error sharing screenshot:', error);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.search_bar_con}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.back_btn}>
            <Image
              source={require('../assets/images/back-arrow.png')}
              style={{width: 20, height: 15, resizeMode: 'contain'}}
              tintColor={'#525252BC'}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* <Image
            source={require('../assets/images/search.png')}
            style={{width: 22, height: 22}}
            tintColor={'#666'}
          /> */}
            <TextInput
              placeholder="search gas station"
              placeholderTextColor={'#666'}
              style={styles.search_bar}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={() => {
                handleSearch();
              }}
            />
          </View>
        </View>
        <View style={styles.FlatList_Con}>
          <FlatList
            // ref={flatListRef}
            // data={data == null ? searchedData.searchedData.data : data}
            data={data}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <ViewShot
                  ref={ref => (flatListRefs.current[index] = ref)}
                  style={{backgroundColor: '#F6F6F6'}}>
                  <View style={styles.flat_parent}>
                    <View style={styles.left_color} />
                    <View style={styles.right_container}>
                      <View style={styles.flat_titleView}>
                        <Text style={styles.gasStation_name}>
                          {item.gas_station_name}
                        </Text>
                        {/* <TouchableOpacity
                      onPress={() => {
                        toggleBookmark(index);
                      }}
                      style={{padding: 5}}>
                      <Image
                        source={
                          isBookmarked(index)
                            ? require('../assets/images/save.png')
                            : require('../assets/images/saved.png')
                        }
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: 'contain',
                        }}
                        tintColor={'#666'}
                      />
                    </TouchableOpacity> */}
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flex: 0.08}}>
                          <Image
                            source={require('../assets/images/location.png')}
                            style={{
                              width: 16,
                              height: 16,
                              resizeMode: 'contain',
                            }}
                            tintColor={'#525252'}
                          />
                        </View>
                        <View style={{flex: 1}}>
                          <Text style={styles.station_address}>
                            {item.gas_station_address}
                          </Text>
                        </View>
                      </View>

                      {/* time and queue */}
                      <View
                        style={{
                          flexDirection: 'row',
                          marginVertical: 10,
                          alignItems: 'center',
                        }}>
                        <View>
                          <View style={styles.waitingTime_con}>
                            <Image
                              source={require('../assets/images/clock.png')}
                              style={{width: 16, height: 16}}
                              tintColor={'#FB4B11'}
                            />
                            <Text style={styles.txt_one}>
                              {item.avg_waiting_time} min
                            </Text>
                          </View>
                          <Text style={styles.avarage_Txt}>
                            avarage wating time
                          </Text>
                        </View>
                        <View>
                          <View style={styles.waitingQue_con}>
                            <Image
                              source={require('../assets/images/car.png')}
                              style={{width: 16, height: 16}}
                              tintColor={'#03A50A'}
                            />
                            <Text style={styles.txt_two}>
                              {item.vehicle_count} car
                            </Text>
                          </View>
                          <Text style={styles.avarage_Txt}>in queue</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            captureListScreenshot(index);
                          }}
                          style={styles.share_btn}>
                          <Image
                            source={require('../assets/images/share.png')}
                            style={{
                              width: 17,
                              height: 17,
                              resizeMode: 'contain',
                            }}
                            tintColor={'#602D90'}
                          />
                        </TouchableOpacity>
                      </View>
                      {/* horizontal line */}
                      <View style={styles.horizontal_line} />
                      {/* refresh and get direction buttons */}
                      <View
                        style={{
                          flexDirection: 'row',
                          marginVertical: 10,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            handleRefresh();
                          }}
                          style={styles.refresh_btn}>
                          <Image
                            source={require('../assets/images/refresh.png')}
                            style={{width: 17, height: 17}}
                            tintColor={'#525252'}
                          />
                          <Text
                            style={{
                              color: '#525252',
                              fontFamily: 'Poppins-Regular',
                              fontSize: 10,
                              marginLeft: 5,
                            }}>
                            Refresh
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            const lat = item.gas_station_latitude;
                            const long = item.gas_station_longitude;
                            handleOpenMaps(lat, long);
                            // console.log(lat, long);
                          }}
                          style={styles.getDirection_btn}>
                          <Text
                            style={{
                              color: '#fff',
                              fontFamily: 'Poppins-Regular',
                              fontSize: 10,
                            }}>
                            get direction
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ViewShot>
              );
            }}
            key={index => index}
          />
        </View>
      </View>

      {/* loader */}
      {loader && (
        <View style={styles.loader_con}>
          <LottieView
            source={require('../components/lottie/lottie-loader7.json')}
            style={{width: 60, height: 60}}
            autoPlay
            loop
          />
        </View>
      )}
    </>
  );
};

export default SearchList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ff0000',
    // backgroundColor: '#602D90',
    backgroundColor: '#F6F6F6',
  },
  back_btn: {
    // backgroundColor: '#602D90',
    backgroundColor: '#f2f2f2',
    paddingVertical: 9,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  search_bar_con: {
    marginTop: 40,
    // backgroundColor: '#602D90',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingLeft: 5,
    borderWidth: 2,
    borderColor: '#D2D2D2',
    elevation: 5,
    shadowColor: 'silver',
  },
  search_bar: {
    color: '#404040',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    padding: 6,
    borderRadius: 10,
    flex: 1,
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
  },
  FlatList_Con: {
    paddingHorizontal: 6,
    paddingVertical: 10,
    // borderWidth: 1,
    flex: 1,
  },
  flat_parent: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    margin: 5,
    marginBottom: 15,
  },
  left_color: {
    backgroundColor: 'orange',
    flex: 0.04,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    elevation: 5,
  },
  right_container: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
  },
  flat_titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gasStation_name: {
    color: '#525252',
    fontFamily: 'Rubik-Medium',
    fontSize: 15,
  },
  station_address: {
    color: '#525252',
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
  },
  waitingTime_con: {
    backgroundColor: '#FFCFBF',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#FF845B',
    borderRadius: 20,
    padding: 3,
    paddingHorizontal: 10,
    elevation: 5,
    alignItems: 'center',
  },
  waitingQue_con: {
    backgroundColor: '#B3FFB6',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#06D90F',
    borderRadius: 20,
    padding: 3,
    paddingHorizontal: 10,
    elevation: 5,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  txt_one: {
    color: '#FB4B11',
    fontFamily: 'Roboto-Bold',
    marginLeft: 5,
  },
  txt_two: {
    color: '#03A50A',
    fontFamily: 'Roboto-Bold',
    marginLeft: 5,
  },
  avarage_Txt: {
    color: '#7A7777',
    fontFamily: 'Poppins-Medium',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 5,
  },
  share_btn: {
    padding: 5,
    alignSelf: 'flex-start',
  },
  horizontal_line: {
    height: 2,
    flex: 1,
    backgroundColor: '#CACACC',
  },
  refresh_btn: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#A5A3A3',
    flex: 0.457,
    padding: 6,
    borderRadius: 5,
    justifyContent: 'center',
  },
  getDirection_btn: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#A5A3A3',
    flex: 0.457,
    padding: 6,
    borderRadius: 5,
    backgroundColor: '#602D90',
    justifyContent: 'center',
  },

  loader_con: {
    position: 'absolute',
    width: Width,
    height: Height,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    zIndex: 1,
  },
});
