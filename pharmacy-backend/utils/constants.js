module.exports = {
  ROLES: {
    CUSTOMER: "customer",
    STAFF: "staff",
    MANAGER: "manager",
    SUPPLIER: "supplier",
  },
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  TOKEN_EXPIRY: "1d",
};
