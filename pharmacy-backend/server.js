require("dotenv").config(); // Load environment variables from .env file
//console.log("JWT_SECRET:", process.env.JWT_SECRET); // Verify it's loading correctly
const express = require("express");
const cors = require("cors"); // Import the cors package
const { testConnection } = require("./db");
// const CustomerRoutes = require("./Routes/CustomerRoutes");
const NotificationRoutes = require("./Routes/notificationRoutes.js");
const ReportsRoute = require("./Routes/reportRoutes.js");
const CheckoutRoutes = require("./Routes/CheckoutRoutes.js");
const ForgotPassword = require("./Routes/ForgotPWRoute.js");
const Userprofile = require("./Routes/userRoutes");
const DashboardRoutes = require("./Routes/dashboardRoutes");
const CartRoutes = require("./Routes/customer/cart.routes.js");
const CustomersRoutes = require("./Routes/customer/customer.routes.js");
const SupplierRoutes = require("./Routes/SupplierRoutes");
const SalesRoutes = require("./Routes/SaleRoutes.js");
const CategoryRoutes = require("./Routes/CategoryRoutes");
const ProductRoutes = require("./Routes/ProductRoutes");
const StaffRoutes = require("./Routes/StaffRoutes");
const LandingRoutes = require("./Routes/customer/landing.routes");
const SearchRoutes = require("./Routes/customer/search.routes.js");
const ProductListRoutes = require("./Routes/customer/product.routes");
const productDetailRoutes = require("./Routes/customer/productDetail.routes");
const SupplierOrderRoutes = require("./Routes/supplierOrderRoutes");
const CustomerPrescriptionRoutes = require("./Routes/customer/prescription.routes");
const OrderHistoryRoutes = require("./Routes/customer/orderhistory.routes.js");
const bodyParser = require("body-parser");
const AuthRoutes = require("./auth/authRoutes");
const StaffPrescriptionRoutes = require("./Routes/staff/prescriptionRoutes.js");
// const StaffProductRoutes = require("./Routes/staff/productRoutes.js");
const StaffCategoryRoutes = require("./Routes/staff/categoryRoutes.js");
const StaffInventoryRoutes = require("./Routes/staff/inventoryRoutes.js");
const StaffSales = require("./Routes/staff/prescriptionProductRoutes.js");
const StaffOrderRoutes = require("./Routes/staff/orderRoutes.js");

//const PaymentRoutes = require("./Routes/payments.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors()); // Use the cors middleware

// Test the database connection before starting the server
testConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start the server:", error.message);
  });

app.use(express.json());
app.use("/users", Userprofile);
app.use("/checkout", CheckoutRoutes);
app.use("/auth/forgotpassword", ForgotPassword);
app.use("/notifications", NotificationRoutes);
app.use("/customers", CustomersRoutes);
app.use("/order-history", OrderHistoryRoutes);
app.use("/dashboard", DashboardRoutes);
app.use("/inventory", ProductRoutes);
app.use("/categories", CategoryRoutes);
app.use("/suppliers", SupplierRoutes);
app.use("/supplier-orders", SupplierOrderRoutes);
app.use("/reports", ReportsRoute);
app.use("/staff", StaffRoutes);
app.use("/auth", AuthRoutes);
app.use("/landing", LandingRoutes);
app.use("/cart", CartRoutes);
app.use("/productsDetails", productDetailRoutes);
app.use("/customer-search", SearchRoutes);
app.use("/products", ProductListRoutes);
app.use("/customer-prescriptions", CustomerPrescriptionRoutes);
app.use("/sales", SalesRoutes);
app.use("/staffprescription", StaffPrescriptionRoutes);
app.use("/staff-inventory", StaffInventoryRoutes);
// app.use("/staff-inventory", StaffProductRoutes);
app.use("/staff-categories", StaffCategoryRoutes);
app.use("/staff-sales", StaffSales);
app.use("/staff-orders", StaffOrderRoutes);
//app.use("/api/payments", PaymentRoutes);

app.get("/test", (req, res) => {
  res.json({ message: "API is working" });
});
// app.use("/customer", CustomersRoutes);
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
