// Example using Express
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust to your user model path

router.get('/register', async (req, res) => {
    res.send("ok");
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, phoneNumber, dateOfBirth, password } = req.body;

        // Add validation checks here

        const newUser = new User({
            username,
            email,
            phoneNumber,
            dateOfBirth,
            password, // Consider hashing passwords before storing
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
});

module.exports = router;

