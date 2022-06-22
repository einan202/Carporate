import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import {
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

const Home = ({ naviation }) => {
  return (
    <View
      style={{
        backgroundColor: '#FFF',
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: '#00a46c',
          height: '28%',
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          paddingHorizontal: 20,
        }}
      >
        <Image
          source={require('../images/1.png')}
          style={{
            height: 10,
            width: 20,
            marginTop: 50,
          }}
        />
      </View>
    </View>
  );
};

export default Home;
