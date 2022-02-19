import Drive from '../../models/drive';
export const DELETE_DRIVE = 'DELETE_DRIVE';
export const CREATE_DRIVE = 'CREATE_DRIVE';
export const UPDATE_DRIVE = 'UPDATE_DRIVE';
export const SET_DRIVE = 'SET_DRIVE';
export const JOIN_DRIVE = 'JOIN_DRIVE';






export const post_drive = (starting_point, destination, date, time, amount_of_people, deviation_time, email, pushToken) => {
    return async dispatch => {
        const response = await fetch('https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            starting_point: starting_point,
            destination: destination,
            date: date,
            time: time,
            amount_of_people: amount_of_people,
            deviation_time: deviation_time,
            driver: {driverEmail: email, driverPushToken: pushToken},
            passangers: Array [amount_of_people],
            passangersPushToken: Array [amount_of_people]
          })
        });
        

      const resData = await response.json(); 
     
      dispatch({
        type: CREATE_DRIVE,
        driveData: {
          id: resData.name,
          starting_point,
          destination,
          date,
          time,
          amount_of_people,
          deviation_time,
          driver: {driverEmail: email, driverPushToken: pushToken},
        }
      });
    };
};


export const fetchDrives = (email) => {
  return async dispatch => {
    try {
      const response = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives.json?print=pretty`)
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();
      const loadedDrives = [];
      for (const key in resData) {
          if(email === resData[key].driver.driverEmail || (resData[key].passangers && (resData[key].passangers).includes(email))){
          loadedDrives.push(new Drive(
          key,
          resData[key].starting_point,
          resData[key].destination,
          resData[key].date,
          resData[key].time,
          resData[key].amount_of_people,
          resData[key].deviation_time,
          resData[key].driver,
          resData[key].passangers,
          resData[key].passangersPushToken
        ));
        console.log('********************************\n', resData[key]);
          }
      }
      dispatch({
        type: SET_DRIVE,
        userDrives: loadedDrives
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};


export const joinDrive = (driveData,passangerEmail,pushToken) => {
  let passangers = driveData.passangers;
  let passangersPushToken = driveData.passangersPushToken;
  const drivekey = driveData.id;
  if(passangers){
    passangers.push(passangerEmail);
    passangersPushToken.push(pushToken)
  }
  else{
    passangers = [passangerEmail];
    passangersPushToken = [pushToken];
  }
  return async dispatch => {
    const response = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives/${drivekey}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        passangers: passangers,
        passangersPushToken: passangersPushToken
      })
    });
    

  const resData = await response.json(); 
 
  dispatch({
    type: JOIN_DRIVE,
    driveData: {
      id: drivekey,
      passangers: passangers, 
      passangersPushToken: passangersPushToken
    }
  });
};
};