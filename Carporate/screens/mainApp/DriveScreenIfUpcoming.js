import React, { useState, useEffect, useReducer, useCallback } from "react";
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
  Linking,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import { showDirectionInMaps, getLegsDuration } from "../../functions/googleAPI";
import {
  deleteDriveForDriver,
  deleteDriveForPassanger,
  delaySpecificDrive,
} from "../../store/actions/drives";
import { LinearGradient } from 'expo-linear-gradient';
import Card from "../../components/UI/Card";
import DropDownButton from "../../components/UI/DropDownButton";
import Ionicons from '@expo/vector-icons/Ionicons';
import style from "react-native-modal-picker/style";

function DriveScreenIfUpcoming({ route, navigation }) {
  const email = useSelector((state) => state.auth.email);
  const firstName = useSelector((state) => state.auth.first_name);
  const LastName = useSelector((state) => state.auth.last_name);
  const userID = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const ifDriver = route.params.driver.driverEmail === email ? true : false;
  const [demorateTime, setDemorateTime] = useState(undefined);
  const passangerIndex = (passangers, passangerEmail) => {
    return passangers.findIndex((p) => p.email === passangerEmail);
  };
  const passangerIndexBySP = (drivePoints, passangerSP) => {
    return drivePoints.findIndex((dP) => dP.place_id === passangerSP.place_id);
  };
  function make_date (date, time){
    let date_arr = date.split('/');
    date_arr = date_arr.reverse();
    date_arr[1] = String (Number(date_arr[1]) - 1);
    let time_arr = time.split(':');
    let date_obj = new Date(`${date_arr[0]}`, `${date_arr[1]}`, `${date_arr[2]}`, `${time_arr[0] }`, `${time_arr[1]}`);
    return date_obj;
  }
  const dir = route.params.dir;
  const legsDuration = getLegsDuration(dir);

  const calcPickUpTime = (passangerEmail, time = undefined) => {
    let passangers = route.params.passangers;
    let passanger = passangers.find(p => p.email === passangerEmail);
    let pickUpLocation =  passanger.pickUpLocation;
    let PickUpIndexInLegs = route.params.drivePoints.findIndex(p => p.place_id === pickUpLocation.place_id);
    let driveDuration = legsDuration.slice(0,PickUpIndexInLegs).reduce((prev, curr) => prev + curr, 0);
    driveDuration = Math.floor(driveDuration);
    time = time ? time : new Date();
    time = new Date(time.getTime() + (60000 * driveDuration));
    let newMinutes = time.getMinutes();
    let newHour = time.getHours();
    if(newHour < 10){
      newHour = '0' + newHour.toString()
    }
    else{
      newHour = newHour.toString()
    }
    if(newMinutes < 10){
      newMinutes = '0' + newMinutes.toString()
    }
    else{
      newMinutes = newMinutes.toString()
    }
    let newTime = newHour.toString() + ':' + newMinutes.toString()
    
    return [driveDuration, newTime];
  };

  const passangersByOrder = !route.params.passangers
    ? undefined
    : route.params.passangers.sort((passangerA, passangerB) => {
        let passangerAIndex = passangerIndexBySP(
          route.params.drivePoints,
          passangerA.pickUpLocation
        );
        let passangerBIndex = passangerIndexBySP(
          route.params.drivePoints,
          passangerB.pickUpLocation
        );
        return passangerAIndex - passangerBIndex ;
      });

  const triggerNotificationHandler = (title, to, body) => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: to,
        data: {},
        title: title,
        body: body,
        priority: "high",
      }),
    });
  };

  const delayDrive = () => {
    dispatch(delaySpecificDrive(route.params.driveID, demorateTime));
    let to = route.params.passangers;
    let title = "Your drive will be delayed";
    if (to) {
      for (let i = 0; i < to.length; i++) {
        triggerNotificationHandler(
          title,
          to[i].pushToken,
          `${route.params.driver.driverFirstName} ${route.params.driver.driverLastName} that supposed to take you to ${to[i].destination.address} will be delayed around ${demorateTime} minutes.`
        );
      }
    }
    navigation.navigate("Loyalty");
  };

  const onInputChange = (id, value, isOK) => {
    setDemorateTime(value);
  };

  const startDrive = () => {
    let to = route.params.passangers;
    let title = "Your drive start";
    if (to) {
      for (let i = 0; i < to.length; i++) {
        triggerNotificationHandler(
          title,
          to[i].pushToken,
          `${route.params.driver.driverFirstName} ${route.params.driver.driverLastName} is on the way to take you to ${to[i].destination.address}, the estimated time he get to you are ${calcPickUpTime(to[i].email)[0]} minutes .`
        );
      }
    }
    showDirectionInMaps(route.params.dir);
  };

  const deleteDrive = () => {
    if (ifDriver) {
      let to = route.params.passangers;
      let title = "Your drive was deleted";
      if (to) {
        for (let i = 0; i < to.length; i++) {
          triggerNotificationHandler(
            title,
            to[i].pushToken,
            `The driver delete your drive to ${to[i].starting_point.address} on the ${route.params.date}`
          );
        }
      }
      try {
        dispatch(deleteDriveForDriver(route.params.driveID));
      } catch (err) {
        console.log(err);
      }
    } else {
      let to = route.params.driver.driverPushToken;
      let title = "Someone leave your drive";
      let body = `${firstName} ${LastName} leave your drive to ${route.params.destination} on ${route.params.date}`;

      triggerNotificationHandler(title, to, body);
      try {
        dispatch(deleteDriveForPassanger(route.params.driveID, userID));
      } catch (err) {
        console.log(err);
      }
    }
    navigation.navigate("Loyalty");
  };


  const passangersText =
    route.params.passangers !== undefined && route.params.passangers !== [] ? (
      <>
      <Text style={[styles.text, { fontSize: 20, color: 'black', marginTop: 20 }]}>
            Passengers:
      </Text>
      <FlatList
        data={passangersByOrder.map((passanger, index) => ({
          value: passanger,
          id: index,
        }))}
        keyExtractor={(item) => item.id}
        style={{
        }}

        renderItem={(itemData) => {
        
         
          let passanger_name = (
            <View style={{flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderBottomWidth:0.5,
              borderBottomEndRadius:5
             
          }}
>
            <Text style={[styles.text, { fontSize: 20, color: Colors.primary, textAlign: 'center', flex: 1, justifyContent: "center", }]}>
              {itemData.item.value.firstName} {itemData.item.value.lastName}
            </Text>
            </View>
          );

          let passanger_locations = (
            <>
              <Text style={{fontSize: 20, marginTop: 10, textAlign: 'center'}}>Ideal pick up:</Text>
              <Text style={[styles.text, { fontSize: 20, color: Colors.primary, textAlign: 'center', flex: 1 }]}>
                  {itemData.item.value.pickUpLocation.address}
                </Text>
              <View style={{flex: 1,
              justifyContent: "center",
              alignItems: "center",
              }}>
              <Pressable
                onPress={() =>
                  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${itemData.item.value.pickUpLocation.location.lat}%2C${itemData.item.value.pickUpLocation.location.lng}`)
                }
              >
                <Ionicons name="location-outline" size = {25} color = {Platform.OS === 'android' ? Colors.primary : ''}/> 
              </Pressable>
              </View>

              <Text style={{marginTop: 10, fontSize: 20, textAlign: 'center'}}>Ideal drop off:</Text>
              <Text style={[styles.text, { fontSize: 20, color: Colors.primary, textAlign: 'center', flex: 1 }]}>
                  {itemData.item.value.dropOffPoint.address}
                </Text>
                <View style={{flex: 1,
              justifyContent: "center",
              alignItems: "center",
              }}>
              <Pressable
                onPress={() =>
                  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${itemData.item.value.dropOffPoint.location.lat}%2C${itemData.item.value.dropOffPoint.location.lng}`)
                }
              >
                <Ionicons name="location-outline" size = {25} color = {Platform.OS === 'android' ? Colors.primary : ''}/> 

              </Pressable>
              </View>
            </>
          );

          return ifDriver ? (
            <View style={{flex: 1,
              justifyContent: "center",
              alignItems: "center",
              bottom: 0
              }}>
            <Card style = {{marginTop: 10,width: '70%'}}>
              
              {passanger_name}
              <View style = {{ flex: 1, marginTop:15,
              justifyContent: "center",
              alignItems: "center",}}>
              <Pressable
                onPress={() =>
                  Linking.openURL(`tel:${itemData.item.value.phone}`)
                }
              >
                <Ionicons name='call-outline' size = {25} color = {Platform.OS === 'android' ? Colors.primary : ''}/> 
              </Pressable>
              
             
              </View>
              
              {passanger_locations}
            </Card>
            </View>
          ) : (
            <View style={{flex: 1,
              justifyContent: "center",
              alignItems: "center",
              }}>
            <Card style={{marginTop: 20, width:"70%"}}>

            {passanger_name}
            {passanger_locations}
            </Card>
            </View>
          );
        }}
      />
      </>
    ) : (
      <View style={{ marginTop: 0 }}>
        <Text style={[styles.text, { fontSize: 20, color: 'black', padding: 10}]}>
        <Text style={{color: 'black'}}>Passengers:</Text><Text style={{color: Colors.primary,}}>{"\n"}No passengers have joined yet</Text>
        </Text>
      </View>
    );

  const fromTo = ifDriver ? (
    <Text style = {{ flexShrink: 1, flexWrap: 'wrap', flex: 1, fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
    {route.params.starting_point} {" ==> "} {route.params.destination}
    </Text>
  ) : (
    <Text style = {{fontWeight: 'bold', fontSize: 18, marginTop: 10, flex: 1}}>
      {
        route.params.passangers[passangerIndex(route.params.passangers, email)]
          .starting_point.address
      }{" "}
      {" ==> "}{" "}
      {
        route.params.passangers[passangerIndex(route.params.passangers, email)]
          .destination.address
      }
    </Text>
  );

  const pickUpTime = ifDriver ? null : <Text style={[styles.text, { fontSize: 20, color: 'black', marginTop: 0, fontWeight: '900' }]}>Estimated pick up time: <Text style={[styles.text, { fontSize: 20, color: Colors.primary, marginTop: 0 }]}>{calcPickUpTime(email, make_date(route.params.date, route.params.time))[1]} </Text> </Text>
  
  return (
    
    <LinearGradient colors={['#f7e8df', '#ffe3ff']} style={{flex:1}}>
      <Text style={[styles.text, { fontSize: 20, marginTop: 30, marginBottom: -10, color: 'black', fontWeight: '600'}]}> {fromTo}</Text>
      {route.params.newDriveInformation ? (
        <Text style={[styles.text, { fontSize: 20, color: 'black'}]}>
        {" "}
          {"Ideal pick up:\n"}{" "}
          {route.params.newDriveInformation.pickUpPoint.address}
        </Text>
      ) : (
        <Text></Text>
      )}
      <Text style={[styles.text, { fontSize: 20, color: Colors.primary, marginBottom: 5 }]}>
        {" "}
        {route.params.date} {"at"} {route.params.time}{" "}
      </Text>
      {pickUpTime}
      <Text style={[styles.text, { fontSize: 20, color: 'black', marginTop: 5 }]}>
        {" "}
        {"Available places:"} <Text style={[styles.text, { fontSize: 20, color: Colors.primary, marginTop: 0 }]}>{route.params.amount_of_people}{" "}</Text>
      </Text>
      {ifDriver ? (
        <Text style={[styles.text, { fontSize: 20, color: Colors.primary, marginTop: 20 }]}>
          {" "}
          <Text style={{color: 'black'}}>Driver: </Text>{"\n"}{"You are the driver"}{" "}
        </Text>
      ) : (
        <>
        <Text style={[styles.text, { fontSize: 20, color: Colors.primary, marginTop: 20}]}>
            {" "}
            <Text style={[styles.text, { fontSize: 20, color: 'black', fontWeight: '600'}]}>Driver: </Text>
            {'\n'} {`${
              route.params.driver.driverFirstName +
              " " +
              route.params.driver.driverLastName
            }`}{" "}
          </Text>
          <View style={{
              justifyContent: "center",
              alignItems: "center",
              }}>
        <Pressable
          onPress={() =>
            Linking.openURL(`tel:${route.params.driver.driverPhone}`)
          }
        >
          <Ionicons name='call-outline' size = {25} color = { Colors.primary }/> 
        </Pressable>
        </View>
        </>
      )}

      {passangersText}
      
      {
        <Pressable 
          onPress={() => showDirectionInMaps(route.params.dir)}
          style={{ marginTop: route.params.passangers ? '0%' : '50%' }}
        >
          <Text style={[styles.text, { fontSize: 20, fontWeight: '600', marginTop: 10, marginBottom: 10, color: Colors.primary}]}>
            Press here to show the ride on map
          </Text>
        </Pressable>
      }

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
        style={{ borderRadius: 50, }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DropDownButton
              style={{ zIndex: 10 }}
              array={[
                { label: "0 - 10 minutes", value: 10 },
                { label: "10 - 20 minutes", value: 20 },
                { label: "20 - 30 minutes", value: 30 },
                { label: "30 - 40 minutes", value: 40 },
                { label: "40 - 50 minutes", value: 50 },
                { label: "50 - 60 minutes", value: 60 },
                { label: "1 hour +", value: "1 hour +" },
              ]}
              placeHolder="delay time"
              onInputChange={onInputChange}
            />
            <View style={{ flexDirection: "row", marginTop: 200 }}>
              <View style={{ padding: 5 }}>
                <Button
                  color={Colors.primary}
                  title={"cancel"}
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.button}
                />
              </View>

              <View style={{ padding: 5 }}>
                <Button
                  color={Colors.primary}
                  title={"confirm"}
                  onPress={() => {
                    if (demorateTime === undefined) {
                      setDemorateTime(undefined);
                      Alert.alert(
                        "We sorry",
                        "you must choose your delay time",
                        [
                          {
                            text: "OK",
                            onPress: () => console.log("No Pressed"),
                            style: "cancel",
                          },
                        ]
                      );
                    } else if (demorateTime === "1 hour +") {
                      setDemorateTime(undefined);
                      Alert.alert(
                        "We sorry",
                        "if you will delay more than one hour you need to cancel your drive",
                        [
                          {
                            text: "OK",
                            onPress: () => console.log("No Pressed"),
                            style: "cancel",
                          },
                        ]
                      );
                    } else {
                      Alert.alert("Are you sure?", "", [
                        { text: "Yes", onPress: () => delayDrive() },
                        {
                          text: "No",
                          onPress: () => console.log("No Pressed"),
                          style: "cancel",
                        },
                      ]);
                    }
                  }}
                  style={styles.button}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
     
      {ifDriver ? (
        <View style={{ padding: 5 }}>
          <Button
            color={Colors.primary}
            title={"Delay this drive"}
            onPress={() => setModalVisible(true)}
          />
        </View>
      ) : null}

      {ifDriver ? (
        <View style={{ padding: 5 }}>
          <Button
            color={Colors.primary}
            title={"Start this drive"}
            onPress={() =>
              Alert.alert("Are you sure?", "", [
                { text: "Yes", onPress: () => startDrive() },
                {
                  text: "No",
                  onPress: () => console.log("No Pressed"),
                  style: "cancel",
                },
              ])
            }
            style={styles.button}
          />
        </View>
      ) : null}

      <View style={{ padding: 5,  }}>
        <Button
          color={Colors.primary}
          title={ifDriver ? "delete this drive" : "leave this drive"}
          onPress={() =>
            Alert.alert("Are you sure?", "", [
              { text: "Yes", onPress: () => deleteDrive() },
              {
                text: "No",
                onPress: () => console.log("No Pressed"),
                style: "cancel",
              },
            ])
          }
        />
      
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  text: {
    textAlign: "center",
    fontFamily: "fontawesome-webfont",
    fontSize: 17,
    color: "black",
    margin:3

  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 20,
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
    borderWidth: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    height: 350,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
  },
});

export default DriveScreenIfUpcoming;
