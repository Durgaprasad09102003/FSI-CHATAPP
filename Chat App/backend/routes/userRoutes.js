const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/uploads'); 
        cb(null, dir);
    },
    filename: async (req, file, cb) => {
        try {
            const extname = '.jpg'; 
            
            const user = await User.findById(req.params.userId).select('phoneNumber'); 
            if (!user) {
                return cb(new Error('User not found'), null);
            }

            const phoneNumber = user.phoneNumber;
            const sanitizedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');

            const uniqueFilename = `${sanitizedPhoneNumber}${extname}`; 
            cb(null, uniqueFilename); 
        } catch (err) {
            cb(err, null); 
        }
    }
});


const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Invalid file type! Only JPEG and PNG are allowed.'));
    }
});


router.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params; 

    try {
        const user = await User.findById(userId)
    .select('username phoneNumber avatar email dateOfBirth bio'); 
        
        if (!user){
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Respond with user data
        res.status(200).json({
            success: true,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth,
            avatar: user.avatar,
            bio: user.bio,  
        });

        console.log(user);

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});


// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, phoneNumber, dateOfBirth, password } = req.body;
        const lowerCaseUsername = username.toLowerCase();

      
        const existingUser = await User.findOne({
            $or: [
                { username: lowerCaseUsername }, 
                { email },
                { phoneNumber }
            ]
        });

        if (existingUser) {
            if (existingUser.username === lowerCaseUsername) {
                return res.status(400).json({ success: false, message: 'Username already in use.' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ success: false, message: 'Email already in use.' });
            }
            if (existingUser.phoneNumber === phoneNumber) {
                return res.status(400).json({ success: false, message: 'Phone number already in use.' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: lowerCaseUsername,
            email,
            phoneNumber,
            dateOfBirth,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
});


// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const lowerCaseUsername = username.toLowerCase();

        // Find the user by username
        const user = await User.findOne({ username: lowerCaseUsername });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Username or password.' });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Username or password.' });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2s' });

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                username: user.username.toLowerCase(),
                email: user.email,
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
    }
});


router.put('/profile/:userId', upload.single('avatar'), async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ success: false, message: req.fileValidationError });
    }
    try {
        console.log('Uploaded file:', req.file); // This will log the uploaded file

        const { userId } = req.params;
        const { updateName, updateBio } = req.body;
        
        const lowerCaseUsername = updateName.toLowerCase();

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Update user information only if the fields exist
        if (updateName) {
            user.username = lowerCaseUsername; // Update the user's name
        }
        if (updateBio) {
            user.bio = updateBio; // Update the user's bio
        }
        if (req.file) {
            user.avatar = req.file.path; // Save the path of the uploaded file
        }

        await user.save(); // Save the updated user

        res.status(200).json({ 
            success: true, 
            message: 'Profile updated successfully.', 
            updatedFields: {
                username: user.username,
                bio: user.bio,
                avatar: user.avatar
            } 
        });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ success: false, message: 'Profile update failed. Please try again.' });
    }
});


router.post('/addContact', async (req, res) => {
    const { number } = req.body; // Extract the number from the request body

    try {
        // Find the user by phone number and select only the necessary fields
        const user = await User.findOne({ phoneNumber: number }).select('_id');

        // Check if the user was found
        if (!user) {
            return res.status(404).json({ success: false, message: 'User  not found.' });
        }

        // Respond with user data
        res.status(200).json({
            success: true,
            receiverId: user._id // Return the receiverId of the found user
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});
module.exports = router;
