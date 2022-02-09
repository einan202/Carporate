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
  FlatList
} from 'react-native';
import Colors from '../../constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Drive from '../../models/drive'
import * as drivesActions from '../../store/actions/drives'
import DriveItem from '../../components/shop/DriveItem';


const foundedDrivesScreen = props => {
    const foundedDrives = useSelector(state => state.passanger.foundedDrives);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    if (error) {
        return (
          <View style={styles.centered}>
            <Text>An error occurred!</Text>
            <Text>Try again late!</Text>
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

    if (!isLoading && foundedDrives.length === 0) {
        return (
          <View style={styles.centered}>
            <Text>We sorry, we don't find any drive for you</Text>
            <Text>Try again later</Text>
          </View>
        );
    }

    const selectDrive = () => {
        Alert.alert('Are you sure?','we will send to the driver a request',[
          { text: 'Yes', onPress: () => console.log('Yes Pressed') },
          {text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel'},
        ]) 
    };

    return (
        <FlatList
          ListHeaderComponent={<Text style = {{textAlign:'center', fontSize:16, fontFamily: 'open-sans-bold'}}>These are the drives we found for you </Text>}
          refreshing={isRefreshing}
          data={foundedDrives}
          keyExtractor = {item => item.id}
          renderItem = {itemData =>
          (<DriveItem
              starting_point = {itemData.item.starting_point}
              destination = {itemData.item.destination}
              date = {itemData.item.date}
              time = {itemData.item.time}
              amount_of_people = {itemData.item.amount_of_people}
              deviation_time = {itemData.item.deviation_time}
              driver = {itemData.item.driver}
              passangers = {itemData.item.passangers}
              onSelect={() => selectDrive()}
              moreDetails = {()=>{}}
              showButton = {
              <View style = {styles.buttonContainer}>
              <Button
                 color = {Colors.primary}
                 title = "choose this drive"
                 onPress = {() => selectDrive()}
                 style = {styles.button}/>
                </View>}
          />)}
        />
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    buttonContainer: {
        padding:5,
      }
});

export default foundedDrivesScreen;