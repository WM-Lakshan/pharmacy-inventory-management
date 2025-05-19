// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   Outlet,
// } from "react-router-dom";
// import Login from "./pages/login";
// import Signup from "./pages/signup";
// import Navbar from "./components/NavigationPanel";
// import Dashboard from "./pages/dashbord";
// import Sales from "./pages/sales";
// import Staff from "./pages/staff";
// import Inventory from "./pages/inventory";
// import ProfileV from "./pages/profieView";
// import Suppliers from "./pages/suppliers";
// import Reports from "./pages/report";
// import ProductDetails from "./pages/productDetails";
// import ProductListTable from "./components/ProductListTable";
// import InventoryOverview from "./components/InventoryOverview";
// import CusFooter from "./components/CusFooter";
// import PharmacyDashboard from "./pages/PharmacyDashboard";
// import Layout from "./pages/layout";
// import OrdersPage from "./pages/ordersPage";
// import NotificationSystem from "./components/notificationSystem";
// import NotificationContext from "./components/notificationSystem";
// import HeaderM from "./components/HeaderM";
// import NotificationHistory from "./pages/NotificationHistory";
// import SupplierDetails from "./components/SupplierDetails";
// import SupplierForm from "./components/SupplierForm";

// //customer details
// import CustomerHeader from "./components/customer/Header";
// import CustomerFooter from "./components/customer/Footer";
// import HomePage from "./pages/customer/HomePage";
// import ProductDetail from "./pages/customer/ProductDetail";
// import ShoppingCart from "./pages/customer/ShoppingCart";
// import PrescriptionUpload from "./pages/customer/PrescriptionUpload";

// const StaticLayout = ({ role }) => {
//   return (
//     // <div className="flex-1 flex flex-col">
//     //   <HeaderM />
//     //   <div className="w-64 bg-white shadow-md">
//     //     <Navbar role={role} />
//     //     <div className="flex-1 overflow-y-auto">
//     //       <Outlet />
//     //     </div>
//     //   </div>
//     // </div>

//     <div className="flex h-screen bg-gray-100">
//       <Navbar role={role} className="w-1/4 bg-white shadow-lg" />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <HeaderM className="bg-white shadow-md p-4" />
//         <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Customer layout without static header/navbar
// const CustomerLayout = () => {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <CustomerHeader />
//       <main className="flex-grow">
//         <Outlet />
//       </main>
//       <CustomerFooter />
//     </div>
//   );
// };
// // Protected route wrapper
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   if (!token || !user || !role) {
//     return <Navigate to="/" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children ? children : <Outlet />;
// };

// function App() {
//   const role = localStorage.getItem("role");

//   return (
//     <Router>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/unauthorized"
//           element={<div>You don't have permission to access this page</div>}
//         />

//         {/* Shared professional routes */}
//         <Route
//           element={
//             <ProtectedRoute allowedRoles={["manager", "staff", "supplier"]} />
//           }
//         >
//           <Route element={<StaticLayout role={role} />}>
//             {/* Add this new route */}
//             <Route path="/notifications" element={<NotificationHistory />} />
//           </Route>
//         </Route>

//         {/* Manager routes (with static header/navbar) */}
//         <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
//           <Route element={<StaticLayout role="manager" />}>
//             <Route path="/manager/dashboard" element={<Dashboard />} />
//             <Route path="/manager/inventory" element={<Inventory />} />
//             <Route path="/manager/reports" element={<Reports />} />
//             <Route path="/manager/suppliers" element={<Suppliers />} />
//             <Route path="/manager/OrdersPage" element={<OrdersPage />} />
//             <Route path="/manager/staff" element={<Staff />} />
//             <Route path="/manager/sales" element={<Sales />} />

//             {/* Add more manager-specific routes here */}
//           </Route>
//         </Route>

//         {/* Staff routes (with static header/navbar) */}
//         <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
//           <Route element={<StaticLayout role="staff" />}>
//             {/* <Route path="/staff/dashboard" element={<PharmacyDashboard />} />
//             <Route path="/staff/inventory" element={<Inventory />} />
//             <Route path="/staff/sales" element={<Sales />} />
//             <Route path="/staff/orders" element={<OrdersPage />} /> */}
//             {/* Add more staff-specific routes here */}
//           </Route>
//         </Route>

//         {/* Supplier routes (with static header/navbar) */}
//         <Route element={<ProtectedRoute allowedRoles={["supplier"]} />}>
//           <Route element={<StaticLayout role="supplier" />}>
//             {/* <Route path="/supplier/dashboard" element={<Dashboard />} />
//             <Route path="/supplier/products" element={<ProductListTable />} />
//             <Route path="/supplier/orders" element={<OrdersPage />} /> */}
//             {/* Add more supplier-specific routes here */}
//           </Route>
//         </Route>

//         {/* Customer routes (without static header/navbar) */}
//         <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
//           <Route element={<CustomerLayout />}>
//             <Route path="/customer/HomePage" element={<HomePage />} />
//             <Route path="/customer/profile" element={<ProfileV />} />
//             <Route path="/customer/products" element={<ProductListTable />} />

//             {/* New Customer Routes */}
//             <Route path="/customer/home" element={<HomePage />} />
//             <Route path="/customer/product/:id" element={<ProductDetail />} />
//             <Route path="/customer/cart" element={<ShoppingCart />} />
//             <Route
//               path="/customer/upload-prescription"
//               element={<PrescriptionUpload />}
//             />
//             <Route path="/customer/categories" element={<ProductListTable />} />
//             <Route
//               path="/customer/categories/:category"
//               element={<ProductListTable />}
//             />
//           </Route>
//         </Route>

//         {/* Common protected routes accessible by multiple roles (with static header/navbar) */}
//         <Route element={<ProtectedRoute allowedRoles={["manager", "staff"]} />}>
//           <Route element={<StaticLayout role="staff" />}>
//             {/* <Route path="/pharmacy/overview" element={<InventoryOverview />} />
//             <Route path="/pharmacy/products" element={<ProductDetails />} /> */}
//           </Route>
//         </Route>

//         {/* Redirect for unmatched routes */}
//         <Route
//           path="*"
//           element={
//             role ? (
//               <Navigate
//                 to={
//                   role === "customer"
//                     ? "/customer/dashboard"
//                     : `/${role}/dashboard`
//                 }
//                 replace
//               />
//             ) : (
//               <Navigate to="/" replace />
//             )
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { NotificationProvider } from "./contexts/NotificationContext";

// Authentication Pages
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotPassword";

// Admin/Staff/Supplier Components
import Navbar from "./components/NavigationPanel";
import HeaderM from "./components/HeaderM";
import Notification from "./components/NotificationPanel";
import NotificationsPage from "./pages/notificationsPage";
import UserProfile from "./components/UserProfile";

// Admin Pages
import Dashboard from "./pages/dashbord";
import Sales from "./pages/sales";
import Staff from "./pages/staff";
import Inventory from "./pages/inventory";
import Suppliers from "./pages/suppliers";
import Reports from "./pages/report";
import ProductDetails from "./pages/productDetails";
import OrdersPage from "./pages/ordersPage";

// Shared Components
import ProductListTable from "./components/ProductListTable";
import InventoryOverview from "./components/InventoryOverview";

// Customer Components
import Header from "./components/customer/Header";
import Footer from "./components/customer/Footer";
// Customer Pages
import HomePage from "./pages/customer/HomePage";
import SearchResultsPage from "./pages/customer/SearchResultsPage";
import ProductDetailPage from "./pages/customer/ProductDetailsPage";
import CartPage from "./pages/customer/CartPage";
import UploadPrescriptionPage from "./pages/customer/UploadPrescriptionPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderSuccessPage from "./components/customer/OrderSuccess";
import ProductListPage from "./pages/customer/ProductListPage";
import UserProfilePage from "./pages/customer/UserProfilePage";
import OrderHistoryPage from "./pages/customer/OrderHistoryPage";
import CustomerPrescriptionsPage from "./pages/customer/CustomerPrescriptionsPage";

// Legacy Customer Components (keeping for reference)
import CustomerHeader from "./components/customer/Header";
import CustomerFooter from "./components/customer/Footer";
import ProductDetail from "./pages/customer/ProductDetailsPage";
import ShoppingCart from "./pages/customer/CartPage";
import PrescriptionUpload from "./pages/customer/UploadPrescriptionPage";

//staff pages
import PrescriptionManagement from "./pages/staff/prescription";
import StaffProductListPage from "./pages/staff/Inventory";
import StaffCategoryPage from "./pages/staff/catogory";
import StaffSalesPage from "./pages/staff/sales";
import StaffNRSalesPage from "./pages/staff/notRequredSales";

// Admin/Staff/Supplier Layout
const StaticLayout = ({ role }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar role={role} className="w-1/4 bg-white shadow-lg" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderM className="bg-white shadow-md p-4" />

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Customer Layout
const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Legacy Customer Layout (keeping for reference)
const LegacyCustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomerHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
};

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !user || !role) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

function App() {
  const role = localStorage.getItem("role");

  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/unauthorized"
            element={<div>You don't have permission to access this page</div>}
          />

          {/* New Public Customer Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:category" element={<ProductListPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
          </Route>

          {/* Shared professional routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["manager", "staff", "customer"]} />
            }
          >
            <Route element={<StaticLayout role={role} />}>
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/user-profile" element={<UserProfile />} />
            </Route>
          </Route>

          {/* Manager routes (with static header/navbar) */}
          <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
            <Route element={<StaticLayout role="manager" />}>
              <Route path="/manager/dashboard" element={<Dashboard />} />
              <Route path="/manager/inventory" element={<Inventory />} />
              <Route path="/manager/reports" element={<Reports />} />
              <Route path="/manager/suppliers" element={<Suppliers />} />
              <Route path="/manager/OrdersPage" element={<OrdersPage />} />
              <Route path="/manager/staff" element={<Staff />} />
              <Route path="/manager/sales" element={<Sales />} />
            </Route>
          </Route>

          {/* Staff routes (with static header/navbar) */}
          <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
            <Route element={<StaticLayout role="staff" />}>
              <Route path="/staff/dashboard" element={<Dashboard />} />
              <Route
                path="/staff/inventory"
                element={<StaffProductListPage />}
              />
              <Route path="/staff/orders" element={<OrdersPage />} />
              <Route
                pathe="/staff/categories"
                element={<StaffCategoryPage />}
              />
              <Route path="/staff/sales" element={<StaffSalesPage />} />
              <Route
                path="/staff/sales/not-required"
                element={<StaffNRSalesPage />}
              />
              <Route
                path="/staff/prescriptions"
                element={<PrescriptionManagement />}
              />
              {/* Add more staff-specific routes here */}
            </Route>
          </Route>

          {/* Supplier routes (with static header/navbar) */}
          <Route element={<ProtectedRoute allowedRoles={["supplier"]} />}>
            <Route element={<StaticLayout role="supplier" />}>
              <Route path="/supplier/dashboard" element={<Dashboard />} />
              <Route path="/supplier/orders" element={<OrdersPage />} />
              {/* Add more supplier-specific routes here */}
            </Route>
          </Route>

          {/* Protected Customer routes */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route element={<CustomerLayout />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/upload-prescription"
                element={<UploadPrescriptionPage />}
              />
              <Route
                path="/PrescriptionsList"
                element={<CustomerPrescriptionsPage />}
              />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              {/* <Route path="/profile" element={<UserProfilePage />} /> */}
              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
            </Route>
          </Route>

          {/* Legacy Customer routes (keeping for reference) */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route element={<LegacyCustomerLayout />}>
              <Route path="/customer/HomePage" element={<HomePage />} />
              <Route path="/customer/products" element={<ProductListTable />} />
              <Route path="/customer/home" element={<HomePage />} />
              <Route path="/customer/product/:id" element={<ProductDetail />} />
              <Route path="/customer/cart" element={<ShoppingCart />} />
              <Route
                path="/customer/upload-prescription"
                element={<PrescriptionUpload />}
              />
              <Route
                path="/customer/categories"
                element={<ProductListTable />}
              />
              <Route
                path="/customer/categories/:category"
                element={<ProductListTable />}
              />
            </Route>
          </Route>

          {/* <Route
            element={
              <ProtectedRoute allowedRoles={["manager", "staff", "customer"]} />
            }
          >
            <Route path="/user-profile" element={<UserProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route> */}

          {/* Common protected routes accessible by multiple roles */}
          <Route
            element={<ProtectedRoute allowedRoles={["manager", "staff"]} />}
          >
            <Route element={<StaticLayout role={role} />}>
              <Route
                path="/pharmacy/overview"
                element={<InventoryOverview />}
              />
              <Route path="/pharmacy/products" element={<ProductDetails />} />
            </Route>
          </Route>

          {/* Redirect for unmatched routes */}
          <Route
            path="*"
            element={
              role ? (
                <Navigate
                  to={role === "customer" ? "/home" : `/${role}/dashboard`}
                  replace
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
