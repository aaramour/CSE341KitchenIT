const request = require('supertest');
const app = require('../server'); // Import the app directly

// Load environment variables from .env file
require('dotenv').config();

describe('Server Routes', () => {
    it('should redirect to login on root route if not authenticated', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(302);
    });

    it('should redirect to login on /api-docs if not authenticated', async () => {
        const response = await request(app).get('/api-docs');
        expect(response.status).toBe(302);
    });

    describe('Authentication', () => {
        it('should redirect to login if not authenticated on /recipes', async () => {
            const response = await request(app).get('/recipes');
            expect(response.status).toBe(302);
        });

        it('should redirect to login if not authenticated on /conversions', async () => {
            const response = await request(app).get('/conversions');
            expect(response.status).toBe(302);
        });

        it('should redirect to login if not authenticated on /users', async () => {
            const response = await request(app).get('/users');
            expect(response.status).toBe(302);
        });

        it('should redirect to login if not authenticated on /ingredients', async () => {
            const response = await request(app).get('/ingredients');
            expect(response.status).toBe(302);
        });
    });
});