import React from "react";
import { View, Text, StyleSheet,Button } from "react-native";

import MainWindow from "../../components/UI/MainWindow";
import Colors from '../../constants/Colors';

const driverScreen = props => {
    return (
        <View style={styles.screen}>
            <MainWindow 
            text="text for the textBox"
            buttonStr = "Post the drive"
            passangerOrDriver = "driver"
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

export default driverScreen;