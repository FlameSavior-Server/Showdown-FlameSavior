var fs = require('fs');

function splint(target) {
    //splittyDiddles
    var cmdArr =  target.split(",");
    for (var i = 0; i < cmdArr.length; i++) cmdArr[i] = cmdArr[i].trim();
        return cmdArr;
}

function readMoney(user) {
    try {
        var data = fs.readFileSync('config/money.csv', 'utf8');
    } catch (e) {
        return 0;
    }
    var rows = data.split("\n");
    var matched = false;
    for (var i = 0; i < rows.length; i++) {
        if (!rows[i]) continue;
        var parts = rows[i].split(",");
        var userid = toId(parts[0]);
        if (user === userid) {
            var matched = true;
            var amount = Number(parts[1]);
            break;
        }
    }
    if (matched === true) {
        return amount;
    } else {
        return 0;
    }
}
exports.readMoney = readMoney;

function writeMoney (filename, user, amount, callback) {
    if (!filename || !user ||  !amount) return false;
    fs.readFile('config/'+filename+'.csv', 'utf8', function (err, data) {
        if (err) return false;
        if (!data || data == '') return console.log('DEBUG: ('+Date()+') '+filename+'.csv appears to be empty...');
        var row = data.split('\n');
        var matched = false;
        var line = '';
        var userMoney = 0;
        for (var i = 0; i < row.length; i++) {
            if (!row[i]) continue;
            var parts = row[i].split(',');
            var userid = toId(parts[0]);
            if (toId(user) == userid) {
                matched = true;
                userMoney = Number(parts[1]);
                line = row[i];
                break;
            }
        }
        userMoney += amount;
        if (matched == true) {
            var re = new RegExp(line, "g");
            var result = data.replace(re, toId(user)+','+userMoney);
            fs.writeFile('config/'+filename+'.csv', result, 'utf8', function (err) {
                if (err) return false;
                if (callback) callback(true);
                return;
            });
        } else {
            fs.appendFile('config/'+filename+'.csv', '\n'+toId(user)+','+userMoney);
            if (callback) callback(true);
            return;
        }
    });
}
exports.writeMoney = writeMoney;


var cmds = {


   survey: 'poll',
    poll: function(target, room, user) {
        if (!user.can('broadcast',null,room)) return this.sendReply('You do not have enough authority to use this command.');
        if (!this.canTalk()) return this.sendReply('You currently can not speak in this room.');
        if (room.question) return this.sendReply('There is currently a poll going on already.');
        if (!target) return false;
        if (target.length > 500) return this.sendReply('Polls can not be this long.');
        var separacion = "&nbsp;&nbsp;";
        var answers = splint(target);
        var formats = [];
        for (var u in Tools.data.Formats) {
            if (Tools.data.Formats[u].name && Tools.data.Formats[u].challengeShow && Tools.data.Formats[u].mod != 'gen4' && Tools.data.Formats[u].mod != 'gen3' && Tools.data.Formats[u].mod != 'gen3' && Tools.data.Formats[u].mod != 'gen2' && Tools.data.Formats[u].mod != 'gen1') formats.push(Tools.data.Formats[u].name);
        }
        formats = 'Tournament,'+formats.join(',');
        if (answers[0] == 'tournament' ||  answers[0] == 'tour') answers = splint(formats);
        if (answers.length < 3) return this.sendReply('Correct syntax for this command is /poll question, option, option...');
        var question = answers[0];
        question = Tools.escapeHTML(question);
        answers.splice(0, 1);
        var answers = answers.join(',').toLowerCase().split(',');
        room.question = question;
        room.answerList = answers;
        room.usergroup = Config.groupsranking.indexOf(user.group);
        var output = '';
        for (var u in room.answerList) {
            if (!room.answerList[u] || room.answerList[u].length < 1) continue;
            output += '<button name="send" value="/vote '+room.answerList[u]+'">'+Tools.escapeHTML(room.answerList[u])+'</button>&nbsp;';
        }
        room.addRaw('<div class="infobox"><h2>' + room.question + separacion + '<font size=2 color = "#939393"><small>/vote OPTION<br /><i><font size=1>Poll started by '+user.name+'</font size></i></small></font></h2><hr />' + separacion + separacion + output + '</div>');
    },

    vote: function(target, room, user) {
        var ips = JSON.stringify(user.ips);
        if (!room.question) return this.sendReply('There is no poll currently going on in this room.');
        if (!target) return this.parse('/help vote');
        if (room.answerList.indexOf(target.toLowerCase()) == -1) return this.sendReply('\'' + target + '\' is not an option for the current poll.');
        if (!room.answers) room.answers = new Object();
        room.answers[ips] = target.toLowerCase();
        return this.sendReply('You are now voting for ' + target + '.');
    },

    votes: function(target, room, user) {
        if (!room.answers) room.answers = new Object();
        if (!room.question) return this.sendReply('There is no poll currently going on in this room.');
        if (!this.canBroadcast()) return;
        this.sendReply('NUMBER OF VOTES: ' + Object.keys(room.answers).length);
    },

    endsurvey: 'endpoll',
    ep: 'endpoll',
    endpoll: function(target, room, user) {
        if (!user.can('broadcast',null,room)) return this.sendReply('You do not have enough authority to use this command.');
        if (!this.canTalk()) return this.sendReply('You currently can not speak in this room.');
        if (!room.question) return this.sendReply('There is no poll to end in this room.');
        if (!room.answers) room.answers = new Object();
        var votes = Object.keys(room.answers).length;
        if (votes == 0) {
            room.question = undefined;
            room.answerList = new Array();
            room.answers = new Object();
            return room.addRaw("<h3>The poll was canceled because of lack of voters.</h3>");
        }
        var options = new Object();
        var obj = Rooms.get(room);
        for (var i in obj.answerList) options[obj.answerList[i]] = 0;
        for (var i in obj.answers) options[obj.answers[i]]++;
        var sortable = new Array();
        for (var i in options) sortable.push([i, options[i]]);
        sortable.sort(function(a, b) {return a[1] - b[1]});
        var html = "";
        for (var i = sortable.length - 1; i > -1; i--) {
            var option = sortable[i][0];
            var value = sortable[i][1];
            if (value > 0) html += "&bull; " + Tools.escapeHTML(option) + " - " + Math.floor(value / votes * 100) + "% (" + value + ")<br />";
        }
        room.addRaw('<div class="infobox"><h2>Results to "' + obj.question + '"<br /><i><font size=1 color = "#939393">Poll ended by '+user.name+'</font></i></h2><hr />' + html + '</div>');        room.question = undefined;
        room.answerList = new Array();
        room.answers = new Object();
    },

    pollremind: 'pr',
    pr: function(target, room, user) {
        var separacion = "&nbsp;&nbsp;";
        if (!room.question) return this.sendReply('There is currently no poll going on.');
        if (!this.canTalk()) return this.sendReply('You currently can not speak in this room.');
        if (!this.canBroadcast()) return;
        var output = '';
        for (var u in room.answerList) {
            if (!room.answerList[u] || room.answerList[u].length < 1) continue;
            output += '<button name="send" value="/vote '+room.answerList[u]+'">'+Tools.escapeHTML(room.answerList[u])+'</button>&nbsp;';
        }
        this.sendReply('|raw|<div class="infobox"><h2>' + room.question + separacion + '<font font size=1 color = "#939393"><small>/vote OPTION</small></font></h2><hr />' + separacion + separacion + output + '</div>');
    },

    disqualify: 'dq',
    dq: function(target, room, user, connection, cmd) {
        if (!target) return this.sendReply('Usage: /'+cmd+' [user]');
        this.parse('/tour disqualify '+target);
    },

    remind: function(target, room, user) {
        this.parse('/tour remind');
    },

    endtour: function(target, room, user) {
        this.parse('/tour delete');
    },

    jt: 'j',
    jointour: 'j',
    j: function(target, room, user) {
        this.parse('/tour join');
    },

    lt: 'l',
    leavetour: 'l',
    l: function(target, room, user) {
        this.parse('/tour leave');
    },
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];
