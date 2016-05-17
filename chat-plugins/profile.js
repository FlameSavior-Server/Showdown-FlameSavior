/* Profile chat-plugin
 * by jd, modified by panpawn
 */
var serverIp = '167.114.155.242';
var http = require('http');
var formatHex = '#566'; //hex code for the formatting of the command
var geoip = require('geoip-ultralight');
var moment = require('moment');
geoip.startWatchingDataUpdate();

exports.commands = {
	profile: function(target, room, user) {
		if (!target) target = user.name;
		if (toId(target).length > 19) return this.sendReply("Usernames may not be more than 19 characters long.");
		if (toId(target).length < 1) return this.sendReply(target + " is not a valid username.");
		if (!this.runBroadcast()) return;

		var targetUser = Users.get(target);

		if (!targetUser) {
			var username = target;
			var userid = toId(target);
			var online = false;
			var avatar = (Config.customavatars[userid] ? "http://" + serverIp + ":" + Config.port + "/avatars/" + Config.customavatars[userid] : "http://play.pokemonshowdown.com/sprites/trainers/167.png");
		} else {
			var username = targetUser.name;
			var userid = targetUser.userid;
			var online = targetUser.connected;
			var avatar = (isNaN(targetUser.avatar) ? "http://" + serverIp + ":" + Config.port + "/avatars/" + targetUser.avatar : "http://play.pokemonshowdown.com/sprites/trainers/" + targetUser.avatar + ".png");
		}

    	if (Users.usergroups[userid]) {
			var userGroup = Users.usergroups[userid].substr(0,1);
			if (Config.groups[userGroup]) userGroup = Config.groups[userGroup].name;
		} else {
			var userGroup = 'Regular User';
		}

		var self = this;
		var bucks = function (user) {
			user = toId(user);
			if (!Economy.readMoneySync(user)) {
				return 0;
			} else {
				return Economy.readMoneySync(user);
			}
		};
		var regdate = "(Unregistered)";

		Gold.regdate(userid, (date) => {
			if (date) {
				regdate = moment(date).format("MMMM DD, YYYY");
			}
			showProfile();
		});

		function getFlag (flagee) {
			if (!Users(flagee)) return false;
			if (Users(flagee)) {
				var geo = geoip.lookupCountry(Users(flagee).latestIp);
				if (!geo) {
					return false;
				} else {
					return ' <img src="https://github.com/kevogod/cachechu/blob/master/flags/' + geo.toLowerCase() + '.png?raw=true" height=10 title="' + geo + '">';
				}
			}
		}
		/*
		function getStatus (user) {
			if (!Users(user)) return false;
			if (Users(user)) {
				var status = Users(users).status;
			}
			return status;
		}
		*/
		function lastActive (user) {
			if (!Users(user)) return false;
			user = Users(user);
			return (user && user.lastActive ? moment(user.lastActive).fromNow() : "hasn't talked yet");
		}
		function showProfile() {
			var seenOutput = (Gold.seenData[userid] ? moment(Gold.seenData[userid]).format("MMMM DD, YYYY h:mm A") + ' EST (' + moment(Gold.seenData[userid]).fromNow() + ')' : "Never");
			var profile = '';
			profile += '<img src="' + avatar + '" height=80 width=80 align=left>';
			if (!getFlag(toId(username))) profile += '&nbsp;<font color=' + formatHex + '><b>Name:</b></font> <strong class="username">' + Gold.nameColor(username, false) + '</strong><br />';
			if (getFlag(toId(username))) profile += '&nbsp;<font color=' + formatHex + '><b>Name:</b></font> <strong class="username">' + Gold.nameColor(username, false) + '</strong>' + getFlag(toId(username)) + '<br />';
			profile += '&nbsp;<font color=' + formatHex + '><b>Registered:</b></font> ' + regdate + '<br />';
			if (!Gold.hasBadge(userid,'vip')) profile += '&nbsp;<font color=' + formatHex + '><b>Rank:</b></font> ' + userGroup + '<br />';
			if (Gold.hasBadge(userid,'vip')) profile += '&nbsp;<font color=' + formatHex + '><b>Rank:</b></font> ' + userGroup + ' (<font color=#6390F0><b>VIP User</b></font>)<br />';
			profile += '&nbsp;<font color=' + formatHex + '><b>Bucks: </font></b>' + bucks(username) + '<br />';
			if (online && lastActive(toId(username))) profile += '&nbsp;<font color=' + formatHex + '><b>Last Active:</b></font> ' + lastActive(toId(username)) + '<br />';
			if (!online) profile += '&nbsp;<font color=' + formatHex + '><b>Last Online: </font></b>' + seenOutput + '<br />';
			profile += '<br clear="all">';
			self.sendReplyBox(profile);
			room.update();
		}
	},
	/*
	status: function(target, room, user) {
		if (!this.canTalk()) return;
		var status = Tools.escapeHTML(target);
		if (status.length > 75) return this.errorReply("Your status cannot be longer than 75 characters.");
		user.status = status;
		this.logModCommand(user.name + ' set their status to: ' + status);
	},
	clearstatus: function(target, room, user) {
		if (!this.can('pban')) return false;
		if (!Users(target)) return this.errorReply("User '" + target + "' not found.  Check spelling?");
		if (!Users(target).status) return this.errorReply("Users '" + target + "' does not have a status currently set to clear.");
		Users(target).status = false;
		this.logModCommand(user.name + ' has reset ' + target + '\'s status.');
	}
	*/
};
