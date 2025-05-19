// controllers/customer.controller.js
const CustomerModel = require("../../Models/customer/customer.model");
const path = require("path");
const multer = require("multer");

// Configure file upload storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/prescriptions/");
  },
  filename: function (req, file, cb) {
    cb(null, `prescription_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept images and PDFs only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
      return cb(new Error("Only image or PDF files are allowed!"), false);
    }
    cb(null, true);
  },
}).single("prescription");

class CustomerController {
  /**
   * Get all products with optional pagination and category filtering
   */
  static async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 12;
      const category = req.query.category;

      const result = await CustomerModel.getAllProducts(
        page,
        pageSize,
        category
      );

      // Transform products to match frontend expectations
      const transformedProducts = result.products.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: product.price,
        image: product.image || `/api/placeholder/240/240`, // Default placeholder if no image
        discount: 0, // Set actual discount if you have it in database
        requiresPrescription: product.type === "prescription needed",
        inStock: product.quantity > 0,
        category: product.category_name,
        description: product.status,
        stockCount: product.quantity,
      }));

      res.status(200).json({
        success: true,
        products: transformedProducts,
        total: result.total,
        page: result.page,
        pages: result.pages,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
      });
    }
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(req, res) {
    try {
      const products = await CustomerModel.getFeaturedProducts();

      // Transform products to match frontend expectations
      const transformedProducts = products.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: product.price,
        image: product.image || `/api/placeholder/240/240`,
        discount: 0, // Set actual discount if you have it in database
        requiresPrescription: product.type === "prescription needed",
        inStock: product.quantity > 0,
        category: product.category_name,
      }));

      res.status(200).json({
        success: true,
        products: transformedProducts,
      });
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch featured products",
      });
    }
  }

  /**
   * Get top selling products
   */
  static async getTopSellingProducts(req, res) {
    try {
      const products = await CustomerModel.getTopSellingProducts();

      // Transform products to match frontend expectations
      const transformedProducts = products.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: product.price,
        image: product.image || `/api/placeholder/240/240`,
        discount: 0, // Set actual discount if you have it in database
        requiresPrescription: product.type === "prescription needed",
        inStock: product.quantity > 0,
        category: product.category_name,
      }));

      res.status(200).json({
        success: true,
        products: transformedProducts,
      });
    } catch (error) {
      console.error("Error fetching top selling products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch top selling products",
      });
    }
  }

  /**
   * Search products
   */
  static async searchProducts(req, res) {
    try {
      const { query, category } = req.query;
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 12;

      const result = await CustomerModel.searchProducts(
        query,
        category,
        page,
        pageSize
      );

      // Transform products to match frontend expectations
      const transformedProducts = result.products.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: product.price,
        image: product.image || `/api/placeholder/240/240`,
        discount: 0, // Set actual discount if you have it in database
        requiresPrescription: product.type === "prescription needed",
        inStock: product.quantity > 0,
        category: product.category_name,
      }));

      res.status(200).json({
        success: true,
        products: transformedProducts,
        total: result.total,
        page: result.page,
        pages: result.pages,
      });
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search products",
      });
    }
  }

  /**
   * Get a single product by ID with details
   */
  static async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await CustomerModel.getProductById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Transform product to match frontend expectations
      const transformedProduct = {
        id: product.product_id,
        name: product.pname,
        price: product.price,
        originalPrice: product.price, // Assuming no discount if not stored
        discount: 0, // Add actual discount if available
        image: product.image || `/api/placeholder/400/320`,
        description: product.status || "No description available",
        availabilityStatus: product.quantity > 0 ? "In Stock" : "Out of Stock",
        rating: 4.5, // Placeholder - implement actual ratings if available
        reviews: 10, // Placeholder - implement actual review count
        requiresPrescription: product.type === "prescription needed",
        usage: "Take as directed by your physician.", // Add actual usage info if available
        sideEffects: "Consult your doctor for potential side effects.", // Add actual info if available
        composition: "Active ingredients information.", // Add actual info if available
        manufacturer: "Pharmaceutical company", // Add actual info if available
        expiryDate: "2025-12-31", // Add actual expiry if available
        category: product.category_name,
        stockCount: product.quantity,
      };

      res.status(200).json(transformedProduct);
    } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch product details",
      });
    }
  }

  /**
   * Get related products
   */
  static async getRelatedProducts(req, res) {
    try {
      const productId = req.params.id;
      const products = await CustomerModel.getRelatedProducts(productId);

      // Transform products to match frontend expectations
      const transformedProducts = products.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: product.price,
        image: product.image || `/api/placeholder/240/240`,
        discount: 0, // Set actual discount if you have it in database
        requiresPrescription: product.type === "prescription needed",
        inStock: product.quantity > 0,
        category: product.category_name,
      }));

      res.status(200).json({
        success: true,
        products: transformedProducts,
      });
    } catch (error) {
      console.error("Error fetching related products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch related products",
      });
    }
  }

  /**
   * Get all categories
   */
  static async getAllCategories(req, res) {
    try {
      const categories = await CustomerModel.getAllCategories();

      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch categories",
      });
    }
  }

  /**
   * Get cart items for the logged-in customer
   */
  static async getCartItems(req, res) {
    try {
      const customerId = req.user.id;
      const cartItems = await CustomerModel.getCartItems(customerId);

      // Transform cart items to match frontend expectations
      const transformedItems = cartItems.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || `/api/placeholder/80/80`,
        requiresPrescription:
          item.requiresPrescription === "prescription needed",
        stockCount: item.stockCount,
      }));

      res.status(200).json({
        success: true,
        items: transformedItems,
      });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch cart items",
      });
    }
  }

  /**
   * Add a product to the customer's cart
   */
  static async addToCart(req, res) {
    try {
      const customerId = req.user.id;
      const { productId, quantity } = req.body;

      // Validate quantity
      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity",
        });
      }

      // Check if product exists and is in stock
      const productCheck = await CustomerModel.checkProductStock(
        productId,
        quantity
      );

      if (!productCheck.exists) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Check if prescription is required
      if (productCheck.requiresPrescription) {
        return res.status(400).json({
          success: false,
          message: "This product requires a prescription",
        });
      }

      // Check if there's enough stock
      if (!productCheck.inStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${productCheck.product.quantity} items available in stock`,
        });
      }

      await CustomerModel.addToCart(customerId, productId, quantity);

      res.status(200).json({
        success: true,
        message: "Product added to cart successfully",
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add product to cart",
      });
    }
  }

  /**
   * Update quantity of a cart item
   */
  static async updateCartItemQuantity(req, res) {
    try {
      const customerId = req.user.id;
      const { cartItemId, quantity } = req.body;

      // Validate quantity
      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity",
        });
      }

      const result = await CustomerModel.updateCartItemQuantity(
        customerId,
        cartItemId,
        quantity
      );

      if (!result.found) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      if (!result.sufficientStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${result.stockQuantity} items available in stock`,
        });
      }

      res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully",
      });
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update cart item quantity",
      });
    }
  }

  /**
   * Remove a product from the cart
   */
  static async removeCartItem(req, res) {
    try {
      const customerId = req.user.id;
      const cartItemId = req.params.id;

      const result = await CustomerModel.removeCartItem(customerId, cartItemId);

      if (!result.found) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
      });
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({
        success: false,
        message: "Failed to remove item from cart",
      });
    }
  }

  /**
   * Get order summary for checkout
   */
  static async getOrderSummary(req, res) {
    try {
      const customerId = req.user.id;

      const orderSummary = await CustomerModel.getOrderSummary(customerId);

      if (!orderSummary) {
        return res.status(400).json({
          success: false,
          message: "Your cart is empty",
        });
      }

      res.status(200).json(orderSummary);
    } catch (error) {
      console.error("Error generating order summary:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate order summary",
      });
    }
  }

  /**
   * Process checkout
   */
  static async checkout(req, res) {
    try {
      const customerId = req.user.id;
      const { deliveryMethod, address, paymentMethod } = req.body;

      // Validate required fields
      if (!deliveryMethod || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: "Delivery method and payment method are required",
        });
      }

      // If delivery method is home delivery, address is required
      if (deliveryMethod === "Home Delivery" && !address) {
        return res.status(400).json({
          success: false,
          message: "Delivery address is required for home delivery",
        });
      }

      const result = await CustomerModel.createOrder(customerId, {
        deliveryMethod,
        address,
        paymentMethod,
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        orderId: result.orderId,
      });
    } catch (error) {
      console.error("Error processing checkout:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process checkout",
      });
    }
  }

  /**
   * Process payment
   */
  static async processPayment(req, res) {
    try {
      const customerId = req.user.id;
      const { paymentMethod, orderId } = req.body;

      // Validate payment method
      if (!paymentMethod) {
        return res.status(400).json({
          success: false,
          message: "Payment method is required",
        });
      }

      const result = await CustomerModel.updateOrderAfterPayment(
        customerId,
        orderId
      );

      res.status(200).json({
        success: true,
        message: result.message,
        transactionId: result.transactionId,
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process payment",
      });
    }
  }

  /**
   * Get orders for the logged-in customer
   */
  static async getOrders(req, res) {
    try {
      const customerId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const filters = {
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };

      const result = await CustomerModel.getOrders(
        customerId,
        page,
        pageSize,
        filters
      );

      // Format date
      const formattedOrders = result.orders.map((order) => ({
        ...order,
        date: new Date(order.date).toISOString().split("T")[0],
      }));

      res.status(200).json({
        success: true,
        orders: formattedOrders,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        pages: result.pages,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
      });
    }
  }

  /**
   * Get recent orders for the logged-in customer
   */
  static async getRecentOrders(req, res) {
    try {
      const customerId = req.user.id;

      const orders = await CustomerModel.getRecentOrders(customerId);

      // Format date and add more details
      const formattedOrders = orders.map((order) => ({
        id: order.id,
        date: new Date(order.date).toISOString().split("T")[0],
        status: order.status,
        total: order.total,
        items: order.items,
      }));

      res.status(200).json({
        success: true,
        orders: formattedOrders,
      });
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch recent orders",
      });
    }
  }

  /**
   * Get order details by ID
   */
  static async getOrderById(req, res) {
    try {
      const customerId = req.user.id;
      const orderId = req.params.id;

      const order = await CustomerModel.getOrderById(customerId, orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Format date
      order.date = new Date(order.date).toISOString().split("T")[0];

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch order details",
      });
    }
  }

  /**
   * Upload prescription
   */
  static async uploadPrescription(req, res) {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      try {
        const customerId = req.user.id;
        const { fullName, telephone, deliveryMethod, deliveryAddress, note } =
          req.body;

        // Validate required fields
        if (!fullName || !telephone) {
          return res.status(400).json({
            success: false,
            message: "Name and telephone are required",
          });
        }

        if (deliveryMethod === "Home Delivery" && !deliveryAddress) {
          return res.status(400).json({
            success: false,
            message: "Delivery address is required for home delivery",
          });
        }

        // Get file path if a file was uploaded
        const prescriptionFile = req.file ? req.file.path : null;

        const result = await CustomerModel.uploadPrescription(customerId, {
          fullName,
          telephone,
          deliveryMethod,
          deliveryAddress,
          note,
          prescriptionFile,
        });

        res.status(200).json({
          success: true,
          message: result.message,
          prescriptionId: result.prescriptionId,
        });
      } catch (error) {
        console.error("Error uploading prescription:", error);
        res.status(500).json({
          success: false,
          message: "Failed to upload prescription",
        });
      }
    });
  }

  /**
   * Get prescriptions
   */
  static async getPrescriptions(req, res) {
    try {
      const customerId = req.user.id;

      const prescriptions = await CustomerModel.getPrescriptions(customerId);

      // Format date
      const formattedPrescriptions = prescriptions.map((prescription) => ({
        ...prescription,
        date: new Date(prescription.date).toISOString().split("T")[0],
      }));

      res.status(200).json({
        success: true,
        prescriptions: formattedPrescriptions,
      });
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch prescriptions",
      });
    }
  }

  /**
   * Get prescription by ID
   */
  static async getPrescriptionById(req, res) {
    try {
      const customerId = req.user.id;
      const prescriptionId = req.params.id;

      const prescription = await CustomerModel.getPrescriptionById(
        customerId,
        prescriptionId
      );

      if (!prescription) {
        return res.status(404).json({
          success: false,
          message: "Prescription not found",
        });
      }

      // Format date
      prescription.date = new Date(prescription.date)
        .toISOString()
        .split("T")[0];

      res.status(200).json({
        success: true,
        prescription,
      });
    } catch (error) {
      console.error("Error fetching prescription details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch prescription details",
      });
    }
  }

  /**
   * Get customer profile
   */
  static async getProfile(req, res) {
    try {
      const customerId = req.user.id;

      const customer = await CustomerModel.getProfile(customerId);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      // Parse name into first and last name
      const nameParts = customer.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      res.status(200).json({
        success: true,
        user: {
          ...customer,
          firstName,
          lastName,
        },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch profile",
      });
    }
  }

  /**
   * Update customer profile
   */
  static async updateProfile(req, res) {
    try {
      const customerId = req.user.id;
      const { firstName, lastName, phone } = req.body;

      // Validate required fields
      if (!firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: "First name and last name are required",
        });
      }

      const result = await CustomerModel.updateProfile(customerId, {
        firstName,
        lastName,
        phone,
      });

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  }

  /**
   * Change customer password
   */
  static async changePassword(req, res) {
    try {
      const customerId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      // Validate password strength
      if (
        newPassword.length < 8 ||
        !/[A-Z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be 8+ characters with at least one uppercase letter and number",
        });
      }

      const result = await CustomerModel.changePassword(
        customerId,
        currentPassword,
        newPassword
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({
        success: false,
        message: "Failed to change password",
      });
    }
  }

  /**
   * Upload avatar
   */
  static async uploadAvatar(req, res) {
    const avatarUpload = multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "public/uploads/avatars/");
        },
        filename: function (req, file, cb) {
          const customerId = req.user.id;
          cb(null, `customer_${customerId}${path.extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
      fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
      },
    }).single("avatar");

    avatarUpload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      try {
        const customerId = req.user.id;

        // Get file path
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "No file uploaded",
          });
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        const result = await CustomerModel.updateAvatar(customerId, avatarUrl);

        res.status(200).json({
          success: true,
          message: result.message,
          avatarUrl: result.avatarUrl,
        });
      } catch (error) {
        console.error("Error uploading avatar:", error);
        res.status(500).json({
          success: false,
          message: "Failed to upload avatar",
        });
      }
    });
  }

  /**
   * Get customer addresses
   */
  static async getAddresses(req, res) {
    try {
      const customerId = req.user.id;

      const addresses = await CustomerModel.getAddresses(customerId);

      res.status(200).json({
        success: true,
        addresses,
      });
    } catch (error) {
      console.error("Error fetching addresses:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch addresses",
      });
    }
  }

  /**
   * Add a new address (mock implementation)
   */
  static async addAddress(req, res) {
    try {
      const customerId = req.user.id;
      const { type, address, isDefault, phone } = req.body;

      // Validate required fields
      if (!type || !address) {
        return res.status(400).json({
          success: false,
          message: "Address type and details are required",
        });
      }

      // For a real app, you'd insert into an address table
      // Here we'll just return success

      res.status(200).json({
        success: true,
        message: "Address added successfully",
        address: {
          id: Math.floor(100 + Math.random() * 900), // Mock ID
          type,
          address,
          isDefault: isDefault || false,
          phone: phone || null,
        },
      });
    } catch (error) {
      console.error("Error adding address:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add address",
      });
    }
  }
}

module.exports = CustomerController;
