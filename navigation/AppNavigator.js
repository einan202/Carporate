import React from 'react';
import { useSelector } from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import { AuthNavigator, MainAppNavigator} from './ShopNavigator';
import StartupScreen from '../screens/StartupScreen';
import DetailsFillingScreen from '../screens/auth/DetailsFillingScreen' 



const AppNavigator = props => {
  const isAuth = useSelector(state => !!state.auth.token);
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);
  const goToDettailsFelling = useSelector(state => state.auth.goToDettailsFelling);
 

  return <NavigationContainer>
    {goToDettailsFelling && <DetailsFillingScreen/>}
    {isAuth && !goToDettailsFelling && <MainAppNavigator/>}
    {!isAuth && didTryAutoLogin && !goToDettailsFelling &&  <AuthNavigator/>}
    {!isAuth && !didTryAutoLogin && !goToDettailsFelling &&  <StartupScreen/>}
  </NavigationContainer>;
};

export default AppNavigator;
