const { Deck } = require('../models/deck');

const getModel = type => {
  if (type === 'deck') {
    return Deck;
  }
};

// Middleware function that makes routes private.
const authorise = type => {
  return (req, res, next) => {
    const userId = req.user._id.toHexString();
    const id = req.params.id;

    const Model = getModel(type);

    Model.findById(id)
      .then(doc => {
        if (!doc) {
          return res.status(404).send();
        }

        if (doc._creator.toHexString() !== userId) {
          return res.status(401).send();
        }

        next();
      })
      .catch(e => {
        res.status(400).send();
      });
  };
};

module.exports = { authorise };
