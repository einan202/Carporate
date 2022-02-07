import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';


const FilterSwitch = props => {
    const [isAnimalFree, setIsAnimalFree] = useState(false);
    return (
        <View style={styles.filterContainer}>
            <Text>{props.label}</Text>
            <Switch
                value={props.state}
                onValueChange={props.onChange}
            />
        </View>
    );
}

const FiltersScreen = props => {
    const [isAnimalFree, setIsAnimalFree] = useState(false);
    const [isCargoFree, setIsCargoFree] = useState(false);
    const [isTollRoadsFree, setIsTollRoadsFree] = useState(false);
    const [isFriendlyFree, setIsFriendlyFree] = useState(true);
    const [isCoffeeStopFree, setIsCoffeeStopFree] = useState(false);
    const [isOtherFree, setIsOtherFree] = useState(false);

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Notes</Text>
            <View style={styles.filterRowContainer}>
                <FilterSwitch
                    label='Animals'
                    state={isAnimalFree}
                    onChange={newValue => setIsAnimalFree(newValue)}
                />
                <FilterSwitch
                    label='Cargo'
                    state={isCargoFree}
                    onChange={newValue => setIsCargoFree(newValue)}
                />
                <FilterSwitch
                    label='Toll-Roads'
                    state={isTollRoadsFree}
                    onChange={newValue => setIsTollRoadsFree(newValue)}
                />
            </View>
            <View style={styles.filterRowContainer}>
                <FilterSwitch
                    label='Friendly'
                    state={isFriendlyFree}
                    onChange={newValue => setIsFriendlyFree(newValue)}
                />
                <FilterSwitch
                    label='Coffee-Stop'
                    state={isCoffeeStopFree}
                    onChange={newValue => setIsCoffeeStopFree(newValue)}
                />
                <FilterSwitch
                    label='Other'
                    state={isOtherFree}
                    onChange={newValue => setIsOtherFree(newValue)}
                />
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center'
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 22,
        margin: 10,
        textAlign: 'center'
    },
    filterRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    filterContainer: {
        alignItems: 'center',
        width: '33%'
    }
});

export default FiltersScreen;