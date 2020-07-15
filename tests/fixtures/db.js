const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Author = require('../../src/models/author');
const Book = require('../../src/models/book');

const authorOneId = new mongoose.Types.ObjectId();
const authorOne = {
    _id: authorOneId,
    name: 'Aditya Hajare',
    email: 'aditya@hajare.com',
    password: '1337wtf!!',
    tokens: [{
        token: jwt.sign({ _id: authorOneId }, process.env.JWT_SECRET)
    }]
};

const authorTwoId = new mongoose.Types.ObjectId();
const authorTwo = {
    _id: authorTwoId,
    name: 'Nishigandha',
    email: 'nishigandha@hajare.com',
    password: '@@secret007pass!!',
    tokens: [{
        token: jwt.sign({ _id: authorTwoId }, process.env.JWT_SECRET)
    }]
};

const bookOne = {
    _id: new mongoose.Types.ObjectId(),
    title: 'First Book',
    isbn: 123456789,
    author: authorOne._id
};

const bookTwo = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Second Book',
    isbn: 123456789,
    author: authorOne._id
};

const bookThree = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Third Book',
    isbn: 123456789,
    author: authorTwo._id
};

const populateDatabase = async () => {
    await Author.deleteMany();
    await Book.deleteMany();
    await new Author(authorOne).save();
    await new Author(authorTwo).save();
    await new Book(bookOne).save();
    await new Book(bookTwo).save();
    await new Book(bookThree).save();
};

module.exports = {
    authorOneId,
    authorOne,
    authorTwoId,
    authorTwo,
    bookOne,
    bookTwo,
    bookThree,
    populateDatabase
};
