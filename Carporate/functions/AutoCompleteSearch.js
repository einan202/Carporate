import * as React from "react"
import { View } from "react-native"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"

const KEY = "AIzaSyAxYot8Bu7ZdNcaY1tPyHcJUXISKs4V9K8";

export default function AutoCompleteSearch({placeholder, setPlace}) {
	return (
		<View style={{ marginBottom: 50 }}>
			<GooglePlacesAutocomplete
				placeholder={placeholder}
				fetchDetails={true}
				onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
					//console.log(data.description, data.place_id, details.geometry.location);
					setPlace({
						address: data.description,
						place_id: data.place_id, 
						location: {
							lat: details.geometry.location.lat, 
							lng: details.geometry.location.lng
						}
					});
				}}
				query={{
					key: KEY,
					language: "iw",
					component: "country:il"
				}}
				styles={{
					textInput: { zIndex: 1, elevation: 1 },
					container: { flex: 1, position: "absolute", width: "100%", zIndex: 1, elevation: 1},
					listView: {backgroundColor:"white"},
				}}
			/>
		</View>
	)
}





