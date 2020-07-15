const request = require('supertest');
const app = require('../src/app');
const Author = require('../src/models/author');

const {
    authorOneId,
    authorOne,
    populateDatabase
} = require('./fixtures/db');

beforeEach(populateDatabase);

test('should not allow password to contain word password', async () => {
    await request(app)
        .post('/authors')
        .send({
            name: 'Aditya Hajare',
            email: 'aditya.hajare@example.com',
            password: 'mypassword'
        })
        .expect(400);
});
