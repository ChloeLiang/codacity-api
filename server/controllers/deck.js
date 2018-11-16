const { ObjectID } = require('mongodb');

const { Deck } = require('../models/deck');

const create = (req, res) => {
  const deck = new Deck({
    name: req.body.name,
    _creator: req.user._id,
  });

  deck
    .save()
    .then(deck => {
      res.send(deck);
    })
    .catch(e => {
      res.status(400).send(e);
    });
};

const index = (req, res) => {
  Deck.find({
    _creator: req.user._id,
  })
    .then(decks => {
      res.send({ decks });
    })
    .catch(e => {
      res.status(400).send(e);
    });
};

const update = (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Deck.findOneAndUpdate(
    { _id: id, _creator: req.user._id },
    { $set: req.body },
    { new: true }
  )
    .then(deck => {
      if (!deck) {
        return res.status(404).send();
      }

      res.send({ deck });
    })
    .catch(e => {
      res.status(400).send();
    });
};

module.exports = { create, index, update };
