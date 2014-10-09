var fs = require('fs');
var moneyStuff = exports.moneyStuff = {

    checkAmt: function(name, target) {
        var userdata = fs.readFileSync('config/userdata.json');
        var amt = JSON.parse(userdata);
        if (!amt[toId(name)]) return 0;
        if (amt[toId(name)][target]) {
            return amt[toId(name)][target];
        } else {
            return 0;
        }
    },

    giveAmt: function(name, target, target1) {
        var userdata = fs.readFileSync('config/userdata.json');
        var amt = JSON.parse(userdata);
        if (!amt[toId(name)]) amt[toId(name)] = {};
        if (!amt[toId(name)][target]) {
            amt[toId(name)][target] = parseInt(target1);
            var finished = JSON.stringify(amt, null, 1);
            fs.writeFile('config/userdata.json', finished);
            return;
        }
        amt[toId(name)][target] += parseInt(target1);
        var finished = JSON.stringify(amt, null, 1);
        fs.writeFile('config/userdata.json', finished);
        return;
    },

    removeAmt: function(name, target, target1) {
        var userdata = fs.readFileSync('config/userdata.json');
        var amt = JSON.parse(userdata);
        if (!amt[toId(name)]) amt[toId(name)] = {};
        if (!amt[toId(name)][target]) amt[toId(name)][target] = 0;
        amt[toId(name)][target] -= parseInt(target1);
        var finished = JSON.stringify(amt, null, 1);
        fs.writeFile('config/userdata.json', finished);
        return;
    },

    transferAmt: function(user1, user2, type, amount) {
        var userdata = fs.readFileSync('config/userdata.json');
        var amt = JSON.parse(userdata);
        if (!amt[toId(user2)]) amt[toId(user2)] = {};
        if (!amt[toId(user2)][type]) amt[toId(user2)] = 0;
        amt[toId(user1)][type] -= parseInt(amount);
        amt[toId(user2)][type] += parseInt(amount);
        var finished = JSON.stringify(amt, null, 1);
        fs.writeFile('config/userdata.json', finished);
        return;
    }
};
