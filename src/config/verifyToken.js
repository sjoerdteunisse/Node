
const jwtConfig = require('./jwtConfig');
var jwtAsync = require('jsonwebtoken');
const ApiError = require('../models/apierror.model');


function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    
    if (!token)
       return next(new ApiError('Authorization - No token provided.', '401'))

    console.log(token);


    jwtAsync.verify(token, jwtConfig.secret, function(err, decoded) {
   
        if (decoded.id) {
            req.userId = decoded.id;
            next();
        }
        else {
            //This shouldn't be a valid case. On Invalid Redirect?
            next(new ApiError('Authorization - No token provided.', '401'));
        }

    });
}

module.exports = verifyToken;