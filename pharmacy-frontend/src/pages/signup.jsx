// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import pharmacyIllustration from "./signup.png";
// import axios from "axios";

// const SignUp = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "customer",
//   });

//   const [errors, setErrors] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "",
//     api: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Toggle password visibility
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   // Prevent paste in confirm password field
//   const handlePaste = (e) => {
//     e.preventDefault();
//     setErrors({
//       ...errors,
//       confirmPassword: "Pasting is not allowed in this field",
//     });
//   };

//   const validateField = (name, value) => {
//     let error = "";

//     switch (name) {
//       case "name":
//         if (!value.trim()) error = "Name is required";
//         else if (value.length < 2) error = "Name must be at least 2 characters";
//         break;

//       case "email":
//         if (!value) error = "Email is required";
//         else if (value.length > 254) error = "Email is too long";
//         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//           error = "Please enter a valid email";
//         } else if (
//           !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
//         ) {
//           error = "Please enter a valid email format";
//         } else if (/\.{2,}/.test(value)) {
//           error = "Email cannot contain consecutive dots";
//         } else if (/^[.-]|[.-]@|@[.-]/.test(value)) {
//           error =
//             "Email cannot start or end with dots or hyphens in local or domain parts";
//         } else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(value)) {
//           error = "Invalid email format";
//         }
//         break;

//       case "password":
//         if (!value) error = "Password is required";
//         else if (value.length < 8) error = "Password must be 8+ characters";
//         else if (!/[A-Z]/.test(value))
//           error = "Include at least one uppercase letter";
//         else if (!/[0-9]/.test(value)) error = "Include at least one number";
//         break;

//       case "confirmPassword":
//         if (!value) error = "Please confirm your password";
//         else if (value !== formData.password) error = "Passwords don't match";
//         break;

//       default:
//         break;
//     }

//     return error;
//   };

//   const handleChange = (e) => {
//     const { id, value } = e.target;

//     setFormData({
//       ...formData,
//       [id]: value,
//     });

//     // Clear error when user starts typing
//     if (errors[id]) {
//       setErrors({
//         ...errors,
//         [id]: validateField(id, value),
//       });
//     }
//   };

//   const handleBlur = (e) => {
//     const { id, value } = e.target;
//     setErrors({
//       ...errors,
//       [id]: validateField(id, value),
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validate all fields
//     const newErrors = {
//       name: validateField("name", formData.name),
//       email: validateField("email", formData.email),
//       password: validateField("password", formData.password),
//       confirmPassword: validateField(
//         "confirmPassword",
//         formData.confirmPassword
//       ),
//       role: validateField("role", formData.role),
//     };

//     setErrors({ ...newErrors, api: "" });

//     // Check if any errors exist
//     if (Object.values(newErrors).some((error) => error)) {
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       let endpoint = "http://localhost:5000/auth/register";

//       const userData = {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         role: "customer",
//       };

//       const response = await axios.post(endpoint, userData);
//       console.log("Registration successful:", response.data);

//       // Redirect to login page or appropriate dashboard
//       navigate("/login", {
//         state: {
//           message: "Registration successful! Please log in.",
//           success: true,
//           ...(response.data.userId && { userId: response.data.userId }),
//         },
//         replace: true,
//       });
//     } catch (error) {
//       console.error("Registration error:", error);

//       if (error.response) {
//         // The request was made and the server responded with a status code
//         setErrors({
//           ...errors,
//           api:
//             error.response.data.message ||
//             "Registration failed. Please try again.",
//         });
//       } else if (error.request) {
//         // The request was made but no response was received
//         setErrors({
//           ...errors,
//           api: "No response from server. Please check your connection.",
//         });
//       } else {
//         // Something happened in setting up the request
//         setErrors({
//           ...errors,
//           api: "Registration failed. Please try again.",
//         });
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const isFormValid =
//     formData.name &&
//     formData.email &&
//     formData.password &&
//     formData.confirmPassword &&
//     formData.role &&
//     !errors.name &&
//     !errors.email &&
//     !errors.password &&
//     !errors.confirmPassword &&
//     !errors.role;

//   return (
//     <div className="flex w-full min-h-screen bg-white">
//       <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-4 md:p-8">
//         {/* Left side - Illustration */}
//         <div className="flex items-center justify-center w-full md:w-1/2 p-6">
//           <img
//             src={pharmacyIllustration}
//             alt="Pharmacy illustration"
//             className="w-full max-w-md"
//           />
//         </div>

//         {/* Right side - Sign up form */}
//         <div className="flex flex-col justify-center w-full md:w-1/2 p-6">
//           <div className="max-w-md mx-auto w-full">
//             <h2 className="text-5xl font-semibold text-center text-gray-800 mb-2">
//               Create an account
//             </h2>
//             <p className="text-gray-600 mb-6 text-center">
//               Welcome! Add your details to sign up
//             </p>

//             {/* API Error Display */}
//             {errors.api && (
//               <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
//                 {errors.api}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} noValidate>
//               {/* Name input */}
//               <div className="mb-4">
//                 <label
//                   htmlFor="name"
//                   className="block text-gray-600 text-sm mb-2"
//                 >
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   placeholder="Enter your full name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   required
//                   className={`placeholder:text-gray-400 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
//                     errors.name
//                       ? "border-red-500 focus:ring-red-500"
//                       : "border-gray-300 focus:ring-blue-500"
//                   }`}
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-xs mt-1">{errors.name}</p>
//                 )}
//               </div>

//               {/* Email input */}
//               <div className="mb-4">
//                 <label
//                   htmlFor="email"
//                   className="block text-gray-600 text-sm mb-2"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   required
//                   className={`placeholder:text-gray-400 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
//                     errors.email
//                       ? "border-red-500 focus:ring-red-500"
//                       : "border-gray-300 focus:ring-blue-500"
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                 )}
//               </div>

//               {/* Role Selection
//               <div className="mb-4">
//                 <label
//                   htmlFor="role"
//                   className="block text-gray-600 text-sm mb-2"
//                 >
//                   Register as
//                 </label>
//                 <select
//                   id="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   required
//                   className={`placeholder:text-gray-400 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
//                     errors.role
//                       ? "border-red-500 focus:ring-red-500"
//                       : "border-gray-300 focus:ring-blue-500"
//                   }`}
//                 >
//                   <option value="customer">Customer</option>
//                   <option value="supplier">Supplier</option>
//                   <option value="staff">Pharmacy Staff</option>
//                   <option value="manager">Manager</option>
//                 </select>
//                 {errors.role && (
//                   <p className="text-red-500 text-xs mt-1">{errors.role}</p>
//                 )}
//               </div> */}

//               {/* Password input */}
//               <div className="mb-4 relative">
//                 <label
//                   htmlFor="password"
//                   className="block text-gray-600 text-sm mb-2"
//                 >
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     placeholder="Create a password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     required
//                     className={`placeholder:text-gray-400 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
//                       errors.password
//                         ? "border-red-500 focus:ring-red-500"
//                         : "border-gray-300 focus:ring-blue-500"
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={togglePasswordVisibility}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 border-none focus:outline-none"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                   >
//                     {showPassword ? (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//                         />
//                       </svg>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                         />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//                 {errors.password ? (
//                   <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//                 ) : (
//                   <p className="text-gray-500 text-xs mt-1">
//                     Must be at least 8 characters with one number and uppercase
//                     letter
//                   </p>
//                 )}
//               </div>

//               {/* Confirm Password input */}
//               <div className="mb-6 relative">
//                 <label
//                   htmlFor="confirmPassword"
//                   className="block text-gray-600 text-sm mb-2"
//                 >
//                   Re-enter Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     id="confirmPassword"
//                     placeholder="Re-enter your password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     onPaste={handlePaste}
//                     required
//                     className={`placeholder:text-gray-400 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
//                       errors.confirmPassword
//                         ? "border-red-500 focus:ring-red-500"
//                         : "border-gray-300 focus:ring-blue-500"
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={toggleConfirmPasswordVisibility}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 border-none focus:outline-none"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                   >
//                     {showConfirmPassword ? (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//                         />
//                       </svg>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                         />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.confirmPassword}
//                   </p>
//                 )}
//               </div>

//               {/* Sign up button */}
//               <button
//                 type="submit"
//                 disabled={!isFormValid || isSubmitting}
//                 className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md ${
//                   !isFormValid || isSubmitting
//                     ? "opacity-50 cursor-not-allowed"
//                     : "hover:bg-blue-700"
//                 } transition duration-200 mb-4 flex items-center justify-center`}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Creating account...
//                   </>
//                 ) : (
//                   "Get started"
//                 )}
//               </button>

//               {/* Login link */}
//               <p className="text-center text-gray-600 text-sm">
//                 Already have an account?{" "}
//                 <Link to="/login" className="text-blue-600 hover:underline">
//                   Log in
//                 </Link>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import pharmacyIllustration from "./signup.png";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    api: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Prevent paste in confirm password field
  const handlePaste = (e) => {
    e.preventDefault();
    setErrors({
      ...errors,
      confirmPassword: "Pasting is not allowed in this field",
    });
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.length < 2) error = "Name must be at least 2 characters";
        break;

      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email";
        }
        break;

      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8) error = "Password must be 8+ characters";
        else if (!/[A-Z]/.test(value))
          error = "Include at least one uppercase letter";
        else if (!/[0-9]/.test(value)) error = "Include at least one number";
        break;

      case "confirmPassword":
        if (!value) error = "Please confirm your password";
        else if (value !== formData.password) error = "Passwords don't match";
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: value,
    });

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: validateField(id, value),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword
      ),
    };

    setErrors({ ...newErrors, api: "" });

    // Check if any errors exist
    if (Object.values(newErrors).some((error) => error)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = "http://localhost:5000/auth/register";
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "customer",
      };

      const response = await axios.post(endpoint, userData);

      // Always redirect to login after successful registration
      navigate("/login", {
        state: {
          message: "Registration successful! Please log in.",
          success: true,
          // Only pass userId if it exists in response
          ...(response.data.userId && { userId: response.data.userId }),
          // Pass email for potential auto-fill
          email: formData.email,
        },
        replace: true, // Prevent going back to signup with back button
      });
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }

      setErrors({
        ...errors,
        api: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    !errors.name &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

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

        {/* Right side - Sign up form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-6">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-5xl font-semibold text-center text-gray-800 mb-2">
              Create an account
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Welcome! Add your details to sign up
            </p>

            {/* API Error Display */}
            {errors.api && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
                {errors.api}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Name input */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-600 text-sm mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`placeholder:text-gray-400 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

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

              {/* Password input */}
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
                    placeholder="Create a password"
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 border-none focus:outline-none"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
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
                {errors.password ? (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">
                    Must be at least 8 characters with one number and uppercase
                    letter
                  </p>
                )}
              </div>

              {/* Confirm Password input */}
              <div className="mb-6 relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-600 text-sm mb-2"
                >
                  Re-enter Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                    required
                    className={`placeholder:text-gray-400 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 border-none focus:outline-none"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Sign up button */}
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
                    Creating account...
                  </>
                ) : (
                  "Get started"
                )}
              </button>

              {/* Login link */}
              <p className="text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
