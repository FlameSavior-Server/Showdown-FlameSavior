'use strict';

const fs = require('fs');

let adWhitelist = (Config.adWhitelist ? Config.adWhitelist : []);
let bannedMessages = (Config.bannedMessages ? Config.bannedMessages : []);

let adRegex = new RegExp("\\b(?!(" + adWhitelist.join('|') + ").*)(\\w+(?:-\\w+)*)(?=.*psim.*us)", "g");
let adRegex2 = new RegExp("(play.pokemonshowdown.com\\/~~)(?!(" + adWhitelist.join('|') + "))", "g");


Config.chatfilter = function (message, user, room, connection) {
	user.lastActive = Date.now();

	for (let x in bannedMessages) {
		if (message.toLowerCase().indexOf(bannedMessages[x]) > -1 && bannedMessages[x] !== '' && message.substr(0, 1) !== '/') {
			if (user.locked) return false;
			Punishments.lock(user, Date.now() + 7 * 24 * 60 * 60 * 1000, "Said a banned word: " + bannedMessages[x]);
			user.popup('You have been automatically locked for sending a message containing a banned word.');
			Rooms('staff').add('[PornMonitor] ' + (room ? '(' + room + ') ' : '') + Tools.escapeHTML(user.name) +
			' was automatically locked for trying to say "' + message + '"').update();
			fs.appendFile('logs/modlog/modlog_staff.txt', '[' + (new Date().toJSON()) + '] (staff) ' + user.name + ' was locked from talking by the Server (' +
			bannedMessages[x] + ') (' + connection.ip + ')\n');
			Gold.pmUpperStaff(user.name + ' has been automatically locked for sending a message containing a banned word **Room:** ' + room.id +
			' **Message:** ' + message, '~Server');
			return false;
		}
	}

	let advMessage = message.replace(/^http:\/\//i, '');
	advMessage = message.replace(/^https:\/\//i, '');
	advMessage = message.replace(/^www./i, '');

	if (!user.can('hotpatch') && (advMessage.replace(/gold/gi, '').match(adRegex) || advMessage.match(adRegex2))) {
		if (user.locked) return false;
		if (!user.advWarns) user.advWarns = 0;
		user.advWarns++;
		if (user.advWarns > 1) {
			Punishments.lock(user, Date.now() + 7 * 24 * 60 * 60 * 1000, "Advertising");
			fs.appendFile('logs/modlog/modlog_staff.txt', '[' + (new Date().toJSON()) + '] (staff) ' + user.name +
				' was locked from talking by the Server. (Advertising) (' + connection.ip + ')\n');
			connection.sendTo(room, '|raw|<strong class="message-throttle-notice">You have been locked for attempting to advertise.</strong>');
			Gold.pmUpperStaff(user.name + " has been locked for attempting to advertise" + (room ? ". **Room:**" + room.id : " in a private message.") +
				" **Message:** " + message, "~Server");
			return false;
		}

		Gold.pmUpperStaff(user.name + " has attempted to advertise" + (room ? ". **Room:** " + room.id : " in a private message.") +
			" **Message:** " + message);
		connection.sendTo(room, '|raw|<strong class="message-throttle-notice">Advertising detected, your message has not been sent and upper staff has been notified.' +
			'<br />Further attempts to advertise will result in being locked</strong>');
		connection.user.popup("Advertising detected, your message has not been sent and upper staff has been notified.\n" +
			"Further attempts to advertise will result in being locked");
		return false;
	}
	return message;
};
