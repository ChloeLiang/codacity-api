const { Card } = require('../models/card');

const create = (req, res) => {
  const _deck = req.params.id;
  const _creator = req.user._id;
  const { front, back } = req.body;

  const card = new Card({
    front,
    back,
    _deck,
    _creator,
  });

  card
    .save()
    .then(card => {
      res.send({ card });
    })
    .catch(e => {
      res.status(400).send(e);
    });
};

const getCardsInDeck = (req, res) => {
  const _deck = req.params.id;

  Card.find({ _deck })
    .then(cards => {
      res.send({ cards });
    })
    .catch(e => {
      res.status(400).send(e);
    });
};

const patch = (req, res) => {
  const cardId = req.params.id;

  Card.findOneAndUpdate(
    { _id: cardId, _creator: req.user._id },
    { $set: req.body },
    { new: true }
  )
    .then(card => {
      if (!card) {
        return res.status(404).send();
      }

      res.send({ card });
    })
    .catch(e => {
      res.status(400).send();
    });
};

module.exports = { create, getCardsInDeck, patch };
