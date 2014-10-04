var fs = require('fs');
var profile = exports.profile = {
 
    checkDetails: function(name, target) {
    var userdetails = fs.readFileSync('config/userdetails.json');
    var a = JSON.parse(userdetails);
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
    var userdetails = fs.readFileSync('config/userdetails.json');
    var a = JSON.parse(userdetails);
    if (!a[toId(name)]) a[toId(name)] = {};
    a[toId(name)][target] = target1;
    var set = JSON.stringify(a, null, 1);
    fs.writeFile('config/userdetails.json', set);
    return;
}
	};
