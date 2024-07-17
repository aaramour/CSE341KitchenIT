const request = require('supertest');
const express = require('express');
const mongodb = require('../config/dbConnect');
const conversionsController = require('../controllers/conversions');

jest.mock('../controllers/conversions');

const app = express();
app.use(express.json());
app.use('/conversions', require('../routes/conversions'));

describe('Conversions Routes', () => {
    beforeAll(() => {
        // Mock implementation 
        mongodb.getDb = jest.fn().mockReturnValue({
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    find: jest.fn().mockReturnValue({
                        toArray: jest.fn().mockResolvedValue([{ id: '1', valueOne: 1, valueTwo: 2 }]),
                    }),
                    insertOne: jest.fn().mockResolvedValue({
                        ops: [{ id: '1', valueOne: 1, valueTwo: 2 }],
                    }),
                    findOne: jest.fn().mockResolvedValue({ id: '1', valueOne: 1, valueTwo: 2 }),
                    replaceOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
                    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
                }),
            }),
        });
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should fetch all conversions', async () => {
        conversionsController.getAllConversions.mockImplementation((req, res) => {
            res.status(200).json([{ id: '1', valueOne: 1, valueTwo: 2 }]);
        });

        const response = await request(app).get('/conversions');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: '1', valueOne: 1, valueTwo: 2 }]);
    });

    it('should fetch a conversion by ID', async () => {
        const mockId = '1';
        conversionsController.getConversionById.mockImplementation((req, res) => {
            res.status(200).json({ id: mockId, valueOne: 1, valueTwo: 2 });
        });

        const response = await request(app).get(`/conversions/${mockId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: mockId, valueOne: 1, valueTwo: 2 });
    });

    it('should create a new conversion', async () => {
        conversionsController.postConversion.mockImplementation((req, res) => {
            res.status(201).json({ message: 'Conversion created successfully', conversion: { id: '1', valueOne: 1, valueTwo: 2 } });
        });

        const response = await request(app).post('/conversions').send({ valueOne: 1, valueTwo: 2 });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Conversion created successfully');
    });

    it('should update a conversion', async () => {
        const mockId = '1';
        conversionsController.updateConversion.mockImplementation((req, res) => {
            res.status(204).send();
        });

        const response = await request(app).put(`/conversions/${mockId}`).send({ valueOne: 2, valueTwo: 3 });
        expect(response.status).toBe(204);
    });

    it('should delete a conversion', async () => {
        const mockId = '1';
        conversionsController.deleteConversion.mockImplementation((req, res) => {
            res.status(200).send();
        });

        const response = await request(app).delete(`/conversions/${mockId}`);
        expect(response.status).toBe(200);
    });
});