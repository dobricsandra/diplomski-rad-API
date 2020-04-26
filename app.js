const express = require('express');
const bodyParser = require('body-parser');

const pageRoutes = require('./routes/page');

const app = express();

// application/json content-type expected both for requests and responses
app.use(bodyParser.json());

// to avoid CORS error we need to set the next headers to our API's response:
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // change this later to only our front-end domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// routes are defined in /routes/page.js file
app.use(pageRoutes);

app.listen(8080);