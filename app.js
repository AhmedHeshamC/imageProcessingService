const express = require('express');
const app = express();

const setupSwagger = require('./swagger');
setupSwagger(app);

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.redirect('/docs');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Swagger docs available at http://localhost:3000/docs');
});
