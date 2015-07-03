/* Emoticons Plugin
 * This is a chat-plugin for Emoticons
 * You will need a line in parser to actually 
 * parse this so that it works. (See command-parser.js)
 * Credits: panpawn, jd  
 */

var fs = require('fs');
var path = require('path');
var serialize = require('node-serialize');
var emotes = {};

if (typeof Gold === 'undefined') global.Gold = {};

Gold.emoticons = {
	chatEmotes: {},
	processEmoticons: function(text) {
		var patterns = [],
		metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g,
		self = this;
		for (var i in this.chatEmotes) {
			if (this.chatEmotes.hasOwnProperty(i)) {
				patterns.push('(' + i.replace(metachars, "\\$&") + ')');
			}
		}
		return text.replace(new RegExp(patterns.join('|'), 'g'), function(match) {
			return typeof self.chatEmotes[match] != 'undefined' ?
				'<img src="' + self.chatEmotes[match] + '" title="' + match + '"/>' :
				match;
		});
	},
	processChatData: function(user, room, connection, message) {
		var match = false;
		for (var i in this.chatEmotes) {
			if (message.indexOf(i) >= 0) {
				match = true;
			}
		}
		switch (Users.ShadowBan.checkBanned(user) && match) {
			case true:
				origmsg = message;
				message = Tools.escapeHTML(message);
				message = this.processEmoticons(message);
				user.sendTo(room, '|html|' + 
					user.getIdentity(room).substr(0,1) + '<button class="astext" name="parseCommand" value="/user ' +
					user.name + '">' + '<b><font color="' + Gold.hashColor(user.userid) + '">' + Tools.escapeHTML(user.name) + ':</font></b></button> ' + message + '</div>'
				);
				room.update();
				Users.ShadowBan.addMessage(user, "To " + room, origmsg);
				break;
			case false:
				if (!room.emoteStatus && room.type === 'chat' || !room.type === 'battle') {
					kitty = message = this.processEmoticons(message);
					var message = Tools.escapeHTML(kitty);
					return (message);
					return;
				} else if (room.emoteStatus || room.type === 'battle') {
					if (!match || message.charAt(0) === '!') return true;
					message = Tools.escapeHTML(message);
					message = this.processEmoticons(message);
					if (user.hiding) {
						room.addRaw(' <button class="astext" name="parseCommand" value="/user ' +
						user.name + '">' + '<b><font color="' + Gold.hashColor(user.userid) + '">' + Tools.escapeHTML(user.name) + ':</font></b></button> ' + message + '</div>');
						room.update();
					}
					room.addRaw(user.getIdentity(room).substr(0,1) + '<button class="astext" name="parseCommand" value="/user ' +
					user.name + '">' + '<b><font color="' + Gold.hashColor(user.userid) + '">' + Tools.escapeHTML(user.name) + ':</font></b></button> ' + message + '</div>');
					room.update();
					return false;
				}
				break;
		}
	}
};


//commands

function loadEmotes() {
	try {
		emotes = serialize.unserialize(fs.readFileSync('config/emotes.json', 'utf8'));
		Object.merge(Gold.emoticons.chatEmotes, emotes);
	} catch (e) {}
}
setTimeout(function(){loadEmotes();},1000);

function saveEmotes() {
	try {
		fs.writeFileSync('config/emotes.json',serialize.serialize(emotes));
		Object.merge(Gold.emoticons.chatEmotes, emotes);
	} catch (e) {}
}

exports.commands = {
	emotes: 'ezemote',
	temotes: 'ezemote',
	temote: 'ezemote',
	emote: 'ezemote',
	ec: 'ezemote',
	ezemote: function (target, room, user) {
		if (!target) target = "help";
		var parts = target.split(',');
		for (var u in parts) parts[u] = parts[u].trim();
		
		try {
			switch (toId(parts[0])) {
				case 'add':
					if (!this.can('ban')) return this.sendReply("Access denied.");
					if (!(parts[2] || parts[3])) return this.sendReply("Usage: /ezemote add, [emote], [link]");
					var emoteName = parts[1];
					if (Gold.emoticons.chatEmotes[emoteName]) return this.sendReply("ERROR - the emote: " + emoteName + " already exists.");
					var link = parts.splice(2, parts.length).join(',');
					var fileTypes = [".gif",".png",".jpg"];
					if (fileTypes.indexOf(link.substr(-4)) < 0) return this.sendReply("ERROR: the emote you are trying to add must be a gif, png, or jpg.");
					emotes[emoteName] = Gold.emoticons.chatEmotes[emoteName] = link;
					saveEmotes();
					this.sendReply("The emote " + emoteName + " has been added.");
					this.logModCommand(user.name + " added the emote " + emoteName);
					Rooms.rooms.staff.add(Tools.escapeHTML(user.name) + " added the emote " + emoteName);
					room.update();
					break;
				case 'rem':
				case 'remove':
				case 'del':
				case 'delete':
					if (!this.can('ban')) return this.sendReply("Access denied.");
					if (!parts[1]) return this.sendReplyBox("/ezemote remove, [emote]");
					var emoteName = parts[1];
					if (!Gold.emoticons.chatEmotes[emoteName]) return this.sendReply("ERROR - the emote: " + emoteName + " does not exist.");
					delete Gold.emoticons.chatEmotes[emoteName];
					delete emotes[emoteName];
					saveEmotes();
					this.sendReply("The emote " + emoteName + " was removed.");
					this.logModCommand("The emote " + emoteName + " was removed by " + user.name);
					Rooms.rooms.staff.add("The emote " + emoteName + " was removed by " + Tools.escapeHTML(user.name));
					room.update();
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
					var name = Object.keys(Gold.emoticons.chatEmotes);
					emoticons = [];
					var len = name.length;
					while (len--) {
						emoticons.push((Gold.emoticons.processEmoticons(name[(name.length - 1) - len]) + '&nbsp;' + name[(name.length - 1) - len]));
					}
					this.sendReplyBox("<b><u>List of emoticons (" + Object.size(emotes) + "):</b></u> <br/><br/>" + emoticons.join(' ').toString());
					break;
				case 'object':
					if (!this.canBroadcast()) return;
					if (this.broadcasting) return this.sendReply("ERROR: this command is too spammy to broadcast.  Use / instead of ! to see it for yourself.");
					this.sendReplyBox("Gold.emoticons.chatEmotes = " + fs.readFileSync('config/emotes.json','utf8'));
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
								if (room.type === 'battle') return this.sendReply("Chat emoticons are already enabled in battle rooms by default and cannot be turned off.");
								if (room.emoteStatus) return this.sendReply("Chat emoticons are already enabled in this room.");
								room.emoteStatus = true;
								room.chatRoomData.emoteStatus = room.emoteStatus;
								Rooms.global.writeChatRoomData();
								//room.add(Tools.escapeHTML(user.name) + ' has enabled chat emoticons in this room.');
								this.add("|raw|<div class=\"broadcast-blue\"><b>Chat Emoticons have been enabled!</b><br />Everyone in this room may use chat emoticons.");
								this.privateModCommand("(" + user.name + " has enabled chat emoticons in this room)");
								break;
							case 'off':
							case 'disable':
								if (!this.can('declare', null, room)) return this.sendReply("Access denied.");
								if (room.type === 'battle') return this.sendReply("Chat emoticons are already enabled in battle rooms by default and cannot be turned off.");
								if (!room.emoteStatus) return this.sendReply("Chat emoticons are already disabled in this room.");
								room.emoteStatus = false;
								room.chatRoomData.emoteStatus = room.emoteStatus;
								Rooms.global.writeChatRoomData();
								//room.add(Tools.escapeHTML(user.name) + " has disabled chat emoticons in this room.");
								this.add("|raw|<div class=\"broadcast-red\"><b>Chat Emoticons have been disabled!</b><br />No one in this room may use chat emoticons.");
								this.privateModCommand("(" + user.name + " has disabled chat emoticons in this room)");
								break;
							default:
								this.sendReply("Usage: /ezemote status, [on / off] - Enables or disables the current chat emoticon status.  Requires #, &, ~.");
						}
					}
					break;
				case 'help':
				default:
					if (!this.canBroadcast()) return;
					this.sendReplyBox(
						"<table bgcolor=\"#ADD8E6\" width=\"100%\"><td>" +
							"<center><b>EZ-Emoticon Commands:</b><br />" +
							"<i><font color=\"gray\">(By: <a href=\"https://github.com/panpawn/Pokemon-Showdown/blob/master/chat-plugins/ez-emotes.js\">panpawn</a>)</font></i></center><br />" +
							"/ezemote <code>add, [emote], [link]</code> - Adds a chat emoticon. Requires @, &, ~.<br />" +
							"/ezemote <code>remove, [emote]</code> - Removes a chat emoticon. Requires @, &, ~.<br />" +
							"/ezemote <code>status, [on / off]</code> - Enables or disables the status of chat emoticons in the respected room. Requires #, &, ~.<br />" +
							"/ezemote <code>status</code> - Views the current status of chat emoticons.<br />" +
							"/ezemote <code>list</code> - Shows the chat emoticons in a list form.<br />" +
							"/ezemote <code>view</code> - Shows all of the current chat emoticons with the respected image.<br />" +
							"/ezemote <code>object</code> - Shows the object of Gold.emoticons.chatEmotes. (Mostly for development usage)<br />" +
							"/ezemote <code>help</code> - Shows this help command.<br />" +
						"</td></table>"
					);
			}
		} catch (e) {
			try {
				Rooms.rooms.development.add(e.stack);
			} catch (e) {
				console.log("ERROR!  The EZ-Emote script has crashed!\n" + e.stack);
			}
		}
	}
};