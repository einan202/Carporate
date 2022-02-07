
import {
  DELETE_DRIVE,
  CREATE_DRIVE,
  UPDATE_DRIVE,
  SET_DRIVE
} from '../actions/drives';
import Drive from '../../models/drive';

const initialState = {
    userDrives: []
  };



  export default (state = initialState, action) => {
    switch (action.type) {
      case SET_DRIVE:
        return {
            userDrives: action.userDrives
        };
      case CREATE_DRIVE:
        const newDrive = new Drive(
          action.driveData.id,
          action.driveData.starting_point,
          action.driveData.destination,
          action.driveData.date,
          action.driveData.time,
          action.driveData.amount_of_people,
          action.driveData.deviation_time,
          action.driveData.driver,
          []
        );
        return {
          ...state,
          userDrives: state.userDrives.concat(newDrive)
        };
    }
    return state;
  };