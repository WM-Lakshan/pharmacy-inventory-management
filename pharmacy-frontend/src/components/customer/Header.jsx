// import React, { useState } from "react";
// import {
//   SearchOutlined,
//   BellOutlined,
//   ShoppingCartOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import { Input, Badge, Avatar, Dropdown } from "antd";
// import { useNavigate } from "react-router-dom"; // Import useNavigate

// const Header = ({ cartCount = 0 }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate(); // Initialize the navigate function

//   const handleSearch = () => {
//     console.log("Searching for:", searchTerm);
//     // Implement search functionality
//   };

//   const handleLogout = () => {
//     // Clear localStorage
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("role");

//     // Redirect to login page
//     navigate("/login"); // Use navigate instead of window.location
//   };

//   const handleMenuClick = (e) => {
//     switch (e.key) {
//       case "profile":
//         navigate("/user-profile"); // Navigate to user profile
//         break;
//       case "orders":
//         navigate("/orders"); // Example for other menu items
//         break;
//       case "prescriptions":
//         navigate("/PrescriptionsList"); // Example for other menu items
//         break;
//       case "logout":
//         handleLogout();
//         break;
//       default:
//         break;
//     }
//   };

//   const menuItems = [
//     { key: "profile", label: "My Profile" },
//     { key: "orders", label: "My Orders" },
//     { key: "prescriptions", label: "My Prescriptions" },
//     { key: "logout", label: "Logout" },
//   ];

//   return (
//     <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
//       {/* Logo */}
//       <div
//         onClick={() => navigate("/HomePage")} // Use navigate here too
//         className="text-blue-600 font-bold text-xl cursor-pointer"
//       >
//         L.W.Pharmacy
//       </div>

//       {/* Search */}
//       <div className="flex-1 max-w-xl mx-4">
//         <div className="relative">
//           <Input
//             placeholder="Search medicine, medical products"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onPressEnter={handleSearch}
//             prefix={<SearchOutlined className="text-gray-400" />}
//             className="rounded-md border-gray-300"
//           />
//           <button
//             onClick={handleSearch}
//             className="absolute right-0 top-0 h-full px-3 bg-blue-600 rounded-r-md text-white flex items-center justify-center"
//           >
//             <SearchOutlined />
//           </button>
//         </div>
//       </div>

//       {/* Icons */}
//       <div className="flex items-center gap-4">
//         <Badge count={2} size="small">
//           <div
//             onClick={() => navigate("/notifications")} // Use navigate here
//             className="cursor-pointer"
//           >
//             <BellOutlined className="text-xl text-gray-600 cursor-pointer" />
//           </div>
//         </Badge>

//         <Badge count={cartCount} size="small">
//           <div
//             onClick={() => navigate("/cart")} // Use navigate here
//             className="cursor-pointer"
//           >
//             <ShoppingCartOutlined className="text-xl text-gray-600" />
//           </div>
//         </Badge>

//         <Dropdown
//           menu={{
//             items: menuItems,
//             onClick: handleMenuClick, // Use our custom handler
//           }}
//           placement="bottomRight"
//         >
//           <Avatar
//             icon={<UserOutlined />}
//             className="bg-gray-200 cursor-pointer"
//           />
//         </Dropdown>
//       </div>
//     </header>
//   );
// };

// export default Header;

////////////////////working ////////////////////////

import React, { useState } from "react";
import {
  SearchOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Badge, Avatar, Dropdown, AutoComplete, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = ({ cartCount = 0 }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  // const handleSearch = async (value) => {
  //   if (!value || value.trim() === "") {
  //     message.warning("Please enter a search term");
  //     return;
  //   }

  //   try {
  //     setSearchLoading(true);
  //     const response = await axios.get(
  //       `/api/customer-search/search?q=${encodeURIComponent(value)}`
  //     );
  //     setSearchResults(response.data.products);

  //     if (response.data.products.length > 0) {
  //       navigate(`/search-results?q=${encodeURIComponent(value)}`, {
  //         state: { results: response.data.products },
  //       });
  //     } else {
  //       message.info("No products found matching your search");
  //     }
  //   } catch (error) {
  //     console.error("Search error:", error);
  //     message.error("Failed to perform search");
  //   } finally {
  //     setSearchLoading(false);
  //   }
  // };

  // const handleSearch = async (value) => {
  //   if (!value?.trim()) {
  //     message.warning("Please enter a search term");
  //     return;
  //   }

  //   try {
  //     setSearchLoading(true);
  //     const response = await axios.get(
  //       `/api/products/search?q=${encodeURIComponent(value)}`
  //     );

  //     if (response.data.products?.length > 0) {
  //       navigate("/search-results", {
  //         state: {
  //           results: response.data.products,
  //           searchTerm: value,
  //         },
  //       });
  //     } else {
  //       message.info("No products found matching your search");
  //     }
  //   } catch (error) {
  //     console.error("Search error:", error);
  //     message.error(error.response?.data?.message || "Search failed");
  //   } finally {
  //     setSearchLoading(false);
  //   }
  // };

  const handleSearch = async (value) => {
    if (!value?.trim()) {
      message.warning("Please enter a search term");
      return;
    }

    try {
      setSearchLoading(true);
      const response = await axios.get(`/api/customer-search/search`, {
        params: { q: value },
      });

      if (response.data?.length > 0) {
        navigate("/search-results", {
          state: {
            results: response.data,
            searchTerm: value,
          },
        });
      } else {
        message.info("No products found matching your search");
      }
    } catch (error) {
      console.error("Search error:", error);
      message.error(error.response?.data?.message || "Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelect = (value, option) => {
    navigate(`/product/${option.key}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "profile":
        navigate("/user-profile");
        break;
      case "orders":
        navigate("/orders");
        break;
      case "prescriptions":
        navigate("/PrescriptionsList");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { key: "profile", label: "My Profile" },
    { key: "orders", label: "My Orders" },
    { key: "prescriptions", label: "My Prescriptions" },
    { key: "logout", label: "Logout" },
  ];

  const searchOptions = searchResults.map((product) => ({
    key: product.id,
    value: product.name,
    label: (
      <div className="flex justify-between">
        <span>{product.name}</span>
        <span>Rs.{product.price.toFixed(2)}</span>
      </div>
    ),
  }));

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      {/* Logo */}
      <div
        onClick={() => navigate("/HomePage")}
        className="text-blue-600 font-bold text-xl cursor-pointer"
      >
        L.W.Pharmacy
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-4">
        <AutoComplete
          options={searchOptions}
          style={{ width: "100%" }}
          onSelect={handleSelect}
          onSearch={handleSearch}
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search medicine, medical products"
        >
          <Input
            suffix={
              <SearchOutlined
                className="text-gray-400 cursor-pointer"
                onClick={() => handleSearch(searchTerm)}
              />
            }
            onPressEnter={() => handleSearch(searchTerm)}
            className="rounded-md border-gray-300"
          />
        </AutoComplete>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <Badge count={2} size="small">
          <div
            onClick={() => navigate("/notifications")}
            className="cursor-pointer"
          >
            <BellOutlined className="text-xl text-gray-600 cursor-pointer" />
          </div>
        </Badge>

        <Badge count={cartCount} size="small">
          <div onClick={() => navigate("/cart")} className="cursor-pointer">
            <ShoppingCartOutlined className="text-xl text-gray-600" />
          </div>
        </Badge>

        <Dropdown
          menu={{
            items: menuItems,
            onClick: handleMenuClick,
          }}
          placement="bottomRight"
        >
          <Avatar
            icon={<UserOutlined />}
            className="bg-gray-200 cursor-pointer"
          />
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
