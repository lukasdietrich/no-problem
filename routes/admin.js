var express = require("express");

function init (data) {
    var router = express.Router();

    router.use(function (req, res, next) {
        if (!req.session.passport || !req.session.passport.user) {
            res.redirect("/auth/admin?originalTarget=/admin");
        } else {
            next();
        }
    });

    router.get("/", function (req, res) {
        data.listMirrors(function (err, mirrors) {
            res.render("admin/mirrors", {
                realm: "admin",
                mirrors: mirrors
            });
        });
    });

    return router;
}

module.exports.init = init;