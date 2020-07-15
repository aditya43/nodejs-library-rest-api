const request = require('supertest');
const app = require('../src/app');
const Author = require('../src/models/author');

const {
    authorOneId,
    authorOne,
    populateDatabase
} = require('./fixtures/db');

beforeEach(populateDatabase);
