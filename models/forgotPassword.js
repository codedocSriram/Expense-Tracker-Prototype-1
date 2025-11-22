const Sequelize = require("sequelize");
const sequelize = require("../utils/dbConnection");

const Forgotpassword = sequelize.define("forgotpassword", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
  },
  otp: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  active: {
    type: Sequelize.BOOLEAN
  },

  expiresby: {
    type: Sequelize.DATE
  }
});

module.exports = Forgotpassword;
