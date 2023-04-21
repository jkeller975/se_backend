const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const authValidation = Joi.object()
  .keys({
    authorization: Joi.string().required(),
  })
  .unknown(true);

router.get("/", celebrate({ headers: authValidation }), getCards);
router.post(
  "/",
  celebrate({
    headers: authValidation,
  }),
  createCard
);
router.delete(
  "/:cardId",
  celebrate({
    headers: authValidation,
  }),
  deleteCard
);

router.put(
  "/:cardId/likes",
  celebrate({
    headers: authValidation,
  }),
  likeCard
);

router.delete(
  "/:cardId/likes",
  celebrate({
    headers: authValidation,
  }),
  dislikeCard
);

module.exports = router;
