import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Tag, message, Pagination, Spin, Empty } from "antd";
import api from "../../services/api"; // Import the API service
import axios from "axios";

const { Meta } = Card;

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize] = useState(8);
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [currentPage, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login to access products");
        navigate("/");
        return;
      }

      // Direct axios call
      const response = await axios.get("/api/products", {
        params: {
          page: currentPage,
          pageSize,
          category,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        setProducts(response.data.products || []);
        setTotalProducts(response.data.total || 0);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      console.error("API Error:", {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url,
        data: error.response?.data,
      });

      if (error.response?.status === 401) {
        message.error("Session expired - please login again");
        navigate("/login");
      } else {
        message.warning("Showing demo products - please try again later");
        setMockProducts();
      }
    } finally {
      setLoading(false);
    }
  };

  const setMockProducts = () => {
    // Your mock product generation logic
    const mockProducts = [];
    for (let i = 1; i <= 8; i++) {
      mockProducts.push({
        id: i,
        name: `Product ${i}`,
        price: Math.floor(Math.random() * 1000) + 100,
        image: `/images/placeholder.jpg`,
        discount: i % 3 === 0 ? 10 : 0,
        requiresPrescription: i % 4 === 0,
        inStock: i % 5 !== 0,
        category: "Sample Category",
      });
    }
    setProducts(mockProducts);
    setTotalProducts(mockProducts.length);
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login to add items to cart");
        navigate("/login");
        return;
      }

      // Direct axios call
      const response = await axios.post(
        "/api/products/cart/add",
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        message.success(`${product.name} added to cart`);
      } else {
        throw new Error(response.data?.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Cart Error:", error);
      message.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">New Products</h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <Empty description="No products found" />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  hoverable
                  variant="borderless"
                  cover={
                    <img
                      alt={product.name}
                      src={product.image}
                      className="p-4 h-64 object-contain"
                      onError={(e) => {
                        e.target.src = "/images/default-product.jpg";
                      }}
                    />
                  }
                  actions={
                    product.requiresPrescription
                      ? [
                          <Link to={`/product/${product.id}`} key="see-more">
                            <Button type="primary" ghost>
                              See More
                            </Button>
                          </Link>,
                        ]
                      : [
                          <Button
                            key="add-to-cart"
                            type="primary"
                            ghost
                            disabled={!product.inStock}
                            onClick={() => handleAddToCart(product)}
                          >
                            Add to Cart
                          </Button>,
                          <Link to={`/product/${product.id}`} key="see-more">
                            <Button type="link">See More</Button>
                          </Link>,
                        ]
                  }
                >
                  <Meta
                    title={product.name}
                    description={
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-semibold text-blue-600">
                            Rs.{product.price.toFixed(2)}
                          </span>
                          {product.discount > 0 && (
                            <Tag color="red">{product.discount}% OFF</Tag>
                          )}
                        </div>
                        {product.requiresPrescription && (
                          <Tag color="orange" className="mr-0 mt-2">
                            Requires Prescription
                          </Tag>
                        )}
                        {!product.inStock && (
                          <Tag color="red" className="mr-0 mt-2">
                            Out of Stock
                          </Tag>
                        )}
                      </div>
                    }
                  />
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalProducts}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductListPage;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Card, Button, Tag, message, Pagination, Spin, Empty } from "antd";
// import axios from "axios";

// const { Meta } = Card;

// const ProductListPage = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [pageSize] = useState(8);
//   const [category, setCategory] = useState("all");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProducts();
//   }, [currentPage, category]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         message.error("Please login to access products");
//         navigate("/");
//         return;
//       }

//       // Debug info
//       console.log("Fetching products with params:", {
//         page: currentPage,
//         pageSize,
//         category,
//         token: token ? "Present" : "Missing",
//       });

//       // Try multiple possible endpoints to find the working one
//       let response;
//       try {
//         // First attempt - direct endpoint
//         console.log("Trying direct endpoint: /products");
//         response = await axios.get("/products", {
//           params: {
//             page: currentPage,
//             pageSize,
//             category,
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } catch (firstError) {
//         console.log("First endpoint failed:", firstError.message);

//         try {
//           // Second attempt - with /api prefix
//           console.log("Trying with /api prefix: /api/products");
//           response = await axios.get("/products", {
//             params: {
//               page: currentPage,
//               pageSize,
//               category,
//             },
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//         } catch (secondError) {
//           console.log("Second endpoint failed:", secondError.message);

//           // Third attempt - customer endpoint
//           console.log("Trying customer endpoint: /api/customer/products");
//           response = await axios.get("/customer/products", {
//             params: {
//               page: currentPage,
//               limit: pageSize, // Some APIs use limit instead of pageSize
//               category,
//             },
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//         }
//       }

//       console.log("API Response:", response.data);

//       // Handle different response formats
//       if (response.data) {
//         if (response.data.success && response.data.products) {
//           // Format 1: {success: true, products: [...], total: 10}
//           setProducts(response.data.products);
//           setTotalProducts(
//             response.data.total || response.data.products.length
//           );
//         } else if (Array.isArray(response.data)) {
//           // Format 2: Direct array of products
//           setProducts(response.data);
//           setTotalProducts(response.data.length);
//         } else if (response.data.data && Array.isArray(response.data.data)) {
//           // Format 3: {data: [...]}
//           setProducts(response.data.data);
//           setTotalProducts(response.data.total || response.data.data.length);
//         } else {
//           console.error("Unexpected API response format:", response.data);
//           throw new Error("Unexpected API response format");
//         }
//       } else {
//         throw new Error("No data returned from API");
//       }
//     } catch (error) {
//       console.error("API Error:", {
//         message: error.message,
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//         data: error.response?.data,
//         config: {
//           url: error.config?.url,
//           method: error.config?.method,
//           headers: error.config?.headers ? "Present" : "Missing",
//           params: error.config?.params,
//         },
//       });

//       if (error.response?.status === 401) {
//         message.error("Your session has expired. Please login again.");
//         navigate("/");
//       } else {
//         message.warning(
//           "Unable to load products from server - showing sample data"
//         );
//         setMockProducts();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setMockProducts = () => {
//     console.log("Loading mock products");
//     const mockProducts = [];
//     for (let i = 1; i <= 8; i++) {
//       mockProducts.push({
//         id: i,
//         name: `Sample Product ${i}`,
//         price: Math.floor(Math.random() * 1000) + 100,
//         image: `/placeholder/240/240`,
//         discount: i % 3 === 0 ? 10 : 0,
//         requiresPrescription: i % 4 === 0,
//         inStock: i % 5 !== 0,
//         category: "Sample Category",
//       });
//     }
//     setProducts(mockProducts);
//     setTotalProducts(mockProducts.length);
//   };

//   const handleAddToCart = async (product) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         message.error("Please login to add items to cart");
//         navigate("/");
//         return;
//       }

//       // Try multiple possible endpoints to find the working one
//       let response;
//       try {
//         // First attempt - direct endpoint
//         response = await axios.post(
//           "/cart/add",
//           {
//             productId: product.id,
//             quantity: 1,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       } catch (firstError) {
//         // Second attempt - with /api prefix
//         response = await axios.post(
//           "/cart/add",
//           {
//             productId: product.id,
//             quantity: 1,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       }

//       message.success(`${product.name} added to cart`);
//     } catch (error) {
//       console.error("Cart Error:", error);

//       // Handle different error cases with appropriate messages
//       if (error.response?.status === 400) {
//         if (error.response.data?.message?.includes("prescription")) {
//           message.warning("This product requires a prescription");
//         } else if (error.response.data?.message?.includes("stock")) {
//           message.error("Not enough stock available");
//         } else {
//           message.error(
//             error.response.data?.message || "Failed to add to cart"
//           );
//         }
//       } else {
//         message.error("Failed to add product to cart. Please try again later.");
//       }
//     }
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo(0, 0);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="flex-grow container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6">Products</h1>

//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <Spin size="large" />
//           </div>
//         ) : products.length === 0 ? (
//           <Empty description="No products found" />
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <Card
//                   key={product.id}
//                   hoverable
//                   variant="borderless"
//                   cover={
//                     <img
//                       alt={product.name}
//                       src={product.image || "/placeholder/240/240"}
//                       className="p-4 h-64 object-contain"
//                       onError={(e) => {
//                         e.target.src = "/placeholder/240/240";
//                       }}
//                     />
//                   }
//                   actions={
//                     product.requiresPrescription
//                       ? [
//                           <Link to={`/product/${product.id}`} key="see-more">
//                             <Button type="primary" ghost>
//                               See More
//                             </Button>
//                           </Link>,
//                         ]
//                       : [
//                           <Button
//                             key="add-to-cart"
//                             type="primary"
//                             ghost
//                             disabled={!product.inStock}
//                             onClick={() => handleAddToCart(product)}
//                           >
//                             Add to Cart
//                           </Button>,
//                           <Link to={`/product/${product.id}`} key="see-more">
//                             <Button type="link">See More</Button>
//                           </Link>,
//                         ]
//                   }
//                 >
//                   <Meta
//                     title={product.name}
//                     description={
//                       <div>
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-lg font-semibold text-blue-600">
//                             Rs.{product.price.toFixed(2)}
//                           </span>
//                           {product.discount > 0 && (
//                             <Tag color="red">{product.discount}% OFF</Tag>
//                           )}
//                         </div>
//                         {product.requiresPrescription && (
//                           <Tag color="orange" className="mr-0 mt-2">
//                             Requires Prescription
//                           </Tag>
//                         )}
//                         {!product.inStock && (
//                           <Tag color="red" className="mr-0 mt-2">
//                             Out of Stock
//                           </Tag>
//                         )}
//                       </div>
//                     }
//                   />
//                 </Card>
//               ))}
//             </div>

//             <div className="flex justify-center mt-8">
//               <Pagination
//                 current={currentPage}
//                 pageSize={pageSize}
//                 total={totalProducts}
//                 onChange={handlePageChange}
//                 showSizeChanger={false}
//               />
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ProductListPage;
