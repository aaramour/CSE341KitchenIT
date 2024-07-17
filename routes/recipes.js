const express = require('express');
const router = express.Router();

const recipesController = require('../controllers/recipes');


router.get('/findByTags/:tag', recipesController.getRecipeByTag);
router.get('/:id', recipesController.getRecipeById);
router.post('/', recipesController.postRecipe);
router.put('/:id', recipesController.updateRecipe);
router.delete('/:id', recipesController.deleteRecipe);
router.post('/:id/uploadImage', recipesController.uploadImage);
router.post('/:id/addReview', recipesController.addReview);

module.exports = router;