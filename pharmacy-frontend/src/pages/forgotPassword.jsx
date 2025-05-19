// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Card,
//   Form,
//   Input,
//   Button,
//   Steps,
//   message,
//   Typography,
//   Divider,
//   Alert,
// } from "antd";
// import {
//   MailOutlined,
//   LockOutlined,
//   KeyOutlined,
//   ArrowLeftOutlined,
//   SafetyOutlined,
// } from "@ant-design/icons";
// import axios from "axios";

// const { Title, Text, Paragraph } = Typography;
// const { Step } = Steps;

// const ForgotPassword = () => {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [otpForm] = Form.useForm();
//   const [newPasswordForm] = Form.useForm();

//   const [currentStep, setCurrentStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [userEmail, setUserEmail] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [userType, setUserType] = useState("");

//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [countdown]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const handleRequestOTP = async () => {
//     try {
//       await form.validateFields();
//       setLoading(true);

//       const email = form.getFieldValue("email");

//       const response = await axios.post("/api/auth/request-otp", { email });

//       if (response.data.success) {
//         setUserEmail(email);
//         setUserType(response.data.userType);
//         setOtpSent(true);
//         setCurrentStep(1);
//         setCountdown(300); // 5 minutes countdown
//         message.success("OTP has been sent to your email");
//       } else {
//         message.error(response.data.message || "Failed to send OTP");
//       }
//     } catch (error) {
//       if (error.response?.data?.message) {
//         message.error(error.response.data.message);
//       } else if (error.message) {
//         message.error(error.message);
//       } else {
//         message.error("Failed to send OTP. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOTP = async () => {
//     try {
//       await otpForm.validateFields();
//       setLoading(true);

//       const otp = otpForm.getFieldValue("otp");

//       const response = await axios.post("/api/auth/verify-otp", {
//         email: userEmail,
//         otp,
//         userType,
//       });

//       if (response.data.success) {
//         setOtpVerified(true);
//         setCurrentStep(2);
//         message.success("OTP verified successfully");
//       } else {
//         message.error(response.data.message || "Invalid OTP");
//       }
//     } catch (error) {
//       if (error.response?.data?.message) {
//         message.error(error.response.data.message);
//       } else if (error.message) {
//         message.error(error.message);
//       } else {
//         message.error("Failed to verify OTP. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     try {
//       setLoading(true);

//       const response = await axios.post("/api/auth/request-otp", {
//         email: userEmail,
//         resend: true,
//       });

//       if (response.data.success) {
//         setCountdown(300); // Reset 5 minutes countdown
//         message.success("New OTP has been sent to your email");
//       } else {
//         message.error(response.data.message || "Failed to resend OTP");
//       }
//     } catch (error) {
//       message.error("Failed to resend OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResetPassword = async () => {
//     try {
//       await newPasswordForm.validateFields();
//       setLoading(true);

//       const password = newPasswordForm.getFieldValue("password");

//       const response = await axios.post("/api/auth/reset-password", {
//         email: userEmail,
//         password,
//         userType,
//       });

//       if (response.data.success) {
//         message.success("Password reset successfully");
//         setTimeout(() => {
//           navigate("/");
//         }, 1500);
//       } else {
//         message.error(response.data.message || "Failed to reset password");
//       }
//     } catch (error) {
//       if (error.response?.data?.message) {
//         message.error(error.response.data.message);
//       } else if (error.message) {
//         message.error(error.message);
//       } else {
//         message.error("Failed to reset password. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
//       <Card className="w-full max-w-md shadow-lg">
//         <div className="flex justify-between items-center mb-6">
//           <Link to="/">
//             <Button type="text" icon={<ArrowLeftOutlined />}>
//               Back
//             </Button>
//           </Link>
//           <Title level={4} className="m-0 text-center flex-grow text-blue-600">
//             Reset Your Password
//           </Title>
//           <div className="w-8"></div> {/* For balance */}
//         </div>

//         <Steps current={currentStep} className="mb-8">
//           <Step title="Request" />
//           <Step title="Verify" />
//           <Step title="Reset" />
//         </Steps>

//         {currentStep === 0 && (
//           <div>
//             <Paragraph className="text-gray-600 mb-6">
//               Enter your email address and we'll send you a One-Time Password
//               (OTP) to verify your identity.
//             </Paragraph>

//             <Form form={form} layout="vertical" initialValues={{ email: "" }}>
//               <Form.Item
//                 name="email"
//                 label="Email Address"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter your email address",
//                   },
//                   { type: "email", message: "Please enter a valid email" },
//                 ]}
//               >
//                 <Input
//                   prefix={<MailOutlined className="text-gray-400" />}
//                   placeholder="Enter your email"
//                 />
//               </Form.Item>

//               <Form.Item className="mt-6">
//                 <Button
//                   type="primary"
//                   block
//                   onClick={handleRequestOTP}
//                   loading={loading}
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   Send OTP
//                 </Button>
//               </Form.Item>
//             </Form>
//           </div>
//         )}

//         {currentStep === 1 && (
//           <div>
//             <Alert
//               message="OTP Sent"
//               description={`We've sent a verification code to ${userEmail}. Please check your inbox and enter the code below.`}
//               type="success"
//               showIcon
//               className="mb-6"
//             />

//             <Form form={otpForm} layout="vertical">
//               <Form.Item
//                 name="otp"
//                 label="One-Time Password (OTP)"
//                 rules={[
//                   { required: true, message: "Please enter the OTP" },
//                   { len: 6, message: "OTP should be 6 digits" },
//                 ]}
//               >
//                 <Input
//                   prefix={<KeyOutlined className="text-gray-400" />}
//                   placeholder="Enter 6-digit OTP"
//                   maxLength={6}
//                   size="large"
//                   className="text-center font-mono text-lg"
//                 />
//               </Form.Item>

//               <div className="text-center mb-4">
//                 {countdown > 0 ? (
//                   <Text className="text-gray-500">
//                     Resend OTP in {formatTime(countdown)}
//                   </Text>
//                 ) : (
//                   <Button
//                     type="link"
//                     onClick={handleResendOTP}
//                     disabled={loading}
//                   >
//                     Resend OTP
//                   </Button>
//                 )}
//               </div>

//               <Form.Item className="mt-4">
//                 <Button
//                   type="primary"
//                   block
//                   onClick={handleVerifyOTP}
//                   loading={loading}
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   Verify OTP
//                 </Button>
//               </Form.Item>
//             </Form>
//           </div>
//         )}

//         {currentStep === 2 && (
//           <div>
//             <Alert
//               message="OTP Verified"
//               description="Your identity has been verified. Please create a new password for your account."
//               type="success"
//               showIcon
//               className="mb-6"
//             />

//             <Form form={newPasswordForm} layout="vertical">
//               <Form.Item
//                 name="password"
//                 label="New Password"
//                 rules={[
//                   { required: true, message: "Please enter a new password" },
//                   { min: 8, message: "Password must be at least 8 characters" },
//                   {
//                     pattern: /^(?=.*[A-Z])(?=.*\d)/,
//                     message:
//                       "Password must contain at least one uppercase letter and one number",
//                   },
//                 ]}
//                 hasFeedback
//               >
//                 <Input.Password
//                   prefix={<LockOutlined className="text-gray-400" />}
//                   placeholder="Enter new password"
//                 />
//               </Form.Item>

//               <Form.Item
//                 name="confirmPassword"
//                 label="Confirm Password"
//                 dependencies={["password"]}
//                 hasFeedback
//                 rules={[
//                   { required: true, message: "Please confirm your password" },
//                   ({ getFieldValue }) => ({
//                     validator(_, value) {
//                       if (!value || getFieldValue("password") === value) {
//                         return Promise.resolve();
//                       }
//                       return Promise.reject(
//                         new Error("The two passwords do not match")
//                       );
//                     },
//                   }),
//                 ]}
//               >
//                 <Input.Password
//                   prefix={<LockOutlined className="text-gray-400" />}
//                   placeholder="Confirm new password"
//                 />
//               </Form.Item>

//               <Form.Item className="mt-6">
//                 <Button
//                   type="primary"
//                   block
//                   onClick={handleResetPassword}
//                   loading={loading}
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   Reset Password
//                 </Button>
//               </Form.Item>
//             </Form>
//           </div>
//         )}

//         <Divider />
//         {/*
//         <div className="text-center">
//           <Text className="text-gray-500">Remember your password?</Text>
//           <Link to="/" className="ml-1 text-blue-600 hover:text-blue-800">
//             Sign in
//           </Link>
//         </div> */}

//         <div className="mt-6 flex justify-center">
//           <div className="text-center text-blue-600 font-bold text-xl">
//             L.W.Pharmacy
//           </div>
//         </div>
//       </Card>

//       <div className="mt-4 text-center text-gray-500 text-xs">
//         © {new Date().getFullYear()} L.W.Pharmacy. All rights reserved.
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Steps,
  message,
  Typography,
  Divider,
  Alert,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  KeyOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [newPasswordForm] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleRequestOTP = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      const email = form.getFieldValue("email");

      const response = await axios.post(
        "/api/auth/forgotpassword/request-otp",
        { email }
      );

      if (response.data.success) {
        setUserEmail(email);
        setUserType(response.data.userType);
        setOtpSent(true);
        setCurrentStep(1);
        setCountdown(300); // 5 minutes countdown
        message.success("OTP has been sent to your email");
      } else {
        message.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error("Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await otpForm.validateFields();
      setLoading(true);

      const otp = otpForm.getFieldValue("otp");

      const response = await axios.post("/api/auth/forgotpassword/verify-otp", {
        email: userEmail,
        otp,
        userType,
      });

      if (response.data.success) {
        setOtpVerified(true);
        setCurrentStep(2);
        message.success("OTP verified successfully");
      } else {
        message.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error("Failed to verify OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "/api/auth/forgotpassword/request-otp",
        {
          email: userEmail,
          resend: true,
        }
      );

      if (response.data.success) {
        setCountdown(300); // Reset 5 minutes countdown
        message.success("New OTP has been sent to your email");
      } else {
        message.error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      message.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      await newPasswordForm.validateFields();
      setLoading(true);

      const password = newPasswordForm.getFieldValue("password");
      const response = await axios.post(
        "/api/auth/forgotpassword/reset-password",
        {
          email: userEmail,
          password,
          userType,
        }
      );

      if (response.data.success) {
        message.success("Password reset successfully");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        message.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Custom validator for email with enhanced validation
  const validateEmail = (_, value) => {
    if (!value) return Promise.reject("Email is required");
    if (value.length > 254) return Promise.reject("Email is too long");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return Promise.reject("Please enter a valid email");
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
      return Promise.reject("Please enter a valid email format");
    if (/\.{2,}/.test(value))
      return Promise.reject("Email cannot contain consecutive dots");
    if (/^[.-]|[.-]@|@[.-]/.test(value))
      return Promise.reject(
        "Email cannot start or end with dots or hyphens in local or domain parts"
      );
    if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(value))
      return Promise.reject("Invalid email format");

    return Promise.resolve();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button type="text" icon={<ArrowLeftOutlined />}>
              Back
            </Button>
          </Link>
          <Title level={4} className="m-0 text-center flex-grow text-blue-600">
            Reset Your Password
          </Title>
          <div className="w-8"></div> {/* For balance */}
        </div>

        <Steps current={currentStep} className="mb-8">
          <Step title="Request" />
          <Step title="Verify" />
          <Step title="Reset" />
        </Steps>

        {currentStep === 0 && (
          <div>
            <Paragraph className="text-gray-600 mb-6">
              Enter your email address and we'll send you a One-Time Password
              (OTP) to verify your identity.
            </Paragraph>

            <Form form={form} layout="vertical" initialValues={{ email: "" }}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[{ validator: validateEmail }]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Enter your email"
                />
              </Form.Item>

              <Form.Item className="mt-6">
                <Button
                  type="primary"
                  block
                  onClick={handleRequestOTP}
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Send OTP
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <Alert
              message="OTP Sent"
              description={`We've sent a verification code to ${userEmail}. Please check your inbox and enter the code below.`}
              type="success"
              showIcon
              className="mb-6"
            />

            <Form form={otpForm} layout="vertical">
              <Form.Item
                name="otp"
                label="One-Time Password (OTP)"
                rules={[
                  { required: true, message: "Please enter the OTP" },
                  { len: 6, message: "OTP should be 6 digits" },
                ]}
              >
                <Input
                  prefix={<KeyOutlined className="text-gray-400" />}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  size="large"
                  className="text-center font-mono text-lg"
                />
              </Form.Item>

              <div className="text-center mb-4">
                {countdown > 0 ? (
                  <Text className="text-gray-500">
                    Resend OTP in {formatTime(countdown)}
                  </Text>
                ) : (
                  <Button
                    type="link"
                    onClick={handleResendOTP}
                    disabled={loading}
                  >
                    Resend OTP
                  </Button>
                )}
              </div>

              <Form.Item className="mt-4">
                <Button
                  type="primary"
                  block
                  onClick={handleVerifyOTP}
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Verify OTP
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <Alert
              message="OTP Verified"
              description="Your identity has been verified. Please create a new password for your account."
              type="success"
              showIcon
              className="mb-6"
            />

            <Form form={newPasswordForm} layout="vertical">
              <Form.Item
                name="password"
                label="New Password"
                rules={[
                  { required: true, message: "Please enter a new password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                  {
                    pattern: /^(?=.*[A-Z])(?=.*\d)/,
                    message:
                      "Password must contain at least one uppercase letter and one number",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Enter new password"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Confirm new password"
                />
              </Form.Item>

              <Form.Item className="mt-6">
                <Button
                  type="primary"
                  block
                  onClick={handleResetPassword}
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        <Divider />
        {/* 
        <div className="text-center">
          <Text className="text-gray-500">Remember your password?</Text>
          <Link to="/" className="ml-1 text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </div> */}

        <div className="mt-6 flex justify-center">
          <div className="text-center text-blue-600 font-bold text-xl">
            L.W.Pharmacy
          </div>
        </div>
      </Card>

      <div className="mt-4 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} L.W.Pharmacy. All rights reserved.
      </div>
    </div>
  );
};

export default ForgotPassword;
