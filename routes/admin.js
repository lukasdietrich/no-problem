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

    router.get("/ajax/set/mirror", function (req, res) {
        data.setMirrorState(req.query.id, req.query.active === "true", function (err) {
            res.json({ err: err || false });
        });
    });

    router.get("/", function (req, res) {
        data.listMirrors(function (err, mirrors) {
            res.render("admin/mirrors", {
                realm: "admin",
                mirrors: mirrors,
                scripts: [
                    "/js/admin.js"
                ]
            });
        });
    });

    return router;
}

module.exports.init = init;