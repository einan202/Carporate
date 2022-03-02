import {
    SEARCH_DRIVE,
  } from '../actions/passanger';
  import Drive from '../../models/drive';
  
  const initialState = {
      foundedDrives: []
    };


    export default (state = initialState, action) => {
        switch (action.type) {
          case SEARCH_DRIVE:
            return {
                foundedDrives: action.foundedDrives.sort((drive_a, drive_b)=> {
                    if (drive_a.old_drive.date > drive_b.old_drive.date) {
                      return -1;
                  }
                  if (drive_b.old_drive.date > drive_a.old_drive.date) {
                      return 1;
                  }
                  else{
                    if(drive_a.old_drive.time > drive_b.old_drive.time){
                      return -1;
                    }
                    if (drive_b.old_drive.time > drive_a.old_drive.time) {
                      return 1;
                  }
                  return 0;
                  }
                  })
            }
        }
            return state;
  };
  