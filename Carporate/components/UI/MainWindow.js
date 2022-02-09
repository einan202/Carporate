import React, { useState, useEffect, useReducer, useCallback } from "react";
import { View, Text, StyleSheet, Button, Alert, ScrollView } from "react-native";

import Input from "./Input";
import TextCard from "./TextCard";
import TitleText from "./TitleText";
import DateTimeButton from "./DateTimeButton";
import DropDownButton from "./DropDownButton";
import FiltersScreen from "./FiltersScreen";
import { useDispatch,useSelector } from 'react-redux';
import * as drivesActions from '../../store/actions/drives';
import Colors from '../../constants/Colors';
import * as passangerActions from '../../store/actions/passanger';
import { navigationOptions } from "../../screens/auth/AuthScreen";


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
          deviationKm : '',
          email: email
        },
        inputValidities: {
          starting_point: false,
          destination: false,
          date: false,
          time: false,
          amount_of_people: false,
          deviation_time: false,
          deviationKm: false
        },
        formIsValid: false
      });

      useEffect(() => {
        if (error) {
          Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
        }
      }, [error]);
    
      const driverPassangerHandler = async () => {
        let action;
        if(props.passangerOrDriver === "driver")
        {
          action = drivesActions.post_drive(
          formState.inputValues.starting_point,
          formState.inputValues.destination,
          formState.inputValues.date,
          formState.inputValues.time,
          formState.inputValues.amount_of_people,
          formState.inputValues.deviation_time,
          email,
        );
      }
      else {
          action = passangerActions.searchDrives(
          formState.inputValues.starting_point,
          formState.inputValues.destination,
          formState.inputValues.date,
          formState.inputValues.time,
          formState.inputValues.amount_of_people,
          formState.inputValues.deviationKm,
          email,
        );
      }
        setError(null);
        setIsLoading(true);
        try {
          await dispatch(action);
          if(props.passangerOrDriver === "passanger"){
            props.navigation.navigate('foundedDrivesScreen');
          }
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

      const deviationArray =  props.passangerOrDriver === "driver" ?
      [
        { label: '0 min', value: '0' },
        { label: '10 min', value: '10' },
        { label: '20 min', value: '20' },
        { label: '30 min', value: '30' },
        { label: '40 min', value: '40' },
    ] :
    [
      { label: '1 km', value: '1' },
      { label: '5 km', value: '5' },
      { label: '10 km', value: '10' },
      { label: '20 km', value: '20' },
      { label: '30 km', value: '30' },
  ];

    return (
      <ScrollView>
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
                array = {deviationArray}
                placeHolder = {props.passangerOrDriver === "driver" ? "deviation time" : "kilometrs deviation"}
                id = {props.passangerOrDriver === "driver" ? "deviation_time" : "deviationKm"}
                onInputChange ={inputChangeHandler}
            />
            
            <View style = {styles.filtersContainer}>
                <FiltersScreen />
            </View>
            <View style = {styles.buttonContainer}>
            <Button
            title={props.buttonStr}
            color={Colors.primary}
            onPress={driverPassangerHandler}
            />
            </View>
            
          </View>
        </ScrollView>
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