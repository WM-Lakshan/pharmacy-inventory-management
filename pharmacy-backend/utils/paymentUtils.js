// utils/paymentUtils.js
const crypto = require("crypto");

/**
 * Generate PayHere hash for payment verification
 * @param {string} merchantId - PayHere merchant ID
 * @param {string} orderId - Order ID reference
 * @param {string} amount - Payment amount
 * @param {string} currency - Payment currency (LKR)
 * @param {string} merchantSecret - PayHere merchant secret
 * @returns {string} - Generated hash for PayHere
 */
const generatePayHereHash = (
  merchantId,
  orderId,
  amount,
  currency,
  merchantSecret
) => {
  try {
    // Ensure all values are properly formatted and converted to strings
    merchantId = String(merchantId).trim();
    orderId = String(orderId).trim();
    amount = parseFloat(amount).toFixed(2); // Ensure 2 decimal places
    currency = String(currency).trim();
    merchantSecret = String(merchantSecret).trim();

    // Create data string for hashing
    const dataString = `${merchantId}${orderId}${amount}${currency}`;

    // Generate hash
    const hash = crypto
      .createHash("md5")
      .update(dataString + merchantSecret)
      .digest("hex")
      .toUpperCase();

    return hash;
  } catch (error) {
    console.error("Error generating PayHere hash:", error);
    throw new Error(`Hash generation failed: ${error.message}`);
  }
};

module.exports = {
  generatePayHereHash,
};
