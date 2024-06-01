const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');

router.post('/', auth, async (req, res) => {
    const { title, author, genre, summary } = req.body;

    try {
        let book = new Book({
            title,
            author,
            genre,
            summary
        });

        book = await book.save();
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.status(500).send('Server error');
    }
});

router.put('/:id', auth, async (req, res) => {
    const { title, author, genre, summary } = req.body;

    const updatedBook = { title, author, genre, summary };

    try {
        let book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        book = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: updatedBook },
            { new: true }
        );

        res.json(book);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        await book.remove();
        res.json({ msg: 'Book removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;
