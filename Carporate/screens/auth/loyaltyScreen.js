import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Text, 
  FlatList
} from 'react-native';
import Colors from '../../constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Drive from '../../models/drive'
import * as drivesActions from '../../store/actions/drives'

const loyaltyScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const drives = useSelector(state => state.drives.userDrives);
  const dispatch = useDispatch();
  const [detaills, setDetaills] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    age: '',
    gender: ''
  });


const getDetaills = async () => {
    try {
      const userDetaills = await AsyncStorage.getItem('userDetaills');
      const transformedDetaills = JSON.parse(userDetaills);
      setDetaills(transformedDetaills);
    } catch (error) {
      console.log('Something went wrong in your code', error)
    }
  };


  const loadDrives = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(drivesActions.fetchDrives(detaills.email));
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    getDetaills();
    loadDrives();
  },[]);

  useEffect(() => {
    setIsLoading(true);
    loadDrives().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadDrives]);

  if (error) {
   console.log(error)
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadDrives()}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && drives.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No drives found. Maybe start adding some!</Text>
      </View>
    );
  }

    console.log(drives[0].driver)
    return (

        <FlatList
          ListHeaderComponent={
          <>
          <View style={styles.textContainer}>
          <Text style = {{fontSize: 20}}> E-Mail: {detaills.email} </Text>
          </View>
          <View style={styles.textContainer}>
          <Text style = {{fontSize: 20}}> First name: {detaills.first_name}</Text>
          </View>
          <View style={styles.textContainer}>
          <Text style = {{fontSize: 20}}> Last name:{detaills.last_name} </Text>
          </View>
          <View style={styles.textContainer}>
          <Text style = {{fontSize: 20}}> Phone-Number: {detaills.phone_number}</Text>
          </View>
          <View style={styles.textContainer}>
          <Text style = {{fontSize: 20}}> Age: {detaills.age}</Text>
          </View>
          <View style={styles.textContainer}>
          <Text style = {{fontSize: 20}}> Gender: {detaills.gender}</Text>
          </View>
          <Text>upcoming drives</Text>
          </>}
          onRefresh={loadDrives}
          refreshing={isRefreshing}
          data={drives}
          keyExtractor = {item => item.id}
          renderItem = {itemData =>{ return  <Text>{itemData.item.time}</Text>}}
        />
       
    
    
    )
  };


  const styles = StyleSheet.create({
   
    textContainer: {
      marginTop:10,
      padding: 20,
      paddingHorizontal: 2,
      paddingVertical: 5,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      shadowColor: 'black',
      shadowOpacity: 0.26,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 10,
      elevation: 5,
      borderRadius: 12,
      backgroundColor: 'white'
      


    }
  });

export default loyaltyScreen;