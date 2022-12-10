const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
const app = express();

const db = require('./models/index.js');

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// middle ware to fix cors issues locally

app.use(
  cors({
    origin: '*',
  })
);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

require('./routes/routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
