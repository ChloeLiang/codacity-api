const users = require('./controllers/user');
const decks = require('./controllers/deck');
const { authenticate } = require('./middleware/authenticate');

module.exports = app => {
  app.post('/users', users.create);
  app.post('/users/login', users.login);
  app.delete('/users/logout', authenticate, users.logout);

  app.post('/decks', authenticate, decks.create);
  app.get('/decks', authenticate, decks.index);

  return app;
};
