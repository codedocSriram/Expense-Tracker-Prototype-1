const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnection");

const Users = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalexpense: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  premiumuser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Users;
