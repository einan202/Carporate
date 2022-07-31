export const SEARCH_DRIVE = 'SEARCH_DRIVE';
import Drive from '../../models/drive'
import { algo } from '../../functions/algo';


export const searchDrives = (starting_point, destination, date, time, amount_of_people, pickUpSearchRange, dropOffSearchRange, email) => {
  return async dispatch => {
      try {  
      const response = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives.json?`);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();
      const foundedDrives = [];
      for (const key in resData) {
        if(
          date === resData[key].date &&
          resData[key].amount_of_people >= amount_of_people && 
          email !== resData[key].driver.driverEmail &&
          (resData[key].passangers === undefined || !resData[key].passangers.includes(email))
          )
        { 
          let {pickUpPoint, dropOffPoint, newDir, drivePoints, devationTime, driveTime} = await algo(starting_point, destination, resData[key].dir, pickUpSearchRange, dropOffSearchRange);
          if(devationTime <= Number(resData[key].deviation_time)){
            foundedDrives.push({
              old_drive: new Drive(
                key,
                resData[key].starting_point,
                resData[key].destination,
                resData[key].date,
                resData[key].time,
                resData[key].amount_of_people,
                resData[key].deviation_time,
                resData[key].driver,
                resData[key].passangers,
                newDir
              ),
              newDriveInformation: {
                pickUpPoint: pickUpPoint,
                
                dropOffPoint: dropOffPoint,
                drivePoints: drivePoints,
                driveTime: driveTime,

                devationTime: devationTime, 
                amount_of_people: amount_of_people, 
                passangerStartingPoint:starting_point, 
                passangerDestination:destination
              }
            });
          }
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