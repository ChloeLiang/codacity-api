const users = require('./controllers/user');
const { authenticate } = require('./middleware/authenticate');

module.exports = app => {
  app.post('/users', users.create);
  app.post('/users/login', users.login);
  app.delete('/users/logout', authenticate, users.logout);

  return app;
};
