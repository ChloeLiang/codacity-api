const users = require('./controllers/user');
const decks = require('./controllers/deck');
const cards = require('./controllers/card');
const { authenticate } = require('./middleware/authenticate');
const { authorise } = require('./middleware/authorise');

module.exports = app => {
  app.post('/users/login', users.login);
  app.post('/users', users.create);
  app.delete('/users/logout', authenticate, users.logout);
  app.get('/users/me', authenticate, users.getCurrentUser);

  app.get('/decks', authenticate, decks.index);
  app.post('/decks', authenticate, decks.create);
  app.put('/decks/:id', authenticate, decks.update);
  app.delete('/decks/:id', authenticate, decks.destroy);

  app.post('/decks/:id/cards', authenticate, authorise('deck'), cards.create);
  app.get(
    '/decks/:id/cards',
    authenticate,
    authorise('deck'),
    cards.getCardsInDeck
  );
  app.get('/cards/:id', authenticate, cards.get);
  app.get('/cards', authenticate, cards.getAll);
  app.put('/cards/:id', authenticate, cards.update);
  app.delete('/cards/:id', authenticate, cards.destroy);

  return app;
};
