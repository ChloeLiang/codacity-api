const { Deck } = require('../models/deck');

// Middleware function that makes routes private.
const authorise = (req, res, next) => {
  const userId = req.user._id.toHexString();
  const deckId = req.params.id;

  Deck.findById(deckId)
    .then(deck => {
      if (!deck) {
        return res.status(404).send();
      }

      if (deck._creator.toHexString() !== userId) {
        return res.status(401).send();
      }

      next();
    })
    .catch(e => {
      res.status(400).send();
    });
};

module.exports = { authorise };
