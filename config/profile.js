var Profile = {
	avatar: function (user, height) {
	    return '<img src="http://play.pokemonshowdown.com/sprites/trainers/' + user.avatar + '.png' + '" align="left" height="' + height + '">';
	},

	customAvatar: function (user, height) {
	    return '<img src="http://192.184.93.98:8000/avatars/' + user.avatar + '" align="left" height="' + height + '"><br/>';
	},

	name: function (user) {
	    return '<b><font size="2" color="' + Utilities.hashColor(user.name) + '">' + user.name + '</font></b>';
	},

	unregisteredName: function (user) {
	    return '<b><font size="2" color="' + Utilities.hashColor(user.name) + '">' + user.name + ' </b></font><font color="2">(Unregistered)</font>';
	},

	rank: function (user) {
		return Utilities.rank(user);
	},

	elo: function (user) {
		io.stdinNumber('config/elo.csv', user, 'elo');
		if (user.elo === 0) {
			user.elo = 1000;
		}
		return ' | Elo Ranking: ' + Math.round(user.elo) + '<br/>';
	},

	views: function (user) {
	    io.stdinNumber('config/views.csv', user, 'views');
	    var space = '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;';
	    return space + '- Views: ' + user.views;
	},

	money: function (user) {
	    io.stdinNumber('config/money.csv', user, 'money');
	    return '<i>Money:</i> ' + '<img src="http://cdn.bulbagarden.net/upload/8/8c/Pok%C3%A9monDollar.png" title="PokeDollar">' + user.money;
	},

	tourWins: function (user) {
		io.stdinNumber('config/tourWins.csv', user, 'tourWins');
		return  ' | <i>Tournament Wins</i>: ' + user.tourWins + '<br/>';
	},

	status: function (user) {
	    io.stdinString('config/status.csv', user, 'status');
	    if (user.status === '') {
	        user.status = 'This user hasn\'t set their status yet.';
	    }
	    return 'Status: "' + user.status + '"';
	},

	statusTime: function (user) {
	    io.stdinString('config/statusTime.csv', user, 'statusTime');
	    return ' <font color="gray">' + user.statusTime + '</font>';
	}
};

var cmds = {
	profile: function (target, room, user, connection) {
	    if (!this.canBroadcast()) return;

	    var targetUser = this.targetUserOrSelf(target);

	    if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');

	    var height = 75;

	    io.stdoutNumber('config/views.csv', targetUser, 'views', 1);

	    var display = Profile.avatar(targetUser, height) + Profile.name(targetUser) + Profile.views(targetUser) + '<hr>' + Profile.rank(targetUser) + Profile.elo(targetUser) + Profile.money(targetUser) + Profile.tourWins(targetUser) + Profile.status(targetUser) + Profile.statusTime(targetUser);
	  
	    if (!targetUser.authenticated && targetUser.isAway === false) {
	        display = Profile.avatar(targetUser, height) + Profile.unregisteredName(targetUser) + Profile.views(targetUser) + '<hr>' + Profile.rank(targetUser) + Profile.elo(targetUser) + Profile.money(targetUser) + Profile.tourWins(targetUser) + Profile.status(targetUser) + Profile.statusTime(targetUser);
	        return this.sendReplyBox(display);
	    } else if (typeof (targetUser.avatar) === typeof ('')) {
	        display = Profile.customAvatar(targetUser, height) + Profile.name(targetUser) + Profile.views(targetUser) + '<hr>' + Profile.rank(targetUser) + Profile.elo(targetUser) + Profile.money(targetUser) + Profile.tourWins(targetUser) + Profile.status(targetUser) + Profile.statusTime(targetUser);
	        return this.sendReplyBox(display);
	    } else {
	        return this.sendReplyBox(display);
	    }
	},

	setstatus: 'status',
	status: function(target, room, user){
		if (!target) return this.sendReply('|raw|Set your status for profile. Usage: /status <i>status information</i>');
		if (target.length > 30) return this.sendReply('Status is too long.');
		if (target.indexOf(',') >= 1) return this.sendReply('Unforunately, your status cannot contain a comma.');
		var escapeHTML = sanitize(target, true);
		io.stdoutString('config/status.csv', user, 'status', escapeHTML);
		
		var currentdate = new Date(); 
		var datetime = "Last Updated: " + (currentdate.getMonth()+1) + "/"+currentdate.getDate() + "/" + currentdate.getFullYear() + " @ "  + Utilities.formatAMPM(currentdate);
		io.stdoutString('config/statusTime.csv', user, 'statusTime', datetime);
	
		this.sendReply('Your status is now: "' + target + '"');
		if('+%@&~'.indexOf(user.group) >= 0) {
			room.add('|raw|<b> * <font color="' + Utilities.hashColor(user.name) + '">' + user.name + '</font> set their status to: </b>"' + escapeHTML + '"');
		}
	},
};

Object.merge(CommandParser.commands, cmds);
exports.cmds = cmds;
