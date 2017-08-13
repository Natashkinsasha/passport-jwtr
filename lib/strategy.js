var passport = require('passport-strategy')
    , util = require('util')
    , assign = require('./helpers/assign.js')
    , JWTR = require('jwt-redis');

function JWTRStrategy(options, verify) {

    passport.Strategy.call(this);
    this.name = 'jwtr';

    this._secretOrKey = options.secretOrKey;
    if (!this._secretOrKey) {
        throw new TypeError('JwtStrategy requires a secret or key');
    }

    this._verify = verify;
    if (!this._verify) {
        throw new TypeError('JwtStrategy requires a verify callback');
    }

    this._jwtFromRequest = options.jwtFromRequest;
    if (!this._jwtFromRequest) {
        throw new TypeError('JwtStrategy requires a function to retrieve jwt from requests (see option jwtFromRequest)');
    }

    this._redisClient = options.redisClien;
    if (!this._redisClient) {
        throw new TypeError('JwtStrategy requires a Redis client');
    }

    this._passReqToCallback = options.passReqToCallback;
    var jsonWebTokenOptions = options.jsonWebTokenOptions || {};


    this._verifOpts = assign({}, jsonWebTokenOptions, {
        audience: options.audience,
        issuer: options.issuer,
        algorithms: options.algorithms,
        ignoreExpiration: !!options.ignoreExpiration
    });

    this._jwtr = new JWTR(this._redisClient);

}
util.inherits(JWTRStrategy, passport.Strategy);


JWTRStrategy.JwtVerifier = function (token, secretOrKey, options, callback) {
    return this._jwtr.verify(token, secretOrKey, options, callback);
};


JWTRStrategy.prototype.authenticate = function (req, options) {
    var self = this;

    var token = self._jwtFromRequest(req);

    if (!token) {
        return self.fail(new Error("No auth token"));
    }

    JWTRStrategy.JwtVerifier(token, this._secretOrKey, this._verifOpts, function (jwt_err, payload) {
        if (jwt_err) {
            return self.fail(jwt_err);
        } else {
            var verified = function (err, user, info) {
                if (err) {
                    return self.error(err);
                } else if (!user) {
                    return self.fail(info);
                } else {
                    return self.success(user, info);
                }
            };

            try {
                if (self._passReqToCallback) {
                    self._verify(req, payload, verified);
                } else {
                    self._verify(payload, verified);
                }
            } catch (ex) {
                self.error(ex);
            }
        }
    });
};

module.exports = JWTRStrategy;