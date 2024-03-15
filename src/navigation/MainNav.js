import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from '../splash/Splash';
import HomeScreen from '../screens/HomeScreen';
import Login from '../screens/Login';
import OtpVerification from '../screens/OtpVerification';
import LocationPermission from '../components/LocationPermission';
import VehicleType from '../screens/VehicleType';
import GasStationList from '../screens/GasStationList';
import GetUserName from '../screens/GetUserName';
import VehicleNumber from '../screens/VehicleNumber';
import TempHome from '../components/TempHome';
import DrawerNav from './DrawerNav';
import EditNumber from '../components/EditNumber';
import SearchList from '../screens/SearchList';
import EditName from '../components/EditName';
import EditVehicleNumber from '../components/EditVehicleNumber';
import PaidLibrary from '../components/Test/PaidLibrary';

const Stack = createNativeStackNavigator();
const MainNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OtpVerification" component={OtpVerification} />
        <Stack.Screen
          name="LocationPermission"
          component={LocationPermission}
        />
        <Stack.Screen name="VehicleType" component={VehicleType} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GasStationList" component={GasStationList} />

        <Stack.Screen name="GetUserName" component={GetUserName} />
        <Stack.Screen name="VehicleNumber" component={VehicleNumber} />
        <Stack.Screen name="TempHome" component={TempHome} />
        <Stack.Screen name="DrawerNav" component={DrawerNav} />
        <Stack.Screen name="EditNumber" component={EditNumber} />
        <Stack.Screen name="SearchList" component={SearchList} />
        <Stack.Screen name="EditName" component={EditName} />
        <Stack.Screen name="EditVehicleNumber" component={EditVehicleNumber} />
        <Stack.Screen name="PaidLibrary" component={PaidLibrary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNav;
