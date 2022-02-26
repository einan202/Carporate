const KEY = 'AIzaSyAxYot8Bu7ZdNcaY1tPyHcJUXISKs4V9K8';
const config = {
  method: 'GET',
  headers: {}
};

export async function getDirections(origin, destination, depature_time = undefined, waypoints = undefined){
  let url = `https://maps.googleapis.com/maps/api/directions/json`+
  `?origin=place_id:${origin}`+
  `&destination=place_id:${destination}`+
  `&key=${KEY}`+
  `&alternatives=false`+
  `&language=iw`+
  `&region=il`+
  `&units=metric`;
  url = depature_time === undefined ? url : (url + `&depature_time=${depature_time}`);
  url = waypoints === undefined ? url : (url + '&waypoints=optimize:true|place_id:'+waypoints.join('|place_id:')); 
  try {
    let response = await fetch(url, config);
    let data = await response.json();
    if (data.status === "OK")
      return data;
    else {
      throw Error(`Response Status = ${data.status}\nCheck documentation for more details`);
    }
  }
  catch (error){
    console.log(error);
  }
}

export function getRoute(dir){
  return dir.routes[0];
}

export function getRouteLegsDuration(route){
  return route.legs.map(leg => leg.duration.value);
}

export function getRouteDuration(route){
  let routeLegsDuration = getRouteLegsDuration(route);
  let duration = routeLegsDuration.reduce((acc, curr) => acc + curr, 0);
  duration = duration / 60; // In Minutes
  return duration;
}

export function getWayPointsInOrder(dir) {
  // Get Route Points by addresses
  let legs = dir.routes[0].legs
  let numOfPoints = legs.length + 1;
  let numOfWayPoints = numOfPoints > 2 ? (numOfPoints - 2) : 0;
  // Get Route Points by addresses
  let pointsByAddr = legs.map(leg => leg.start_address);
  pointsByAddr.push(legs[legs.length-1].end_address);
  // Get Route Points by LatLng
  let pointsByLatLng = legs.map(leg => leg.start_location);
  pointsByLatLng.push(legs[legs.length-1].end_location);
  // Get Route Points Order
  let wayPointsInOrder = dir.routes[0].waypoint_order;
  // Get Route Points by Place Id (sorted)
  let pointsByPlaceId = dir.geocoded_waypoints.map(geoCodedPoint => geoCodedPoint.place_id);
  //Sort Route Points by Place Id
  if (numOfWayPoints > 0){
    let wayPointsPlaceId = pointsByPlaceId.slice(1, numOfPoints-1);
    wayPointsPlaceId = wayPointsInOrder.map(index => wayPointsPlaceId[index]);
    pointsByPlaceId = [pointsByPlaceId[0], ...wayPointsPlaceId, pointsByPlaceId[numOfPoints-1]];
  }
  let pointsInOrder = []
  for (let i = 0; i < numOfPoints; i++){
    let point = {
      address: pointsByAddr[i],
      place_id: pointsByPlaceId[i],
      location: pointsByLatLng[i]
    }
    pointsInOrder.push(point);
  }
  return pointsInOrder;
}

export async function getNearbySearch(lat, lng, type, radius = undefined) {
  /* return top five place_ids of transit stations, 
      ordered by distance given a LatLng location using NearbySearch API */

  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`+ 
  `type=${type}`+
  `&rankby=distance`+
  // `&radius=800`+
  `&location=${lat}%2C${lng}`+
  `&key=AIzaSyAxYot8Bu7ZdNcaY1tPyHcJUXISKs4V9K8`;

  try {
    let response = await fetch(url, config);
    let data = await response.json();
    if (data.status === "OK")
      return data;
    else {
      throw Error(`Response Status = ${data.status}\nCheck documentation for more details`);
    }
  }
  catch (error){
    console.log(error);
  }
}

export function getNearbySearchPlacesId(nearbyPlaces){
  return nearbyPlaces.results.map(place => place.place_id);
}

export function getNearbySearchPlacesDetails(nearbyPlaces){
  let details = nearbyPlaces.results.map(place => {
    let pointDetails = {
      address: place.name,
      place_id: place.place_id,
      location:{
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      }
    };
    return pointDetails;
  });
  return details
}

export async function getPlaceId(text){
  let url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
  `input=${text}`+
  `&inputtype=textquery`+
  `&key=AIzaSyAxYot8Bu7ZdNcaY1tPyHcJUXISKs4V9K8`;
  try {
    let response = await fetch(url, config);
    let data = await response.json();
    if (data.status === "OK"){
      let placeId = data.candidates[0].place_id;
      return placeId;
    }
    else {
      throw Error(`Response Status = ${data.status}\nCheck documentation for more details`);
    }
  }
  catch (error){
    console.log(error);
  }
}

export async function getLatLng(placeId){
  let url = `https://maps.googleapis.com/maps/api/geocode/json?` 
              + `place_id=${placeId}&` 
              + `&key=AIzaSyAxYot8Bu7ZdNcaY1tPyHcJUXISKs4V9K8`; 
  try {
    let response = await fetch(url, config);
    let data = await response.json();
    if (data.status === "OK"){
      const latLng = data.results[0].geometry.location;
    return latLng;
    }
    else {
      throw Error(`Response Status = ${data.status}\nCheck documentation for more details`);
    }
  }
  catch (error){
    console.log(error);
  }
}
