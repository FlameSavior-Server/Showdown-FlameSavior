/****************************
 * Offline Messaging System *
 *       by: panpawn        *
 ***************************/

var fs = require('fs');
var moment = require('moment');
var tells = {};
var maxTells = 10;

function loadTells () {
    try {
        tells = JSON.parse(fs.readFileSync('config/tells.json'));
    } catch (e) {
        tells = {};
    }
}
loadTells();

function saveTells () {
    fs.writeFile('config/tells.json', JSON.stringify(tells));
}
Gold.saveTells = saveTells;
function nameColor (name) {
    return '<b><font color="' + Gold.hashColor(name) + '">' + name + '</font></b>';
}
function htmlfix (target) {
    var fixings = ['<3', ':>', ':<'];
    for (var u in fixings) {
        while (target.indexOf(fixings[u]) != -1)
            target = target.substring(0, target.indexOf(fixings[u])) + '< ' + target.substring(target.indexOf(fixings[u]) + 1);
    }
    return target;
}
function createTell (sender, reciever, message) {
    reciever = toId(reciever);
    if (!tells[reciever]) tells[reciever] = [];
    var date = moment().format('MMMM Do YYYY, h:mm a');
    var tell = "<u>" + date + "</u><br />" + nameColor(sender) + ' said: ' + Tools.escapeHTML(htmlfix(message));
    tells[reciever].push('|raw|' + tell);
    saveTells();
}

exports.commands = {
    tell: function (target, room, user) {
        if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
        if (target.length > 500) return this.errorReply("This tell is too large, try making it shorter.");
        target = target.split(',');
        for (var u in target) target[u] = target[u].trim();
        if (target[0].length < 1 || target[0].length > 18) return this.errorReply("Usernames cannot be this length.  Check spelling?");
        if (!target[1] || target[1].length < 1) return this.errorReply("Tell messages must be at least one character.");
        if (tells[target[0]] && tells[target[0]].length >= maxTells) return this.errorReply("This user has too many tells queued, try again later.");
        createTell(user.name, target[0], target[1]); // function saves when tell is created automatically
        return this.sendReply("Your tell to " + target[0] + " has been added to their offline messaging queue.");
    },
    tellhelp: ["/tell [user], [message] - sends a user an offline message to be recieved when they next log on."],
};

Gold.tells = tells;
