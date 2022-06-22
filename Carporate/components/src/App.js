import React from "react";
import { NavigationContainer  } from "@react-navigation/native";
import HomeStackNaviator from "./navigations/navigator";

const App = () => {
    return (
        <NavigationContainer>
            <HomeStackNaviator/>
        </NavigationContainer>
    )
}

export default App;