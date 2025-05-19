import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Empty, Spin, Badge, Tooltip, Divider } from "antd";
import {
  Bell,
  CheckCheck,
  Clock,
  AlertCircle,
  MessageSquare,
  CheckCircle,
  User,
  Users,
  ChevronRight,
} from "lucide-react";

const NotificationPanel = ({ isOpen, onClose, onNotificationsUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Fetch notifications when the panel opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      const userId = userData.id;
      const userType = userData.role;

      if (!userId || !userType) {
        setError("User information not found");
        return;
      }

      const response = await axios.get("/api/notifications/recent", {
        params: { userId, userType, limit: 5 },
        ...getAuthConfig(),
      });

      setNotifications(response.data.notifications || []);

      // Update unread count
      if (onNotificationsUpdate) {
        onNotificationsUpdate(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `/api/notifications/${notificationId}/read`,
        {},
        getAuthConfig()
      );
      // Update local notification list
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      // Refetch unread count to update badge
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      const response = await axios.get("/api/notifications/unread-count", {
        params: { userId: userData.id, userType: userData.role },
        ...getAuthConfig(),
      });

      if (onNotificationsUpdate) {
        onNotificationsUpdate(response.data.count || 0);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleViewAllClick = () => {
    navigate("/notifications");
    onClose();
  };

  const renderNotificationIcon = (notification) => {
    const type = notification.type || "info";

    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notifTime) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    return `${Math.floor(diffInSeconds / 86400)} day(s) ago`;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200"
      style={{ maxHeight: "80vh" }}
    >
      {/* Header */}
      <div className="p-4 bg-blue-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg text-gray-800">Notifications</h3>
          <Tooltip title="Mark all as read">
            <Button
              type="text"
              size="small"
              icon={<CheckCheck className="h-4 w-4" />}
              onClick={async () => {
                try {
                  const userData =
                    JSON.parse(localStorage.getItem("user")) || {};
                  await axios.post(
                    `/api/notifications/mark-all-read`,
                    {
                      userId: userData.id,
                      userType: userData.role,
                    },
                    getAuthConfig()
                  );
                  setNotifications((prevNotifications) =>
                    prevNotifications.map((notification) => ({
                      ...notification,
                      is_read: true,
                    }))
                  );
                  if (onNotificationsUpdate) {
                    onNotificationsUpdate(0);
                  }
                } catch (error) {
                  console.error("Error marking all as read:", error);
                }
              }}
            />
          </Tooltip>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
        {loading ? (
          <div className="p-8 flex justify-center">
            <Spin />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <AlertCircle className="h-10 w-10 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8">
            <Empty description="No notifications yet" />
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                  !notification.is_read ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  if (!notification.is_read) {
                    markAsRead(notification.id);
                  }
                  // Handle click based on notification type
                  if (notification.link) {
                    navigate(notification.link);
                    onClose();
                  }
                }}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <div
                      className={`p-2 rounded-full ${
                        !notification.is_read ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      {renderNotificationIcon(notification)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p
                        className={`text-sm font-medium ${
                          !notification.is_read
                            ? "text-blue-600"
                            : "text-gray-800"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>

                    {/* From/To information - conditionally render based on role */}
                    <div className="mt-1 flex items-center">
                      {notification.sender_type && (
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 flex items-center">
                          {notification.sender_type === "customer" ? (
                            <User className="h-3 w-3 mr-1" />
                          ) : notification.sender_type === "staff" ? (
                            <User className="h-3 w-3 mr-1" />
                          ) : (
                            <Users className="h-3 w-3 mr-1" />
                          )}
                          {notification.sender_name || notification.sender_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <Button
          type="link"
          className="w-full flex justify-center items-center text-blue-600 hover:text-blue-800"
          onClick={handleViewAllClick}
        >
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationPanel;
