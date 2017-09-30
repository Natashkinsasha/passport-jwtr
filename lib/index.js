var ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtr = require('jwt-redis');
var Strategy = require('./strategy');


module.exports = {
    Strategy: Strategy,
    ExtractJwt: ExtractJwt,
    JsonWebTokenError: jwtr.JsonWebTokenError,
    NotBeforeError: jwtr.NotBeforeError,
    TokenExpiredError: jwtr.TokenExpiredError
};
