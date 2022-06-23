import React from "react";
import { View, Text, StyleSheet,Button } from "react-native";

import MainWindow from "../../components/UI/MainWindow";
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const DriverScreen = props => {
    return (  
        <LinearGradient colors={['#f7e8df', '#ffe3ff']} style={{flex:1}}>
            <MainWindow 
            text="text for the textBox"
            buttonStr = "Post the drive"
            passangerOrDriver = "driver"
            navigation = {props.navigation}>
             </MainWindow>
         </LinearGradient>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
});

export default DriverScreen;