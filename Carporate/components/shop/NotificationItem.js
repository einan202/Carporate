import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import style from 'react-native-modal-picker/style';
import Card from '../UI/Card';
import Colors from '../../constants/Colors';

export default function NotificationItem({title, body, time}) {
	return (
            <View style = {styles.notificationContainer}>
                <View style = {styles.title}>
                  <Text style = {styles.titleText}>{title}</Text>
                </View>
                <View style = {styles.body}>
                  <Text style = {{padding: 20}}>{body}</Text>
                </View>
                <View style = {styles.time}>
                  <Text style = {styles.timeText}>{time}</Text> 
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
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 25
  },
  body: {
    textAlign: 'center',
  },
  bodyText: {

  },
  time: {
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  timeText: {
    padding: 20, 
    fontWeight: 'bold', 
    color: Colors.primary,
    textAlign: 'center',
    justifyContent: 'center',
    flex: 1
  },
  notificationContainer: {
    margin: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 2,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 12,
    backgroundColor: "white",
    height: 280,
    width:365,
  },
});
