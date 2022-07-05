const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const router = require('./router/Router');
const port = process.env.PORT;
require('./db');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to SmartDev API');
});

app.use('/', router);

app.listen(port, () => {
  console.log('Listening to port', port);
});
