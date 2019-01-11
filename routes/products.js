var authenticated = require('../config/middleware/authenticated');
var passport = require('../config/passport');
var sequalize = require('sequelize');

var Op = sequalize.Op;
var express = require("express");
var router = express.Router();
var db = require('../models');

router.get('/', async function (req, res, next) {
    var data = await db.Product.findAll({});
    res.render('management', {results: data})

})

router.get('/getitem/:id', async function (req, res, next) {
    console.log(req.params.id);
    var data = await db.Product.findAll({
        where: {
            id: req.params.id
        }
    });
    res.send(data);

})
router.put('/update/:id', (req, res, next) => {

    console.log(req.body);
    console.log(req.params.id);
    db.Product.update({
        Ptype: req.body.Ptype,
        size: req.body.size,
        color: req.body.color,
        imgUrl: req.body.imgUrl,
        productUrl: req.body.productUrl,
        price: req.body.price,
        occasion: req.body.occasion,
        gender: req.body.gender,
        brand: req.body.brand,
    },
     {where: {id: req.params.id}}
    )

    res.send(200);
});
router.delete('/delete/:id', async function (req, res, next) {
  
    var result = await db.Product.destroy({
        where: {
            id: req.params.id
        }
    })

    res.send(200);
});
router.post('/add', (req, res, next) => {

    console.log(req.body);
    res.send(200);

});


module.exports = router;