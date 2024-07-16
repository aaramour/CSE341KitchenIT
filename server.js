require('dotenv').config()
const express = require('express');
const app = express();
const mongodb = require("./config/dbConnect")
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

const { auth } = require('express-openid-connect');

const config = {
  authRequired: true,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.AUTH_BASE_URL || 'https://cse341kitchenit.onrender.com',
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

app.use(bodyParser.json());

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use('/recipes', require('./routes/recipes')) 
  .use('/conversions', require('./routes/conversions'))
  .use('/users', require('./routes/userRoute'))
  .use('/ingredients', require('./routes/ingredients'))
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })

  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  })

mongodb.initDb((err, mongodb ) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(process.env.PORT || port, () => {
        console.log('Connected to DB and listening at port ' + (process.env.PORT || port));
      });
    }
  });

  