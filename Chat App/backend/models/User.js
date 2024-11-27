const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    bio: {
        type: String,
        default: "Hey, there I am using Chat App",
    },
    lastSeen: {
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;