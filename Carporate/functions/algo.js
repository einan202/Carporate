import * as googleAPI from './googleAPI.js'

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