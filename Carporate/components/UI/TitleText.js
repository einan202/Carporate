import React from "react";
import { Text, StyleSheet } from "react-native";

const TitleText = props => <Text style={{ ...styles.title, ...props.style }}>{props.children}</Text>

const styles = StyleSheet.create({
    title: {
        // fontFamily: 'open-sans-bold',
        // fontSize: 18
        fontFamily: "fontawesome-webfont",
        fontWeight: '800',
    }
});

export default TitleText;