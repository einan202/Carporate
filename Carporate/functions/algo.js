import * as googleAPI from './googleAPI.js'

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
  let pickUpPoints = googleAPI.getNearbySearchPlacesDetails(nearbyPlaces);
  let filteredPickUpPoints = [];
  
  for (let i = 0; i < 5 && i < pickUpPoints.length; i++){
    let tmpPickUpPoint = pickUpPoints[i * pickUpRangeFilter];
    tmpPickUpPoint = tmpPickUpPoint === undefined ? pickUpPoints[pickUpPoints.length - 1] : tmpPickUpPoint ;
    filteredPickUpPoints.push(tmpPickUpPoint);
  }
  
  let {optDir: newDir, pickUpPoint} = await optimalDir(filteredPickUpPoints, oldDir);

  let oldDirDuration = googleAPI.getRouteDuration(googleAPI.getRoute(oldDir));
  let newDirDuration = googleAPI.getRouteDuration(googleAPI.getRoute(newDir));
  let devationTime = newDirDuration - oldDirDuration;

  //let passengerDriveDuration = googleAPI.getSubRouteDuration(newDir, pickUpPoint, undefined);

  return {newDir, pickUpPoint, devationTime}
}

/* ***************************************************************************************** */

async function optimalDir(pickUpPoints, oldDir, depature_time = new Date()) {
  // Set Params for Directions Request
  let points = googleAPI.getRoutePointsInOrder(oldDir);
  let origin = points[0]
  let destination = points[points.length-1];
  let waypoints = points.slice(1, points.length-1);
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
 
  let output = {optDir: dirs[index], pickUpPoint: pickUpPoints[index]};
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

  

}

