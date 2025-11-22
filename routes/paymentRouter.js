const express = require("express");
const paymentRouter = express.Router();
const {
  getPaymentPage,
  processPayment,
  getPaymentStatuss
} = require("../controller/paymentController");

const auth = require("../middleware/auth");

paymentRouter.get("/", getPaymentPage);
paymentRouter.post("/pay", auth.authenticate, processPayment);
paymentRouter.get("/payment-status/:paymentSessionId", getPaymentStatuss);
module.exports = paymentRouter;
