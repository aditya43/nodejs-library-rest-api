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

test('should create book for author', async () => {
    const response = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${authorOne.tokens[0].token}`)
        .send({
            title: 'From Jest test',
            isbn: '123456789',
            author: authorOneId
        })
        .expect(201);

    const book = await Book.findById(response.body._id);
    expect(book).not.toBeNull();
});

test('should fetch author books', async () => {
    const response = await request(app)
        .get('/authors/books')
        .set('Authorization', `Bearer ${authorOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toEqual(2);
});
