var passport = require('passport-strategy')
    , util = require('util')
    , JWTR = require('jwt-redis'),
    jwt = require('jsonwebtoken');

function JWTRStrategy(options, verify) {

    const self = this;
    this.name = options.name || 'jwtr';
    passport.Strategy.call(this, options, verify);

    if (typeof options === 'function') {
        verify = options;
        options = {};
    }
    if (!verify) {
        throw new TypeError('LocalStrategy requires a verify callback');
    }

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


    this._passReqToCallback = options.passReqToCallback;
    var jsonWebTokenOptions = options.jsonWebTokenOptions || {};


    this._verifOpts = Object.assign({}, jsonWebTokenOptions, {
        audience: options.audience,
        issuer: options.issuer,
        algorithms: options.algorithms,
        ignoreExpiration: !!options.ignoreExpiration
    });

    if (options.jwtr) {
        this._jwtr = options.jwtr;
    } else if (options.redis) {
        this._redis = options.redis;
        this._jwtr = new JWTR(this._redis);
    } else {
        throw new TypeError('JwtrStrategy requires a Redis client or JWTR instant');
    }


}
util.inherits(JWTRStrategy, passport.Strategy);


JWTRStrategy.prototype.authenticate = function (req, options) {

    var self = this;
    var token = self._jwtFromRequest(req);

    return self._jwtr.verify(token, self._secretOrKey, self._verifOpts, function (jwt_err, payload) {
        if (jwt_err) {
            return self.error(jwt_err);
        } else {

            req.logout = function (cb) {
                return self._jwtr.destroy(token, self._secretOrKey, self._verifOpts, cb);
            };
            req.logoutAll = function (cb) {
                return self._jwtr.destroyById(user.id, self._verifOpts, cb);
            };
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