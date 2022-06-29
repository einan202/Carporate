import React, { useState, useEffect, useReducer, useCallback } from "react";
import { Image } from 'react-native';
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
} from "react-native";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import * as drivesActions from "../../store/actions/drives";
import DriveItem from "../../components/shop/DriveItem";
import * as Notifications from "expo-notifications";
import { LinearGradient } from 'expo-linear-gradient';

const LoyaltyScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const drives = useSelector((state) => state.drives.userDrives);
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email);
  const userID = useSelector((state) => state.auth.userId);
  const first_name = useSelector((state) => state.auth.first_name);
  const last_name = useSelector((state) => state.auth.last_name);
  const phone_number = useSelector((state) => state.auth.phone_number);
  const age = useSelector((state) => state.auth.age);
  const gender = useSelector((state) => state.auth.gender);

  const triggerNotificationHandler = (
    driveData,
    passangerpushToken,
    title,
    body,
    data,
    passangerEmail,
    drivekey,
    newDriveInformation,
    passangerFirstName,
    passangerLastName,
    passangerUserID,
    passangerPhone
  ) => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: passangerpushToken,
        data: data,
        title: title,
        body: body,
      }),
    });

    

    if (title === "You have received permission to join the drive") {
      const action = drivesActions.joinDrive(
        driveData,
        passangerEmail,
        passangerpushToken,
        passangerFirstName,
        passangerLastName,
        passangerPhone,
        passangerUserID,
        newDriveInformation
      );
      try {
        dispatch(action);
      } catch {
        (err) => console.log(err);
      }
    }
  };

  useEffect(() => {
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        Notifications.scheduleNotificationAsync({
          content: {
            title: response.notification.request.content.title,
            body: response.notification.request.content.body,
            data: response.notification.request.content.data,
          },
          trigger: {
            seconds: 1,
          },
        });
      });

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener(async function (response) {

        const content = response.request.content;

        let title = content.title;
        let body = content.body;

        if (content.title === "You received a request to join a drive") {
          const passangerFirstName = content.data.passangerFN;
          const passangerLastName = content.data.passangerLN;
          const passangerEmail = content.data.passangerEmail;
          const passangerPhone = content.data.passangerPhone;
          const driveData = content.data.driveData;
          const drivekey = driveData.id;
          const passangerpushToken = content.data.passangerPushToken;
          const passangerUserID = content.data.passangerUserID;
          const newDriveInformation = content.data.newDriveInformation;

          body = `${passangerFirstName} ${passangerLastName} asked to join your drive from ${driveData.starting_point.address} 
          to ${driveData.destination.address} in ${driveData.date}, you still have ${driveData.amount_of_people} places. Do you accept? \n This will extend the ride by ${newDriveInformation.devationTime} minutes `;

          Alert.alert("You received a request to join a drive", body, [
            {
              text: "Yes",
              onPress: () =>
                triggerNotificationHandler(
                  driveData,
                  passangerpushToken,
                  "You have received permission to join the drive",
                  "",
                  content.data,
                  passangerEmail,
                  drivekey,
                  newDriveInformation,
                  passangerFirstName,
                  passangerLastName,
                  passangerUserID,
                  passangerPhone
                ),
            },
            {
              text: "No",
              onPress: () =>
                triggerNotificationHandler(
                  driveData,
                  passangerpushToken,
                  "We sorry",
                  "You do not have permission to join the drive",
                  content.data,
                  passangerEmail,
                  drivekey,
                  newDriveInformation,
                  passangerFirstName,
                  passangerLastName,
                  passangerUserID,
                  passangerPhone
                ),
              style: "cancel",
            },
          ]);
        } else if (
          content.title === "You have received permission to join the drive"
        ) {
          const driveData = content.data.driveData;
          const newDriveInformation = content.data.newDriveInformation;
          body = `${driveData.driver.driverEmail} accept you to join his drive from ${driveData.starting_point.address} to ${driveData.destination.address} in ${driveData.date}. Your pick up address is ${newDriveInformation.pickUpPoint.address}`;
          Alert.alert("You have received permission to join the drive", body, [
            { text: "OK", onPress: () => {}, style: "cancel" },
          ]);
        } else if (content.title === "Your drive was deleted") {
          Alert.alert(content.title, content.body, [
            { text: "OK", onPress: () => {}, style: "cancel" },
          ]);
        } else if (content.title === "Someone leave your drive") {
          Alert.alert(content.title, content.body, [
            { text: "OK", onPress: () => {}, style: "cancel" },
          ]);
        } else if (content.title === "Your drive start") {
          Alert.alert(content.title, content.body, [
            { text: "OK", onPress: () => {}, style: "cancel" },
          ]);
        } else if (content.title === "Your drive will be delayed") {
          Alert.alert(content.title, content.body, [
            { text: "OK", onPress: () => {}, style: "cancel" },
          ]);
        } else {
          const driveData = content.data.driveData;
          body = `You do not have permission to join the drive from ${driveData.starting_point.address} to ${driveData.destination.address} in ${driveData.date}. You can try another drive`;
          Alert.alert("We sorry", body, [
            { text: "OK", onPress: () => {}, style: "cancel" },
          ]);
        }

        let notificationToUpload = { title, body, time: new Date() };

        let userJson = await fetch(
          `https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}.json`
        );
        let userDetails = await userJson.json();

        let notifications = userDetails.notifications;
        if (notifications) {
          notifications.unshift(notificationToUpload);
        } else {
          notifications = [notificationToUpload];
        }

        driverDetailsJson = await fetch(
          `https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}.json`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              notifications: notifications,
            }),
          }
        );
      });
      
      
  }, []);

  const loadDrives = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(drivesActions.fetchDrives(userID));
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

  const credentials = (
    <>
       <View style={{
            backgroundColor: "#FFF",
            flex: 1
      }}>
      <View style={{
                    // backgroundColor: "#00a46c",
                    // backgroundColor: "#FFA500",
                    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
                    height: "1020%",
                    borderBottomRightRadius: 20,
                    borderBottomLeftRadius: 20,
                    paddingHorizontal: 20,
                }}
      >
      <Image
          source={require('./1.png')}
                    style={{
                        height: 10,
                        width: 20,
                        marginTop: 30,
                    }}          
      />
      </View></View>


      
      <View style = {{marginTop: 10, marginBottom: 0}}>
        <Text style={{ fontSize: 30, textAlign: 'center', color: 'white'}}>Hello {first_name}</Text>
      </View>
      <View>
      <Text
        style={{
          fontSize: 24,
          flex: 1,
          textAlign: "center",
          fontFamily: "fontawesome-webfont",
          fontWeight: 'bold',
          color: "white",
        }}
      >
        Personal Info
      </Text>
      </View>

      
      { <View style={styles.textContainer}>
        <Text style={{ fontSize: 16, textAlign: 'center'}}> Email: {email} </Text>
      </View> }
      { <View style={styles.textContainer}>
        <Text style={{ fontSize: 16, textAlign: 'center'}}> Name: {first_name} {last_name}</Text>
      </View> }
      { <View style={styles.textContainer}>
        <Text style={{ fontSize: 16, textAlign: 'center'}}>  Phone: {phone_number} </Text>
      </View> }
      { <View style={styles.textContainer}>
        <Text style={{ fontSize: 16, textAlign: 'center'}}> Gender: {gender} </Text>
      </View> }
      { <View style={styles.textContainer}>
        <Text style={{ fontSize: 16, textAlign: 'center'}}> Age: {age} </Text>
      </View> }


      <View style = {{marginTop: 10}}>
      <Text
        style={{
          fontSize: 24,
          textAlign: "center",
          fontFamily: "fontawesome-webfont",
          fontWeight: 'bold',
          color: "white",
        }}
      >
        Upcoming Rides
      </Text>
      </View>
      {/* { <View style={styles.textContainer}>
        <Text style={{ fontSize: 16 }}> E-Mail: {email} </Text>
      </View> }
      { <View style={styles.textContainer}>
        <Text style={{ fontSize: 16}}> E-Mail: {email} </Text>
      </View> }
      { <View style={styles.textContainer}>
        <Text style={{ fontSize: 16 }}> E-Mail: {email} </Text>
      </View> }
      { <View style={styles.textContainer}>
        <Text style={{ fontSize: 16 }}> E-Mail: {email} </Text>
      </View> } */}
      {/* { <View style={styles.textContainer}>
        <Text style={{ fontSize: 16 }}> Last name:{last_name} </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={{ fontSize: 16 }}> Phone-Number: {phone_number}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={{ fontSize: 16 }}> Age: {age}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={{ fontSize: 16 }}> Gender: {gender}</Text>
      </View> } */}

    </>
  );

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{textAlign: 'center', marginTop: 0, fontSize: 20,fontFamily: "fontawesome-webfont",
              fontWeight: '900',color: 'grey'}}>An error occurred!</Text>
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
    <LinearGradient colors={['#f7e8df', '#ffe3ff']} style={{flex:1}}>
    <FlatList
      ListHeaderComponent={credentials}
      onRefresh={loadDrives}
      refreshing={isRefreshing}
      data={drives}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <DriveItem
          style = {{ marginTop: 30, flex: 1}}
          starting_point={itemData.item.starting_point}
          destination={itemData.item.destination}
          date={itemData.item.date}
          time={itemData.item.time}
          amount_of_people={itemData.item.amount_of_people}
          deviation_time={itemData.item.deviation_time}
          driver={itemData.item.driver}
          passangers={itemData.item.passangers}
          onSelect={() => selectDrive()}
          moreDetails={() => {}}
          map={true}
          waypoints={
            itemData.item.dir ? itemData.item.dir.geocoded_waypoints : undefined
          }
          dir={itemData.item.dir}
          whereToNavigate={"UpcomingDrive"}
          navigation={props.navigation}
          driveID={itemData.item.id}
          drivePoints = {itemData.item.drivePoints}
        />
      )}
      ListEmptyComponent={
        <View>
        <Text style={{ fontSize: 16, textAlign: 'center', padding: 5, color: 'white'}}> No Rides </Text>
      </View> 
      }
    /></LinearGradient>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 10,
    padding: 20,
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 12,
    backgroundColor: "white",
  },
});

export default LoyaltyScreen;
