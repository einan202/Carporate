import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Button
} from 'react-native';
import Colors from '../../constants/Colors';


import Card from '../UI/Card';
import CollapseView from '../UI/CollapseView';

const DriveItem = props => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
      <Text style={styles.text}> {props.starting_point} {'-->'} {props.destination}</Text>
        <Text style={styles.text}> {props.date} {'at'} {props.time}  </Text>
        <Text style={styles.text}>  {'available spaces:'} {props.amount_of_people}  </Text>
        <Text style={styles.text}>  {'the driver is:'} {props.driver}  </Text>
      </View>
      <Button
         color={Colors.primary}
         title="choose this drive"
         onPress={props.onSelect}
         style = {styles.button}/>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 150,
    margin: 20
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  details: {
    alignItems: 'center',
    height: '17%',
    padding: 10
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
    marginVertical: 2
  },
  text: {
    textAlign: 'center',
    fontFamily: 'open-sans',
    fontSize: 17,
    color: '#888'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '23%',
    paddingHorizontal: 20
  },
  button: {
    marginBottom: 10
  }
});

export default DriveItem;
