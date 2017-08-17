const http = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const bodyParser = require('body-parser');
const express = require('express');
const JWTR = require('jwt-redis');
const RedisClient = require('ioredis-mock').default;
const JwtrStrategy = require('../lib/index').Strategy;
const ExtractJwt = require('../lib/index').ExtractJwt;
const passport = require('passport');

chai.use(chaiHttp);
chai.use(dirtyChai);

const expect = chai.expect;

describe('', function () {

    const port = 3000;
    const secretKey = 'secret';
    const nickname = 'Alex';

    before('', function (done) {
        const redisClient = new RedisClient();
        const app = express();
        app.use(bodyParser());
        const opts = {};
        opts.jwtFromRequest = ExtractJwt.fromHeader('token');
        opts.secretOrKey = secretKey;
        opts.redis = redisClient;
        const jwtStrategy = new JwtrStrategy(opts, function (payload, done) {
            return done(null, payload);
        });
        passport.use(jwtStrategy);
        app.use(passport.initialize());
        const jwtr = new JWTR(redisClient);
        app.post('/login', function (req, res) {
            jwtr.sign({nickname: req.body.nickname}, secretKey, function (err, token) {
                if (err) {
                    res.status(500).json(err);
                }
                return res.status(200).json(token);
            });
        });
        app.get('/', passport.authenticate('jwtr', {session: false}), function (req, res) {
            return res.status(200).json(req.user);
        });

        app.get('/logout', passport.authenticate('jwtr', {session: false}), function (req, res) {
            return req.logout(function (err) {
                if (err) {
                    res.status(500).json(err);
                }
                return res.status(204).end();
            });

        });

        app.use(function (err, req, res, next) {
            return res.status(500).json(err);
        });
        const server = http.createServer(app);
        server.listen(port, done);

    });

    it('', function (done) {
        chai
            .request('http://localhost:' + port)
            .post('/login')
            .send({nickname: nickname})
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json();
                done();
            })
            .catch(done);

    });

    it('', function (done) {
        chai
            .request('http://localhost:' + port)
            .post('/login')
            .send({nickname: nickname})
            .then(function (res) {
                return chai
                    .request('http://localhost:' + port)
                    .get('/')
                    .set('token', res.body)

            })
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json();
                console.log(res.body)
                done();
            })
            .catch(done);
    });

    it('', function (done) {
        chai
            .request('http://localhost:' + port)
            .post('/login')
            .send({nickname: nickname})
            .then(function (res) {
                return chai
                    .request('http://localhost:' + port)
                    .get('/')
                    .set('token', res.body)
                    .then(function () {
                        return chai
                            .request('http://localhost:' + port)
                            .get('/logout')
                            .set('token', res.body)
                    })
                    .then(function () {
                        return chai
                            .request('http://localhost:' + port)
                            .get('/')
                            .set('token', res.body)
                            .catch(function (res) {
                                console.log(res)
                                return;
                            })
                    })
                    .then(function (res) {
                        done()
                    })

            })

            .catch(done);
    });


});