const express = require('express');
const authorController = require('../controllers/author');

const router = new express.Router();

router.post('/authors', authorController.add);

module.exports = router;
