const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    isbn: {
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        trim: true,
        required: true
    },
    releaseDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
