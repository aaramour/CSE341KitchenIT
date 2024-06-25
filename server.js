require('dotenv').config()
const express = require('express');
const app = express();
const mongodb = require('./db/connection')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.set('view engine', 'ejs');


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)
);

mongodb.initDb((err, mongodb ) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(process.env.PORT || port, () => {
        console.log('Connected to DB and listening at port ' + (process.env.PORT || port));
      });
    }
  });

  