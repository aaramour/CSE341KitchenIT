const express = require('express');
const router = express.Router();

 
router.use('/recipes', require('./recipes')
    //    #swagger.tags = ['recipes']
);

router.use('/ingredients', require('./ingredients') 
     //   #swagger.tags = ['ingredients']  
);

router.use('/conversions', require('./conversions') 
     //   #swagger.tags = ['conversions']  
);

router.use('/users', require('./userRoute') 
     //   #swagger.tags = ['users']  
);

router.use('/', require('./swagger'));

module.exports = router;