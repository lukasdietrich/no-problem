var fs       = require("fs");

var octonode = require("octonode");
var express  = require("express");
var sqlite   = require("sqlite3");

var db = new sqlite.Database("data.sqlite");
var web = express();

fs.readFile("assets/sql/create.sql", { encoding: "ascii" }, function (err, data) {
    if (err)
        throw err;

    db.exec(data);
})

web.use(express.static("assets/static"));
web.listen(8080);