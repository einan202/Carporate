import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Card from "./Card";

const TextCard = props => {
    return (
        <Card>
            <View style={{ ...styles.textCard, ...props.style }}><Text>{props.text}</Text></View>
        </Card>
    );
};

const styles = StyleSheet.create({
    textCard: {

    }
});

export default TextCard;