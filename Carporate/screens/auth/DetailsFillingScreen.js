import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch,useSelector } from 'react-redux';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';


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

const DetailsFillingScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const email = useSelector(state => state.auth.email);
  

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
          email: email,
          first_name: '',
          last_name: '',
          phone: '',
          age: '',
          gender: ''
        },
        inputValidities: {
          email: true,
          first_name: false,
          last_name: false,
          phone: false,
          age: false,
          gender: false
        },
        formIsValid: false
      });

      useEffect(() => {
        if (error) {
          Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
        }
      }, [error]);
    
      const authHandler = async () => {
        let action = authActions.detailsFilling(
          formState.inputValues.email,
          formState.inputValues.first_name,
          formState.inputValues.last_name,
          formState.inputValues.phone,
          formState.inputValues.age,
          formState.inputValues.gender
        );
        setError(null);
        setIsLoading(true);
        try {
          await dispatch(action);
          props.navigation.navigate('App');
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
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={50}
          style={styles.screen}
        >
          <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
            <Card style={styles.authContainer}>
            
              <ScrollView>
                <Input
                  id="email"
                  label="E-Mail"
                  defaultValue = {email}
                  editable = {false}
                  keyboardType="email-address"
                  initialValue = {email}
                />
                <Input
                  id="first_name"
                  label="First Name"
                  keyboardType="default"
                  required
                  errorText="Please enter a valid name."
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
                <Input
                  id="last_name"
                  label="Last Name"
                  keyboardType="default"
                  required
                  errorText="Please enter a valid name."
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
                <Input
                  id="phone"
                  label="Phone-Number"
                  keyboardType="number-pad"
                  required
                  minLength = {10}
                  errorText="Please enter a valid phone number."
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
                <Input
                  id="age"
                  label="Age"
                  keyboardType="number-pad"
                  required
                  minLength = {2}
                  isAge 
                  errorText="Please enter a valid age."
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
                 <Input
                  id="gender"
                  label="Gender"
                  keyboardType="default"
                  required
                  isGander 
                  errorText="gender must to be male/female."
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
                <View style={styles.buttonContainer}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Button
                      title={'Create account'}
                      color={Colors.primary}
                      onPress={authHandler}
                    />
                  )}
                </View>
              </ScrollView>
            </Card>
          </LinearGradient>
        </KeyboardAvoidingView>
      );
};



const styles = StyleSheet.create({
    screen: {
      flex: 1
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    authContainer: {
      width: '80%',
      maxWidth: 400,
      maxHeight: 400,
      padding: 20
    },
    buttonContainer: {
      marginTop: 10
    },
    welcome: {
      fontSize: 30,
      fontFamily: 'open-sans-bold'
    },
    welcomeContainer : {
      padding: 20
    }
  });

export default DetailsFillingScreen;