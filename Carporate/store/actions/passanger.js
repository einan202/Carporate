export const SEARCH_DRIVE = 'SEARCH_DRIVE';
import Drive from '../../models/drive'


export const searchDrives = (starting_point, destination, date, time, amount_of_people, deviationKm, email) => {
    return async dispatch => {
      try {
      const response = await fetch('https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();
      const foundedDrives = [];
      for (const key in resData) {
        if(date === resData[key].date && resData[key].amount_of_people > 0 && resData[key].amount_of_people >= amount_of_people && 
          starting_point === resData[key].starting_point &&  destination === resData[key].destination
          && email !== resData[key].driver){
          foundedDrives.push(new Drive(
        key,
        resData[key].starting_point,
        resData[key].destination,
        resData[key].date,
        resData[key].time,
        resData[key].amount_of_people,
        resData[key].deviation_time,
        resData[key].driver,
        resData[key].passangers
      ));
        }
    }
    dispatch({
      type: SEARCH_DRIVE,
      foundedDrives: foundedDrives
    });
  } catch (err) {
    // send to custom analytics server
    throw err;
  }
  };
};