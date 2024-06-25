const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'User and Product handler'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./routes/swagger.js', './routes/userRoute.js'];

swaggerAutogen(outputFile, routes, doc);