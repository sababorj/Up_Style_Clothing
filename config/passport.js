var passport =  require('passport');
var LocatStrategy = require('passport-local').Strategy;

var db = require('../models');

passport.use(
    new localStorage(
        {
            usernameField: "email"
        },
        function(email, passsword, done) {
            db.User.findOne({
                Where:{
                    email: email
                }
            }).then( function(dbUser){
                if(!dbUser){
                    return done(null, false, {
                        message: "This Email is not registered with us!"
                    });
                }
                else if (!dbUser.validPassword(password)){
                    return done(null, false, {
                        message: "Worng Password! try again."
                    });
                }
                return done(null, dbUser)
            });
        }
    )
);

passport.serializeUser(function(user, callback) {
    callback(null, user);
});

passport.deserializeUser(function(obj, callback) {
    callback(null, obj);
});

module.exports = passport;