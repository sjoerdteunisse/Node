//const gameController = require('./src/controllers/game.controller');
const apiError = require('./src/models/apierror.model');
//const gameRoutes = require('./src/routes/game.routes');
const authorizationRoutes = require('./src/routes/authorization.routes');

const express = require('express');
const bodyParser = require('body-parser');
const morgan =  require('morgan');
var app = express();

const expressPort = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());

//Base routing
//app.use('/api', gameRoutes);
app.use('/api', authorizationRoutes);

//Handler non existent routes
app.use('*', (req, res, next) =>{ 
  next(new apiError('Non existing endpoint', '404'))
});

app.use("*", (err, req, res, next) =>{
    console.log('Error handler encountered: ' + err.errorName + ' On: ');
    res.status(err.errorStatus >= 100 && err.errorStatus < 600 ? err.errorStatus : 500).json(err).end();
});

app.listen(expressPort, () => console.log(`Example app listening on ${expressPort}`));

module.exports = app