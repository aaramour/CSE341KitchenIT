const express = require('express');
const router = express.Router();

const conversionsController =require('../controllers/conversions');


router.get('/', conversionsController.getAllConversions);
router.get('/:id', conversionsController.convContTempFunc);
router.post('/', conversionsController.convContTempFunc);
router.put('/:id', conversionsController.convContTempFunc);
router.delete('/:id', conversionsController.convContTempFunc);

module.exports = router;