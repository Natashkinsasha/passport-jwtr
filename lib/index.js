var ExtractJwt = require('passport-jwt').ExtractJwt;
var Strategy = require('./strategy');


module.exports = {
    Strategy: Strategy,
    ExtractJwt : ExtractJwt
};