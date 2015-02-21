/**
* Frost ___ Plugin
* Informational commands
* by: panpawn
*/

exports.commands = {
	coldfront: 'frostmag',
	frostmag: function (target, room, user, connection) {
		if (room.id !== 'coldfront') return false;
		if (!this.canTalk()) return;
		var mag = target;
		var mag_name = "Cold Front";
		var allowed_set_usernames = ['flicette','panpawn'];
		var mag1 = toId(mag.slice(0, mag.indexOf(', ')));
		var mag2 = mag.slice(mag.indexOf(', ') + 1).trim();
		var link_to_newest_issue = Rooms.rooms.lobby.frostMagLink;
		if (mag1 === 'set') {
			if (allowed_set_usernames.indexOf(toId(user.name)) === -1) return false;
			link_to_newest_issue = mag2;
			this.sendReply("The link to the newest issue has been set to: " + link_to_newest_issue);
			this.logModCommand(user.name + " has set the link of the newest issue of the " + mag_name + " to be: " + link_to_newest_issue);
		} else {
			if (!this.canBroadcast()) return;
			this.sendReplyBox(
				"<center><b>" + mag_name + "</b></center><br /> " +
				"- A link to the site of the " + mag_name + " can be found <a href=\"\">here</a>.<br />" +
				"- For information on how to become a contrubutor, go <a href=\"\">here</a>.<br />" +
				"- A link to our newest issue can be found <a href=\"" + link_to_newest_issue + "\">here</a>."
			);
		}	
	}
};
