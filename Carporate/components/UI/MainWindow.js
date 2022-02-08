import React, { useState, useEffect, useReducer, useCallback } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";

import Input from "./Input";
import TextCard from "./TextCard";
import TitleText from "./TitleText";
import DateTimeButton from "./DateTimeButton";
import DropDownButton from "./DropDownButton";
import FiltersScreen from "./FiltersScreen";
import { useDispatch,useSelector } from 'react-redux';
import * as drivesActions from '../../store/actions/drives';
import * as passangerActions from '../../store/actions/passanger';
import Colors from '../../constants/Colors';



const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};


const MainWindow = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();
    const email = useSelector(state => state.auth.email);
    

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
          starting_point: '',
          destination: '',
          date: '',
          time: '',
          amount_of_people: '',
          deviation_time: '',
          email: email
        },
        inputValidities: {
          starting_point: false,
          destination: false,
          date: false,
          time: false,
          amount_of_people: false,
          deviation_time: false
        },
        formIsValid: false
      });

      useEffect(() => {
        if (error) {
          Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
        }
      }, [error]);
    
      const driverHandler = async () => {
        let action = drivesActions.post_driver(
          formState.inputValues.starting_point,
          formState.inputValues.destination,
          formState.inputValues.date,
          formState.inputValues.time,
          formState.inputValues.amount_of_people,
          formState.inputValues.deviation_time,
          email,
        );
        setError(null);
        setIsLoading(true);
        try {
          await dispatch(action);
          
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
          });
        },
        [dispatchFormState]
      );

    return (
        <View style={styles.screen}>
            <View>
                <TitleText style={styles.textBoxHeader}>Explanation:</TitleText>
            </View>
            <View style={styles.textBox}>
                <TextCard text={props.text}></TextCard>
            </View>
            <Input style={styles.textField}
                blurOnSubmit
                placeholder="starting point"
                underlineColorAndroid="transparent"
                id="starting_point"
                keyboardType="default"
                required
                errorText="Please enter a valid starting point."
                onInputChange={inputChangeHandler}
                initialValue=""
            />
            <Input style={styles.textField}
                blurOnSubmit
                placeholder="destination"
                underlineColorAndroid="transparent"
                id="destination"
                keyboardType="default"
                required
                errorText="Please enter a valid destination."
                onInputChange={inputChangeHandler}
                initialValue=""
            />
            <View>
                <Text>
                    <DateTimeButton
                    onInputChange={inputChangeHandler}
                    />
                </Text>
            </View>
            <DropDownButton
                // style={{ zIndex: 10 }}
                array={[
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                ]}
                placeHolder="amount of people"
                id = "amount_of_people"
                onInputChange = {inputChangeHandler}
            />
            <DropDownButton
                // style={{ zIndex: 9 }}
                array={[
                    { label: '0 min', value: '0' },
                    { label: '10 min', value: '10' },
                    { label: '20 min', value: '20' },
                    { label: '30 min', value: '30' },
                    { label: '40 min', value: '40' },
                ]}
                placeHolder="deviation time"
                id = "deviation_time"
                onInputChange ={inputChangeHandler}
            />
            
            <View style = {styles.filtersContainer}>
                <FiltersScreen />
            </View>
            <View style = {styles.buttonContainer}>
            <Button
            title={props.buttonStr}
            color={Colors.primary}
            onPress={driverHandler}
            />
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    textBoxHeader: {
        margin: 10
    },
    textBox: {
        margin: 10
    },
    textField: {
        marginVertical: 10
    },
    buttonContainer : {
        margin: 10
    },
    filtersContainer : {
        margin: 10,
        flex: 1

    }
});

export default MainWindow;