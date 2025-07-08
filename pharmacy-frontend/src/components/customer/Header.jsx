

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
