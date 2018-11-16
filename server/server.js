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

app = require('./routes')(app);

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };
