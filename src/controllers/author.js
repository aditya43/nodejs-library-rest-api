require('../db/mongoose'); // Database connection

const Author = require('../models/author');

/**
 * Create/Add new author
 */
exports.add = async (req, res) => {
    try {
        const author = new Author(req.body);
        await author.save();
        const jwtToken = await author.generateJwtAuthToken();

        res.status(201).send({ author, jwtToken });
    } catch (e) {
        res.status(400).send(e);
    }
};

/**
 * Get currently logged in author's profile
 */
exports.myProfile = async (req, res) => {
    try {
        res.status(200).send(req.author);
    } catch (e) {
        res.status(500).send(e);
    }
};

/**
 * Get books for currently logged in author
 */
exports.myBooks = async (req, res) => {
    try {
        await req.author.populate({
            path: 'books'
        }).execPopulate();

        res.status(200).send(req.author.books);
    } catch (e) {
        res.status(500).send(e);
    }
};

/**
 * Get author by id
 */
exports.get = async (req, res) => {
    try {
        const _id = req.params.id;

        const author = await Author.findById(_id);

        if (!author) {
            return res.status(404).send({
                code: 404,
                message: 'Author not found'
            });
        }

        res.status(200).send(author);
    } catch (e) {
        res.status(500).send(e);
    }
};
