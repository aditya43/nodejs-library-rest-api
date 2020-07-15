const request = require('supertest');
const app = require('../src/app');
const Book = require('../src/models/book');

const {
    authorOneId,
    authorOne,
    authorTwo,
    bookOne,
    populateDatabase
} = require('./fixtures/db');

beforeEach(populateDatabase);
