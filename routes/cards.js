const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

function validateUrl(string) {
  if (!validator.isURL(string)) {
    throw new Error("Invalid URL");
  }
  return string;
}

const cardIdValidation = Joi.object().keys({
  cardId: Joi.string().hex().length(24),
});

router.get("/", getCards);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(validateUrl),
    }),
  }),
  createCard
);
router.delete(
  "/:cardId",
  celebrate({
    params: cardIdValidation,
  }),
  deleteCard
);

router.put(
  "/:cardId/likes",
  celebrate({
    params: cardIdValidation,
  }),
  likeCard
);

router.delete(
  "/:cardId/likes",
  celebrate({
    params: cardIdValidation,
  }),
  dislikeCard
);

module.exports = router;
