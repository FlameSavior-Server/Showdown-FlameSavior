var fs = require('fs');

exports.commands = {
	stafflist: 'authlist',
	authlist: function(target, room, user, connection) {
		fs.readFile('config/usergroups.csv', 'utf8', function(err, data) {
			var staff = {
				"admins": [],
				"leaders": [],
				"mods": [],
				"drivers": [],
				"voices": []
			};
			var row = (''+data).split('\n');
			for (var i = row.length; i > -1; i--) {
				if (!row[i]) continue;
				var rank = row[i].split(',')[1].replace("\r",'');
				var person = row[i].split(',')[0];
				switch (rank) {
					case '~':
						staff['admins'].push(person);
					break;
					case '&':
						staff['leaders'].push(person);
					break;
					case '@':
						staff['mods'].push(person);
					break;
					case '%':
						staff['drivers'].push(person);
					break;
					case '+':
						staff['voices'].push(person);
					break;
					default:
					continue;
				}
			}
			connection.popup(
				'Staff List \n\n**Administrator**:\n'+ staff['admins'].join(', ') +
				'\n**Leaders**:\n' + staff['leaders'].join(', ') +
				'\n**Moderators**:\n' + staff['mods'].join(', ') +
				'\n**Drivers**:\n' + staff['drivers'].join(', ') +
				'\n**Voices**:\n' + staff['voices'].join(', ')
			);
		})
	}
};
