
import {
  DELETE_DRIVE,
  CREATE_DRIVE,
  UPDATE_DRIVE,
  JOIN_DRIVE,
  SET_DRIVE
} from '../actions/drives';
import Drive from '../../models/drive';

const initialState = {
  userDrives: []
};

function drivesComperator (drive_a, drive_b) {
  if (drive_a.date > drive_b.date) {
    return -1;
  }
  else if (drive_b.date > drive_a.date) {
      return 1;
  }
  else{
    if (drive_a.time > drive_b.time){
      return -1;
    }
    else if (drive_b.time > drive_a.time) {
      return 1;
    }
    else{
      return 0;
    }
  }
}


export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DRIVE:
      return {userDrives: action.userDrives.sort(drivesComperator)};
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
        [],
        []
      );
      const tmp = (state.userDrives.concat(newDrive)).sort(drivesComperator)
      return {userDrives: tmp};
    case JOIN_DRIVE:
      const driveKey =  action.driveData.id;
      const passangers= action.driveData.passangers;
      const passangersPushToken= action.driveData.passangersPushToken;
      const objIndex = userDrives.findIndex((obj => obj.id === driveKey));
      state.userDrives[objIndex].passangers = passangers;
      state.userDrives[objIndex].passangersPushToken = passangersPushToken;
      return {userDrives: userDrives};
  }
  return state;
};