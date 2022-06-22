import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, Button, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

function CollapseView(props) {
  const [collapsed, setCollapsed] = useState(true);
  const [maxLines, setMaxLines] = useState(0);
  const animationHeight = useRef(new Animated.Value(0)).current;

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const collapseView = () => {
      Animated.timing(animationHeight, {
        duration: 1000,
        toValue: 80,
      }).start();
  }

  const expandView = () => {
      setMaxLines(null)
      Animated.timing(animationHeight, {
        duration: 1000,
        toValue: 1000,
      }).start();
  }

  useEffect(() => {
    if (collapsed) {
      collapseView()
    } else {
      expandView()
    }
  }, [collapsed]);

  if (props.passangers.length===0){
  return (
    <View style={{overflow:'hidden'}}>
       <Button onPress = {toggleCollapsed} title = {'for more information'} />
      <Animated.View style={{maxHeight: animationHeight}}>
      
        <Text>there are no more information</Text>
      </Animated.View>
      
    </View>
  );
}
else{
    return (
        <View style={{overflow:'hidden'}}>
            <TouchableOpacity onPress = {toggleCollapsed} >
          <Animated.View style={{maxHeight: animationHeight}}>
              
            <Text style={styles.paragraph} numberOfLines={maxLines}>
            for more information
            </Text>
          </Animated.View>
          </TouchableOpacity>
        </View>);
}
}

const styles = StyleSheet.create({
  paragraph: {
    margin: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    textAlign: 'center',
    fontFamily: "fontawesome-webfont",
    fontSize: 17,
    color: '#888'
  },
});

export default CollapseView;
