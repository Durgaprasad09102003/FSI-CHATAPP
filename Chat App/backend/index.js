const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const path = require('path');

const userRoutes = require('./routes/userRoutes'); 
const chatRoutes = require('./routes/chatRoutes');// Import routes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve static files from the public/uploads directory
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatApplication', { // Added to fix deprecation warnings in MongoDB 4.4 or later versions
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// Other routes and middleware
// Routes
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
