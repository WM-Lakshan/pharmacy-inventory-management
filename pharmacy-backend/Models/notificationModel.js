// models/notification.model.js
const { db } = require("../db");

class NotificationModel {
  /**
   * Get all notifications for a user
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Notifications and total count
   */
  // static async getNotifications(params) {
  //   try {
  //     const {
  //       userId,
  //       userType,
  //       page = 1,
  //       pageSize = 10,
  //       searchTerm = "",
  //       tab = "all",
  //       type = null,
  //       startDate = null,
  //       endDate = null,
  //     } = params;

  //     // Build the base query
  //     let query = `
  //       SELECT
  //         notification_id as id,
  //         title,
  //         message,
  //        user_type as type,
  //         created_at,
  //         is_read
  //       FROM
  //         notifications
  //       WHERE
  //         user_id = ? AND user_type = ?
  //     `;

  //     const queryParams = [userId, userType];

  //     // Add tab filter
  //     if (tab === "read") {
  //       query += " AND is_read = 1";
  //     } else if (tab === "unread") {
  //       query += " AND is_read = 0";
  //     }

  //     // Add search filter
  //     if (searchTerm) {
  //       query += " AND (title LIKE ? OR message LIKE ?)";
  //       queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
  //     }

  //     // Add type filter
  //     if (type) {
  //       query += " AND type = ?";
  //       queryParams.push(type);
  //     }

  //     // Add date range filter
  //     if (startDate) {
  //       query += " AND created_at >= ?";
  //       queryParams.push(startDate);
  //     }

  //     if (endDate) {
  //       query += " AND created_at <= ?";
  //       queryParams.push(`${endDate} 23:59:59`);
  //     }

  //     // Add ordering
  //     query += " ORDER BY created_at DESC";

  //     // Count total records
  //     const countQuery = query.replace(
  //       /SELECT.*FROM/i,
  //       "SELECT COUNT(*) as total FROM"
  //     );
  //     const [countResult] = await db.execute(countQuery, queryParams);
  //     const total = countResult[0].total || 0;

  //     // Add pagination
  //     //   query += " LIMIT ? OFFSET ?";
  //     //   queryParams.push(Number(pageSize), (Number(page) - 1) * Number(pageSize));

  //     // Execute query
  //     const [rows] = await db.execute(query, queryParams);

  //     return {
  //       success: true,
  //       notifications: rows,
  //       total,
  //     };
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //     throw error;
  //   }
  // }

  static async getNotifications(params) {
    try {
      const {
        userId,
        userType,
        page = 1,
        pageSize = 10,
        searchTerm = "",
        tab = "all",
        // type = null,
        startDate = null,
        endDate = null,
      } = params;

      // Validate required parameters
      if (!userId || !userType) {
        throw new Error("userId and userType are required parameters");
      }

      // Build the base query
      let query = `
      SELECT 
        notification_id as id,
        title,
        message,
        user_type as type, 
        created_at,
        is_read
      FROM 
        notifications
      WHERE 
        user_id = ? AND user_type = ?
    `;

      const queryParams = [userId, userType];

      // Add tab filter
      if (tab === "read") {
        query += " AND is_read = 1";
      } else if (tab === "unread") {
        query += " AND is_read = 0";
      }

      // Add search filter
      if (searchTerm) {
        query += " AND (title LIKE ? OR message LIKE ?)";
        queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
      }

      // // Add type filter
      // if (type) {
      //   query += " AND type = ?";
      //   queryParams.push(type);
      // }

      // Add date range filter
      if (startDate) {
        query += " AND created_at >= ?";
        queryParams.push(startDate);
      }

      if (endDate) {
        query += " AND created_at <= ?";
        queryParams.push(`${endDate} 23:59:59`);
      }

      // Add ordering
      query += " ORDER BY created_at DESC";

      // Count total records - with improved error handling
      const countQuery = query.replace(
        /SELECT.*?FROM/i,
        "SELECT COUNT(*) as total FROM"
      );

      let total = 0;
      try {
        const [countResult] = await db.execute(countQuery, queryParams);
        total = countResult[0]?.total || 0;
      } catch (countError) {
        console.error("Error counting notifications:", countError);
      }

      // Execute main query
      let rows = [];
      try {
        [rows] = await db.execute(query, queryParams);
      } catch (queryError) {
        console.error("Error fetching notifications:", queryError);
        throw new Error("Failed to fetch notifications");
      }

      return {
        success: true,
        notifications: rows,
        total,
      };
    } catch (error) {
      console.error("Error in getNotifications:", error);
      throw error;
    }
  }

  /**
   * Get recent notifications for a user
   * @param {Object} params - Parameters
   * @returns {Promise<Object>} - Recent notifications and unread count
   */
  static async getRecentNotifications(params) {
    try {
      const { userId, userType, limit = 5 } = params;

      // Query for recent notifications
      const query = `
        SELECT 
          notification_id as id,
          title,
          message,
          user_type as type,
          created_at,
          is_read
        FROM 
          notifications 
        WHERE 
          user_id = ? AND user_type = ?
        ORDER BY 
          created_at DESC
        
      `;

      const [rows] = await db.execute(query, [userId, userType, Number(limit)]);

      // Get unread count
      const unreadCount = await this.getUnreadCount({ userId, userType });

      return {
        success: true,
        notifications: rows,
        unreadCount: unreadCount.count,
      };
    } catch (error) {
      console.error("Error fetching recent notifications:", error);
      throw error;
    }
  }

  /**
   * Get unread notification count for a user
   * @param {Object} params - Parameters
   * @returns {Promise<Object>} - Unread count
   */
  static async getUnreadCount(params) {
    try {
      const { userId, userType } = params;

      const query = `
        SELECT COUNT(*) as count
        FROM notifications
        WHERE user_id = ? AND user_type = ? AND is_read = 0
      `;

      const [rows] = await db.execute(query, [userId, userType]);

      return {
        success: true,
        count: rows[0].count || 0,
      };
    } catch (error) {
      console.error("Error getting unread notification count:", error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   * @param {number} notificationId - Notification ID
   * @returns {Promise<Object>} - Result
   */
  static async markAsRead(notificationId) {
    try {
      const query = `
        UPDATE notifications
        SET is_read = 1
        WHERE notification_id = ?
      `;

      await db.execute(query, [notificationId]);

      return {
        success: true,
        message: "Notification marked as read",
      };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Mark multiple notifications as read
   * @param {Array<number>} notificationIds - Notification IDs
   * @returns {Promise<Object>} - Result
   */
  static async markSelectedAsRead(notificationIds) {
    try {
      if (!notificationIds.length) {
        return {
          success: false,
          message: "No notifications selected",
        };
      }

      const placeholders = notificationIds.map(() => "?").join(",");
      const query = `
        UPDATE notifications
        SET is_read = 1
        WHERE notification_id IN (${placeholders})
      `;

      await db.execute(query, notificationIds);

      return {
        success: true,
        message: `${notificationIds.length} notification(s) marked as read`,
      };
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param {Object} params - Parameters
   * @returns {Promise<Object>} - Result
   */
  static async markAllAsRead(params) {
    try {
      const { userId, userType } = params;

      const query = `
        UPDATE notifications
        SET is_read = 1
        WHERE user_id = ? AND user_type = ? AND is_read = 0
      `;

      const [result] = await db.execute(query, [userId, userType]);

      return {
        success: true,
        message: `${result.affectedRows} notification(s) marked as read`,
      };
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  /**
   * Delete a notification
   * @param {number} notificationId - Notification ID
   * @returns {Promise<Object>} - Result
   */
  static async deleteNotification(notificationId) {
    try {
      // First verify the notification exists
      const [check] = await db.execute(
        "SELECT notification_id FROM notifications WHERE notification_id = ?",
        [notificationId]
      );

      if (check.length === 0) {
        return {
          success: false,
          message: "Notification not found",
        };
      }

      // Then delete it
      const [result] = await db.execute(
        "DELETE FROM notifications WHERE notification_id = ?",
        [notificationId]
      );

      if (result.affectedRows === 0) {
        return {
          success: false,
          message: "No notification was deleted",
        };
      }

      return {
        success: true,
        message: "Notification deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting notification:", {
        error: error.message,
        notificationId,
      });

      // Handle foreign key constraint errors specifically
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return {
          success: false,
          message:
            "Cannot delete notification - it's referenced by other records",
        };
      }

      throw error;
    }
  }

  /**
   * Delete multiple notifications
   * @param {Array<number>} notificationIds - Notification IDs
   * @returns {Promise<Object>} - Result
   */
 static async deleteSelectedNotifications(notificationIds) {
  try {
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return {
        success: false,
        message: "Invalid notification IDs"
      };
    }

    // Filter out non-numeric IDs
    const validIds = notificationIds.filter(id => !isNaN(id));
    
    if (validIds.length === 0) {
      return {
        success: false,
        message: "No valid notification IDs provided"
      };
    }

    // Use transaction for atomic operation
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // First verify all notifications exist
      const [existing] = await connection.execute(
        `SELECT notification_id FROM notifications 
         WHERE notification_id IN (${validIds.map(() => '?').join(',')})`,
        validIds
      );

      if (existing.length !== validIds.length) {
        await connection.rollback();
        return {
          success: false,
          message: "Some notifications not found"
        };
      }

      // Perform deletion
      const [result] = await connection.execute(
        `DELETE FROM notifications 
         WHERE notification_id IN (${validIds.map(() => '?').join(',')})`,
        validIds
      );

      await connection.commit();

      return {
        success: true,
        message: `${result.affectedRows} notification(s) deleted`,
        affectedRows: result.affectedRows
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error in deleteSelectedNotifications:", {
      error: error.message,
      notificationIds
    });
    throw error;
  }
}

  /**
   * Get potential recipients for notifications
   * @param {string} userType - User type (manager or staff)
   * @returns {Promise<Object>} - Recipients
   */
  static async getRecipients(userType) {
    try {
      const recipients = [];

      // If user is manager, include staff members
      if (userType === "manager") {
        const staffQuery = `
          SELECT 
            pharmacy_staff_id as id,
            CONCAT(F_name, ' ', L_name) as name,
            'staff' as type
          FROM pharmacy_staff
        `;
        const [staffRows] = await db.execute(staffQuery);
        recipients.push(...staffRows);
      }

      // Both manager and staff can send to customers
      const customerQuery = `
        SELECT 
          customer_id as id,
          name,
          'customer' as type
        FROM customer
      `;
      const [customerRows] = await db.execute(customerQuery);
      recipients.push(...customerRows);

      return {
        success: true,
        recipients,
      };
    } catch (error) {
      console.error("Error getting recipients:", error);
      throw error;
    }
  }

  /**
   * Send a notification to a specific user
   * @param {Object} data - Notification data
   * @returns {Promise<Object>} - Result
   */
  static async sendToSpecificUser(data) {
    try {
      const { title, message, userId, userType } = data;

      const query = `
        INSERT INTO notifications (
          user_id,
          user_type,
          title,
          message,
          created_at,
          is_read
        ) VALUES (?, ?, ?, ?,NOW(), 0)
      `;

      const [result] = await db.execute(query, [
        userId,
        userType,
        title,
        message,
      ]);

      return {
        success: true,
        message: "Notification sent successfully",
        notificationId: result.insertId,
      };
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  /**
   * Send a notification to all users of a specific type
   * @param {Object} data - Notification data
   * @returns {Promise<Object>} - Result
   */
  static async sendToAllUsersOfType(data) {
    try {
      const { title, message, userType, type = "info" } = data;

      // Get all users of the specified type
      let userQuery;
      switch (userType) {
        case "staff":
          userQuery = "SELECT pharmacy_staff_id as id FROM pharmacy_staff";
          break;
        case "customer":
          userQuery = "SELECT customer_id as id FROM customer";
          break;
        case "manager":
          userQuery = "SELECT manager_id as id FROM manager";
          break;
        case "supplier":
          userQuery = "SELECT sup_id as id FROM supplier";
          break;
        default:
          return { success: false, message: "Invalid user type" };
      }

      const [users] = await db.execute(userQuery);

      if (users.length === 0) {
        return { success: false, message: "No users found of this type" };
      }

      // Create multiple insert values for all users
      const values = users.map((user) => [
        user.id,
        userType,
        title,
        message,
        type,
        new Date(),
        0,
      ]);

      // Use multi-row insert for better performance
      const placeholders = values
        .map(() => "(?, ?, ?, ?, ?, NOW(), 0)")
        .join(", ");
      const flatValues = values.flat();

      const query = `
        INSERT INTO notifications (
          user_id,
          user_type,
          title,
          message,
          type,
          created_at,
          is_read
        ) VALUES ${placeholders}
      `;

      const [result] = await db.execute(query, flatValues);

      return {
        success: true,
        message: `Notification sent to ${users.length} users`,
        affectedRows: result.affectedRows,
      };
    } catch (error) {
      console.error("Error sending notification to all users:", error);
      throw error;
    }
  }

  /**
   * Send a notification
   * @param {Object} data - Notification data
   * @returns {Promise<Object>} - Result
   */
  // static async sendNotification(data) {
  //   try {
  //     const {
  //       title,
  //       message,
  //       senderId,
  //       senderType,
  //       recipientType,
  //       recipientId = null,
  //       type = "info",
  //     } = data;

  //     // Validate required fields
  //     if (!title || !message || !recipientType) {
  //       return {
  //         success: false,
  //         message: "Missing required fields",
  //       };
  //     }

  //     // Handle different recipient types
  //     if (recipientType === "specific" && recipientId) {
  //       // Extract the type and id from the recipientId string (e.g., "staff-1")
  //       const [userType, userId] = recipientId.split("-");

  //       return await this.sendToSpecificUser({
  //         title,
  //         message,
  //         userId,
  //         userType,
  //         type,
  //       });
  //     } else if (recipientType === "allStaff") {
  //       return await this.sendToAllUsersOfType({
  //         title,
  //         message,
  //         userType: "staff",
  //         type,
  //       });
  //     } else if (recipientType === "allCustomers") {
  //       return await this.sendToAllUsersOfType({
  //         title,
  //         message,
  //         userType: "customer",
  //         type,
  //       });
  //     } else {
  //       return {
  //         success: false,
  //         message: "Invalid recipient type",
  //       };
  //     }
  //   } catch (error) {
  //     console.error("Error sending notification:", error);
  //     throw error;
  //   }
  // }
  static async sendNotification(data) {
    try {
      const {
        title,
        message,
        senderId,
        senderType,
        recipientType,
        recipientId = null,
      } = data;

      // Validate required fields
      if (!title || !message || !recipientType) {
        return {
          success: false,
          message: "Missing required fields",
        };
      }

      // Handle different recipient types
      if (recipientType === "specific" && recipientId) {
        // Extract the type and id from the recipientId string (e.g., "staff-1")
        const [userType, userId] = recipientId.split("-");

        return await this.sendToSpecificUser({
          title,
          message,
          userId,
          userType,
        });
      } else if (recipientType === "allStaff") {
        // Send to all staff members
        const staffQuery = "SELECT pharmacy_staff_id as id FROM pharmacy_staff";
        const [staffRows] = await db.execute(staffQuery);

        const results = [];
        for (const staff of staffRows) {
          const result = await this.sendToSpecificUser({
            title,
            message,
            userId: staff.id,
            userType: "staff",
          });
          results.push(result);
        }

        return {
          success: true,
          message: `Notification sent to ${staffRows.length} staff members`,
        };
      } else if (recipientType === "allCustomers") {
        // Send to all customers
        const customerQuery = "SELECT customer_id as id FROM customer";
        const [customerRows] = await db.execute(customerQuery);

        const results = [];
        for (const customer of customerRows) {
          const result = await this.sendToSpecificUser({
            title,
            message,
            userId: customer.id,
            userType: "customer",
          });
          results.push(result);
        }

        return {
          success: true,
          message: `Notification sent to ${customerRows.length} customers`,
        };
      } else {
        return {
          success: false,
          message: "Invalid recipient type",
        };
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }
}

module.exports = NotificationModel;
