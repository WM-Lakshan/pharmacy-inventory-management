const { db } = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10; // Number of salt rounds for hashing

class Customer {
  constructor(name, image, password, address, email) {
    this.name = name || null;
    this.image = image || null;
    this.password = password || null;
    this.address = address || null;
    this.email = email || null;
  }

  static async create(customer, telephoneNumbers = []) {
    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(customer.password, saltRounds);

      // Insert customer
      const [customerResult] = await connection.execute(
        `INSERT INTO customer (name, image, password, address, email)
         VALUES (?, ?, ?, ?, ?)`,
        [
          customer.name,
          customer.image,
          hashedPassword,
          customer.address,
          customer.email,
        ]
      );

      const customerId = customerResult.insertId;

      // Insert telephone numbers if provided
      if (telephoneNumbers.length > 0) {
        for (const number of telephoneNumbers) {
          await connection.execute(
            `INSERT INTO cusnumber (number, customer_id) VALUES (?, ?)`,
            [number, customerId]
          );
        }
      }

      // Commit transaction
      await connection.commit();
      return customerId;
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      console.error("Database Error:", error);

      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Email already exists. Please use a different email.");
      }
      throw new Error(error.sqlMessage || "Failed to create customer");
    } finally {
      connection.release();
    }
  }

  // Add a method to verify passwords
  static async verifyPassword(plainPassword, hashedPassword) {
    // Add validation to ensure both arguments are provided
    if (!plainPassword || !hashedPassword) {
      throw new Error(
        "Both password and stored hash are required for verification"
      );
    }
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update other methods to handle password hashing
  static async update(connection, id, updateFields) {
    // Hash password if it's being updated
    if (updateFields.password) {
      updateFields.password = await bcrypt.hash(
        updateFields.password,
        saltRounds
      );
    }

    // Filter out undefined values (keep null if explicitly set)
    const filteredFields = {};
    for (const [key, value] of Object.entries(updateFields)) {
      if (value !== undefined) {
        filteredFields[key] = value;
      }
    }

    // Don't proceed if no valid fields to update
    if (Object.keys(filteredFields).length === 0) {
      return { affectedRows: 0 };
    }

    // Build dynamic SET clause
    const setClause = Object.keys(filteredFields)
      .map((field) => `${field} = ?`)
      .join(", ");

    const values = Object.values(filteredFields);
    values.push(id); // Add ID for WHERE clause

    const query = `UPDATE customer SET ${setClause} WHERE customer_id = ?`;

    const [result] = await connection.execute(query, values);
    return result;
  }

  // Keep other methods (findById, findAll, delete) unchanged
  static async findById(id) {
    const query = "SELECT * FROM customer WHERE customer_id = ?";
    return await db.execute(query, [id]);
  }

  static async findAll() {
    const query = "SELECT * FROM customer";
    return await db.execute(query);
  }

  static async delete(id) {
    const query = "DELETE FROM customer WHERE customer_id = ?";
    return await db.execute(query, [id]);
  }
  static async findByEmail(email) {
    const query = "SELECT * FROM customer WHERE email = ?";
    return await db.execute(query, [email]);
  }
  static async findByEmailWithPassword(email) {
    const query = "SELECT * FROM customer WHERE email = ?";
    return await db.execute(query, [email]);
  }
}

module.exports = Customer;
