const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwtConfig = require('../config/jwtConfig');
var jwtAsync = require('jsonwebtoken');
const moment = require('moment');
const apiError = require('../models/apierror.model');
const connectionPool = require('../config/mySql');

module.exports = {

    register(req, res, next) {
        console.log('Authcontroller.register called');

        //Validate passed entity to have the required properties.
        if (req.body.email && req.body.password && req.body.firstname && req.body.lastname) {

            //When the length of the registering user is not sufficient.
            if(req.body.password.length < 6)
                return next(new apiError('Password length to short', '422'));

            const sqlCreateUserQuery = "INSERT INTO users (email, password, firstname, lastname) VALUES ( ?, ?, ?, ? )";

            //Run hash alogirthm based on pushed raw password and the amount of salt rounds.
            //Where hash derivitive of cycles = $X$^y$ and X = 2 the Y = hashround ^ 10.
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                connectionPool.query(sqlCreateUserQuery, [req.body.email, hash, req.body.firstname, req.body.lastname], (err, rows, fields) => {
                    if (err) {
                        console.dir(err);
                        return next(new apiError(err.sqlMessage, 500));
                    }

                    const userObj = { email: req.body.email, id: rows.insertId };

                    jwtAsync.sign(userObj, jwtConfig.secret, (err, authRes) => {
                        if (err) {
                            console.dir(err);
                            return next(new apiError(err, 500));
                        }

                        res.set('x-access-token', authRes);
                        res.status(200).send({ auth: true, token: authRes, exp: moment().add(10, 'days').unix, iat: moment().unix() });
                    });
                });
            });
        }
        else {
            return next(new apiError('Please fill in all the details', 500));
        }
    },
    me(req, res, next) {
        console.log('Authcontroller.me called');

        //Requires the acces token to be passed through the header, to validate the identity.
        var token = req.headers['x-access-token'];
        if (!token)
            return res.status(401).send({ auth: false, message: 'No token provided.' });
            jwtAsync.verify(token, jwtConfig.secret, function (err, decoded) {
                if (decoded.email) {
                    req.userId = decoded.email;
                    res.status(200).send(decoded);
                }
                else {
                    next(new apiError('Authorization - No token provided.', '401'));
                }
            });
    },
    login(req, res, next) {
        console.log('Authcontroller.login called');

        if (!(req.body.email && req.body.password))
            return next(new apiError('Please provide your information.', '401'));

        var email = req.body.email;
        var password = req.body.password;

        const sqlQueryByEmail = "SELECT * FROM users WHERE email = ?";

        connectionPool.query(sqlQueryByEmail, [email], function (err, rows, fields) {
            if (err) {
                console.dir(err);
                return next(new apiError(err.sqlMessage, 500));
            }

            //If user does not exist, throw the same generic error. Else, try comparing the passwords.
            if (rows.length > 0) {
                bcrypt.compare(password, rows[0].password, (err, compareResult) => {

                    if (compareResult) {

                        const userObj = { id: rows[0].ID, email: email };

                        jwtAsync.sign(userObj, jwtConfig.secret, (err, authRes) => {
                            if (err) {
                                console.dir(err);
                                return next(new apiError(err, 500));
                            }

                            res.set('x-access-token', authRes);
                            res.status(200).send({ token: authRes, exp: moment().add(10, 'days').unix, iat: moment().unix() });
                        });
                    }
                    else {
                        //When the user failes to provide the correct credentials
                        return next(new apiError('Authentication failed', 500));
                    }
                });
            } else {
                //When the user that tries to login, uses a identifier that doesn't exist.
                //Not hinting the account doesn't existing.
                next(new apiError('Authentication failed', 500));
            }
        });
    }
}