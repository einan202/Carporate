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
import * as Notifications from 'expo-notifications';
import CountDown from 'react-native-countdown-component';



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

function EmailVareficationScreen({ route, navigation }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [sendAnotherMail, setSendAnotherMail] = useState(true);
    //const [code, setCode] = useState(0);
    const [time, setTime] = useState(59);
    const dispatch = useDispatch();
    const code = useSelector(state => state.auth.email_code);
  
    const [formState, dispatchFormState] = useReducer(formReducer, {
      inputValues: {
        password_from_email:'',
      },
      inputValidities: {
        password_from_email: false
      },
      formIsValid: false
    });
  
    useEffect(() => {
      if (error) {
        Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
      }
    }, [error]);

    useEffect(() => {
        if (sendAnotherMail) {
            console.log(route)
            let action;
            action = authActions.sendVareficationMail(route.params.email);
            dispatch(action);
            setTime(59);
            setSendAnotherMail(false)

        }
      }, [sendAnotherMail]);
  
    const authHandler = async () => {
      
        if(formState.inputValues.password_from_email == code){
            let action;
            action = authActions.signup(
            route.params.email,
            route.params.password
            );
            setError(null);
            setIsLoading(true);
            try {
                await dispatch(action);
                navigation.navigate('DetailsFilling');
            } 
            catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        }
        else{
          Alert.alert("incorrect code","please check your email, and write the correct code",[{text: 'OK', onPress: () =>{}}])
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
        // behavior="padding"
        keyboardVerticalOffset={50}
        style={styles.screen}
      >
     <LinearGradient colors={['#f7e8df', '#ffe3ff']} style={styles.gradient}>
          <Card style={styles.authContainer}>
          
            <ScrollView>
              <Input
                id="password_from_email"
                label="Please write the password you recieved in email, check spam also."
                //keyboardType="email-address"
                required
                autoCapitalize="none"
                errorText=""
                onInputChange={inputChangeHandler}
                initialValue=""
              />
               <CountDown
                    until={time}
                    onFinish={() => navigation.goBack()}
                    onPress={() => alert('hello')}
                    size={10}
                    timeToShow={['S']}
                />
              <View style={styles.buttonContainer}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Button
                    title={'Next'}
                    color={'orange'}
                    onPress={authHandler}
                  />
                )}
              </View>
              <View style={styles.buttonContainer}>
              <Button
                title={'send me another email'}
                color={Colors.accent}
                onPress={() => {
                    setSendAnotherMail(true);
                }}
              />
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
      fontFamily: "fontawesome-webfont",
      fontWeight: 'bold',
    },
    welcomeContainer : {
      padding: 20
    }
  });

export default EmailVareficationScreen;