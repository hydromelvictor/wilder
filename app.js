const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

require('dotenv').config();


// the routes
const groupRts = require('./routes/base/group')
const levelRts = require('./routes/base/level')
const AuthRts = require('./routes/user/auth')


// connexion a la base de donnees
mongoose.connect('mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.error('Connexion à MongoDB échouée !'));


const app = express();
const swaggerDocument = YAML.load('./swagger.yaml'); // Charger le fichier YAML

// cors 
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// fichier de sauvegarde des images
app.use('/images', express.static(path.join(__dirname, 'images')));

// endpoint root
app.use('/security/groups', groupRts)
app.use('/security/levels', levelRts)

app.use('/auth', AuthRts)

module.exports = app;
