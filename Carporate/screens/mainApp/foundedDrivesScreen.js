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
  FlatList,
  Image,
  ImageBackground,
} from 'react-native';
import Colors from '../../constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import Drive from '../../models/drive'
import * as drivesActions from '../../store/actions/drives'
import DriveItem from '../../components/shop/DriveItem';
import { LinearGradient } from 'expo-linear-gradient';



const FoundedDrivesScreen = props => {
    const foundedDrives = useSelector(state => state.passanger.foundedDrives);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();
    const first_name = useSelector(state => state.auth.first_name);
    const email = useSelector(state => state.auth.email);
    const last_name = useSelector(state => state.auth.last_name);
    const phone = useSelector(state => state.auth.phone_number);
    const pushToken = useSelector(state => state.auth.pushToken);
    const userID = useSelector(state => state.auth.userId);

    const triggerNotificationHandler = (itemData) => {
      itemData.item.old_drive.dir = undefined;
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: itemData.item.old_drive.driver.driverPushToken,
          data: { driveData: itemData.item.old_drive, passangerPushToken: pushToken, passangerFN: first_name, passangerLN: last_name, passangerEmail:email,passangerPhone:phone,passangerUserID:userID, newDriveInformation: itemData.item.newDriveInformation },
          title: 'You received a request to join a drive',
          body: `${first_name} ${last_name} want to join to your drive`,
          priority: 'high'
        }),
      });
      props.navigation.navigate("Loyalty")
    };

    if (error) {
        return (
          <View style={styles.centered}>
            <Text style={{textAlign: 'center', marginTop: 0, fontSize: 20,fontFamily: "fontawesome-webfont",
              fontWeight: '900',color: 'grey'}}>Error occurred!</Text>
            <Text style={{textAlign: 'center', marginTop: 0, fontSize: 20,fontFamily: "fontawesome-webfont",
              fontWeight: '900',color: 'grey'}}>Please, try again later...</Text>
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

    if (!isLoading && foundedDrives.length === 0) {
        return (
          
          <LinearGradient colors={['#f7e8df', '#ffe3ff']} style={{flex:1}}>
          {/* <View style={styles.centered}> */}

            <Text style={{textAlign: 'center', marginTop: 30, fontSize: 20,fontFamily: "fontawesome-webfont",
              fontWeight: '900', color: 'black'}}>We are sorry</Text>
            <Text style={{textAlign: 'center', marginTop: 0, fontSize: 20,fontFamily: "fontawesome-webfont",
              fontWeight: '900',color: 'black'}}>No rides were found
              {/* </Text> */}
            {/* <Text style={{textAlign: 'center', marginTop: 0, fontFamily: "fontawesome-webfont",
              fontWeight: '900',fontSize: 20, color: 'black'}}> */}
                , please try again</Text>
            
          </LinearGradient>
                                  
        );
    }

    const selectDrive = (itemData) => {
        Alert.alert('Are you sure?','we will send to the driver a request',[
          { text: 'Yes', onPress: () => triggerNotificationHandler(itemData) },
          {text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel'},
        ]) 
    };

    return (
      <LinearGradient colors={['#f7e8df', '#ffe3ff']} style={{flex:1}}>
        <FlatList
          ListHeaderComponent={<Text style = {{textAlign:'center', fontSize:16, fontFamily: "fontawesome-webfont", fontWeight: 'bold'}}>These are the drives we found for you </Text>}
          refreshing={isRefreshing}
          data={foundedDrives}
          keyExtractor = {item => item.old_drive.id}
          renderItem = {itemData =>
          (<DriveItem
              starting_point = {itemData.item.old_drive.starting_point}
              destination = {itemData.item.old_drive.destination}
              date = {itemData.item.old_drive.date}
              time = {itemData.item.old_drive.time}
              amount_of_people = {itemData.item.old_drive.amount_of_people}
              deviation_time = {itemData.item.old_drive.deviation_time}
              driver = {itemData.item.old_drive.driver}
              passangers = {itemData.item.old_drive.passangers}
              onSelect={() => selectDrive(itemData)}
              moreDetails = {()=>{}}
              showButton = {
                <View style = {styles.buttonContainer}>
                  <Button
                  color = {Colors.primary}
                  title = "choose this drive"
                  onPress = {() => selectDrive(itemData)}
                  style = {styles.button}/>
                </View>}
              newDriveInformation = {itemData.item.newDriveInformation}
              dir = {itemData.item.old_drive.dir}
              map = {true}
              whereToNavigate = {"FoundDrive"}
              navigation = {props.navigation}
              driveID = {itemData.item.old_drive.id}
          />)}
        /></LinearGradient>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    buttonContainer: {
        padding:5,
      }
});

export default FoundedDrivesScreen;