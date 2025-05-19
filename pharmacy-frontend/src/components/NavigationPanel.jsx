// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Package,
//   FileText,
//   Users,
//   ShoppingBag,
//   Truck,
//   LogOut,
// } from "lucide-react";

// const Navbar = () => {
//   const role = localStorage.getItem("role") || "manager"; // Default to "manager" if not set

//   const navItems = [
//     { name: "Dashboard", icon: LayoutDashboard, route: `/${role}/dashboard` },
//     { name: "Inventory", icon: Package, route: `/${role}/inventory` },
//     { name: "Reports", icon: FileText, route: `/${role}/reports` },
//     { name: "Sales", icon: ShoppingBag, route: `/${role}/sales` },
//     { name: "Staff", icon: Users, route: `/${role}/staff` },
//     { name: "Suppliers", icon: Users, route: `/${role}/suppliers` },
//     { name: "Orders", icon: Truck, route: `/${role}/OrdersPage` },
//   ];

//   return (
//     <div className="w-64 bg-white h-screen flex flex-col shadow-sm">
//       {/* Logo Section */}
//       <div className="mt-6 p-5">
//         <h2 className="text-xl font-bold text-blue-600">L.W.Pharmacy</h2>
//       </div>

//       {/* Navigation Items */}
//       <nav aria-label="Main navigation" className="flex-grow py-4 space-y-1">
//         {navItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <NavLink
//               key={item.name}
//               to={item.route}
//               className={({ isActive }) => `
//                 flex items-center px-6 py-3 cursor-pointer transition-all duration-200
//                 ${
//                   isActive
//                     ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }
//               `}
//             >
//               <Icon className="w-5 h-5 mr-3" />
//               <span className="text-sm font-medium">{item.name}</span>
//             </NavLink>
//           );
//         })}
//       </nav>

//       {/* Logout Section */}
//       <div className="mb-4 p-4 pt-4 cursor-pointer flex items-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
//         <LogOut className="w-5 h-5 mr-3" />
//         <span className="text-sm font-medium">Log Out</span>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  ShoppingBag,
  Truck,
  LogOut,
  History,
  ListOrdered,
  Clipboard,
  Bell,
} from "lucide-react";

const Navbar = ({ role }) => {
  // Define navigation items for each role
  const managerNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, route: `/manager/dashboard` },
    { name: "Inventory", icon: Package, route: `/manager/inventory` },
    { name: "Reports", icon: FileText, route: `/manager/reports` },
    { name: "Sales", icon: ShoppingBag, route: `/manager/sales` },
    { name: "Staff", icon: Users, route: `/manager/staff` },
    { name: "Suppliers", icon: Users, route: `/manager/suppliers` },
    { name: "Orders", icon: Truck, route: `/manager/OrdersPage` },
  ];

  const staffNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, route: `/staff/dashboard` },
    { name: "Inventory", icon: Package, route: `/staff/inventory` },
    // { name: "History", icon: History, route: `/staff/history` },
    { name: "Sales", icon: ShoppingBag, route: `/staff/sales/not-required` },
    // { name: "Categories", icon: ListOrdered, route: `/staff/catogory` },
    { name: "Prescriptions", icon: Clipboard, route: `/staff/prescriptions` },
  ];

  const supplierNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, route: `/supplier/dashboard` },
    { name: "Products", icon: Package, route: `/supplier/products` },
    { name: "Orders", icon: Truck, route: `/supplier/orders` },
  ];

  // Select the appropriate navigation items based on role
  let navItems = [];

  switch (role) {
    case "manager":
      navItems = managerNavItems;
      break;
    case "staff":
      navItems = staffNavItems;
      break;
    case "supplier":
      navItems = supplierNavItems;
      break;
    default:
      navItems = managerNavItems; // Default fallback
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // Navigate to login page
    window.location.href = "/login"; // Ensure this matches your login route
  };

  return (
    <div className="w-64 bg-white h-screen flex flex-col shadow-sm">
      {/* Logo Section */}
      <div className="mt-6 p-5">
        <h2 className="text-xl font-bold text-blue-600">L.W.Pharmacy</h2>
        <p className="text-sm text-gray-500 mt-1">
          {role.charAt(0).toUpperCase() + role.slice(1)} Panel
        </p>
      </div>

      {/* Navigation Items */}
      <nav aria-label="Main navigation" className="flex-grow py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.route}
              className={({ isActive }) => `
                flex items-center px-6 py-3 cursor-pointer transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div
        className="mb-8 p-4 pt-4 cursor-pointer flex items-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5 mr-3" />
        <span className="text-sm font-medium">Log Out</span>
      </div>
    </div>
  );
};

export default Navbar;
