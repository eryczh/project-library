const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const Book = require("../models/Book");
const Review = require("../models/Review");


router.post('/:bookId', auth, async (req, res) => {
    const { rating, comment } = req.body;

    try {
        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        const review = new Review({
            user: req.user.id,
            book: req.params.bookId,
            rating,
            comment
        });

        await review.save();
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/:bookId', async (req, res) => {
    try {
        const reviews = await Review.find({ book: req.params.bookId }).populate('user', ['name']);
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await review.remove();
        res.json({ msg: 'Review removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;