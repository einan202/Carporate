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
import { useSelector, useDispatch } from 'react-redux';
import {showDirectionInMaps} from '../../functions/googleAPI';


function driveScreenIfFound({ route, navigation }) {

  const email = useSelector(state => state.auth.email);
  
    const passangersText = 
    route.params.passangers!==undefined && route.params.passangers !== [] ? 
        <FlatList
          ListHeaderComponent={<Text style={[styles.text, {fontSize: 20}]}>Passangers: </Text>}
          data={route.params.passangers.map((passanger, index) => ({ value: passanger, id: index  }))}
          keyExtractor={item => item.id}
          renderItem = {itemData => 
            (
            <Text style={[styles.text, {fontSize: 20}]}>{itemData.item.value.firstName} {itemData.item.value.lastName} </Text>
             
            )}
        />
        :
        <View style = {{marginTop:0}}>
        <Text style={[styles.text, {fontSize: 20}]}>No passangers have join yet</Text>
        </View>;

    return (
            
      <LinearGradient colors={['#f7e8df', '#ffe3ff']} style={{flex:1}}>
            <Text style={[styles.text, {fontSize: 20}]}> {route.params.starting_point} {' ==> '} {route.params.destination}</Text>
            {route.params.newDriveInformation ?
            <>
              <Text>Ideal pick up:</Text>
              <Pressable
                onPress={() =>
                  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${route.params.newDriveInformation.pickUpPoint.location.lat}%2C${route.params.newDriveInformation.pickUpPoint.location.lng}`)
                }
              >
                <Text style={[styles.text, { fontSize: 20,  }]}>
                  {route.params.newDriveInformation.pickUpPoint.address}
                </Text>
              </Pressable>

              <Text>Ideal drop off:</Text>
              <Pressable
                onPress={() =>
                  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${route.params.newDriveInformation.dropOffPoint.location.lat}%2C${route.params.newDriveInformation.dropOffPoint.location.lng}`)
                }
              >
                <Text style={[styles.text, { fontSize: 20, color: 'grey' }]}>
                  {route.params.newDriveInformation.dropOffPoint.address}
                </Text>
              </Pressable>
            </>
            : null
            }
            <Text style={[styles.text, { fontSize: 20, color: 'grey' }]}> {route.params.date} {'at'} {route.params.time}  </Text>
            <Text style={[styles.text, { fontSize: 20, color: 'grey' }]}> {'Available places:'} {route.params.amount_of_people}  </Text>
            <Text style={[styles.text, { fontSize: 20, color: 'grey' }]}> {route.params.driver === email ? 'You are the driver' : `Driver: ${route.params.driver.driverFirstName + ' ' + route.params.driver.driverLastName}`}  </Text>
            
            {passangersText}
            { 
            <Pressable
            onPress={() => showDirectionInMaps(route.params.dir)}
            style = {{marginTop: 20}}
            >
            <Text style={[styles.text, { fontSize: 20, fontWeight: 'bold', marginTop: 0, marginBottom: 10 }]}>
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
      color: '#888'
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

export default driveScreenIfFound;