import AsyncStorage from "@react-native-async-storage/async-storage";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { Alert } from "react-native";
import { functions, httpsCallable } from "../../firebase";

export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const DETAILSFILLING = "DETAILSFILLING";
export const SET_DID_TRY_AL = "SET_DID_TRY_AL";
export const EMAILVAREFICATION = "EMAILVAREFICATION";
let timer;

export const setDidTryAl = () => {
  return { type: SET_DID_TRY_AL };
};

const onlyLetters = (str) => {
  return /^[a-zA-Z]+$/.test(str);
};
const onlyDigits = (str) => {
  return /^\d+$/.test(str);
};

const isValidEmail = (testEmail) => {
  let is_valid_email = testEmail.endsWith(`@post.bgu.ac.il`);
  return is_valid_email;
};

const isValidPhone_number = (testPhoneNumber) => {
  return testPhoneNumber.length == 10 && onlyDigits(testPhoneNumber);
};
const isValidAge = (testAge) => {
  return onlyDigits(testAge) && parseInt(testAge) <= 120;
};

export const authenticate = (
  userId,
  token,
  expiryTime,
  email,
  first_name,
  last_name,
  phone_number,
  age,
  gender,
  pushToken
) => {
  return (dispatch) => {
    //dispatch(setLogoutTimer(expiryTime));
    dispatch({
      type: AUTHENTICATE,
      userId: userId,
      token: token,
      email: email,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      age: age,
      gender: gender,
      pushToken: pushToken,
    });
  };
};

export const sendVareficationMail = (email) => {
  return async (dispatch) => {
    let code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    console.log(code);
    console.log(`\n\n ----> ${code} <---- \n\n`);
    const response = await fetch(
      "https://us-central1-carpool-54fdc.cloudfunctions.net/sendEmailVarefication",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: `${code}`,
          email: `${email}`,
        }),
      }
    );

    dispatch({ type: EMAILVAREFICATION, email_code: code });

    // const sendEmailVarefication = httpsCallable(functions, 'sendEmailVarefication');

    // sendEmailVarefication({ message: "asdaskjdlskdjflksdjflksjdflksdjf" })
    //   .then((result) => {
    //     // Read result of the Cloud Function.
    //     console.log("aaa\n")
    //     /** @type {any} */
    //     console.log(result.JSON);
    //     // const data = result.data;
    //     // const sanitizedMessage = data.text;
    //   });
  };
};

export const createAccount = (userId, token, expiryTime, _email) => {
  return (dispatch) => {
    //dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: SIGNUP, userId: userId, token: token, email: _email });
  };
};

export const detailsfl = (
  userID,
  email,
  first_name,
  last_name,
  phone_number,
  age,
  gender,
  pushToken
) => {
  return (dispatch) => {
    if (!onlyLetters(first_name)) {
      throw new Error("You entered invalid first name");
    } else if (!onlyLetters(last_name)) {
      throw new Error("You entered invalid last name");
    } else if (!isValidPhone_number(phone_number)) {
      throw new Error("You entered invalid phone number");
    } else if (!isValidAge(age)) {
      throw new Error("You entered invalid age");
    } else if (
      gender.toLowerCase() !== "male" &&
      gender.toLowerCase() !== "female"
    ) {
      throw new Error("Gender can be male or female");
    } else {
      dispatch({
        type: DETAILSFILLING,
        userID: userID,
        email: email,
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        age: age,
        gender: gender,
        pushToken: pushToken,
      });
    }
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    if (!isValidEmail(email)) {
      throw new Error("the email must ends with @post.bgu.ac.il");
    } else {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA75uTWNw6B8NMScQjcHytenSGB4v1nFMw",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = "Something went wrong!";
        if (errorId === "EMAIL_EXISTS") {
          message = "This email exists already!";
        }
        throw new Error(message);
      }

      const resData = await response.json();
      dispatch(
        createAccount(
          resData.localId,
          resData.idToken,
          parseInt(resData.expiresIn) * 10000000000,
          email
        )
      );
      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000000000
      );
      saveDataToStorage(
        resData.idToken,
        resData.localId,
        expirationDate,
        email
      );
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA75uTWNw6B8NMScQjcHytenSGB4v1nFMw",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid!";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000,
        email
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000000000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate, email);
  };
};

export const detailsFilling = (
  email,
  first_name,
  last_name,
  phone_number,
  age,
  gender,
  checkbox,
  pushToken
) => {
  return async (dispatch) => {
    if (!onlyLetters(first_name)) {
      throw new Error("You entered invalid first name");
    } else if (!onlyLetters(last_name)) {
      throw new Error("You entered invalid last name");
    } else if (!isValidPhone_number(phone_number)) {
      throw new Error("You entered invalid phone number");
    } else if (!isValidAge(age)) {
      throw new Error("You entered invalid age");
    } else if (
      (gender.toLowerCase() !== "male") &
      (gender.toLowerCase() !== "female")
    ) {
      throw new Error("Gender can be male or female");
    } else if (!checkbox) {
      throw new Error("Please confirm our privacy terms");
    } else {
      const response = await fetch(
        "https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number,
            age: age,
            gender: gender,
            pushToken: pushToken,
          }),
        }
      );

      const resData = await response.json();
      saveDetaillsToStorage(
        resData.name,
        email,
        first_name,
        last_name,
        phone_number,
        age,
        gender,
        pushToken
      );

      dispatch(
        detailsfl(
          resData.name,
          email,
          first_name,
          last_name,
          phone_number,
          age,
          gender,
          pushToken
        )
      );
    }
  };
};

export const logout = () => {
  //clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

/*const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};*/

const saveDataToStorage = (token, userId, expirationDate, email) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
      email: email,
    })
  );
};

const saveDetaillsToStorage = (
  userID,
  email,
  first_name,
  last_name,
  phone_number,
  age,
  gender,
  pushToken
) => {
  AsyncStorage.setItem(
    "userDetaills",
    JSON.stringify({
      userID: userID,
      email: email,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      age: age,
      gender: gender,
      pushToken: pushToken,
    })
  );
};
