module.exports = function(req, res, next) {
    // when user is loged in continue
    if(req.user) {
        return next();
    }
    // when user is not loged in go to home page
    return res.redirect("/");
}