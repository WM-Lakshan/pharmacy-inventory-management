import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  InputNumber,
  Select,
  Divider,
  Checkbox,
  Empty,
  message,
  Spin,
  Modal,
} from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
// import Header from "../../components/customer/Header";
// import Footer from "../../components/customer/Footer";

const { Option } = Select;
const { confirm } = Modal;

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState("Home Delivery");
  const [shippingFee, setShippingFee] = useState(300);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login to view your cart");
        navigate("/login");
        return;
      }

      const response = await axios.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // For demo purposes, if API fails or not available
      if (!response.data) {
        setMockCartItems();
        return;
      }

      setCartItems(response.data.items);

      // Check if any item requires prescription
      const requiresPrescription = response.data.items.some(
        (item) => item.requiresPrescription
      );
      setPrescriptionRequired(requiresPrescription);
    } catch (error) {
      console.error("Error fetching cart items:", error);

      // For demo purposes
      setMockCartItems();
    } finally {
      setLoading(false);
    }
  };

  const setMockCartItems = () => {
    // Mock data for testing
    const mockItems = [
      {
        id: 1,
        product_id: 101,
        name: "Samahan",
        price: 40,
        quantity: 2,
        image: "/api/placeholder/80/80",
        requiresPrescription: false,
        stockCount: 20,
      },
      {
        id: 2,
        product_id: 102,
        name: "Yakipeyana",
        price: 50,
        quantity: 1,
        image: "/api/placeholder/80/80",
        requiresPrescription: false,
        stockCount: 15,
      },
    ];

    setCartItems(mockItems);
    setPrescriptionRequired(
      mockItems.some((item) => item.requiresPrescription)
    );
  };

  const handleQuantityChange = async (id, quantity) => {
    // If quantity is undefined, null, or not a number, return early
    if (quantity === undefined || quantity === null || isNaN(quantity)) {
      return;
    }

    // Ensure quantity is a positive integer
    const intQuantity = Math.max(1, Math.floor(Number(quantity)));

    // Find the item
    const item = cartItems.find((item) => item.id === id);

    // Validate quantity against stock
    if (intQuantity > item.stockCount) {
      message.error(`Only ${item.stockCount} items available in stock`);
      return;
    }

    // Update the cart item quantity
    try {
      const token = localStorage.getItem("token");

      // Make sure the token exists
      if (!token) {
        message.error("Your session has expired. Please login again.");
        navigate("/login");
        return;
      }

      // Add the Authorization header with the token
      await axios.put(
        `/api/cart/update-quantity`,
        {
          cartItemId: id,
          quantity: intQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: intQuantity } : item
        )
      );

      // Show success message
      message.success("Quantity updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);

      if (error.response?.status === 401) {
        message.error("Your session has expired. Please login again.");
        navigate("/login");
      } else {
        message.error("Failed to update quantity");

        // For demo purposes, update the local state anyway
        setCartItems(
          cartItems.map((item) =>
            item.id === id ? { ...item, quantity: intQuantity } : item
          )
        );
      }
    }
  };

  const handleRemoveItem = (id) => {
    confirm({
      title: "Are you sure you want to remove this item?",
      icon: <ExclamationCircleOutlined />,
      content: "This item will be removed from your cart",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");

          if (!token) {
            message.error("Your session has expired. Please login again.");
            navigate("/login");
            return;
          }

          // Make sure to include the Authorization header with the token
          await axios.delete(`/api/cart/remove/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Update local state
          setCartItems(cartItems.filter((item) => item.id !== id));
          message.success("Item removed from cart");
        } catch (error) {
          console.error("Error removing item:", error);

          if (error.response?.status === 401) {
            message.error("Your session has expired. Please login again.");
            navigate("/login");
          } else {
            message.error("Failed to remove item");

            // For demo purposes, update the local state anyway
            setCartItems(cartItems.filter((item) => item.id !== id));
          }
        }
      },
    });
  };

  const handleDeliveryMethodChange = (value) => {
    setDeliveryMethod(value);

    // Update shipping fee based on delivery method
    if (value === "Home Delivery") {
      setShippingFee(300);
    } else {
      setShippingFee(0);
    }
  };

  const handleCheckout = () => {
    if (!termsAccepted) {
      message.error("Please accept the terms and conditions");
      return;
    }

    if (prescriptionRequired) {
      navigate("/upload-prescription");
    } else {
      navigate("/checkout");
    }
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate total
  const total = subtotal + shippingFee;

  const columns = [
    {
      title: "PRODUCT",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <button
            onClick={() => handleRemoveItem(record.id)}
            className="text-red-500 mr-4"
          >
            <DeleteOutlined />
          </button>
          <img
            src={record.image}
            alt={text}
            className="w-16 h-16 object-contain mr-4"
          />
          <Link
            to={`/product/${record.product_id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            {text}
          </Link>
        </div>
      ),
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      render: (price) => `Rs.${price}`,
    },
    {
      title: "QTY",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={record.stockCount}
          value={quantity}
          //   onChange={(value) => handleQuantityChange(record.id, value)}
          // />
          onChange={(value) => {
            // This will ensure only numbers are processed
            if (value !== undefined && value !== null) {
              handleQuantityChange(record.id, value);
            }
          }}
          onKeyPress={(e) => {
            // Only allow number keys (0-9), backspace, delete, tab, and arrow keys
            if (
              !/[0-9]/.test(e.key) &&
              e.key !== "Backspace" &&
              e.key !== "Delete" &&
              e.key !== "Tab" &&
              !e.key.includes("Arrow")
            ) {
              e.preventDefault();
            }
          }}
          onPaste={(e) => {
            // Get pasted data and check if it's numeric
            const pasteData = e.clipboardData.getData("text");
            if (!/^\d+$/.test(pasteData)) {
              e.preventDefault();
              message.error("Only numbers are allowed");
            }
          }}
          style={{ width: "100%" }}
          precision={0} // Ensures no decimal places
        />
      ),
    },
    {
      title: "UNIT PRICE",
      key: "unitPrice",
      render: (_, record) =>
        `Rs.${(record.price * record.quantity).toFixed(2)}`,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* <Header /> */}
        <div className="flex-grow flex justify-center items-center">
          <Spin size="large" />
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Empty
              description={
                <span className="text-gray-500">Your cart is empty</span>
              }
            />
            <Button
              type="primary"
              className="mt-4 bg-blue-600"
              onClick={() => navigate("/pages/customer/HomePage")}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Table
              columns={columns}
              dataSource={cartItems}
              rowKey="id"
              pagination={false}
            />

            <div className="mt-8 flex flex-col md:flex-row justify-between">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <textarea
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="Special instructions for your order (optional)"
                  rows={4}
                />
              </div>

              <div className="md:w-1/2 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">Rs.{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center">
                    Delivery method
                    <span className="ml-4">
                      <Select
                        value={deliveryMethod}
                        onChange={handleDeliveryMethodChange}
                        style={{ width: 160 }}
                      >
                        <Option value="Home Delivery">Home Delivery</Option>
                        <Option value="Order Pickup">Order Pickup</Option>
                      </Select>
                    </span>
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span>Shipping fee</span>
                  <span>
                    {deliveryMethod === "Home Delivery"
                      ? `Rs.${shippingFee.toFixed(2)}`
                      : "Free"}
                  </span>
                </div>

                <Divider className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold">TOTAL</span>
                  <span className="text-xl font-bold text-blue-600">
                    Rs.{total.toFixed(2)}
                  </span>
                </div>

                <Checkbox
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mb-4"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600">
                    terms and conditions
                  </Link>
                </Checkbox>

                <Button
                  type="primary"
                  size="large"
                  onClick={handleCheckout}
                  disabled={!termsAccepted}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {prescriptionRequired ? "Upload Prescription" : "Check out"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default CartPage;
