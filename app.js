const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
require('dotenv').config();

const app = express();

// Configure bodyParser to parse JSON requests
app.use(bodyParser.json());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

// Define Member model
const Member = sequelize.define('Member', {
    id: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING,
    face: Sequelize.STRING,
    face_feature: Sequelize.TEXT
}, {
    tableName: 'members'
});

// Create table in database
sequelize.sync();


app.post('/members', async (req, res) => {
    try {
        const members = req.body;
        const createdMembers = await Member.bulkCreate(members);
        res.json(createdMembers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create members.' });
    }
});

// Endpoint to retrieve all members from database
app.get('/members', async (req, res) => {
    try {
        const members = await Member.findAll();
        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
});

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