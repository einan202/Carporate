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
import * as drivesActions from '../../store/actions/drives'
import DriveItem from '../../components/shop/DriveItem';




const loyaltyScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const drives = useSelector(state => state.drives.userDrives);
  const dispatch = useDispatch();
  const email = useSelector(state => state.auth.email);
  const first_name = useSelector(state => state.auth.first_name);
  const last_name = useSelector(state => state.auth.last_name);
  const phone_number = useSelector(state => state.auth.phone_number);
  const age = useSelector(state => state.auth.age);
  const gender = useSelector(state => state.auth.gender);


  const loadDrives = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(drivesActions.fetchDrives(email));
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  

  useEffect(() => {
    setIsLoading(true);
    loadDrives().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadDrives]);


  const credentials =
   <>
  <View style={styles.textContainer}>
  <Text style = {{fontSize: 16}}> E-Mail: {email} </Text>
  </View>
  <View style={styles.textContainer}>
  <Text style = {{fontSize: 16}}> First name: {first_name}</Text>
  </View>
  <View style={styles.textContainer}>
  <Text style = {{fontSize: 16}}> Last name:{last_name} </Text>
  </View>
  <View style={styles.textContainer}>
  <Text style = {{fontSize: 16}}> Phone-Number: {phone_number}</Text>
  </View>
  <View style={styles.textContainer}>
  <Text style = {{fontSize: 16}}> Age: {age}</Text>
  </View>
  <View style={styles.textContainer}>
  <Text style = {{fontSize: 16}}> Gender: {gender}</Text>
  </View>
  <Text style = {{fontSize: 20, textAlign: 'center', fontFamily:'open-sans-bold'}}>My upcoming drives</Text>
  </>;

  if (error) {
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
        {credentials}
        <Text>No drives found. Maybe start adding some!</Text>
      </View>
    );
  }

  



    return (

        <FlatList
          ListHeaderComponent={credentials}
          onRefresh={loadDrives}
          refreshing={isRefreshing}
          data={drives}
          keyExtractor = {item => item.id}
          renderItem = {itemData =>
          (<DriveItem
              starting_point = {itemData.item.starting_point}
              destination = {itemData.item.destination}
              date = {itemData.item.date}
              time = {itemData.item.time}
              amount_of_people = {itemData.item.amount_of_people}
              deviation_time = {itemData.item.deviation_time}
              driver = {itemData.item.driver}
              passangers = {itemData.item.passangers}
              onSelect={() => selectDrive()}
              moreDetails = {()=>{}}
               /* <View style = {styles.buttonContainer}>
              <Button
                 color={Colors.primary}
                 title="choose this drive"
                 onPress={props.onSelect}
                 style = {styles.button}/>
          </View>*/
          />)}
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