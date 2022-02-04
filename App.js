import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import AppLoading from 'expo-app-loading';
import ReduxThunk from 'redux-thunk';
import authReducer from './store/reducers/auth';
import AppNavigator from './navigation/AppNavigator';
import * as Font from 'expo-font';

const rootReducer = combineReducers({
  auth: authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};


export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={console.warn}
        
      />
    );
  }
  return (
    <Provider store={store}>
    <AppNavigator />
  </Provider>
  );
};


const styles = StyleSheet.create({
  text: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    marginTop: 50,
}
});