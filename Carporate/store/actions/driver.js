import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch,useSelector } from 'react-redux';
import {Alert} from 'react-native';




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
            driver: email,
            passangers: ["", "", ""]
          })
        });
        

      const resData = await response.json();      
    };
};

