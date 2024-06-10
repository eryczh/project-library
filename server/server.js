const express = require('express');
const mongoose = require('mongoose');
const dontev = require('dotenv');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const reviewRoutes = require('./routes/reviews');

dontev.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error(err);
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${5000}`)
});