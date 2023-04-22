const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");

const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const signin = require("./routes/signin");
const signup = require("./routes/signup");
const { NOT_FOUND } = require("./utils/errors");
const auth = require("./middleware/auth");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set("strictQuery", false); // Added due to DeprecationWarning being thrown
mongoose.connect(
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0",
  // mongoose.connect("mongodb://localhost:27017/aroundb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use("/signin", signin);
app.use("/signup", signup);
app.use(auth);
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
  next();
});
app.use(errors());
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});
