const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "Pharmacy_store", // Make sure there's no typo here!
});

async function testConnection() {
  try {
    const connection = await db.getConnection(); // Gets a connection from the pool
    console.log("Database connected successfully!");
    connection.release(); // Release the connection after testing
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process if DB connection fails
  }
}

module.exports = { db, testConnection };
