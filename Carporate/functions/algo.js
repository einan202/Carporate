import * as googleAPI from './googleAPI.js'
const NUM_OF_FILTERED_POINTS = 3;
const SEARCH_RANGE = [1500, 5000, 10000];
/*
  Input: 
    1. location = Passenger's current location (should be LatLng)
    2. oldDir = The directions of the drive we want to join the passenger
    3. (optional) pickUpRangeFilter = should be a number between [0, 3] 


  Output:
    An Object with the following keys:
      1. newDir - The directions of the drive if passenger joined
      2. pickUpPoint - Place Object of the point where the driver pick up the passenger
      3. devationTime - The time added to the old drive if passenger joined (minutes)

*/

/* ***************************************************************************************** */

export async function algo(st_location, dest_location, oldDir, pickUpRangeFilter = 0, dropOffRangeFilter = 0, date = new Date()){
  let pickUpPoints = pickUpRangeFilter < 0 ? [st_location] : await nearbyPoints(st_location, pickUpRangeFilter);
  let dropOffPoints = dropOffRangeFilter < 0 ? [dest_location] : await nearbyPoints(dest_location, dropOffRangeFilter);
  
  
  //********************************************************************** */
  let oldDriveInfo = new DriveInfo({
    directions: oldDir
  }); //depends on what we save on the database
  //********************************************************************** */

  let {
    pickUpPoint,
    dropOffPoint,
    newDir,
    newDriveInfo
  } = await optDrive(pickUpPoints, dropOffPoints, oldDriveInfo, date);
  // console.log(`oldDir Duration: ${googleAPI.getRouteDuration(googleAPI.getRoute(oldDir))}`)
  // console.log(`newDir Duration: ${googleAPI.getRouteDuration(googleAPI.getRoute(newDir))}`)
  // console.log(`oldDrive Duration: ${oldDriveInfo.getDuration({})}`);
  // console.log(`newDrive Duration: ${newDriveInfo.getDuration({})}`); 
  console.log(`oldDriveInfo: ${JSON.stringify(optDrive.oldDriveInfo)}`);
  let oldLegsDuration = oldDriveInfo.getLegsDuration();
  let newLegsDuration = newDriveInfo.getLegsDuration();
  console.log('old legs duration');
  for (let i=0; i < oldLegsDuration.length; i++){
    console.log(oldLegsDuration[i])
  }
  console.log('new legs duration');
  for (let i=0; i < newLegsDuration.length; i++){
    console.log(newLegsDuration[i])
  }
  let drivePoints = newDriveInfo.getPoints();
  let driveTime = newDriveInfo.getDuration({});
  let devationTime = Math.round(newDriveInfo.getDuration({}) - oldDriveInfo.getDuration({}));
  
  // let oldDirDuration = googleAPI.getRouteDuration(googleAPI.getRoute(oldDir));
  // let newDirDuration = googleAPI.getRouteDuration(googleAPI.getRoute(newDir));
  // devationTime = newDirDuration - oldDirDuration;
  // let passengerDriveDuration = googleAPI.getSubRouteDuration(newDir, pickUpPoint, undefined);

  return {
    pickUpPoint,
    dropOffPoint,
    newDir,
    drivePoints,
    devationTime,
    driveTime,
    newLegsDuration
  }
}

/* ***************************************************************************************** */

async function nearbyPoints(place, filter){
  let nearbySearch = await googleAPI.getNearbySearch(place, `transit_station`, `intersection`, SEARCH_RANGE[filter]);
  let nearbyPlaces = googleAPI.getNearbySearchPlaces(nearbySearch);
  // console.log(`Number of nearby places found - ${nearbyPlaces.length}`);
  // for (place of nearbyPlaces){
  //   console.log(JSON.stringify(place));
  // }
  let points = nearbyPlaces.slice(NUM_OF_FILTERED_POINTS - 1);
  // for (let i = 0; i < NUM_OF_FILTERED_POINTS && i < nearbyPlaces.length; i++){
  //   let currPlace = nearbyPlaces[i * filter];
  //   currPlace = currPlace === undefined ? nearbyPlaces[points.length - 1] : currPlace ;
  //   points.push(currPlace);
  // }
  return points
}

async function optDrive(pickUpPoints, dropOffPoints, oldDriveInfo, depature_time) {
  // Set Params for old Drive Points

  let origin = oldDriveInfo.getStPoint();
  let destination = oldDriveInfo.getEndPoint();
  let waypoints = oldDriveInfo.getWayPoints();

  // For each 2 points, Calculate the new drive duration
  // Save the optDrive Details only for the shortest new drive so far
  let minDuration = Infinity;

  let optDrive = {
    pickUpPoint: undefined, 
    dropOffPoint: undefined, 
    newDir: undefined, 
    newDriveInfo: undefined
  }
  
  for (let i = 0; i < Math.min(NUM_OF_FILTERED_POINTS, pickUpPoints.length); i++){
    for (let j = 0; j < Math.min(NUM_OF_FILTERED_POINTS,dropOffPoints.length); j++){
      let currPickUpPoint = pickUpPoints[i];
      let currDropOffPoint = dropOffPoints[j];
      // Find the new drive with the picking point
      let pickUpDir = await googleAPI.getDirections(
        origin, 
        destination, 
        depature_time.getTime(), 
        [currPickUpPoint, ...waypoints]
      );
      let pickUpDrive = new DriveInfo({directions: pickUpDir});
      // Divide the new drive with the pickup point to two
      // Until the picking point (firstDrive)
      // From the picking point (secondDrive)
      let currPickUpPointIndex = pickUpDrive.getPointIndex(currPickUpPoint);
      let firstDrive = pickUpDrive.getSlicedDrive({end_index: currPickUpPointIndex+1});
      let secondDrive = pickUpDrive.getSlicedDrive({st_index: currPickUpPointIndex});
      // Find a new drive - the second drive with the dropOff point
      let dropOffDir = await googleAPI.getDirections(
        secondDrive.getStPoint(), 
        secondDrive.getEndPoint(), 
        depature_time.getTime(), 
        [currDropOffPoint, ...secondDrive.getWayPoints()]
      );
      let dropOffDrive = new DriveInfo({directions: dropOffDir});
      
      // console.log(`First Drive End Point: ${firstDrive.getEndPoint().place_id}`)
      // console.log(`DropOff Drive Starting Point: ${dropOffDrive.getStPoint().place_id}`)

      // Create a new DriveInfo of the new drive with the pickup and dropoff points
      let mergedDrive = firstDrive.getMergedDrive(dropOffDrive);
      let currDuration = mergedDrive.getDuration({});
      //console.log(`currDuration: ${currDuration}`);
      if (currDuration < minDuration){
        minDuration = currDuration;
        console.log(`minDuration = ${minDuration}`);
        optDrive.pickUpPoint = currPickUpPoint;
        optDrive.dropOffPoint = currDropOffPoint;
        optDrive.newDir = await googleAPI.getDirections(
          mergedDrive.getStPoint(), 
          mergedDrive.getEndPoint(), 
          depature_time.getTime(), 
          mergedDrive.getWayPoints()
        );
        optDrive.newDriveInfo = mergedDrive;
      } 
    }
  }
  console.log(`In optDrive: ${JSON.stringify(optDrive.newDriveInfo)}`);

  return optDrive;
}

// Holds all the Place type points in the drive
// Contains also the duration in minutes for each leg in the drive
class DriveInfo{
  // Two options for constructor arguments:
  // 1) object with a field of directions
  // 2) object with 2 fields: points, legs_duration
  constructor(argmap){
    if ('directions' in argmap){
      this.points = googleAPI.getRoutePointsInOrder(argmap.directions);
      this.legs_duration = googleAPI.getLegsDuration(argmap.directions);
    }
    else{
      this.points = argmap.points;
      this.legs_duration = argmap.legs_duration;
    }
  }
  getPoint(index){return this.points[index]}
  getStPoint(){return this.points[0]}
  getEndPoint(){return this.points[this.points.length-1]}
  getPoints(){return this.points}
  getWayPoints(){return this.points.slice(1, this.points.length-1)}
  getLegsDuration(){return this.legs_duration}
  getPointIndex(place){
    let index = -1;
    for(let i = 0; i < this.points.length; i++){
      if (this.points[i].place_id === place.place_id){
        index = i;
        break;
      }
    }
    return index;
  }
  // Get drive duration from point "st_index", to point "end_index" included
  // if (st_index > end_index) returns -1
  getDuration({st_index = 0, end_index = this.legs_duration.length}){
    let duration = 0;
    for (let i = st_index; i < end_index; i++){
      duration += this.legs_duration[i];
    }
    return Math.round(duration);
  }
  // Get a new DriveInfo for the a drive
  // from point "st_index", to point "end_index" included
  // if and only if (st_index < end_index)
  getSlicedDrive({st_index = 0, end_index = this.points.length}){
    let slicedDrive = null;
    if (st_index < end_index){
      slicedDrive = new DriveInfo({
        points: this.points.slice(st_index, end_index),
        legs_duration: this.legs_duration.slice(st_index, end_index-1)
      });
    }
    return slicedDrive;
  }
  // Get a new DriveInfo for both drives if and only if
  // the end point of the first is the same as the starting point of the other
  getMergedDrive(drive){
    let mergedDrive = null;

    if(
      drive instanceof DriveInfo &&
      this.getEndPoint().place_id === drive.getStPoint().place_id
      )
    {
      mergedDrive = new DriveInfo({
        points: this.points.concat(drive.points.slice(1)),
        legs_duration: this.legs_duration.concat(drive.legs_duration)
      });
    }
    return mergedDrive;
  } 
}
