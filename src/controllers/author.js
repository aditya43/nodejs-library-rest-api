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

/**
 * Logout all sessions
 */
exports.logoutAll = async (req, res) => {
    try {
        req.author.tokens = [];
        await req.author.save();
        res.status(200).send({
            code: 200,
            message: 'success'
        });
    } catch (error) {
        res.status(500).send();
    }
};
