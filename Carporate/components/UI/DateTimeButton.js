import React, { useState } from "react";
import { View, Text, Button, Platform, StyleSheet, TouchableOpacity,Alert } from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';

const DateTimeButton = props => {
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateField, setDateField] = useState('date field');
    const [timeField, setTimeField] = useState('time field');

    const { onInputChange} = props;

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();

        setDateField(fDate);
        setTimeField(fTime);
        onInputChange('date', fDate, true);
        onInputChange('time', fTime, true);
        console.log(fDate + ' (' + fTime + ') ');
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    return (
        <View>
            <View style={styles.buttonContainer}>

                <TouchableOpacity onPress={showDatepicker}  >
                    <View style={styles.picker}>
                        <Text style={styles.buttonText}>{dateField}</Text>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={showTimepicker}  >
                    <View style={styles.picker}>
                        <Text style={styles.buttonText}>{timeField}</Text>
                    </View>
                </TouchableOpacity>

            </View>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
        width: 250,
        maxWidth: "90%"
    },
    picker: {
        borderColor: 'grey',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10
    },
    buttonText: {
        color: 'grey'
    }
});

export default DateTimeButton;