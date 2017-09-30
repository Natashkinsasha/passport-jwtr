# passport-jwtr

A [Passport](http://passportjs.org/) strategy for authenticating with a [JSON Web Token](https://jwt.io/).

This module lets you authenticate endpoints using a JSON web token. It is intended to be used to secure RESTful endpoints without sessions.


# Installation

Npm
```javascript
npm install passport-jwtr
```

Yarn
```javascript
yarn add passport-jwtr
```

# Support

This library is quite fresh, and maybe has bugs. Write me an **email** to *natashkinsash@gmail.com* and I will fix the bug in a few working days.

# Quick start

```javascript

var JwtrStrategy = require('passport-jwtr').Strategy,
    ExtractJwt = require('passport-jwtr').ExtractJwt;
var Redis = require('ioredis');
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = 'secret';
opts.redis = new Redis();
passport.use(new JwtrStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false, 'User not found');
        }
    });
}));

```

