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

module.exports = { create };
