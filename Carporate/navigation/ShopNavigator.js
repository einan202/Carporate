import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform,TouchableOpacity } from 'react-native';

import loyaltyScreen from '../screens/auth/loyaltyScreen'
import AuthScreen, {navigationOptions as authScreenOption} from '../screens/auth/AuthScreen';
import DetailsFillingScreen from '../screens/auth/DetailsFillingScreen';
import EmailVareficationScreen from '../screens/auth/EmailVareficationScreen';
import notificationScreen from '../screens/mainApp/notificationScreen';
import Colors from '../constants/Colors';
import driverScreen from '../screens/mainApp/driverScreen';
import driveScreenIfFound from '../screens/mainApp/DriveScreenIfFound';
import driveScreenIfUpcoming from '../screens/mainApp/DriveScreenIfUpcoming';
import passengerScreen from '../screens/mainApp/passengerScreen';
import foundedDrivesScreen from '../screens/mainApp/foundedDrivesScreen';
import { Ionicons } from '@expo/vector-icons';


const defaultNavOptions = {
  headerStyle: {
    backgroundColor: 'white'
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

const driver_passanger_navigator = ({navigation}) => {
  return <appTabNavigator.Navigator screenOptions={ { headerStyle: {
    // Color: "#FF8C00",
    // backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
    backgroundColor: 'white',
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

  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.navigate('Loyalty')}>
      {/* <Ionicons name='md-person-circle-outline' size = {32} color = "#00a46c"/>  */}
      {/* <Ionicons name='md-person-circle-outline' size = {32} color = "#c71585" /> */}
      {/* <Ionicons name='md-person-circle-outline' size = {32} color = "#FF8C00"/>  */}
      <Ionicons name='md-person-circle-outline' size = {32} color = {Platform.OS === 'android' ? Colors.primary : ''} />  
    </TouchableOpacity> ),
    headerRight: () => (
       <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
      {/* <Ionicons name='notifications' size = {32} color = "#00a46c"/> */}
      {/* <Ionicons name='notifications' size = {32} color = "#c71585"/>  */}
      {/* <Ionicons name='notifications' size = {32} color = "#FF8C00"/>  */}
      <Ionicons name='notifications' size = {32} color = {Platform.OS === 'android' ? Colors.primary : ''}/> 
    </TouchableOpacity>
    ),
  }}>
    <appTabNavigator.Screen name = "Loyalty" component = {loyaltyScreen} options={{
      tabBarButton: (props) => null
    }}/>
    <appTabNavigator.Screen name = "Notifications" component = {notificationScreen} options={{
      tabBarButton: (props) => null
    }} />
    <appTabNavigator.Screen name = "Rides Found" component = {foundedDrivesScreen} options={{
      tabBarButton: (props) => null
    }}/>
    <appTabNavigator.Screen name = "As a driver" component = {driverScreen} />
    <appTabNavigator.Screen name = "As a passenger" component = {passengerScreen} />
    <appTabNavigator.Screen name = "Current Ride" component = {driveScreenIfUpcoming} options={{
      tabBarButton: (props) => null,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Loyalty")}>
          <Ionicons name="arrow-back" size={32} color={Platform.OS === 'android' ? Colors.primary : ''} />    
        </TouchableOpacity>
     ),
    }} />
    <appTabNavigator.Screen name = "foundDrive" component = {driveScreenIfFound} options={{
      tabBarButton: (props) => null,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Rides Found")}>
          <Ionicons name="arrow-back" size={32} color={Platform.OS === 'android' ? Colors.primary : ''} />    
        </TouchableOpacity>
     ),
    }} />
  </appTabNavigator.Navigator>

};


export const MainAppNavigator = () => {
  return <mainNavigator.Navigator>
    <mainNavigator.Screen name = "driver_passanger_navigator" component = {driver_passanger_navigator} options={{headerShown:false}}/>
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
