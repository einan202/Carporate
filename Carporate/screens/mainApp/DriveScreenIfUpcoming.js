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
  Pressable,
  Modal,
  Linking
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import {showDirectionInMaps} from '../../functions/googleAPI';
import {deleteDriveForDriver,deleteDriveForPassanger, delaySpecificDrive } from '../../store/actions/drives';
import DropDownButton from "../../components/UI/DropDownButton";





function driveScreenIfUpcoming({ route, navigation }) {

  const email = useSelector(state => state.auth.email);
  const firstName = useSelector(state => state.auth.first_name);
  const LastName = useSelector(state => state.auth.last_name);
  const userID = useSelector(state => state.auth.userId);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const ifDriver = route.params.driver.driverEmail === email ? true : false;
  const [demorateTime, setDemorateTime] = useState(undefined);


  const triggerNotificationHandler = (title, to, body) => {
    
    

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to,
        data: {},
        title: title,
        body: body,
        priority: 'high'
      }),
    });
    
  };

 const delayDrive = () =>{
    dispatch(delaySpecificDrive(route.params.driveID, demorateTime))
    let to = route.params.passangers
    let title = "Your drive will be delayed"
    if(to){
      for(let i = 0; i < to.length ; i++){
        triggerNotificationHandler(title, to[i].pushToken, `${route.params.driver.driverFirstName} ${route.params.driver.driverLastName} that supposed to take you to ${to[i].destination.address} will be delayed around ${demorateTime} minutes.`)
      }
    }
    navigation.navigate("Loyalty")
 }

 const onInputChange = (id, value, isOK) =>{
  setDemorateTime(value)
 }

  const startDrive = () => {
    let to = route.params.passangers
    let title = "Your drive start"
    if(to){
      for(let i = 0; i < to.length ; i++){
        triggerNotificationHandler(title, to[i].pushToken, `${route.params.driver.driverFirstName} ${route.params.driver.driverLastName} is on the way to take you to ${to[i].destination.address}.`)
      }
    }
    showDirectionInMaps(route.params.dir)
}

  const deleteDrive = () => {
    if(ifDriver){
      let to = route.params.passangers
      let title = "Your drive was deleted"
      if(to){
        for(let i = 0; i < to.length ; i++){
          triggerNotificationHandler(title, to[i].pushToken, `The driver delete your drive to ${to[i].starting_point.address} on the ${route.params.date}`)
        }
      }
      try{
      dispatch(deleteDriveForDriver(route.params.driveID))
      }
      catch(err){
        console.log(err)
      }
    }
    else{
      let to = route.params.driver.driverPushToken
      let title = "Someone leave your drive"
      let body = `${firstName} ${LastName} leave your drive to ${route.params.destination} on ${route.params.date}`
      
      triggerNotificationHandler(title, to, body);
      try{
        dispatch(deleteDriveForPassanger(route.params.driveID, userID))
      }
      catch(err){
        console.log(err)
      }
      
    }
    navigation.navigate("Loyalty")
  }
    const passangersText = 
    route.params.passangers!==undefined && route.params.passangers !== [] ? 
        <FlatList
          ListHeaderComponent={<Text style={[styles.text, {fontSize: 20}]}>The passangers are:</Text>}
          data={route.params.passangers.map((passanger, index) => ({ value: passanger, id: index  }))}
          keyExtractor={item => item.id}
          renderItem = {itemData => 
            (ifDriver?
              
               <Pressable
              onPress={() => Linking.openURL(`tel:${itemData.item.value.phone}`)}
              >
                
                <Text style={[styles.text, {fontSize: 20}]}>{itemData.item.value.firstName} {itemData.item.value.lastName}</Text>
              </Pressable>
              
            :
            <Text style={[styles.text, {fontSize: 20}]}>{itemData.item.value.firstName} {itemData.item.value.lastName}</Text>
             
            )
          }
        />
        :
        <View style = {{marginTop:0}}>
        <Text style={[styles.text, {fontSize: 20}]}>There are still no passangers for this drive</Text>
        </View>;

    return (
            
            <View style={styles.touchable}>
            <Text style={[styles.text, {fontSize: 20}]}> {route.params.starting_point} {'-->'} {route.params.destination}</Text>
            {route.params.newDriveInformation ?  
            <Text style={[styles.text, {fontSize: 20}]}> {'The pick up address is:\n'} {route.params.newDriveInformation.pickUpPoint.address}</Text> : <Text></Text>
            }
            <Text style={[styles.text, {fontSize: 20}]}> {route.params.date} {'at'} {route.params.time}  </Text>
            <Text style={[styles.text, {fontSize: 20}]}> {'available spaces:'} {route.params.amount_of_people}  </Text>
            {
              ifDriver?
              <Text style={[styles.text, {fontSize: 20}]}> { 'You are the driver'}  </Text>
              :
              <Pressable
              onPress={() => Linking.openURL(`tel:${route.params.driver.driverPhone}`)}>
                <Text style={[styles.text, {fontSize: 20}]}> {`the driver is: ${route.params.driver.driverFirstName + ' ' + route.params.driver.driverLastName}`}  </Text>
              </Pressable>
            }
            
            {passangersText}
            { 
            <Pressable
            onPress={() => showDirectionInMaps(route.params.dir)}
            style = {{marginTop: 20}}
            >
            <Text style={[styles.text, {fontSize: 20, marginTop:0}]}>Press here to show the ride on map</Text>
            </Pressable>}
            

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                  setModalVisible(!modalVisible);
                }}
                style={{borderRadius: 50}}
                >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                  <DropDownButton
                        style={{ zIndex: 10, }}
                        array={[
                            { label: '0 - 10 minutes', value: 10 },
                            { label: '10 - 20 minutes', value: 20 },
                            { label: '20 - 30 minutes', value: 30 },
                            { label: '30 - 40 minutes', value: 40 },
                            { label: '40 - 50 minutes', value: 50 },
                            { label: '50 - 60 minutes', value: 60 },
                            { label: '1 hour +', value: '1 hour +'},
                        ]}
                        placeHolder="delay time"
                        onInputChange = {onInputChange}
                      />
                    <View style = {{ flexDirection:"row", marginTop:200}}>
                    
                      <View style = {{ padding: 5}}>
                        <Button
                          color = {Colors.primary}
                          title = {"cancel"}
                          onPress={() => setModalVisible(!modalVisible)}
                          style = {styles.button}/> 
                      </View>

                      <View style = {{ padding: 5}}>
                        <Button
                          color = {Colors.primary}
                          title = {"confirm"}
                          onPress = {() => 
                            {if(demorateTime === undefined){
                              setDemorateTime(undefined)
                              Alert.alert('We sorry','you must choose your delay time',[
                                {text: 'OK',
                                onPress: () => console.log('No Pressed'),
                                style: 'cancel'},])
                             }
                             else if(demorateTime === '1 hour +'){
                              setDemorateTime(undefined)
                              Alert.alert('We sorry','if you will delay more than one hour you need to cancel your drive',[
                                {text: 'OK',
                                onPress: () => console.log('No Pressed'),
                                style: 'cancel'},])
                             }
                             else{
                               Alert.alert('Are you sure?','',[
                              { text: 'Yes', onPress: () =>
                              delayDrive() },
                              {text: 'No',
                              onPress: () => console.log('No Pressed'),
                              style: 'cancel'},])
                          
                             }
                            
                               }}
                          style = {styles.button}/>
                      </View>

                    </View>
                  </View>
                </View>
              </Modal>
              {ifDriver?
                <View style = {{ padding: 5}}> 
                  <Button
                    color = {Colors.primary}
                    title = {"Delay this drive"}
                    onPress = {() => setModalVisible(true)}
                  />
                </View>
                :null}

            {ifDriver? 
              <View style = {{ padding: 5}}>
                <Button
                color = {Colors.primary}
                title = {"Start this drive"}
                onPress = {() => Alert.alert('Are you sure?','',[
                  { text: 'Yes', onPress: () => startDrive() },
                  {text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel'},
                ]) }
                style = {styles.button}/>
              </View> 
              :null
            }
            
            <View style = {{ padding: 5}}>
              <Button
                color = {Colors.primary}
                title = {ifDriver ? "delete this drive" : "leave this drive"}
                onPress = {() => Alert.alert('Are you sure?','',[
                  { text: 'Yes', onPress: () => deleteDrive() },
                  {text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel'},
                ]) }
                style = {styles.button}/>
            </View>

            </View>
    )
}

const styles = StyleSheet.create({
    touchable: {
      borderRadius: 10,
      overflow: 'hidden',
      
    },
    text: {
      textAlign: 'center',
      fontFamily: 'open-sans',
      fontSize: 17,
      color: '#888'
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    button: {
      backgroundColor: 'white',
      padding: 20,
      marginTop: 0,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 20
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 20
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
      borderWidth: 20
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      height:350,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      borderWidth: 2
    },
  });

export default driveScreenIfUpcoming;