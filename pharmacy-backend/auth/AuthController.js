const { db } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

class AuthController {
  static async register(req, res) {
    try {
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured");
        return res.status(500).json({
          success: false,
          message: "Server configuration error",
        });
      }

      const { name, email, password, address, type } = req.body;

      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured");
        return res.status(500).json({
          success: false,
          message: "Server configuration error",
        });
      }
      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, password are required",
        });
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email",
        });
      }

      // Validate password strength
      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[0-9]/.test(password)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be 8+ characters with at least one uppercase letter and number",
        });
      }

      // Hash password

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Check if email already exists
        const [existing] = await connection.execute(
          `SELECT email FROM customer WHERE email = ?`,
          [email]
        );

        if (existing.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Email already registered",
          });
        }

        // Insert user
        const [result] = await connection.execute(
          `INSERT INTO customer (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
          [name, email, hashedPassword, address || null, "customer"]
        );

        await connection.commit();
        const userId = result.insertId;
        const role = "customer";

        // Generate JWT token
        const token = jwt.sign(
          {
            id: userId,
            email: email,
            role: role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        res.status(201).json({
          success: true,
          message: "Registration successful",
          token,
          role,
          userId,
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Check all user tables for the email
      const userTypes = [
        { table: "customer", role: "customer" },
        { table: "pharmacy_staff", role: "staff" },
        { table: "manager", role: "manager" },
        { table: "supplier", role: "supplier" },
      ];

      let user = null;
      let userRole = null;
      let idField = null;

      for (const { table, role } of userTypes) {
        idField =
          table === "customer"
            ? "customer_id"
            : table === "pharmacy_staff"
            ? "pharmacy_staff_id"
            : table === "manager"
            ? "manager_id"
            : "sup_id";

        const [rows] = await db.execute(
          `SELECT *, '${role}' AS role FROM ${table} WHERE email = ?`,
          [email]
        );

        if (rows.length > 0) {
          user = rows[0];
          userRole = user.role;
          break;
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Create JWT token
      const token = jwt.sign(
        {
          id: user[idField],
          email: user.email,
          role: userRole,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Don't return the password in the response
      const { password: _, ...userData } = user;

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        role: userRole,
        user: userData,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred during login",
      });
    }
  }
}

module.exports = AuthController;
