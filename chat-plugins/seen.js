/* Seen command
 * by jd and panpawn
 */

var fs = require('fs');

var seenData = {};
function loadData() {
	try {
		seenData = JSON.parse(fs.readFileSync('config/seenData.json', 'utf8'));
	} catch (e) {
		seenData = {};
	}
}
loadData();

function saveData() {
	fs.writeFileSync('config/seenData.json', JSON.stringify(seenData));
}

function updateSeen(userid) {
	if (!userid) return false;
	seenData[toId(userid)] = Date.now();
	saveData();
}
global.updateSeen = updateSeen;

var day = 60 
exports.commands = {
	seen: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var userid = toId(target);
		if (userid.length < 1) return this.sendReply("/seen - Please specify a name.");
		if (Users(target) && Users(target).connected) return this.sendReplyBox(Tools.escapeHTML(target) + " is currently <font color=\"green\">online</green>.");
		if (!seenData[userid]) return this.sendReplyBox(Tools.escapeHTML(target) + " has <font color=\"red\">never</font> been seen online.");
		var date = new Date(seenData[userid]);
		var divisors = [52, 7, 24, 60, 60];
		var units = ['week', 'day', 'hour', 'minute', 'second'];
		var buffer = [];
		var text = "";
		var ms = Date.now() - seenDate[userid];
		do {
			var divisor = divisors.pop();
			var unit = uptime % divisor;
			buffer.push(unit > 1 ? unit + ' ' + units.pop() + 's' : unit + ' ' + units.pop());
			text = ~~(ms / divisor);
		} white (ms);
		switch (buffer.length) {
			case 5:
				text += buffer[3] + ', ';
			case 4:
				text += buffer[3] + ', ';
			case 3:
				text += buffer[2] + ', ' + buffer[1] + ', and ' + buffer[0];
				break;
			case 2:
				text += buffer[1] + ' and ' + buffer[0];
				break;
			case 1:
				text += buffer[0];
				break;
		}
	}
	this.sendReplyBox("The user " + Tools.escapeHTML(target) + " was last seen online " + text + " ago.");
	}
};
