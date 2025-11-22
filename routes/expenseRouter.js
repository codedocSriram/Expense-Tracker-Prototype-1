const express = require("express");
const expenseController = require("../controller/expenseController");
const auth = require("../middleware/auth");
const expenseRouter = express.Router();

expenseRouter.post("/add", auth.authenticate, expenseController.addNewExpense);
// expenseRouter.get(
//   "/single/:startIndex",
//   auth.authenticate,
//   expenseController.getUserExpense
// );
expenseRouter.delete(
  "/delete/:id",
  auth.authenticate,
  expenseController.deleteExpenseById
);
expenseRouter.get(
  "/allexpenses",
  auth.authenticate,
  expenseController.getExpenseWithName
);

expenseRouter.get(
  "/pagination/:startIndex/:limit",
  auth.authenticate,
  expenseController.getUserExpense
);

expenseRouter.get(
  "/count",
  auth.authenticate,
  expenseController.getExpenseCount
);

expenseRouter.get(
  "/investmentTip",
  auth.authenticate,
  expenseController.getInvestmentTip
);
expenseRouter.get(
  "/expensereport",
  auth.authenticate,
  expenseController.downloadAllExpense
);
module.exports = expenseRouter;
