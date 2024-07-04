const express = require('express');
const router = express.Router();

const conversionsController =require('../controllers/conversions');


router.get('/', conversionsController.getAllConversions);
router.get('/:id', conversionsController.convContTempFunc);
router.post('/', conversionsController.postConversion);
router.put('/:id', conversionsController.updateConversion);
router.delete('/:id', conversionsController.deleteConversion);

module.exports = router;