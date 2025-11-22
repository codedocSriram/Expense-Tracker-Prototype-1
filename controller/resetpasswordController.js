const uuid = require("uuid");
const bcrypt = require("bcrypt");
const { sendMail } = require("../services/mailService");
const sequelize = require("../utils/dbConnection");
const Users = require("../models/users");
const Forgotpassword = require("../models/forgotPassword");

const generateOtp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};

const forgotPassword = async (req, res) => {
  const email = req.header("requestEmail");
  const transaction = await sequelize.transaction();
  try {
    const user = await Users.findOne(
      {
        raw: true,
        where: {
          email: email
        }
      },
      { transaction }
    );
    if (user === null) {
      console.log("Account does not exist!");
      res
        .status(404)
        .json({ success: false, error: "Account does not exist!" });
      res.end();
      return;
    }
    const id = uuid.v4();
    const otp = generateOtp();
    await sendMail(email, otp);
    await Forgotpassword.create(
      {
        id: id,
        otp: otp,
        active: true,
        expiresby: new Date(),
        userId: user.id
      },
      { transaction }
    );
    await transaction.commit();
    res.status(200).json({ success: true, id: id });
    res.end();
  } catch (error) {
    await transaction.rollback();
    res
      .status(500)
      .json({ success: false, error: "An error occured:" + error.message });
    res.end();
    return;
  }
};

const checkOtp = async (req, res) => {
  const id = req.header("id");
  const otp = req.header("otp");
  try {
    const reset = await Forgotpassword.findByPk(id);
    if (reset.otp == otp) {
      res.status(200).json({ success: true });
      res.end();
      return;
    }
    res.status(200).json({ success: false });
    res.end();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "An error occured:" + error.message });
    res.end();
    return;
  }
};

const saveNewPassword = async (req, res) => {
  const id = req.header("id");
  console.log("IDDD:" + id);
  const newPassword = req.header("newPassword");
  const transaction = await sequelize.transaction();
  console.log("newPassword:" + newPassword);
  try {
    const reset = await Forgotpassword.findByPk(id);
    console.log(reset);
    const user = await Users.findByPk(reset.userId);
    bcrypt.hash(newPassword, 10, async (err, hash) => {
      if (err) {
        console.log(err);
      }
      user.password = hash;
      reset.active = false;
      await user.save({ transaction: transaction });
      await reset.save({ transaction: transaction });
      await transaction.commit();
      res.status(200).json({ success: true });
      res.end();
    });
  } catch (error) {
    await transaction.rollback();
    res
      .status(500)
      .json({ success: false, error: "An error occured:" + error.message });
    res.end();
    return;
  }
};

module.exports = {
  forgotPassword,
  saveNewPassword,
  checkOtp
};
