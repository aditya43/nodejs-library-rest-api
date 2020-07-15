require('../db/mongoose'); // Database connection

const Book = require('../models/book');
const Author = require('../models/author');

/**
 * Check if author exists
 *
 * @param {String} authorId
 */
const authorExists = async authorId => {
    //
};

/**
 * Add/Create new book
 */
exports.add = async (req, res) => {
    if (req.body.author) {
        // Validate author id string
        checkAuthor = await authorExists(req.body.author); // Validate author

        if (checkAuthor.code !== 200) {
            // Author doesn't exist
            return res.status(400).send(checkAuthor);
        }
    }

    const book = new Book({
        ...req.body
    });

    try {
        await book.save();
        res.status(201).send(book);
    } catch (e) {
        res.status(400).send(e);
    }
};
