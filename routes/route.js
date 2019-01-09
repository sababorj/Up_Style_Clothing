var authenticated = require('../config/middleware/authenticated');
var passport = require('../config/passport');

var express = require("express");
var router = express.Router();
var db = require('../models');

// home 
router.get('/', function (req, res) {
    db.Product.findAll({}).then((data) => {
        console.log(data[0]);
        res.render('index', {
            results: data
        });
    })
});

// login 
router.get('/login', function (req, res) {
    res.render('login');

});

// register 
router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', async function (req, res) {
    var user = req.body.email;
    var password = req.body.password;
    var found =
    {
        emailFound: 0,
        error: "email is already in use"
    }
    // look into db for same email
    var data = await db.User.findAll({
        where: {
            email: user
        }
    })
    // if email is already in the db send error message
    if (data.length > 0) {
        found.emailFound = 1;
        console.log(found)
        res.render('register', { result: found })
        data = [];
    }
    // if email in new create an account for user
    else {
        var response = await db.User.create({
            email: user,
            password: password
        })
    }
    // send user to preferences page
    if (response) {
        res.render("preferences", {
            email: req.body.email
        })
    }
});


// router.get('/preferences', function (req, res) {
//     res.render('preferences');
// });





module.exports = router;