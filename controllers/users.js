const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request error");
const NotFoundError = require("../errors/not-found-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const ConflictError = require("../errors/conflict-error");
const checkErrors = require("../utils/errors");
require("dotenv").config();

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

const getProfile = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError("Not Found"))
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      checkErrors({ res, err });
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)

    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid userId"));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      res.status(201).send({
        data: {
          name: user.name,
          email: user.email,
          about: user.about,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const errors = Object.keys(err.errors);
        const isMultiple = errors.length > 1;
        const lastError = errors.pop();

        return next(
          new BadRequestError(
            `Invalid ${
              isMultiple
                ? `${errors.join(", ")}${
                    errors.length > 1 ? "," : ""
                  } and ${lastError}`
                : lastError
            } input${isMultiple ? "s" : ""}`
          )
        );
      }
      if (err.code === 11000) {
        return next(new ConflictError("Conflict"));
      }
      return next(err);
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
    .orFail(new NotFoundError("Not Found"))
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
    .orFail(new NotFoundError("Not Found"))
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
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev",
        {
          expiresIn: "7d",
        }
      );
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
