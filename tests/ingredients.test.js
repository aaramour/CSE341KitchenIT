const request = require('supertest');
const express = require('express');
const mongodb = require('../config/dbConnect');
const ingredientsRouter = require('../routes/ingredients');

const app = express();
app.use(express.json()); // For parsing application/json
app.use('/ingredients', ingredientsRouter);

jest.mock('../config/dbConnect');

describe('Ingredients API', () => {
    let mockDb;

    beforeAll(() => {
        mockDb = {
            collection: jest.fn().mockReturnThis(),
            find: jest.fn().mockReturnThis(),
            toArray: jest.fn(),
            insertOne: jest.fn(),
            replaceOne: jest.fn(),
            deleteOne: jest.fn(),
        };

        mongodb.getDb.mockReturnValue({
            db: jest.fn().mockReturnValue(mockDb)
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('GET /ingredients - success', async () => {
        const mockIngredients = [{ name: 'Tomato', quantity: 5, unit: 'kg' }];
        mockDb.toArray.mockResolvedValue(mockIngredients);

        const response = await request(app).get('/ingredients');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockIngredients);
        expect(mockDb.toArray).toHaveBeenCalled();
    });

    test('POST /ingredients - success', async () => {
        const newIngredient = { name: 'Onion', quantity: 3, unit: 'kg' };
        mockDb.insertOne.mockResolvedValue({ ops: [newIngredient] });

        const response = await request(app)
            .post('/ingredients')
            .send(newIngredient);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "Ingredient added successfully",
            ingredient: newIngredient
        });
        expect(mockDb.insertOne).toHaveBeenCalledWith(expect.objectContaining(newIngredient));
    });

    test('POST /ingredients - missing fields', async () => {
        const response = await request(app).post('/ingredients').send({ name: 'Onion' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Missing required fields" });
    });

    // Add more tests for GET by ID, PUT, DELETE, etc.
});