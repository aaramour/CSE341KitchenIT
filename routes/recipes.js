const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

const recipesController = require('../controllers/recipes');


router.get('/findByTags/:tag', requiresAuth(), recipesController.getRecipeByTag);
router.get('/:id', requiresAuth(), recipesController.getRecipeById);
router.post('/', requiresAuth(), recipesController.postRecipe);
router.put('/:id', requiresAuth(), recipesController.updateRecipe);
router.delete('/:id', requiresAuth(), recipesController.deleteRecipe);
router.post('/:id/uploadImage', requiresAuth(), recipesController.uploadImage);
router.post('/:id/addReview', requiresAuth(), recipesController.addReview);

module.exports = router;