import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";
import { useSelector } from "react-redux";
import { showDirectionInMaps } from "../../functions/googleAPI";
import { useEffect, useLayoutEffect } from "react";

import Card from "../UI/Card";
import CollapseView from "../UI/CollapseView";

const upcomingDriveItem = (props) => {
  let TouchableCmp = TouchableOpacity;
  const email = useSelector((state) => state.auth.email);

  const passangerIndex = (passangers, passangerEmail) => {
    return passangers.findIndex((p) => p.email === passangerEmail);
  };

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  const [modalVisible, setModalVisible] = useState(false);

  const passangersText =
    props.passangers !== undefined && props.passangers !== [] ? (
      <FlatList
        ListHeaderComponent={
          <Text style={[styles.text, { fontSize: 20 }]}>
            Passengers:
          </Text>
        }
        data={props.passangers.map((passanger, index) => ({
          value: passanger,
          id: index,
        }))}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <Text style={[styles.text, { fontSize: 20 }]}>
            {itemData.item.value}{" "}
          </Text>
        )}
      />
    ) : (
      <View style={{ marginTop: 0 }}>
        <Text style={[styles.text, { fontSize: 20 }]}>
          There are still no passengers to this drive
        </Text>
      </View>
    );

  const fromTo =
    props.driver.driverEmail === email || props.whereToNavigate === "FoundDrive" ? (
      <Text style={{fontWeight: 'bold'}}>
        {" "}
        {props.starting_point.address} {" ==> "} {props.destination.address}
      </Text>
    ) : (
      <Text style={{fontWeight: 'bold'}}>
        {
          props.passangers[
            passangerIndex(props.passangers, email)
          ].starting_point.address
        }{" "}
        {" ==> "}{" "}
        {
          props.passangers[
            passangerIndex(props.passangers, email)
          ].destination.address
        }
      </Text>
    );

  return (
    <Card
      style={{
        height: props.showButton ? 300 : 250,
        margin: 10,
      }}
    >
      <View style={styles.touchable}>
        <Text style={styles.text}>
          {" "}
          {fromTo}
        </Text>
        <Text style={styles.text}>
          {" "}
          {props.date} {"at"} {props.time}{" "}
        </Text>
        <Text style={styles.text}>
          {" "}
          {"Available places:"} {props.amount_of_people}{" "}
        </Text>
        <Text style={styles.text}>
          {" "}
          {props.driver.driverEmail === email
            ? "You are the driver"
            : `Driver: ${props.driver.driverFirstName} ${props.driver.driverLastName}`}{" "}
        </Text>
      </View>
      {props.showButton}
      {/* <Modal
          animationType="slide"
          transparent = {true}
          visible={modalVisible}
          onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
            <View style={styles.centeredView}>
            <Card style={{
              height: 400,
               margin: 20,
            }}>
              <View style={styles.touchable}>
              <Text style={[styles.text, {fontSize: 20}]}> {props.starting_point.address} {'-->'} {props.destination.address}</Text>
              {props.newDriveInformation ?  
              <Text style={[styles.text, {fontSize: 20}]}> {'The pick up address is:\n'} {props.newDriveInformation.pickUpPoint.address}</Text> : <Text></Text>
              }
              <Text style={[styles.text, {fontSize: 20}]}> {props.date} {'at'} {props.time}  </Text>
              <Text style={[styles.text, {fontSize: 20}]}> {'available spaces:'} {props.amount_of_people}  </Text>
              <Text style={[styles.text, {fontSize: 20}]}> {props.driver === email ? 'You are the driver' : `the driver is: ${props.driver}`}  </Text>
              </View>
              {passangersText}
              {props.map === true ? 
              <Pressable
              onPress={() => showDirectionInMaps(props.dir)}
              style = {{marginTop: 20}}
              >
              <Text style={[styles.text, {fontSize: 20, marginTop:0}]}>Press here to show the ride on map</Text>
              </Pressable> : <Text></Text>}
              <View >
              <Pressable
              onPress={() => setModalVisible(!modalVisible)}
              style = {{marginBottom: 0}}
              >
              <Text style={[styles.text, {fontSize: 20, marginBottom:0}]}>Close</Text>
              </Pressable>
              </View>
            </Card>
            </View>
        </Modal> */}

{/* <View style={{flex: 1, justifyContent: "center", alignItems: "center",}}>
            <Image
                source={require('./map.jpg')}
                          style={{
                              height: 80,
                              width: 120,
                              marginTop: 5,
                          
                          }}          
           /></View> */}
      <View style={{ marginTop: 0, backgroundColor: 'white' }}>
        {/* <TouchableOpacity  onPress={() => setModalVisible(!modalVisible)}> */}
        <TouchableOpacity 
          onPress={() =>
            props.navigation.navigate(`${props.whereToNavigate}`, {
              starting_point: props.starting_point.address,
              destination: props.destination.address,
              date: props.date,
              time: props.time,
              passangers: props.passangers,
              amount_of_people: props.amount_of_people,
              driver: props.driver,
              dir: props.dir,
              driveID: props.driveID,
              newDriveInformation: props.newDriveInformation,
              drivePoints: props.drivePoints,
            })
          }
        ><View style= {{margin:3}}><Text style={{
              textAlign: "center",
              fontSize: 18,
              color: Colors.primary,
              fontFamily: "fontawesome-webfont",
              fontWeight: '900',
            }}>More details</Text></View>
        </TouchableOpacity>
        
        {/* <View style={{flex: 1, justifyContent: "center", alignItems: "center",}}>
            <Image
                source={require('./map.jpg')}
                          style={{
                              height: 110,
                              width: 110,
                              marginTop: 5,
                          
                          }}          
           /></View> */}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  text: {
    textAlign: "center",
    fontFamily: "fontawesome-webfont",
    fontSize: 16,
    color: "black",
    margin:3
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    padding: 12,
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 20,
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
    borderWidth: 20,
  },
});

export default upcomingDriveItem;
