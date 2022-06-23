import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform,TouchableOpacity } from 'react-native';

import LoyaltyScreen from '../screens/auth/loyaltyScreen'
import AuthScreen, {navigationOptions as authScreenOption} from '../screens/auth/AuthScreen';
import DetailsFillingScreen from '../screens/auth/DetailsFillingScreen';
import EmailVareficationScreen from '../screens/auth/EmailVareficationScreen';
import NotificationScreen from '../screens/mainApp/notificationScreen';
import Colors from '../constants/Colors';
import driverScreen from '../screens/mainApp/driverScreen';
import DriveScreenIfFound from '../screens/mainApp/DriveScreenIfFound';
import DriveScreenIfUpcoming from '../screens/mainApp/DriveScreenIfUpcoming';
import PassengerScreen from '../screens/mainApp/passengerScreen';
import foundedDrivesScreen from '../screens/mainApp/foundedDrivesScreen';
import { Ionicons } from '@expo/vector-icons';


const defaultNavOptions = {
  headerStyle: {
    backgroundColor: 'white',
  },
  headerTitleStyle: {
    fontFamily: "fontawesome-webfont",
    fontWeight: 'bold',
    // letterSpacing: 1,
  },
  headerBackTitleStyle: {
    fontFamily: "fontawesome-webfont",
  },
  headerTintColor: Colors.primary,
  headerTitleAlign: 'center',
  
}

const appTabNavigator = createBottomTabNavigator();
const mainNavigator = createStackNavigator();

const Driver_passanger_navigator = ({navigation}) => {
  return <appTabNavigator.Navigator screenOptions={ { headerStyle: {
    // Color: "#FF8C00",
    // backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
    backgroundColor: '#f7e8df',
    height: 70,
    
    // letterSpacing: 1,
  },
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontFamily: "fontawesome-webfont",
    fontWeight: 'bold',
  },
  headerBackTitleStyle: {
    fontFamily: "fontawesome-webfont",
  },
  headerTintColor: 
  // Platform.OS === 'android' ? '#00a46c' : Colors.primary,
  Platform.OS === 'android' ? Colors.primary : '',
  // "#FF8C00",
  // "#c71585",
  tabBarStyle:{
    height:60,
  },
  tabBarHideOnKeyboard:true,
  // tabBarStyle: {
  //   backgroundColor: '#ffe3ff',
    
  // },
  
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.navigate('Loyalty')}>
      {/* <Ionicons name='md-person-circle-outline' size = {32} color = "#00a46c"/>  */}
      {/* <Ionicons name='md-person-circle-outline' size = {32} color = "#c71585" /> */}
      {/* <Ionicons name='md-person-circle-outline' size = {32} color = "#FF8C00"/>  */}
      <Ionicons name='md-person-circle-outline' size = {36} color = {Platform.OS === 'android' ? Colors.primary : ''} />  
    </TouchableOpacity> ),
    headerRight: () => (
       <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
      {/* <Ionicons name='notifications' size = {32} color = "#00a46c"/> */}
      {/* <Ionicons name='notifications' size = {32} color = "#c71585"/>  */}
      {/* <Ionicons name='notifications' size = {32} color = "#FF8C00"/>  */}
      <Ionicons name='notifications' size = {35} color = {Platform.OS === 'android' ? Colors.primary : ''}/> 
    </TouchableOpacity>
    ),
  }}>
    <appTabNavigator.Screen name = "Loyalty" component = {LoyaltyScreen} options={{
      tabBarButton: (props) => null
    }}/>
    <appTabNavigator.Screen name = "Notifications" component = {NotificationScreen} options={{
      tabBarButton: (props) => null
    }} />
    <appTabNavigator.Screen name = "foundedDrivesScreen"  component = {foundedDrivesScreen} options={{
      tabBarButton: (props) => null,
      title: "Rides Found"
    }}/>
    <appTabNavigator.Screen name = "driver" component = {driverScreen} options={{
      title: "As a driver",
      tabBarLabelStyle:{
        fontSize:15,
        color: Colors.primary
      },
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name="car-outline" size={38} color = {Platform.OS === 'android' ? Colors.primary : ''}/>
      )
    }}/>
    <appTabNavigator.Screen name = "passenger"  component = {PassengerScreen} options={{
      title: "As a passenger",
      tabBarLabelStyle:{
        fontSize:15,
        color: Colors.primary
      },
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name="man-outline" size={38} color = {Platform.OS === 'android' ? Colors.primary : ''}/>
      )
    }}/>
    <appTabNavigator.Screen name = "UpcomingDrive"  component = {DriveScreenIfUpcoming} options={{
      tabBarButton: (props) => null,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Loyalty")}>
          <Ionicons name="arrow-back" size={35} color={Platform.OS === 'android' ? Colors.primary : ''} />    
        </TouchableOpacity>
     ),
     title: "Current Ride",
    }} />
    <appTabNavigator.Screen name = "FoundDrive" component = {DriveScreenIfFound} options={{
      tabBarButton: (props) => null,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("foundedDrivesScreen")}>
          <Ionicons name="arrow-back" size={35} color={Platform.OS === 'android' ? Colors.primary : ''} />    
        </TouchableOpacity>
     ),
    }} />
  </appTabNavigator.Navigator>

};


export const MainAppNavigator = () => {
  return <mainNavigator.Navigator>
    <mainNavigator.Screen name = "Driver_passanger_navigator" component = {Driver_passanger_navigator} options={{headerShown:false}}/>
  </mainNavigator.Navigator>
};


/*const appNavigator = createBottomTabNavigator(
  {
    Loyalty: loyaltyScreen
  }
);*/


const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
    <AuthStackNavigator.Screen name = "Auth" component = {AuthScreen} options={authScreenOption} />
    <AuthStackNavigator.Screen name = "Email Validate" component = {EmailVareficationScreen}  />
    <AuthStackNavigator.Screen name = "DetailsFilling" component = {DetailsFillingScreen}/>
  </AuthStackNavigator.Navigator>

};

/*const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
    DetailsFilling: DetailsFillingScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  App: appNavigator
});

export default createAppContainer(MainNavigator);*/
