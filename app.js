const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compression = require('compression');
const path = require('path');
const cors = require('cors');
const nocache = require('nocache');

// Custom routes
const routesApi = require('./api_routes');

// Variables
const defaults = {
  cache: 72000000, // 2 hours,
  http_port: process.env.PORT || 3000,
  https_port: process.env.PORT || 443,
};

// Define app
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ allowedHeaders: ['Authorization'] }));
app.use(nocache());
app.use(compression());

// app.use((req, res, next) => {
//   res.setHeader('Cache-Control', `public, max-age=${String(defaults.cache)}`);
//   next();
// });

// Serve
app.get('/', (req, res) => { res.send('home'); });
app.use('/excel_interface',
  express.static(path.join(__dirname, 'excel_interface'), {
    cacheControl: true,
    maxAge: String(defaults.cache),
  }));
app.use('/api', routesApi);

app.listen(defaults.http_port, () => {
  console.log(`Server running on port: ${defaults.http_port}`);
});
