const router = require("express").Router();
const userRouter = require("./users");
const cardRouter = require("./cards");
const auth = require("../middleware/auth");
const NotFoundError = require("../errors/not-found-error");

router.use(auth);
router.use("/users", userRouter);
router.use("/cards", cardRouter);

router.use((req, res, next) => {
  next(new NotFoundError("No page found for the specified route"));
});

module.exports = router;
