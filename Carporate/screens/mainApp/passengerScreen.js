import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Text, 
    
  } from 'react-native';
import MainWindow from "../../components/UI/MainWindow";
import { LinearGradient } from 'expo-linear-gradient';

const PassengerScreen = props => {
    return (
      <LinearGradient colors={['#f7e8df', '#ffe3ff']} style={{flex:1}}>
        {/* <View style={[styles.screen, {flex: 1,backgroundColor: '#fcefe3'}]}> */}
        <MainWindow 
          text="text for the textBox"
          buttonStr = "Search"
          passangerOrDriver = "passanger"
          navigation = {props.navigation}>
          </MainWindow>
        {/* </View> */}
        </LinearGradient>
      );
  };

  const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
});

export default PassengerScreen;