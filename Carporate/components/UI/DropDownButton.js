import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";

import DropDownPicker from 'react-native-dropdown-picker';

const DropDownButton = props => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(props.array);

    const {onInputChange, id} = props;

    let outside = {
        flexDirection: 'row',
        width: props.style &&  props.style.width ? props.style.width : 150,
        marginHorizontal: 13,
        ...props.outside
    }
    return (
        <View style={{...outside}}>
            <DropDownPicker
                style={{ ...styles.picker, ...props.style }}
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
                dropDownDirection="BOTTOM"
                
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: 150 ,
        marginHorizontal: 13,
        
        
        
    },
    picker: {
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
        width: 150,

        
    }
});

export default DropDownButton;