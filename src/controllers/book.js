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

/**
 * Get books associated with currently logged in author
 */
exports.myBooks = async (req, res) => {
    const sort = {};

    if (req.query.sortBy) {
        const sortByParts = req.query.sortBy.split(':');
        sort[sortByParts[0]] = sortByParts[1] === 'asc' ? 1 : -1;
    }

    try {
        const limit = req.query.limit || 10;
        const skip = req.query.skip || 0;

        await req.author.populate({
            path: 'books',
            options: {
                limit: parseInt(limit),
                skip: parseInt(skip),
                sort
            }
        }).execPopulate();
        res.status(200).send(req.author.books);
    } catch (e) {
        res.status(500).send(e);
    }
};

/**
 * Search books
 */
exports.search = async (req, res) => {
    try {
        const sort = {};
        const criteria = {};

        if (req.body.sortBy) {
            const sortByParts = req.body.sortBy.split(':');
            sort[sortByParts[0]] = sortByParts[1] === 'asc' ? 1 : -1;
        }

        const limit = req.body.limit || 10;
        const skip = req.body.skip || 0;

        delete req.body.limit;
        delete req.body.skip;
        delete req.body.sortBy;

        const parameters = Object.keys(req.body);
        const allowedSearch = ['title', 'isbn', 'releaseDate', 'author'];
        const isParamAllowedToSearch = parameters.every(param => allowedSearch.includes(param));

        if (!isParamAllowedToSearch) {
            return res.status(400).send({ error: 'Invalid search fields' });
        }

        if (req.body.title) {
            criteria.title = new RegExp(req.body.title, 'i');
        }

        if (req.body.isbn) {
            criteria.isbn = req.body.isbn;
        }

        if (req.body.releaseDate) {
            criteria.releaseDate = req.body.releaseDate;
        }

        if (req.body.author) {
            criteria.author = req.body.author;
        }
        const books = await Book.find(criteria, null, {
            limit: parseInt(limit),
            skip: parseInt(skip),
            sort
        }).populate('author');

        if (books.length === 0) {
            return res.status(404).send({
                code: 400,
                error: '0 Books found!'
            });
        }

        res.status(200).send(books);
    } catch (e) {
        res.status(500).send(e);
    }
};

/**
 * Get book by id
 */
exports.get = async (req, res) => {
    try {
        const book = await Book.findOne({
            _id: req.params.id
        }).populate('author');

        if (!book) {
            res.status(404).send({ error: 'Book not found!' });
        }

        res.status(200).send(book);
    } catch (e) {
        res.status(500).send(e);
    }
};

/**
 * Update book owned by currently logged in author
 */
exports.update = async (req, res) => {
    const parameters = Object.keys(req.body);
    const allowedUpdates = ['title', 'isbn', 'author', 'releaseDate'];

    const isParamAllowedToUpdated = parameters.every(param => allowedUpdates.includes(param));

    if (!isParamAllowedToUpdated) {
        return res.status(400).send({ error: 'Invalid update field' });
    }

    try {
        // If we use findByIdAndUpdate(), Mongoose middleware won't be executed.
        const book = await Book.findOne({
            _id: req.params.id,
            author: req.author.id
        }).populate('author');

        if (!book) {
            res.status(404).send({ error: 'Book not found!' });
        }

        parameters.forEach(param => {
            book[param] = req.body[param];
        });

        await book.save();

        res.status(200).send(book);
    } catch (e) {
        res.status(400).send(e);
    }
};
