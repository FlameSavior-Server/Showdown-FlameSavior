var fs = require('fs');
var userdata = fs.readFileSync('config/userdata.json');
var amt = JSON.parse(userdata);
var moneyStuff = exports.moneyStuff = {

    checkAmt: function(name, target) {
        if (!amt[toId(name)]) return 0;
        if (amt[toId(name)][target]) {
            return amt[toId(name)][target];
        } else {
            return 0;
        }
    },

    giveAmt: function(name, target, target1) {
        if (!amt[toId(name)]) amt[toId(name)] = {};
        if (!amt[toId(name)][target]) {
            amt[toId(name)][target] = parseInt(amt[toId(name)][target]) + parseInt(target1);
            var finished = JSON.stringify(amt, null, 1);
            fs.writeFile('infofiles/userdata.json', finished);
            return;
        }
        amt[toId(name)][target] += parseInt(target1);
        var finished = JSON.stringify(amt, null, 1);
        fs.writeFile('infofiles/userdata.json', finished);
        return;
    },

    removeAmt: function(name, target, target1) {
        if (!amt[toId(name)]) amt[toId(name)] = {};
        if (!amt[toId(name)][target]) amt[toId(name)][target] = 0;
        amt[toId(name)][target] = parseInt(amt[toId(name)][target]) - parseInt(target1);
        var finished = JSON.stringify(amt, null, 1);
        fs.writeFile('infofiles/userdata.json', finished);
        return;
    }
};
