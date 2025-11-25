const express = require("express");
const usersRouter = require("./routes/usersRouter");
const expenseRouter = require("./routes/expenseRouter");
const paymentRouter = require("./routes/paymentRouter");
const db = require("./utils/dbConnection");
const cors = require("cors");
require("dotenv").config();
require("./models");
const app = express();
const PORT = Number(process.env.PORT);

app.use(express.json());
app.use(cors());
app.use(express.static("./public"));

app.use("/api/users", usersRouter);

app.use("/api/expenses", expenseRouter);

app.use("/api", paymentRouter);

db
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running in port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });

