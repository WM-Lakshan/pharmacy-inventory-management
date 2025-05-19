const { db } = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class StaffModel {
  static async getAllStaff() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          ps.pharmacy_staff_id,
          CONCAT(ps.F_name, ' ', ps.L_name) as name,
          ps.F_name,
          ps.L_name,
          ps.email,
          ps.address,
          ps.role,
          ps.image,
          ps.salary
        FROM pharmacy_staff ps
      `);

      // Get phone numbers for each staff member
      for (const staff of rows) {
        const [phoneRows] = await db.execute(
          `SELECT number as contactNumber FROM pharmacy_staff_tel WHERE pharmacy_staff_id = ?`,
          [staff.pharmacy_staff_id]
        );

        staff.contactNumber =
          phoneRows.length > 0 ? phoneRows[0].contactNumber : "";
      }

      return rows;
    } catch (error) {
      console.error("Error fetching staff members:", error);
      throw error;
    }
  }

  static async getStaffById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT 
          ps.pharmacy_staff_id,
          ps.F_name,
          ps.L_name,
          ps.email,
          ps.address,
          ps.role,
          ps.image,
          ps.salary
        FROM pharmacy_staff ps
        WHERE ps.pharmacy_staff_id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      const staff = rows[0];

      // Get phone numbers
      const [phoneRows] = await db.execute(
        `SELECT number as contactNumber FROM pharmacy_staff_tel WHERE pharmacy_staff_id = ?`,
        [id]
      );

      staff.contactNumber =
        phoneRows.length > 0 ? phoneRows[0].contactNumber : "";

      return staff;
    } catch (error) {
      console.error(`Error fetching staff member with ID ${id}:`, error);
      throw error;
    }
  }

  static async createStaff(staffData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { name, email, contactNumber, address, salary, image } = staffData;

      // Split name into first and last
      const nameParts = name.split(" ");
      const F_name = nameParts[0];
      const L_name = nameParts.slice(1).join(" ") || "";

      // Hash the default password
      const hashedPassword = await bcrypt.hash("12345678", saltRounds);

      // Insert into pharmacy_staff table
      const [result] = await connection.execute(
        `INSERT INTO pharmacy_staff (F_name, L_name, email, password, address, role, image, salary) 
         VALUES (?, ?, ?, ?, ?, 'staff', ?, ?)`,
        [F_name, L_name, email, hashedPassword, address, image || null, salary]
      );

      const staffId = result.insertId;

      // Insert contact number
      if (contactNumber) {
        await connection.execute(
          `INSERT INTO pharmacy_staff_tel (pharmacy_staff_id, number) VALUES (?, ?)`,
          [staffId, contactNumber]
        );
      }

      await connection.commit();
      return staffId;
    } catch (error) {
      await connection.rollback();
      console.error("Error creating staff member:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateStaff(id, staffData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { name, email, contactNumber, address, salary, image } = staffData;

      // Split name into first and last
      const nameParts = name.split(" ");
      const F_name = nameParts[0];
      const L_name = nameParts.slice(1).join(" ") || "";

      // Update pharmacy_staff table
      const [result] = await connection.execute(
        `UPDATE pharmacy_staff 
         SET F_name = ?, L_name = ?, email = ?, address = ?, image = ?, salary = ?
         WHERE pharmacy_staff_id = ?`,
        [F_name, L_name, email, address, image, salary, id]
      );

      // Update contact number - delete old and insert new
      await connection.execute(
        `DELETE FROM pharmacy_staff_tel WHERE pharmacy_staff_id = ?`,
        [id]
      );

      if (contactNumber) {
        await connection.execute(
          `INSERT INTO pharmacy_staff_tel (pharmacy_staff_id, number) VALUES (?, ?)`,
          [id, contactNumber]
        );
      }

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error(`Error updating staff member with ID ${id}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteStaff(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Delete staff phone numbers
      await connection.execute(
        `DELETE FROM pharmacy_staff_tel WHERE pharmacy_staff_id = ?`,
        [id]
      );

      // Delete staff member
      const [result] = await connection.execute(
        `DELETE FROM pharmacy_staff WHERE pharmacy_staff_id = ?`,
        [id]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error(`Error deleting staff member with ID ${id}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = StaffModel;
