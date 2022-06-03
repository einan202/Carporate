import {
    UPDATE_NOTIFICATIONS
  } from '../actions/notifications';

  const initialState = {
    userNotifications: []
  };

  export default (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_NOTIFICATIONS:
        return { 
            userNotifications: action.userNotifications,
        }
    }
    return state;
};