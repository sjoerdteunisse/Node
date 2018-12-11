
const jwtConfig = require('./jwtConfig');
var jwtAsync = require('jsonwebtoken');
const apiError = require('../models/apierror.model');


function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    
    if (!token)
       return next(new apiError('Authorization - No token provided.', '401'))

    console.log(token);


    jwtAsync.verify(token, jwtConfig.secret, function(err, decoded) {
   
        if(err){
            return next(new apiError('Authorization - Token invalid - try logging in again.', '401'))
        }

        if (decoded.id) {
            //Store id in request.
            req.userId = decoded.id;
            next();
        } //Token not right
        else {
            next(new apiError('Authorization - No token provided.', '401'));
        }
    });
}

module.exports = verifyToken;