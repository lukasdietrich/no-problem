var express = require("express");

function init (options, database) {
    var router = express.Router();

    router.use(function (req, res, next) {
        if (!req.session.passport || !req.session.passport.user) {
            res.redirect("/auth/admin");
        } else {
            next();
        }
    });

    return router;
}

module.exports.init = init;