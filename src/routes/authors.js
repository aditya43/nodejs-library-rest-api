const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Book = require('../models/book');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate (value) {
            if (value < 0) {
                throw new Error('Age must be positive number');
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate (value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error(`Password cannot contain the word 'password'`);
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Author --> Books Relation.
authorSchema.virtual('books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'author'
});

authorSchema.pre('find', function () {
    this.populate('book');
});

// methods = 'generateJwtAuthToken' method can be called on an instance of 'Author' model.
authorSchema.methods.generateJwtAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
    this.tokens = this.tokens.concat({ token }); // Save token to 'Author' model.

    await this.save(); // Save 'Author' model

    return token;
};

// To remove 'password' and 'tokens' data from 'author' object when returned.
authorSchema.methods.toJSON = function () {
    const author = this.toObject();

    delete author.password;
    delete author.tokens;

    return author;
};

// statics = 'findByCredentials' method will be accessible for calling on 'Author' model itself.
authorSchema.statics.findByCredentials = async (email, password) => {
    const author = await Author.findOne({ email });

    if (!author) {
        throw new Error('Invalid credentials'); // Author not found for given email
    }

    const isPasswordMatch = await bcrypt.compare(password, author.password);

    if (!isPasswordMatch) {
        throw new Error('Invalid credentials'); // Password doesn't match
    }

    return author;
};

// Hash the plain text password before saving.
authorSchema.pre('save', async function (next) { // Using standard function since arrow functions don't bind 'this'.
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }

    next(); // If we don't call 'next()' code will hang here forever and author won't be saved.
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
