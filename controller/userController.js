const Users = require("../models/users");
const sequelize = require("../utils/dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtKey = process.env.JWT_API_KEY;

function generateAccessToken(id, name, premiumuser) {
  return jwt.sign({ userId: id, name: name, premiumuser: premiumuser }, jwtKey);
}

const addNewUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log(err);
        return;
      }
      await Users.create(
        {
          username,
          email,
          password: hash
        },
        { transaction }
      );
      console.log(`User ${username} added`);
      await transaction.commit();
      res.status(201).send(`User ${username} added`);
    });
  } catch (error) {
    await transaction.rollback();
    if (error.message === "Validation error") {
      console.log(`An acount with email id ${req.body.email} already exist`);
      res
        .status(409)
        .send(`An acount with email id ${req.body.email} already exist`);
      return;
    }
    console.log(`An error occured in userController file: ${error.message}`);
    res
      .status(500)
      .send(`An error occured in userController file: ${error.message}`);
  }
};

const checkUser = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    const userExist = await Users.findOne({
      where: {
        email: email
      }
    });
    console.log("userExist: " + userExist);
    if (userExist === null) {
      console.log(`Account does not exist`);
      res.status(404).json({
        success: false,
        status: 404,
        message: "Account does not exist"
      });
      res.end();
      return;
    }
    // const isPasswordTrue = userExist.password == password;
    bcrypt.compare(password, userExist.password, (err, result) => {
      console.log("Error: " + err);
      console.log(result);
      if (err) {
        throw new Error("Error occured in bcrypt");
      }
      if (result) {
        console.log(`Welcome back ${userExist.username}!`);
        const accessToken = generateAccessToken(
          userExist.id,
          userExist.username,
          userExist.premiumuser
        );
        res.status(200).json({
          success: true,
          accessToken: accessToken,
          status: 200,
          message: `Welcome back ${userExist.username}!`
        });

        res.end();
      }
      if (!result) {
        console.log(`Worng password, please try again`);
        res.status(401).json({
          success: false,
          status: 401,
          message: "Worng password, please try again"
        });
        res.end();
        return;
      }
    });
  } catch (error) {
    console.log(`An error occured in userController file: ${error.message}`);
    res.status(500).json({
      success: false,
      status: 500,
      message: `An error occured in userController file: ${error.message}`
    });
    res.end();
  }
};

const testPagination = async (req, res) => {
  try {
    const twoUsers = await Users.findAll({
      offset: 5,
      limit: 2
    });
    res.status(200).json(twoUsers);
    res.end();
  } catch (error) {
    res.status(500).send(error.message);
    res.end();
  }
};

module.exports = {
  addNewUser,
  checkUser,
  jwtKey,
  testPagination
};
