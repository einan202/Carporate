import React, { useState,  useCallback, useEffect } from "react";
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import NotificationItem from "../../components/shop/NotificationItem";
import * as notificationsActions from "../../store/actions/notifications";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const Cred = (
  // <View style={{padding: 20}}>
  //   <Text style={{ fontSize: 28, textAlign: 'center', color: 'white'}}>
  //     Your Notifications
  //   </Text>
  // </View>
  <View style={{ padding: 10}}></View>
);

const NotificationScreen = props => {
  const userID = useSelector((state) => state.auth.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.userNotifications);

  
  const loadNotifications = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      
      await dispatch(notificationsActions.updateNotifications(userID));
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadNotifications().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadNotifications]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadNotifications()}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
 
  return (
    <LinearGradient colors={['#f7e8df', '#ffe3ff']} style={{flex:1}}>
      <FlatList
        refreshing={isRefreshing}
        ListHeaderComponent={Cred}
        onRefresh={loadNotifications}
        data={notifications}
        keyExtractor = {item => item.id}
        renderItem={(itemData) => (
          <NotificationItem
            title={itemData.item.title}
            body={itemData.item.body}
            time={itemData.item.time}
          />
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
          <Text style={{textAlign: 'center', marginTop: 30, fontSize: 20,fontFamily: "fontawesome-webfont",
              fontWeight: '900', color: 'black'}}>No notifications lately</Text>
          </View>
        }
      />
    </LinearGradient>
  );

};

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 10,
    padding: 20,
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 12,
    backgroundColor: "white",
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default NotificationScreen;
