const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compression = require('compression');
const cors = require('cors');
const nocache = require('nocache');

// Custom routes
const routesApi = require('./routes');

// Variables
const defaults = {
  cache: 72000000, // 2 hours,
  http_port: process.env.PORT || 3000,
};

// Define app
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ allowedHeaders: ['Authorization', 'Accept', 'Content-Type'] }));
app.use(nocache());
app.use(compression());

// Serve
app.get('/', (req, res) => { res.send('home'); });
app.use('/interface', express.static(`${__dirname}/../interface/`));
app.use('/api', routesApi);

app.listen(defaults.http_port, () => {
  console.log(`Server running on port: ${defaults.http_port}`);
});
