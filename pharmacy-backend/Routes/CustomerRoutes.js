const express = require("express");
const CustomerController = require("../Controllers/CustomerController");
const router = express.Router();

router.post("/create", CustomerController.createCustomer);
router.get("/:id", CustomerController.getCustomerById);
router.get("/", CustomerController.getAllCustomers);
router.put("/:id", CustomerController.updateCustomer);
router.delete("/:id", CustomerController.deleteCustomer);
router.post("/login", CustomerController.loginCustomer);



module.exports = router;
