import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import pharmacyIllustration from "./login.png";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    api: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value) error = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Please enter a valid email";
      }
    }

    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 8) error = "Password must be 8+ characters";
    }

    return error;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [id]: fieldValue,
    });

    // Clear API error when user starts typing
    if (errors.api) {
      setErrors({
        ...errors,
        api: "",
      });
    }

    // Real-time validation
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: validateField(id, fieldValue),
      });
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    setErrors({
      ...errors,
      [id]: validateField(id, value),
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   // Validate all fields
  //   const newErrors = {
  //     email: validateField("email", formData.email),
  //     password: validateField("password", formData.password),
  //   };

  //   setErrors({ ...newErrors, api: "" });

  //   // Check if any errors exist
  //   if (Object.values(newErrors).some((error) => error)) {
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   try {
  //     // Use axios to call the login API
  //     const response = await axios.post(
  //       "http://localhost:5000/customers/login",
  //       {
  //         email: formData.email,
  //         password: formData.password,
  //       }
  //     );

  //     // Handle successful login
  //     console.log("Login successful:", response.data);

  //     // Store customer data in localStorage or state management
  //     if (formData.rememberMe) {
  //       localStorage.setItem(
  //         "customer",
  //         JSON.stringify(response.data.customer)
  //       );
  //     } else {
  //       sessionStorage.setItem(
  //         "customer",
  //         JSON.stringify(response.data.customer)
  //       );
  //     }

  //     // Redirect to dashboard or home page
  //     navigate("/dashboard");
  //   } catch (error) {
  //     console.error("Login error:", error);

  //     // Handle different types of errors
  //     if (error.response) {
  //       // The request was made and the server responded with a status code
  //       if (error.response.status === 401) {
  //         setErrors({
  //           ...errors,
  //           api: "Invalid email or password. Please try again.",
  //         });
  //       } else {
  //         setErrors({
  //           ...errors,
  //           api:
  //             error.response.data.message || "Login failed. Please try again.",
  //         });
  //       }
  //     } else if (error.request) {
  //       // The request was made but no response was received
  //       setErrors({
  //         ...errors,
  //         api: "No response from server. Please check your connection.",
  //       });
  //     } else {
  //       // Something happened in setting up the request
  //       setErrors({
  //         ...errors,
  //         api: "Login failed. Please try again.",
  //       });
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors({ ...newErrors, api: "" });

    if (Object.values(newErrors).some((error) => error)) {
      setIsSubmitting(false);
      return;
    }

    // try {
    //   const response = await axios.post("http://localhost:5000/auth/login", {
    //     email: formData.email,
    //     password: formData.password,
    //   });

    //   console.log("Full response:", response.data); // Debug log

    //   if (response.data.token) {
    //     // Store the token
    //     localStorage.setItem("token", response.data.token);

    //     // Store user data - ensure this matches your backend response
    //     localStorage.setItem(
    //       "user",
    //       JSON.stringify({
    //         id: response.data.user?.id || response.data.userId, // Try different properties
    //         email: response.data.user?.email || formData.email,
    //         name: response.data.user?.name || "",
    //       })
    //     );
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Store the token
      localStorage.setItem("token", response.data.token);

      // Store user data CORRECTLY using the backend response structure
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.user.manager_id, // <-- This is the key change
          email: formData.email,
          name: `${response.data.user.F_name} ${response.data.user.L_name}`.trim(),
          // Include other fields you need
          ...response.data.user, // Spread the rest of user data
        })
      );

      // Store role
      localStorage.setItem("role", response.data.role);

      // Debug logs
      console.log("Stored user:", JSON.parse(localStorage.getItem("user")));
      console.log("Stored role:", localStorage.getItem("role"));

      // Redirect
      switch (response.data.role) {
        case "manager":
          navigate("/manager/dashboard");
          break;
        case "staff":
          navigate("/staff/dashboard");
          break;
        case "supplier":
          navigate("/supplier/dashboard");
          break;
        default:
          navigate("/dashboard"); // Customer dashboard
      }
    } catch (error) {
      // Error handling remains the same
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.email && formData.password && !errors.email && !errors.password;

  return (
    <div className="flex w-full min-h-screen bg-white">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-4 md:p-8">
        {/* Left side - Illustration */}
        <div className="flex items-center justify-center w-full md:w-1/2 p-6">
          <img
            src={pharmacyIllustration}
            alt="Pharmacy illustration"
            className="w-full max-w-md"
          />
        </div>

        {/* Right side - Login form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-6">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-5xl font-semibold text-center text-gray-800 mb-2">
              Log in
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Welcome back! Please enter your details.
            </p>

            {/* API Error Display */}
            {errors.api && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
                {errors.api}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email input */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-600 text-sm mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`placeholder:text-gray-400 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password input with visibility toggle */}
              <div className="mb-4 relative">
                <label
                  htmlFor="password"
                  className="block text-gray-600 text-sm mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="**********"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`placeholder:text-gray-400 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      outline: "none",
                    }}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign in button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md ${
                  !isFormValid || isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                } transition duration-200 mb-4 flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>

              {/* Sign up link */}
              <p className="text-center text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
