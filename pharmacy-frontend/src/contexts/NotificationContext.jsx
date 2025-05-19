// contexts/NotificationContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create the context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      const userId = userData.id;
      const userType = userData.role;

      if (!userId || !userType) return;

      const response = await axios.get("/api/notifications/unread-count", {
        params: { userId, userType },
        ...getAuthConfig(),
      });

      if (response.data.success) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
    }
  };

  // Fetch recent notifications
  const fetchRecentNotifications = async (limit = 5) => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      const userId = userData.id;
      const userType = userData.role;

      if (!userId || !userType) return;

      const response = await axios.get("/api/notifications/recent", {
        params: { userId, userType, limit },
        ...getAuthConfig(),
      });

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching recent notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.post(
        `/api/notifications/${notificationId}/read`,
        {}, // Empty data object
        getAuthConfig()
      );

      if (response.data.success) {
        // Update local notification list
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );

        // Update unread count
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      const userId = userData.id;
      const userType = userData.role;

      if (!userId || !userType) return;

      const response = await axios.post(
        `/api/notifications/mark-all-read`,
        { userId, userType },
        getAuthConfig()
      );

      if (response.data.success) {
        // Update local notifications
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            is_read: true,
          }))
        );

        // Update unread count
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Send a notification
  const sendNotification = async (notificationData) => {
    try {
      const response = await axios.post(
        "/api/notifications/send",
        notificationData,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  };

  // Fetch unread count on mount and set up a refresh interval
  useEffect(() => {
    fetchUnreadCount();

    // Set up a periodic refresh (every minute)
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Create the provider value object
  const value = {
    unreadCount,
    notifications,
    loading,
    fetchUnreadCount,
    fetchRecentNotifications,
    markAsRead,
    markAllAsRead,
    sendNotification,
  };

  // Return the provider component
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
