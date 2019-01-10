var authenticated = require('../config/middleware/authenticated');
var passport = require('../config/passport');
var sequalize = require('sequelize');

var Op = sequalize.Op;
var express = require("express");
var router = express.Router();
var db = require('../models');

// home 
router.get('/', async function (req, res) {
   var data = await db.Product.findAll({})
        console.log(data[0]);
        res.render('index', {
            results: data
    })
});


// profile
router.get('/profile', authenticated, async function (req, res) {
    // find user preferences
    var Pref = await db.Preference.findAll({
        where: {
            UserId: req.user.id
        }
    });

    Pref[0].gender === 'male' ? Pref[0].gender = 'm' : Pref[0].gender = 'f';
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
                    [Op.or]: [{
                            size: {
                                [Op.like]: `%${Pref[0].size}%`

                            }
                        },
                        {
                            color: Pref[0].color
                        },
                        {
                            height: {
                                [Op.like]: `%${Pref[0].height}%`
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
    // show result
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
// about
router.get('/about', function (req, res) {
    res.render('about');
});

// admin
router.get('/admin', function (req, res) {
    res.render('admin');
});

// login 
router.post('/login/:type', passport.authenticate("local"), function (req, res) {
    switch (req.params.type) {
        case "newclient":
            res.redirect('/preferences');
            break;
        case "client":
            res.redirect("/profile");
            break;
        case "admin":
            res.redirect("/products");
    }

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

        if (req.body.type === 'client') {
            // redirect to login wout for authentication and starting session 
            res.redirect(307, "/login/newclient");
        } else {
            res.redirect(307, "/login/admin");
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

// preferences
router.post('/preferences', authenticated, async function (req, res) {
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
});

router.get('/preferences', authenticated, function (req, res) {

    res.render('preferences', {
        user: req.user
    });
});


// logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect("/")
});


module.exports = router;