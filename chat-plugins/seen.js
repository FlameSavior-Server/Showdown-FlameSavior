/* Seen command
 * by jd and panpawn
 */

var fs = require('fs');
var moment = require('moment');

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

exports.commands = {
	seen: function (target, room, user) {
		try {
			switch (target) {
				case 'obj':
					if (!this.canBroadcast()) return;
					this.sendReplyBox("There have been " + Object.size(seenData) + " user names recorded in this database.");
					break;
				default:
					if (!this.canBroadcast()) return;
					var userid = toId(target);
					if (userid.length < 1) return this.sendReply("/seen - Please specify a name.");
					if (Users(target) && Users(target).connected) return this.sendReplyBox(Tools.escapeHTML(target) + " is currently <font color=\"green\">online</green>.");
					if (!seenData[userid]) return this.sendReplyBox(Tools.escapeHTML(target) + " has <font color=\"red\">never</font> been seen online.");
					var date = new Date(seenData[userid]);
					var text = moment(seenData[userid]).format("MMMM Do YYYY, h:mm:ss a")
					this.sendReplyBox("The user " + Tools.escapeHTML(target) + " was last seen online " + text + " EST.");
			}
		} catch (e) {
			return this.sendReply("Something failed: \n" + e.stack);
		}
	}
};
