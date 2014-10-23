var fs = require('fs');
var details = JSON.parse(fs.readFileSync('infofiles/userdetails.json'));
var profile = exports.profile = {

    checkDetails: function(name, target) {
        if (!details[toId(name)]) {
            if (toId(target) == 'gender') return "Hidden";
            return "Unknown";
        } else if (!details[toId(name)][target]) {
            if (toId(target) == 'gender') return "Hidden";
            return "Unknown";
        } else {
            return details[toId(name)][target];
        }
    },

    set: function(name, target, target1) {
        if (!details[toId(name)]) details[toId(name)] = {};
        details[toId(name)][target] = target1;
        var set = JSON.stringify(details, null, 1);
        fs.writeFile('infofiles/userdetails.json', set);
        return;
    }
};
