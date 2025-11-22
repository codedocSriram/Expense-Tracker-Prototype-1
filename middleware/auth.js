const Users = require("../models/users");
const expenses = require("../models/expenses");
const jwt = require("jsonwebtoken");
const { jwtKey } = require("../controller/userController");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("autherization");
    console.log("token: " + token);
    const user = jwt.verify(token, jwtKey);
    console.log("user: " + user);
    Users.findByPk(user.userId)
      .then(user => {
        console.log(JSON.stringify(user));
        req.user = user;
        next();
      })
      .catch(err => {
        throw new Error(err);
      });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false });
  }
};

module.exports = {
  authenticate
};
