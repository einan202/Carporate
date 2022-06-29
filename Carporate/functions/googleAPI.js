import * as Linking from 'expo-linking';
const KEY = 'AIzaSyAxYot8Bu7ZdNcaY1tPyHcJUXISKs4V9K8';
const config = {
  method: 'GET',
  headers: {}
};

export async function getDirections(origin, destination, depature_time = undefined, waypoints = undefined){
  let waypointsById = waypoints === undefined ? undefined : waypoints.map(wayPoint => wayPoint.place_id);
  
  // console.log(`waypoints: ${JSON.stringify(waypoints)}`);
  // console.log(`waypoints by Id: ${waypointsById}`);

  let originById = origin.place_id;
  let destinationById = destination.place_id;
  let url = `https://maps.googleapis.com/maps/api/directions/json`+
  `?origin=place_id:${originById}`+
  `&destination=place_id:${destinationById}`+
  `&key=${KEY}`+
  `&alternatives=false`+
  `&language=iw`+
  `&region=il`+
  `&units=metric`;
  url = depature_time === undefined ? url : (url + `&depature_time=${depature_time}`);
  url = waypoints === undefined ? url : (url + '&waypoints=optimize:true|place_id:'+waypointsById.join('|place_id:')); 
  try {
    let response = await fetch(url, config);
    let data = await response.json();
    if (data.status === "OK")
      return data;
    else {
      throw Error(`Response Status = ${data.status}\nurl = ${url}\nCheck documentation for more details`);
    }
  }
  catch (error){
    console.log(error);
  }
}

export function getRoute(dir){
  // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

  return dir.routes[0];
}

// Returns the duration of each leg in minutes
export function getLegsDuration(dir){
  return dir.routes[0].legs.map(leg => (leg.duration.value / 60));
}

export function getRouteLegsDuration(route){
  return route.legs.map(leg => leg.duration.value);
}

export function getRouteDuration(route){
  let routeLegsDuration = getRouteLegsDuration(route);
  let duration = routeLegsDuration.reduce((acc, curr) => acc + curr, 0);
  duration = Math.round(duration / 60); // In Minutes
  return duration;
}

// NotCompleted !!!
export function getSubRouteDuration(dir, originPlaceId, destinationPlaceId){
  let routeLegs = route.legs;
  let routeWayPoints = getRoutePointsInOrder(dir);
  let originIndex = 0, destinationIndex = routeWayPoints.length - 1;
  for (let i = 0; i < routeWayPoints.length; i++){
    let currWayPoint = routeWayPoints[i];
    if (originPlaceId === currWayPoint.place_id){
      originIndex = i;
    }
    if (destinationPlaceId === currWayPoint.place_id){
      destinationIndex = i;
    }
  }
  let subRouteLegs = routeLegs.slice(originIndex, destinationIndex + 1);
  let subRouteLegsDuration = subRouteLegs.map(leg => leg.duration.value);
  let subRouteDuration = subRouteLegsDuration.reduce((acc, curr) => acc + curr, 0);
  subRouteDuration = subRouteDuration / 60;
  return subRouteDuration;
}

export function getRoutePointsInOrder(dir) {
  // Get The Number of Route Points
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
  // if (numOfWayPoints > 0){
  //   let wayPointsPlaceId = pointsByPlaceId.slice(1, numOfPoints-1);
  //   wayPointsPlaceId = wayPointsInOrder.map(index => wayPointsPlaceId[index]);
  //   pointsByPlaceId = [pointsByPlaceId[0], ...wayPointsPlaceId, pointsByPlaceId[numOfPoints-1]];
  // }
  let pointsInOrder = []
  for (let i = 0; i < numOfPoints; i++){
    let point = {
      address: pointsByAddr[i],
      place_id: pointsByPlaceId[i], 
      location: {
        lat: pointsByLatLng[i].lat, 
        lng: pointsByLatLng[i].lng
      }
    }
    pointsInOrder.push(point);
  }
  return pointsInOrder;
}

/* return the results of neraby places, 
    ordered by prominence given a LatLng location using NearbySearch API */
export async function getNearbySearch(place, type, keyword, radius) {
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`+ 
  `type=${type}`+
  `&rankby=prominence`+
  `&radius=${radius}`+
  //`&keyword=${keyword}`+
  `&location=${place.location.lat}%2C${place.location.lng}`+
  `&key=AIzaSyAxYot8Bu7ZdNcaY1tPyHcJUXISKs4V9K8`;

  try {
    let response = await fetch(url, config);
    let data = await response.json();
    if (data.status === "OK"){
      return data;
    }
    else {
      throw Error(`Response Status = ${data.status}\nCheck documentation for more details`);
    }
  }
  catch (error){
    console.log(error);
  }
}

//export function getNearbySearchPlacesId(nearbyPlaces){
//  return nearbyPlaces.results.map(place => place.place_id);
//}

export function getNearbySearchPlaces(nearbySearch){
  let places = nearbySearch.results.map(res => {
    let place = {
      address: res.name,
      place_id: res.place_id,
      location:{
        lat: res.geometry.location.lat,
        lng: res.geometry.location.lng
      }
    };
    return place;
  });
  return places
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

export async function createPlaceObj (place_id){
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&language=iw&key=${KEY}`);
  let data = await response.json();
  
  const placeObj ={
                address: data.results[0].formatted_address,
						    place_id: place_id, 
						    location: {
							    lat: data.results[0].geometry.location.lat, 
							    lng: data.results[0].geometry.location.lng
						}}
  
  return placeObj;
}

//based on direction object, opens the directions on maps phone
export function showDirectionInMaps(dir){
  /*let url = 'https://www.google.com/maps/dir/?api=1&';
  let originLatLng = `origin=${origin.location.lat},${origin.location.lng}&`;
  let destinationLatLng = `destination=${destination.location.lat},${destination.location.lng}&`
  let travelMode = `travelmode=driving`;
  url = url + originLatLng + destinationLatLng + travelMode ;
  if(wayPoints !== undefined){
    wayPoints = wayPoints.slice(1, wayPoints.length-1);
    let waypointsByLatLng = wayPoints.map(waypoint => getLatLng(waypoint));
    waypointsByLatLng = waypointsByLatLng.map(waypoint =>`${waypoint.lat},${waypoint.lng}`);
    url = url + '&waypoints='+waypointsByLatLng.join('|');
  }*/
  let url = 'https://www.google.com/maps/dir/?api=1&';
  let routesPointsByOrder = getRoutePointsInOrder(dir);
  let origin = `origin=${routesPointsByOrder[0].location.lat},${routesPointsByOrder[0].location.lng}&`;
  let destination = `destination=${routesPointsByOrder[routesPointsByOrder.length - 1].location.lat},${routesPointsByOrder[routesPointsByOrder.length - 1].location.lng}&`
  let travelMode = `travelmode=driving`;
  url = url + origin + destination + travelMode ;
  let waypoints = routesPointsByOrder.slice(1, routesPointsByOrder.length-1);
  if(waypoints.length > 0){
    waypoints = waypoints.map(waypoint =>`${waypoint.location.lat},${waypoint.location.lng}`);
    url = url + '&waypoints='+waypoints.join('|');
  }
  Linking.openURL(url);
}

