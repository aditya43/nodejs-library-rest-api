const express = require('express');
const bookController = require('../controllers/book');
const authMiddleware = require('../middleware/auth');

const router = new express.Router();

router.post('/books', authMiddleware, bookController.add);
// router.post('/books/search', authMiddleware, bookController.search);

// GET /books?limit=10&skip=10
// GET /books?sortBy=createdAt:asc
// GET /books?sortBy=createdAt:desc
// GET /books?sortBy=releaseDate:asc
// GET /books?sortBy=releaseDate:desc
// router.get('/books/me', authMiddleware, bookController.myBooks);

// router.get('/books/:id', authMiddleware, bookController.get);
// router.patch('/books/:id', authMiddleware, bookController.update);
// router.delete('/books/:id', authMiddleware, bookController.delete);

module.exports = router;
