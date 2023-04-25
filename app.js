const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const signin = require("./routes/signin");
const signup = require("./routes/signup");
const auth = require("./middleware/auth");
const { requestLogger, errorLogger } = require("./middleware/logger");
const NotFoundError = require("./errors/not-found-error");

function validateEmail(string) {
  if (!validator.isEmail(string)) {
    throw new Error("Invalid Email");
  }
  return string;
}

function validateUrl(string) {
  if (!validator.isURL(string)) {
    throw new Error("Invalid URL");
  }
  return string;
}

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set("strictQuery", false); // Added due to DeprecationWarning being thrown
mongoose.connect(
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0",

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().custom(validateEmail),
      password: Joi.string().required(),
    }),
  }),
  signin
);
app.use(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().custom(validateEmail),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().custom(validateUrl),
    }),
  }),
  signup
);
app.use(auth);
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use(errors());
app.use((req, res, next) => {
  next(new NotFoundError("Not Found"));
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});
app.use(errorLogger);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});
