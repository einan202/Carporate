import React, { useState } from "react";
import { View, Text, Button, Platform, StyleSheet, TouchableOpacity,Alert } from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';

const DateTimeButton = props => {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateField, setDateField] = useState('Date');
    const [timeField, setTimeField] = useState('Time');

    const {onInputChange} = props;

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        let tempDate = new Date(currentDate);


        let Date1 = (tempDate) => 
        {
            if (tempDate.getDate()<10){
              return  `0${tempDate.getDate()}`
            }
            else {
                return  tempDate.getDate()
            }
        }
        let Month = (tempDate) => 
        {
            if (tempDate.getMonth()<10){
              return  `0${tempDate.getMonth()+1}`
            }
            else {
                return  tempDate.getMonth() + 1
            }
        }


        let fDate = Date1(tempDate) + '/' + Month(tempDate)  + '/' + tempDate.getFullYear();
        let Hours = (tempDate) => 
        {
            if (tempDate.getHours()<10){
              return  `0${tempDate.getHours()}`
            }
            else {
                return  tempDate.getHours()
            }
        }
        let Minutes = (tempDate) => 
        {
            if (tempDate.getMinutes()<10){
                return   `0${tempDate.getMinutes()}`
            }
            else {
                return  tempDate.getMinutes()
            }
        }
        let fTime = Hours(tempDate) + ':' + Minutes(tempDate);

        setDateField(fDate);
        setTimeField(fTime);
        onInputChange('date', fDate, true);
        onInputChange('time', fTime, true);
        
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

                <TouchableOpacity onPress={showTimepicker}  >
                    <View style={styles.picker}>
                        <Text style={styles.buttonText}>{timeField}</Text>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={showDatepicker}  >
                    <View style={styles.picker}>
                        <Text style={styles.buttonText}>{dateField}</Text>
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
        justifyContent: 'space-evenly',
        margin: 10,
        width: 400,
        maxWidth: "95%"
    },
    picker: {
        width: 150,
        borderColor: 'grey',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal:20
    },
    buttonText: {
        color: 'black'
    }
});

export default DateTimeButton;