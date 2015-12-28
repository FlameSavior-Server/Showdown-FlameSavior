/* Friends List system
 * This is a simple friends list system for Pokemon Showdown.
 * It will alert you when your friends come online.  It also 
 * will show you the last time they were online on the server.
 * by: panpawn
 */

var fs = require('fs');
var moment = require('moment');
var Friends = {};
var filepath = 'config/friends.json';

function loadFriendsList() {
	try {
		Friends = JSON.parse(fs.readFileSync(filepath));
	} catch (e) {
		Friends = {};
	}
}
loadFriendsList();

function updateFriends() {
	fs.writeFile(filepath, JSON.stringify(Friends));
}
function formatList(user, by) {
	if (!Friends[user]) Friends[user] = [];
	if (Friends[user].length < 1) {
		if (user === by) {
			return "You do not have any friends added to your friendslist.";
		} else {
			return "This user does not have any friends added to their friendslist.";
		}
	}
	var reply = "<b><u>Friends:</u></b><br />";
		reply += '<table border="1" cellspacing ="0" cellpadding="3">';
		reply += "<tr><td><u>Friend</u></td><td><u>Last Online</u></td></tr>";
	Friends[user].forEach(function(frens) {
		function lastSeen(frens) {
			if (Users(frens) && Users.getExact(frens) && Users(frens).connected) return "<font color=green>Currently Online</font>";
			if (!Gold.seenData[frens]) return "<font color=red>Never seen on this server</font>";
			var userLastSeen = moment(Gold.seenData[frens]).format("MMMM Do YYYY, h:mm:ss a");
			return userLastSeen;
		}
		reply += "<tr><td><b><font color=" + Gold.hashColor(frens) + ">" + (Users.getExact(frens) && Users(frens).connected ? Users.getExact(frens).name : frens) + "</font></b></td><td>" + lastSeen(frens) + "</td></tr>";
	});
	return reply;
}

exports.commands = {
	frens: 'friendslist',
	friends: 'friendslist',
	friend: 'friendslist',
	friendlist: 'friendslist',
	friendslist: function (target, room, user) {
		target = target.split(', ');
		if (!Friends[user.userid]) {
			Friends[user.userid] = [];
			this.parse('/help friendslist');
		}
		switch (target[0]) {
			case 'add':
				var newFriend = toId(target[1]);
				if (~Friends[user.userid].indexOf(newFriend)) return this.errorReply("You are already friends with this person!");
				Friends[user.userid].push(newFriend);
				updateFriends();
				return this.sendReply("|raw|You have added <b><font color=" + Gold.hashColor(newFriend) + ">" + newFriend + "</font></b> to your friends list.");
				break;
			case 'delete':
			case 'remove':
				var removee = toId(target[1]);
				if (!~Friends[user.userid].indexOf(removee)) return this.errorReply("You are not currently friends with this user.  Check spelling?");
				Friends[user.userid].remove(removee);
				updateFriends();
				return this.sendReply("|raw|You have <font color=red>unfriended</font> <font color=" + Gold.hashColor(removee) + ">" + removee + "</font> from your friends list.");
				break;
			default:
			case 'list':
				if (!this.canBroadcast()) return;
				if (!target[1]) {
					return this.sendReplyBox(formatList(user.userid, user.userid));
				} else {
					return this.sendReplyBox(formatList(target[1]), user.userid);
				}
				break;
		}
	},
	friendslisthelp: ["Gold's friendslist allows users to add friends to their friendslists. The commands include...",
					"/friendslist add, [user] - Adds a user to your friendslist.",
					"/friendslist remove, [user] - Removes a user from your friendslist.",
					"/friendslist - Displays your friendslist.",
					"/friendslist [user] - Displays [user]'s friendslist."],
};