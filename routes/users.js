const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const {
  getUsers,
  getProfile,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

function validateUrl(string) {
  if (!validator.isURL(string)) {
    throw new Error("Invalid URL");
  }
  return string;
}

const userIdValidation = Joi.object().keys({
  userId: Joi.string().hex().length(24),
});

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get(
  "/:userId",
  celebrate({
    params: userIdValidation,
  }),
  getProfile
);

router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile
);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateUrl),
    }),
  }),
  updateAvatar
);

module.exports = router;
