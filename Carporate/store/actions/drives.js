import Drive from '../../models/drive';
import {getDirections} from '../../functions/googleAPI'
export const DELETE_DRIVE = 'DELETE_DRIVE';
export const CREATE_DRIVE = 'CREATE_DRIVE';
export const UPDATE_DRIVE = 'UPDATE_DRIVE';
export const SET_DRIVE = 'SET_DRIVE';
export const JOIN_DRIVE = 'JOIN_DRIVE';




function make_date (date, time){
  let date_arr = date.split('/');
  date_arr = date_arr.reverse();
  date_arr[1] = String (Number(date_arr[1]) - 1);
  let time_arr = time.split(':');
  let date_obj = new Date(... date_arr, ... time_arr)
  return date_obj;
}


export const post_drive = (starting_point, destination, date, time, amount_of_people, deviation_time, email, pushToken) => {
  let dateObj = make_date(date,time);
  console.log(pushToken);
  return async dispatch => {
        let dir = await getDirections(starting_point.place_id, destination.place_id, dateObj.getTime());
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
            passangersPushToken: Array [amount_of_people],
            passangersPickUpLocations: Array [amount_of_people],
            dir: dir
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
          dir
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
      console.log(resData)
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
          resData[key].passangersPushToken,
          resData[key].passangersPickUpLocations,
          resData[key].dir
        ));
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


export const joinDrive = (driveData,passangerEmail,pushToken, newDriveInformation) => {
  let passangers = driveData.passangers;
  let passangersPushToken = driveData.passangersPushToken;
  let passangersPickUpLocations = driveData.passangersPickUpLocations;
  let dateObj = make_date(driveData.date,driveData.time);
  let deviation_time = driveData.deviation_time - newDriveInformation.devationTime;
  let amount_of_people = driveData.amount_of_people - newDriveInformation.amount_of_people
  const drivekey = driveData.id;
  if(passangers){
    passangers.push(passangerEmail);
    passangersPushToken.push(pushToken);
    passangersPickUpLocations.push(newDriveInformation.pickUpPoint);
  }
  else{
    passangers = [passangerEmail];
    passangersPushToken = [pushToken];
    passangersPickUpLocations = [newDriveInformation.pickUpPoint];
  }
  return async dispatch => {
    let dir =  await getDirections(driveData.starting_point.place_id, driveData.destination.place_id, dateObj.getTime());
    const response = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives/${drivekey}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        passangers: passangers,
        passangersPushToken: passangersPushToken,
        passangersPickUpLocations: passangersPickUpLocations,
        amount_of_people: amount_of_people,
        dir: dir,
        deviation_time: deviation_time
      })
    });
    

  const resData = await response.json(); 
 
  dispatch({
    type: JOIN_DRIVE,
    driveData: {
      id: drivekey,
      passangers: passangers, 
      passangersPushToken: passangersPushToken,
      passangersPickUpLocations: passangersPickUpLocations,
      amount_of_people: amount_of_people,
      deviation_time: deviation_time,
      dir: dir
    }
  });
};
};