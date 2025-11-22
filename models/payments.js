const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnection");

const Payments = sequelize.define("Payment", {
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  paymentSessionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  orderAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  orderCurrency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Payments;
