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
		Object.merge(CoreTWO.emoticons, emotes);
	} catch (e) {};
}
setTimeout(function(){loadEmotes();},1000);

function saveEmotes() {
	try {
		fs.writeFileSync('config/emotes.json',serialize.serialize(emotes));
		Object.merge(CoreTWO.emoticons, emotes);
	} catch (e) {};
}

exports.commands = {
	emotes: 'ezemote',
	temotes: 'ezemote',
	temote: 'ezemote',
	emote: 'ezemote',
	ec: 'ezemote',
	ezemote: function (target, room, user) {
		if (!target) target = 'help';
		var parts = target.split(',');
		for (var u in parts) parts[u] = parts[u].trim();
		try {
			switch (toId(parts[0])) {
				case 'add':
					if (!this.can('ban')) return this.sendReply("Access denied.")
					if (!(parts[2] || parts[3])) return this.sendReply("Usage: /ezemote add, [emote], [link]");
					var emoteName = parts[1];
					if (CoreTWO.emoticons[emoteName]) return this.sendReply("ERROR - the emote: " + emoteName + " already exists.");
					var link = parts.splice(2, parts.length).join(',');
					//if (link != ".gif" || link != ".png" || link != ".jpg") return this.sendReply("ERROR: the emote you are trying to add must be a gif, png, or jpg.");
					emotes[emoteName] = CoreTWO.emoticons[emoteName] = link;
					saveEmotes();
					this.sendReply("The emote " + emoteName + " has been added.");
					this.logModCommand(user.name + " added the emote " + emoteName);
					Rooms.rooms.staff.add(user.name + " added the emote " + emoteName);
					break;
				case 'rem':
				case 'remove':
				case 'del':
				case 'delete':
					if (!this.can('ban')) return this.sendReply("Access denied.");
					if (!parts[1]) return this.sendReplyBox("/ezemote remove, [emote]");
					var emoteName = parts[1];
					if (!CoreTWO.emoticons[emoteName]) return this.sendReply("ERROR - the emote: " + emoteName + " does not exist.");
					delete CoreTWO.emoticons[emoteName];
					delete emotes[emoteName];
					saveEmotes();
					this.sendReply("The emote " + emoteName + " was removed.");
					this.logModCommand("The emote " + emoteName + " was removed by " + user.name);
					Rooms.rooms.staff.add("The emote " + emoteName + " was removed by " + user.name);
					break;
				case 'list':
					if (!this.canBroadcast()) return;
					if (this.broadcasting) return this.sendReply("ERROR: this command is too spammy to broadcast.  Use / instead of ! to see it for yourself.");
					var output = "<b>There's a total of " + Object.size(emotes) + " emotes added with this command:</b><br />";
					for (var e in emotes) {
						output += e + "<br />";
					}
					this.sendReplyBox(output);
					break;
				case 'view':
					if (!this.canBroadcast()) return;
					//if (this.broadcasting) return this.sendReply("ERROR: this command is too spammy to broadcast.  Use / instead of ! to see it for yourself.");
					if (!room.emoteStatus) {
						return this.sendReplyBox("<b><font color=red>Sorry, chat emotes have been disabled. :(</b></font>");
					} else {
						var name = Object.keys(CoreTWO.emoticons),
						emoticons = [];
						var len = name.length;
						while (len--) {
							emoticons.push((CoreTWO.processEmoticons(name[(name.length - 1) - len]) + '&nbsp;' + name[(name.length - 1) - len]));
						}
						this.sendReplyBox("<b><u>List of emoticons (" + Object.size(emotes) + "):</b></u> <br/><br/>" + emoticons.join(' ').toString());
					}
					break;
				case 'object':
					if (!this.canBroadcast()) return;
					if (this.broadcasting) return this.sendReply("ERROR: this command is too spammy to broadcast.  Use / instead of ! to see it for yourself.");
					this.sendReplyBox("CoreTWO.emoticons = " + fs.readFileSync('config/emotes.json','utf8'));
					break;
				case 'status':
					if (!this.canBroadcast()) return;
					if (!parts[1]) {
						switch (room.emoteStatus) {
							case true:
								this.sendReply("Chat emotes are currently enabled in this room.");
								break;
							case false:
								this.sendReply("Chat emotes are currently disabled in this room.");
								break;
						}
					} else {
						switch (toId(parts[1])) {
							case 'on':
							case 'enable':
								if (!this.can('declare', null, room)) return this.sendReply("Access denied.");
								room.emoteStatus = true;
								room.chatRoomData.emoteStatus = room.emoteStatus;
								Rooms.global.writeChatRoomData();
								room.add(Tools.escapeHTML(user.name) + ' has enabled chat emotes in this room.');
								this.logModCommand(Tools.escapeHTML(user.name) + ' has enabled chat emotes in this room.');
								break;
							case 'off':
							case 'disable':
								if (!this.can('declare', null, room)) return this.sendReply("Access denied.");
								room.emoteStatus = false;
								room.chatRoomData.emoteStatus = room.emoteStatus;
								Rooms.global.writeChatRoomData();
								room.add(Tools.escapeHTML(user.name) + " has disabled chat emotes in this room.");
								this.logModCommand(Tools.escapeHTML(user.name) + " has disabled chat emotes in this room.");
								break;
							default:
								if (!this.can('declare', null, room)) return this.sendReply("Access denied.");
								this.sendReply("Usage: /ezemote status - views the current emote status OR /ezemote status, [off / on] - Turns emotes on / off.  Requires &, ~.");
						}
					}
					break;
				case 'help':
				default:
					if (!this.canBroadcast()) return;
					this.sendReplyBox(
						"<table bgcolor=\"#ADD8E6\" width=\"100%\"><td>" +
							"<center><b>EZ-Emote Commands:</b><br />" +
							"<i><font color=\"gray\">(By: <a href=\"https://github.com/panpawn/Pokemon-Showdown/blob/master/chat-plugins/ez-emotes.js\">panpawn</a>)</font></i></center><br />" +
							"/ezemote <code>add, [emote], [link]</code> - Adds an emote. Requires @, &, ~.<br />" +
							"/ezemote <code>remove, [emote]</code> - Removes an emote. Requires @, &, ~.<br />" +
							"/ezemote <code>status</code> - Views the current status of emotes.  Requires #, &, ~.<br />" +
							"/ezemote <code>status, [on / off]</code> - Enables or disables the status of emotes.<br />" +
							"/ezemote <code>list</code> - Shows the emotes that were added with this command.<br />" +
							"/ezemote <code>view</code> - Shows all of the current emotes with their respected image.<br />" +
							"/ezemote <code>object</code> - Shows the object of CoreTWO.emoticons. (Mostly for development usage)<br />" +
							"/ezemote <code>help</code> - Shows this help command.<br />" +
						"</table></td>"
					);
			}
		} catch (e) {
			console.log("ERROR!  The EZ-Emote script has crashed!");
		}
	}
};
