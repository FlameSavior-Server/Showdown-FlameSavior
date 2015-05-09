/* EZ-Emote plugin
 * These are commands that make it easier for people to actually 
 * add / remove emotes without having to manaully do so every time
 * By: panpawn (inspired by jd's ez-tc plugin)
 */
 
var fs = require('fs');
var serialize = require('node-serialize');
var emotes = {};

function loadEmotes() {
	try {
		emotes = serialize.unserialize(fs.readFileSync('config/emotes.json', 'utf8'));
		Object.merge(Core.emoticons, emotes);
	} catch (e) {};
}
setTimeout(function(){loadEmotes();},1000);

function saveEmotes() {
	try {
		fs.writeFileSync('config/emotes.json',serialize.serialize(emotes));
		Object.merge(Core.emoticons, emotes);
	} catch (e) {};
}

exports.commands = {
	emotes: 'ezemote',
	temotes: 'ezemote',
	temote: 'ezemote',
	emote: 'ezemote',
	ec: 'ezemote',
	ezemote: function (target, room, user) {
		var parts = target.split(',');
		for (var u in parts) parts[u] = parts[u].trim();
		if (!target && (cmd === 'emote' || cmd === 'emotes')) {
			target = 'view';
		} else {
			target = 'help';
		}
		try {
			switch (parts[0]) {
				case 'add':
					if (!this.can('pban')) return this.sendReply("Access denied.")
					if (!parts[2]) return this.sendReply("Usage: /ezemote add, [emote], [link]");
					var emoteName = parts[1];
					if (Core.emoticons[emoteName]) return this.sendReply("ERROR - the emote: " + emoteName + " already exists.");
					var link = parts.splice(2, parts.length).join(',');
					emotes[emoteName] = Core.emoticons[emoteName] = link;
					saveEmotes();
					this.sendReply("The emote " + emoteName + " has been added.");
					this.logModCommand(user.name + " added the emote " + emoteName);
					Rooms.rooms.staff.add(user.name + " added the emote " + emoteName);
					break;
				case 'rem':
				case 'remove':
				case 'del':
				case 'delete':
					if (!this.can('pban')) return this.sendReply("Access denied.");
					if (!parts[1]) return this.sendReplyBox('/ezemote remove, [emote]');
					var emoteName = parts[1];
					if (!Core.emoticons[emoteName]) return this.sendReplyBox("ERROR - the emote: " + emoteName + " does not exist.");
					delete Core.emoticons[emoteName];
					delete emotes[emoteName];
					saveEmotes();
					this.sendReply("The emote " + emoteName + " was removed.");
					this.logModCommand("The emote " + emoteName + " was removed by " + user.name);
					Rooms.rooms.staff.add("The emote " + emoteName + " was removed by " + user.name);
					break;
				case 'list':
					if (!this.canBroadcast()) return;
					var output = "<b>There's a total of " + Object.size(emotes) + " emotes added with this command:</b><br />";
					for (var e in emotes) {
						output += e + "<br />";
					}
					this.sendReplyBox(output);
					break;
				case 'view':
					if (!this.canBroadcast()) return;
					if (!Core.settings.emoteStatus) {
						return this.sendReplyBox("<b><font color=red>Sorry, chat emotes have been disabled. :(</b></font>");
					} else {
						var name = Object.keys(Core.emoticons),
						emoticons = [];
						var len = name.length;
						while (len--) {
							emoticons.push((Core.processEmoticons(name[(name.length - 1) - len]) + '&nbsp;' + name[(name.length - 1) - len]));
						}
						this.sendReplyBox('<b><u>List of emoticons (' + Object.size(emotes) + '):</b></u> <br/><br/>' + emoticons.join(' ').toString());
					}
					break;
				case 'status':
					if (!this.can('pban')) return this.sendReply("Access denied.");
					if (!parts[1]) {
						var currentEmoteStatus = '';
						if (!Core.settings.emoteStatus) {
							currentEmoteStatus = 'disabled.';
						} else {
							currentEmoteStatus = 'enabled.';
						}
						return this.sendReply('Chat emotes are currently ' + currentEmoteStatus);
					} else {
						switch (toId(parts[1])) {
							case 'on':
							case 'enable':
								if (!this.can('pban')) return this.sendReply("Access denied.");
								Core.settings.emoteStatus = true;
								room.add(Tools.escapeHTML(user.name) + ' has enabled chat emotes.');
								this.logModCommand(Tools.escapeHTML(user.name) + ' has enabled chat emotes.');
								break;
							case 'off':
							case 'disable':
								if (!this.can('pban')) return this.sendReply("Access denied.");
								Core.settings.emoteStatus = false;
								room.add(Tools.escapeHTML(user.name) + ' has disabled chat emotes.');
								this.logModCommand(Tools.escapeHTML(user.name) + ' has disabled chat emotes.');
								break;
							default:
								if (!this.can('pban')) return this.sendReply("Access denied.");
								this.sendReply("Usage: /ezemote status - views the current emote status OR /ezemote status, [off / on] - Turns emotes on / off.  Requires &, ~.");
						}
					}
					break;
				case 'help':
				default:
					if (!this.canBroadcast()) return;
					this.sendReplyBox(
						"EZ-Emote Commands:<br />" +
						"/ezemote add, [emote], [link] - Adds an emote. Requires &, ~.<br />" +
						"/ezemote remove, [emote] - Removes an emote. Requires &, ~.<br />" +
						"/ezemote status - Views the status of emotes.  Requires &, ~.<br />" +
						"/ezemote status, [on / off] - Enables or disables the status of emotes. Requires &, ~.<br />" +
						"/ezemote list - Shows the emotes that were added with this command.<br />" +
						"/ezemote view - Shows all of the current emotes with their respected image.<br />" +
						"/ezemote help - Shows this help command.<br />"
					);
			}
		} catch (e) {};
	}
};
