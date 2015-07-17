var fs         = require("fs");

var octonode   = require("octonode");
var express    = require("express");
var session    = require("express-session");
var filestore  = require("session-file-store")(session);
var sqlite     = require("sqlite3");
var yargs      = require("yargs");

var settings     = require("./lib/settings");
var authenticate = require("./routes/authenticate");
var admin        = require("./routes/admin");

var args = yargs
    .usage("Usage: $0 [options]")
    .alias("p", "port")
        .describe("p", "Set http server port")
        .demand("p")
    .alias("d", "database")
        .describe("d", "Specify custom database path")
        .default("d", "data.sqlite")
    .argv;

var db = new sqlite.Database(args.d);
var conf = new settings(db);

fs.readFile("assets/sql/create.sql", { encoding: "ascii" }, function (err, data) {
    if (err)
        throw err;

    db.exec(data, configure);
});

function configure () {
    conf.batchGet(["app_id", "app_secret", "app_url"], [
        function (prompt, done) {
            prompt.question("GitHub Application client id: ", done);
        },

        function (prompt, done) {
            prompt.question("GitHub Application client secret: ", done);
        },

        function (prompt, done) {
            prompt.question("Public host url (%YOUR-URL%/auth/github/callback): ", done);
        }
    ], function (values) {
        var web = express();

        web.set("views", "assets/views");
        web.set("view engine", "jade");

        web.use(session({
            secret: Math.random().toString(32).substring(2),
            store: new filestore(),
            resave: true,
            saveUninitialized: false
        }));

        web.use("/auth", authenticate.init({
            clientID: values[0],
            clientSecret: values[1],
            url: values[2]
        }, db));

        web.use("/admin", admin.init(db));

        web.use(express.static("assets/static"));
        web.listen(args.p);
    })
}
