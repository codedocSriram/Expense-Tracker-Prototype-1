const Users = require("./users");
const Expenses = require("./expenses");
const Payments = require("./payments");
const Forgotpassword = require("./forgotPassword");

Users.hasMany(Expenses);
Expenses.belongsTo(Users);

Users.hasMany(Forgotpassword);
Forgotpassword.belongsTo(Users);

Users.hasMany(Payments);
Payments.belongsTo(Users);

module.exports = {
  Users,
  Expenses,
  Payments,
  Forgotpassword
};
