const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-error");

// const { JWT_SECRET } = process.env;
const JWT_SECRET = "codingisfun";

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return next(new UnauthorizedError("Authorization required"));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
