import React, { useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import NotificationItem from '../../components/shop/NotificationItem'; 

// const userID = useSelector(state => state.auth.userId);
let userID = "-N07FXJEl1oLMCrPII0Q";

const Cred = 
    <View><Text style = {{fontSize: 20, textAlign: 'center', fontFamily:'open-sans-bold'}}>Your Notifications</Text></View>

const notificationScreen = async (props) => {
 
  try {
    let response = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}.json`)
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const resData = await response.json();
    const notifications = resData.notifications;
   
  return (
    <FlatList
    ListHeaderComponent={Cred}
    // onRefresh={loadDrives}
    // refreshing={isRefreshing}
    data={notifications}
    // keyExtractor = {item => item.id}
    renderItem = {itemData =>
    (<NotificationItem
        title = {itemData.item.title}
        body = {itemData.item.body}
        time = {itemData.item.time}
    />)}
    ListEmptyComponent = {
      <View style={styles.centered}>
        <Text>No notifications found</Text>
      </View>
  }
  />
  );}
  catch {}
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

export default notificationScreen;
