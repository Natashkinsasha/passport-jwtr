var ExtractJwt = require('passport-jwt').ExtractJwt;
const JWTR = require('jwt-redis');
var Strategy = require('./strategy');


module.exports = {
    Strategy: Strategy,
    ExtractJwt: ExtractJwt,
    JsonWebTokenError: JWTR.JsonWebTokenError,
    NotBeforeError: JWTR.NotBeforeError,
    TokenExpiredError: JWTR.TokenExpiredError,
    TokenInvalidError: JWTR.TokenInvalidError,
    TokenDestroyedError: JWTR.TokenDestroyedError
};
