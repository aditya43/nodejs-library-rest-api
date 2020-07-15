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

test('should signup a new author', async () => {
    const response = await request(app)
        .post('/authors')
        .send({
            name: 'Aditya Hajare',
            email: 'aditya.hajare@libraryapp.com',
            password: 'aditya123!'
        })
        .expect(201);

    // Assert that the database was changed correctly.
    const author = await Author.findById(response.body.author._id);
    expect(author).not.toBeNull();

    // Assertion about the response.
    expect(response.body).toMatchObject({
        author: {
            name: 'Aditya Hajare',
            email: 'aditya.hajare@libraryapp.com'
        }
    });

    // Assert that the plain text password is not stored in database.
    expect(author.password).not.toBe('aditya123!');
});

test('should login existing author', async () => {
    const response = await request(app)
        .post('/authors/login')
        .send({
            email: authorOne.email,
            password: authorOne.password
        })
        .expect(200);

    // Assert that the JWT Token stored in database is same as the one received in post login response.
    const author = await Author.findById(response.body.author._id);
    expect(response.body.jwtToken).toBe(author.tokens[1].token);
});

test('should not login nonexistent author', async () => {
    await request(app)
        .post('/authors/login')
        .send({
            email: 'author@example.com',
            password: 'author123'
        })
        .expect(400);
});

test('should get profile for the logged in author', async () => {
    await request(app)
        .get('/authors/me')
        .set('Authorization', `Bearer ${authorOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('should not get profile for the unauthenticated request', async () => {
    await request(app)
        .get('/authors/me')
        .send()
        .expect(401);
});

test('should get books for the logged in author', async () => {
    await request(app)
        .get('/authors/books')
        .set('Authorization', `Bearer ${authorOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('should not get books for the unauthenticated request', async () => {
    await request(app)
        .get('/authors/books')
        .send()
        .expect(401);
});

test('should delete account for author', async () => {
    await request(app)
        .delete('/authors/me')
        .set('Authorization', `Bearer ${authorOne.tokens[0].token}`)
        .send()
        .expect(200);

    // Assert that the author is deleted from database.
    const author = await Author.findById(authorOneId);
    expect(author).toBeNull();
});

test('should not delete account for the unauthenticated author', async () => {
    await request(app)
        .delete('/authors/me')
        .send()
        .expect(401);
});

test('should update valid author fields', async () => {
    await request(app)
        .patch('/authors/me')
        .set('Authorization', `Bearer ${authorOne.tokens[0].token}`)
        .send({
            name: 'John Doe'
        })
        .expect(200);

    // Assert that the updated author name is stored in database.
    const author = await Author.findById(authorOneId);
    expect(author.name).toEqual('John Doe');
});

test('should not update invalid author fields', async () => {
    await request(app)
        .patch('/authors/me')
        .set('Authorization', `Bearer ${authorOne.tokens[0].token}`)
        .send({
            location: 'Pune'
        })
        .expect(400);
});

test('should search and return valid authors', async () => {
    const response = await request(app)
        .post('/authors/search')
        .set('Authorization', `Bearer ${authorOne.tokens[0].token}`)
        .send({
            name: 'aDiTyA',
            limit: 1
        })
        .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].email).toBe('aditya@hajare.com');
});

test('should get author by id', async () => {
    await request(app)
        .get(`/authors/${authorOneId}`)
        .set('Authorization', `Bearer ${authorOne.tokens[0].token}`)
        .expect(200);
});

test('should not get author for non-existent id', async () => {
    await request(app)
        .get(`/authors/99999999999999999`)
        .set('Authorization', `Bearer ${authorOne.tokens[0].token}`)
        .expect(500);
});
