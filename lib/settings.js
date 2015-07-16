var readline = require("readline");

function Settings (database) {
    this.database = database;
}

Settings.prototype.get = function (key, getter, callback) {
    var database = this.database;

    database.get("select value from `settings` where key = ? ;", [key], function (err, row) {
        if (err)
            throw err;

        if (row)
            callback(row.value);
        else {
            var prompt = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            getter(prompt, function (value) {
                database.run("insert into `settings` values (?, ?) ;", [key, value], function (err) {
                    if (err)
                        throw err;
                })

                callback(value);
                prompt.close();
            })
        }
    })
}

Settings.prototype.batchGet = function (keys, getters, callback) {
    if (keys.length < 1 || getters.length < 1) {
        callback([]);
        return
    }

    var that = this;

    that.get(keys.shift(), getters.shift(), function (value) {
        that.batchGet(keys, getters, function (rest) {
            rest.unshift(value);
            callback(rest);
        })
    })
}

module.exports = Settings;