const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');
const mongodb = require('../config/dbConnect');
const conversionsRouter = require('../routes/conversions');

const app = express();
app.use(express.json());
app.use('/conversions', conversionsRouter);

jest.mock('express-openid-connect', () => ({
  requiresAuth: () => (req, res, next) => next(),
}));

describe('Conversions API', () => {
  let dbMock;
  beforeAll(() => {
    dbMock = {
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
      insertOne: jest.fn(),
      replaceOne: jest.fn(),
      deleteOne: jest.fn(),
    };
    mongodb.getDb = jest.fn().mockReturnValue({
      db: jest.fn().mockReturnValue(dbMock),
    });
  });

  describe('GET /conversions', () => {
    it('should fetch all conversions', async () => {
      dbMock.toArray.mockResolvedValue([{ _id: '1', valueOne: 'test1', valueTwo: 'test2' }]);

      const res = await request(app).get('/conversions');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ _id: '1', valueOne: 'test1', valueTwo: 'test2' }]);
    });

    it('should handle errors', async () => {
      dbMock.toArray.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/conversions');
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Error fetching conversions' });
    });
  });

  describe('GET /conversions/:id', () => {
    it('should fetch a single conversion by ID', async () => {
      dbMock.toArray.mockResolvedValue([{ _id: '1', valueOne: 'test1', valueTwo: 'test2' }]);

      const res = await request(app).get('/conversions/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ _id: '1', valueOne: 'test1', valueTwo: 'test2' }]);
    });

    it('should handle invalid ID', async () => {
      const res = await request(app).get('/conversions/invalid-id');
      expect(res.statusCode).toBe(400);
      expect(res.body).toBe('Invalid conversion ID.');
    });

    it('should handle errors', async () => {
      dbMock.toArray.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/conversions/1');
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual(new Error('Database error'));
    });
  });

  describe('POST /conversions', () => {
    it('should create a new conversion', async () => {
      dbMock.insertOne.mockResolvedValue({ ops: [{ _id: '1', valueOne: 'test1', valueTwo: 'test2' }] });

      const res = await request(app).post('/conversions').send({ valueOne: 'test1', valueTwo: 'test2' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        message: 'Conversion created successfully',
        conversion: { _id: '1', valueOne: 'test1', valueTwo: 'test2' },
      });
    });

    it('should handle missing fields', async () => {
      const res = await request(app).post('/conversions').send({ valueOne: 'test1' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Missing required fields' });
    });

    it('should handle errors', async () => {
      dbMock.insertOne.mockRejectedValue(new Error('Database error'));

      const res = await request(app).post('/conversions').send({ valueOne: 'test1', valueTwo: 'test2' });
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Error posting conversion' });
    });
  });

  describe('PUT /conversions/:id', () => {
    it('should update an existing conversion', async () => {
      dbMock.replaceOne.mockResolvedValue({ modifiedCount: 1 });

      const res = await request(app).put('/conversions/1').send({ valueOne: 'test1', valueTwo: 'test2' });
      expect(res.statusCode).toBe(204);
    });

    it('should handle invalid ID', async () => {
      const res = await request(app).put('/conversions/invalid-id').send({ valueOne: 'test1', valueTwo: 'test2' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toBe('The conversion id must be valid in order to update.');
    });

    it('should handle errors', async () => {
      dbMock.replaceOne.mockRejectedValue(new Error('Database error'));

      const res = await request(app).put('/conversions/1').send({ valueOne: 'test1', valueTwo: 'test2' });
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Database error' });
    });
  });

  describe('DELETE /conversions/:id', () => {
    it('should delete an existing conversion', async () => {
      dbMock.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const res = await request(app).delete('/conversions/1');
      expect(res.statusCode).toBe(200);
    });

    it('should handle invalid ID', async () => {
      const res = await request(app).delete('/conversions/invalid-id');
      expect(res.statusCode).toBe(400);
      expect(res.body).toBe('The conversion id must be valid in order to delete.');
    });

    it('should handle errors', async () => {
      dbMock.deleteOne.mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/conversions/1');
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Database error' });
    });
  });
});