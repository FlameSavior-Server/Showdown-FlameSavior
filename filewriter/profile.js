var fs = require('fs');
var userdetails = fs.readFileSync('infofiles/userdetails.json');
var a = JSON.parse(userdetails);
var profile = exports.profile = {

    checkDetails: function(name, target) {
        if (!a[toId(name)]) {
            if (toId(target) == 'gender') {
                return "Hidden";
            } else if (toId(target) == 'fc') {
                return "Unregistered";
            } else if (toId(target) == 'quote') {
                return "Get ready!";
            } else {
                return "Unknown";
            }
        } else if (!a[toId(name)][target]) {
            if (toId(target) == 'gender') {
                return "Hidden";
            } else if (toId(target) == 'fc') {
                return "Unregistered";
            } else if (toId(target) == 'quote') {
                return "Get ready!";
            } else {
                return "Unknown";
            }
        } else {
            return a[toId(name)][target];
        }
    },

    set: function(name, target, target1) {
        if (!a[toId(name)]) a[toId(name)] = {};
        a[toId(name)][target] = target1;
        var set = JSON.stringify(a, null, 1);
        fs.writeFile('infofiles/userdetails.json', set);
        return;
    }
};
