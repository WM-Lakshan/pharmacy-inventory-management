// scripts/checkExpiredPrescriptions.js
const { db } = require("../db");
const LandingModel = require("../Models/customer/landing.model");

async function checkExpiredPrescriptions() {
  try {
    console.log(
      `[${new Date().toISOString()}] Checking for expired prescriptions...`
    );
    const result = await LandingModel.checkExpiredPrescriptions();

    if (result.count > 0) {
      console.log(
        `[${new Date().toISOString()}] ${
          result.count
        } prescriptions marked as expired`
      );
    } else {
      console.log(
        `[${new Date().toISOString()}] No expired prescriptions found`
      );
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error in prescription expiration check:`,
      error
    );
  } finally {
    // Close database connection
    try {
      await db.end();
    } catch (err) {
      console.error("Error closing database connection:", err);
    }

    // On Windows, we need to exit explicitly since we're running as a scheduled task
    process.exit(0);
  }
}

// Run the check
checkExpiredPrescriptions();
