// // controllers/checkout.controller.js
// const { db } = require("../db");
// const CheckoutModel = require("../Models/CheckoutModel");

// class CheckoutController {
//   /**
//    * Process checkout from cart
//    */
//   static async processCartCheckout(req, res) {
//     const connection = await db.getConnection();
//     await connection.beginTransaction();

//     try {
//       // Get user ID from auth middleware
//       const customerId = req.user.id;

//       // Extract data from request body
//       const {
//         deliveryMethod,
//         paymentMethod,
//         address,
//         fullName,
//         phone,
//         email,
//         subtotal,
//         shippingFee,
//         total,
//       } = req.body;

//       // Validate input
//       if (!deliveryMethod || !paymentMethod || !fullName || !phone) {
//         await connection.rollback();
//         return res.status(400).json({
//           success: false,
//           message: "Missing required checkout information",
//         });
//       }

//       // Get cart items
//       const [cartItems] = await connection.execute(
//         `SELECT c.cart_id, c.product_id, p.pname, p.price, c.quantity, p.quantity as stock_quantity, p.type as product_type
//          FROM cart c
//          JOIN product p ON c.product_id = p.product_id
//          WHERE c.customer_id = ?`,
//         [customerId]
//       );

//       if (cartItems.length === 0) {
//         await connection.rollback();
//         return res.status(400).json({
//           success: false,
//           message: "Your cart is empty",
//         });
//       }

//       // Validate stock
//       for (const item of cartItems) {
//         if (item.quantity > item.stock_quantity) {
//           await connection.rollback();
//           return res.status(400).json({
//             success: false,
//             message: `Not enough stock for ${item.pname}. Only ${item.stock_quantity} available.`,
//           });
//         }
//       }

//       // Log address before creating order
//       console.log("Address received in processCartCheckout:", address);
//       console.log("Delivery method:", deliveryMethod);

//       // Ensure we always pass a string value for address
//       const addressToSave = address || "";

//       // Create order with the processed address
//       const inventoryReduced = paymentMethod === "creditCard";
//       const orderId = await CheckoutModel.createOrderFromCart(connection, {
//         customerId,
//         deliveryMethod,
//         address: addressToSave, // Always pass a string value, empty if null
//         telephone: String(phone), // Convert to string to avoid integer overflow
//         total,
//         inventoryReduced,
//       });

//       // Create payment record
//       const paymentId = await CheckoutModel.createPayment(connection, {
//         orderId,
//         customerId,
//         paymentMethod,
//         amount: total,
//         status: paymentMethod === "creditCard" ? "completed" : "pending",
//       });

//       // Create notification for customer
//       await CheckoutModel.createNotification(connection, {
//         userId: customerId,
//         userType: "customer",
//         title: "Order Placed Successfully",
//         message: `Your order #${orderId} has been placed. ${
//           paymentMethod === "creditCard"
//             ? "Payment processed successfully."
//             : "You will pay at pickup."
//         }`,
//         link: `/orders/${orderId}`,
//       });

//       // Create notification for staff
//       await CheckoutModel.createNotification(connection, {
//         userId: 1, // Default staff ID
//         userType: "staff",
//         title: "New Order Received",
//         message: `New order #${orderId} has been placed by customer.`,
//         link: `/staff/orders/${orderId}`,
//       });

//       await connection.commit();

//       res.status(200).json({
//         success: true,
//         message: "Order placed successfully",
//         orderId,
//         paymentId,
//       });
//     } catch (error) {
//       await connection.rollback();
//       console.error("Checkout error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to process your order. Please try again.",
//       });
//     } finally {
//       connection.release();
//     }
//   }

//   /**
//    * Process checkout from prescription
//    */
//   static async processPrescriptionCheckout(req, res) {
//     const connection = await db.getConnection();
//     await connection.beginTransaction();

//     try {
//       // Get user ID from auth middleware
//       const customerId = req.user.id;

//       // Extract data from request body
//       const {
//         prescriptionId,
//         deliveryMethod,
//         paymentMethod,
//         address,
//         fullName,
//         phone,
//         email,
//         subtotal,
//         shippingFee,
//         total,
//       } = req.body;

//       // Validate input
//       if (
//         !prescriptionId ||
//         !deliveryMethod ||
//         !paymentMethod ||
//         !fullName ||
//         !phone
//       ) {
//         await connection.rollback();
//         return res.status(400).json({
//           success: false,
//           message: "Missing required checkout information",
//         });
//       }

//       // Verify prescription exists and belongs to customer
//       const [prescriptions] = await connection.execute(
//         `SELECT prescription_id, status FROM prescription 
//          WHERE prescription_id = ? AND customer_id = ?`,
//         [prescriptionId, customerId]
//       );

//       if (prescriptions.length === 0) {
//         await connection.rollback();
//         return res.status(404).json({
//           success: false,
//           message: "Prescription not found",
//         });
//       }

//       const prescription = prescriptions[0];

//       // Check prescription status
//       if (prescription.status !== "Available") {
//         await connection.rollback();
//         return res.status(400).json({
//           success: false,
//           message: `Cannot checkout prescription with status: ${prescription.status}`,
//         });
//       }

//       // Log address before creating order
//       console.log("Address received in processPrescriptionCheckout:", address);
//       console.log("Delivery method:", deliveryMethod);

//       // Ensure we always pass a string value for address
//       const addressToSave = address || "";

//       // Create order with the processed address
//       const inventoryReduced = paymentMethod === "creditCard";
//       const orderId = await CheckoutModel.createOrderFromPrescription(
//         connection,
//         {
//           customerId,
//           prescriptionId,
//           deliveryMethod,
//           address: addressToSave, // Always pass a string value, empty if null
//           telephone: String(phone), // Convert to string to avoid integer overflow
//           total,
//           inventoryReduced,
//         }
//       );

//       // Create payment record
//       const paymentId = await CheckoutModel.createPayment(connection, {
//         orderId,
//         customerId,
//         paymentMethod,
//         amount: total,
//         status: paymentMethod === "creditCard" ? "completed" : "pending",
//       });

//       // Create notification for customer
//       await CheckoutModel.createNotification(connection, {
//         userId: customerId,
//         userType: "customer",
//         title: "Prescription Order Placed",
//         message: `Your prescription order #${orderId} has been placed. ${
//           paymentMethod === "creditCard"
//             ? "Payment processed successfully."
//             : "You will pay at pickup."
//         }`,
//         link: `/orders/${orderId}`,
//       });

//       // Create notification for staff
//       await CheckoutModel.createNotification(connection, {
//         userId: 1, // Default staff ID
//         userType: "staff",
//         title: "New Prescription Order",
//         message: `New prescription order #${orderId} has been placed.`,
//         link: `/staff/orders/${orderId}`,
//       });

//       await connection.commit();

//       res.status(200).json({
//         success: true,
//         message: "Prescription order placed successfully",
//         orderId,
//         paymentId,
//       });
//     } catch (error) {
//       await connection.rollback();
//       console.error("Prescription checkout error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to process your prescription order. Please try again.",
//       });
//     } finally {
//       connection.release();
//     }
//   }

//   /**
//    * Process checkout for a single product
//    */
//   static async processProductCheckout(req, res) {
//     const connection = await db.getConnection();
//     await connection.beginTransaction();

//     try {
//       // Get user ID from auth middleware
//       const customerId = req.user.id;

//       // Extract data from request body
//       const {
//         productId,
//         quantity,
//         deliveryMethod,
//         paymentMethod,
//         address,
//         fullName,
//         phone,
//         email,
//         subtotal,
//         shippingFee,
//         total,
//       } = req.body;

//       // Validate input
//       if (
//         !productId ||
//         !quantity ||
//         !deliveryMethod ||
//         !paymentMethod ||
//         !fullName ||
//         !phone
//       ) {
//         await connection.rollback();
//         return res.status(400).json({
//           success: false,
//           message: "Missing required checkout information",
//         });
//       }

//       // Validate product exists and has sufficient stock
//       const [products] = await connection.execute(
//         `SELECT product_id, pname, price, quantity as stock_quantity, type as product_type
//          FROM product
//          WHERE product_id = ?`,
//         [productId]
//       );

//       if (products.length === 0) {
//         await connection.rollback();
//         return res.status(404).json({
//           success: false,
//           message: "Product not found",
//         });
//       }

//       const product = products[0];

//       // Check if prescription is required
//       if (product.product_type === "prescription needed") {
//         await connection.rollback();
//         return res.status(400).json({
//           success: false,
//           message:
//             "This product requires a prescription. Please upload a prescription.",
//         });
//       }

//       // Check stock
//       if (quantity > product.stock_quantity) {
//         await connection.rollback();
//         return res.status(400).json({
//           success: false,
//           message: `Not enough stock. Only ${product.stock_quantity} available.`,
//         });
//       }

//       // Log address before creating order
//       console.log("Address received in processProductCheckout:", address);
//       console.log("Delivery method:", deliveryMethod);

//       // Ensure we always pass a string value for address
//       const addressToSave = address || "";

//       // Create order with the processed address
//       const inventoryReduced = paymentMethod === "creditCard";
//       const orderId = await CheckoutModel.createOrderFromProduct(connection, {
//         customerId,
//         productId,
//         quantity,
//         price: product.price,
//         deliveryMethod,
//         address: addressToSave, // Always pass a string value, empty if null
//         telephone: String(phone), // Convert to string to avoid integer overflow
//         total,
//         inventoryReduced,
//       });

//       // Create payment record
//       const paymentId = await CheckoutModel.createPayment(connection, {
//         orderId,
//         customerId,
//         paymentMethod,
//         amount: total,
//         status: paymentMethod === "creditCard" ? "completed" : "pending",
//       });

//       // Create notification for customer
//       await CheckoutModel.createNotification(connection, {
//         userId: customerId,
//         userType: "customer",
//         title: "Order Placed Successfully",
//         message: `Your order for ${product.pname} has been placed. ${
//           paymentMethod === "creditCard"
//             ? "Payment processed successfully."
//             : "You will pay at pickup."
//         }`,
//         link: `/orders/${orderId}`,
//       });

//       // Create notification for staff
//       await CheckoutModel.createNotification(connection, {
//         userId: 1, // Default staff ID
//         userType: "staff",
//         title: "New Product Order",
//         message: `New order for ${product.pname} has been placed.`,
//         link: `/staff/orders/${orderId}`,
//       });

//       await connection.commit();

//       res.status(200).json({
//         success: true,
//         message: "Order placed successfully",
//         orderId,
//         paymentId,
//       });
//     } catch (error) {
//       await connection.rollback();
//       console.error("Product checkout error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to process your order. Please try again.",
//       });
//     } finally {
//       connection.release();
//     }
//   }

//   /**
//    * Calculate shipping fee
//    */
//   static getShippingFee(deliveryMethod) {
//     return deliveryMethod === "Home Delivery" ? 300 : 0;
//   }
// }

// module.exports = CheckoutController;


// controllers/checkout.controller.js
const { db } = require("../db");
const CheckoutModel = require("../Models/CheckoutModel");

class CheckoutController {
  /**
   * Process checkout from cart
   */
  static async processCartCheckout(req, res) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Get user ID from auth middleware
      const customerId = req.user.id;

      // Extract data from request body
      const {
        deliveryMethod,
        paymentMethod,
        address,
        fullName,
        phone,
        email,
        subtotal,
        shippingFee,
        total,
      } = req.body;

      // Validate input
      if (!deliveryMethod || !paymentMethod || !fullName || !phone) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Missing required checkout information",
        });
      }

      // Determine if inventory should be reduced based on payment method
      // Only reduce inventory immediately if paying by card
      const inventoryReduced = paymentMethod === "PayHere";

      // Log address before creating order
      console.log("Address received in processCartCheckout:", address);
      console.log("Delivery method:", deliveryMethod);
      console.log("Payment method:", paymentMethod);
      console.log("Will reduce inventory immediately:", inventoryReduced);

      // Ensure we always pass a string value for address
      const addressToSave = address || "";

      // Create order with the processed address
      const orderResult = await CheckoutModel.createOrderFromCart(connection, {
        customerId,
        deliveryMethod,
        address: addressToSave, // Always pass a string value, empty if null
        telephone: String(phone), // Convert to string to avoid integer overflow
        total,
        inventoryReduced,
      });

      // Check if order creation was successful
      if (!orderResult.success) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: orderResult.message,
          unavailableItems: orderResult.unavailableItems
        });
      }

      const orderId = orderResult.orderId;

      // Create payment record with appropriate status
      // For card payments, mark as completed; for cash payments, mark as pending
      const paymentStatus = paymentMethod === "PayHere" ? "completed" : "pending";
      
      const paymentId = await CheckoutModel.createPayment(connection, {
        orderId,
        customerId,
        paymentMethod,
        amount: total,
        status: paymentStatus
      });

      // Create notification for customer
      await CheckoutModel.createNotification(connection, {
        userId: customerId,
        userType: "customer",
        title: "Order Placed Successfully",
        message: `Your order #${orderId} has been placed. ${
          paymentMethod === "PayHere"
            ? "Payment processed successfully."
            : paymentMethod === "CashOnDelivery" 
              ? "You will pay upon delivery." 
              : "You will pay at pickup."
        }`,
        link: `/orders/${orderId}`,
      });

      // Create notification for staff
      await CheckoutModel.createNotification(connection, {
        userId: 1, // Default staff ID
        userType: "staff",
        title: "New Order Received",
        message: `New order #${orderId} has been placed by customer.`,
        link: `/staff/orders/${orderId}`,
      });

      await connection.commit();

      res.status(200).json({
        success: true,
        message: "Order placed successfully",
        orderId,
        paymentId,
      });
    } catch (error) {
      await connection.rollback();
      console.error("Checkout error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process your order. Please try again.",
      });
    } finally {
      connection.release();
    }
  }

  /**
   * Process checkout from prescription
   */
  static async processPrescriptionCheckout(req, res) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Get user ID from auth middleware
      const customerId = req.user.id;

      // Extract data from request body
      const {
        prescriptionId,
        deliveryMethod,
        paymentMethod,
        address,
        fullName,
        phone,
        email,
        subtotal,
        shippingFee,
        total,
      } = req.body;

      // Validate input
      if (
        !prescriptionId ||
        !deliveryMethod ||
        !paymentMethod ||
        !fullName ||
        !phone
      ) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Missing required checkout information",
        });
      }

      // Verify prescription exists and belongs to customer
      const [prescriptions] = await connection.execute(
        `SELECT prescription_id, status FROM prescription 
         WHERE prescription_id = ? AND customer_id = ?`,
        [prescriptionId, customerId]
      );

      if (prescriptions.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: "Prescription not found",
        });
      }

      const prescription = prescriptions[0];

      // Check prescription status
      if (prescription.status !== "Available") {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Cannot checkout prescription with status: ${prescription.status}`,
        });
      }

      // Determine if inventory should be reduced based on payment method
      // Only reduce inventory immediately if paying by card
      const inventoryReduced = paymentMethod === "PayHere";

      // Log address before creating order
      console.log("Address received in processPrescriptionCheckout:", address);
      console.log("Delivery method:", deliveryMethod);
      console.log("Payment method:", paymentMethod);
      console.log("Will reduce inventory immediately:", inventoryReduced);

      // Ensure we always pass a string value for address
      const addressToSave = address || "";

      // Create order with the processed address
      const orderResult = await CheckoutModel.createOrderFromPrescription(
        connection,
        {
          customerId,
          prescriptionId,
          deliveryMethod,
          address: addressToSave, // Always pass a string value, empty if null
          telephone: String(phone), // Convert to string to avoid integer overflow
          total,
          inventoryReduced,
        }
      );

      // Check if order creation was successful
      if (!orderResult.success) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: orderResult.message,
          unavailableItems: orderResult.unavailableItems
        });
      }

      const orderId = orderResult.orderId;

      // Create payment record with appropriate status
      // For card payments, mark as completed; for cash payments, mark as pending
      const paymentStatus = paymentMethod === "PayHere" ? "completed" : "pending";
      
      const paymentId = await CheckoutModel.createPayment(connection, {
        orderId,
        customerId,
        paymentMethod,
        amount: total,
        status: paymentStatus
      });

      // Create notification for customer
      await CheckoutModel.createNotification(connection, {
        userId: customerId,
        userType: "customer",
        title: "Prescription Order Placed",
        message: `Your prescription order #${orderId} has been placed. ${
          paymentMethod === "PayHere"
            ? "Payment processed successfully."
            : paymentMethod === "CashOnDelivery" 
              ? "You will pay upon delivery." 
              : "You will pay at pickup."
        }`,
        link: `/orders/${orderId}`,
      });

      // Create notification for staff
      await CheckoutModel.createNotification(connection, {
        userId: 1, // Default staff ID
        userType: "staff",
        title: "New Prescription Order",
        message: `New prescription order #${orderId} has been placed.`,
        link: `/staff/orders/${orderId}`,
      });

      await connection.commit();

      res.status(200).json({
        success: true,
        message: "Prescription order placed successfully",
        orderId,
        paymentId,
      });
    } catch (error) {
      await connection.rollback();
      console.error("Prescription checkout error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process your prescription order. Please try again.",
      });
    } finally {
      connection.release();
    }
  }

  /**
   * Process checkout for a single product
   */
  static async processProductCheckout(req, res) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Get user ID from auth middleware
      const customerId = req.user.id;

      // Extract data from request body
      const {
        productId,
        quantity,
        deliveryMethod,
        paymentMethod,
        address,
        fullName,
        phone,
        email,
        subtotal,
        shippingFee,
        total,
      } = req.body;

      // Validate input
      if (
        !productId ||
        !quantity ||
        !deliveryMethod ||
        !paymentMethod ||
        !fullName ||
        !phone
      ) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Missing required checkout information",
        });
      }

      // Determine if inventory should be reduced based on payment method
      // Only reduce inventory immediately if paying by card
      const inventoryReduced = paymentMethod === "PayHere";

      // Validate product exists and has sufficient stock
      const [products] = await connection.execute(
        `SELECT product_id, pname, price, quantity as stock_quantity, type as product_type
         FROM product
         WHERE product_id = ?`,
        [productId]
      );

      if (products.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const product = products[0];

      // Check if prescription is required
      if (product.product_type === "prescription needed") {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message:
            "This product requires a prescription. Please upload a prescription.",
        });
      }

      // Log address before creating order
      console.log("Address received in processProductCheckout:", address);
      console.log("Delivery method:", deliveryMethod);
      console.log("Payment method:", paymentMethod);
      console.log("Will reduce inventory immediately:", inventoryReduced);

      // Ensure we always pass a string value for address
      const addressToSave = address || "";

      // Create order with the processed address
      const orderResult = await CheckoutModel.createOrderFromProduct(connection, {
        customerId,
        productId,
        quantity,
        price: product.price,
        deliveryMethod,
        address: addressToSave, // Always pass a string value, empty if null
        telephone: String(phone), // Convert to string to avoid integer overflow
        total,
        inventoryReduced,
      });

      // Check if order creation was successful
      if (!orderResult.success) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: orderResult.message,
          unavailableItems: orderResult.unavailableItems
        });
      }

      const orderId = orderResult.orderId;

      // Create payment record with appropriate status
      // For card payments, mark as completed; for cash payments, mark as pending
      const paymentStatus = paymentMethod === "PayHere" ? "completed" : "pending";
      
      const paymentId = await CheckoutModel.createPayment(connection, {
        orderId,
        customerId,
        paymentMethod,
        amount: total,
        status: paymentStatus
      });

      // Create notification for customer
      await CheckoutModel.createNotification(connection, {
        userId: customerId,
        userType: "customer",
        title: "Order Placed Successfully",
        message: `Your order for ${product.pname} has been placed. ${
          paymentMethod === "PayHere"
            ? "Payment processed successfully."
            : paymentMethod === "CashOnDelivery" 
              ? "You will pay upon delivery." 
              : "You will pay at pickup."
        }`,
        link: `/orders/${orderId}`,
      });

      // Create notification for staff
      await CheckoutModel.createNotification(connection, {
        userId: 1, // Default staff ID
        userType: "staff",
        title: "New Product Order",
        message: `New order for ${product.pname} has been placed.`,
        link: `/staff/orders/${orderId}`,
      });

      await connection.commit();

      res.status(200).json({
        success: true,
        message: "Order placed successfully",
        orderId,
        paymentId,
      });
    } catch (error) {
      await connection.rollback();
      console.error("Product checkout error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process your order. Please try again.",
      });
    } finally {
      connection.release();
    }
  }

  /**
   * Calculate shipping fee
   */
  static getShippingFee(deliveryMethod) {
    return deliveryMethod === "Deliver" ? 300 : 0;
  }
}

module.exports = CheckoutController;