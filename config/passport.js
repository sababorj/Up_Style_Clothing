var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var db = require('../models');

passport.use(
    new LocalStrategy({
            usernameField: "email"
        },
        function (email, password, done) {
            db.User.findOne({
                Where: {
                    email: email
                }
            }).then(function (dbUser) {
                if (!dbUser) {
                    return done(null, false, {
                        message: "This Email is not registered with us!"
                    });
                } else if (!dbUser.validPassword(password)) {
                    return done(null, false, {
                        message: "Worng Password! try again."
                    });
                }
                return done(null, dbUser)
            });
        }
    )
);

passport.serializeUser(function (user, callback) {
    callback(null, user);
});

passport.deserializeUser(function (obj, callback) {
    callback(null, obj);
});

module.exports = passport;