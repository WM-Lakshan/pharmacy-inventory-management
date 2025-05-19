// // import React, { useState, useEffect } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import {
// //   Carousel,
// //   Button,
// //   Row,
// //   Col,
// //   Card,
// //   Typography,
// //   Divider,
// //   Image,
// //   Tag,
// //   Spin,
// //   message,
// // } from "antd";
// // import {
// //   ArrowRightOutlined,
// //   ShoppingCartOutlined,
// //   FileTextOutlined,
// //   ClockCircleOutlined,
// //   CheckCircleOutlined,
// // } from "@ant-design/icons";
// // import axios from "axios";
// // import ProductCard from "../../components/customer/ProductCard";

// // const { Title, Paragraph } = Typography;
// // const { Meta } = Card;

// // const HomePage = () => {
// //   const [featuredProducts, setFeaturedProducts] = useState([]);
// //   const [topSellingProducts, setTopSellingProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     fetchProducts();
// //   }, []);

// //   const fetchProducts = async () => {
// //     setLoading(true);
// //     try {
// //       const token = localStorage.getItem("token");

// //       if (!token) {
// //         message.error("Please login to access products");
// //         navigate("/login");
// //         return;
// //       }

// //       // Create authenticated axios instance
// //       const authAxios = axios.create({
// //         baseURL: process.env.REACT_APP_API_BASE_URL,
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       // Make parallel requests
// //       const [featuredResponse, topSellingResponse] = await Promise.all([
// //         authAxios.get("/customer/products/featured"),
// //         authAxios.get("/customer/products/top-selling"),
// //       ]);

// //       setFeaturedProducts(featuredResponse.data?.products || []);
// //       setTopSellingProducts(topSellingResponse.data?.products || []);
// //     } catch (error) {
// //       console.error("API Error Details:", {
// //         status: error.response?.status,
// //         data: error.response?.data,
// //         headers: error.response?.headers,
// //       });

// //       if (error.response?.status === 403) {
// //         message.error("Your account doesn't have access to these products");
// //         // Check for specific permission messages from backend
// //         if (error.response?.data?.message?.includes("role")) {
// //           navigate("/upgrade-account");
// //         }
// //       } else {
// //         message.warning("Showing demo products - please try again later");
// //         setMockProducts();
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   const setMockProducts = () => {
// //     // Mock data with local placeholder images
// //     const mockFeatured = [];
// //     const mockTopSelling = [];

// //     // Generate 8 mock featured products
// //     for (let i = 1; i <= 8; i++) {
// //       const requiresPrescription = i % 5 === 0;
// //       const inStock = i % 8 !== 0;

// //       mockFeatured.push({
// //         id: i,
// //         name: `Featured Product ${i}`,
// //         price: Math.floor(Math.random() * 4800) + 200,
// //         image: `/placeholder-pharma-${i}.jpg`, // Local placeholder
// //         discount: i % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : 0,
// //         requiresPrescription,
// //         inStock,
// //       });
// //     }

// //     // Generate 8 mock top selling products
// //     for (let i = 9; i <= 16; i++) {
// //       const requiresPrescription = i % 5 === 0;
// //       const inStock = i % 8 !== 0;

// //       mockTopSelling.push({
// //         id: i,
// //         name: `Top Selling Product ${i - 8}`,
// //         price: Math.floor(Math.random() * 4800) + 200,
// //         image: `/placeholder-pharma-${i}.jpg`, // Local placeholder
// //         discount: i % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : 0,
// //         requiresPrescription,
// //         inStock,
// //       });
// //     }

// //     setFeaturedProducts(mockFeatured);
// //     setTopSellingProducts(mockTopSelling);
// //   };

// //   // Carousel content with local images
// //   const carouselItems = [
// //     {
// //       title: "Your Prescription for Affordable Health Solutions!",
// //       subtitle:
// //         "Discover trusted health products with exclusive discounts and unparalleled convenience. Your path to well-being starts here.",
// //       background: "bg-blue-600",
// //       image: "/hero-banner-1.jpg",
// //       buttonText: "Shop Now",
// //       buttonLink: "/products",
// //     },
// //     {
// //       title: "Quality Healthcare Products at Your Fingertips",
// //       subtitle:
// //         "Browse our wide selection of medicines and health essentials. Free delivery on orders over Rs.1000.",
// //       background: "bg-green-600",
// //       image: "/hero-banner-2.jpg",
// //       buttonText: "Explore",
// //       buttonLink: "/products",
// //     },
// //     {
// //       title: "Upload Your Prescription Easily",
// //       subtitle:
// //         "Get your medicines delivered to your doorstep with our simple prescription upload service.",
// //       background: "bg-purple-600",
// //       image: "/hero-banner-3.jpg",
// //       buttonText: "Upload Now",
// //       buttonLink: "/upload-prescription",
// //     },
// //   ];

// //   // Service features
// //   const features = [
// //     {
// //       icon: <FileTextOutlined style={{ fontSize: 36, color: "#1890ff" }} />,
// //       title: "Easy Prescription Upload",
// //       description:
// //         "Simply upload your prescription and we'll take care of the rest.",
// //     },
// //     {
// //       icon: <ShoppingCartOutlined style={{ fontSize: 36, color: "#52c41a" }} />,
// //       title: "Wide Product Range",
// //       description:
// //         "From medications to wellness products, find everything you need.",
// //     },
// //     {
// //       icon: <ClockCircleOutlined style={{ fontSize: 36, color: "#722ed1" }} />,
// //       title: "Quick Delivery",
// //       description:
// //         "Get your medicines delivered to your doorstep within 24 hours.",
// //     },
// //     {
// //       icon: <CheckCircleOutlined style={{ fontSize: 36, color: "#fa8c16" }} />,
// //       title: "Quality Assurance",
// //       description: "All our products are sourced from authorized distributors.",
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen flex flex-col">
// //       <main className="flex-grow">
// //         {/* Hero Carousel */}
// //         <Carousel autoplay className="mb-10">
// //           {carouselItems.map((item, index) => (
// //             <div key={index}>
// //               <div className={`px-4 py-16 ${item.background}`}>
// //                 <div className="container mx-auto flex flex-col md:flex-row items-center">
// //                   <div className="md:w-1/2 text-white mb-8 md:mb-0 md:pr-8">
// //                     <h1 className="text-3xl md:text-5xl font-bold mb-4">
// //                       {item.title}
// //                     </h1>
// //                     <p className="text-lg mb-6">{item.subtitle}</p>
// //                     <Link to={item.buttonLink}>
// //                       <Button type="default" size="large">
// //                         {item.buttonText}
// //                       </Button>
// //                     </Link>
// //                   </div>
// //                   <div className="md:w-1/2">
// //                     <img
// //                       src={item.image}
// //                       alt="Hero"
// //                       className="w-full rounded-lg shadow-lg"
// //                       onError={(e) => {
// //                         e.target.src = "/default-banner.jpg";
// //                       }}
// //                     />
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </Carousel>

// //         {/* Features Section */}
// //         <section className="py-12 bg-gray-50">
// //           <div className="container mx-auto px-4">
// //             <Title level={2} className="text-center mb-12">
// //               Why Choose L.W.Pharmacy
// //             </Title>

// //             <Row gutter={[24, 24]}>
// //               {features.map((feature, index) => (
// //                 <Col xs={24} sm={12} md={6} key={index}>
// //                   <Card
// //                     className="h-full text-center hover:shadow-md transition-shadow"
// //                     bordered={false}
// //                   >
// //                     <div className="text-center mb-4">{feature.icon}</div>
// //                     <Title level={4}>{feature.title}</Title>
// //                     <Paragraph className="text-gray-600">
// //                       {feature.description}
// //                     </Paragraph>
// //                   </Card>
// //                 </Col>
// //               ))}
// //             </Row>
// //           </div>
// //         </section>

// //         {/* Featured Products */}
// //         <section className="py-12">
// //           <div className="container mx-auto px-4">
// //             <div className="flex justify-between items-center mb-8">
// //               <Title level={2}>Featured Products</Title>
// //               <Link to="/products">
// //                 <Button type="link" className="text-blue-600">
// //                   View all <ArrowRightOutlined />
// //                 </Button>
// //               </Link>
// //             </div>

// //             {loading ? (
// //               <div className="flex justify-center py-12">
// //                 <Spin size="large" />
// //               </div>
// //             ) : (
// //               <Row gutter={[16, 24]}>
// //                 {featuredProducts.slice(0, 4).map((product) => (
// //                   <Col xs={24} sm={12} md={6} key={product.id}>
// //                     <ProductCard product={product} />
// //                   </Col>
// //                 ))}
// //               </Row>
// //             )}
// //           </div>
// //         </section>

// //         {/* Promotion Banner */}
// //         <section className="bg-blue-600 text-white py-10">
// //           <div className="container mx-auto px-4">
// //             <Row gutter={24} align="middle">
// //               <Col xs={24} md={16}>
// //                 <Title level={2} className="text-white mb-2">
// //                   Upload Your Prescription
// //                 </Title>
// //                 <Paragraph className="text-white text-lg">
// //                   Upload your prescription and get your medicines delivered to
// //                   your doorstep. It's that simple!
// //                 </Paragraph>
// //                 <Link to="/upload-prescription">
// //                   <Button size="large" className="mt-4">
// //                     Upload Now
// //                   </Button>
// //                 </Link>
// //               </Col>
// //               <Col xs={24} md={8} className="mt-6 md:mt-0">
// //                 <Image
// //                   src="/prescription-upload.jpg"
// //                   alt="Upload Prescription"
// //                   className="rounded-lg"
// //                   preview={false}
// //                   onError={(e) => {
// //                     e.target.src = "/default-prescription.jpg";
// //                   }}
// //                 />
// //               </Col>
// //             </Row>
// //           </div>
// //         </section>

// //         {/* Top Selling Products */}
// //         <section className="py-12">
// //           <div className="container mx-auto px-4">
// //             <div className="flex justify-between items-center mb-8">
// //               <Title level={2}>Top Selling Products</Title>
// //               <Link to="/products">
// //                 <Button type="link" className="text-blue-600">
// //                   View all <ArrowRightOutlined />
// //                 </Button>
// //               </Link>
// //             </div>

// //             {loading ? (
// //               <div className="flex justify-center py-12">
// //                 <Spin size="large" />
// //               </div>
// //             ) : (
// //               <Row gutter={[16, 24]}>
// //                 {topSellingProducts.slice(0, 4).map((product) => (
// //                   <Col xs={24} sm={12} md={6} key={product.id}>
// //                     <ProductCard product={product} />
// //                   </Col>
// //                 ))}
// //               </Row>
// //             )}
// //           </div>
// //         </section>

// //         {/* Customer Testimonials Section */}
// //         <section className="py-12 bg-gray-50">
// //           <div className="container mx-auto px-4">
// //             <Title level={2} className="text-center mb-12">
// //               What Our Customers Say
// //             </Title>

// //             <Row gutter={[24, 24]}>
// //               {[
// //                 {
// //                   name: "Saman Perera",
// //                   comment:
// //                     "The prescription upload feature saved me a lot of time. Delivery was prompt and efficient!",
// //                   rating: 5,
// //                 },
// //                 {
// //                   name: "Nimal Fernando",
// //                   comment:
// //                     "Very reliable service with quality products. The website is easy to navigate and the process is smooth.",
// //                   rating: 4,
// //                 },
// //                 {
// //                   name: "Kamala Silva",
// //                   comment:
// //                     "I appreciate the wide range of products and competitive prices. Customer service is excellent too.",
// //                   rating: 5,
// //                 },
// //               ].map((testimonial, index) => (
// //                 <Col xs={24} sm={8} key={index}>
// //                   <Card className="h-full">
// //                     <div className="text-yellow-400 text-xl mb-4">
// //                       {"★".repeat(testimonial.rating)}
// //                       {"☆".repeat(5 - testimonial.rating)}
// //                     </div>
// //                     <Paragraph className="italic mb-4">
// //                       "{testimonial.comment}"
// //                     </Paragraph>
// //                     <div className="font-medium">{testimonial.name}</div>
// //                   </Card>
// //                 </Col>
// //               ))}
// //             </Row>
// //           </div>
// //         </section>

// //         {/* Info Cards Section */}
// //         <section className="py-12">
// //           <div className="container mx-auto px-4">
// //             <Row gutter={[24, 24]}>
// //               <Col xs={24} md={8}>
// //                 <Card
// //                   className="h-full hover:shadow-md transition-shadow"
// //                   cover={
// //                     <img
// //                       alt="Delivery"
// //                       src="/delivery-service.jpg"
// //                       onError={(e) => {
// //                         e.target.src = "/default-delivery.jpg";
// //                       }}
// //                     />
// //                   }
// //                 >
// //                   <Meta
// //                     title="Fast Delivery"
// //                     description="Get your medicines delivered to your doorstep within 24 hours."
// //                   />
// //                 </Card>
// //               </Col>
// //               <Col xs={24} md={8}>
// //                 <Card
// //                   className="h-full hover:shadow-md transition-shadow"
// //                   cover={
// //                     <img
// //                       alt="Genuine Products"
// //                       src="/genuine-products.jpg"
// //                       onError={(e) => {
// //                         e.target.src = "/default-products.jpg";
// //                       }}
// //                     />
// //                   }
// //                 >
// //                   <Meta
// //                     title="Genuine Products"
// //                     description="All our products are sourced from authorized distributors."
// //                   />
// //                 </Card>
// //               </Col>
// //               <Col xs={24} md={8}>
// //                 <Card
// //                   className="h-full hover:shadow-md transition-shadow"
// //                   cover={
// //                     <img
// //                       alt="Secure Payment"
// //                       src="/secure-payment.jpg"
// //                       onError={(e) => {
// //                         e.target.src = "/default-payment.jpg";
// //                       }}
// //                     />
// //                   }
// //                 >
// //                   <Meta
// //                     title="Secure Payment"
// //                     description="Multiple payment options with secure checkout."
// //                   />
// //                 </Card>
// //               </Col>
// //             </Row>
// //           </div>
// //         </section>
// //       </main>
// //     </div>
// //   );
// // };

// // export default HomePage;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Carousel,
//   Button,
//   Row,
//   Col,
//   Card,
//   Typography,
//   Divider,
//   Image,
//   Tag,
//   Spin,
//   message,
// } from "antd";
// import {
//   ArrowRightOutlined,
//   ShoppingCartOutlined,
//   FileTextOutlined,
//   ClockCircleOutlined,
//   CheckCircleOutlined,
// } from "@ant-design/icons";
// import axios from "axios";
// import ProductCard from "../../components/customer/ProductCard";
// // Import Header and Footer components if needed
// // import Header from "../../components/customer/Header";
// // import Footer from "../../components/customer/Footer";

// const { Title, Paragraph } = Typography;
// const { Meta } = Card;

// const HomePage = () => {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [topSellingProducts, setTopSellingProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       // Check for token
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.log("No token found, redirecting to login");
//         message.error("Please login to access products");
//         navigate("/");
//         return;
//       }

//       // Try to fetch products from API
//       try {
//         const featuredResponse = await axios.get(
//           "/api/customers/products/featured",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const topSellingResponse = await axios.get(
//           "/api/customers/products/top-selling",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (featuredResponse.data?.products) {
//           setFeaturedProducts(featuredResponse.data.products);
//         }

//         if (topSellingResponse.data?.products) {
//           setTopSellingProducts(topSellingResponse.data.products);
//         }
//       } catch (error) {
//         console.error("API Error:", error);
//         // Fall back to mock data
//         setMockProducts();
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setMockProducts();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setMockProducts = () => {
//     console.log("Using mock product data");
//     // Mock data with local placeholder images
//     const mockFeatured = [];
//     const mockTopSelling = [];

//     // Generate 8 mock featured products
//     for (let i = 1; i <= 8; i++) {
//       const requiresPrescription = i % 5 === 0;
//       const inStock = i % 8 !== 0;

//       mockFeatured.push({
//         id: i,
//         name: `Featured Product ${i}`,
//         price: Math.floor(Math.random() * 4800) + 200,
//         image: `/api/placeholder/240/240`, // Using placeholder API
//         discount: i % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : 0,
//         requiresPrescription,
//         inStock,
//       });
//     }

//     // Generate 8 mock top selling products
//     for (let i = 9; i <= 16; i++) {
//       const requiresPrescription = i % 5 === 0;
//       const inStock = i % 8 !== 0;

//       mockTopSelling.push({
//         id: i,
//         name: `Top Selling Product ${i - 8}`,
//         price: Math.floor(Math.random() * 4800) + 200,
//         image: `/api/placeholder/240/240`, // Using placeholder API
//         discount: i % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : 0,
//         requiresPrescription,
//         inStock,
//       });
//     }

//     setFeaturedProducts(mockFeatured);
//     setTopSellingProducts(mockTopSelling);
//   };

//   // Carousel content with local images
//   const carouselItems = [
//     {
//       title: "Your Prescription for Affordable Health Solutions!",
//       subtitle:
//         "Discover trusted health products with exclusive discounts and unparalleled convenience. Your path to well-being starts here.",
//       background: "bg-blue-600",
//       image: "/api/placeholder/1200/400", // Fallback to placeholder
//       buttonText: "Shop Now",
//       buttonLink: "/products",
//     },
//     {
//       title: "Quality Healthcare Products at Your Fingertips",
//       subtitle:
//         "Browse our wide selection of medicines and health essentials. Free delivery on orders over Rs.1000.",
//       background: "bg-green-600",
//       image: "/api/placeholder/1200/400", // Fallback to placeholder
//       buttonText: "Explore",
//       buttonLink: "/products",
//     },
//     {
//       title: "Upload Your Prescription Easily",
//       subtitle:
//         "Get your medicines delivered to your doorstep with our simple prescription upload service.",
//       background: "bg-purple-600",
//       image: "/api/placeholder/1200/400", // Fallback to placeholder
//       buttonText: "Upload Now",
//       buttonLink: "/upload-prescription",
//     },
//   ];

//   // Service features
//   const features = [
//     {
//       icon: <FileTextOutlined style={{ fontSize: 36, color: "#1890ff" }} />,
//       title: "Easy Prescription Upload",
//       description:
//         "Simply upload your prescription and we'll take care of the rest.",
//     },
//     {
//       icon: <ShoppingCartOutlined style={{ fontSize: 36, color: "#52c41a" }} />,
//       title: "Wide Product Range",
//       description:
//         "From medications to wellness products, find everything you need.",
//     },
//     {
//       icon: <ClockCircleOutlined style={{ fontSize: 36, color: "#722ed1" }} />,
//       title: "Quick Delivery",
//       description:
//         "Get your medicines delivered to your doorstep within 24 hours.",
//     },
//     {
//       icon: <CheckCircleOutlined style={{ fontSize: 36, color: "#fa8c16" }} />,
//       title: "Quality Assurance",
//       description: "All our products are sourced from authorized distributors.",
//     },
//   ];

//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="flex-grow">
//         {/* Hero Carousel */}
//         <Carousel autoplay className="mb-10">
//           {carouselItems.map((item, index) => (
//             <div key={index}>
//               <div className={`px-4 py-16 ${item.background}`}>
//                 <div className="container mx-auto flex flex-col md:flex-row items-center">
//                   <div className="md:w-1/2 text-white mb-8 md:mb-0 md:pr-8">
//                     <h1 className="text-3xl md:text-5xl font-bold mb-4">
//                       {item.title}
//                     </h1>
//                     <p className="text-lg mb-6">{item.subtitle}</p>
//                     <Link to={item.buttonLink}>
//                       <Button type="default" size="large">
//                         {item.buttonText}
//                       </Button>
//                     </Link>
//                   </div>
//                   <div className="md:w-1/2">
//                     <img
//                       src={item.image}
//                       alt="Hero"
//                       className="w-full rounded-lg shadow-lg"
//                       onError={(e) => {
//                         e.target.src = "/api/placeholder/1200/400";
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </Carousel>

//         {/* Features Section */}
//         <section className="py-12 bg-gray-50">
//           <div className="container mx-auto px-4">
//             <Title level={2} className="text-center mb-12">
//               Why Choose L.W.Pharmacy
//             </Title>

//             <Row gutter={[24, 24]}>
//               {features.map((feature, index) => (
//                 <Col xs={24} sm={12} md={6} key={index}>
//                   <Card
//                     className="h-full text-center hover:shadow-md transition-shadow"
//                     variant="borderless"
//                   >
//                     <div className="text-center mb-4">{feature.icon}</div>
//                     <Title level={4}>{feature.title}</Title>
//                     <Paragraph className="text-gray-600">
//                       {feature.description}
//                     </Paragraph>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//           </div>
//         </section>

//         {/* Featured Products */}
//         <section className="py-12">
//           <div className="container mx-auto px-4">
//             <div className="flex justify-between items-center mb-8">
//               <Title level={2}>Featured Products</Title>
//               <Link to="/products">
//                 <Button type="link" className="text-blue-600">
//                   View all <ArrowRightOutlined />
//                 </Button>
//               </Link>
//             </div>

//             {loading ? (
//               <div className="flex justify-center py-12">
//                 <Spin size="large" />
//               </div>
//             ) : (
//               <Row gutter={[16, 24]}>
//                 {featuredProducts.slice(0, 4).map((product) => (
//                   <Col xs={24} sm={12} md={6} key={product.id}>
//                     <ProductCard product={product} />
//                   </Col>
//                 ))}
//               </Row>
//             )}
//           </div>
//         </section>

//         {/* Promotion Banner */}
//         <section className="bg-blue-600 text-white py-10">
//           <div className="container mx-auto px-4">
//             <Row gutter={24} align="middle">
//               <Col xs={24} md={16}>
//                 <Title level={2} className="text-white mb-2">
//                   Upload Your Prescription
//                 </Title>
//                 <Paragraph className="text-white text-lg">
//                   Upload your prescription and get your medicines delivered to
//                   your doorstep. It's that simple!
//                 </Paragraph>
//                 <Link to="/upload-prescription">
//                   <Button size="large" className="mt-4">
//                     Upload Now
//                   </Button>
//                 </Link>
//               </Col>
//               <Col xs={24} md={8} className="mt-6 md:mt-0">
//                 <Image
//                   src="/api/placeholder/400/300"
//                   alt="Upload Prescription"
//                   className="rounded-lg"
//                   preview={false}
//                 />
//               </Col>
//             </Row>
//           </div>
//         </section>

//         {/* Top Selling Products */}
//         <section className="py-12">
//           <div className="container mx-auto px-4">
//             <div className="flex justify-between items-center mb-8">
//               <Title level={2}>Top Selling Products</Title>
//               <Link to="/products">
//                 <Button type="link" className="text-blue-600">
//                   View all <ArrowRightOutlined />
//                 </Button>
//               </Link>
//             </div>

//             {loading ? (
//               <div className="flex justify-center py-12">
//                 <Spin size="large" />
//               </div>
//             ) : (
//               <Row gutter={[16, 24]}>
//                 {topSellingProducts.slice(0, 4).map((product) => (
//                   <Col xs={24} sm={12} md={6} key={product.id}>
//                     <ProductCard product={product} />
//                   </Col>
//                 ))}
//               </Row>
//             )}
//           </div>
//         </section>

//         {/* Customer Testimonials Section */}
//         <section className="py-12 bg-gray-50">
//           <div className="container mx-auto px-4">
//             <Title level={2} className="text-center mb-12">
//               What Our Customers Say
//             </Title>

//             <Row gutter={[24, 24]}>
//               {[
//                 {
//                   name: "Saman Perera",
//                   comment:
//                     "The prescription upload feature saved me a lot of time. Delivery was prompt and efficient!",
//                   rating: 5,
//                 },
//                 {
//                   name: "Nimal Fernando",
//                   comment:
//                     "Very reliable service with quality products. The website is easy to navigate and the process is smooth.",
//                   rating: 4,
//                 },
//                 {
//                   name: "Kamala Silva",
//                   comment:
//                     "I appreciate the wide range of products and competitive prices. Customer service is excellent too.",
//                   rating: 5,
//                 },
//               ].map((testimonial, index) => (
//                 <Col xs={24} sm={8} key={index}>
//                   <Card className="h-full" variant="outlined">
//                     <div className="text-yellow-400 text-xl mb-4">
//                       {"★".repeat(testimonial.rating)}
//                       {"☆".repeat(5 - testimonial.rating)}
//                     </div>
//                     <Paragraph className="italic mb-4">
//                       "{testimonial.comment}"
//                     </Paragraph>
//                     <div className="font-medium">{testimonial.name}</div>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//           </div>
//         </section>

//         {/* Info Cards Section */}
//         <section className="py-12">
//           <div className="container mx-auto px-4">
//             <Row gutter={[24, 24]}>
//               <Col xs={24} md={8}>
//                 <Card
//                   className="h-full hover:shadow-md transition-shadow"
//                   variant="outlined"
//                   cover={
//                     <img
//                       alt="Delivery"
//                       src="/api/placeholder/400/200"
//                       onError={(e) => {
//                         e.target.src = "/api/placeholder/400/200";
//                       }}
//                     />
//                   }
//                 >
//                   <Meta
//                     title="Fast Delivery"
//                     description="Get your medicines delivered to your doorstep within 24 hours."
//                   />
//                 </Card>
//               </Col>
//               <Col xs={24} md={8}>
//                 <Card
//                   className="h-full hover:shadow-md transition-shadow"
//                   variant="outlined"
//                   cover={
//                     <img
//                       alt="Genuine Products"
//                       src="/api/placeholder/400/200"
//                       onError={(e) => {
//                         e.target.src = "/api/placeholder/400/200";
//                       }}
//                     />
//                   }
//                 >
//                   <Meta
//                     title="Genuine Products"
//                     description="All our products are sourced from authorized distributors."
//                   />
//                 </Card>
//               </Col>
//               <Col xs={24} md={8}>
//                 <Card
//                   className="h-full hover:shadow-md transition-shadow"
//                   variant="outlined"
//                   cover={
//                     <img
//                       alt="Secure Payment"
//                       src="/api/placeholder/400/200"
//                       onError={(e) => {
//                         e.target.src = "/api/placeholder/400/200";
//                       }}
//                     />
//                   }
//                 >
//                   <Meta
//                     title="Secure Payment"
//                     description="Multiple payment options with secure checkout."
//                   />
//                 </Card>
//               </Col>
//             </Row>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default HomePage;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Carousel,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Image,
  Tag,
  Spin,
  message,
} from "antd";
import {
  ArrowRightOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ProductCard from "../../components/customer/ProductCard";
// Import Header and Footer components if needed
// import Header from "../../components/customer/Header";
// import Footer from "../../components/customer/Footer";

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Check for token
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        message.error("Please login to access products");
        navigate("/");
        return;
      }

      // Try to fetch products from API
      try {
        const featuredResponse = await axios.get(
          "/api/landing/featured-products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const topSellingResponse = await axios.get(
          "/api/landing/top-selling",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (featuredResponse.data?.products) {
          setFeaturedProducts(featuredResponse.data.products);
        }

        if (topSellingResponse.data?.products) {
          setTopSellingProducts(topSellingResponse.data.products);
        }
      } catch (error) {
        console.error("API Error:", error);
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again later.');
        // Fall back to mock data
        setMockProducts();
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setMockProducts();
    } finally {
      setLoading(false);
    }
  };

  const setMockProducts = () => {
    console.log("Using mock product data");
    // Mock data with local placeholder images
    const mockFeatured = [];
    const mockTopSelling = [];

    // Generate 8 mock featured products
    for (let i = 1; i <= 8; i++) {
      const requiresPrescription = i % 5 === 0;
      const inStock = i % 8 !== 0;

      mockFeatured.push({
        id: i,
        name: `Featured Product ${i}`,
        price: Math.floor(Math.random() * 4800) + 200,
        image: `https://placehold.co/240x240?text=Product+${i}`, // Using external placeholder service
        discount: i % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : 0,
        requiresPrescription,
        inStock,
      });
    }

    // Generate 8 mock top selling products
    for (let i = 9; i <= 16; i++) {
      const requiresPrescription = i % 5 === 0;
      const inStock = i % 8 !== 0;

      mockTopSelling.push({
        id: i,
        name: `Top Selling Product ${i - 8}`,
        price: Math.floor(Math.random() * 4800) + 200,
        image: `/api/placeholder/240/240`, // Using placeholder API
        discount: i % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : 0,
        requiresPrescription,
        inStock,
      });
    }

    setFeaturedProducts(mockFeatured);
    setTopSellingProducts(mockTopSelling);
  };

  // Carousel content with local images
  const carouselItems = [
    {
      title: "Your Prescription for Affordable Health Solutions!",
      subtitle:
        "Discover trusted health products with exclusive discounts and unparalleled convenience. Your path to well-being starts here.",
      background: "bg-blue-600",
      image: "https://placehold.co/1200x400?text=L.W.Pharmacy", // Using external placeholder service
      buttonText: "Shop Now",
      buttonLink: "/products",
    },
    {
      title: "Quality Healthcare Products at Your Fingertips",
      subtitle:
        "Browse our wide selection of medicines and health essentials. Free delivery on orders over Rs.1000.",
      background: "bg-green-600",
      image: "/api/placeholder/1200/400", // Fallback to placeholder
      buttonText: "Explore",
      buttonLink: "/products",
    },
    {
      title: "Upload Your Prescription Easily",
      subtitle:
        "Get your medicines delivered to your doorstep with our simple prescription upload service.",
      background: "bg-purple-600",
      image: "/api/placeholder/1200/400", // Fallback to placeholder
      buttonText: "Upload Now",
      buttonLink: "/upload-prescription",
    },
  ];

  // Service features
  const features = [
    {
      icon: <FileTextOutlined style={{ fontSize: 36, color: "#1890ff" }} />,
      title: "Easy Prescription Upload",
      description:
        "Simply upload your prescription and we'll take care of the rest.",
    },
    {
      icon: <ShoppingCartOutlined style={{ fontSize: 36, color: "#52c41a" }} />,
      title: "Wide Product Range",
      description:
        "From medications to wellness products, find everything you need.",
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: 36, color: "#722ed1" }} />,
      title: "Quick Delivery",
      description:
        "Get your medicines delivered to your doorstep within 24 hours.",
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: 36, color: "#fa8c16" }} />,
      title: "Quality Assurance",
      description: "All our products are sourced from authorized distributors.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Carousel */}
        <Carousel autoplay className="mb-10">
          {carouselItems.map((item, index) => (
            <div key={index}>
              <div className={`px-4 py-16 ${item.background}`}>
                <div className="container mx-auto flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 text-white mb-8 md:mb-0 md:pr-8">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                      {item.title}
                    </h1>
                    <p className="text-lg mb-6">{item.subtitle}</p>
                    <Link to={item.buttonLink}>
                      <Button type="default" size="large">
                        {item.buttonText}
                      </Button>
                    </Link>
                  </div>
                  <div className="md:w-1/2">
                    <img
                      src={item.image}
                      alt="Hero"
                      className="w-full rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/1200x400?text=L.W.Pharmacy";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        {/* Features Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <Title level={2} className="text-center mb-12">
              Why Choose L.W.Pharmacy
            </Title>

            <Row gutter={[24, 24]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <Card
                    className="h-full text-center hover:shadow-md transition-shadow"
                    variant="borderless"
                  >
                    <div className="text-center mb-4">{feature.icon}</div>
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph className="text-gray-600">
                      {feature.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <Title level={2}>Featured Products</Title>
              <Link to="/products">
                <Button type="link" className="text-blue-600">
                  View all <ArrowRightOutlined />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={[16, 24]}>
                {featuredProducts.slice(0, 4).map((product) => (
                  <Col xs={24} sm={12} md={6} key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </section>

        {/* Promotion Banner */}
        <section className="bg-blue-600 text-white py-10">
          <div className="container mx-auto px-4">
            <Row gutter={24} align="middle">
              <Col xs={24} md={16}>
                <Title level={2} className="text-white mb-2">
                  Upload Your Prescription
                </Title>
                <Paragraph className="text-white text-lg">
                  Upload your prescription and get your medicines delivered to
                  your doorstep. It's that simple!
                </Paragraph>
                <Link to="/upload-prescription">
                  <Button size="large" className="mt-4">
                    Upload Now
                  </Button>
                </Link>
              </Col>
              <Col xs={24} md={8} className="mt-6 md:mt-0">
                <Image
                  src="https://placehold.co/400x300?text=Upload+Prescription"
                  alt="Upload Prescription"
                  className="rounded-lg"
                  preview={false}
                />
              </Col>
            </Row>
          </div>
        </section>

        {/* Top Selling Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <Title level={2}>Top Selling Products</Title>
              <Link to="/products">
                <Button type="link" className="text-blue-600">
                  View all <ArrowRightOutlined />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={[16, 24]}>
                {topSellingProducts.slice(0, 4).map((product) => (
                  <Col xs={24} sm={12} md={6} key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </section>

        {/* Customer Testimonials Section */}
        <section className="py-12 bg-gray-50">
          {/* <div className="container mx-auto px-4">
            <Title level={2} className="text-center mb-12">
              What Our Customers Say
            </Title>

            <Row gutter={[24, 24]}>
              {[
                {
                  name: "Saman Perera",
                  comment:
                    "The prescription upload feature saved me a lot of time. Delivery was prompt and efficient!",
                  rating: 5,
                },
                {
                  name: "Nimal Fernando",
                  comment:
                    "Very reliable service with quality products. The website is easy to navigate and the process is smooth.",
                  rating: 4,
                },
                {
                  name: "Kamala Silva",
                  comment:
                    "I appreciate the wide range of products and competitive prices. Customer service is excellent too.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card className="h-full" variant="outlined">
                    <div className="text-yellow-400 text-xl mb-4">
                      {"★".repeat(testimonial.rating)}
                      {"☆".repeat(5 - testimonial.rating)}
                    </div>
                    <Paragraph className="italic mb-4">
                      "{testimonial.comment}"
                    </Paragraph>
                    <div className="font-medium">{testimonial.name}</div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div> */}
        </section>

        {/* Info Cards Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card
                  className="h-full hover:shadow-md transition-shadow"
                  variant="outlined"
                  cover={
                    <img
                      alt="Delivery"
                      src="https://placehold.co/400x200?text=Fast+Delivery"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/400x200?text=Fast+Delivery";
                      }}
                    />
                  }
                >
                  <Meta
                    title="Fast Delivery"
                    description="Get your medicines delivered to your doorstep within 24 hours."
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card
                  className="h-full hover:shadow-md transition-shadow"
                  variant="outlined"
                  cover={
                    <img
                      alt="Genuine Products"
                      src="https://placehold.co/400x200?text=Genuine+Products"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/400x200?text=Genuine+Products";
                      }}
                    />
                  }
                >
                  <Meta
                    title="Genuine Products"
                    description="All our products are sourced from authorized distributors."
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card
                  className="h-full hover:shadow-md transition-shadow"
                  variant="outlined"
                  cover={
                    <img
                      alt="Secure Payment"
                      src="https://placehold.co/400x200?text=Secure+Payment"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/400x200?text=Secure+Payment";
                      }}
                    />
                  }
                >
                  <Meta
                    title="Secure Payment"
                    description="Multiple payment options with secure checkout."
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
