var authenticated = require('../config/middleware/authenticated');
var passport = require('../config/passport');
var sequalize = require('sequelize');

var Op = sequalize.Op;
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

// profile
router.get('/profile', authenticated, async function (req, res) {
    var Pref = await db.Preference.findAll({
        where: {
            UserId: req.user.id
        }
    });

    Pref[0].gender === 'male' ? Pref[0].gender = 'm' : Pref[0].gender = 'f';
    // this logic will query the product table looking for items with same gender , within price range, and have one of the preferences
    var result = await db.Product.findAll({
        where: {
            [Op.and]: [
                {
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
                }]
        }
    })
    if(result.length > 0){
        res.render('index', { results: result })
    }
})
// about
router.get('/about', function (req, res) {
    res.render('about');
});

// login 
router.post('/login', passport.authenticate("local"), function (req, res) {
    res.redirect('/preferences');
});

// register 
router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', async function (req, res) {
    var user = req.body.email;
    var password = req.body.password;

    try {
        await db.User.create({
            email: user,
            password: password
        });
        res.redirect(307, "/login");
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
        res.redirect('/profile')
    })
});

router.get('/preferences', authenticated, function (req, res) {
    console.log(req.user);
    res.render('preferences');
});




// profile 


module.exports = router;