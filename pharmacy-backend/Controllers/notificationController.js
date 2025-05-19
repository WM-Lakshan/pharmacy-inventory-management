// controllers/notification.controller.js
const NotificationModel = require("../Models/notificationModel");

class NotificationController {
  /**
   * Get all notifications for a user with pagination and filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getNotifications(req, res) {
    try {
      const result = await NotificationModel.getNotifications(req.query);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in getNotifications controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching notifications",
      });
    }
  }

  /**
   * Get recent notifications for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getRecentNotifications(req, res) {
    try {
      const result = await NotificationModel.getRecentNotifications(req.query);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in getRecentNotifications controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching recent notifications",
      });
    }
  }

  /**
   * Get unread notification count for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getUnreadCount(req, res) {
    try {
      const result = await NotificationModel.getUnreadCount(req.query);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in getUnreadCount controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while getting unread count",
      });
    }
  }

  /**
   * Mark a notification as read
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const result = await NotificationModel.markAsRead(id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in markAsRead controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while marking notification as read",
      });
    }
  }

  /**
   * Mark multiple notifications as read
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async markSelectedAsRead(req, res) {
    try {
      const { notificationIds } = req.body;

      if (!notificationIds || !Array.isArray(notificationIds)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification IDs",
        });
      }

      const result = await NotificationModel.markSelectedAsRead(
        notificationIds
      );
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in markSelectedAsRead controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while marking notifications as read",
      });
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async markAllAsRead(req, res) {
    try {
      const result = await NotificationModel.markAllAsRead(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in markAllAsRead controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while marking all notifications as read",
      });
    }
  }

  /**
   * Delete a notification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteNotification(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification ID",
        });
      }

      const result = await NotificationModel.deleteNotification(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error in deleteNotification controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while deleting notification",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Delete multiple notifications
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteSelectedNotifications(req, res) {
    try {
      const { notificationIds } = req.body;

      if (!notificationIds || !Array.isArray(notificationIds)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification IDs",
        });
      }

      const result = await NotificationModel.deleteSelectedNotifications(
        notificationIds
      );
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in deleteSelectedNotifications controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while deleting notifications",
      });
    }
  }

  /**
   * Get potential recipients for notifications
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getRecipients(req, res) {
    try {
      const { userType } = req.query;

      if (!userType) {
        return res.status(400).json({
          success: false,
          message: "User type is required",
        });
      }

      const result = await NotificationModel.getRecipients(userType);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in getRecipients controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching recipients",
      });
    }
  }

  /**
   * Send a notification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async sendNotification(req, res) {
    try {
      const result = await NotificationModel.sendNotification(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in sendNotification controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while sending notification",
      });
    }
  }

  /**
   * Create notification helper method (for internal use by other controllers)
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} - Result
   */
  static async createNotification(notificationData) {
    try {
      // Logic depends on the recipient type
      if (notificationData.recipientType === "specific") {
        return await NotificationModel.sendToSpecificUser(notificationData);
      } else {
        return await NotificationModel.sendToAllUsersOfType(notificationData);
      }
    } catch (error) {
      console.error("Error in createNotification:", error);
      throw error;
    }
  }
}

module.exports = NotificationController;
