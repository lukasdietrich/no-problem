var express  = require("express");
var passport = require("passport");
var strategy = require("passport-github2");

function init (options, database) {
    var router = express.Router()

    options.callbackURL = options.url + "/auth/github/callback";

    passport.use(new strategy(options, function (accessToken, refreshToken, profile, done) {
        profile = {
            id: profile.id,
            displayName: profile.displayName,
            username: profile.username,
            token: accessToken
        };

        database.run("insert or ignore into `users` values (?, MAX(0, (select count(*) from `users`)), ?, ?, ?) ;",
                    [profile.id, profile.token, profile.username, profile.displayName]);

        done(null, profile);
    }));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    router.use(passport.initialize());
    router.use(passport.session());

    router.get("/", passport.authenticate("github", { scope: ["user:email"] }));
    router.get("/admin", passport.authenticate("github", { scope: ["user:email", "repo"] }));

    router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/auth", successRedirect : "/" }));

    return router;
}

module.exports.init = init;