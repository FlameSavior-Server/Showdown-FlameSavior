/* Profile chat-plugin
 * by jd, modified by panpawn
 */
 'use strict';

const serverIp = '167.114.155.242';
const http = require('http');
const formatHex = '#566'; //hex code for the formatting of the command
const geoip = require('geoip-ultralight');
const moment = require('moment');
geoip.startWatchingDataUpdate();

exports.commands = {
	profile: function(target, room, user) {
		if (!target) target = user.name;
		if (toId(target).length > 19) return this.sendReply("Usernames may not be more than 19 characters long.");
		if (toId(target).length < 1) return this.sendReply(target + " is not a valid username.");
		if (!this.runBroadcast()) return;

		let targetUser = Users.get(target);

		if (!targetUser) {
			let username = target;
			let userid = toId(target);
			let online = false;
			let avatar = (Config.customavatars[userid] ? "http://" + serverIp + ":" + Config.port + "/avatars/" + Config.customavatars[userid] : "http://play.pokemonshowdown.com/sprites/trainers/167.png");
		} else {
			let username = targetUser.name;
			let userid = targetUser.userid;
			let online = targetUser.connected;
			let avatar = (isNaN(targetUser.avatar) ? "http://" + serverIp + ":" + Config.port + "/avatars/" + targetUser.avatar : "http://play.pokemonshowdown.com/sprites/trainers/" + targetUser.avatar + ".png");
		}

    	if (Users.usergroups[userid]) {
			let userGroup = Users.usergroups[userid].substr(0,1);
			if (Config.groups[userGroup]) userGroup = Config.groups[userGroup].name;
		} else {
			let userGroup = 'Regular User';
		}

		let self = this;
		let bucks = function (user) {
			user = toId(user);
			return (Economy.readMoneySync(user) ? Economy.readMoneySync(user) : 0);
		};
		let regdate = "(Unregistered)";
		Gold.regdate(userid, (date) => {
			if (date) {
				regdate = moment(date).format("MMMM DD, YYYY");
			}
			showProfile();
		});

		function getFlag (flagee) {
			if (!Users(flagee)) return false;
			let geo = geoip.lookupCountry(Users(flagee).latestIp);
			return (Users(flagee) && geo ? ' <img src="https://github.com/kevogod/cachechu/blob/master/flags/' + geo.toLowerCase() + '.png?raw=true" height=10 title="' + geo + '">' : false);
		}
		/*
		function getStatus (user) {
			if (!Users(user)) return false;
			if (Users(user)) {
				let status = Users(users).status;
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
			let seenOutput = (Gold.seenData[userid] ? moment(Gold.seenData[userid]).format("MMMM DD, YYYY h:mm A") + ' EST (' + moment(Gold.seenData[userid]).fromNow() + ')' : "Never");
			let profile = '';
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
		let status = Tools.escapeHTML(target);
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
