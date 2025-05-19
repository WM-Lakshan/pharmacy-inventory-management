import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, AlertTriangle, ShoppingCart } from "lucide-react";
import api from "../api/axios";

const InventoryOverview = () => {
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState({
    categories: 0,
    lowStocks: { ordered: 0, notInStock: 0 },
  });

  const fetchInventoryData = async () => {
    try {
      const response = await api.get("/products/stats");
      setInventoryData(response.data);
    } catch (error) {
      console.error("Failed to fetch inventory data:", error);
    }
  };

  useEffect(() => {
    fetchInventoryData();
    const intervalId = setInterval(fetchInventoryData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCategoryClick = () => {
    navigate("/products?filter=categories");
  };

  const handleOrderedClick = () => {
    navigate("/products?filter=ordered");
  };

  const handleNotInStockClick = () => {
    navigate("/products?filter=outofstock");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Overall Inventory
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Categories Section */}
        <div
          className="bg-blue-50 rounded-lg p-3 flex items-center space-x-3 cursor-pointer hover:bg-blue-100 transition"
          onClick={handleCategoryClick}
        >
          <Package className="text-blue-500" size={24} />
          <div>
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-2xl font-bold text-blue-700">
              {inventoryData.categories}
            </p>
          </div>
        </div>

        {/* Low Stocks Section */}
        <div className="bg-red-50 rounded-lg p-3">
          <div className="flex items-center space-x-3 mb-2">
            <AlertTriangle className="text-red-500" size={24} />
            <h3 className="text-sm text-gray-600">Low Stocks</h3>
          </div>
          <div className="space-y-2">
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-red-100 p-1 rounded"
              onClick={handleOrderedClick}
            >
              <span className="text-sm text-gray-700">Ordered</span>
              <span className="text-red-600 font-semibold">
                {inventoryData.lowStocks.ordered}
              </span>
            </div>
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-red-100 p-1 rounded"
              onClick={handleNotInStockClick}
            >
              <span className="text-sm text-gray-700">Not in stock</span>
              <span className="text-red-600 font-semibold">
                {inventoryData.lowStocks.notInStock}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryOverview;
