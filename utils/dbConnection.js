const { Sequelize } = require("sequelize");
require("dotenv").config();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: "localhost",
  dialect: "mysql"
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to test db successful!");
  } catch (error) {
    console.log("Error in dbConnection file: " + error);
  }
})();

module.exports = sequelize;


