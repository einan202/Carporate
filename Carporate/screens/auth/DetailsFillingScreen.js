import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import DropDownButton from "../../components/UI/DropDownButton";
import Checkbox from "expo-checkbox";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const DetailsFillingScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email);
  const [pushToken, setPushToken] = useState();
  const [isChecked, setChecked] = useState(false);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: email,
      first_name: "",
      last_name: "",
      phone: "",
      age: "",
      gender: "",
      pushToken: pushToken,
    },
    inputValidities: {
      email: true,
      first_name: false,
      last_name: false,
      phone: false,
      age: false,
      gender: false,
      chceckbox: true,
      pushToken: true,
    },
    formIsValid: false,
  });

  useEffect(() => {
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return statusObj;
      })
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          Alert.alert(
            "An Error Occurred!",
            "We ask for your permission to send you notifications",
            [{ text: "Okay" }]
          );
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
      })
      .then(() => {
        return Notifications.getExpoPushTokenAsync();
      })
      .then((response) => {
        const token = response.data;
        dispatchFormState({
          type: FORM_INPUT_UPDATE,
          value: token,
          isValid: true,
          input: "pushToken",
        });
        //setPushToken(token);
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action = authActions.detailsFilling(
      formState.inputValues.email,
      formState.inputValues.first_name,
      formState.inputValues.last_name,
      formState.inputValues.phone,
      formState.inputValues.age,
      formState.inputValues.gender,
      isChecked,
      formState.inputValues.pushToken
    );
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("App");
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
        input: inputIdentifier,
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
              id="email"
              label="Email"
              defaultValue={email}
              editable={false}
              keyboardType="email-address"
              initialValue={email}
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
              label="Phone"
              keyboardType="number-pad"
              required
              minLength={10}
              errorText="Please enter a valid phone number."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="age"
              label="Age"
              keyboardType="number-pad"
              required
              minLength={2}
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
              errorText="Gender should be male or female."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.checkboxContainer}>
              <View style={styles.section}>
                <Checkbox
                  color="#888"
                  style={styles.checkbox}
                  value={isChecked}
                  onValueChange={setChecked}
                />
                <Text style={[styles.paragraph, {textAlign: 'center'}]}>
                 You approve keeping your current details to find you an optimal
                  cooperative ride
                </Text>
              </View>
            </View>
            {/* <DropDownButton
                  style={{ zIndex: 10,  }}
                  array = {[
                    { label: 'male', value: 'male' },
                    { label: 'female', value: 'female' },
                  ]}
                  placeHolder = {"gender"}
                  id = {"gender"}
                  onInputChange ={inputChangeHandler}
                /> */}
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={"Create account"}
                  color={'orange'}
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
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    height: "80%",
    maxWidth: 400,
    maxHeight: 800,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  // dropDownStyle: {
  //   flexDirection: "row",
  //   width: 500,
  //   maxWidth: "90%",
  //   marginTop: 20,
  // },
  welcome: {
    fontSize: 30,
    fontFamily: "fontawesome-webfont",
    fontWeight: 'bold',
  },
  welcomeContainer: {
    padding: 20,
  },
  checkboxContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 20,
    // alignItems: 'baseline'
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 3
    
  },
});

export default DetailsFillingScreen;
