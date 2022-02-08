


export const searchDrives = (starting_point, destination, date, time, amount_of_people, deviation_time, email) => {
    return async dispatch => {
      const response = await fetch('https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/users.json', {
      });
  
    const resData = await response.json();

  };
  };