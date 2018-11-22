const _ = require('lodash');

const { User } = require('../models/user');
const { Deck } = require('../models/deck');

const create = (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  user
    .save()
    .then(user => {
      const deck = new Deck({
        name: 'Default',
        _creator: user._id,
      });

      return deck.save();
    })
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      // Create a custom header for JWT token.
      res
        .header('x-auth', token)
        .header('access-control-expose-headers', 'x-auth')
        .send(user);
    })
    .catch(e => {
      res.status(400).send('Email already exists.');
    });
};

const login = (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res
          .header('x-auth', token)
          .header('access-control-expose-headers', 'x-auth')
          .send(token);
      });
    })
    .catch(e => {
      res.status(400).send('Invalid username or password.');
    });
};

const logout = (req, res) => {
  req.user
    .removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(e => {
      res.status(400).send();
    });
};

const getCurrentUser = (req, res) => {
  res.send(req.user);
};

module.exports = { create, login, logout, getCurrentUser };
