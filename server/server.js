const express = require('express');
const mongoose = require('mongoose');
const dontev = require('dotenv');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');

dontev.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error(err);
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${5000}`)
});