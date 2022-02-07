import Drive from '../../models/drive';


export const DELETE_DRIVE = 'DELETE_DRIVE';
export const CREATE_DRIVE = 'CREATE_DRIVE';
export const UPDATE_DRIVE = 'UPDATE_DRIVE';
export const SET_DRIVE = 'SET_DRIVE';







export const post_driver = (starting_point, destination, date, time, amount_of_people, deviation_time, email) => {
    
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
            driver: email
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
          driver: email,
        }
      });
    };
};


export const fetchDrives = (email) => {
  return async dispatch => {
    // any async code you want!a
    
    try {
      const response = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives.json?orderBy="driver"&equalTo=${email}&print=pretty`,{})

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();
      const loadedDrives = [];

      for (const key in resData) {
        loadedDrives.push(new Drive(
          key,
          resData[key].starting_point,
          resData[key].destination,
          resData[key].date,
          resData[key].time,
          resData[key].amount_of_people,
          resData[key].deviation_time,
          resData[key].driver,
          []
        ));
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