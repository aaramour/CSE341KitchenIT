const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

const ingredientsController = require('../controllers/ingredients');


router.get('/', requiresAuth(), ingredientsController.getAllIngredients);
router.get('/:id', requiresAuth(), ingredientsController.getIngredientById);
router.post('/', requiresAuth(), ingredientsController.postIngredient);
router.put('/:id', requiresAuth(), ingredientsController.updateIngredient);
router.delete('/:id', requiresAuth(), ingredientsController.deleteIngredient);

module.exports = router;