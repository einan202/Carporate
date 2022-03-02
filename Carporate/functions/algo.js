import * as googleAPI from './googleAPI.js'

<<<<<<< HEAD
/*
  Input: 
    1. location = Passenger's current location (should be LatLng)
    2. oldDir = The directions of the drive we want to join the passenger
    3. (optional) pickUpRangeFilter = should be a number between [1, 5] 


  Output:
    An Object with the following keys:
      1. newDir - The directions of the drive if passenger joined
      2. pickUpPoint - Place Object of the point where the driver pick up the passenger
      3. devationTime - The time added to the old drive if passenger joined (minutes)

*/
export async function algo(location, oldDir, pickUpRangeFilter = 1){
  let {lat, lng} = location;
  let nearbyPlaces = await googleAPI.getNearbySearch(lat, lng, `transit_station`);
  let pickUpPointsById = googleAPI.getNearbySearchPlacesId(nearbyPlaces);
  let filteredPickUpPointsById = [];
  
  for (let i = 0; i < 5 && i < pickUpPointsById.length; i++){
    let tmpPickUpPoint = pickUpPointsById[i * pickUpRangeFilter];
    tmpPickUpPoint = tmpPickUpPoint === undefined ? pickUpPointsById[pickUpPointsById.length - 1] : tmpPickUpPoint ;
    filteredPickUpPointsById.push(tmpPickUpPoint);
  }
  
  let {optDir: newDir, pickUpPoint} = await optimalDir(filteredPickUpPointsById, oldDir);

  let oldDirDuration = googleAPI.getRouteDuration(googleAPI.getRoute(oldDir));
  let newDirDuration = googleAPI.getRouteDuration(googleAPI.getRoute(newDir));
  let devationTime = newDirDuration - oldDirDuration;

  //let passengerDriveDuration = googleAPI.getSubRouteDuration(newDir, pickUpPoint, undefined);

  return {newDir, pickUpPoint, devationTime}
=======
export async function algo(placeId, oldDir){
  let {lat, lng} = await googleAPI.getLatLng(placeId);
  let nearbyPlaces = await googleAPI.getNearbySearch(lat, lng, `transit_station`);

  let pickUpPointsById = googleAPI.getNearbySearchPlacesId(nearbyPlaces);
  let filteredPickUpPointsById = [];
  const x = 4;
  for (let i = 0; i < 5 && i < pickUpPointsById.length; i++){
    filteredPickUpPointsById.push(pickUpPointsById[i * x]);
  }
  //filteredPickUpPointsById = pickUpPointsById.slice(0, 5);
  console.log('PickUp Points', filteredPickUpPointsById);
  let output = await optimalDir(filteredPickUpPointsById, oldDir);

  //console.log('Optimal Route Points', output.optDir.geocoded_waypoints);

  return {...output, filteredPickUpPointsById}
>>>>>>> d221a02d290e07b4b9608d314ea030991db18f13
}

/* ***************************************************************************************** */

async function optimalDir(pickUpPoints, oldDir, depature_time = new Date()) {
  // Set Params for Directions Request
  let points = googleAPI.getWayPointsInOrder(oldDir);
  let pointsById = points.map(point => point.place_id);
  let origin = pointsById[0]
  let destination = pointsById[pointsById.length-1];
  let waypoints = pointsById.slice(1, pointsById.length-1);
  // Get Directions for each potential point
  let dirs = await Promise.all(pickUpPoints.map(async currPickUpPoint => 
    await googleAPI.getDirections(
      origin, 
      destination, 
      depature_time.getTime(), 
      [currPickUpPoint, ...waypoints]
    )
  ));
  let index = findShortestDirIndex(dirs);
<<<<<<< HEAD
 
  let output = {optDir: dirs[index], pickUpPoint: await googleAPI.createPlaceObj(pickUpPoints[index])};
=======
  let output = {optDir: dirs[index], pickUpPoint: pickUpPoints[index]};
>>>>>>> d221a02d290e07b4b9608d314ea030991db18f13
  return output;

  /* ******************************************************************************** */

  function findShortestDirIndex(dirs){
      // For each Directions, Get the Route
      let routes = dirs.map(dir => googleAPI.getRoute(dir));
      // For each route, Get total duration
      let routesDuration = routes.map(route => googleAPI.getRouteDuration(route));
      
      let index = 0;
      let minDuration = Infinity
      for (let i = 0; i < routesDuration.length; i++) {
          let currRouteDuration = routesDuration[i];
          if (currRouteDuration < minDuration){
              index = i;
              minDuration = currRouteDuration;
          }
      }
      return index;
  }

<<<<<<< HEAD
  

}

=======
}
>>>>>>> d221a02d290e07b4b9608d314ea030991db18f13
