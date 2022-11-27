const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  myOrdersProvider,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

const {
  isAuthenticatedUser,
  isAuthenticatedProvider,
  authorizeRoles,
} = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/orders/provider").get(isAuthenticatedProvider, myOrdersProvider);

router.route("/provider/orders").get(getAllOrders);

router
  .route("/provider/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("provider"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("provider"), deleteOrder);

module.exports = router;
