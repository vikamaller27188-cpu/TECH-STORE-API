const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");

const {
    createOrder,
    updateOrder,
    getAllOrdersQuery,
} = require("./../validators/order");

router.get("/", ...getAllOrdersQuery, orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);

router.post("/", auth, ...createOrder, orderController.createOrder);

router.put("/:id", auth, ...updateOrder, orderController.updateOrder);

router.delete(
    "/:id",
    auth,
    orderController.deleteOrder
);

module.exports = router;