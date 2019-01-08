
// setting up  the express app
var express = require('express');
var exphbs = require("express-handlebars");
var app = express();

// set local library and variables
var db = require('./models');
var port = process.env.port || 8080;
var syncOptions = { force: true };

// set up the middleware
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(express.static("public"));

// set up handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

db.sequelize.sync(syncOptions).then( ()=> {
    app.listen( port, () => {
        console.log(`Listening to post ${port}`);
    });
});