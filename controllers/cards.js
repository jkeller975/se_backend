const Card = require("../models/card");
const { checkErrors } = require("../utils/errors");

const getCards = (req, res, next) => {
  Card.find({})
    .populate(["owner", "likes"])
    .sort("createdAt")
    .then((cards) => {
      res.send({ data: cards.reverse() });
    })
    .catch((err) => {
      checkErrors({ res, err });
    })
    .catch(next);
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate("owner"))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      checkErrors({ res, err });
    });
};

const deleteCard = (req, res) => {
  const id = req.params.cardId;

  Card.findById(id)
    .orFail(new Error("Not Found"))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return new Error("You are not the owner of the card");
      }
      return card.deleteOne().then(() => res.send({ message: "Card Deleted" }));
    })
    .catch((err) => {
      checkErrors({ res, err });
    });
  // Card.findByIdAndDelete(id)
  //   .orFail(new Error("Not Found"))
  //   .then(() => res.status(200).send({ message: "Card deleted" }))
  //   .catch((err) => {
  //     checkErrors({ res, err });
  //   });
};

const likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("Not Found"))
    .populate("likes")
    .populate("owner")
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      checkErrors({ res, err });
    });

const dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("Not Found"))
    .populate("likes")
    .populate("owner")
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      checkErrors({ res, err });
    });

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
