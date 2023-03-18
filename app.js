require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/db');
const routes = require('./routes/web');

const app = express();

// Configure bodyParser to parse JSON requests
app.use(bodyParser.json());

// routes
app.use('/', routes);

// initialize database sync
sequelize.sync();

// Start server
const PORT = process.env.PORT || 3000;
sequelize
    .sync()
    .then(() => {
        console.log('Connected to the database');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });

module.exports = app;