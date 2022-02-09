import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
import {Alert} from 'react-native';



export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const DETAILSFILLING = 'DETAILSFILLING';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';

let timer;

export const setDidTryAl = () => {
  return {type: SET_DID_TRY_AL };
};

const  isValidEmail = (testEmail) => {
  let is_valid_email = (testEmail.endsWith(`@post.bgu.ac.il`));
  return is_valid_email;
};

export const authenticate = (userId, token, expiryTime, email, first_name, last_name, phone_number, age, gender) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE,
      userId: userId,
      token: token,
      email: email,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      age: age,
      gender: gender,
    });
  };
};

export const createAccount = (userId, token, expiryTime, _email) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: SIGNUP, userId: userId, token: token, email: _email });
  };
};

export const detailsfl = (email, first_name, last_name, phone_number, age, gender) => {
  return dispatch => {
    dispatch({ type: DETAILSFILLING,
    email: email,
    first_name: first_name,
    last_name: last_name,
    phone_number: phone_number,
    age: age,
    gender: gender,
    });
  };
};

export const signup = (email, password) => {
  return async dispatch => {
    if(!isValidEmail(email)){
      throw new Error('the email must ends with @post.bgu.ac.il'); 
    }else{
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA75uTWNw6B8NMScQjcHytenSGB4v1nFMw',
      
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);
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
    saveDataToStorage(resData.idToken, resData.localId, expirationDate, email);
  };
}
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA75uTWNw6B8NMScQjcHytenSGB4v1nFMw'
      ,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);
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

export const detailsFilling = (email, first_name, last_name,phone_number, age, gender) => {
  return async dispatch => {
    const response = await fetch('https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        age: age,
        gender: gender
      })

    });

  const resData = await response.json();
  saveDetaillsToStorage(email, first_name, last_name,phone_number, age, gender);
  
  dispatch(detailsfl(email, first_name, last_name, phone_number, age, gender));
};
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
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
};

const saveDataToStorage = (token, userId, expirationDate, email) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
      email: email
    })
  );
};

const saveDetaillsToStorage = (email, first_name, last_name, phone_number, age, gender) => {
  AsyncStorage.setItem(
    'userDetaills',
    JSON.stringify({
      email: email,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      age: age,
      gender: gender
    })
  );
};
