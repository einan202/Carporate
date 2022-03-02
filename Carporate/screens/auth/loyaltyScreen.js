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
import * as Notifications from 'expo-notifications';





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


  const triggerNotificationHandler = (driveData, pushToken, title, body, data, passangerEmail, drivekey, newDriveInformation) => {

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: pushToken,
        data: data,
        title: title,
        body: body,
      }),
    });

    if(title === 'You have received permission to join the drive'){
      const action = drivesActions.joinDrive(
        driveData,
        passangerEmail,
        pushToken,
        newDriveInformation
      );
      try{
         dispatch(action);
      }
      catch{
        (err) => console.log(err)
      }
    }
  };


  useEffect(() => {
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {

         Notifications.scheduleNotificationAsync({
          content: {
            title:response.notification.request.content.title,
            body: response.notification.request.content.body,
            data: response.notification.request.content.data,
          },
          trigger: {
            seconds: 1,
       },
     });
      }
    );

    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (response) => {
        
        const content = response.request.content;
        const passangerFirstName = content.data.passangerFN;
        const passangerLastName = content.data.passangerLN;
        const passangerEmail = content.data.passangerEmail;
        const driveData = content.data.driveData;
        const drivekey = driveData.id;
        const pushToken = content.data.passangerPushToken;
        const newDriveInformation = content.data.newDriveInformation;
        if(content.title === 'You received a request to join a drive'){
          Alert.alert('You received a request to join a drive',`${passangerFirstName} ${passangerLastName} asked to join your drive from ${driveData.starting_point.address} 
            to ${driveData.destination.address} in ${driveData.date}, you still have ${driveData.amount_of_people} places. Do you accept? \n This will extend the ride by ${newDriveInformation.devationTime} minutes `
          ,[
            { text: 'Yes', onPress:() => triggerNotificationHandler(driveData,pushToken,'You have received permission to join the drive','',content.data,passangerEmail,drivekey, newDriveInformation) },
            {text: 'No',
            onPress:() => triggerNotificationHandler(driveData,pushToken,'We sorry','You do not have permission to join the drive',content.data,passangerEmail,drivekey, newDriveInformation),
            style: 'cancel'},
          ])
        }
        else if(content.title === 'You have received permission to join the drive'){
          Alert.alert('You have received permission to join the drive',`${driveData.driver.driverEmail} accept you to join his drive from ${driveData.starting_point.address} to ${driveData.destination.address} in ${driveData.date}. Your pick up address is ${newDriveInformation.pickUpPoint.address}`
        ,[
          {text: 'OK',
          onPress: () => {},
          style: 'cancel'},
        ])
        }
        else{
          Alert.alert('We sorry',`You do not have permission to join the drive from ${driveData.starting_point.address} to ${driveData.destination.address} in ${driveData.date}. You can try another drive`
        ,[
          {text: 'OK',
          onPress: () => {},
          style: 'cancel'},
        ])

        }
         
      }
    );

    
  }, []);


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



    return (

        <FlatList
          ListHeaderComponent={credentials}
          onRefresh={loadDrives}
          refreshing={isRefreshing}
          data={drives}
          keyExtractor = {item => item.id}
          renderItem = {itemData =>
          (<DriveItem
              starting_point = {itemData.item.starting_point.address}
              destination = {itemData.item.destination.address}
              date = {itemData.item.date}
              time = {itemData.item.time}
              amount_of_people = {itemData.item.amount_of_people}
              deviation_time = {itemData.item.deviation_time}
              driver = {itemData.item.driver.driverEmail}
              passangers = {itemData.item.passangers}
              onSelect={() => selectDrive()}
              moreDetails = {()=>{}}
              
          />)}
          ListEmptyComponent = {
            <View style={styles.centered}>
              <Text>No drives found</Text>
            </View>
        }
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