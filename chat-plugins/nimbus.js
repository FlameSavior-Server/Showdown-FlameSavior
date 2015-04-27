var fs = require('fs');
var badges = fs.createWriteStream('badges.txt', {'flags': 'a'});

exports.commands = {
	gdeclarered: 'gdeclare',
	gdeclaregreen: 'gdeclare',
	gdeclare: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help gdeclare');
		if (!this.can('declare')) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		var roomName = (room.isPrivate) ? 'a private room' : room.id;
		var colour = cmd.substr(8) || 'blue';
		for (var id in Rooms.rooms) {
			var tarRoom = Rooms.rooms[id];
			if (tarRoom.id !== 'global') {
				tarRoom.addRaw('<div class="broadcast-' + colour + '"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
				tarRoom.update();
			}
		}
		this.logModCommand(user.name + ' globally declared ' + target);
	},

	declaregreen: 'declarered',
	declarered: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		room.addRaw('<div class="broadcast-' + cmd.substr(7) + '"><b>' + target + '</b></div>');
		room.update();
		this.logModCommand(user.name + ' declared ' + target);
	},

	pdeclare: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		room.addRaw('<div class="broadcast-purple"><b>' + target + '</b></div>');
		room.update();
		this.logModCommand(user.name + ' declared ' + target);
	},

	sd: 'declaremod',
	staffdeclare: 'declaremod',
	modmsg: 'declaremod',
	moddeclare: 'declaremod',
	declaremod: function (target, room, user) {
		if (!target) return this.sendReply('/declaremod [message] - Also /moddeclare and /modmsg');
		if (!this.can('declare', null, room)) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		this.privateModCommand('|raw|<div class="broadcast-red"><b><font size=1><i>Private Auth (Driver +) declare from ' + user.name + '<br /></i></font size>' + target + '</b></div>');
		room.update();
		this.logModCommand(user.name + ' mod declared ' + target);
	},

	rk: 'kick',
	roomkick: 'kick',
	kick: function (target, room, user) {
		if (!target) return this.sendReply('/help kick');
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) return this.sendReply('User "' + this.targetUsername + '" not found.');
		if (!this.can('mute', targetUser, room)) return false;

		this.addModCommand(targetUser.name + ' was kicked from the room by ' + user.name + '.');
		targetUser.popup('You were kicked from ' + room.id + ' by ' + user.name + '.');
		targetUser.leaveRoom(room.id);
	},

	dm: 'daymute',
	daymute: function (target, room, user) {
		if (!target) return this.parse('/help daymute');
		if (!this.can('mute', targetUser, room)) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('User "' + this.targetUsername + '" not found.');

		if (((targetUser.mutedRooms[room.id] && (targetUser.muteDuration[room.id] || 0) >= 50 * 60 * 1000) || targetUser.locked) && !target) {
			var problem = ' but was already ' + (!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			return this.privateModCommand('(' + targetUser.name + ' would be muted by ' + user.name + problem + '.)');
		}

		targetUser.popup(user.name + ' has muted you for 24 hours. ' + target);
		this.addModCommand('' + targetUser.name + ' was muted by ' + user.name + ' for 24 hours.' + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand("" + targetUser.name + "'s alts were also muted: " + alts.join(", "));

		targetUser.mute(room.id, 24 * 60 * 60 * 1000, true);
	},

	flogout: 'forcelogout',
	forcelogout: function (target, room, user) {
		if (!target) return this.sendReply('/forcelogout [username], [reason] OR /flogout [username], [reason] - Reason is optional.');
		if (!user.can('hotpatch')) return;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
		if (targetUser.can('hotpatch')) return this.sendReply('You cannot force logout another Admin.');

		this.addModCommand('' + targetUser.name + ' was forcibly logged out by ' + user.name + '.' + (target ? " (" + target + ")" : ""));
		this.logModCommand(user.name + ' forcibly logged out ' + targetUser.name);
		targetUser.resetName();
	}
};
