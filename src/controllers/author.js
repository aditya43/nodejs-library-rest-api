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

/**
 * Update profile for currently logged in author
 */
exports.update = async (req, res) => {
    const parameters = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isParamAllowedToUpdated = parameters.every(param => allowedUpdates.includes(param));

    if (!isParamAllowedToUpdated) {
        return res.status(400).send({ error: 'Invalid update field' });
    }

    try {
        // If we use findByIdAndUpdate(), Mongoose middleware won't be executed.
        parameters.forEach((param) => {
            req.author[param] = req.body[param];
        });

        await req.author.save();

        return res.status(200).send(req.author);
    } catch (e) {
        res.status(400).send(e);
    }
};

/**
 * Delete currently logged in author's account
 */
exports.delete = async (req, res) => {
    try {
        await req.author.remove();
        res.status(200).send(req.author);
    } catch (e) {
        res.status(400).send(e);
    }
};

/**
 * Author login
 */
exports.login = async (req, res) => {
    try {
        const author = await Author.findByCredentials(req.body.email, req.body.password);
        const jwtToken = await author.generateJwtAuthToken();

        res.status(200).send({ author, jwtToken });
    } catch (e) {
        res.status(400).send({ error: 'Invalid credentials' });
    }
};

/**
 * Logout author
 */
exports.logout = async (req, res) => {
    try {
        req.author.tokens = req.author.tokens.filter(token => {
            return token.token !== req.token;
        });

        await req.author.save();

        res.status(200).send({
            code: 200,
            message: 'success'
        });
    } catch (error) {
        res.status(500).send();
    }
};
