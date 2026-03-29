const express = require("express");

const router = express.Router();

const customerController = require("../controllers/customerController");
const auth = require("../middleware/auth");
const { createCustomer, updateCustomer } = require("../validators/customer");

router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);

router.post("/", auth, ...createCustomer, customerController.createCustomer);

router.put("/:id", auth, ...updateCustomer, customerController.updateCustomer);

router.delete(
    "/:id",
    auth,
    customerController.deleteCustomer
);

module.exports = router;