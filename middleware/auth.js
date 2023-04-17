const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/error");

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ErrorHandler(401, "Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    next(new ErrorHandler(401, "Authorization required"));
  }
  req.user = payload;
  return next();
};
