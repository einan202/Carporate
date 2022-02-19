import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";

import DropDownPicker from 'react-native-dropdown-picker';

const DropDownButton = props => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(props.array);

    const {onInputChange, id} = props;


    return (
        <View style={styles.container}>
            <DropDownPicker
                // style={{ ...styles.picker, ...props.style }}
                placeholder={props.placeHolder}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                onChangeValue={(value) => {
                    onInputChange(id, value, true)
                  }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 70,
        justifyContent: 'center',
        width: 240,
    },
    picker: {
        borderColor: 'grey',
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 10
    }
});

export default DropDownButton;