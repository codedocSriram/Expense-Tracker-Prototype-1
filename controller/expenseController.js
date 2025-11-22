const Expenses = require("../models/expenses");
const Users = require("../models/users");
const sequelize = require("../utils/dbConnection");
require("dotenv").config();
let genAiApiKey = process.env.GENAI_API_KEY;
const genAi = require("@google/genai");
let ai = new genAi.GoogleGenAI({
  apiKey: genAiApiKey
});

async function callAI() {
  const currentDate = new Date();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Analyze the stock market in India for the past 5 five years and give me a list of stocks to buy which has a good return on investment. Make sure the response is abbreviated to 10 lines`
  });
  return response.text;
}

const getInvestmentTip = async (req, res) => {
  try {
    const investmentTip = await callAI();
    console.log(investmentTip);
    res.status(200).json({ success: true, investmentTip: investmentTip });
    res.end();
  } catch (error) {
    console.log(`An error occured in expenseController file: ${error.message}`);
    res.status(505).json({
      success: false,
      status: 505,
      message: error.message
    });
    res.end();
  }
};

const addNewExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    console.log(userId);
    const { expenseamount, category, description } = req.body;
    await Expenses.create(
      {
        userId: Number(userId),
        expenseamount: Number(expenseamount),
        category,
        description
      },
      { transaction }
    );

    const user = await Users.findByPk(userId, { transaction });

    user.totalexpense = Number(expenseamount) + Number(user.totalexpense);
    await user.save({ transaction });

    console.log(`New expense added`);
    res.status(201).json({
      success: true,
      status: 201,
      message: `New Expense added`
    });
    await transaction.commit();
    res.end();
  } catch (error) {
    console.log(`An error occured in expenseController file: ${error.message}`);
    await transaction.rollback();
    res.status(505).json({
      success: false,
      status: 505,
      message: error.message
    });
    res.end();
  }
};

const getExpenseCount = async (req, res) => {
  const userId = req.user.id;
  try {
    const count = await Expenses.count({
      where: {
        userID: Number(userId)
      }
    });
    console.log(count);
    res.send(count);
    res.end();
  } catch (error) {
    console.log(`An error occured in expenseController file: ${error.message}`);
    res.status(505).json({
      success: false,
      status: 505,
      message: error.message
    });
    res.end();
  }
};

const getUserExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startIndex, limit } = req.params;
    const premiumuser = req.user.premiumuser;
    const userExpense = await Expenses.findAll({
      where: {
        userId: Number(userId)
      },
      offset: Number(startIndex),
      limit: Number(limit)
    });
    if (JSON.stringify(userExpense) === "[]") {
      console.log(`No expense added, please add new expense`);
      res.status(200).json({ premiumuser: premiumuser, userExpense: null });
      res.end();
      return;
    }
    console.log(userExpense);
    res.status(200).json({ premiumuser: premiumuser, userExpense });
  } catch (error) {
    console.log(`An error occured in expenseController file: ${error.message}`);
    res.status(505).json({
      success: false,
      status: 505,
      message: error.message
    });
    res.end();
  }
};

const downloadAllExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const allExpenses = await Expenses.findAll({
      where: {
        userId: Number(userId)
      }
    });
    if (JSON.stringify(allExpenses) === "[]") {
      console.log(`No expense added, please add new expense`);
      res.status(200).json({ success: false, userExpense: null });
      res.end();
      return;
    }
    res.status(200).json({ success: true, userExpense: allExpenses });
    res.end();
  } catch (error) {
    console.log(`An error occured in expenseController file: ${error.message}`);
    res.status(505).json({
      success: false,
      status: 505,
      message: error.message
    });
    res.end();
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const premiumuser = req.user.premiumuser;
    if (premiumuser) {
      const allExpenses = await Expenses.findAll();
      if (JSON.stringify(allExpenses) === "[]") {
        console.log(`No expense added, please add new expense`);
        res.status(200).json({ premiumuser: true, allExpenses: null });
        res.end();
        return;
      }

      res.status(200).json({ premiumuser: true, allExpenses });
      return;
    }
  } catch (error) {
    console.log(`An error occured in expenseController file: ${error.message}`);
    res.status(505).json({
      success: false,
      status: 505,
      message: error.message
    });
    res.end();
  }
};

const deleteExpenseById = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(typeof userId);
    const user = await Users.findByPk(userId, { transaction });
    console.log(user);
    const expense = await Expenses.findByPk(Number(id), { transaction });
    user.totalexpense =
      Number(user.totalexpense) - Number(expense.expenseamount);
    await user.save({ transaction });
    await expense.destroy({ transaction });
    console.log(expense);
    console.log(`Expense with id:${id} deleted`);
    res.status(200).json({
      success: true,
      status: 200,
      message: `Expense with id:${id} deleted`
    });
    await transaction.commit();
    res.end();
  } catch (error) {
    await transaction.rollback();
    console.log(`An error occured in expenseController file: ${error.message}`);
    res.status(505).json({
      success: false,
      status: 505,
      message: error.message
    });
    res.end();
  }
};

const getExpenseWithName = async (req, res) => {
  try {
    const leaderBoardExpense = await Users.findAll({
      raw: true,
      attributes: ["username", "totalexpense"],
      order: [["totalexpense", "DESC"]]
    });

    if (JSON.stringify(leaderBoardExpense) === "[]") {
      res.send(200).json({ premiumuser: true, allExpenses: null });
      res.end();
      return;
    }

    res
      .status(200)
      .json({ premiumuser: true, allExpenses: leaderBoardExpense });
  } catch (error) {
    console.log(error.message);
    res.status(505).send(error.message);
    res.end;
  }
};

const pagination = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startIndex } = req.params;
    const premiumuser = req.user.premiumuser;
    const userExpense = await Expenses.findAll({
      where: {
        userID: Number(userId)
      },
      offset: Number(startIndex),
      limit: 2
    });
    if (JSON.stringify(userExpense) === "[]") {
      console.log(`No expense added, please add new expense`);
      res.status(200).json({ premiumuser: premiumuser, userExpense: null });
      res.end();
      return;
    }
    console.log(userExpense);
    res.status(200).json({ premiumuser: premiumuser, userExpense });
  } catch (error) {
    console.log(`An error occured in expenseController file: ${error.message}`);
    res.status(505).json({
      success: false,
      status: 505,
      message: error.message
    });
    res.end();
  }
};

module.exports = {
  addNewExpense,
  getUserExpense,
  getAllExpenses,
  deleteExpenseById,
  getExpenseWithName,
  pagination,
  getExpenseCount,
  getInvestmentTip,
  downloadAllExpense
};
