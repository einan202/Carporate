import React, { useState,  useCallback, useEffect } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import NotificationItem from "../../components/shop/NotificationItem";
import * as notificationsActions from "../../store/actions/notifications";

const Cred = (
  <View>
    <Text
      style={{
        fontSize: 20,
        textAlign: "center",
        fontFamily: "open-sans-bold",
      }}
    >
      Your Notifications
    </Text>
  </View>
);

const notificationScreen = async (props) => {
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
          <Text>No notifications found</Text>
        </View>
      }
    />
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
});

export default notificationScreen;
