require('../db/mongoose'); // Database connection

const Book = require('../models/book');
const Author = require('../models/author');

/**
 * Check if author exists
 *
 * @param {String} authorId
 */
const authorExists = async authorId => {
    try {
        const author = await Author.findOne({
            _id: authorId
        });

        if (!author) {
            return {
                code: 401,
                message: 'Author does not exist'
            };
        }

        return { code: 200 };
    } catch (e) {
        if (e.kind === 'ObjectId') {
            return {
                code: 401,
                message: 'Invalid author id'
            };
        }
        return {
            code: 500,
            message: 'Something went wrong',
            error: e
        };
    }
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
