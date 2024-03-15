import {View, Text, Button, StyleSheet} from 'react-native';
import React from 'react';

const GeofenceTest = () => {
  const geolib = require('geolib');

  const locations = [
    {
      id: 1,
      latitude: 22.5724435,
      longitude: 88.4365528,
      name: 'office location',
    },
    {id: 2, latitude: 22.5372, longitude: 88.3231, name: 'Location 2'},
    {id: 2, latitude: 22.5372, longitude: 88.3231, name: 'Location 3'},
  ];

  // const checkUserLocation = (userLatitude, userLongitude) => {
  //   const radius = 100; // in meters

  //   for (const location of locations) {
  //     const distance = geolib.getDistance(
  //       {latitude: userLatitude, longitude: userLongitude},
  //       {latitude: location.latitude, longitude: location.longitude},
  //     );

  //     if (distance <= radius) {
  //       console.log(`You are at ${location.name}`);
  //     } else {
  //       console.log('Else Where');
  //     }
  //   }
  // };

  const checkUserLocation = (userLatitude, userLongitude) => {
    const radius = 100; // in meters

    const nearbyLocation = locations.find(location => {
      const distance = geolib.getDistance(
        {latitude: userLatitude, longitude: userLongitude},
        {latitude: location.latitude, longitude: location.longitude},
      );

      return distance <= radius;
    });

    if (nearbyLocation) {
      console.log(`You are at ${nearbyLocation.name}`);
    } else {
      console.log('Else Where');
    }
  };

  const userLatitude = 22.5724435;
  const userLongitude = 88.4365528;

  return (
    <View style={styles.container}>
      <Text style={styles.Txt}>GeofenceTest</Text>
      <Button
        title="check"
        onPress={() => {
          checkUserLocation(userLatitude, userLongitude);
        }}
      />
    </View>
  );
};

export default GeofenceTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Txt: {
    color: 'blue',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
});
