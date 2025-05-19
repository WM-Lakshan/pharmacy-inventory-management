const express = require("express");
const router = express.Router();
const db = require("../config/database"); // Your database connection

// Get notifications for a specific user
router.get("/api/notifications", async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({ message: "User ID and type are required" });
    }

    // Query based on the schema in your database
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = ? AND user_type = ? 
      ORDER BY is_read ASC, notification_id DESC
      LIMIT 20
    `;

    const [notifications] = await db.query(query, [userId, userType]);

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark a notification as read
router.patch("/api/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_read } = req.body;

    const query =
      "UPDATE notifications SET is_read = ? WHERE notification_id = ?";
    await db.query(query, [is_read, id]);

    res.json({ message: "Notification updated successfully" });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark all notifications as read for a user
router.patch("/api/notifications/mark-all-read", async (req, res) => {
  try {
    const { userId, userType } = req.body;

    if (!userId || !userType) {
      return res.status(400).json({ message: "User ID and type are required" });
    }

    const query =
      "UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND user_type = ?";
    await db.query(query, [userId, userType]);

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new notification (for your backend services to use)
router.post("/api/notifications", async (req, res) => {
  try {
    const { user_id, user_type, title, message } = req.body;

    if (!user_id || !user_type || !title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      INSERT INTO notifications (user_id, user_type, title, message, is_read)
      VALUES (?, ?, ?, ?, FALSE)
    `;

    await db.query(query, [user_id, user_type, title, message]);

    res.status(201).json({ message: "Notification created successfully" });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

router.get("/api/notifications/unread-count", async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({ message: "User ID and type are required" });
    }

    const query = `
        SELECT COUNT(*) as count FROM notifications 
        WHERE user_id = ? AND user_type = ? AND is_read = FALSE
      `;

    const [result] = await db.query(query, [userId, userType]);

    res.json({ count: result[0].count });
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/api/notifications/all", async (req, res) => {
  try {
    const { userId, userType, page = 1, limit = 100 } = req.query;
    console.log("Received query for user:", req.query); // Debugging line
    if (!userId || !userType) {
      return res.status(400).json({ message: "User ID and type are required" });
    }

    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM notifications 
      WHERE user_id = ? AND user_type = ? 
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [notifications] = await db.query(query, [
      userId,
      userType,
      parseInt(limit),
      parseInt(offset),
    ]);

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching all notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark selected notifications as read
router.post("/api/notifications/mark-selected-read", async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (
      !notificationIds ||
      !Array.isArray(notificationIds) ||
      notificationIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Valid notification IDs are required" });
    }

    // Use placeholders for each ID in the array
    const placeholders = notificationIds.map(() => "?").join(",");
    const query = `UPDATE notifications SET is_read = TRUE WHERE notification_id IN (${placeholders})`;

    await db.query(query, notificationIds);

    res.json({ message: "Notifications marked as read successfully" });
  } catch (error) {
    console.error("Error marking selected notifications as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete selected notifications
router.post("/api/notifications/delete-selected", async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (
      !notificationIds ||
      !Array.isArray(notificationIds) ||
      notificationIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Valid notification IDs are required" });
    }

    // Use placeholders for each ID in the array
    const placeholders = notificationIds.map(() => "?").join(",");
    const query = `DELETE FROM notifications WHERE notification_id IN (${placeholders})`;

    await db.query(query, notificationIds);

    res.json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});
