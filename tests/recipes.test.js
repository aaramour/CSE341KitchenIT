const request = require('supertest');
const express = require('express');
const mongodb = require('../config/dbConnect');
const recipesController = require('../controllers/recipes');

jest.mock('../controllers/recipes');

const app = express();
app.use(express.json());
app.use('/recipes', require('../routes/recipes'));

describe('Recipes Routes', () => {
    beforeAll(() => {
        // Mock implementation 
        mongodb.getDb = jest.fn().mockReturnValue({
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    find: jest.fn().mockReturnValue({
                        toArray: jest.fn().mockResolvedValue([{ id: '1', name: 'Test Recipe' }]),
                    }),
                    insertOne: jest.fn().mockResolvedValue({
                        ops: [{ id: '1', name: 'Test Recipe' }],
                    }),
                    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Test Recipe' }),
                    replaceOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
                    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
                }),
            }),
        });
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should fetch a recipe by tag', async () => {
        const mockTag = 'dessert';
        recipesController.getRecipeByTag.mockImplementation((req, res) => {
            res.status(200).json([{ id: '1', name: 'Test Recipe', tags: [mockTag] }]);
        });

        const response = await request(app).get(`/recipes/findByTags/${mockTag}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: '1', name: 'Test Recipe', tags: [mockTag] }]);
    });

    it('should fetch a recipe by ID', async () => {
        const mockId = '1';
        recipesController.getRecipeById.mockImplementation((req, res) => {
            res.status(200).json({ id: mockId, name: 'Test Recipe' });
        });

        const response = await request(app).get(`/recipes/${mockId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: mockId, name: 'Test Recipe' });
    });

    it('should create a new recipe', async () => {
        recipesController.postRecipe.mockImplementation((req, res) => {
            res.status(201).json({ message: 'Recipe created successfully', recipe: { id: '1', name: 'Test Recipe' } });
        });

        const response = await request(app).post('/recipes').send({ name: 'Test Recipe' });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Recipe created successfully');
    });

    it('should update a recipe', async () => {
        const mockId = '1';
        recipesController.updateRecipe.mockImplementation((req, res) => {
            res.status(204).send();
        });

        const response = await request(app).put(`/recipes/${mockId}`).send({ name: 'Updated Recipe' });
        expect(response.status).toBe(204);
    });

    it('should delete a recipe', async () => {
        const mockId = '1';
        recipesController.deleteRecipe.mockImplementation((req, res) => {
            res.status(200).send();
        });

        const response = await request(app).delete(`/recipes/${mockId}`);
        expect(response.status).toBe(200);
    });

    it('should upload an image for a recipe', async () => {
        const mockId = '1';
        recipesController.uploadImage.mockImplementation((req, res) => {
            res.status(200).json({ message: 'Image uploaded successfully' });
        });

        const response = await request(app).post(`/recipes/${mockId}/uploadImage`).send({ imageUrl: 'http://example.com/image.jpg' });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Image uploaded successfully');
    });

    it('should add a review to a recipe', async () => {
        const mockId = '1';
        recipesController.addReview.mockImplementation((req, res) => {
            res.status(200).json({ message: 'Review added successfully' });
        });

        const response = await request(app).post(`/recipes/${mockId}/addReview`).send({ review: 'Great recipe!' });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Review added successfully');
    });
});