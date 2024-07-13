const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requiresAuth } = require('express-openid-connect');

router.post('/register', requiresAuth(), userController.registerUser);
router.post('/login', requiresAuth(), userController.loginUser);
router.get('/', requiresAuth(), userController.getAllUsers);
router.get('/:id', requiresAuth(), userController.getUserById);
router.put('/:id', requiresAuth(), userController.updateUser);
router.delete('/:id', requiresAuth(), userController.deleteUser);

module.exports = router;