const Payments = require("../models/payments");
const sequelize = require("../utils/dbConnection");
const path = require("path");
const {
  createOrder,
  getPaymentStatus
} = require("../services/cashFreeService");
const Users = require("../models/users");

exports.getPaymentPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..public/views/index.html"));
};

exports.processPayment = async (req, res) => {
  const transaction = await sequelize.transaction();
  const userId = req.user.id;
  const orderId = "ORDER-" + Date.now();
  const orderAmount = 2000;
  const orderCurrency = "INR";
  const customerID = "1";
  const customerPhone = "9999999999";
  try {
    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerID,
      customerPhone
    );

    await Payments.create(
      {
        orderId,
        paymentSessionId,
        orderAmount,
        orderCurrency,
        paymentStatus: "Pending",
        userId: userId
      },
      { transaction }
    );
    await transaction.commit();
    res.json({ paymentSessionId, orderId });
  } catch (error) {
    await transaction.rollback();
    console.error("Error processing payment:", error.message);
    res.status(500).json({ message: "Error processing payment" });
  }
};

exports.getPaymentStatuss = async (req, res) => {
  const paymentSessionId = req.params.paymentSessionId;
  console.log("Session id: " + paymentSessionId);
  const transaction = await sequelize.transaction();
  try {
    const orderStatus = await getPaymentStatus(paymentSessionId, {
      transaction
    });
    console.log("Order Status: " + orderStatus);
    const order = await Payments.findOne(
      {
        where: {
          orderId: paymentSessionId
        }
      },
      { transaction }
    );
    const user = await Users.findByPk(Number(order.userId), { transaction });
    order.paymentStatus = orderStatus;
    if (orderStatus == "Success") {
      user.premiumuser = true;
      await user.save({ transaction: transaction });
    }
    await order.save({ transaction: transaction });
    await transaction.commit();

    res.json({ orderStatus });
  } catch (error) {
    await transaction.rollback();
    console.error("Error fetching payment status:", error.message);
    res.status(500).json({ message: "Error fetching payment status" });
  }
};
