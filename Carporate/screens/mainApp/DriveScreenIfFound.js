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
  Linking
} from 'react-native';
import Colors from "../../constants/Colors";
import Card from '../../components/UI/Card';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import {showDirectionInMaps} from '../../functions/googleAPI';
import Ionicons from '@expo/vector-icons/Ionicons';


function DriveScreenIfFound({ route, navigation }) {

  const email = useSelector(state => state.auth.email);
  
    const passangersText = 
    route.params.passangers!==undefined && route.params.passangers !== [] ? 
        <FlatList
        ListHeaderComponent={<Text style={[styles.text, {fontSize: 20, color: 'black'}]}>Passangers: </Text>}
        data={route.params.passangers.map((passanger, index) => ({ value: passanger, id: index  }))}
          keyExtractor={item => item.id}
          renderItem = {itemData => 
            (
            <Text style={[styles.text, {fontSize: 20}]}>{itemData.item.value.firstName} {itemData.item.value.lastName} </Text>
             
            )}
        />
        :
        <View style = {{marginTop:0}}>
        <Text style={[styles.text, {fontSize: 20, color: 'black'}]}>No passangers have join yet</Text>
        </View>;

    return (
            
      <LinearGradient colors={['#f7e8df', '#ffe3ff']} style={{flex:1}}>
            <Text style={[styles.text, {  fontWeight: 'bold', fontSize: 20, marginTop: 10 }]}> {route.params.starting_point} {' ==> '} {route.params.destination}</Text>
            <Text style={[styles.text, { fontSize: 20, color: Colors.primary, marginBottom: 5 }]}> {route.params.date} {'at'} {route.params.time}  </Text>
            <Text style={[styles.text, { fontSize: 20, color: 'black' }]}> {'Available places:'} {route.params.amount_of_people}  </Text>
            <Text style={[styles.text, { fontSize: 20, color: 'black' }]}> {route.params.driver === email ? 'You are the driver' : `Driver: ${route.params.driver.driverFirstName + ' ' + route.params.driver.driverLastName}`}  </Text>
            {route.params.newDriveInformation ?
             <View style={{flex: 1,
              justifyContent: "center",
              alignItems: "center",
              }}>
            <Card style = {{marginTop: 10,width: '70%', height:300}}>
              <Text style={{fontSize: 20, marginTop: 10, textAlign: 'center'}}>Ideal pick up:</Text>
              <Text style={[styles.text, { fontSize: 20, color: Colors.primary, textAlign: 'center', flex: 1 }]}>
                  {route.params.newDriveInformation.pickUpPoint.address}
              </Text>
              <View style={{flex: 1,
              justifyContent: "center",
              alignItems: "center",
              }}>
              <Pressable
                onPress={() =>
                  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${route.params.newDriveInformation.pickUpPoint.location.lat}%2C${route.params.newDriveInformation.pickUpPoint.location.lng}`)
                }
              >
                <Ionicons name="location-outline" size = {25} color = {Platform.OS === 'android' ? Colors.primary : ''}/> 
              </Pressable>
              </View>
              <Text style={{fontSize: 20, marginTop: 10, textAlign: 'center'}}>Ideal drop off:</Text>
              <Text style={[styles.text, { fontSize: 20, color: Colors.primary, textAlign: 'center', flex: 1 }]}>
                  {route.params.newDriveInformation.dropOffPoint.address}
               </Text>
               <View style={{flex: 1,
              justifyContent: "center",
              alignItems: "center",
              }}>
              <Pressable
                onPress={() =>
                  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${route.params.newDriveInformation.dropOffPoint.location.lat}%2C${route.params.newDriveInformation.dropOffPoint.location.lng}`)
                }
              >
                <Ionicons name="location-outline" size = {25} color = {Platform.OS === 'android' ? Colors.primary : ''}/> 

              </Pressable>
              </View>
            </Card>
            </View>
            : null
            }
            
            
            {/* {passangersText} */}
            { 
            <Pressable
            onPress={() => showDirectionInMaps(route.params.dir)}
            style = {{marginTop: 20}}
            >
            <Text style={[styles.text, { fontSize: 20, fontWeight: 'bold' }]}>
              Press here to show the ride on map</Text>
            </Pressable>}</LinearGradient>
    )
}

const styles = StyleSheet.create({
    touchable: {
      borderRadius: 10,
      overflow: 'hidden',
      
    },
    text: {
      textAlign: 'center',
      fontFamily: "fontawesome-webfont",
      fontSize: 17,
      color: 'black',
      margin:3
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    button: {
      backgroundColor: 'white',
      padding: 12,
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
      borderWidth: 20
    },
  });

export default DriveScreenIfFound;