// require libreries 
var authenticated = require('../config/middleware/authenticated');
var passport = require('../config/passport');
var sequalize = require('sequelize');

// set up local variables and modules
var Op = sequalize.Op;
var express = require("express");
var router = express.Router();
var db = require('../models');

// home : presents every product in our inventory
router.get('/', async function (req, res) {
    var data = await db.Product.findAll({})
    console.log("this:"+data[0].productUrl)
    res.render('index', {
        results: data
    })
});

// login for registered user : after authentication user is redirected to profile route
router.post("/login", passport.authenticate("local"), function (req, res) {
        res.json("/profile");
})

// login for new user
router.post('/login/newclient', passport.authenticate("local"), function (req, res) {
    res.redirect('/preferences');
}
);


// profile : presents the items which is prefered by user
router.get('/profile', authenticated, async function (req, res) {
    // find user preferences
    var Pref = await db.Preference.findAll({
        where: {
            UserId: req.user.id
        }
    });
    var Pcolor = Pref[0].color.toUpperCase()
    // this logic will query the product table looking for items with same gender , within price range, and have one of the preferences
    var result = await db.Product.findAll({
        where: {
            [Op.and]: [{
                price: {
                    [Op.gt]: Pref[0].minPrice,
                    [Op.lt]: Pref[0].maxPrice
                }
            },
            {
                gender: {
                    [Op.like]: `%${Pref[0].gender}%`
                }
            },
            {
                size: {
                    [Op.like]: `%${Pref[0].size}%`

                }
            },
            {
                height: {
                    [Op.like]: `%${Pref[0].height}%`
                }
            },
            {
                [Op.or]: [
                {
                    color:{
                        [Op.like]: `%${Pcolor}%`
                    } 
                },
                {
                    occasion: {
                        [Op.like]: `%${Pref[0].occasion}%`
                    }
                }
                ]
            }
            ]
        }
    })

    // show resultes
    if (result.length > 0) {
        res.render('index', {
            results: result,
            user: req.user
        })
    } else {
        var Not = {
            Found: 1,
            error: "Unfortunately We have no product that matches your prefereces feel free to change the prefereces on your setting page"
        }
        res.render('index', {
            Not: Not,
            user: req.user
        })
    }
})

// about: information about the company
router.get('/about', function (req, res) {
    res.render('about');
});


// register 
router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', async function (req, res) {
    try {
        // create the user in user table
        await db.User.create({
            email: req.body.email,
            password: req.body.password,
            userType: "client"
        });
        // send them to be authenticated
        res.redirect(307, "/login/newclient");
    } catch (e) {
        res.status(400).send(e);
    }
});

// preferences:
router.post('/preferences', authenticated, async function (req, res) {
    var prevPref = await db.Preference.findAll({
        where: {
            UserId: req.user.id
        }
    });
    // update user initial preferences
    if (prevPref.length > 0) {
        db.Preference.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            size: req.body.size,
            height: req.body.height,
            color: req.body.color,
            minPrice: req.body.minprice,
            maxPrice: req.body.maxprice,
            occasion: req.body.occasion,
            gender: req.body.gender,
            UserId: req.user.id
        }, {
                where: {
                    UserId: req.user.id
                }
            }).then((respo) => {
                res.redirect('/profile');
            })
    } 
    // set up user preferences
    else {
        db.Preference.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            size: req.body.size,
            height: req.body.height,
            color: req.body.color,
            minPrice: req.body.minprice,
            maxPrice: req.body.maxprice,
            occasion: req.body.occasion,
            gender: req.body.gender,
            UserId: req.user.id
        }).then((respo) => {
            res.redirect('/profile');
        })
    }
});

router.get('/preferences', authenticated, (req, res) => {
    res.render('preferences', {
        user: req.user, newclient: true
    });
});

// setting : user will be authenticated and then sent to preference rout
router.get('/setting', authenticated, async (req, res) => {
    var initPref = await db.Preference.findOne({
        where: {
            UserId: req.user.id
        }
    })
    res.render('preferences', { initPref: initPref,  user: req.user })
})

// logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect("/")
});


module.exports = router;