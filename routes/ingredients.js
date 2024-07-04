const express = require('express');
const router = express.Router();

const ingredientsController = require('../controllers/ingredients');


router.get('/', ingredientsController.getAllIngredients);
router.get('/:id', ingredientsController.ingContTempFunc);
router.post('/', ingredientsController.ingContTempFunc);
router.put('/:id',  ingredientsController.updateIngredient);
router.delete('/:id', ingredientsController.deleteIngredient);

module.exports = router;