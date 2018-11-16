const users = require('./controllers/user');
const decks = require('./controllers/deck');
const cards = require('./controllers/card');
const { authenticate } = require('./middleware/authenticate');
const { authorise } = require('./middleware/authorise');

module.exports = app => {
  app.post('/users', users.create);
  app.post('/users/login', users.login);
  app.delete('/users/logout', authenticate, users.logout);

  app.post('/decks', authenticate, decks.create);
  app.get('/decks', authenticate, decks.index);
  app.patch('/decks/:id', authenticate, decks.update);

  app.post('/decks/:id/cards', authenticate, authorise('deck'), cards.create);
  app.get(
    '/decks/:id/cards',
    authenticate,
    authorise('deck'),
    cards.getCardsInDeck
  );

  return app;
};
