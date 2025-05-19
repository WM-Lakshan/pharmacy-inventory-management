// routes/notification.routes.js
const express = require('express');
const NotificationController = require('../Controllers/notificationController');
const { authenticate } = require('../auth/middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @route GET /api/notifications
 * @desc Get all notifications for a user with pagination and filtering
 * @access Private
 */
router.get('/', NotificationController.getNotifications);

/**
 * @route GET /api/notifications/recent
 * @desc Get recent notifications for a user
 * @access Private
 */
router.get('/recent', NotificationController.getRecentNotifications);

/**
 * @route GET /api/notifications/unread-count
 * @desc Get unread notification count for a user
 * @access Private
 */
router.get('/unread-count', NotificationController.getUnreadCount);

/**
 * @route POST /api/notifications/:id/read
 * @desc Mark a notification as read
 * @access Private
 */
router.post('/:id/read', NotificationController.markAsRead);

/**
 * @route POST /api/notifications/mark-selected-read
 * @desc Mark multiple notifications as read
 * @access Private
 */
router.post('/mark-selected-read', NotificationController.markSelectedAsRead);

/**
 * @route POST /api/notifications/mark-all-read
 * @desc Mark all notifications as read for a user
 * @access Private
 */
router.post('/mark-all-read', NotificationController.markAllAsRead);

/**
 * @route DELETE /api/notifications/:id
 * @desc Delete a notification
 * @access Private
 */
router.delete('/:id', NotificationController.deleteNotification);

/**
 * @route POST /api/notifications/delete-selected
 * @desc Delete multiple notifications
 * @access Private
 */
router.post('/delete-selected', NotificationController.deleteSelectedNotifications);

/**
 * @route GET /api/notifications/recipients
 * @desc Get potential recipients for notifications
 * @access Private
 */
router.get('/recipients', NotificationController.getRecipients);

/**
 * @route POST /api/notifications/send
 * @desc Send a notification
 * @access Private
 */
router.post('/send', NotificationController.sendNotification);

module.exports = router;