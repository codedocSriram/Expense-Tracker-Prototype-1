const { Sequelize } = require("sequelize");
require("dotenv").config();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbDialect = process.env.DB_DIALECT;
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect
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



