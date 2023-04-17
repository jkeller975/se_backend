const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { checkErrors } = require("../utils/errors");

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      checkErrors({ res, err });
    });
};

const getProfile = (req, res) => {
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

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      checkErrors({ res, err });
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

const login = (req, res) => {
  const { email, password } = req.body;
  // check if the user exists
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // if it matches, return the JWT that parses the ID
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" }
      );
      res.send({ token });
    })
    .catch((err) => checkErrors({ res, err }));
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
