const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const DEFAULT = 500;

const checkErrors = ({ res, err }) => {
  if (err.message === "Not Found") {
    res.status(NOT_FOUND).send({ message: "Resource not found" });
  } else if (err.name === "ValidationError" || err.name === "CastError") {
    res.status(BAD_REQUEST).send({ message: "Data is invalid" });
  } else {
    res
      .status(DEFAULT)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports = { checkErrors, NOT_FOUND };
