var fs       = require("fs");

var octonode = require("octonode");
var express  = require("express");
var sqlite   = require("sqlite3");
var yargs    = require("yargs");

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
var web = express();

fs.readFile("assets/sql/create.sql", { encoding: "ascii" }, function (err, data) {
    if (err)
        throw err;

    db.exec(data);
})

web.use(express.static("assets/static"));
web.listen(args.p);