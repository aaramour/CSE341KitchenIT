const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

const conversionsController =require('../controllers/conversions');


router.get('/', requiresAuth(), conversionsController.getAllConversions);
router.get('/:id', requiresAuth(), conversionsController.getConversionById);
router.post('/', requiresAuth(), conversionsController.postConversion);
router.put('/:id', requiresAuth(), conversionsController.updateConversion);
router.delete('/:id', requiresAuth(), conversionsController.deleteConversion);

module.exports = router;