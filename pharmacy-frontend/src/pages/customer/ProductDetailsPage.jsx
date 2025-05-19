import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Tag,
  InputNumber,
  message,
  Spin,
  Tabs,
  Divider,
  Card,
} from "antd";
import axios from "axios";
import "antd/dist/reset.css";
import PrescriptionCheckoutPage from "./CheckoutPage";

const { TabPane } = Tabs;

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/productsDetails/${id}`);

      if (!response.data?.product) {
        setMockProductData();
        return;
      }

      setProduct(response.data.product);

      // Fetch related products
      const relatedResponse = await axios.get(
        `/api/productsDetails/related/${id}`
      );
      setRelatedProducts(relatedResponse.data?.products || []);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to load product details");
      setMockProductData();
    } finally {
      setLoading(false);
    }
  };

  const setMockProductData = () => {
    const mockProduct = {
      id: id,
      name: "Sample Product",
      price: 40,
      image: "/placeholders/product-400x320.jpg",
      description: "Sample product description",
      availabilityStatus: "In Stock",
      requiresPrescription: false,
      usage: "Usage instructions",
      sideEffects: "Possible side effects",
      composition: "Product composition",
      manufacturer: "Manufacturer Name",
      category: "Sample Category",
      stockCount: 100,
    };
    setProduct(mockProduct);
    setMockRelatedProducts();
  };

  const setMockRelatedProducts = () => {
    const mockRelated = [
      {
        id: 101,
        name: "Related Product 1",
        price: 50,
        image: "/placeholders/product-400x320.jpg",
        requiresPrescription: false,
        inStock: true,
      },
      {
        id: 102,
        name: "Related Product 2",
        price: 45,
        image: "/placeholders/product-400x320.jpg",
        requiresPrescription: false,
        inStock: true,
      },
    ];
    setRelatedProducts(mockRelated);
  };

  const handleQuantityChange = (value) => {
    if (value === undefined || value === null || isNaN(value)) {
      setQuantity(1);
      return;
    }

    // Ensure value is a positive integer between 1 and max (10)
    const intValue = Math.max(1, Math.min(10, Math.floor(Number(value))));
    setQuantity(intValue);
  };

  const handleAddToCart = async () => {
    if (quantity < 1 || quantity > product.stockCount || isNaN(quantity)) {
      message.error(
        `Please enter a valid quantity between 1 and ${product.stockCount}`
      );
      return;
    }
    if (product.requiresPrescription) {
      message.warning(
        "This product requires a prescription. Please upload one before purchasing."
      );
      return;
    }

    if (product.availabilityStatus !== "In Stock") {
      message.error("This product is currently out of stock.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login to add products to cart");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "/api/cart/add",
        {
          productId: product.id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success(`${product.name} added to cart`);
      } else {
        message.error(response.data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error(
        error.response?.data?.message || "Failed to add product to cart"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex justify-center items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl text-gray-600">Product not found</h2>
            <Link
              to="/"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Row gutter={[32, 24]}>
          <Col xs={24} md={12}>
            <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-full">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-96 object-contain"
                onError={(e) => {
                  e.target.src = "/placeholders/product-400x320.jpg";
                }}
              />
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl font-semibold text-gray-800">
                {product.name}
              </h1>

              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-blue-600 mr-3">
                    Rs.{product.price.toFixed(2)}
                  </span>
                </div>

                <div className="mt-3">
                  <Tag
                    color={
                      product.availabilityStatus === "In Stock"
                        ? "green"
                        : "red"
                    }
                  >
                    {product.availabilityStatus}
                  </Tag>
                  {product.requiresPrescription && (
                    <Tag color="orange" className="ml-2">
                      Requires Prescription
                    </Tag>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-gray-600">{product.description}</p>
              </div>

              <Divider />

              <div className="mt-4">
                <div className="mb-4">
                  <span className="text-gray-700 mr-4">Quantity:</span>
                  <InputNumber
                    min={1}
                    max={product.stockCount} // Use actual stock count as max
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={
                      product.requiresPrescription ||
                      product.availabilityStatus !== "In Stock"
                    }
                    precision={0}
                    onKeyDown={(e) => {
                      if (["-", ".", "e", "E"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pasteData = e.clipboardData.getData("text");
                      if (!/^\d+$/.test(pasteData)) {
                        e.preventDefault();
                        message.error("Only numbers are allowed");
                      }
                    }}
                    formatter={(value) => `${value}`.replace(/[^0-9]/g, "")}
                    parser={(value) =>
                      parseInt(value.replace(/[^0-9]/g, "")) || 1
                    }
                    style={{ width: "100px" }}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleAddToCart}
                    disabled={
                      product.requiresPrescription ||
                      product.availabilityStatus !== "In Stock" ||
                      product.stockCount === 0
                    }
                  >
                    {product.stockCount === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>

                  {product.requiresPrescription ? (
                    <Link to="/upload-prescription">
                      <Button type="default" size="large">
                        Upload Prescription
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      disabled={
                        product.availabilityStatus !== "In Stock" ||
                        product.stockCount === 0
                      }
                    >
                      {product.stockCount === 0 ? "Buy Now" : "Buy Now"}
                    </Button>
                  )}
                </div>
                {/* <div className="flex space-x-4">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleAddToCart}
                    disabled={
                      product.requiresPrescription ||
                      product.availabilityStatus !== "In Stock"
                    }
                  >
                    Add to Cart
                  </Button>
                  {product.requiresPrescription ? (
                    <Link to="/upload-prescription">
                      <Button type="default" size="large">
                        Upload Prescription
                      </Button>
                    </Link>
                  ) : (
                    <Button type="primary" size="large">
                      Buy Now
                    </Button>
                  )}
                </div> */}
              </div>
            </div>
          </Col>
        </Row>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Description" key="1">
              <div className="p-4">
                <p className="text-gray-700">{product.description}</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Usage</h4>
                    <p className="text-gray-600">{product.usage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Side Effects
                    </h4>
                    <p className="text-gray-600">{product.sideEffects}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Composition
                    </h4>
                    <p className="text-gray-600">{product.composition}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Manufacturer
                    </h4>
                    <p className="text-gray-600">{product.manufacturer}</p>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <Row gutter={[16, 16]}>
            {relatedProducts.map((relatedProduct) => (
              <Col xs={24} sm={12} md={8} lg={6} key={relatedProduct.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={relatedProduct.name}
                      src={relatedProduct.image}
                      className="p-4 h-48 object-contain"
                      onError={(e) => {
                        e.target.src = "/placeholders/product-400x320.jpg";
                      }}
                    />
                  }
                >
                  <div className="text-lg font-medium mb-2">
                    {relatedProduct.name}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-semibold">
                      Rs.{relatedProduct.price.toFixed(2)}
                    </span>
                    {!relatedProduct.inStock && (
                      <Tag color="red">Out of Stock</Tag>
                    )}
                  </div>
                  <Link
                    to={`/product/${relatedProduct.id}`}
                    className="block w-full"
                  >
                    <Button type="primary" block className="mt-4">
                      View Details
                    </Button>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsPage;
