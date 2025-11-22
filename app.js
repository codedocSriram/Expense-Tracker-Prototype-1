const express = require("express");
const usersRouter = require("./routes/usersRouter");
const expenseRouter = require("./routes/expenseRouter");
const paymentRouter = require("./routes/paymentRouter");
const db = require("./utils/dbConnection");
const cors = require("cors");
require("./models");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("./public"));

app.use("/api/users", usersRouter);

app.use("/api/expenses", expenseRouter);

app.use("/api", paymentRouter);

db
  .sync({ force: false })
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running in port 4000");
    });
  })
  .catch(err => {
    console.log(err);
  });
