import React from 'react';
import {
  View,
  Text,
} from 'react-native';

export default function NotificationItem({title, body, time}) {
	return (
            <View>
                <Text>title: {title}</Text>
                <Text>body: {body}</Text>
                <Text>time: {time}</Text> 
            </View>
    )
}
