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
		var mag_name = "Cold Front";
		var allowed_set_usernames = ['flicette','panpawn']; //users who are allowed to change the newest issue link
		var mag1 = toId(target.slice(0, target.indexOf(', ')));
		var mag2 = target.slice(target.indexOf(', ') + 1).trim();
		var link_to_newest_issue = Rooms.rooms.lobby.chatRoomData.frostMagLink;
		if (mag1 === 'set') {
			if (allowed_set_usernames.indexOf(toId(user.name)) === -1 || !user.group === '~') return false;
			if (mag2 === link_to_newest_issue) return this.sendReply("That link is already set...");
			Rooms.rooms.lobby.chatRoomData.frostMagLink = mag2;
			Rooms.global.writeChatRoomData();
			this.sendReply("The link to the newest issue has been set to: " + mag2);
			this.logModCommand(user.name + " has set the link of the newest issue of the " + mag_name + " to be: " + mag2);
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
