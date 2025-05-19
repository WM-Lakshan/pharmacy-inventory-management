// // routes/order.routes.js
// const express = require("express");
// const router = express.Router();
// const orderController = require("../../Controllers/customer/orderHistory.controller");
// // const { authenticate } = require("../../auth/middleware/auth");

// // // Apply authentication middleware to all order routes
// // router.use(authenticate);
// // // router.use(authorize(["customer"]));
// // router.get("/", orderController.getUserOrders);

// // /**
// //  * @route GET /api/orders/search
// //  * @description Search orders by various parameters
// //  * @access Private - customer
// //  */
// // router.get("/search", orderController.searchOrders);

// // /**
// //  * @route GET /api/orders/status/:status
// //  * @description Get orders with specific status
// //  * @access Private - customer
// //  */
// // router.get("/status/:status", orderController.getOrdersByStatus);

// // /**
// //  * @route GET /api/orders/:id
// //  * @description Get a single order with detailed information including order items
// //  * @access Private - customer
// //  */
// // router.get("/:id", orderController.getOrderDetails);

// // /**
// //  * @route PUT /api/orders/:id/cancel
// //  * @description Cancel an order
// //  * @access Private - customer
// //  */
// // router.put("/:id/cancel", orderController.cancelOrder);

// // /**
// //  * @route POST /api/orders/:id/repeat
// //  * @description Repeat an order (create a new order with the same items)
// //  * @access Private - customer
// //  */
// // router.post("/:id/repeat", orderController.repeatOrder);

// // module.exports = router;

// const { authenticate, authorize } = require("../../auth/middleware/auth");

// // Apply authentication middleware to all order routes
// router.use(authenticate);

// // Customer-specific order routes
// router.use(authorize(["customer"]));

// /**
//  * @route GET /api/orders
//  * @description Get all orders for the logged in user with filtering options
//  * @access Private - customer
//  */
// router.get("/", orderController.getUserOrders);

// /**
//  * @route GET /api/orders/:id
//  * @description Get a single order with detailed information including order items
//  * @access Private - customer
//  */
// router.get("/:id", orderController.getOrderDetails);

// /**
//  * @route GET /api/orders/search
//  * @description Search orders by various parameters
//  * @access Private - customer
//  */
// router.get("/search", orderController.searchOrders);

// module.exports = router;

// routes/order.routes.js
const express = require("express");
const router = express.Router();
const customerOrderController = require("../../Controllers/customer/orderHistory.controller");
const { authenticate, authorize } = require("../../auth/middleware/auth");

router.use(authenticate);
router.use(authorize(["customer"]));

// Get all orders for the current customer
router.get("/orders", customerOrderController.getCustomerOrders);

// Get a specific order by ID (with authorization check)
router.get("/orders/:id", customerOrderController.getOrderById);

// Get products for a specific order
router.get("/orders/:id/products", customerOrderController.getOrderProducts);

module.exports = router;
