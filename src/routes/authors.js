const express = require('express');
const authorController = require('../controllers/author');
const authMiddleware = require('../middleware/auth');

const router = new express.Router();

router.post('/authors', authorController.add);
router.get('/authors/me', authMiddleware, authorController.myProfile);
// router.get('/authors/books', authMiddleware, authorController.myBooks);
// router.get('/authors/:id', authorController.get);
router.post('/authors/login', authorController.login);
// router.patch('/authors/me', authMiddleware, authorController.update);
// router.delete('/authors/me', authMiddleware, authorController.delete);
// router.post('/authors/search', authMiddleware, authorController.search);
router.post('/authors/logout', authMiddleware, authorController.logout);
router.post('/authors/logoutAll', authMiddleware, authorController.logoutAll);

module.exports = router;
