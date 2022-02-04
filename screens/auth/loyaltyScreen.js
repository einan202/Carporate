import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Text
} from 'react-native';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loyaltyScreen = props => {
  const [detaills, setDetaills] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    age: '',
    gender: ''
  });

const getDetaills = async () => {
    try {
      const userDetaills = await AsyncStorage.getItem('userDetaills');
      const transformedDetaills = JSON.parse(userDetaills);
      setDetaills(transformedDetaills);
    } catch (error) {
      console.log('Something went wrong in your code', error)
    }
  };


  useEffect(() => {
    getDetaills();
  }, []);

    return (
     
      <ScrollView>
         <View style={styles.textContainer}>
        <Text style = {{fontSize: 20}}> E-Mail: {detaills.email} </Text>
        </View>
        <View style={styles.textContainer}>
        <Text style = {{fontSize: 20}}> First name: {detaills.first_name}</Text>
        </View>
        <View style={styles.textContainer}>
        <Text style = {{fontSize: 20}}> Last name:{detaills.last_name} </Text>
        </View>
        <View style={styles.textContainer}>
        <Text style = {{fontSize: 20}}> Phone-Number: {detaills.phone_number}</Text>
        </View>
        <View style={styles.textContainer}>
        <Text style = {{fontSize: 20}}> Age: {detaills.age}</Text>
        </View>
        <View style={styles.textContainer}>
        <Text style = {{fontSize: 20}}> Gender: {detaills.gender}</Text>
        </View>
        <Text>upcoming drives</Text>
       
    </ScrollView>
    
    )
  };


  const styles = StyleSheet.create({
   
    textContainer: {
      marginTop:10,
      padding: 20,
      paddingHorizontal: 2,
      paddingVertical: 5,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      shadowColor: 'black',
      shadowOpacity: 0.26,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 10,
      elevation: 5,
      borderRadius: 12,
      backgroundColor: 'white'
      


    }
  });

export default loyaltyScreen;