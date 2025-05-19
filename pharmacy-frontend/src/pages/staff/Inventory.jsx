import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Modal, Button, message, Tag } from "antd";
import { Search, Eye, Filter } from "lucide-react";

// Main App Component
export default function ProductInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  useEffect(() => {
    // Fetch products from API
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/staff-inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        // Fallback to sample data if API fails
        setMockProducts();
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to load products. Using sample data.");
      setMockProducts();
    } finally {
      setLoading(false);
    }
  };

  //set mock data
  const setMockProducts = () => {
    const mockProducts = [
      {
        id: 1,
        name: "K95",
        price: "Rs.430",
        quantity: "43 Packets",
        category: "Masks",
        availability: "In-stock",
        image: "/api/placeholder/400/320",
        description:
          "High quality protective mask with 5-layer filtration system.",
      },
      {
        id: 2,
        name: "K95",
        price: "Rs.257",
        quantity: "22 Packets",
        category: "Masks",
        availability: "Out of stock",
        image: "/api/placeholder/400/320",
        description: "Standard K95 mask with adjustable nose clip.",
      },
    ];

    setProducts(mockProducts);
  };

  const columns = [
    {
      title: "Product ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Products",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "15%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "15%",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "20%",
    },
    {
      title: "Prescription",
      dataIndex: "prescriptionRequired",
      key: "prescriptionRequired",
      width: "15%",
      render: (text) => (
        <Tag color={text === "Required" ? "orange" : "green"}>{text}</Tag>
      ),
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      width: "15%",
      render: (text) => (
        <span
          className={text === "In-stock" ? "text-green-500" : "text-red-500"}
        >
          {text}
        </span>
      ),
    },
  ];

  const handleRowClick = (record) => {
    setSelectedProduct(record);
    setDetailsVisible(true);
  };

  const handleImageClick = () => {
    setImageModalVisible(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            <Button
              type="default"
              icon={<Filter size={16} />}
              className="flex items-center"
            >
              Filters
            </Button>
          </div>
        </div>

        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            className: "cursor-pointer hover:bg-gray-50",
          })}
        />
      </div>

      {/* Product Details Modal */}
      <Modal
        title="Product Details"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={null}
        width={700}
      >
        {selectedProduct && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div
                className="border rounded-md overflow-hidden cursor-pointer"
                onClick={handleImageClick}
              >
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-auto object-cover"
                />
                <div className="bg-gray-100 p-2 flex justify-center">
                  <Eye size={16} className="text-blue-500" />
                  <span className="ml-2 text-sm text-blue-500">
                    View larger
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-semibold mb-4">
                {selectedProduct.name}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Product ID:</span>
                  <span className="font-medium">{selectedProduct.id}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">{selectedProduct.price}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">
                    {selectedProduct.quantity}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">
                    {selectedProduct.category}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Availability:</span>
                  <span
                    className={`font-medium ${
                      selectedProduct.availability === "In-stock"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {selectedProduct.availability}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Prescription:</span>
                  <Tag
                    color={
                      selectedProduct.prescriptionRequired === "Required"
                        ? "orange"
                        : "green"
                    }
                  >
                    {selectedProduct.prescriptionRequired}
                  </Tag>
                </div>
                <div className="pt-2">
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1">{selectedProduct.description}</p>
                </div>
              </div>
              {/* <div className="mt-6 flex justify-end">
                <Button>Close</Button>
              </div> */}
            </div>
          </div>
        )}
      </Modal>

      {/* Large Image Modal */}
      <Modal
        open={imageModalVisible}
        onCancel={() => setImageModalVisible(false)}
        footer={null}
        width={800}
        centered
      >
        {selectedProduct && (
          <div className="flex justify-center">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="max-w-full max-h-96 object-contain"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
