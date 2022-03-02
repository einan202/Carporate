import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform,TouchableOpacity } from 'react-native';

import loyaltyScreen from '../screens/auth/loyaltyScreen'
import AuthScreen, {navigationOptions as authScreenOption} from '../screens/auth/AuthScreen';
import DetailsFillingScreen from '../screens/auth/DetailsFillingScreen';
import notificationScreen from '../screens/mainApp/notificationScreen';
import Colors from '../constants/Colors';
import driverScreen from '../screens/mainApp/driverScreen';
import passengerScreen from '../screens/mainApp/passengerScreen';
import foundedDrivesScreen from '../screens/mainApp/foundedDrivesScreen';
import { Ionicons } from '@expo/vector-icons';


const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
  
}

const appTabNavigator = createBottomTabNavigator();
const mainNavigator = createStackNavigator();

const driver_passanger_navigator = ({navigation}) => {
  return <appTabNavigator.Navigator screenOptions={ { headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
    height: 70
  },
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.navigate('Loyalty')}>
      <Ionicons name='md-person-circle-outline' size = {32} color = "white"/> 
    </TouchableOpacity> ),
    headerRight: () => (
       <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
      <Ionicons name='notifications' size = {32} color = "white"/> 
    </TouchableOpacity>
    ),
  }}>
    <appTabNavigator.Screen name = "Loyalty" component = {loyaltyScreen} options={{
      tabBarButton: (props) => null
    }}/>
    <appTabNavigator.Screen name = "Notification" component = {notificationScreen} options={{
      tabBarButton: (props) => null
    }} />
    <appTabNavigator.Screen name = "foundedDrivesScreen" component = {foundedDrivesScreen} options={{
      tabBarButton: (props) => null
    }}/>
    <appTabNavigator.Screen name = "driver" component = {driverScreen}/>
    <appTabNavigator.Screen name = "passenger" component = {passengerScreen}/>
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
