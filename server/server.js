require('./config/config');
require('./db/mongoose');

const express = require('express');

const port = process.env.PORT;
let app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});

app = require('./routes')(app);

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };
