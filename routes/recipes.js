const express = require('express');
const router = express.Router();

const recipesController = require('../controllers/recipes');


router.get('/findByTags', recipesController.recipesContTempFunc);
router.get('/:id', recipesController.recipesContTempFunc);
router.post('/', recipesController.postRecipe);
router.put('/:id', recipesController.updateRecipe);
router.delete('/:id', recipesController.deleteRecipe);
router.post('/:id/uploadImage', recipesController.uploadImage);
router.post('/:id/addReview', recipesController.addReview);

module.exports = router;