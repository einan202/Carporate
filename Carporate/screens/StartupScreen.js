import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';


const StartupScreen = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        dispatch(authActions.setDidTryAl());
        //props.navigation.navigate('Auth');
        return;
      }
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate, email } = transformedData;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !userId || !email) {
        
        //props.navigation.navigate('Auth');
        dispatch(authActions.setDidTryAl());
        return;
      }
      // AsyncStorage.removeItem('userData');/*ffgggggggggggggggggggggggggggggg*/
      // AsyncStorage.removeItem('userDetaills');/*ffgggggggggggggggggggggggggggggg*/
      const expirationTime = expirationDate.getTime() - new Date().getTime();
      try {
        const userDetaills = await AsyncStorage.getItem('userDetaills');
        const transformedDetaills = JSON.parse(userDetaills);
        const {userID, email, first_name, last_name,phone_number, age, gender, pushToken} = transformedDetaills;
        dispatch(authActions.authenticate(userID, token, expirationTime, email, first_name, last_name,phone_number,age, gender, pushToken));
      } catch (error) {
        console.log('Something went wrong in your code', error)
      }
      //props.navigation.navigate('App');
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default StartupScreen;
