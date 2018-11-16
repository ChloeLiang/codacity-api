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

module.exports = { create };
