import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import AppLoading from 'expo-app-loading';
import ReduxThunk from 'redux-thunk';
import authReducer from './store/reducers/auth';
import drivesReducer from './store/reducers/drives';
import passangerReducer from './store/reducers/passanger';
import notificationsReducer from './store/reducers/notifications';
import AppNavigator from './navigation/AppNavigator';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications';
import short_bar from './assets/short_bar.jpg'


Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

const rootReducer = combineReducers({
  auth: authReducer,
  drives: drivesReducer,
  passanger: passangerReducer,
  notifications: notificationsReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    'fontawesome-webfont': require('./assets/fonts/fontawesome-webfont.ttf')
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