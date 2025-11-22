const axios = require("axios");
require("dotenv").config();
const brevoApiKey = process.env.BREVO_API_KEY;

const brevoUrl = "https://api.brevo.com/v3/smtp/email";

const sendMail = async (userEmail, otp) => {
  const emailData = {
    sender: {
      name: "Expense tracker Admin",
      email: "mailsriram98@gmail.com"
    },
    to: [
      {
        email: userEmail
      }
    ],
    subject: "Password reset OTP",
    htmlContent: `<html> <body><p> Your OTP is </p> <h1> ${otp} </h1> </body> </html>`
  };
  try {
    const res = await axios.post(brevoUrl, emailData, {
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey
      }
    });
    console.log(res);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { sendMail };
