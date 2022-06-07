export const UPDATE_NOTIFICATIONS = 'UPDATE_NOTIFICATIONS';


export const updateNotifications = (userID) => {
    return async dispatch => {
        try {
          let response = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}.json`)
          if (!response.ok) {
            throw new Error('Something went wrong!');
          }
          const resData = await response.json();
          const userNotifications = resData.notifications;
          dispatch({
            type: UPDATE_NOTIFICATIONS,
            userNotifications: userNotifications
          });
        } catch (err) {
          // send to custom analytics server
          throw err;
        }
      };
    
}