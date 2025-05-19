// // import React, { useState, useEffect } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import {
// //   Steps,
// //   Card,
// //   Form,
// //   Input,
// //   Select,
// //   Radio,
// //   Button,
// //   Divider,
// //   message,
// //   Spin,
// //   Result,
// //   List,
// //   Typography,
// //   Tag,
// //   Space,
// // } from "antd";
// // import {
// //   CreditCardOutlined,
// //   HomeOutlined,
// //   ShopOutlined,
// //   CheckCircleOutlined,
// //   DollarOutlined,
// //   ArrowLeftOutlined,
// // } from "@ant-design/icons";
// // import axios from "axios";

// // const { Step } = Steps;
// // const { Option } = Select;
// // const { Title, Text } = Typography;

// // const CheckoutPage = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [form] = Form.useForm();

// //   // Extract data from location state
// //   const {
// //     prescriptionId,
// //     products = [],
// //     source = "cart", // 'prescription', 'product', 'cart'
// //     deliveryMethod: initialDeliveryMethod = "Order Pickup",
// //     productId,
// //     quantity: initialQuantity = 1,
// //   } = location.state || {};

// //   // Component state
// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [deliveryMethod, setDeliveryMethod] = useState(initialDeliveryMethod);
// //   const [paymentMethod, setPaymentMethod] = useState("creditCard");
// //   const [loading, setLoading] = useState(false);
// //   const [orderCompleted, setOrderCompleted] = useState(false);
// //   const [orderId, setOrderId] = useState(null);
// //   const [orderItems, setOrderItems] = useState(products || []);
// //   const [shippingFee, setShippingFee] = useState(0);
// //   const [processingPayment, setProcessingPayment] = useState(false);
// //   const [errorMessage, setErrorMessage] = useState("");

// //   // Calculate totals
// //   const subtotal = orderItems.reduce(
// //     (sum, item) => sum + item.price * item.quantity,
// //     0
// //   );
// //   const total = subtotal + shippingFee;

// //   useEffect(() => {
// //     // Set shipping fee based on delivery method
// //     if (deliveryMethod === "Deliver") {
// //       setShippingFee(300);
// //     } else {
// //       setShippingFee(0);
// //     }

// //     // Initialize page based on source
// //     initializeCheckout();
// //   }, [deliveryMethod]);

// //   const initializeCheckout = async () => {
// //     setLoading(true);
// //     try {
// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         message.error("Please login to continue checkout");
// //         navigate("/");
// //         return;
// //       }

// //       // Handle different sources
// //       if (source === "prescription" && prescriptionId) {
// //         await fetchPrescriptionDetails(prescriptionId);
// //       } else if (source === "product" && productId) {
// //         await fetchProductDetails(productId, initialQuantity);
// //       } else if (source === "cart") {
// //         await fetchCartItems();
// //       } else {
// //         message.error("Invalid checkout source");
// //         navigate(-1);
// //       }
// //     } catch (error) {
// //       console.error("Error initializing checkout:", error);
// //       message.error("Failed to initialize checkout. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchPrescriptionDetails = async (id) => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       const response = await axios.get(
// //         `/api/customer-prescriptions/prescriptions/${id}/products`,
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );

// //       if (response.data.success && response.data.products) {
// //         setOrderItems(response.data.products);
// //       } else {
// //         throw new Error("Failed to load prescription products");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching prescription details:", error);
// //       message.error("Failed to load prescription items");
// //       // For development, set mock data
// //       setMockPrescriptionProducts();
// //     }
// //   };

// //   const fetchProductDetails = async (id, qty) => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       const response = await axios.get(`/api/productsDetails/${id}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (response.data && response.data.product) {
// //         const product = response.data.product;
// //         setOrderItems([
// //           {
// //             id: product.id,
// //             name: product.name,
// //             price: product.price,
// //             quantity: qty,
// //             image: product.image,
// //           },
// //         ]);
// //       } else {
// //         throw new Error("Failed to load product details");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching product:", error);
// //       message.error("Failed to load product details");
// //       // For development, set mock data
// //       setMockSingleProduct(id, qty);
// //     }
// //   };

// //   const fetchCartItems = async () => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       const response = await axios.get("/api/cart", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (response.data && response.data.items) {
// //         setOrderItems(response.data.items);
// //       } else {
// //         throw new Error("Failed to load cart items");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching cart:", error);
// //       message.error("Failed to load cart items");
// //       // For development, set mock data
// //       setMockCartItems();
// //     }
// //   };

// //   // Fix image placeholders using an absolute URL placeholder service
// //   const getImagePlaceholder = (width, height) => {
// //     // Use an external placeholder service that is guaranteed to work
// //     return `https://placehold.co/${width}x${height}`;
// //   };

// //   const setMockPrescriptionProducts = () => {
// //     setOrderItems([
// //       { id: 101, name: "Panadol", quantity: 10, price: 45, total: 450 },
// //       { id: 102, name: "Amoxicillin", quantity: 5, price: 120, total: 600 },
// //       { id: 103, name: "Vitamin C", quantity: 2, price: 80, total: 160 },
// //     ]);
// //   };

// //   const setMockSingleProduct = (id, qty) => {
// //     setOrderItems([
// //       {
// //         id: id,
// //         name: `Product ${id}`,
// //         price: 250,
// //         quantity: qty,
// //         image: getImagePlaceholder(400, 320),
// //       },
// //     ]);
// //   };

// //   const setMockCartItems = () => {
// //     setOrderItems([
// //       {
// //         id: 1,
// //         name: "Samahan",
// //         quantity: 2,
// //         price: 40,
// //         total: 80,
// //         image: getImagePlaceholder(80, 80),
// //       },
// //       {
// //         id: 2,
// //         name: "Yakipeyana",
// //         quantity: 1,
// //         price: 50,
// //         total: 50,
// //         image: getImagePlaceholder(80, 80),
// //       },
// //     ]);
// //   };

// //   const handleDeliveryMethodChange = (value) => {
// //     setDeliveryMethod(value);
// //     // Update form fields validation
// //     if (value === "Deliver") {
// //       form.validateFields(["deliveryAddress"]);
// //     }
// //   };

// //   const handlePaymentMethodChange = (value) => {
// //     setPaymentMethod(value);
// //   };

// //   const handleNext = async () => {
// //     try {
// //       // Validate form fields for current step
// //       await form.validateFields();

// //       if (currentStep === 0) {
// //         // Move to payment step
// //         setCurrentStep(1);
// //       } else if (currentStep === 1) {
// //         // Process payment
// //         await processPayment();
// //       }
// //     } catch (error) {
// //       console.error("Form validation error:", error);
// //     }
// //   };

// //   const handleBack = () => {
// //     if (currentStep > 0) {
// //       setCurrentStep(currentStep - 1);
// //     } else {
// //       navigate(-1);
// //     }
// //   };

// //   const processPayment = async () => {
// //     try {
// //       setProcessingPayment(true);
// //       setErrorMessage("");

// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         message.error("Authentication required");
// //         navigate("/");
// //         return;
// //       }

// //       // Get form values - Ensure all required fields are properly collected
// //       const formValues = form.getFieldsValue(true);

// //       // Log form values for debugging
// //       console.log("Form values:", formValues);

// //       // Check for required fields
// //       if (!formValues.fullName) {
// //         throw new Error("Full name is required");
// //       }

// //       if (!formValues.phone) {
// //         throw new Error("Phone number is required");
// //       }

// //       // Map frontend payment methods to database ENUM values
// //       // Your database expects: 'PayHere', 'CashOnDelivery', or 'BankTransfer'
// //       const dbPaymentMethod = (() => {
// //         switch (paymentMethod) {
// //           case "creditCard":
// //             return "PayHere"; // Assuming credit card payments use PayHere
// //           case "cashOnPickup":
// //             return "CashOnDelivery";
// //           default:
// //             return "PayHere"; // Default fallback
// //         }
// //       })();

// //       // Prepare common payload - Make sure required fields are included
// //       const payload = {
// //         deliveryMethod,
// //         // Use the mapped payment method value that matches your DB enum
// //         paymentMethod: dbPaymentMethod,
// //         // Explicitly set the address field based on delivery method
// //         // This is crucial because your database expects this field!
// //         address: deliveryMethod === "Deliver" ? formValues.deliveryAddress : "",
// //         fullName: formValues.fullName,
// //         phone: formValues.phone,
// //         email: formValues.email || "",
// //         total,
// //         subtotal,
// //         shippingFee,
// //         // Add telephone field which is expected by your backend
// //         // Convert phone to a plain string to avoid integer overflow issues
// //         telephone: String(formValues.phone),
// //       };

// //       // Log delivery method and address for debugging
// //       console.log("Delivery method:", deliveryMethod);
// //       console.log("Address being sent:", payload.address);

// //       // Add payment details if using credit card
// //       if (paymentMethod === "creditCard") {
// //         payload.paymentDetails = {
// //           cardholderName: formValues.cardholderName,
// //           cardNumber: formValues.cardNumber,
// //           expiryDate: formValues.expiryDate,
// //           cvv: formValues.cvv,
// //         };
// //       }

// //       // Debug payload
// //       console.log("Sending payload:", JSON.stringify(payload));

// //       let response;
// //       // API call based on source
// //       if (source === "prescription") {
// //         payload.prescriptionId = prescriptionId;
// //         response = await axios.post("/api/checkout/prescription", payload, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         });
// //       } else if (source === "product") {
// //         payload.productId = productId;
// //         payload.quantity = orderItems[0].quantity;
// //         response = await axios.post("/api/checkout/product", payload, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         });
// //       } else {
// //         // Default cart checkout
// //         response = await axios.post("/api/checkout/cart", payload, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         });
// //       }

// //       if (response.data.success) {
// //         message.success("Payment processed successfully");
// //         setOrderId(response.data.orderId);
// //         setOrderCompleted(true);
// //       } else {
// //         throw new Error(response.data.message || "Payment failed");
// //       }
// //     } catch (error) {
// //       console.error("Payment error:", error);
// //       setErrorMessage(
// //         error.response?.data?.message ||
// //           error.message ||
// //           "Failed to process payment. Please try again."
// //       );
// //       message.error("Payment failed. Please try again.");
// //     } finally {
// //       setProcessingPayment(false);
// //     }
// //   };

// //   // If order completed, show success page
// //   if (orderCompleted) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 py-12 px-4">
// //         <div className="max-w-4xl mx-auto">
// //           <Card className="shadow-lg rounded-lg overflow-hidden">
// //             <Result
// //               status="success"
// //               icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
// //               title="Order Placed Successfully!"
// //               subTitle={`Order number: ${orderId}`}
// //               extra={[
// //                 <Button
// //                   type="primary"
// //                   key="orders"
// //                   onClick={() => navigate("/orders")}
// //                   className="bg-blue-600 hover:bg-blue-700"
// //                 >
// //                   View My Orders
// //                 </Button>,
// //                 <Button key="shop" onClick={() => navigate("/home")}>
// //                   Continue Shopping
// //                 </Button>,
// //               ]}
// //             />

// //             <Divider />

// //             <div className="px-6 pb-6">
// //               <Title level={5}>Order Summary</Title>

// //               <List
// //                 itemLayout="horizontal"
// //                 dataSource={orderItems}
// //                 renderItem={(item) => (
// //                   <List.Item>
// //                     <List.Item.Meta
// //                       title={item.name}
// //                       description={`Quantity: ${item.quantity}`}
// //                     />
// //                     <div className="text-right">
// //                       <Text>Rs.{(item.price * item.quantity).toFixed(2)}</Text>
// //                     </div>
// //                   </List.Item>
// //                 )}
// //                 footer={
// //                   <div>
// //                     <div className="flex justify-between py-2">
// //                       <Text>Subtotal</Text>
// //                       <Text>Rs.{subtotal.toFixed(2)}</Text>
// //                     </div>
// //                     <div className="flex justify-between py-2">
// //                       <Text>Shipping Fee</Text>
// //                       <Text>
// //                         {shippingFee > 0
// //                           ? `Rs.${shippingFee.toFixed(2)}`
// //                           : "Free"}
// //                       </Text>
// //                     </div>
// //                     <Divider className="my-2" />
// //                     <div className="flex justify-between py-2">
// //                       <Text strong>Total</Text>
// //                       <Text strong className="text-lg text-blue-600">
// //                         Rs.{total.toFixed(2)}
// //                       </Text>
// //                     </div>
// //                   </div>
// //                 }
// //               />

// //               <div className="mt-6 bg-blue-50 p-4 rounded-lg">
// //                 <div className="flex items-start">
// //                   <div className="mr-2 mt-1 text-blue-500">
// //                     {deliveryMethod === "Deliver" ? (
// //                       <HomeOutlined />
// //                     ) : (
// //                       <ShopOutlined />
// //                     )}
// //                   </div>
// //                   <div>
// //                     <Text strong className="text-blue-600">
// //                       {deliveryMethod === "Deliver"
// //                         ? "Delivery Information"
// //                         : "Pickup Information"}
// //                     </Text>
// //                     <p className="mt-1 text-sm text-gray-600">
// //                       {deliveryMethod === "Deliver"
// //                         ? `Your order will be delivered to: ${form.getFieldValue(
// //                             "deliveryAddress"
// //                           )}`
// //                         : "Your order will be ready for pickup at our store."}
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </Card>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Main checkout form
// //   return (
// //     <div className="min-h-screen bg-gray-50 py-12 px-4">
// //       <div className="max-w-4xl mx-auto">
// //         <Card className="shadow-lg rounded-lg overflow-hidden">
// //           {/* Header */}
// //           <div className="mb-8 flex items-center justify-between border-b pb-4">
// //             <Button
// //               type="text"
// //               icon={<ArrowLeftOutlined />}
// //               onClick={handleBack}
// //             />
// //             <Title level={4} className="m-0 text-center flex-grow">
// //               Checkout
// //             </Title>
// //             <div className="w-8"></div> {/* Spacer for alignment */}
// //           </div>

// //           {/* Steps Indicator */}
// //           <Steps current={currentStep} className="px-6 pb-8">
// //             <Step title="Delivery Information" />
// //             <Step title="Payment" />
// //           </Steps>

// //           {loading ? (
// //             <div className="py-20 text-center">
// //               <Spin size="large" />
// //               <div className="mt-4">Loading order details...</div>
// //             </div>
// //           ) : (
// //             <div className="px-6">
// //               <Form
// //                 form={form}
// //                 layout="vertical"
// //                 initialValues={{
// //                   fullName: "",
// //                   phone: "",
// //                   email: "",
// //                   deliveryAddress: "",
// //                   deliveryMethod: deliveryMethod,
// //                 }}
// //                 scrollToFirstError
// //               >
// //                 {/* Step 1: Delivery Info */}
// //                 {currentStep === 0 && (
// //                   <div>
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                       <Form.Item
// //                         name="fullName"
// //                         label="Full Name"
// //                         rules={[
// //                           {
// //                             required: true,
// //                             message: "Please enter your full name",
// //                           },
// //                         ]}
// //                       >
// //                         <Input placeholder="Enter your full name" />
// //                       </Form.Item>

// //                       <Form.Item
// //                         name="phone"
// //                         label="Phone Number"
// //                         rules={[
// //                           {
// //                             required: true,
// //                             message: "Please enter your phone number",
// //                           },
// //                         ]}
// //                       >
// //                         <Input placeholder="Enter your phone number" />
// //                       </Form.Item>
// //                     </div>

// //                     <Form.Item
// //                       name="email"
// //                       label="Email Address"
// //                       rules={[
// //                         { required: true, message: "Please enter your email" },
// //                         {
// //                           type: "email",
// //                           message: "Please enter a valid email",
// //                         },
// //                       ]}
// //                     >
// //                       <Input placeholder="Enter your email address" />
// //                     </Form.Item>

// //                     <Form.Item
// //                       name="deliveryMethod"
// //                       label="Delivery Method"
// //                       initialValue={deliveryMethod}
// //                     >
// //                       <Radio.Group
// //                         onChange={(e) =>
// //                           handleDeliveryMethodChange(e.target.value)
// //                         }
// //                         value={deliveryMethod}
// //                       >
// //                         <Space direction="vertical" className="w-full">
// //                           <Card
// //                             className={`border cursor-pointer w-full transition-all ${
// //                               deliveryMethod === "Order Pickup"
// //                                 ? "border-blue-500 bg-blue-50"
// //                                 : "border-gray-200"
// //                             }`}
// //                             onClick={() =>
// //                               handleDeliveryMethodChange("Order Pickup")
// //                             }
// //                             hoverable
// //                           >
// //                             <Radio value="Order Pickup" className="w-full">
// //                               <div className="flex items-center ml-2">
// //                                 <ShopOutlined className="text-lg mr-2" />
// //                                 <div>
// //                                   <div className="font-medium">
// //                                     Store Pickup
// //                                   </div>
// //                                   <div className="text-xs text-gray-500">
// //                                     Pick up your order at our store
// //                                   </div>
// //                                 </div>
// //                                 <div className="ml-auto font-semibold text-green-600">
// //                                   Free
// //                                 </div>
// //                               </div>
// //                             </Radio>
// //                           </Card>

// //                           <Card
// //                             className={`border cursor-pointer w-full transition-all ${
// //                               deliveryMethod === "Deliver"
// //                                 ? "border-blue-500 bg-blue-50"
// //                                 : "border-gray-200"
// //                             }`}
// //                             onClick={() =>
// //                               handleDeliveryMethodChange("Deliver")
// //                             }
// //                             hoverable
// //                           >
// //                             <Radio value="Deliver" className="w-full">
// //                               <div className="flex items-center ml-2">
// //                                 <HomeOutlined className="text-lg mr-2" />
// //                                 <div>
// //                                   <div className="font-medium">
// //                                     Home Delivery
// //                                   </div>
// //                                   <div className="text-xs text-gray-500">
// //                                     Delivery to your specified address
// //                                   </div>
// //                                 </div>
// //                                 <div className="ml-auto font-semibold">
// //                                   Rs.300
// //                                 </div>
// //                               </div>
// //                             </Radio>
// //                           </Card>
// //                         </Space>
// //                       </Radio.Group>
// //                     </Form.Item>

// //                     {deliveryMethod === "Deliver" && (
// //                       <Form.Item
// //                         name="deliveryAddress"
// //                         label="Delivery Address"
// //                         rules={[
// //                           {
// //                             required: deliveryMethod === "Deliver",
// //                             message: "Please enter your delivery address",
// //                           },
// //                         ]}
// //                       >
// //                         <Input.TextArea
// //                           rows={3}
// //                           placeholder="Enter your complete delivery address"
// //                         />
// //                       </Form.Item>
// //                     )}
// //                   </div>
// //                 )}

// //                 {/* Step 2: Payment Method */}
// //                 {currentStep === 1 && (
// //                   <div>
// //                     <Form.Item label="Select Payment Method">
// //                       <Radio.Group
// //                         onChange={(e) =>
// //                           handlePaymentMethodChange(e.target.value)
// //                         }
// //                         value={paymentMethod}
// //                         className="w-full"
// //                       >
// //                         <Space direction="vertical" className="w-full">
// //                           {deliveryMethod === "Deliver" ? (
// //                             // For Home Delivery, only card payment is available
// //                             <Card
// //                               className={`border cursor-pointer w-full transition-all ${
// //                                 paymentMethod === "creditCard"
// //                                   ? "border-blue-500 bg-blue-50"
// //                                   : "border-gray-200"
// //                               }`}
// //                               onClick={() =>
// //                                 handlePaymentMethodChange("creditCard")
// //                               }
// //                               hoverable
// //                             >
// //                               <Radio value="creditCard" className="w-full">
// //                                 <div className="flex items-center ml-2">
// //                                   <CreditCardOutlined className="text-lg mr-2" />
// //                                   <div>
// //                                     <div className="font-medium">
// //                                       Credit/Debit Card
// //                                     </div>
// //                                     <div className="text-xs text-gray-500">
// //                                       Pay securely with your card
// //                                     </div>
// //                                   </div>
// //                                 </div>
// //                               </Radio>
// //                             </Card>
// //                           ) : (
// //                             // For Store Pickup, cash and card are available
// //                             <>
// //                               <Card
// //                                 className={`border cursor-pointer w-full transition-all ${
// //                                   paymentMethod === "creditCard"
// //                                     ? "border-blue-500 bg-blue-50"
// //                                     : "border-gray-200"
// //                                 }`}
// //                                 onClick={() =>
// //                                   handlePaymentMethodChange("creditCard")
// //                                 }
// //                                 hoverable
// //                               >
// //                                 <Radio value="creditCard" className="w-full">
// //                                   <div className="flex items-center ml-2">
// //                                     <CreditCardOutlined className="text-lg mr-2" />
// //                                     <div>
// //                                       <div className="font-medium">
// //                                         Credit/Debit Card
// //                                       </div>
// //                                       <div className="text-xs text-gray-500">
// //                                         Pay securely with your card
// //                                       </div>
// //                                     </div>
// //                                   </div>
// //                                 </Radio>
// //                               </Card>

// //                               <Card
// //                                 className={`border cursor-pointer w-full transition-all ${
// //                                   paymentMethod === "cashOnPickup"
// //                                     ? "border-blue-500 bg-blue-50"
// //                                     : "border-gray-200"
// //                                 }`}
// //                                 onClick={() =>
// //                                   handlePaymentMethodChange("cashOnPickup")
// //                                 }
// //                                 hoverable
// //                               >
// //                                 <Radio value="cashOnPickup" className="w-full">
// //                                   <div className="flex items-center ml-2">
// //                                     <DollarOutlined className="text-lg mr-2" />
// //                                     <div>
// //                                       <div className="font-medium">
// //                                         Pay at Store
// //                                       </div>
// //                                       <div className="text-xs text-gray-500">
// //                                         Pay when you collect your order
// //                                       </div>
// //                                     </div>
// //                                   </div>
// //                                 </Radio>
// //                               </Card>
// //                             </>
// //                           )}
// //                         </Space>
// //                       </Radio.Group>
// //                     </Form.Item>

// //                     {paymentMethod === "creditCard" && (
// //                       <div className="mt-6 space-y-4">
// //                         <Form.Item
// //                           name="cardholderName"
// //                           label="Cardholder Name"
// //                           rules={[
// //                             {
// //                               required: paymentMethod === "creditCard",
// //                               message: "Please enter the cardholder name",
// //                             },
// //                           ]}
// //                         >
// //                           <Input placeholder="Name on card" />
// //                         </Form.Item>

// //                         <Form.Item
// //                           name="cardNumber"
// //                           label="Card Number"
// //                           rules={[
// //                             {
// //                               required: paymentMethod === "creditCard",
// //                               message: "Please enter your card number",
// //                             },
// //                             {
// //                               pattern: /^[0-9]{16}$/,
// //                               message:
// //                                 "Please enter a valid 16-digit card number",
// //                             },
// //                           ]}
// //                         >
// //                           <Input
// //                             placeholder="1234 5678 9012 3456"
// //                             maxLength={16}
// //                           />
// //                         </Form.Item>

// //                         <div className="grid grid-cols-2 gap-4">
// //                           <Form.Item
// //                             name="expiryDate"
// //                             label="Expiry Date (MM/YY)"
// //                             rules={[
// //                               {
// //                                 required: paymentMethod === "creditCard",
// //                                 message: "Required",
// //                               },
// //                               {
// //                                 pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
// //                                 message: "Format: MM/YY",
// //                               },
// //                             ]}
// //                           >
// //                             <Input placeholder="MM/YY" maxLength={5} />
// //                           </Form.Item>

// //                           <Form.Item
// //                             name="cvv"
// //                             label="CVV"
// //                             rules={[
// //                               {
// //                                 required: paymentMethod === "creditCard",
// //                                 message: "Required",
// //                               },
// //                               {
// //                                 pattern: /^[0-9]{3,4}$/,
// //                                 message: "3 or 4 digits only",
// //                               },
// //                             ]}
// //                           >
// //                             <Input placeholder="123" maxLength={4} />
// //                           </Form.Item>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               </Form>

// //               {/* Order Summary */}
// //               <div className="mt-8 bg-gray-50 p-6 rounded-lg">
// //                 <Title level={5} className="mb-4">
// //                   Order Summary
// //                 </Title>

// //                 <List
// //                   itemLayout="horizontal"
// //                   dataSource={orderItems}
// //                   renderItem={(item) => (
// //                     <List.Item>
// //                       <List.Item.Meta
// //                         title={item.name}
// //                         description={`Quantity: ${item.quantity}`}
// //                       />
// //                       <div className="text-right">
// //                         <Text>
// //                           Rs.{(item.price * item.quantity).toFixed(2)}
// //                         </Text>
// //                       </div>
// //                     </List.Item>
// //                   )}
// //                   footer={
// //                     <div>
// //                       <div className="flex justify-between py-2">
// //                         <Text>Subtotal</Text>
// //                         <Text>Rs.{subtotal.toFixed(2)}</Text>
// //                       </div>
// //                       <div className="flex justify-between py-2">
// //                         <Text>Shipping Fee</Text>
// //                         <Text>
// //                           {shippingFee > 0
// //                             ? `Rs.${shippingFee.toFixed(2)}`
// //                             : "Free"}
// //                         </Text>
// //                       </div>
// //                       <Divider className="my-2" />
// //                       <div className="flex justify-between py-2">
// //                         <Text strong>Total</Text>
// //                         <Text strong className="text-lg text-blue-600">
// //                           Rs.{total.toFixed(2)}
// //                         </Text>
// //                       </div>
// //                     </div>
// //                   }
// //                 />
// //               </div>

// //               {/* Error Message */}
// //               {errorMessage && (
// //                 <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
// //                   {errorMessage}
// //                 </div>
// //               )}

// //               {/* Navigation Buttons */}
// //               <div className="mt-8 flex justify-between">
// //                 <Button onClick={handleBack}>Back</Button>
// //                 <Button
// //                   type="primary"
// //                   onClick={handleNext}
// //                   loading={processingPayment}
// //                   className="bg-blue-600 hover:bg-blue-700"
// //                 >
// //                   {currentStep === 0 ? "Continue to Payment" : "Place Order"}
// //                 </Button>
// //               </div>
// //             </div>
// //           )}
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CheckoutPage;

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Steps,
//   Card,
//   Form,
//   Input,
//   Select,
//   Radio,
//   Button,
//   Divider,
//   message,
//   Spin,
//   Result,
//   List,
//   Typography,
//   Tag,
//   Space,
//   Alert,
//   Modal,
// } from "antd";
// import {
//   CreditCardOutlined,
//   HomeOutlined,
//   ShopOutlined,
//   CheckCircleOutlined,
//   DollarOutlined,
//   ArrowLeftOutlined,
//   ExclamationCircleOutlined,
//   CloseCircleOutlined,
// } from "@ant-design/icons";
// import axios from "axios";

// const { Step } = Steps;
// const { Option } = Select;
// const { Title, Text } = Typography;
// const { confirm } = Modal;

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [form] = Form.useForm();

//   // Extract data from location state
//   const {
//     prescriptionId,
//     products = [],
//     source = "cart", // 'prescription', 'product', 'cart'
//     deliveryMethod: initialDeliveryMethod = "Order Pickup",
//     productId,
//     quantity: initialQuantity = 1,
//   } = location.state || {};

//   // Component state
//   const [currentStep, setCurrentStep] = useState(0);
//   const [deliveryMethod, setDeliveryMethod] = useState(initialDeliveryMethod);
//   const [paymentMethod, setPaymentMethod] = useState("creditCard");
//   const [loading, setLoading] = useState(false);
//   const [orderCompleted, setOrderCompleted] = useState(false);
//   const [orderId, setOrderId] = useState(null);
//   const [orderItems, setOrderItems] = useState(products || []);
//   const [shippingFee, setShippingFee] = useState(0);
//   const [processingPayment, setProcessingPayment] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [unavailableItems, setUnavailableItems] = useState([]);
//   const [showInventoryError, setShowInventoryError] = useState(false);

//   // Calculate totals
//   const subtotal = orderItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );
//   const total = subtotal + shippingFee;

//   useEffect(() => {
//     // Set shipping fee based on delivery method
//     if (deliveryMethod === "Deliver") {
//       setShippingFee(300);
//     } else {
//       setShippingFee(0);
//     }

//     // Initialize page based on source
//     initializeCheckout();
//   }, [deliveryMethod]);

//   const initializeCheckout = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         message.error("Please login to continue checkout");
//         navigate("/");
//         return;
//       }

//       // Handle different sources
//       if (source === "prescription" && prescriptionId) {
//         await fetchPrescriptionDetails(prescriptionId);
//       } else if (source === "product" && productId) {
//         await fetchProductDetails(productId, initialQuantity);
//       } else if (source === "cart") {
//         await fetchCartItems();
//       } else {
//         message.error("Invalid checkout source");
//         navigate(-1);
//       }
//     } catch (error) {
//       console.error("Error initializing checkout:", error);
//       message.error("Failed to initialize checkout. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPrescriptionDetails = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `/api/customer-prescriptions/prescriptions/${id}/products`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.success && response.data.products) {
//         setOrderItems(response.data.products);
//       } else {
//         throw new Error("Failed to load prescription products");
//       }
//     } catch (error) {
//       console.error("Error fetching prescription details:", error);
//       message.error("Failed to load prescription items");
//       // For development, set mock data
//       setMockPrescriptionProducts();
//     }
//   };

//   const fetchProductDetails = async (id, qty) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`/api/productsDetails/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data && response.data.product) {
//         const product = response.data.product;
//         setOrderItems([
//           {
//             id: product.id,
//             name: product.name,
//             price: product.price,
//             quantity: qty,
//             image: product.image,
//           },
//         ]);
//       } else {
//         throw new Error("Failed to load product details");
//       }
//     } catch (error) {
//       console.error("Error fetching product:", error);
//       message.error("Failed to load product details");
//       // For development, set mock data
//       setMockSingleProduct(id, qty);
//     }
//   };

//   const fetchCartItems = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/api/cart", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data && response.data.items) {
//         setOrderItems(response.data.items);
//       } else {
//         throw new Error("Failed to load cart items");
//       }
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       message.error("Failed to load cart items");
//       // For development, set mock data
//       setMockCartItems();
//     }
//   };

//   // Fix image placeholders using an absolute URL placeholder service
//   const getImagePlaceholder = (width, height) => {
//     // Use an external placeholder service that is guaranteed to work
//     return `https://placehold.co/${width}x${height}`;
//   };

//   const setMockPrescriptionProducts = () => {
//     setOrderItems([
//       { id: 101, name: "Panadol", quantity: 10, price: 45, total: 450 },
//       { id: 102, name: "Amoxicillin", quantity: 5, price: 120, total: 600 },
//       { id: 103, name: "Vitamin C", quantity: 2, price: 80, total: 160 },
//     ]);
//   };

//   const setMockSingleProduct = (id, qty) => {
//     setOrderItems([
//       {
//         id: id,
//         name: `Product ${id}`,
//         price: 250,
//         quantity: qty,
//         image: getImagePlaceholder(400, 320),
//       },
//     ]);
//   };

//   const setMockCartItems = () => {
//     setOrderItems([
//       {
//         id: 1,
//         name: "Samahan",
//         quantity: 2,
//         price: 40,
//         total: 80,
//         image: getImagePlaceholder(80, 80),
//       },
//       {
//         id: 2,
//         name: "Yakipeyana",
//         quantity: 1,
//         price: 50,
//         total: 50,
//         image: getImagePlaceholder(80, 80),
//       },
//     ]);
//   };

//   const handleDeliveryMethodChange = (value) => {
//     setDeliveryMethod(value);
//     // Update form fields validation
//     if (value === "Deliver") {
//       form.validateFields(["deliveryAddress"]);
//     }
//   };

//   const handlePaymentMethodChange = (value) => {
//     setPaymentMethod(value);
//   };

//   const handleNext = async () => {
//     try {
//       // Validate form fields for current step
//       await form.validateFields();

//       if (currentStep === 0) {
//         // Move to payment step
//         setCurrentStep(1);
//       } else if (currentStep === 1) {
//         // Show confirmation modal with proper messaging based on payment method
//         const inventoryReducedMethod = paymentMethod === "creditCard";

//         let confirmTitle = "Confirm Your Order";
//         let confirmMessage = "";

//         if (inventoryReducedMethod) {
//           confirmMessage =
//             "Your card will be charged immediately and the order will be processed.";
//         } else if (paymentMethod === "cashOnDelivery") {
//           confirmMessage =
//             "You will pay upon delivery. The products will be reserved for you.";
//         } else {
//           confirmMessage =
//             "You will pay at our store when you pick up your order.";
//         }

//         confirm({
//           title: confirmTitle,
//           icon: <ExclamationCircleOutlined />,
//           content: confirmMessage,
//           okText: "Confirm Order",
//           cancelText: "Cancel",
//           onOk() {
//             return processPayment();
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Form validation error:", error);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     } else {
//       navigate(-1);
//     }
//   };

//   const processPayment = async () => {
//     try {
//       setProcessingPayment(true);
//       setErrorMessage("");
//       setUnavailableItems([]);
//       setShowInventoryError(false);

//       const token = localStorage.getItem("token");
//       if (!token) {
//         message.error("Authentication required");
//         navigate("/");
//         return;
//       }

//       // Get form values - Ensure all required fields are properly collected
//       const formValues = form.getFieldsValue(true);

//       // Log form values for debugging
//       console.log("Form values:", formValues);

//       // Check for required fields
//       if (!formValues.fullName) {
//         throw new Error("Full name is required");
//       }

//       if (!formValues.phone) {
//         throw new Error("Phone number is required");
//       }

//       // Map frontend payment methods to database ENUM values
//       // Database expects: 'PayHere', 'CashOnDelivery', or 'OnTheSpot'
//       const dbPaymentMethod = (() => {
//         switch (paymentMethod) {
//           case "creditCard":
//             return "PayHere"; // Credit card payments use PayHere
//           case "cashOnDelivery":
//             return "CashOnDelivery";
//           case "cashOnPickup":
//             return "OnTheSpot";
//           default:
//             return "PayHere"; // Default fallback
//         }
//       })();

//       // Prepare common payload - Make sure required fields are included
//       const payload = {
//         deliveryMethod,
//         // Use the mapped payment method value that matches your DB enum
//         paymentMethod: dbPaymentMethod,
//         // Explicitly set the address field based on delivery method
//         // This is crucial because your database expects this field!
//         address: deliveryMethod === "Deliver" ? formValues.deliveryAddress : "",
//         fullName: formValues.fullName,
//         phone: formValues.phone,
//         email: formValues.email || "",
//         total,
//         subtotal,
//         shippingFee,
//         // Add telephone field which is expected by your backend
//         // Convert phone to a plain string to avoid integer overflow issues
//         telephone: String(formValues.phone),
//       };

//       // Add payment details if using credit card
//       if (paymentMethod === "creditCard") {
//         payload.paymentDetails = {
//           cardholderName: formValues.cardholderName,
//           cardNumber: formValues.cardNumber,
//           expiryDate: formValues.expiryDate,
//           cvv: formValues.cvv,
//         };
//       }

//       // Debug payload
//       console.log("Sending payload:", JSON.stringify(payload));

//       let response;

//       // API call based on source
//       if (source === "prescription") {
//         payload.prescriptionId = prescriptionId;
//         response = await axios.post("/api/checkout/prescription", payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//       } else if (source === "product") {
//         payload.productId = productId;
//         payload.quantity = orderItems[0].quantity;
//         response = await axios.post("/api/checkout/product", payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//       } else {
//         // Default cart checkout
//         response = await axios.post("/api/checkout/cart", payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//       }

//       if (response.data.success) {
//         message.success("Payment processed successfully");
//         setOrderId(response.data.orderId);
//         setOrderCompleted(true);
//       } else {
//         throw new Error(response.data.message || "Payment failed");
//       }
//     } catch (error) {
//       console.error("Payment error:", error);

//       // Check for inventory issues (out of stock)
//       if (error.response?.data?.unavailableItems) {
//         setUnavailableItems(error.response.data.unavailableItems);
//         setShowInventoryError(true);
//       } else {
//         setErrorMessage(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to process payment. Please try again."
//         );
//       }

//       message.error("Payment failed. Please check for errors.");
//     } finally {
//       setProcessingPayment(false);
//     }
//   };

//   // If order completed, show success page
//   if (orderCompleted) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-12 px-4">
//         <div className="max-w-4xl mx-auto">
//           <Card className="shadow-lg rounded-lg overflow-hidden">
//             <Result
//               status="success"
//               icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
//               title="Order Placed Successfully!"
//               subTitle={`Order number: ${orderId}`}
//               extra={[
//                 <Button
//                   type="primary"
//                   key="orders"
//                   onClick={() => navigate("/orders")}
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   View My Orders
//                 </Button>,
//                 <Button key="shop" onClick={() => navigate("/home")}>
//                   Continue Shopping
//                 </Button>,
//               ]}
//             />

//             <Divider />

//             <div className="px-6 pb-6">
//               <Title level={5}>Order Summary</Title>

//               <List
//                 itemLayout="horizontal"
//                 dataSource={orderItems}
//                 renderItem={(item) => (
//                   <List.Item>
//                     <List.Item.Meta
//                       title={item.name}
//                       description={`Quantity: ${item.quantity}`}
//                     />
//                     <div className="text-right">
//                       <Text>Rs.{(item.price * item.quantity).toFixed(2)}</Text>
//                     </div>
//                   </List.Item>
//                 )}
//                 footer={
//                   <div>
//                     <div className="flex justify-between py-2">
//                       <Text>Subtotal</Text>
//                       <Text>Rs.{subtotal.toFixed(2)}</Text>
//                     </div>
//                     <div className="flex justify-between py-2">
//                       <Text>Shipping Fee</Text>
//                       <Text>
//                         {shippingFee > 0
//                           ? `Rs.${shippingFee.toFixed(2)}`
//                           : "Free"}
//                       </Text>
//                     </div>
//                     <Divider className="my-2" />
//                     <div className="flex justify-between py-2">
//                       <Text strong>Total</Text>
//                       <Text strong className="text-lg text-blue-600">
//                         Rs.{total.toFixed(2)}
//                       </Text>
//                     </div>
//                   </div>
//                 }
//               />

//               <div className="mt-6 bg-blue-50 p-4 rounded-lg">
//                 <div className="flex items-start">
//                   <div className="mr-2 mt-1 text-blue-500">
//                     {deliveryMethod === "Deliver" ? (
//                       <HomeOutlined />
//                     ) : (
//                       <ShopOutlined />
//                     )}
//                   </div>
//                   <div>
//                     <Text strong className="text-blue-600">
//                       {deliveryMethod === "Deliver"
//                         ? "Delivery Information"
//                         : "Pickup Information"}
//                     </Text>
//                     <p className="mt-1 text-sm text-gray-600">
//                       {deliveryMethod === "Deliver"
//                         ? `Your order will be delivered to: ${form.getFieldValue(
//                             "deliveryAddress"
//                           )}`
//                         : "Your order will be ready for pickup at our store."}
//                     </p>
//                     <p className="mt-2 text-sm text-gray-600">
//                       {paymentMethod === "creditCard"
//                         ? "Your payment has been processed successfully."
//                         : paymentMethod === "cashOnDelivery"
//                         ? "You will pay upon delivery."
//                         : "You will pay when you pick up your order."}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   // Inventory error modal
//   if (showInventoryError) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-12 px-4">
//         <div className="max-w-4xl mx-auto">
//           <Card className="shadow-lg rounded-lg overflow-hidden">
//             <Result
//               status="error"
//               title="Inventory Issue"
//               subTitle="We're sorry, but some items in your order are unavailable."
//               icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
//               extra={[
//                 <Button
//                   type="primary"
//                   key="goback"
//                   onClick={() => {
//                     setShowInventoryError(false);
//                     if (source === "cart") {
//                       navigate("/cart");
//                     } else {
//                       navigate(-1);
//                     }
//                   }}
//                   danger
//                 >
//                   Return to Cart
//                 </Button>,
//               ]}
//             />

//             <div className="px-6 pb-6">
//               <Title level={5}>Unavailable Items</Title>

//               <List
//                 itemLayout="horizontal"
//                 dataSource={unavailableItems}
//                 renderItem={(item) => (
//                   <List.Item>
//                     <List.Item.Meta
//                       title={item.name}
//                       description={
//                         <div>
//                           <Text type="danger">
//                             Requested: {item.requested}, Available:{" "}
//                             {item.available}
//                           </Text>
//                         </div>
//                       }
//                     />
//                   </List.Item>
//                 )}
//               />

//               <Alert
//                 message="Please adjust your quantities and try again"
//                 type="warning"
//                 showIcon
//                 className="mt-4"
//               />
//             </div>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   // Main checkout form
//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         <Card className="shadow-lg rounded-lg overflow-hidden">
//           {/* Header */}
//           <div className="mb-8 flex items-center justify-between border-b pb-4">
//             <Button
//               type="text"
//               icon={<ArrowLeftOutlined />}
//               onClick={handleBack}
//             />
//             <Title level={4} className="m-0 text-center flex-grow">
//               Checkout
//             </Title>
//             <div className="w-8"></div> {/* Spacer for alignment */}
//           </div>

//           {/* Steps Indicator */}
//           <Steps current={currentStep} className="px-6 pb-8">
//             <Step title="Delivery Information" />
//             <Step title="Payment" />
//           </Steps>

//           {loading ? (
//             <div className="py-20 text-center">
//               <Spin size="large" />
//               <div className="mt-4">Loading order details...</div>
//             </div>
//           ) : (
//             <div className="px-6">
//               <Form
//                 form={form}
//                 layout="vertical"
//                 initialValues={{
//                   fullName: "",
//                   phone: "",
//                   email: "",
//                   deliveryAddress: "",
//                   deliveryMethod: deliveryMethod,
//                 }}
//                 scrollToFirstError
//               >
//                 {/* Step 1: Delivery Info */}
//                 {currentStep === 0 && (
//                   <div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <Form.Item
//                         name="fullName"
//                         label="Full Name"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please enter your full name",
//                           },
//                         ]}
//                       >
//                         <Input placeholder="Enter your full name" />
//                       </Form.Item>

//                       <Form.Item
//                         name="phone"
//                         label="Phone Number"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please enter your phone number",
//                           },
//                         ]}
//                       >
//                         <Input placeholder="Enter your phone number" />
//                       </Form.Item>
//                     </div>

//                     <Form.Item
//                       name="email"
//                       label="Email Address"
//                       rules={[
//                         { required: true, message: "Please enter your email" },
//                         {
//                           type: "email",
//                           message: "Please enter a valid email",
//                         },
//                       ]}
//                     >
//                       <Input placeholder="Enter your email address" />
//                     </Form.Item>

//                     <Form.Item
//                       name="deliveryMethod"
//                       label="Delivery Method"
//                       initialValue={deliveryMethod}
//                     >
//                       <Radio.Group
//                         onChange={(e) =>
//                           handleDeliveryMethodChange(e.target.value)
//                         }
//                         value={deliveryMethod}
//                       >
//                         <Space direction="vertical" className="w-full">
//                           <Card
//                             className={`border cursor-pointer w-full transition-all ${
//                               deliveryMethod === "Order Pickup"
//                                 ? "border-blue-500 bg-blue-50"
//                                 : "border-gray-200"
//                             }`}
//                             onClick={() =>
//                               handleDeliveryMethodChange("Order Pickup")
//                             }
//                             hoverable
//                           >
//                             <Radio value="Order Pickup" className="w-full">
//                               <div className="flex items-center ml-2">
//                                 <ShopOutlined className="text-lg mr-2" />
//                                 <div>
//                                   <div className="font-medium">
//                                     Store Pickup
//                                   </div>
//                                   <div className="text-xs text-gray-500">
//                                     Pick up your order at our store
//                                   </div>
//                                 </div>
//                                 <div className="ml-auto font-semibold text-green-600">
//                                   Free
//                                 </div>
//                               </div>
//                             </Radio>
//                           </Card>

//                           <Card
//                             className={`border cursor-pointer w-full transition-all ${
//                               deliveryMethod === "Deliver"
//                                 ? "border-blue-500 bg-blue-50"
//                                 : "border-gray-200"
//                             }`}
//                             onClick={() =>
//                               handleDeliveryMethodChange("Deliver")
//                             }
//                             hoverable
//                           >
//                             <Radio value="Deliver" className="w-full">
//                               <div className="flex items-center ml-2">
//                                 <HomeOutlined className="text-lg mr-2" />
//                                 <div>
//                                   <div className="font-medium">
//                                     Home Delivery
//                                   </div>
//                                   <div className="text-xs text-gray-500">
//                                     Delivery to your specified address
//                                   </div>
//                                 </div>
//                                 <div className="ml-auto font-semibold">
//                                   Rs.300
//                                 </div>
//                               </div>
//                             </Radio>
//                           </Card>
//                         </Space>
//                       </Radio.Group>
//                     </Form.Item>

//                     {deliveryMethod === "Deliver" && (
//                       <Form.Item
//                         name="deliveryAddress"
//                         label="Delivery Address"
//                         rules={[
//                           {
//                             required: deliveryMethod === "Deliver",
//                             message: "Please enter your delivery address",
//                           },
//                         ]}
//                       >
//                         <Input.TextArea
//                           rows={3}
//                           placeholder="Enter your complete delivery address"
//                         />
//                       </Form.Item>
//                     )}
//                   </div>
//                 )}

//                 {/* Step 2: Payment Method */}
//                 {currentStep === 1 && (
//                   <div>
//                     <Form.Item label="Select Payment Method">
//                       <Radio.Group
//                         onChange={(e) =>
//                           handlePaymentMethodChange(e.target.value)
//                         }
//                         value={paymentMethod}
//                         className="w-full"
//                       >
//                         <Space direction="vertical" className="w-full">
//                           {/* Always show Credit Card option */}
//                           <Card
//                             className={`border cursor-pointer w-full transition-all ${
//                               paymentMethod === "creditCard"
//                                 ? "border-blue-500 bg-blue-50"
//                                 : "border-gray-200"
//                             }`}
//                             onClick={() =>
//                               handlePaymentMethodChange("creditCard")
//                             }
//                             hoverable
//                           >
//                             <Radio value="creditCard" className="w-full">
//                               <div className="flex items-center ml-2">
//                                 <CreditCardOutlined className="text-lg mr-2" />
//                                 <div>
//                                   <div className="font-medium">
//                                     Credit/Debit Card
//                                   </div>
//                                   <div className="text-xs text-gray-500">
//                                     Pay securely with your card
//                                   </div>
//                                 </div>
//                               </div>
//                             </Radio>
//                           </Card>

//                           {/* Show Cash on Delivery only for delivery method */}
//                           {deliveryMethod === "Deliver" && (
//                             <Card
//                               className={`border cursor-pointer w-full transition-all ${
//                                 paymentMethod === "cashOnDelivery"
//                                   ? "border-blue-500 bg-blue-50"
//                                   : "border-gray-200"
//                               }`}
//                               onClick={() =>
//                                 handlePaymentMethodChange("cashOnDelivery")
//                               }
//                               hoverable
//                             >
//                               <Radio value="cashOnDelivery" className="w-full">
//                                 <div className="flex items-center ml-2">
//                                   <DollarOutlined className="text-lg mr-2" />
//                                   <div>
//                                     <div className="font-medium">
//                                       Cash on Delivery
//                                     </div>
//                                     <div className="text-xs text-gray-500">
//                                       Pay when your order is delivered
//                                     </div>
//                                   </div>
//                                 </div>
//                               </Radio>
//                             </Card>
//                           )}

//                           {/* Show Pay at Store only for pickup method */}
//                           {deliveryMethod === "Order Pickup" && (
//                             <Card
//                               className={`border cursor-pointer w-full transition-all ${
//                                 paymentMethod === "cashOnPickup"
//                                   ? "border-blue-500 bg-blue-50"
//                                   : "border-gray-200"
//                               }`}
//                               onClick={() =>
//                                 handlePaymentMethodChange("cashOnPickup")
//                               }
//                               hoverable
//                             >
//                               <Radio value="cashOnPickup" className="w-full">
//                                 <div className="flex items-center ml-2">
//                                   <DollarOutlined className="text-lg mr-2" />
//                                   <div>
//                                     <div className="font-medium">
//                                       Pay at Store
//                                     </div>
//                                     <div className="text-xs text-gray-500">
//                                       Pay when you collect your order
//                                     </div>
//                                   </div>
//                                 </div>
//                               </Radio>
//                             </Card>
//                           )}
//                         </Space>
//                       </Radio.Group>
//                     </Form.Item>

//                     {/* Only show card fields for credit card option */}
//                     {paymentMethod === "creditCard" && (
//                       <div className="mt-6 space-y-4">
//                         <Form.Item
//                           name="cardholderName"
//                           label="Cardholder Name"
//                           rules={[
//                             {
//                               required: paymentMethod === "creditCard",
//                               message: "Please enter the cardholder name",
//                             },
//                           ]}
//                         >
//                           <Input placeholder="Name on card" />
//                         </Form.Item>

//                         <Form.Item
//                           name="cardNumber"
//                           label="Card Number"
//                           rules={[
//                             {
//                               required: paymentMethod === "creditCard",
//                               message: "Please enter your card number",
//                             },
//                             {
//                               pattern: /^[0-9]{16}$/,
//                               message:
//                                 "Please enter a valid 16-digit card number",
//                             },
//                           ]}
//                         >
//                           <Input
//                             placeholder="1234 5678 9012 3456"
//                             maxLength={16}
//                           />
//                         </Form.Item>

//                         <div className="grid grid-cols-2 gap-4">
//                           <Form.Item
//                             name="expiryDate"
//                             label="Expiry Date (MM/YY)"
//                             rules={[
//                               {
//                                 required: paymentMethod === "creditCard",
//                                 message: "Required",
//                               },
//                               {
//                                 pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
//                                 message: "Format: MM/YY",
//                               },
//                             ]}
//                           >
//                             <Input placeholder="MM/YY" maxLength={5} />
//                           </Form.Item>

//                           <Form.Item
//                             name="cvv"
//                             label="CVV"
//                             rules={[
//                               {
//                                 required: paymentMethod === "creditCard",
//                                 message: "Required",
//                               },
//                               {
//                                 pattern: /^[0-9]{3,4}$/,
//                                 message: "3 or 4 digits only",
//                               },
//                             ]}
//                           >
//                             <Input placeholder="123" maxLength={4} />
//                           </Form.Item>
//                         </div>

//                         <Alert
//                           type="info"
//                           message="Inventory will be reduced immediately"
//                           description="When paying by credit card, inventory is reserved for you immediately."
//                           showIcon
//                         />
//                       </div>
//                     )}

//                     {paymentMethod !== "creditCard" && (
//                       <Alert
//                         type="warning"
//                         message="Inventory will be reduced at payment time"
//                         description={
//                           paymentMethod === "cashOnDelivery"
//                             ? "The products will be reserved for you, but inventory will only be reduced when payment is made upon delivery."
//                             : "The products will be reserved for you, but inventory will only be reduced when you pay at the store."
//                         }
//                         showIcon
//                         className="mt-6"
//                       />
//                     )}
//                   </div>
//                 )}
//               </Form>

//               {/* Order Summary */}
//               <div className="mt-8 bg-gray-50 p-6 rounded-lg">
//                 <Title level={5} className="mb-4">
//                   Order Summary
//                 </Title>

//                 <List
//                   itemLayout="horizontal"
//                   dataSource={orderItems}
//                   renderItem={(item) => (
//                     <List.Item>
//                       <List.Item.Meta
//                         title={item.name}
//                         description={`Quantity: ${item.quantity}`}
//                       />
//                       <div className="text-right">
//                         <Text>
//                           Rs.{(item.price * item.quantity).toFixed(2)}
//                         </Text>
//                       </div>
//                     </List.Item>
//                   )}
//                   footer={
//                     <div>
//                       <div className="flex justify-between py-2">
//                         <Text>Subtotal</Text>
//                         <Text>Rs.{subtotal.toFixed(2)}</Text>
//                       </div>
//                       <div className="flex justify-between py-2">
//                         <Text>Shipping Fee</Text>
//                         <Text>
//                           {shippingFee > 0
//                             ? `Rs.${shippingFee.toFixed(2)}`
//                             : "Free"}
//                         </Text>
//                       </div>
//                       <Divider className="my-2" />
//                       <div className="flex justify-between py-2">
//                         <Text strong>Total</Text>
//                         <Text strong className="text-lg text-blue-600">
//                           Rs.{total.toFixed(2)}
//                         </Text>
//                       </div>
//                     </div>
//                   }
//                 />
//               </div>

//               {/* Error Message */}
//               {errorMessage && (
//                 <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
//                   {errorMessage}
//                 </div>
//               )}

//               {/* Navigation Buttons */}
//               <div className="mt-8 flex justify-between">
//                 <Button onClick={handleBack}>Back</Button>
//                 <Button
//                   type="primary"
//                   onClick={handleNext}
//                   loading={processingPayment}
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   {currentStep === 0 ? "Continue to Payment" : "Place Order"}
//                 </Button>
//               </div>
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Steps,
  Card,
  Form,
  Input,
  Select,
  Radio,
  Button,
  Divider,
  message,
  Spin,
  Result,
  List,
  Typography,
  Tag,
  Space,
  Alert,
  Modal,
} from "antd";
import {
  CreditCardOutlined,
  HomeOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Step } = Steps;
const { Option } = Select;
const { Title, Text } = Typography;
const { confirm } = Modal;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  // Extract data from location state
  const {
    prescriptionId,
    products = [],
    source = "cart", // 'prescription', 'product', 'cart'
    deliveryMethod: initialDeliveryMethod = "Order Pickup",
    productId,
    quantity: initialQuantity = 1,
  } = location.state || {};

  // Component state
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState(initialDeliveryMethod);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderItems, setOrderItems] = useState(products || []);
  const [shippingFee, setShippingFee] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [unavailableItems, setUnavailableItems] = useState([]);
  const [showInventoryError, setShowInventoryError] = useState(false);

  // Calculate totals
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingFee;

  useEffect(() => {
    // Set shipping fee based on delivery method
    if (deliveryMethod === "Deliver") {
      setShippingFee(300);
    } else {
      setShippingFee(0);
    }

    // Initialize page based on source
    initializeCheckout();
  }, [deliveryMethod]);

  const initializeCheckout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login to continue checkout");
        navigate("/");
        return;
      }

      // Handle different sources
      if (source === "prescription" && prescriptionId) {
        await fetchPrescriptionDetails(prescriptionId);
      } else if (source === "product" && productId) {
        await fetchProductDetails(productId, initialQuantity);
      } else if (source === "cart") {
        await fetchCartItems();
      } else {
        message.error("Invalid checkout source");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error initializing checkout:", error);
      message.error("Failed to initialize checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptionDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/api/customer-prescriptions/prescriptions/${id}/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success && response.data.products) {
        setOrderItems(response.data.products);
      } else {
        throw new Error("Failed to load prescription products");
      }
    } catch (error) {
      console.error("Error fetching prescription details:", error);
      message.error("Failed to load prescription items");
      // For development, set mock data
      setMockPrescriptionProducts();
    }
  };

  const fetchProductDetails = async (id, qty) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/productsDetails/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.product) {
        const product = response.data.product;
        setOrderItems([
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: qty,
            image: product.image,
          },
        ]);
      } else {
        throw new Error("Failed to load product details");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      message.error("Failed to load product details");
      // For development, set mock data
      setMockSingleProduct(id, qty);
    }
  };

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.items) {
        setOrderItems(response.data.items);
      } else {
        throw new Error("Failed to load cart items");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      message.error("Failed to load cart items");
      // For development, set mock data
      setMockCartItems();
    }
  };

  // Fix image placeholders using an absolute URL placeholder service
  const getImagePlaceholder = (width, height) => {
    // Use an external placeholder service that is guaranteed to work
    return `https://placehold.co/${width}x${height}`;
  };

  const setMockPrescriptionProducts = () => {
    setOrderItems([
      { id: 101, name: "Panadol", quantity: 10, price: 45, total: 450 },
      { id: 102, name: "Amoxicillin", quantity: 5, price: 120, total: 600 },
      { id: 103, name: "Vitamin C", quantity: 2, price: 80, total: 160 },
    ]);
  };

  const setMockSingleProduct = (id, qty) => {
    setOrderItems([
      {
        id: id,
        name: `Product ${id}`,
        price: 250,
        quantity: qty,
        image: getImagePlaceholder(400, 320),
      },
    ]);
  };

  const setMockCartItems = () => {
    setOrderItems([
      {
        id: 1,
        name: "Samahan",
        quantity: 2,
        price: 40,
        total: 80,
        image: getImagePlaceholder(80, 80),
      },
      {
        id: 2,
        name: "Yakipeyana",
        quantity: 1,
        price: 50,
        total: 50,
        image: getImagePlaceholder(80, 80),
      },
    ]);
  };

  const handleDeliveryMethodChange = (value) => {
    setDeliveryMethod(value);
    // Update form fields validation
    if (value === "Deliver") {
      form.validateFields(["deliveryAddress"]);
    }
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const handleNext = async () => {
    try {
      // Validate form fields for current step
      await form.validateFields();

      if (currentStep === 0) {
        // Move to payment step
        setCurrentStep(1);
      } else if (currentStep === 1) {
        // Show confirmation modal with proper messaging based on payment method
        const inventoryReducedMethod = paymentMethod === "creditCard";

        let confirmTitle = "Confirm Your Order";
        let confirmMessage = "";

        if (inventoryReducedMethod) {
          confirmMessage =
            "Your card will be charged immediately and the order will be processed.";
        } else {
          confirmMessage =
            "You will pay at our store when you pick up your order.";
        }

        confirm({
          title: confirmTitle,
          icon: <ExclamationCircleOutlined />,
          content: confirmMessage,
          okText: "Confirm Order",
          cancelText: "Cancel",
          onOk() {
            return processPayment();
          },
        });
      }
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const processPayment = async () => {
    try {
      setProcessingPayment(true);
      setErrorMessage("");
      setUnavailableItems([]);
      setShowInventoryError(false);

      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication required");
        navigate("/");
        return;
      }

      // Get form values - Ensure all required fields are properly collected
      const formValues = form.getFieldsValue(true);

      // Log form values for debugging
      console.log("Form values:", formValues);

      // Check for required fields
      if (!formValues.fullName) {
        throw new Error("Full name is required");
      }

      if (!formValues.phone) {
        throw new Error("Phone number is required");
      }

      // Map frontend payment methods to database ENUM values
      // Database expects: 'PayHere' or 'OnTheSpot'
      const dbPaymentMethod = (() => {
        switch (paymentMethod) {
          case "creditCard":
            return "PayHere"; // Credit card payments use PayHere
          case "cashOnPickup":
            return "OnTheSpot";
          default:
            return "PayHere"; // Default fallback
        }
      })();

      // Prepare common payload - Make sure required fields are included
      const payload = {
        deliveryMethod,
        // Use the mapped payment method value that matches your DB enum
        paymentMethod: dbPaymentMethod,
        // Explicitly set the address field based on delivery method
        // This is crucial because your database expects this field!
        address: deliveryMethod === "Deliver" ? formValues.deliveryAddress : "",
        fullName: formValues.fullName,
        phone: formValues.phone,
        email: formValues.email || "",
        total,
        subtotal,
        shippingFee,
        // Add telephone field which is expected by your backend
        // Convert phone to a plain string to avoid integer overflow issues
        telephone: String(formValues.phone),
      };

      // Add payment details if using credit card
      if (paymentMethod === "creditCard") {
        payload.paymentDetails = {
          cardholderName: formValues.cardholderName,
          cardNumber: formValues.cardNumber,
          expiryDate: formValues.expiryDate,
          cvv: formValues.cvv,
        };
      }

      // Debug payload
      console.log("Sending payload:", JSON.stringify(payload));

      let response;

      // API call based on source
      if (source === "prescription") {
        payload.prescriptionId = prescriptionId;
        response = await axios.post("/api/checkout/prescription", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else if (source === "product") {
        payload.productId = productId;
        payload.quantity = orderItems[0].quantity;
        response = await axios.post("/api/checkout/product", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        // Default cart checkout
        response = await axios.post("/api/checkout/cart", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (response.data.success) {
        message.success("Payment processed successfully");
        setOrderId(response.data.orderId);
        setOrderCompleted(true);
      } else {
        throw new Error(response.data.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);

      // Check for inventory issues (out of stock)
      if (error.response?.data?.unavailableItems) {
        setUnavailableItems(error.response.data.unavailableItems);
        setShowInventoryError(true);
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Failed to process payment. Please try again."
        );
      }

      message.error("Payment failed. Please check for errors.");
    } finally {
      setProcessingPayment(false);
    }
  };

  // If order completed, show success page
  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg rounded-lg overflow-hidden">
            <Result
              status="success"
              icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              title="Order Placed Successfully!"
              subTitle={`Order number: ${orderId}`}
              extra={[
                <Button
                  type="primary"
                  key="orders"
                  onClick={() => navigate("/orders")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View My Orders
                </Button>,
                <Button key="shop" onClick={() => navigate("/home")}>
                  Continue Shopping
                </Button>,
              ]}
            />

            <Divider />

            <div className="px-6 pb-6">
              <Title level={5}>Order Summary</Title>

              <List
                itemLayout="horizontal"
                dataSource={orderItems}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.name}
                      description={`Quantity: ${item.quantity}`}
                    />
                    <div className="text-right">
                      <Text>Rs.{(item.price * item.quantity).toFixed(2)}</Text>
                    </div>
                  </List.Item>
                )}
                footer={
                  <div>
                    <div className="flex justify-between py-2">
                      <Text>Subtotal</Text>
                      <Text>Rs.{subtotal.toFixed(2)}</Text>
                    </div>
                    <div className="flex justify-between py-2">
                      <Text>Shipping Fee</Text>
                      <Text>
                        {shippingFee > 0
                          ? `Rs.${shippingFee.toFixed(2)}`
                          : "Free"}
                      </Text>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex justify-between py-2">
                      <Text strong>Total</Text>
                      <Text strong className="text-lg text-blue-600">
                        Rs.{total.toFixed(2)}
                      </Text>
                    </div>
                  </div>
                }
              />

              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="mr-2 mt-1 text-blue-500">
                    {deliveryMethod === "Deliver" ? (
                      <HomeOutlined />
                    ) : (
                      <ShopOutlined />
                    )}
                  </div>
                  <div>
                    <Text strong className="text-blue-600">
                      {deliveryMethod === "Deliver"
                        ? "Delivery Information"
                        : "Pickup Information"}
                    </Text>
                    <p className="mt-1 text-sm text-gray-600">
                      {deliveryMethod === "Deliver"
                        ? `Your order will be delivered to: ${form.getFieldValue(
                            "deliveryAddress"
                          )}`
                        : "Your order will be ready for pickup at our store."}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      {paymentMethod === "creditCard"
                        ? "Your payment has been processed successfully."
                        : "You will pay when you pick up your order."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Inventory error modal
  if (showInventoryError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg rounded-lg overflow-hidden">
            <Result
              status="error"
              title="Inventory Issue"
              subTitle="We're sorry, but some items in your order are unavailable."
              icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
              extra={[
                <Button
                  type="primary"
                  key="goback"
                  onClick={() => {
                    setShowInventoryError(false);
                    if (source === "cart") {
                      navigate("/cart");
                    } else {
                      navigate(-1);
                    }
                  }}
                  danger
                >
                  Return to Cart
                </Button>,
              ]}
            />

            <div className="px-6 pb-6">
              <Title level={5}>Unavailable Items</Title>

              <List
                itemLayout="horizontal"
                dataSource={unavailableItems}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.name}
                      description={
                        <div>
                          <Text type="danger">
                            Requested: {item.requested}, Available:{" "}
                            {item.available}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />

              <Alert
                message="Please adjust your quantities and try again"
                type="warning"
                showIcon
                className="mt-4"
              />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between border-b pb-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
            />
            <Title level={4} className="m-0 text-center flex-grow">
              Checkout
            </Title>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>

          {/* Steps Indicator */}
          <Steps current={currentStep} className="px-6 pb-8">
            <Step title="Delivery Information" />
            <Step title="Payment" />
          </Steps>

          {loading ? (
            <div className="py-20 text-center">
              <Spin size="large" />
              <div className="mt-4">Loading order details...</div>
            </div>
          ) : (
            <div className="px-6">
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  fullName: "",
                  phone: "",
                  email: "",
                  deliveryAddress: "",
                  deliveryMethod: deliveryMethod,
                }}
                scrollToFirstError
              >
                {/* Step 1: Delivery Info */}
                {currentStep === 0 && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Form.Item
                        name="fullName"
                        label="Full Name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your full name",
                          },
                        ]}
                      >
                        <Input placeholder="Enter your full name" />
                      </Form.Item>

                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your phone number",
                          },
                        ]}
                      >
                        <Input placeholder="Enter your phone number" />
                      </Form.Item>
                    </div>

                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        {
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your email address" />
                    </Form.Item>

                    <Form.Item
                      name="deliveryMethod"
                      label="Delivery Method"
                      initialValue={deliveryMethod}
                    >
                      <Radio.Group
                        onChange={(e) =>
                          handleDeliveryMethodChange(e.target.value)
                        }
                        value={deliveryMethod}
                      >
                        <Space direction="vertical" className="w-full">
                          <Card
                            className={`border cursor-pointer w-full transition-all ${
                              deliveryMethod === "Order Pickup"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                            }`}
                            onClick={() =>
                              handleDeliveryMethodChange("Order Pickup")
                            }
                            hoverable
                          >
                            <Radio value="Order Pickup" className="w-full">
                              <div className="flex items-center ml-2">
                                <ShopOutlined className="text-lg mr-2" />
                                <div>
                                  <div className="font-medium">
                                    Store Pickup
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Pick up your order at our store
                                  </div>
                                </div>
                                <div className="ml-auto font-semibold text-green-600">
                                  Free
                                </div>
                              </div>
                            </Radio>
                          </Card>

                          <Card
                            className={`border cursor-pointer w-full transition-all ${
                              deliveryMethod === "Deliver"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                            }`}
                            onClick={() =>
                              handleDeliveryMethodChange("Deliver")
                            }
                            hoverable
                          >
                            <Radio value="Deliver" className="w-full">
                              <div className="flex items-center ml-2">
                                <HomeOutlined className="text-lg mr-2" />
                                <div>
                                  <div className="font-medium">
                                    Home Delivery
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Delivery to your specified address
                                  </div>
                                </div>
                                <div className="ml-auto font-semibold">
                                  Rs.300
                                </div>
                              </div>
                            </Radio>
                          </Card>
                        </Space>
                      </Radio.Group>
                    </Form.Item>

                    {deliveryMethod === "Deliver" && (
                      <Form.Item
                        name="deliveryAddress"
                        label="Delivery Address"
                        rules={[
                          {
                            required: deliveryMethod === "Deliver",
                            message: "Please enter your delivery address",
                          },
                        ]}
                      >
                        <Input.TextArea
                          rows={3}
                          placeholder="Enter your complete delivery address"
                        />
                      </Form.Item>
                    )}
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 1 && (
                  <div>
                    <Form.Item label="Select Payment Method">
                      <Radio.Group
                        onChange={(e) =>
                          handlePaymentMethodChange(e.target.value)
                        }
                        value={paymentMethod}
                        className="w-full"
                      >
                        <Space direction="vertical" className="w-full">
                          {/* Always show Credit Card option */}
                          <Card
                            className={`border cursor-pointer w-full transition-all ${
                              paymentMethod === "creditCard"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                            }`}
                            onClick={() =>
                              handlePaymentMethodChange("creditCard")
                            }
                            hoverable
                          >
                            <Radio value="creditCard" className="w-full">
                              <div className="flex items-center ml-2">
                                <CreditCardOutlined className="text-lg mr-2" />
                                <div>
                                  <div className="font-medium">
                                    Credit/Debit Card
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Pay securely with your card
                                  </div>
                                </div>
                              </div>
                            </Radio>
                          </Card>

                          {/* Show Pay at Store only for pickup method */}
                          {deliveryMethod === "Order Pickup" && (
                            <Card
                              className={`border cursor-pointer w-full transition-all ${
                                paymentMethod === "cashOnPickup"
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200"
                              }`}
                              onClick={() =>
                                handlePaymentMethodChange("cashOnPickup")
                              }
                              hoverable
                            >
                              <Radio value="cashOnPickup" className="w-full">
                                <div className="flex items-center ml-2">
                                  <DollarOutlined className="text-lg mr-2" />
                                  <div>
                                    <div className="font-medium">
                                      Pay at Store
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Pay when you collect your order
                                    </div>
                                  </div>
                                </div>
                              </Radio>
                            </Card>
                          )}
                        </Space>
                      </Radio.Group>
                    </Form.Item>

                    {/* Only show card fields for credit card option */}
                    {paymentMethod === "creditCard" && (
                      <div className="mt-6 space-y-4">
                        <Form.Item
                          name="cardholderName"
                          label="Cardholder Name"
                          rules={[
                            {
                              required: paymentMethod === "creditCard",
                              message: "Please enter the cardholder name",
                            },
                          ]}
                        >
                          <Input placeholder="Name on card" />
                        </Form.Item>

                        <Form.Item
                          name="cardNumber"
                          label="Card Number"
                          rules={[
                            {
                              required: paymentMethod === "creditCard",
                              message: "Please enter your card number",
                            },
                            {
                              pattern: /^[0-9]{16}$/,
                              message:
                                "Please enter a valid 16-digit card number",
                            },
                          ]}
                        >
                          <Input
                            placeholder="1234 5678 9012 3456"
                            maxLength={16}
                          />
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-4">
                          <Form.Item
                            name="expiryDate"
                            label="Expiry Date (MM/YY)"
                            rules={[
                              {
                                required: paymentMethod === "creditCard",
                                message: "Required",
                              },
                              {
                                pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                                message: "Format: MM/YY",
                              },
                            ]}
                          >
                            <Input placeholder="MM/YY" maxLength={5} />
                          </Form.Item>

                          <Form.Item
                            name="cvv"
                            label="CVV"
                            rules={[
                              {
                                required: paymentMethod === "creditCard",
                                message: "Required",
                              },
                              {
                                pattern: /^[0-9]{3,4}$/,
                                message: "3 or 4 digits only",
                              },
                            ]}
                          >
                            <Input placeholder="123" maxLength={4} />
                          </Form.Item>
                        </div>

                        <Alert
                          type="info"
                          message="Inventory will be reduced immediately"
                          description="When paying by credit card, inventory is reserved for you immediately."
                          showIcon
                        />
                      </div>
                    )}

                    {paymentMethod !== "creditCard" && (
                      <Alert
                        type="warning"
                        message="Inventory will be reduced at payment time"
                        description="The products will be reserved for you, but inventory will only be reduced when you pay at the store."
                        showIcon
                        className="mt-6"
                      />
                    )}
                  </div>
                )}
              </Form>

              {/* Order Summary */}
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <Title level={5} className="mb-4">
                  Order Summary
                </Title>

                <List
                  itemLayout="horizontal"
                  dataSource={orderItems}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.name}
                        description={`Quantity: ${item.quantity}`}
                      />
                      <div className="text-right">
                        <Text>
                          Rs.{(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </div>
                    </List.Item>
                  )}
                  footer={
                    <div>
                      <div className="flex justify-between py-2">
                        <Text>Subtotal</Text>
                        <Text>Rs.{subtotal.toFixed(2)}</Text>
                      </div>
                      <div className="flex justify-between py-2">
                        <Text>Shipping Fee</Text>
                        <Text>
                          {shippingFee > 0
                            ? `Rs.${shippingFee.toFixed(2)}`
                            : "Free"}
                        </Text>
                      </div>
                      <Divider className="my-2" />
                      <div className="flex justify-between py-2">
                        <Text strong>Total</Text>
                        <Text strong className="text-lg text-blue-600">
                          Rs.{total.toFixed(2)}
                        </Text>
                      </div>
                    </div>
                  }
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                  {errorMessage}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <Button onClick={handleBack}>Back</Button>
                <Button
                  type="primary"
                  onClick={handleNext}
                  loading={processingPayment}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === 0 ? "Continue to Payment" : "Place Order"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
