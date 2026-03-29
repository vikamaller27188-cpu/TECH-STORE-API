const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");

router.get("/", auth, orderController.getStats);

module.exports = router;