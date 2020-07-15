const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 50,
        required: true
    },
    isbn: {
        type: Number,
        required: true,
        validate (value) {
            if (value < 0) {
                throw new Error('ISBN must be positive number');
            }

            if (value.toString().length < 9 || value.toString().length > 11) {
                throw new Error('ISBN number must be 9 to 11 digits long');
            }
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        trim: true,
        required: true
    },
    releaseDate: {
        type: Date,
        validate (value) {
            if (isNaN(Date.parse(value))) {
                throw new Error('Invalid release date. Correct format: YYYY-MM-DD');
            }
        }
    }
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
