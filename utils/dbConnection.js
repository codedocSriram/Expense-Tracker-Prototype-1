const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("testdb", "root", "abcd1234", {
  hose: "localhost",
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
