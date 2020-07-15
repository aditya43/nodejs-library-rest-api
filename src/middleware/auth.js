const jwt = require('jsonwebtoken');
const Author = require('../models/author');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const author = await Author.findById({ _id: decoded._id, 'tokens.token': token });

        if (!author) {
            throw new Error('Author not found');
        }

        req.token = token;
        req.author = author;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Authentication failed.' });
    }
};

module.exports = auth;
