const express = require('express');
const router = express.Router();

const recipesController = require('../controllers/recipes');


router.get('/findByTags', recipesController.recipesContTempFunc);
router.get('/:id', recipesController.recipesContTempFunc);
router.post('/', recipesController.recipesContTempFunc);
router.put('/:id', recipesController.recipesContTempFunc);
router.delete('/:id', recipesController.recipesContTempFunc);
router.post('/:id/uploadImage', recipesController.recipesContTempFunc);
router.post('/:id/addReview', recipesController.recipesContTempFunc);

module.exports = router;