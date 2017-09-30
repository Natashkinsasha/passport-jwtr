var ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtr = require('jwt-redis');
var Strategy = require('./strategy');


module.exports = {
    Strategy: Strategy,
    ExtractJwt : ExtractJwt
};

exports.JsonWebTokenError = jwtr.JsonWebTokenError;
exports.NotBeforeError = jwtr.NotBeforeError;
exports.TokenExpiredError = jwtr.TokenExpiredError;