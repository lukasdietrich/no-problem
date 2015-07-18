var octonode = require("octonode");
var _        = require("lodash/collection");

function Data (database) {
    this.database = database;
    this.client = false;

    this.cache = {};
}

Data.prototype.open = function (callback) {
    if (this.client) {
        callback(null, this.client);
    } else {
        this.database.get("select token from `users` where role = 0 ;", function (err, row) {
            if (err) {
                callback(err);
            } else {
                callback(null, this.client = octonode.client(row.token));
            }
        }.bind(this));
    }
}

Data.prototype.isExpired = function (key, duration) {
    var now = Math.floor(Date.now() / 1000);

    if ((this.cache[key] || 0) < now - duration) {
        this.cache[key] = now;
        return true;
    }

    return false;
}

Data.prototype.setMirrorState = function (id, active, callback) {
    this.database.run("update `mirrors` set active = ? where id = ? ;", [active ? 1 : 0, id], callback);
}

Data.prototype.listMirrors = function (callback) {
    var that = this;

    var selectMirrors = function () {
        that.database.all("select * from `mirrors` order by active desc ;", function (err, rows) {
            callback(err, rows);
        });
    }

    if (this.isExpired("mirrors", 600)) {
        this.open(function (err, gh) {
            gh.me().repos(function (err, repos) {
                repos = _.filter(repos, { private: true });
                repos = _.map(repos, function (repo) {
                    return [repo.id, repo.full_name]
                });

                for (var i = 0; i < repos.length; i++) {
                    that.database.run("insert or ignore into `mirrors` values (?, ?, 0) ;", repos[i]);
                }

                selectMirrors();
            });
        });
    } else {
        selectMirrors();
    }
}

module.exports = Data;