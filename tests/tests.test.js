require('dotenv').config();

const sequelize = require('../utils/db')
const request = require('supertest');
const Member = require('../models/member');
const app = require('../app');

// A helper function to seed the database with some test data
async function seedDatabase() {
    await Member.bulkCreate([
        { id: 1, name: 'John Doe', face: 'image1.jpg', face_feature: 'long string of face features' },
        { id: 2, name: 'Jane Doe', face: 'image2.jpg', face_feature: 'long string of face features' },
        { id: 3, name: 'Bob Smith', face: 'image3.jpg', face_feature: 'long string of face features' },
    ]);
}

describe('API endpoints', () => {
    beforeAll(async () => {
        // Connect to the database before running the tests
        await sequelize.authenticate();
    });

    afterAll(async () => {
        // Disconnect from the database after running the tests
        await sequelize.close();
    });

    beforeEach(async () => {
        // Clear the database and seed it with test data before each test
        await sequelize.sync({ force: true });
        await seedDatabase();
    });

    describe('POST /members', () => {
        test('creates new members in the database', async () => {
            const newMembers = [
                { id: 4, name: 'Alice Smith', face: 'image4.jpg', face_feature: 'long string of face features' },
                { id: 5, name: 'Bob Doe', face: 'image5.jpg', face_feature: 'long string of face features' },
            ];

            const response = await request(app)
                .post('/members')
                .send(newMembers);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(newMembers.length);

            const members = await Member.findAll();
            expect(members.length).toBe(5);
        });

        test('returns an error if the request body is empty', async () => {
            const response = await request(app)
                .post('/members')
                .send([]);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'No facial data contained in request' });
        });
    });

    describe('GET /members', () => {
        test('returns all members in the database', async () => {
            const response = await request(app)
                .get('/members');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('name');
            expect(response.body[0]).toHaveProperty('face');
            expect(response.body[0]).toHaveProperty('face_feature');
        });
    });
});
