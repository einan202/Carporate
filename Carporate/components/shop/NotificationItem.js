import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import style from 'react-native-modal-picker/style';
import Card from '../UI/Card';

export default function NotificationItem({title, body, time}) {
	return (
            <View style = {styles.notificationContainer}>
                <View style = {styles.title}>
                  <Text style = {styles.titleText}>{title}</Text>
                </View>
                <View style = {styles.body}>
                  <Text>{body}</Text>
                </View>
                <View style = {styles.time}>
                  <Text >{time}</Text> 
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center'
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20
  },
  body: {

  },
  bodyText: {

  },
  time: {
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  timeText: {
    fontSize: 50
  },
  notificationContainer: {
    margin: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 2,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 12,
    backgroundColor: "white",
    height: 200,
    width:330,
   
  },
});
