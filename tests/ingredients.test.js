const request = require('supertest');
const express = require('express');
const mongodb = require('../config/dbConnect');
const ingredientsController = require('../controllers/ingredients');

jest.mock('../controllers/ingredients');

const app = express();
app.use(express.json());
app.use('/ingredients', require('../routes/ingredients'));

describe('Ingredients Routes', () => {
    beforeAll(() => {
        // Mock implementation 
        mongodb.getDb = jest.fn().mockReturnValue({
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    find: jest.fn().mockReturnValue({
                        toArray: jest.fn().mockResolvedValue([{ id: '1', name: 'Sugar' }]),
                    }),
                    insertOne: jest.fn().mockResolvedValue({
                        ops: [{ id: '1', name: 'Sugar' }],
                    }),
                    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Sugar' }),
                    replaceOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
                    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
                }),
            }),
        });
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should fetch all ingredients', async () => {
        ingredientsController.getAllIngredients.mockImplementation((req, res) => {
            res.status(200).json([{ id: '1', name: 'Sugar' }]);
        });

        const response = await request(app).get('/ingredients');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: '1', name: 'Sugar' }]);
    });

    it('should fetch an ingredient by ID', async () => {
        const mockId = '1';
        ingredientsController.getIngredientById.mockImplementation((req, res) => {
            res.status(200).json({ id: mockId, name: 'Sugar' });
        });

        const response = await request(app).get(`/ingredients/${mockId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: mockId, name: 'Sugar' });
    });

    it('should create a new ingredient', async () => {
        ingredientsController.postIngredient.mockImplementation((req, res) => {
            res.status(201).json({ message: 'Ingredient created successfully', ingredient: { id: '1', name: 'Sugar' } });
        });

        const response = await request(app).post('/ingredients').send({ name: 'Sugar' });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Ingredient created successfully');
    });

    it('should update an ingredient', async () => {
        const mockId = '1';
        ingredientsController.updateIngredient.mockImplementation((req, res) => {
            res.status(204).send();
        });

        const response = await request(app).put(`/ingredients/${mockId}`).send({ name: 'Brown Sugar' });
        expect(response.status).toBe(204);
    });

    it('should delete an ingredient', async () => {
        const mockId = '1';
        ingredientsController.deleteIngredient.mockImplementation((req, res) => {
            res.status(200).send();
        });

        const response = await request(app).delete(`/ingredients/${mockId}`);
        expect(response.status).toBe(200);
    });
});