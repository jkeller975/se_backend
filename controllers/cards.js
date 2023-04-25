const Card = require("../models/card");
const BadRequestError = require("../errors/bad-request error");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");

const getCards = (req, res, next) => {
  Card.find({})
    .populate(["owner", "likes"])
    .sort("createdAt")
    .then((cards) => {
      res.send({ data: cards.reverse() });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate("owner"))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const id = req.params.cardId;

  Card.findById(id)
    .orFail(() => new NotFoundError("Not Found"))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError("You are not the owner of the card");
      }
      return card.deleteOne().then(() => res.send({ message: "Card Deleted" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid userId"));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Not Found"))
    .populate("likes")
    .populate("owner")
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid userId"));
      }
      return next(err);
    });

const dislikeCard = (req, res, next) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Not Found"))
    .populate("likes")
    .populate("owner")
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid userId"));
      }
      return next(err);
    });

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
