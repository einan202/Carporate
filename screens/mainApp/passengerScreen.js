import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Text, 
    
  } from 'react-native';
import MainWindow from "../../components/UI/MainWindow";

const passengerScreen = props => {
    return (
        <View style={styles.screen}>
        <MainWindow 
          text="text for the textBox"
          buttonStr = "Search"
          passangerOrDriver = "passanger">
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