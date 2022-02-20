import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';

function getNearbyPlaces(lt, lg, type, radius) {

  /* return top five place_ids of transit stations, 
      ordered by distance given a LatLng location using NearbySearch API */

      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`
          
          + `type=${type}`
          + `&rankby=distance`
          // + `&radius=800`
          + `&location=${lt}%2C${lg}`
          + `&key=AIzaSyAxYot8Bu7ZdNcaY1tPyHcJUXISKs4V9K8`;

      let config = {
        method: 'GET',
        headers: {  },
      };

      fetch(url, config)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        if (data.status === "OK") {
            
          let json = JSON.stringify(data);
          const parsed = JSON.parse(json);
            
          let types1 = parsed.results[0].types;
          let place_ident1 = parsed.results[0].place_id;
          let place_ident2 = parsed.results[1].place_id;
          let place_ident3 = parsed.results[2].place_id;
          let place_ident4 = parsed.results[3].place_id;
          let place_ident5 = parsed.results[4].place_id;
            
          console.log(`place_id1 is: ${place_ident1}\nplace_id2 is: ${place_ident2}\nplace_id3 is: ${place_ident3}`);
          console.log(`place_id4 is: ${place_ident4}\nplace_id5 is: ${place_ident5}`);
          
        } else { 
            throw Error(`status is: ${data.status}`); 
        }
    });
  }

  export function mainFunc() {
    
    let search_name = `שמעה`;
    // let search_name = `Museum%20of%20Contemporary%20Art%20Australia`;
    let placeID;
    let lt, lg;

    let url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` 
          + `input=${search_name}`
          + `&inputtype=textquery`
          + `&key=AIzaSyAxYot8Bu7ZdNcaY1tPyHcJUXISKs4V9K8`;

    let config = {
      method: 'GET',
      headers: {  },
    };

    fetch(url, config)
        .then((response) => {
            return response.json();
        })
        .then(data => {
            placeID = data.candidates[0].place_id;
            console.log(`\nfirst request: place_id = ${placeID}`);
        // })
        // .then(data => {
          url = `https://maps.googleapis.com/maps/api/geocode/json?` 
              + `place_id=${placeID}&` 
              + `&key=AIzaSyAxYot8Bu7ZdNcaY1tPyHcJUXISKs4V9K8`; 
          fetch(url, config)
          .then((response) => {
            return response.json();
          })
          .then(data => {
            const { results } = data;
            const { geometry } = results[0];
            const { location } = geometry;
            const { lat } = location;
            lt = lat;
            const { lng } = location; 
            lg = lng;
            console.log(`second request: lat = ${lt} lng = ${lg}`);
            let type = `transit%5Fstation`;
            // let type = `light%5Frail%5Fstation`;
          // })
          // .then(data => {
            getNearbyPlaces(lt, lg, type, null);
            }).catch( error => {
              console.log(error);
            })
          })
        // });
}
  
export default function App() {

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text></Text>
      <TouchableOpacity
        onPress={() => { alert("request was sent"); mainFunc() }}
        style={{ backgroundColor: 'green' }}>
        <Text style={{ fontSize: 20, color: '#fff' }}> send a GET request </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

function getLatLngLocation(placeID) {

  /* gets location given a place_id using Geocode API */

  let url = `https://maps.googleapis.com/maps/api/geocode/json?` 
        + `place_id=${placeID}&` 
        + `&key=AIzaSyAxYot8Bu7ZdNcaY1tPyHcJUXISKs4V9K8`; 

  let config = {
      method: 'GET',
      headers: {  },
  };

  fetch(url, config)
  .then((response) => {
    return response.json();
  })
  .then(data => {
    const { results } = data;
    const { geometry } = results[0];
    const { location } = geometry;
    const { lat } = location;
    let lt = lat;
    const { lng } = location; 
    let lg = lng;
    console.log(`second request: lat = ${lt} lng = ${lg}`);
  });
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
