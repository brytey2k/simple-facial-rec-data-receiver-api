const express = require('express');
const bodyParser = require('body-parser');
const Member = require('../models/member');

const router = express.Router();
router.use(bodyParser.json());

router.post('/members', async (req, res) => {
    if(req.body.length < 1) {
        res.status(500).json({message: 'No facial data contained in request'});
        return;
    }

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
router.get('/members', async (req, res) => {
    try {
        const members = await Member.findAll();
        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
});

module.exports = router;