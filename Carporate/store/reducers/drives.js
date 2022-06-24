
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



  export default (state = initialState, action) => {
    switch (action.type) {
      case SET_DRIVE:
        return {
            userDrives: action.userDrives.sort((drive_a, drive_b)=> {
              if (drive_a.date > drive_b.date) {
                return 1;
            }
            if (drive_b.date > drive_a.date) {
                return -1;
            }
            else{
              if(drive_a.time > drive_b.time){
                return 1;
              }
              if (drive_b.time > drive_a.time) {
                return -1;
            }
            return 0;
            }
            })
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
          [],
          action.driveData.dir
        );
        const tmp = (state.userDrives.concat(newDrive)).sort((drive_a, drive_b)=> {
          if (drive_a.date > drive_b.date) {
            return 1;
        }
        if (drive_b.date > drive_a.date) {
            return -1;
        }
        else{
          if(drive_a.time > drive_b.time){
            return 1;
          }
          if (drive_b.time > drive_a.time) {
            return -1;
        }
        return 0;
        }
        })
        return {
          userDrives: tmp
        };
        case JOIN_DRIVE:
          if(state.userDrives != []){
            const driveKey =  action.driveData.id;
            const passangers= action.driveData.passangers;
            const amount_of_people =  action.driveData.amount_of_people;
            const deviation_time = action.driveData.deviation_time;
            const dir = action.driveData.dir;
            const objIndex = state.userDrives.findIndex((obj => obj.id === driveKey));
            state.userDrives[objIndex].passangers = passangers;
            state.userDrives[objIndex].amount_of_people = amount_of_people;
            state.userDrives[objIndex].deviation_time = deviation_time;
            state.userDrives[objIndex].dir = dir;
            return {
              userDrives: state.userDrives
            };
          }
          else{
            return {
              userDrives: [
                new Drive(
                  action.driveData.id,
                  action.driveData.starting_point,
                  action.driveData.destination,
                  action.driveData.date,
                  action.driveData.time,
                  action.driveData.amount_of_people,
                  action.driveData.deviation_time,
                  action.driveData.driver,
                  [],
                  action.driveData.dir
                )
              ]
            };
          }
          
    }
    return state;
  };