// setting up  the express app
require('dotenv').config();
var express = require('express');
var session = require('express-session')
var exphbs = require("express-handlebars");
var db = require('./models');
var passport = require("./config/passport");
var routes = require('./routes/route');

// set server variables
var app = express();
var port = process.env.port || 8080;
var syncOptions = {
    force: true
};

// set up the middleware
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));

// sessions set up to keep track of login status
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());


// set up handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// routes
app.use('/', routes);


db.sequelize.sync(syncOptions).then(() => {
    app.listen(port, () => {
        console.log(`Listening to post ${port}`);
    });
});