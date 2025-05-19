// // const jwt = require("jsonwebtoken");
// // const { db } = require("../../db");

// // const authenticate = async (req, res, next) => {
// //   try {
// //     const token = req.header("Authorization")?.replace("Bearer ", "");

// //     if (!token) {
// //       throw new Error("Authentication required");
// //     }

// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //     // Determine which table to check based on role
// //     let table, idField;
// //     switch (decoded.role) {
// //       case "customer":
// //         table = "customer";
// //         idField = "customer_id";
// //         break;
// //       case "staff":
// //         table = "pharmacy_staff";
// //         idField = "pharmacy_staff_id";
// //         break;
// //       case "manager":
// //         table = "manager";
// //         idField = "manager_id";
// //         break;
// //       case "supplier":
// //         table = "supplier";
// //         idField = "sup_id";
// //         break;
// //       default:
// //         throw new Error("Invalid user role");
// //     }

// //     // Find user in the appropriate table
// //     const [rows] = await db.execute(
// //       `SELECT * FROM ${table} WHERE ${idField} = ?`,
// //       [decoded.id]
// //     );

// //     if (rows.length === 0) {
// //       throw new Error("User not found");
// //     }

// //     req.user = rows[0];
// //     req.user.role = decoded.role;
// //     next();
// //   } catch (error) {
// //     res.status(401).json({
// //       success: false,
// //       message: error.message || "Please authenticate",
// //     });
// //   }
// // };

// // const authorize = (roles = []) => {
// //   return (req, res, next) => {
// //     if (!roles.includes(req.user.role)) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "Unauthorized access",
// //       });
// //     }
// //     next();
// //   };
// // };

// // module.exports = {
// //   authenticate,
// //   authorize,
// // };

// const jwt = require("jsonwebtoken");
// const { db } = require("../../db");

// const authenticate = async (req, res, next) => {
//   try {
//     // Check for token in both header and cookies
//     const token =
//       req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.token;
//     console.log("Received token:", token); // Debugging line

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Validate token structure
//     if (!decoded.id || !decoded.role) {
//       throw new Error("Invalid token structure");
//     }

//     // Determine which table to check
//     const tables = {
//       customer: { table: "customer", idField: "customer_id" },
//       staff: { table: "pharmacy_staff", idField: "pharmacy_staff_id" },
//       manager: { table: "manager", idField: "manager_id" },
//       supplier: { table: "supplier", idField: "sup_id" },
//     };

//     const config = tables[decoded.role];
//     if (!config) {
//       throw new Error("Invalid user role");
//     }

//     // Find user
//     const [rows] = await db.execute(
//       `SELECT * FROM ${config.table} WHERE ${config.idField} = ?`,
//       [decoded.id]
//     );

//     if (rows.length === 0) {
//       throw new Error("User not found");
//     }

//     req.user = rows[0];
//     req.user.role = decoded.role;
//     next();
//   } catch (error) {
//     console.error("Authentication error:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: error.message || "Please authenticate",
//     });
//   }
// };

// const authorize = (roles = []) => {
//   return (req, res, next) => {
//     try {
//       if (!req.user) {
//         throw new Error("User not authenticated");
//       }

//       if (!roles.includes(req.user.role)) {
//         console.log(`Access denied for ${req.user.role} to ${req.originalUrl}`);
//         return res.status(403).json({
//           success: false,
//           message: "You don't have permission to access this resource",
//           requiredRoles: roles,
//           userRole: req.user.role,
//         });
//       }
//       next();
//     } catch (error) {
//       res.status(403).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };
// };

// module.exports = {
//   authenticate,
//   authorize,
// };
const jwt = require("jsonwebtoken");
const { db } = require("../../db");

const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header (Bearer token)
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required. No token provided or invalid format.",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({
        success: false,
        message: "Invalid token structure",
      });
    }

    // Determine which table to check based on role
    let table, idField;
    switch (decoded.role) {
      case "customer":
        table = "customer";
        idField = "customer_id";
        break;
      case "staff":
        table = "pharmacy_staff";
        idField = "pharmacy_staff_id";
        break;
      case "manager":
        table = "manager";
        idField = "manager_id";
        break;
      case "supplier":
        table = "supplier";
        idField = "sup_id";
        break;
      default:
        return res.status(401).json({
          success: false,
          message: "Invalid user role in token",
        });
    }

    // Find user in the appropriate table
    const [rows] = await db.execute(
      `SELECT * FROM ${table} WHERE ${idField} = ?`,
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Add user data to the request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
      ...rows[0],
    };

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to access this resource",
        requiredRoles: roles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
