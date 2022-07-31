import React, { useState, useEffect, useReducer, useCallback } from "react";
import {Image, View, Text, StyleSheet, Button, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { Entypo } from '@expo/vector-icons';
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
          pickUpSearchRange : undefined,
          dropOffSearchRange : undefined,
        },
        inputValidities: {
          date: false,
          time: false,
          amount_of_people: false,
          deviation_time: false,
          pickUpSearchRange : false,
          dropOffSearchRange : false,
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
          formState.inputValues.pickUpSearchRange,
          formState.inputValues.dropOffSearchRange,
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





      const deviationArray = [
        { label: '0 min', value: '0' },
        { label: '10 min', value: '10' },
        { label: '20 min', value: '20' },
        { label: '30 min', value: '30' },
        { label: '40 min', value: '40' },
      ]
  //const short_bar = <Image source={require('./assets/short_bar.jpg')} style={{ width: 100, height: 100 }} id="short_bar"/>
  const red_circle =  <Entypo name="circle" size={17} color="red" fontWeight='bold' />
  const orange_circle = <Entypo name="circle" size={21} color="orange" fontWeight='bold' />
  const green_circle = <Entypo name="circle" size={24} color="green" fontWeight='bold' />
  
  const SearchRangeArray = [
    { label: 'None', value: '1' },
    { label: 'a' , value: '0', icon: () => red_circle },
    { label: 'b' , value: '1', icon: () => orange_circle },
    { label: 'c' , value: '2', icon: () => green_circle },
  ]  

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
      <Text style={{fontSize: 24, marginBottom: 25, fontWeight: 'bold' ,color: Colors.primary, alignSelf: 'center'}}>
        {props.passangerOrDriver === "driver" ? "Create Your Drive" : "Find Your Drive"}
      </Text>
      {props.passangerOrDriver === "driver" ? [
        <View style = {{flex:1 ,width: 250, alignSelf: 'center' }} id="driver_st_pt" key={1}>
          <AutoCompleteSearch
            placeholder="starting point"
            setPlace = {setStart_point_place}
            zIndex = {40}
          />
        </View>,
        <View style = {{flex:1 ,width: 250, alignSelf: 'center'}} id="driver_end_pt" key={2}>
          <AutoCompleteSearch
            placeholder="destination"
            setPlace = {setDestination}
            zIndex = {30}
          />
        </View>
      ]
      :
      [<View style = {{width:"100%", height: 60,flexDirection: 'row-reverse', justifyContent: 'center', alignContent: 'space-between'}} id="passenger_st_pt" key={10}>
        <View style = {{width: 185, marginLeft: 20, }}>
          <AutoCompleteSearch
            placeholder="starting point"
            setPlace = {setStart_point_place}
            zIndex = {40}
          />
        </View>
        <DropDownButton
            outside={{marginHorizontal: 0, paddingHorizontal: 0}}
            style={{width: 115, borderWidth: 0.9, borderRadius: 5, height: 45, zIndex: 40}}
            array= {[
              { label: 'None', value: -1 },
              { label: '0-2 Km' , value: 0, icon: () => <Entypo name="circle" size={17} color="red" fontWeight='bold' /> },
              { label: '2-5 Km' , value: 1, icon: () => <Entypo name="circle" size={21} color="orange" fontWeight='bold' /> },
              { label: '5-10 Km' , value: 2, icon: () => <Entypo name="circle" size={24} color="green" fontWeight='bold' /> },
            ] }
            placeHolder= "Search Range"
            id = "pickUpSearchRange"
            onInputChange = {inputChangeHandler}
        />
      </View>
      ,
      <View style = {{height: 50,flexDirection: 'row-reverse', flexWrap:'wrap', justifyContent: 'center', alignContent: 'space-between'}}  id="passenger_end_pt" key={20} >
        <View style = {{width: 185, marginLeft: 20, }}>
        <AutoCompleteSearch
          placeholder="destination"
          setPlace = {setDestination}
          zIndex = {30}
        />
        </View>
        <DropDownButton
            outside={{marginHorizontal: 0}}
            style={{width:115,borderWidth: 0.9, borderRadius: 5, height: 45, zIndex:30}}
            array= {[
              { label: 'None', value: -1 },
              { label: '0-2 Km' , value: 0, icon: () => <Entypo name="circle" size={17} color="red" fontWeight='bold' /> },
              { label: '2-5 Km' , value: 1, icon: () => <Entypo name="circle" size={21} color="orange" fontWeight='bold' /> },
              { label: '5-10 Km' , value: 2, icon: () => <Entypo name="circle" size={24} color="green" fontWeight='bold' /> },
            ] }
            placeHolder= "Search Range"
            id = "dropOffSearchRange"
            onInputChange = {inputChangeHandler}
        />
      </View>
      ]}
      <DateTimeButton
        onInputChange={inputChangeHandler}
      />
      {props.passangerOrDriver === "driver" ?
        <View style = {styles.dropDownStyle}>
          <DropDownButton
            style={{ zIndex: 10, height: 45}}
            array={[
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
            ]}
            placeHolder="Amount of People"
            id = "amount_of_people"
            onInputChange = {inputChangeHandler}
          />
          <DropDownButton
              style={{ zIndex: 10, height: 45}}
              array = {deviationArray}
              placeHolder = {"Deviation Time"}
              id = {"deviation_time"}
              onInputChange ={inputChangeHandler}
          />
        </View>
        :
        <View style={{alignItems: 'center', marginTop: 5, }}>
          <DropDownButton
            style={{width: 220, alignSelf: 'center', zIndex: 20, height: 45}}
            array={[
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
            ]}
            placeHolder="Amount of People"
            id = "amount_of_people"
            onInputChange = {inputChangeHandler}
          />
        </View>
      }
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
        marginTop: 0,
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
        margin: 10,
        flex: 1,
        position:'relative'
    },
    dropDownStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: 500,
      maxWidth: "95%",
      marginTop: 10,
      marginLeft: 10,
      
      
    }
});

export default MainWindow;