import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Text, 
    
  } from 'react-native';
import MainWindow from "../../components/UI/MainWindow";
import { LinearGradient } from 'expo-linear-gradient';

const passengerScreen = props => {
    return (
        <View style={[styles.screen, {backgroundColor: '#fcefe3'}]}>
        <MainWindow 
          text="text for the textBox"
          buttonStr = "Search"
          passangerOrDriver = "passanger"
          navigation = {props.navigation}>
          </MainWindow>
        </View>
      );
  };

  const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
});

export default passengerScreen;