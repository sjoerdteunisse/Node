const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const pool = require('../src/config/mySql');
const bcrypt = require('bcrypt');
const saltRounds = 10;

chai.should();
chai.use(chaiHttp);

const endpointToTest = '/api/user';

const user = {
    firstname: 'firstname',
    lastname: 'lastname',
    email: 'user@server.com',
    password: 'secret'
}


describe('Auth API', () => {

    before((done) => {
        // Verwijder alle voorgaande users uit de tabel
        const query = 'DELETE FROM `users`'
        const cd = 'DELETE FROM `games`';
        pool.query(cd, (err, rows, fields) => {
            if (err) {
                console.dir(err);
                assert.fail(err)
            }
            var queryReset = 'ALTER TABLE games AUTO_INCREMENT = 1';
            pool.query(queryReset, (err, rows, fields) => {
                if (err) {
                    console.dir(err);
                    assert.fail(err)
                }
                bcrypt.hash(user.password, saltRounds, (err, hash) => {

                    pool.query(query, (err, rows, fields) => {
                        if (err) {
                            console.dir(err);
                            assert.fail(err)
                        } else {
                            // Registreer een user in de testdatabase
                            const query = 'INSERT INTO `users` (`firstname`, `lastname`, `email`, `password`) VALUES (?, ?, ?, ?)'

                            const values = [user.firstname, user.lastname, user.email, hash]

                            pool.query(query, values, (err, rows, fields) => {
                                if (err) {
                                    assert.fail(err)
                                } else {
                                    done();
                                }
                            });

                        }
                    })
                });
            });
        });

    });

    // beforeEach functie wordt aangeroepen voor iedere test.
    beforeEach(function () {
        console.log('beforeEach')
        // set things we need for testing
        //
        // Je zou hier kunnen kiezen om de database voor iedere test leeg te maken 
        // en opnieuw te vullen met enkele waarden, zodat je weet wat er in zit.
        //
    });

    // afterEach functie wordt aangeroepen voor iedere test.
    afterEach(function () {
        console.log('afterEach')
        // reset things we changed for testing
    });

    it('creates a user on valid registration', (done) => {

        var user = {
            email: "SuperSecure@gmail.com",
            password: "VerrySecure",
            firstname: "Mc",
            lastname: "Afee"
        };

        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
                // res.should.be.json;
                done();
            });

    })

    it('returns an error on invalid registration', (done) => {

        var user = {
            email: "SuperSecure@gmail.com",
            firstname: "Mc",
            lastname: "Afee"
        };

        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(500);
                // res.should.be.json;
                done();
            });
    })

    it('returns an error on invalid login', (done) => {

        var user = {
            email: 'user@server.com',
            password: 'secret1',
        }

        bcrypt.hash(user.password, saltRounds, (err, hash) => {
            chai.request(server)
                .get('/api/user/login')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(500);
                    // res.should.be.json;
                    done();
                });
        });
    })

    it('returns a token on valid login', function (done) {

        var user = {
            email: 'user@server.com',
            password: 'secret',
        }

        bcrypt.hash(user.password, saltRounds, (err, hash) => {
            chai.request(server)
                .get('/api/user/login')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(200);
                    // res.should.be.json;
                    res.body.should.be.an('object');
                    res.body.should.have.property('token').that.is.a('string');

                    console.log('Returnns the following: ' + res.body.token);



                    module.exports = {
                        token: res.body.token
                    }
                    done();
                });
        });
    });

});