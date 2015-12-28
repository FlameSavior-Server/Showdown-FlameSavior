/* Friends List system
 * This is a simple friends list system for Pokemon Showdown.
 * It will alert you when your friends come online.  It also 
 * will show you the last time they were online on the server.
 * by: panpawn
 */

var fs = require('fs');
var moment = require('moment');

var Friends = {};
var friendsFilepath = 'config/friends.json';

var NotifySetting = {};
var settingsFilepath = 'config/friendssettings.json';

function getName(user) {
	return (Users.getExact(user) && Users(user).connected ? Users.getExact(user).name : user)
}

function loadFriendsList() {
	try {
		Friends = JSON.parse(fs.readFileSync(friendsFilepath));
	} catch (e) {
		Rooms('staff').add("FRIENDS LIST failed to be loaded.").update();
		//Friends = {};
	}
	try {
		NotifySetting = JSON.parse(fs.readFileSync(settingsFilepath));
	} catch (e) {
		Rooms('staff').add("FRIENDS SETTINGS failed to be loaded.").update();
		//NotifySetting = {};
	}
}
loadFriendsList();

function updateFriends() {
	fs.writeFile(friendsFilepath, JSON.stringify(Friends));
}
Gold.updateFrens = updateFriends;

function updateSettings() {
	fs.writeFile(settingsFilepath, JSON.stringify(NotifySetting));
}

function getFriendsNumber(user) {
	var list = Object.keys(Friends);
	var number = 0;
	list.forEach(function(kek) {
		Friends[kek].forEach(function(kek2) {
			if (kek2 === user) number++;
		});
	});
	return number;
}

function getAdded(user) {
	var list = Object.keys(Friends);
	var output = [];
	var label = (getFriendsNumber(user) > 1 ? 'users have' : 'user has');
	var reply = "The following " + label + " added <b><font color=" + Gold.hashColor(user) + ">" + getName(user) + "</font></b> as a friend:<br />";
	list.forEach(function(kek) {
		Friends[kek].forEach(function(kek2) {
			if (user === kek2) {
				kek = " <button name=\"send\" value=\"/friendslist " + kek + "\"><font color=" + Gold.hashColor(kek) + ">" + getName(kek) + "</font></button>";
				output.push(kek);
			}
		});
	});
	reply = reply += output;
	return reply;
}

function friendsNotify(user) {
	var list = Object.keys(Friends);
	list.forEach(function(kek) {
		Friends[kek].forEach(function(kek2) {
			if (~kek2.indexOf(user)) {
				if (Users(kek) && Users(kek).connected && Users.getExact(kek)) {
					if (NotifySetting[kek]) {
						return Users(kek).send('|pm|~Friendslist Notifications|' + Users(kek).getIdentity() + '|/html <b><font color="' + Gold.hashColor(user) + '">' + getName(user) + '</font> has come <font color=green>online</font>!');
					}
				}
			}
		});
	});
}
Gold.friendsNotify = friendsNotify;

function formatList(user, by) {
	if (!Friends[user]) Friends[user] = [];
	var reply = "<div class=\"infobox-limited\" target=\"_blank\"><b><u>Friendslist of </u><font color=" + Gold.hashColor(user) + "><u>" + getName(user) + "</u></font> (" + Friends[user].length + "):</b><br />";
		reply += (NotifySetting[user] ? "(<i>does</i> get notified when friends come online)" : "(<i>does NOT</i> get notified when friends come online)");
		reply += '<table border="1" cellspacing ="0" cellpadding="3">';
		reply += "<tr><td><u>Friend:</u></td><td><u>Last Online:</u></td><td><u>Bucks:</u></td></tr>";
	Friends[user].forEach(function(frens) {
		function lastSeen(frens) {
			if (Users(frens) && Users.getExact(frens) && Users(frens).connected) return "<font color=green>Currently Online</font>";
			if (!Gold.seenData[frens]) return "<font color=red>Never seen on this server</font>";
			var userLastSeen = moment(Gold.seenData[frens]).format("MMMM Do YYYY, h:mm:ss a");
			return userLastSeen;
		}
		reply += "<tr><td><b><font color=" + Gold.hashColor(frens) + ">" + getName(frens) + "</font></b></td><td>" + lastSeen(frens) + "</td><td>" + (economy.readMoney(frens) == 0 ? "None" : economy.readMoney(frens)) + "</td></tr>";
	});
	reply += "</table>";
	var number = getFriendsNumber(user);
	var label = (number > 1 ? ' users have' : ' user has');
	reply += (number > 0 ? "<button name=\"send\" value=\"/friendslist getadded, " + user + "\">" + number + label + " added <font color=" + Gold.hashColor(user) + ">" + getName(user) + "</font> as a friend." :  "");
	reply += "</div>";
	return reply;
}

exports.commands = {
	frens: 'friendslist',
	friends: 'friendslist',
	friend: 'friendslist',
	friendlist: 'friendslist',
	friendslist: function (target, room, user) {
		target = target.split(',');
		for (var u in target) target[u] = target[u].trim();

		if (!Friends[user.userid]) {
			Friends[user.userid] = [];
			updateFriends();
		}
		if (!NotifySetting[user.userid]) {
			NotifySetting[user.userid] = false;
			updateSettings();
		}

		switch (target[0]) {
			case 'add':
				var newFriend = toId(target[1]);
				if (!newFriend) return this.errorReply("Usage: /friendslist add, [user] - Adds a user to your friendslist.");
				if (user.userid === newFriend) return this.errorReply("You cannot add yourself to your friendslist...");
				if (newFriend.length > 18) return this.errorReply("Usernames are not this long...");
				if (~Friends[user.userid].indexOf(newFriend)) return this.errorReply("You are already friends with this person!");
				if (Friends[user.userid].length > 100) return this.errorReply("You cannot have over 100 friends added to your friendslist, unfortunately.");
				Friends[user.userid].push(newFriend);
				updateFriends();
				return this.sendReply("|raw|You have added <b><font color=" + Gold.hashColor(newFriend) + ">" + Tools.escapeHTML(getName(target[1])) + "</font></b> to your friends list.");
				break;

			case 'delete':
			case 'remove':
				var removee = toId(target[1]);
				if (!removee) return this.errorReply("Usage: /friendslist remove, [user] - Removes a user from your friendslist.");
				if (!~Friends[user.userid].indexOf(removee)) return this.errorReply("You are not currently friends with this user.  Check spelling?");
				Friends[user.userid].remove(removee);
				updateFriends();
				return this.sendReply("|raw|You have <font color=red>unfriended</font> <font color=" + Gold.hashColor(removee) + "><b>" + Tools.escapeHTML(getName(removee)) + "</b></font> from your friends list.");
				break;

			case 'deleteall':
			case 'removeall':
				if (!Friends[user.userid] || Friends[user.userid].lenth < 1) return this.errorReply("You do not have any friends added to your friendslist yet.");
				Friends[user.userid] = [];
				updateFriends();
				return this.sendReply("You have cleared your friendslist.");
				break;

			case 'toggle':
			case 'notify':
				var notify = NotifySetting[user.userid] = !NotifySetting[user.userid];
				updateSettings();
				return this.sendReply("You are now " + (notify ? ' being notified ' : ' not being notified ') + "of friends joining the server.");
				break;

			case 'help':
				this.parse('/help friendslist');
				break;

			// command used with GUI
			case 'getadded':
				if (!target[1]) return false;
				return this.sendReplyBox(getAdded(target[1]));
				break;

			default:
				if (!this.canBroadcast()) return;
				if (!target[0]) {
					if (!Friends[user.userid] || Friends[user.userid].length < 1) {
						this.parse('/help friendslist');
						return this.errorReply("You do not have any friends added to your friendslist yet.");
					}
					return this.sendReplyBox(formatList(user.userid, user.userid));
				} else {
					target[0] = toId(target[0]);
					if (!Friends[target[0]] || Friends[target[0]].length < 1) {
						return this.errorReply("This user does not have any friends added to their friendslist yet.");
					}
					return this.sendReplyBox(formatList(target[0], user.userid));
				}
		}
	},
	friendslisthelp: ["Gold's friendslist allows users to add friends to their friendslists. The commands include...",
					"/friendslist add, [user] - Adds a user to your friendslist.",
					"/friendslist remove, [user] - Removes a user from your friendslist.",
					"/friendslist removeall - Clears your friendslist.",
					"/friendslist - Displays your friendslist.",
					"/friendslist [user] - Displays [user]'s friendslist.",
					"/friendslist notify - Toggles being notified or not when a friend comes online (disabled by default)."],
};

Gold.friends = Friends;
Gold.friendsSettings = NotifySetting;
