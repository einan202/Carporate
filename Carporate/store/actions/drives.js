import Drive from '../../models/drive';

import {getDirections, getRouteDuration, getRoute, getRoutePointsInOrder} from '../../functions/googleAPI'
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


export const post_drive = (starting_point, destination, date, time, amount_of_people, deviation_time, driverEmail, driverPushToken, driverFirstName, driverLastName, driverPhone, driverUserId) => {
  let dateObj = make_date(date,time);
  return async dispatch => {
        let dir = await getDirections(starting_point, destination, dateObj.getTime());
        // Add a new drive to the firebase
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
            driver: {driverEmail: driverEmail, driverPushToken: driverPushToken, driverFirstName: driverFirstName, driverLastName:driverLastName, driverPhone: driverPhone, driverID: driverUserId, driverDeviationTime: parseInt(deviation_time)},
            dir: dir,
            drivePoints: [starting_point, destination],
            driveTime: getRouteDuration(getRoute(dir))
          })
        });
        

      const resData = await response.json(); 

      // Add the drive key to the driver user, under "drives"
      let driverDetailsJson = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${driverUserId}.json`)
      let driverDetails = await driverDetailsJson.json(); 

      let driverDrives = driverDetails.drives
      if(driverDrives){
        driverDrives.push(resData.name)
      }
      else{
        driverDrives = [resData.name]
      }

      driverDetailsJson = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${driverUserId}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
         drives: driverDrives
        })
      });

     
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
          driver: {driverEmail: driverEmail, driverPushToken: driverPushToken, driverFirstName: driverFirstName, driverLastName:driverLastName, driverPhone: driverPhone, driverID: driverUserId,  driverDeviationTime: parseInt(deviation_time)},
          dir
        }
      });
    };
};


export const fetchDrives = (userID) => {
  return async dispatch => {
    try {
      let response = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}.json`)
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();
      const loadedDrives = [];
      let currentDate = new Date()
      
      for (const key in resData.drives) {
        let currRide = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives/${resData.drives[key]}.json`);
        currRide = await currRide.json();
          let driveDate = make_date(currRide.date,currRide.time)
          if(currentDate < driveDate){
            loadedDrives.push(new Drive(
            resData.drives[key],
            currRide.starting_point,
            currRide.destination,
            currRide.date,
            currRide.time,
            currRide.amount_of_people,
            currRide.deviation_time,
            currRide.driver,
            currRide.passangers,
            currRide.dir,
            currRide.drivePoints
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


export const joinDrive = (driveData,passangerEmail, passangerPushToken, passangerFirstName, passangerLastName, passangerPhone, passangerUserId, newDriveInformation) => {
  let passangers = driveData.passangers;
  let passangersPickUpLocations = passangers != undefined ? passangers.map(passanger => passanger.pickUpLocation): undefined
  let dateObj = make_date(driveData.date,driveData.time);
  let deviation_time = driveData.deviation_time - newDriveInformation.devationTime;
  let amount_of_people = driveData.amount_of_people - newDriveInformation.amount_of_people
  const drivekey = driveData.id;
  if(passangers){
    passangers.push({
      firstName: passangerFirstName,
      lastName: passangerLastName,
      email: passangerEmail,
      pushToken:passangerPushToken,
      phone: passangerPhone,
      userID:passangerUserId,
      pickUpLocation: newDriveInformation.pickUpPoint,
      dropOffPoint: newDriveInformation.dropOffPoint,
      starting_point: newDriveInformation.passangerStartingPoint,
      destination: newDriveInformation.passangerDestination,
      amountOfPeople: parseInt(newDriveInformation.amount_of_people)
    });
  }
  else{
    passangers = [{
      firstName: passangerFirstName,
      lastName: passangerLastName,
      email: passangerEmail,
      pushToken:passangerPushToken,
      phone: passangerPhone,
      userID:passangerUserId,
      pickUpLocation: newDriveInformation.pickUpPoint,
      starting_point: newDriveInformation.passangerStartingPoint,

      dropOffPoint: newDriveInformation.dropOffPoint,

      destination: newDriveInformation.passangerDestination,
      amountOfPeople: parseInt(newDriveInformation.amount_of_people)
    }];
  }
  return async dispatch => {
    let dir =  await getDirections(
      driveData.starting_point, 
      driveData.destination, 
      dateObj.getTime(), 
      newDriveInformation.drivePoints.slice(1, newDriveInformation.drivePoints.length-1)
    );
    const response = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives/${drivekey}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        passangers: passangers,
        amount_of_people: amount_of_people,
        dir: dir,
        driveTime: getRouteDuration(getRoute(dir)),
        deviation_time: deviation_time,
        drivePoints: newDriveInformation.drivePoints
      })
    });
    

  const resData = await response.json(); 

  let passangerDetailsJson = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${passangerUserId}.json`)
      let passangerDetails = await passangerDetailsJson.json(); 
      
      let passangerDrives = passangerDetails.drives
      if(passangerDrives){
        passangerDrives.push(drivekey)
      }
      else{
        passangerDrives = [drivekey]
      }
      
      driverDetailsJson = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${passangerUserId}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
         drives: passangerDrives
        })
      });


 
    // dispatch({
    //   type: JOIN_DRIVE,
    //   driveData: {
    //     id: drivekey,
    //     passangers: passangers, 
    //     amount_of_people: amount_of_people,
    //     deviation_time: deviation_time,
    //     dir: dir,
    //     starting_point: driveData.starting_point,
    //     destination: driveData.destination,
    //     date: driveData.date, 
    //     time: driveData.time,
    //     driver: driveData.driver
    //   }
    // });
};
};


export const deleteDriveForDriver = (driveID) => {
  return async dispatch => {
    let driveDetailsJson = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives/${driveID}.json`)
    let driveDetails = await driveDetailsJson.json();
    // Delete the drive from the drives of each passenger in it 
    if(driveDetails.passangers){
      for(let i = 0; i < driveDetails.passangers.length ; i++){
        let currpassangerDetailsJson = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${driveDetails.passangers[i].userID}.json`)
        let currpassangerDetails = await currpassangerDetailsJson.json(); 
        let currDrives = currpassangerDetails.drives
        currDrives = currDrives.filter(drive => drive != driveID)
        const tmp = await fetch(
          `https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${driveDetails.passangers[i].userID}.json`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            drives: currDrives
            })
          }
        );
      }
    }
    // Delete the drive from the drives of the driver
    let driverDetailsJson = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${driveDetails.driver.driverID}.json`)
    let driverDetails = await driverDetailsJson.json(); 
    let currDrives = driverDetails.drives
    currDrives = currDrives.filter(drive => drive != driveID)
    const tmp = await fetch(
      `https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${driveDetails.driver.driverID}.json`, 
      {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        drives: currDrives
      })
      }
    );
    // Delete the drive from the drives of each passenger in it 
    const response = await fetch(
      `https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives/${driveID}.json`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );
  }
}

export const deleteDriveForPassanger = (driveID, userID) => {
  
  return async dispatch => {
    let driveDetailsJson = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives/${driveID}.json`)
    let driveDetails = await driveDetailsJson.json(); 
    let passangers = driveDetails.passangers
    
    let passangerToDelete = passangers.filter(passanger => passanger.userID == userID)[0]
    passangers = passangers.filter(passanger => passanger.userID != userID)
    
    let dateObj = make_date(driveDetails.date,driveDetails.time);
    let amountOfPeople = driveDetails.amount_of_people + passangerToDelete.amountOfPeople
    let oldDriveWayPoints = driveDetails.drivePoints.slice(1, driveDetails.drivePoints.length-1);
    function filterWayPoints(point){
      const pickUpFilter = point.place_id !== passangerToDelete.pickUpLocation.place_id;
      const dropOffFilter = point.place_id !== passangerToDelete.dropOffPoint.place_id;
      return pickUpFilter && dropOffFilter;
    }
    let newDriveWayPoints = oldDriveWayPoints.filter(filterWayPoints);
    newDriveWayPoints = newDriveWayPoints.length === 0 ? undefined : newDriveWayPoints;
    
    let newDir = await getDirections(
      driveDetails.starting_point,
      driveDetails.destination,
      dateObj.getTime(),
      newDriveWayPoints
    )

    let oldDirDuration = getRouteDuration(getRoute(driveDetails.dir));
    let newDirDuration = getRouteDuration(getRoute(newDir));

    let deviationTime = oldDirDuration - newDirDuration + driveDetails.deviation_time
    
    // Delete the drive from the drives of the passenger who is leaving
    let passangerDetailsJson = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}.json`)
    let passangerDetails = await passangerDetailsJson.json(); 
    let currDrives = passangerDetails.drives
    currDrives = currDrives.filter(drive => drive != driveID)
    const tmp = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}.json`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json'
      },
        body: JSON.stringify({
        drives: currDrives
        })
      });
      
    // Update the drive in the database
    const response = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives/${driveID}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        passangers: passangers,
        amount_of_people: amountOfPeople,
        dir: newDir,
        deviation_time: deviationTime,
        driveTime: newDirDuration,
        drivePoints: getRoutePointsInOrder(newDir)
      })
    });

    
  }
}


export const delaySpecificDrive = (driveID,minutesDiff) => {
  return async dispatch => {
    let driveDetailsJson = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives/${driveID}.json`)
    let driveDetails = await driveDetailsJson.json(); 
    let time = make_date(driveDetails.date, driveDetails.time)
    time = new Date(time.getTime() + (60000 * minutesDiff))
    let newMinutes = time.getMinutes()
    let newHour = time.getHours()
    if(newHour < 10){
      newHour = '0' + newHour.toString()
    }
    else{
      newHour = newHour.toString()
    }
    if(newMinutes < 10){
      newMinutes = '0' + newMinutes.toString()
    }
    else{
      newMinutes = newMinutes.toString()
    }
    let newTime = newHour.toString() + ':' + newMinutes.toString()

    const response = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives/${driveID}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        time: newTime
      })
    });
  }
}




