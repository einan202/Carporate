import React, { useState, useEffect, useReducer, useCallback } from "react";
import { View, Text, StyleSheet, Button, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView } from "react-native";

import DateTimeButton from "./DateTimeButton";
import DropDownButton from "./DropDownButton";
import FiltersScreen from "./FiltersScreen";
import { useDispatch,useSelector } from 'react-redux';
import * as drivesActions from '../../store/actions/drives';
import Colors from '../../constants/Colors';
import * as passangerActions from '../../store/actions/passanger';
import AutoCompleteSearch from "../../functions/AutoCompleteSearch";


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
    const userID = useSelector(state => state.auth.userId);
    const pushToken = useSelector(state => state.auth.pushToken);
    const firstName = useSelector(state => state.auth.first_name);
    const LastName = useSelector(state => state.auth.last_name);
    const phone = useSelector(state => state.auth.phone_number);
    const [start_point_place, setStart_point_place] = useState({
      address: undefined,
      place_id: undefined, 
      location: {
        lat: undefined, 
        lng: undefined
      }
    });

    const [destination, setDestination] = useState({
      address: undefined,
      place_id: undefined, 
      location: {
        lat: undefined, 
        lng: undefined
      }
    });





    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
          date: undefined,
          time: undefined,
          amount_of_people: undefined,
          deviation_time: undefined,
          deviationKm : undefined,
        },
        inputValidities: {
          date: false,
          time: false,
          amount_of_people: false,
          deviation_time: false,
          deviationKm: false,
        },
        formIsValid: false
      });

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

      useEffect(() => {
        if (error) {
          Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
        }
      }, [error]);
    
      const driverPassangerHandler = async () => {
        let action;
        if(props.passangerOrDriver === "driver")
        {
          if(start_point_place)
          action = drivesActions.post_drive(
          start_point_place,
          destination,
          formState.inputValues.date,
          formState.inputValues.time,
          formState.inputValues.amount_of_people,
          formState.inputValues.deviation_time,
          email,
          pushToken,
          firstName,
          LastName,
          phone,
          userID
        );
      }
      else {
          action = passangerActions.searchDrives(
          start_point_place,
          destination,
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
          setIsLoading(false);
          if(props.passangerOrDriver === "passanger"){
            props.navigation.navigate('foundedDrivesScreen');
          }
          else if(props.passangerOrDriver === "driver"){
            props.navigation.navigate('Loyalty');
          }
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      };





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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

    return (
      <KeyboardAvoidingView
      // behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      
        <View style={styles.screen}>
            {/* <View>
                <TitleText style={styles.textBoxHeader}>Explanation:</TitleText>
            </View>
            <View style={styles.textBox}>
                <TextCard text={props.text}></TextCard>
            </View> */}
            <View style = {{ padding: 30, alignItems: 'center'}}>
            <AutoCompleteSearch
              placeholder="starting point"
              setPlace = {setStart_point_place}
              zIndex = {40}
            />
            </View>
            <View style = {{ padding: 30, alignItems: 'center'}}>
            <AutoCompleteSearch
              placeholder="destination"
              setPlace = {setDestination}
              zIndex = {30}
            />
            </View>
            <View style = {{marginTop: 0}}>
                    <DateTimeButton
                    onInputChange={inputChangeHandler}
                    />
            </View>
            <View style = {styles.dropDownStyle}>
              <DropDownButton
                style={{ zIndex: 20, }}
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
                style={{ zIndex: 10,  }}
                array = {deviationArray}
                placeHolder = {props.passangerOrDriver === "driver" ? "deviation time" : "km deviation"}
                id = {props.passangerOrDriver === "driver" ? "deviation_time" : "deviationKm"}
                onInputChange ={inputChangeHandler}
            />
           
            </View>
            
            <View style = {styles.filtersContainer}>
                <FiltersScreen />
            </View>
            <View style = {styles.buttonContainer}>
            <Button
            title={props.buttonStr}
            // color={'orange'}
            color={Colors.primary}
            // color={Colors.accent}
            onPress={driverPassangerHandler}
            style = {styles.button}
            />
            </View>
            
          </View>
          
          </KeyboardAvoidingView>
        
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        marginTop: 30,
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
      marginTop: '50%',
      bottom:'0%',
    },
    button: {
      bottom:0,
      marginTop: '30%'
    },
    filtersContainer : {
        margin: 20,
        flex: 1,
        position:'relative'
    },
    dropDownStyle: {
      flexDirection: 'row',
      width: 500,
      maxWidth: "95%",
      marginTop: 10
      
    }
});

export default MainWindow;