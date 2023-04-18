const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request error");
const NotFoundError = require("../errors/not-found-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const ConflictError = require("../errors/conflict-error");
const checkErrors = require("../utils/errors");

const { JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

const getProfile = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error("Not Found"))
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      checkErrors({ res, err });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error("Not Found"))

    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      checkErrors({ res, err });
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(
          "The user with the provided email already exisits"
        );
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        passowrd: hash,
      })
    )
    .then((data) => res.status(201).send({ data }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(", ")}`
          )
        );
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(new Error("Not Found"))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      checkErrors({ res, err });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error("Not Found"))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      checkErrors({ res, err });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ data: user.toJSON(), token });
    })
    .catch(() => {
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

module.exports = {
  getUsers,
  getProfile,
  getCurrentUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
