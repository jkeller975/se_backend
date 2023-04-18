const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
// const usersRouter = require("./routes/users");
// const cardsRouter = require("./routes/cards");
const routes = require("./routes/index");

const { NOT_FOUND } = require("./utils/errors");

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = { _id: "63fbe1ab9920f97d958c0174" };
  next();
});

mongoose.set("strictQuery", false); // Added due to DeprecationWarning being thrown
mongoose.connect("mongodb://localhost:27017/aroundb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(routes);

// app.use("/users", usersRouter);
// app.use("/cards", cardsRouter);
app.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
  next();
});
app.use(errors());
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});
