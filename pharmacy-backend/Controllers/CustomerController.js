const Customer = require("../Models/CustomerModel");
const { db } = require("../db");

class CustomerController {
  static async createCustomer(req, res) {
    try {
      const { name, image, password, address, email, telephoneNumbers } =
        req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "name, email and password are required fields!",
        });
      }

      // Validate telephone numbers format if provided
      if (telephoneNumbers && !Array.isArray(telephoneNumbers)) {
        return res.status(400).json({
          success: false,
          message: "Telephone numbers must be provided as an array",
        });
      }

      const customer = new Customer(name, image, password, address, email);
      const customerId = await Customer.create(
        customer,
        telephoneNumbers || []
      );

      res.status(201).json({
        success: true,
        message: "Customer created successfully!",
        customerId: customerId,
        telephoneNumbers: telephoneNumbers || [],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      });
    }
  }

  static async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await Customer.findById(id);
      if (rows.length === 0) {
        return res.status(404).send({ message: "Customer not found!" });
      }

      // Don't return the hashed password in the response
      const { password, ...customerData } = rows[0];
      res.status(200).send(customerData);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  static async getAllCustomers(req, res) {
    try {
      const [rows] = await Customer.findAll();

      // Remove passwords from all customer records
      const customers = rows.map(({ password, ...customer }) => customer);
      res.status(200).send(customers);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  static async updateCustomer(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const { telephoneNumbers, ...customerFields } = req.body;

      // Validate at least one field is provided
      if (!telephoneNumbers && Object.keys(customerFields).length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one field must be provided for update",
        });
      }

      // 1. Update main customer record if any fields provided
      if (Object.keys(customerFields).length > 0) {
        const customerUpdateResult = await Customer.update(
          connection,
          id,
          customerFields
        );

        if (customerUpdateResult.affectedRows === 0) {
          await connection.rollback();
          return res.status(404).json({
            success: false,
            message: "Customer not found!",
          });
        }
      }

      // 2. Handle telephone numbers if provided
      if (telephoneNumbers !== undefined) {
        // First delete existing numbers
        await connection.execute(
          `DELETE FROM cusnumber WHERE customer_id = ?`,
          [id]
        );

        // Then insert new numbers if array is not empty
        if (Array.isArray(telephoneNumbers)) {
          for (const number of telephoneNumbers) {
            await connection.execute(
              `INSERT INTO cusnumber (number, customer_id) VALUES (?, ?)`,
              [number, id]
            );
          }
        }
      }

      await connection.commit();
      return res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        updatedFields: {
          ...customerFields,
          telephoneNumbersUpdated: telephoneNumbers !== undefined,
        },
      });
    } catch (error) {
      await connection.rollback();
      console.error("Update Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      });
    } finally {
      connection.release();
    }
  }
  static async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const [result] = await Customer.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Customer not found!" });
      }
      res.status(200).send({ message: "Customer deleted successfully!" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  // Add a login method if needed
  static async loginCustomer(req, res) {
    try {
      const { email, password } = req.body;

      // Validate inputs
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Find the customer by email
      const [rows] = await Customer.findByEmailWithPassword(email);
      if (rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const customer = rows[0];

      // Check if password exists in the database record
      if (!customer.password) {
        console.error("Customer record has no password hash stored");
        return res.status(500).json({
          success: false,
          message: "Authentication error",
        });
      }

      // Verify password
      try {
        const isMatch = await Customer.verifyPassword(
          password,
          customer.password
        );

        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: "Invalid credentials",
          });
        }

        // Don't return the password in the response
        const { password: _, ...customerData } = customer;
        return res.status(200).json({
          success: true,
          message: "Login successful",
          customer: customerData,
        });
      } catch (verifyError) {
        console.error("Password verification error:", verifyError);
        return res.status(500).json({
          success: false,
          message: "Authentication error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "An error occurred during login",
      });
    }
  }
}

module.exports = CustomerController;


