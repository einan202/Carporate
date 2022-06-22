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
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import * as Google from 'expo-google-app-auth';
import { BorderlessButton } from 'react-native-gesture-handler';

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

const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(true);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '123456'
    },
    inputValidities: {
      email: false,
      password: true
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const isValidEmail = (testEmail) => {
    let is_valid_email = testEmail.endsWith(`@post.bgu.ac.il`);
    return is_valid_email;
  };

  const authHandler = async () => {
    if(!isValidEmail(formState.inputValues.email)){
      Alert.alert('An Error Occurred!', 'Your email must ends with @post.bgu.ac.il', [{ text: 'Okay' }]);
      
    }else{
      props.navigation.navigate('Email Validate', { email: formState.inputValues.email, password:formState.inputValues.password});

    }
    // let action;
    // if (isSignup) {
    //   action = authActions.signup(
    //     formState.inputValues.email,
    //     formState.inputValues.password
    //   );
    // } else {
    //   action = authActions.login(
    //     formState.inputValues.email,
    //     formState.inputValues.password
    //   );
    // }
    // setError(null);
    // setIsLoading(true);
    // try {
    //   await dispatch(action);
    //   if(isSignup){
    //     navigation.navigate('DetailsFilling', { email: formState.inputValues.email});
    //   } 
    //  /* else{
    //   props.navigation.navigate('App');
    //   }*/
    // } 
    // catch (err) {
    //   setError(err.message);
    //   setIsLoading(false);
    // }
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
        <View style = {styles.welcomeContainer}>
      <Text style = {[styles.welcome, { fontFamily: "fontawesome-webfont", fontWeight: '900', padding: 10}]}>Welcome to Carporate</Text>
      </View>
        <Card style={styles.authContainer}>
        
          <ScrollView>
            <Input
              id="email"
              label="Email"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            {/* <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            /> */}
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignup ? 'Sign Up' : 'Login'}
                  color={'orange'}
                  onPress={authHandler}
                />
              )}
            </View>
            {/* <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                color={Colors.accent}
                onPress={() => {
                  setIsSignup(prevState => !prevState);
                }}
              />
            </View> */}
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export const navigationOptions = navData => {
  return { headerTitle: 'Authenticate',
  headerStyle: {
    backgroundColor: 'white',
    height: 70,
  },
  headerTitleStyle: {
    fontFamily: "fontawesome-webfont",
    fontWeight: 'bold', 
    // letterSpacing: 1,
  },
  headerTitleAlign: 'center',
  headerBackTitleStyle: {
    fontFamily: "fontawesome-webfont",
    flexDirection: "row",
    alignSelf: 'center',
  },
  headerTintColor: Platform.OS === 'android' ? Colors.primary : '',
};
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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

export default AuthScreen;
