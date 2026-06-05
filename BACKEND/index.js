const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Blog API is running...');
});

// Routes
app.use('/api/posts', require('./routes/posts'));
app.use('/api/ai', require('./routes/ai'));

// Serve uploaded files
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)
app.use('/uploads', express.static(uploadsDir))

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
