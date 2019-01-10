var authenticated = require('../config/middleware/authenticated');
var passport = require('../config/passport');
var sequalize = require('sequelize');

var Op = sequalize.Op;
var express = require("express");
var router = express.Router();
var db = require('../models');

router.get('/', async function (req, res, next) {
    var data = await db.Product.findAll({});
    res.render('management', {
        results: data
    });

})
router.put('/update/:id', (req, res, next) => {
    console.log(req.body.id);
    res.send("update ok with id = " + req.body.id);
});
router.delete('/delete/:id', async function (req, res, next) {
    var result = await db.Product.destroy({
        where: {
            id: req.body.id
        }
    })

    res.redirect('/products');
});
router.post('/add', (req, res, next) => {

    console.log(req.body);
    res.send(200);

});


module.exports = router;