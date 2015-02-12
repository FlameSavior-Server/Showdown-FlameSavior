/**
 * Commands
 * Pokemon Showdown - https://pokemonshowdown.com/
 *
 * These are commands. For instance, you can define the command 'whois'
 * here, then use it by typing /whois into Pokemon Showdown.
 *
 * A command can be in the form:
 *   ip: 'whois',
 * This is called an alias: it makes it so /ip does the same thing as
 * /whois.
 *
 * But to actually define a command, it's a function:
 *
 *   allowchallenges: function (target, room, user) {
 *     user.blockChallenges = false;
 *     this.sendReply("You are available for challenges from now on.");
 *   }
 *
 * Commands are actually passed five parameters:
 *   function (target, room, user, connection, cmd, message)
 * Most of the time, you only need the first three, though.
 *
 * target = the part of the message after the command
 * room = the room object the message was sent to
 *   The room name is room.id
 * user = the user object that sent the message
 *   The user's name is user.name
 * connection = the connection that the message was sent from
 * cmd = the name of the command
 * message = the entire message sent by the user
 *
 * If a user types in "/msg zarel, hello"
 *   target = "zarel, hello"
 *   cmd = "msg"
 *   message = "/msg zarel, hello"
 *
 * Commands return the message the user should say. If they don't
 * return anything or return something falsy, the user won't say
 * anything.
 *
 * Commands have access to the following functions:
 *
 * this.sendReply(message)
 *   Sends a message back to the room the user typed the command into.
 *
 * this.sendReplyBox(html)
 *   Same as sendReply, but shows it in a box, and you can put HTML in
 *   it.
 *
 * this.popupReply(message)
 *   Shows a popup in the window the user typed the command into.
 *
 * this.add(message)
 *   Adds a message to the room so that everyone can see it.
 *   This is like this.sendReply, except everyone in the room gets it,
 *   instead of just the user that typed the command.
 *
 * this.send(message)
 *   Sends a message to the room so that everyone can see it.
 *   This is like this.add, except it's not logged, and users who join
 *   the room later won't see it in the log, and if it's a battle, it
 *   won't show up in saved replays.
 *   You USUALLY want to use this.add instead.
 *
 * this.logEntry(message)
 *   Log a message to the room's log without sending it to anyone. This
 *   is like this.add, except no one will see it.
 *
 * this.addModCommand(message)
 *   Like this.add, but also logs the message to the moderator log
 *   which can be seen with /modlog.
 *
 * this.logModCommand(message)
 *   Like this.addModCommand, except users in the room won't see it.
 *
 * this.can(permission)
 * this.can(permission, targetUser)
 *   Checks if the user has the permission to do something, or if a
 *   targetUser is passed, check if the user has permission to do
 *   it to that user. Will automatically give the user an "Access
 *   denied" message if the user doesn't have permission: use
 *   user.can() if you don't want that message.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.can('potd')) return false;
 *
 * this.canBroadcast()
 *   Signifies that a message can be broadcast, as long as the user
 *   has permission to. This will check to see if the user used
 *   "!command" instead of "/command". If so, it will check to see
 *   if the user has permission to broadcast (by default, voice+ can),
 *   and return false if not. Otherwise, it will add the message to
 *   the room, and turn on the flag this.broadcasting, so that
 *   this.sendReply and this.sendReplyBox will broadcast to the room
 *   instead of just the user that used the command.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canBroadcast()) return false;
 *
 * this.canBroadcast(suppressMessage)
 *   Functionally the same as this.canBroadcast(). However, it
 *   will look as if the user had written the text suppressMessage.
 *
 * this.canTalk()
 *   Checks to see if the user can speak in the room. Returns false
 *   if the user can't speak (is muted, the room has modchat on, etc),
 *   or true otherwise.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canTalk()) return false;
 *
 * this.canTalk(message, room)
 *   Checks to see if the user can say the message in the room.
 *   If a room is not specified, it will default to the current one.
 *   If it has a falsy value, the check won't be attached to any room.
 *   In addition to running the checks from this.canTalk(), it also
 *   checks to see if the message has any banned words, is too long,
 *   or was just sent by the user. Returns the filtered message, or a
 *   falsy value if the user can't speak.
 *
 *   Should usually be near the top of the command, like:
 *     target = this.canTalk(target);
 *     if (!target) return false;
 *
 * this.parse(message)
 *   Runs the message as if the user had typed it in.
 *
 *   Mostly useful for giving help messages, like for commands that
 *   require a target:
 *     if (!target) return this.parse('/help msg');
 *
 *   After 10 levels of recursion (calling this.parse from a command
 *   called by this.parse from a command called by this.parse etc)
 *   we will assume it's a bug in your command and error out.
 *
 * this.targetUserOrSelf(target, exactName)
 *   If target is blank, returns the user that sent the message.
 *   Otherwise, returns the user with the username in target, or
 *   a falsy value if no user with that username exists.
 *   By default, this will track users across name changes. However,
 *   if exactName is true, it will enforce exact matches.
 *
 * this.getLastIdOf(user)
 *   Returns the last userid of an specified user.
 *
 * this.splitTarget(target, exactName)
 *   Splits a target in the form "user, message" into its
 *   constituent parts. Returns message, and sets this.targetUser to
 *   the user, and this.targetUsername to the username.
 *   By default, this will track users across name changes. However,
 *   if exactName is true, it will enforce exact matches.
 *
 *   Remember to check if this.targetUser exists before going further.
 *
 * Unless otherwise specified, these functions will return undefined,
 * so you can return this.sendReply or something to send a reply and
 * stop the command there.
 *
 * @license MIT license
 */
var fs = require('fs');
var badges = fs.createWriteStream('badges.txt', {'flags': 'a'});
var commands = exports.commands = {
    ip: 'whois',
    rooms: 'whois',
    alt: 'whois',
    alts: 'whois',
    whoare: 'whois',
    whois: function (target, room, user, connection, cmd) {
        var targetUser = this.targetUserOrSelf(target, user.group === ' ');
        if (!targetUser) {
            return this.sendReply("User " + this.targetUsername + " not found.");
        }

        this.sendReply("|raw|User: " + targetUser.name + (!targetUser.connected ? ' <font color="gray"><em>(offline)</em></font>' : ''));
        if (user.can('alts', targetUser)) {
            var alts = targetUser.getAlts(true);
            var output = Object.keys(targetUser.prevNames).join(", ");
            if (output) this.sendReply("Previous names: " + output);

            for (var j = 0; j < alts.length; ++j) {
                var targetAlt = Users.get(alts[j]);
                if (!targetAlt.named && !targetAlt.connected) continue;
                if (targetAlt.group === '~' && user.group !== '~') continue;

                this.sendReply("|raw|Alt: " + targetAlt.name + (!targetAlt.connected ? ' <font color="gray"><em>(offline)</em></font>' : ''));
                output = Object.keys(targetAlt.prevNames).join(", ");
                if (output) this.sendReply("Previous names: " + output);
            }
            if (targetUser.locked) {
                switch (targetUser.locked) {
                case '#dnsbl':
                    this.sendReply("Locked: IP is in a DNS-based blacklist. ");
                    break;
                case '#range':
                    this.sendReply("Locked: IP or host is in a temporary range-lock.");
                    break;
                case '#hostfilter':
                    this.sendReply("Locked: host is permanently locked for being a proxy.");
                    break;
                default:
                    this.sendReply("Locked under the username: " + targetUser.locked);
                }
            }
        }
        if (Config.groups[targetUser.group] && Config.groups[targetUser.group].name) {
            this.sendReply("Group: " + Config.groups[targetUser.group].name + " (" + targetUser.group + ")");
        }
        if (targetUser.goldDev) {
            this.sendReply("(Gold Development Staff)");
        }
        if (targetUser.isSysop) {
            this.sendReply("(Pok\xE9mon Showdown System Operator)");
        }
        if (!targetUser.authenticated) {
            this.sendReply("(Unregistered)");
        }
        if ((cmd === 'ip' || cmd === 'whoare') && (user.can('ip', targetUser) || user === targetUser)) {
            var ips = Object.keys(targetUser.ips);
            this.sendReply("IP" + ((ips.length > 1) ? "s" : "") + ": " + ips.join(", ") +
                    (user.group !== ' ' && targetUser.latestHost ? "\nHost: " + targetUser.latestHost : ""));
        }
        var publicrooms = "In rooms: ";
        var hiddenrooms = "In hidden rooms: ";
        var first = true;
        var hiddencount = 0;
        for (var i in targetUser.roomCount) {
            var targetRoom = Rooms.get(i);
            if (i === 'global' || targetRoom.isPrivate === true) continue;

            var output = (targetRoom.auth && targetRoom.auth[targetUser.userid] ? targetRoom.auth[targetUser.userid] : '') + '<a href="/' + i + '" room="' + i + '">' + i + '</a>';
            if (targetRoom.isPrivate) {
                if (hiddencount > 0) hiddenrooms += " | ";
                ++hiddencount;
                hiddenrooms += output;
            } else {
                if (!first) publicrooms += " | ";
                first = false;
                publicrooms += output;
            }
        }
        this.sendReply('|raw|' + publicrooms);
        if (cmd === 'whoare' && user.can('lock') && hiddencount > 0) {
            this.sendReply('|raw|' + hiddenrooms);
        }
    },
    aip: 'inprivaterooms',
    awhois: 'inprivaterooms',
    allrooms: 'inprivaterooms',
    prooms: 'inprivaterooms',
    adminwhois: 'inprivaterooms',
    inprivaterooms: function(target, room, user) {
        if (!this.can('seeprivaterooms')) return false;
        var targetUser = this.targetUserOrSelf(target);
        if (!targetUser) {
            return this.sendReply('User ' + this.targetUsername + ' not found.');
        }

        this.sendReply('User: ' + targetUser.name);
        if (user.can('seeprivaterooms', targetUser)) {
            var alts = targetUser.getAlts();
            var output = '';
            for (var i in targetUser.prevNames) {
                if (output) output += ", ";
                output += targetUser.prevNames[i];
            }
            if (output) this.sendReply('Previous names: ' + output);
        }
    },

    ip: 'whois',
    rooms: 'whois',
    alt: 'whois',
    alts: 'whois',
    whois: function(target, room, user) {
        var targetUser = this.targetUserOrSelf(target, user.group === ' ');
        if (!targetUser) {
            return this.sendReply("User " + this.targetUsername + " not found.");
        }

        this.sendReply("|raw|User: " + targetUser.name + (!targetUser.connected ? ' <font color="gray"><em>(offline)</em></font>' : ''));
        if (user.can('alts', targetUser)) {
            var alts = targetUser.getAlts(true);
            var output = Object.keys(targetUser.prevNames).join(", ");
            if (output) this.sendReply("Previous names: " + output);

            for (var j = 0; j < alts.length; ++j) {
                var targetAlt = Users.get(alts[j]);
                if (!targetAlt.named && !targetAlt.connected) continue;
                if (targetAlt.group === '~' && user.group !== '~') continue;

                this.sendReply("|raw|Alt: " + targetAlt.name + (!targetAlt.connected ? ' <font color="gray"><em>(offline)</em></font>' : ''));
                output = Object.keys(targetAlt.prevNames).join(", ");
                if (output) this.sendReply("Previous names: " + output);
            }
            if (targetUser.locked) {
                this.sendReply("Locked under the username: " + targetUser.locked);
            }
        }
        if (Config.groups[targetUser.group] && Config.groups[targetUser.group].name) {
            this.sendReply("Group: " + Config.groups[targetUser.group].name + " (" + targetUser.group + ")");
        }
        if (targetUser.goldDev) {
            this.sendReply('(Gold Development Staff)');
        }
        if (targetUser.goldVip) {
            this.sendReply('|html|(<font color="gold">VIP</font> User)');
        }
        if (targetUser.isSysop) {
            this.sendReply("(Pok\xE9mon Showdown System Operator)");
        }
        if (!targetUser.authenticated) {
            this.sendReply("(Unregistered)");
        }
        if (user.can('ip', targetUser) || user === targetUser) {
            var ips = Object.keys(targetUser.ips);
            this.sendReply("IP" + ((ips.length > 1) ? "s" : "") + ": " + ips.join(", ") +
                (user.group !== ' ' && targetUser.latestHost ? "\nHost: " + targetUser.latestHost : ""));
        }
        if (targetUser.canCustomSymbol || targetUser.canCustomAvatar || targetUser.canAnimatedAvatar || targetUser.canChatRoom || targetUser.canTrainerCard || targetUser.canFixItem || targetUser.canDecAdvertise || /*targetUser.canBadge || targetUser.canPOTD || targetUser.canForcerename ||*/ targetUser.canMusicBox || targetUser.canCustomEmote) {
            var i = '';
            if (targetUser.canCustomSymbol) i += ' Custom Symbol';
            if (targetUser.canCustomAvatar) i += ' Custom Avatar';
            if (targetUser.canCustomEmote) i += ' Custom Emote'
            if (targetUser.canAnimatedAvatar) i += ' Animated Avatar';
            if (targetUser.canChatRoom) i += ' Chat Room';
            if (targetUser.canTrainerCard) i += ' Trainer Card';
            if (targetUser.canFixItem) i += ' Alter card/avatar/music box';
            if (targetUser.canDecAdvertise) i += ' Declare Advertise';
            //if (targetUser.canBadge) i += ' VIP Badge / Global Voice';
            if (targetUser.canMusicBox) i += ' Music Box';
            //if (targetUser.canPOTD) i += ' POTD';
            //if (targetUser.canForcerename) i += ' Forcerename'
            this.sendReply('Eligible for: ' + i);
        }
        var output = "In rooms: ";
        var first = true;
        for (var i in targetUser.roomCount) {
            var targetRoom = Rooms.get(i);
            if (i === 'global' || targetRoom.isPrivate) continue;
            if (!first) output += " | ";
            first = false;

            output += (targetRoom.auth && targetRoom.auth[targetUser.userid] ? targetRoom.auth[targetUser.userid] : '') + '<a href="/' + i + '" room="' + i + '">' + i + '</a>';
        }
        if (!targetUser.connected || targetUser.isAway) {
            this.sendReply('|raw|This user is ' + ((!targetUser.connected) ? '<font color = "red">offline</font>.' : '<font color = "orange">away</font>.'));
        }
        this.sendReply('|raw|' + output);
    },

    aip: 'inprivaterooms',
    awhois: 'inprivaterooms',
    allrooms: 'inprivaterooms',
    prooms: 'inprivaterooms',
    adminwhois: 'inprivaterooms',
    inprivaterooms: function(target, room, user) {
        if (!this.can('seeprivaterooms')) return false;
        var targetUser = this.targetUserOrSelf(target);
        if (!targetUser) {
            return this.sendReply('User ' + this.targetUsername + ' not found.');
        }

        this.sendReply('User: ' + targetUser.name);
        if (user.can('seeprivaterooms', targetUser)) {
            var alts = targetUser.getAlts();
            var output = '';
            for (var i in targetUser.prevNames) {
                if (output) output += ", ";
                output += targetUser.prevNames[i];
            }
            if (output) this.sendReply('Previous names: ' + output);

            for (var j = 0; j < alts.length; j++) {
                var targetAlt = Users.get(alts[j]);
                if (!targetAlt.named && !targetAlt.connected) continue;


                this.sendReply('Alt: ' + targetAlt.name);
                output = '';
                for (var i in targetAlt.prevNames) {
                    if (output) output += ", ";
                    output += targetAlt.prevNames[i];
                }
                if (output) this.sendReply('Previous names: ' + output);
            }
        }
        if (config.groups[targetUser.group] && config.groups[targetUser.group].name) {
            this.sendReply('Group: ' + config.groups[targetUser.group].name + ' (' + targetUser.group + ')');
        }
        if (targetUser.isSysop) {
            this.sendReply('(Pok\xE9mon Showdown System Operator)');
        }
        if (targetUser.goldDev) {
            this.sendReply('(Gold Development Staff)');
        }
        if (!targetUser.authenticated) {
            this.sendReply('(Unregistered)');
        }
        if (!this.broadcasting && (user.can('ip', targetUser) || user === targetUser)) {
            var ips = Object.keys(targetUser.ips);
            this.sendReply('IP' + ((ips.length > 1) ? 's' : '') + ': ' + ips.join(', '));
        }
        var output = 'In all rooms: ';
        var first = false;
        for (var i in targetUser.roomCount) {
            if (i === 'global' || Rooms.get(i).isPublic) continue;
            if (!first) output += ' | ';
            first = false;

            output += '<a href="/' + i + '" room="' + i + '">' + i + '</a>';
        }
        this.sendReply('|raw|' + output);
    },

    tiertest: function(target, room, user) {
        if (!this.canBroadcast()) return;
        var targetId = toId(target);
        var newTargets = Tools.dataSearch(target);
        if (newTargets && newTargets.length) {
            for (var i = 0; i < newTargets.length; i++) {
                var template = Tools.getTemplate(newTargets[i].species);
                return this.sendReplyBox("" + template.name + " is in the " + template.tier + " tier.");
            }
        } else {
            return this.sendReplyBox("No Pokemon named '" + target + "' was found.");
        }
    },


    aotdtest: function(target, room, user) {
        if (room.id !== 'thestudio') return this.sendReply("This command can only be used in The Studio.");
        if (!target) {
            if (!this.canBroadcast()) return;
            this.sendReplyBox("The current Artist of the Day is: <b>" + Tools.escapeHTML(room.aotd) + "</b>");
            return;
        }
        if (!this.canTalk()) return;
        if (target.length > 25) {
            return this.sendReply("This Artist\'s name is too long; it cannot exceed 25 characters.");
        }
        if (!this.can('ban', null, room)) return;
        room.aotd = target;
        Rooms.rooms.thestudio.addRaw(
            '<div class=\"broadcast-green\"><font size="2"><b>The Artist of the Day is now </font><b><font color="black" size="2">' + Tools.escapeHTML(target) + '</font></b><br />' +
            '(Set by ' + Tools.escapeHTML(user.name) + '.)<br />' +
            'This Artist will be posted on our <a href="http://thepsstudioroom.weebly.com/artist-of-the-day.html">Artist of the Day page</a>.</div>'
        );
        room.aotdOn = false;
        this.logModCommand("The Artist of the Day was changed to " + Tools.escapeHTML(target) + " by " + Tools.escapeHTML(user.name) + ".");
    },



    ipsearch: function(target, room, user) {
        if (!this.can('rangeban')) return;
        var atLeastOne = false;
        this.sendReply("Users with IP " + target + ":");
        for (var userid in Users.users) {
            var curUser = Users.users[userid];
            if (curUser.latestIp === target) {
                this.sendReply((curUser.connected ? " + " : "-") + " " + curUser.name);
                atLeastOne = true;
            }
        }
        if (!atLeastOne) this.sendReply("No results found.");

    },

    gdeclarered: 'gdeclare',
    gdeclaregreen: 'gdeclare',
    gdeclare: function(target, room, user, connection, cmd) {
        if (!target) return this.parse('/help gdeclare');
        if (!this.can('lockdown')) return false;

        var roomName = (room.isPrivate) ? 'a private room' : room.id;

        if (cmd === 'gdeclare') {
            for (var id in Rooms.rooms) {
                if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
            }
        }
        if (cmd === 'gdeclarered') {
            for (var id in Rooms.rooms) {
                if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
            }
        } else if (cmd === 'gdeclaregreen') {
            for (var id in Rooms.rooms) {
                if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
            }
        }
        this.logEntry(user.name + ' used /gdeclare');

    },

    declaregreen: 'declarered',
    declarered: function(target, room, user, connection, cmd) {
        if (!target) return this.parse('/help declare');
        if (!this.can('declare', null, room)) return false;

        if (!this.canTalk()) return;

        if (cmd === 'declarered') {
            this.add('|raw|<div class="broadcast-red"><b>' + target + '</b></div>');
        } else if (cmd === 'declaregreen') {
            this.add('|raw|<div class="broadcast-green"><b>' + target + '</b></div>');
        }
        this.logModCommand(user.name + ' declared ' + target);
    },

    declaregreen: 'declarered',
    declarered: function(target, room, user, connection, cmd) {
        if (!target) return this.parse('/help declare');
        if (!this.can('declare', null, room)) return false;

        if (!this.canTalk()) return;

        if (cmd === 'declarered') {
            this.add('|raw|<div class="broadcast-red"><b>' + target + '</b></div>');
        } else if (cmd === 'declaregreen') {
            this.add('|raw|<div class="broadcast-green"><b>' + target + '</b></div>');
        }
        this.logModCommand(user.name + ' declared ' + target);
    },
    golddeclare: function(target, room, user, connection, cmd) {
        if (!target) return this.parse('/help declare');
        if (!this.can('declare', null, room)) return false;
        if (!this.canTalk()) return;
        this.add('|raw|<div class="broadcast-gold"><b>' + target + '</b></div>');
        this.logModCommand(user.name + ' declared ' + target);
    },
    pdeclare: function(target, room, user, connection, cmd) {
        if (!target) return this.parse('/help declare');
        if (!this.can('declare', null, room)) return false;

        if (!this.canTalk()) return;

        if (cmd === 'pdeclare') {
            this.add('|raw|<div class="broadcast-purple"><b>' + target + '</b></div>');
        } else if (cmd === 'pdeclare') {
            this.add('|raw|<div class="broadcast-purple"><b>' + target + '</b></div>');
        }
        this.logModCommand(user.name + ' declared ' + target);
    },

    k: 'kick',
    aura: 'kick',
    kick: function(target, room, user) {
        if (!this.can('lock')) return false;
        if (!target) return this.sendReply('/help kick');
        if (!this.canTalk()) return false;

        target = this.splitTarget(target);
        var targetUser = this.targetUser;

        if (!targetUser || !targetUser.connected) {
            return this.sendReply('User ' + this.targetUsername + ' not found.');
        }

        if (!this.can('lock', targetUser, room)) return false;

        this.addModCommand(targetUser.name + ' was kicked from the room by ' + user.name + '.');

        targetUser.popup('You were kicked from ' + room.id + ' by ' + user.name + '.');

        targetUser.leaveRoom(room.id);
    },

    dm: 'daymute',
    daymute: function(target, room, user) {
        if (!target) return this.parse('/help daymute');
        if (!this.canTalk()) return false;

        target = this.splitTarget(target);
        var targetUser = this.targetUser;
        if (!targetUser) {
            return this.sendReply('User ' + this.targetUsername + ' not found.');
        }
        if (!this.can('mute', targetUser, room)) return false;

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
    forcelogout: function(target, room, user) {
        if (!user.can('hotpatch')) return;
        if (!this.canTalk()) return false;

        if (!target) return this.sendReply('/forcelogout [username], [reason] OR /flogout [username], [reason] - You do not have to add a reason');

        target = this.splitTarget(target);
        var targetUser = this.targetUser;

        if (!targetUser) {
            return this.sendReply('User ' + this.targetUsername + ' not found.');
        }

        if (targetUser.can('hotpatch')) return this.sendReply('You cannot force logout another Admin - nice try. Chump.');

        this.addModCommand('' + targetUser.name + ' was forcibly logged out by ' + user.name + '.' + (target ? " (" + target + ")" : ""));

        targetUser.resetName();
    },

    declaregreen: 'declarered',
    declarered: function(target, room, user, connection, cmd) {
        if (!target) return this.parse('/help declare');
        if (!this.can('declare', null, room)) return false;

        if (!this.canTalk()) return;

        if (cmd === 'declarered') {
            this.add('|raw|<div class="broadcast-red"><b>' + target + '</b></div>');
        } else if (cmd === 'declaregreen') {
            this.add('|raw|<div class="broadcast-green"><b>' + target + '</b></div>');
        }
        this.logModCommand(user.name + ' declared ' + target);
    },

    gdeclarered: 'gdeclare',
    gdeclaregreen: 'gdeclare',
    gdeclare: function(target, room, user, connection, cmd) {
        if (!target) return this.parse('/help gdeclare');
        if (!this.can('lockdown')) return false;

        var roomName = (room.isPrivate) ? 'a private room' : room.id;

        if (cmd === 'gdeclare') {
            for (var id in Rooms.rooms) {
                if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
            }
        }
        if (cmd === 'gdeclarered') {
            for (var id in Rooms.rooms) {
                if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
            }
        } else if (cmd === 'gdeclaregreen') {
            for (var id in Rooms.rooms) {
                if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
            }
        }
        this.logModCommand(user.name + ' globally declared ' + target);
    },
    sd: 'declaremod',
    staffdeclare: 'declaremod',
    modmsg: 'declaremod',
    moddeclare: 'declaremod',
    declaremod: function(target, room, user) {
        if (!target) return this.sendReply('/declaremod [message] - Also /moddeclare and /modmsg');
        if (!this.can('declare', null, room)) return false;

        if (!this.canTalk()) return;

        this.privateModCommand('|raw|<div class="broadcast-red"><b><font size=1><i>Private Auth (Driver +) declare from ' + user.name + '<br /></i></font size>' + target + '</b></div>');

        this.logModCommand(user.name + ' mod declared ' + target);
    },

    /*********************************************************
     * Shortcuts
     *********************************************************/

    invite: function(target, room, user) {
        target = this.splitTarget(target);
        if (!this.targetUser) {
            return this.sendReply("User " + this.targetUsername + " not found.");
        }
        var targetRoom = (target ? Rooms.search(target) : room);
        if (!targetRoom) {
            return this.sendReply("Room " + target + " not found.");
        }
        return this.parse('/msg ' + this.targetUsername + ', /invite ' + targetRoom.id);
    },

    /*********************************************************
     * Informational commands
     *********************************************************/
    /*randompokemon: function(target, room, user) {
        if (!this.canBroadcast()) return;
        var symbol = '/';
        if (this.broadcasting) symbol = '!';
        return this.parse(symbol + 'dt '+ (Math.floor(Math.random()*721)+1));
    }, */
    randp: 'data',
    randompokemon: 'data',
    pstats: 'data',
    stats: 'data',
    dex: 'data',
    pokedex: 'data',
    details: 'data',
    dt: 'data',
    data: function(target, room, user, connection, cmd) {
        if (!this.canBroadcast()) return;
        if (cmd === 'randompokemon' || cmd === 'randp') target = (Math.floor(Math.random() * 721) + 1);
        var buffer = '';
        var targetId = toId(target);
        if (targetId === '' + parseInt(targetId)) {
            for (var p in Tools.data.Pokedex) {
                var pokemon = Tools.getTemplate(p);
                if (pokemon.num === parseInt(target)) {
                    target = pokemon.species;
                    targetId = pokemon.id;
                    break;
                }
            }
        }
        var newTargets = Tools.dataSearch(target);
        var showDetails = (cmd === 'dt' || cmd === 'details');
        if (newTargets && newTargets.length) {
            for (var i = 0; i < newTargets.length; ++i) {
                if (newTargets[i].id !== targetId && !Tools.data.Aliases[targetId] && !i) {
                    buffer = "No Pokemon, item, move, ability or nature named '" + target + "' was found. Showing the data of '" + newTargets[0].name + "' instead.\n";
                }
                if (newTargets[i].searchType === 'nature') {
                    buffer += "" + newTargets[i].name + " nature: ";
                    if (newTargets[i].plus) {
                        var statNames = {
                            'atk': "Attack",
                            'def': "Defense",
                            'spa': "Special Attack",
                            'spd': "Special Defense",
                            'spe': "Speed"
                        };
                        buffer += "+10% " + statNames[newTargets[i].plus] + ", -10% " + statNames[newTargets[i].minus] + ".";
                    } else {
                        buffer += "No effect.";
                    }
                    return this.sendReply(buffer);
                } else {
                    buffer += '|c|~|/data-' + newTargets[i].searchType + ' ' + newTargets[i].name + '\n';
                }
            }
        } else {
            return this.sendReply("No Pokemon, item, move, ability or nature named '" + target + "' was found. (Check your spelling?)");
        }

        if (showDetails) {
            var details;
            if (newTargets[0].searchType === 'pokemon') {
                var pokemon = Tools.getTemplate(newTargets[0].name);
                var weighthit = 20;
                if (pokemon.weightkg >= 200) {
                    weighthit = 120;
                } else if (pokemon.weightkg >= 100) {
                    weighthit = 100;
                } else if (pokemon.weightkg >= 50) {
                    weighthit = 80;
                } else if (pokemon.weightkg >= 25) {
                    weighthit = 60;
                } else if (pokemon.weightkg >= 10) {
                    weighthit = 40;
                }
                details = {
                    "Dex#": pokemon.num,
                    "Height": pokemon.heightm + " m",
                    "Weight": pokemon.weightkg + " kg <em>(" + weighthit + " BP)</em>",
                    "Dex Colour": pokemon.color,
                    "Egg Group(s)": pokemon.eggGroups.join(", ")
                };
                if (!pokemon.evos.length) {

                    details["<font color=#585858>Does Not Evolve</font>"] = ""; // this line exists on main
                } else {
                    details["Evolution"] = pokemon.evos.map(function(evo) {
                        evo = Tools.getTemplate(evo);
                        return evo.name + " (" + evo.evoLevel + ")";
                    }).join(", ");
                }
            } else if (newTargets[0].searchType === 'move') {
                var move = Tools.getMove(newTargets[0].name);
                details = {
                    "Priority": move.priority
                };

                if (move.secondary || move.secondaries) details["<font color=black>&#10003; Secondary Effect</font>"] = "";
                if (move.isContact) details["<font color=black>&#10003; Contact</font>"] = "";
                if (move.isSoundBased) details["<font color=black>&#10003; Sound</font>"] = "";
                if (move.isBullet) details["<font color=black>&#10003; Bullet</font>"] = "";
                if (move.isPulseMove) details["<font color=black>&#10003; Pulse</font>"] = "";

                details["Target"] = {
                    'normal': "Adjacent Pokemon",
                    'self': "Self",
                    'adjacentAlly': "Single Ally",
                    'allAdjacentFoes': "Adjacent Foes",
                    'foeSide': "All Foes",
                    'allySide': "All Allies",
                    'allAdjacent': "All Adjacent Pokemon",
                    'any': "Any Pokemon",
                    'all': "All Pokemon"
                }[move.target] || "Unknown";
            } else if (newTargets[0].searchType === 'item') {
                var item = Tools.getItem(newTargets[0].name);
                details = {};
                if (item.fling) {
                    details["Fling Base Power"] = item.fling.basePower;
                    if (item.fling.status) details["Fling Effect"] = item.fling.status;
                    if (item.fling.volatileStatus) details["Fling Effect"] = item.fling.volatileStatus;
                    if (item.isBerry) details["Fling Effect"] = "Activates effect of berry on target.";
                    if (item.id === 'whiteherb') details["Fling Effect"] = "Removes all negative stat levels on the target.";
                    if (item.id === 'mentalherb') details["Fling Effect"] = "Removes the effects of infatuation, Taunt, Encore, Torment, Disable, and Cursed Body on the target.";
                }
                if (!item.fling) details["Fling"] = "This item cannot be used with Fling";
                if (item.naturalGift) {
                    details["Natural Gift Type"] = item.naturalGift.type;
                    details["Natural Gift BP"] = item.naturalGift.basePower;
                }
            } else {
                details = {};
            }

            buffer += '|raw|<font size="1">' + Object.keys(details).map(function(detail) {
                return '<font color=#585858>' + detail + (details[detail] !== '' ? ':</font> ' + details[detail] : '</font>');
            }).join("&nbsp;|&ThickSpace;") + '</font>';
        }
        this.sendReply(buffer);
    },

    ds: 'dexsearch',
    dsearch: 'dexsearch',
    dexsearch: function(target, room, user) {
        if (!this.canBroadcast()) return;

        if (!target) return this.parse('/help dexsearch');
        var targets = target.split(',');
        var searches = {};
        var allTiers = {
            'uber': 1,
            'ou': 1,
            'uu': 1,
            'lc': 1,
            'cap': 1,
            'bl': 1,
            'bl2': 1,
            'ru': 1,
            'bl3': 1,
            'nu': 1,
            'pu': 1,
            'nfe': 1
        };
        var allColours = {
            'green': 1,
            'red': 1,
            'blue': 1,
            'white': 1,
            'brown': 1,
            'yellow': 1,
            'purple': 1,
            'pink': 1,
            'gray': 1,
            'black': 1
        };
        var showAll = false;
        var megaSearch = null;
        var recoverySearch = null;
        var output = 10;

        for (var i in targets) {
            var isNotSearch = false;
            target = targets[i].trim().toLowerCase();
            if (target.slice(0, 1) === '!') {
                isNotSearch = true;
                target = target.slice(1);
            }

            var targetAbility = Tools.getAbility(targets[i]);
            if (targetAbility.exists) {
                if (!searches['ability']) searches['ability'] = {};
                if (Object.count(searches['ability'], true) === 1 && !isNotSearch) return this.sendReplyBox("Specify only one ability.");
                if ((searches['ability'][targetAbility.name] && isNotSearch) || (searches['ability'][targetAbility.name] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include an ability.");
                searches['ability'][targetAbility.name] = !isNotSearch;
                continue;
            }

            if (target in allTiers) {
                if (!searches['tier']) searches['tier'] = {};
                if ((searches['tier'][target] && isNotSearch) || (searches['tier'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a tier.');
                searches['tier'][target] = !isNotSearch;
                continue;
            }

            if (target in allColours) {
                if (!searches['color']) searches['color'] = {};
                if ((searches['color'][target] && isNotSearch) || (searches['color'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a color.');
                searches['color'][target] = !isNotSearch;
                continue;
            }

            var targetInt = parseInt(target);
            if (0 < targetInt && targetInt < 7) {
                if (!searches['gen']) searches['gen'] = {};
                if ((searches['gen'][target] && isNotSearch) || (searches['gen'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a generation.');
                searches['gen'][target] = !isNotSearch;
                continue;
            }

            if (target === 'all') {
                if (this.broadcasting) {
                    return this.sendReplyBox("A search with the parameter 'all' cannot be broadcast.");
                }
                showAll = true;
                continue;
            }

            if (target === 'megas' || target === 'mega') {
                if ((megaSearch && isNotSearch) || (megaSearch === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include Mega Evolutions.');
                megaSearch = !isNotSearch;
                continue;
            }

            if (target === 'recovery') {
                if ((recoverySearch && isNotSearch) || (recoverySearch === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and recovery moves.');
                if (!searches['recovery']) searches['recovery'] = {};
                recoverySearch = !isNotSearch;
                continue;
            }

            var targetMove = Tools.getMove(target);
            if (targetMove.exists) {
                if (!searches['moves']) searches['moves'] = {};
                if (Object.count(searches['moves'], true) === 4 && !isNotSearch) return this.sendReplyBox("Specify a maximum of 4 moves.");
                if ((searches['moves'][targetMove.name] && isNotSearch) || (searches['moves'][targetMove.name] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include a move.");
                searches['moves'][targetMove.name] = !isNotSearch;
                continue;
            }

            if (target.indexOf(' type') > -1) {
                target = target.charAt(0).toUpperCase() + target.slice(1, target.indexOf(' type'));
                if (target in Tools.data.TypeChart) {
                    if (!searches['types']) searches['types'] = {};
                    if (Object.count(searches['types'], true) === 2 && !isNotSearch) return this.sendReplyBox("Specify a maximum of two types.");
                    if ((searches['types'][target] && isNotSearch) || (searches['types'][target] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include a type.");
                    searches['types'][target] = !isNotSearch;
                    continue;
                }
            }
            return this.sendReplyBox("'" + Tools.escapeHTML(target) + "' could not be found in any of the search categories.");
        }

        if (showAll && Object.size(searches) === 0 && megaSearch === null) return this.sendReplyBox("No search parameters other than 'all' were found. Try '/help dexsearch' for more information on this command.");

        var dex = {};
        for (var pokemon in Tools.data.Pokedex) {
            var template = Tools.getTemplate(pokemon);
            var megaSearchResult = (megaSearch === null || (megaSearch === true && template.isMega) || (megaSearch === false && !template.isMega));
            if (template.tier !== 'Unreleased' && template.tier !== 'Illegal' && (template.tier !== 'CAP' || (searches['tier'] && searches['tier']['cap'])) &&
                megaSearchResult) {
                dex[pokemon] = template;
            }
        }

        for (var search in {
                'moves': 1,
                'recovery': 1,
                'types': 1,
                'ability': 1,
                'tier': 1,
                'gen': 1,
                'color': 1
            }) {
            if (!searches[search]) continue;
            switch (search) {
                case 'types':
                    for (var mon in dex) {
                        if (Object.count(searches[search], true) === 2) {
                            if (!(searches[search][dex[mon].types[0]]) || !(searches[search][dex[mon].types[1]])) delete dex[mon];
                        } else {
                            if (searches[search][dex[mon].types[0]] === false || searches[search][dex[mon].types[1]] === false || (Object.count(searches[search], true) > 0 &&
                                    (!(searches[search][dex[mon].types[0]]) && !(searches[search][dex[mon].types[1]])))) delete dex[mon];
                        }
                    }
                    break;

                case 'tier':
                    for (var mon in dex) {
                        if ('lc' in searches[search]) {
                            // some LC legal Pokemon are stored in other tiers (Ferroseed/Murkrow etc)
                            // this checks for LC legality using the going criteria, instead of dex[mon].tier
                            var isLC = (dex[mon].evos && dex[mon].evos.length > 0) && !dex[mon].prevo && Tools.data.Formats['lc'].banlist.indexOf(dex[mon].species) === -1;
                            if ((searches[search]['lc'] && !isLC) || (!searches[search]['lc'] && isLC)) {
                                delete dex[mon];
                                continue;
                            }
                        }
                        if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
                            delete dex[mon];
                        } else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];
                    }
                    break;

                case 'gen':
                case 'color':
                    for (var mon in dex) {
                        if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
                            delete dex[mon];
                        } else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];
                    }
                    break;

                case 'ability':
                    for (var mon in dex) {
                        for (var ability in searches[search]) {
                            var needsAbility = searches[search][ability];
                            var hasAbility = Object.count(dex[mon].abilities, ability) > 0;
                            if (hasAbility !== needsAbility) {
                                delete dex[mon];
                                break;
                            }
                        }
                    }
                    break;

                case 'moves':
                    for (var mon in dex) {
                        var template = Tools.getTemplate(dex[mon].id);
                        if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
                        if (!template.learnset) continue;
                        for (var i in searches[search]) {
                            var move = Tools.getMove(i);
                            if (!move.exists) return this.sendReplyBox("'" + move + "' is not a known move.");
                            var prevoTemp = Tools.getTemplate(template.id);
                            while (prevoTemp.prevo && prevoTemp.learnset && !(prevoTemp.learnset[move.id])) {
                                prevoTemp = Tools.getTemplate(prevoTemp.prevo);
                            }
                            var canLearn = (prevoTemp.learnset.sketch && !(move.id in {
                                'chatter': 1,
                                'struggle': 1,
                                'magikarpsrevenge': 1
                            })) || prevoTemp.learnset[move.id];
                            if ((!canLearn && searches[search][i]) || (searches[search][i] === false && canLearn)) delete dex[mon];
                        }
                    }
                    break;

                case 'recovery':
                    for (var mon in dex) {
                        var template = Tools.getTemplate(dex[mon].id);
                        if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
                        if (!template.learnset) continue;
                        var recoveryMoves = ["recover", "roost", "moonlight", "morningsun", "synthesis", "milkdrink", "slackoff", "softboiled", "wish", "healorder"];
                        var canLearn = false;
                        for (var i = 0; i < recoveryMoves.length; i++) {
                            var prevoTemp = Tools.getTemplate(template.id);
                            while (prevoTemp.prevo && prevoTemp.learnset && !(prevoTemp.learnset[recoveryMoves[i]])) {
                                prevoTemp = Tools.getTemplate(prevoTemp.prevo);
                            }
                            canLearn = (prevoTemp.learnset.sketch) || prevoTemp.learnset[recoveryMoves[i]];
                            if (canLearn) break;
                        }
                        if ((!canLearn && searches[search]) || (searches[search] === false && canLearn)) delete dex[mon];
                    }
                    break;

                default:
                    return this.sendReplyBox("Something broke! PM TalkTakesTime here or on the Smogon forums with the command you tried.");
            }
        }

        var results = Object.keys(dex).map(function(speciesid) {
            return dex[speciesid].species;
        });
        results = results.filter(function(species) {
            var template = Tools.getTemplate(species);
            return !(species !== template.baseSpecies && results.indexOf(template.baseSpecies) > -1);
        });
        var resultsStr = "";
        if (results.length > 0) {
            if (showAll || results.length <= output) {
                results.sort();
                resultsStr = results.join(", ");
            } else {
                results.randomize();
                resultsStr = results.slice(0, 10).join(", ") + ", and " + string(results.length - output) + " more. Redo the search with 'all' as a search parameter to show all results.";
            }
        } else {
            resultsStr = "No Pokémon found.";
        }
        return this.sendReplyBox(resultsStr);
    },

    learnset: 'learn',
    learnall: 'learn',
    learn5: 'learn',
    g6learn: 'learn',
    learn: function(target, room, user, connection, cmd) {
        if (!target) return this.parse('/help learn');

        if (!this.canBroadcast()) return;

        var lsetData = {
            set: {}
        };
        var targets = target.split(',');
        var template = Tools.getTemplate(targets[0]);
        var move = {};
        var problem;
        var all = (cmd === 'learnall');
        if (cmd === 'learn5') lsetData.set.level = 5;
        if (cmd === 'g6learn') lsetData.format = {
            noPokebank: true
        };

        if (!template.exists) {
            return this.sendReply("Pokemon '" + template.id + "' not found.");
        }

        if (targets.length < 2) {
            return this.sendReply("You must specify at least one move.");
        }
        for (var i = 1, len = targets.length; i < len; ++i) {
            move = Tools.getMove(targets[i]);
            if (!move.exists) {
                return this.sendReply("Move '" + move.id + "' not found.");
            }
            problem = TeamValidator.checkLearnsetSync(null, move, template, lsetData);
            if (problem) break;
        }
        var buffer = template.name + (problem ? " <span class=\"message-learn-cannotlearn\">can't</span> learn " : " <span class=\"message-learn-canlearn\">can</span> learn ") + (targets.length > 2 ? "these moves" : move.name);
        if (!problem) {
            var sourceNames = {
                E: "egg",
                S: "event",
                D: "dream world"
            };
            if (lsetData.sources || lsetData.sourcesBefore) buffer += " only when obtained from:<ul class=\"message-learn-list\">";
            if (lsetData.sources) {
                var sources = lsetData.sources.sort();
                var prevSource;
                var prevSourceType;
                var prevSourceCount = 0;
                for (var i = 0, len = sources.length; i < len; ++i) {
                    var source = sources[i];
                    if (source.substr(0, 2) === prevSourceType) {
                        if (prevSourceCount < 0) {
                            buffer += ": " + source.substr(2);
                        } else if (all || prevSourceCount < 3) {
                            buffer += ", " + source.substr(2);
                        } else if (prevSourceCount === 3) {
                            buffer += ", ...";
                        }
                        ++prevSourceCount;
                        continue;
                    }
                    prevSourceType = source.substr(0, 2);
                    prevSourceCount = source.substr(2) ? 0 : -1;
                    buffer += "<li>gen " + source.substr(0, 1) + " " + sourceNames[source.substr(1, 1)];
                    if (prevSourceType === '5E' && template.maleOnlyHidden) buffer += " (cannot have hidden ability)";
                    if (source.substr(2)) buffer += ": " + source.substr(2);
                }
            }
            if (lsetData.sourcesBefore) buffer += "<li>any generation before " + (lsetData.sourcesBefore + 1);
            buffer += "</ul>";
        }
        this.sendReplyBox(buffer);
    },

    weak: 'weakness',
    resist: 'weakness',
    weakness: function(target, room, user) {
        if (!this.canBroadcast()) return;
        var targets = target.split(/[ ,\/]/);

        var pokemon = Tools.getTemplate(target);
        var type1 = Tools.getType(targets[0]);
        var type2 = Tools.getType(targets[1]);

        if (pokemon.exists) {
            target = pokemon.species;
        } else if (type1.exists && type2.exists) {
            pokemon = {
                types: [type1.id, type2.id]
            };
            target = type1.id + "/" + type2.id;
        } else if (type1.exists) {
            pokemon = {
                types: [type1.id]
            };
            target = type1.id;
        } else {
            return this.sendReplyBox("" + Tools.escapeHTML(target) + " isn't a recognized type or pokemon.");
        }

        var weaknesses = [];
        var resistances = [];
        var immunities = [];
        Object.keys(Tools.data.TypeChart).forEach(function(type) {
            var notImmune = Tools.getImmunity(type, pokemon);
            if (notImmune) {
                var typeMod = Tools.getEffectiveness(type, pokemon);
                switch (typeMod) {
                    case 1:
                        weaknesses.push(type);
                        break;
                    case 2:
                        weaknesses.push("<b>" + type + "</b>");
                        break;
                    case -1:
                        resistances.push(type);
                        break;
                    case -2:
                        resistances.push("<b>" + type + "</b>");
                        break;
                }
            } else {
                immunities.push(type);
            }
        });

        var buffer = [];
        buffer.push(pokemon.exists ? "" + target + ' (ignoring abilities):' : '' + target + ':');
        buffer.push('<span class=\"message-effect-weak\">Weaknesses</span>: ' + (weaknesses.join(', ') || 'None'));
        buffer.push('<span class=\"message-effect-resist\">Resistances</span>: ' + (resistances.join(', ') || 'None'));
        buffer.push('<span class=\"message-effect-immune\">Immunities</span>: ' + (immunities.join(', ') || 'None'));
        this.sendReplyBox(buffer.join('<br>'));
    },

    eff: 'effectiveness',
    type: 'effectiveness',
    matchup: 'effectiveness',
    effectiveness: function(target, room, user) {
        var targets = target.split(/[,/]/).slice(0, 2);
        if (targets.length !== 2) return this.sendReply("Attacker and defender must be separated with a comma.");

        var searchMethods = {
            'getType': 1,
            'getMove': 1,
            'getTemplate': 1
        };
        var sourceMethods = {
            'getType': 1,
            'getMove': 1
        };
        var targetMethods = {
            'getType': 1,
            'getTemplate': 1
        };
        var source;
        var defender;
        var foundData;
        var atkName;
        var defName;
        for (var i = 0; i < 2; ++i) {
            var method;
            for (method in searchMethods) {
                foundData = Tools[method](targets[i]);
                if (foundData.exists) break;
            }
            if (!foundData.exists) return this.parse('/help effectiveness');
            if (!source && method in sourceMethods) {
                if (foundData.type) {
                    source = foundData;
                    atkName = foundData.name;
                } else {
                    source = foundData.id;
                    atkName = foundData.id;
                }
                searchMethods = targetMethods;
            } else if (!defender && method in targetMethods) {
                if (foundData.types) {
                    defender = foundData;
                    defName = foundData.species + " (not counting abilities)";
                } else {
                    defender = {
                        types: [foundData.id]
                    };
                    defName = foundData.id;
                }
                searchMethods = sourceMethods;
            }
        }

        if (!this.canBroadcast()) return;

        var factor = 0;
        if (Tools.getImmunity(source.type || source, defender)) {
            var totalTypeMod = 0;
            if (source.effectType !== 'Move' || source.basePower || source.basePowerCallback) {
                for (var i = 0; i < defender.types.length; i++) {
                    var baseMod = Tools.getEffectiveness(source, defender.types[i]);
                    var moveMod = source.onEffectiveness && source.onEffectiveness.call(Tools, baseMod, defender.types[i], source);
                    totalTypeMod += typeof moveMod === 'number' ? moveMod : baseMod;
                }
            }
            factor = Math.pow(2, totalTypeMod);
        }

        this.sendReplyBox("" + atkName + " is " + factor + "x effective against " + defName + ".");
    },

    uptime: (function() {
        function formatUptime(uptime) {
            if (uptime > 24 * 60 * 60) {
                var uptimeText = "";
                var uptimeDays = Math.floor(uptime / (24 * 60 * 60));
                uptimeText = uptimeDays + " " + (uptimeDays == 1 ? "day" : "days");
                var uptimeHours = Math.floor(uptime / (60 * 60)) - uptimeDays * 24;
                if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours == 1 ? "hour" : "hours");
                return uptimeText;
            } else {
                return uptime.seconds().duration();
            }
        }
        return function(target, room, user) {
            if (!this.canBroadcast()) return;
            var uptime = process.uptime();
            this.sendReplyBox("Uptime: <b>" + formatUptime(uptime) + "</b>" + (global.uptimeRecord ? "<br /><font color=\"green\">Record: <b>" + formatUptime(global.uptimeRecord) + "</b></font>" : ""));
        };
    })(),

    cpgtan: function(target, room, user) {
        if (room.id !== 'cpg') return this.sendReply("The command '/cpgtan' was unrecognized. To send a message starting with '/cpgtan', type '//cpgtan'.");
        if (!this.can('modchat', null, room)) return;
        target = this.splitTarget(target);
        if (!this.targetUser) return this.sendReply("User not found");
        if (!room.users[this.targetUser.userid]) return this.sendReply("Not a cpger");
        this.targetUser.avatar = '#cpgtan';
        room.add("" + user.name + " applied cpgtan to affected area of " + this.targetUser.name);
    },


    groups: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox(
            "+ <b>Voice</b> - They can use ! commands like !groups, and talk during moderated chat<br />" +
            "% <b>Driver</b> - The above, and they can mute. Global % can also lock users and check for alts<br />" +
            "@ <b>Moderator</b> - The above, and they can ban users<br />" +
            "& <b>Leader</b> - The above, and they can promote to moderator and force ties<br />" +
            "# <b>Room Owner</b> - They are leaders of the room and can almost totally control it<br />" +
            "~ <b>Administrator</b> - They can do anything, like change what this message says"
        );
    },

    goldstaff: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('The staff forums can be found <a href="https://groups.google.com/forum/#!forum/gold-staff">here</a>.');
    },

    whosgotthemoneyz: 'richestuser',
    richestuser: function(target, room, user) {
        if (!this.canBroadcast()) return;
        var data = fs.readFileSync('config/money.csv', 'utf8');
        var row = ('' + data).split("\n");
        var userids = {
            id: [],
            money: []
        };
        var highest = {
            id: [],
            money: []
        };
        var size = 0;
        var amounts = [];
        for (var i = row.length; i > -1; i--) {
            if (!row[i]) continue;
            var parts = row[i].split(",");
            userids.id[i] = parts[0];
            userids.money[i] = Number(parts[1]);
            size++;
            if (isNaN(parts[1]) || parts[1] === 'Infinity') userids.money[i] = 0;
        }
        for (var i = 0; i < 10; i++) {
            var tempHighest = 0;
            for (var x = 0; x < size; x++) {
                if (userids.money[x] > tempHighest) tempHighest = userids.money[x];
            }
            for (var x = 0; x < size; x++) {
                var found = false;
                if (userids.money[x] === tempHighest && !found) {
                    highest.id[i] = userids.id[x];
                    highest.money[i] = userids.money[x];
                    userids.id[x];
                    userids.money[x] = 0;
                    found = true;
                }
            }
        }
        return this.sendReplyBox('<b>The richest users are:</b>' +
            '<br>1. ' + highest.id[0] + ': ' + highest.money[0] +
            '<br>2. ' + highest.id[1] + ': ' + highest.money[1] +
            '<br>3. ' + highest.id[2] + ': ' + highest.money[2] +
            '<br>4. ' + highest.id[3] + ': ' + highest.money[3] +
            '<br>5. ' + highest.id[4] + ': ' + highest.money[4] +
            '<br>6. ' + highest.id[5] + ': ' + highest.money[5] +
            '<br>7. ' + highest.id[6] + ': ' + highest.money[6] +
            '<br>8. ' + highest.id[7] + ': ' + highest.money[7] +
            '<br>9. ' + highest.id[8] + ': ' + highest.money[8] +
            '<br>10. ' + highest.id[9] + ': ' + highest.money[9]);
    },

    pus: 'pmupperstaff',
    pmupperstaff: function(target, room, user) {
        if (!target) return this.sendReply('/pmupperstaff [message] - Sends a PM to every upper staff');
        if (!this.can('pban')) return false;
        for (var u in Users.users) {
            if (Users.users[u].group == '~' || Users.users[u].group == '&') {
                Users.users[u].send('|pm|~Upper Staff PM|' + Users.users[u].group + Users.users[u].name + '| ' + target + ' (PM from ' + user.name + ')');
            }
        }
    },

    staff: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox("<a href=\"https://www.smogon.com/sim/staff_list\">Pokemon Showdown Staff List</a>");
    },

    avatars: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox("Your avatar can be changed using the Options menu (it looks like a gear) in the upper right of Pokemon Showdown. Custom avatars are only obtainable by staff.");
    },

    git: 'opensource',
    opensource: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Pokemon Showdown is open source:<br />- Language: JavaScript (Node.js)<br />' +
            '- <a href="https://github.com/Zarel/Pokemon-Showdown" target="_blank">Pokemon Showdown Source Code / How to create a PS server</a><br />' +
            '- <a href="https://github.com/Zarel/Pokemon-Showdown-Client" target="_blank">Client Source Code</a><br />' +
            '- <a href="https://github.com/panpawn/Pokemon-Showdown">Gold Source Code</a>');
    },
    events: 'activities',
    activities: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><font size="3" face="comic sans ms">Gold Activities:</font></center></br>' +
            '★ <b>Tournaments</b> - Here on Gold, we have a tournaments script that allows users to partake in several different tiers.  For a list of tour commands do /th.  Ask in the lobby for a voice (+) or up to start one of these if you\'re interesrted!<br>' +
            '★ <b>Hangmans</b> - We have a hangans script that allows users to  partake in a "hangmans" sort of a game.  For a list of hangmans commands, do /hh.  As a voice (+) or up in the lobby to start one of these if interested.<br>' +
            '★ <b>Leagues</b> - If you click the "join room page" to the upper right (+), it will display a list of rooms we have.  Several of these rooms are 3rd party leagues of Gold; join them to learn more about each one!<br>' +
            '★ <b>Battle</b> - By all means, invite your friends on here so that you can battle with each other!  Here on Gold, we are always up to date on our formats, so we\'re a great place to battle on!<br>' +
            '★ <b>Chat</b> - Gold is full of great people in it\'s community and we\'d love to have you be apart of it!<br>' +
            '★ <b>Learn</b> - Are you new to Pokemon?  If so, then feel FREE to ask the lobby any questions you might have!<br>' +
            '★ <b>Shop</b> - Do /shop to learn about where your Gold Bucks can go! <br>' +
            '★ <b>Plug.dj</b> - Come listen to music with us! Click <a href="http://plug.dj/gold-server/">here</a> to start!<br>' +
            '<i>--PM staff (%, @, &, ~) any questions you might have!</i>');
    },

    showtan: function(target, room, user) {
        if (room.id !== 'showderp') return this.sendReply("The command '/showtan' was unrecognized. To send a message starting with '/showtan', type '//showtan'.");
        if (!this.can('modchat', null, room)) return;
        target = this.splitTarget(target);
        if (!this.targetUser) return this.sendReply('user not found');
        if (!room.users[this.targetUser.userid]) return this.sendReply('not a showderper');
        this.targetUser.avatar = '#showtan';
        room.add(user.name + ' applied showtan to affected area of ' + this.targetUser.name);
    },

    introduction: 'intro',
    intro: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox(
            "New to competitive pokemon?<br />" +
            "- <a href=\"https://www.smogon.com/sim/ps_guide\">Beginner's Guide to Pokémon Showdown</a><br />" +
            "- <a href=\"https://www.smogon.com/dp/articles/intro_comp_pokemon\">An introduction to competitive Pokémon</a><br />" +
            "- <a href=\"https://www.smogon.com/bw/articles/bw_tiers\">What do 'OU', 'UU', etc mean?</a><br />" +
            "- <a href=\"https://www.smogon.com/xyhub/tiers\">What are the rules for each format? What is 'Sleep Clause'?</a>"
        );
    },

    support: 'donate',
    donate: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox(
            "<center>Like this server and want to keep it going?  If so, you can make a paypal donation to Gold!  You can choose the amount.<br />" +
            '<hr width="85%">' +
            "- Donations will help Gold to upgrade the VPS so we can do more and hold more users!<br />" +
            "- For donations <b>$5 or over</b>, you can get: 200 bucks, a custom avatar, a custom trainer card, a custom symbol, and a custom music box!<br />" +
            "- For donations <b>$10 and over</b>, it will get you: (the above), 600 bucks (in addition to the above 200, making 800 total) and VIP status along with a VIP badge!<br />" +
            "- Refer to the /shop command for a more detailed description of these prizes.  After donating, PM panpawn.<br />" +
            '<hr width="85%">' +
            "Click the button below to donate!<br />" +
            '<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=FBZBA7MJNMG7J&lc=US&item_name=Gold%20Server&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" title=Donate now!">'
        );
    },

    vip: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Information about what a VIP user is can be found <a href="http://goldserver.weebly.com/vip.html">here</a>.');
    },

    links: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox(
            "<div class=\"broadcast-black\">Here are some helpful server related links:<b><br />" +
            "- <a href=\"http://goldserver.weebly.com/rules.html\"><font color=\"#FF0066\">Rules</a></font><br />" +
            "- <a href=\"http://w11.zetaboards.com/Goldserverps/index/\"><font color=\"#FF00\">Forums</a></font><br />" +
            "- <a href=\"http://goldserver.weebly.com\"><font color=\"#56600FF\">Website</a></font><br />" +
            "- <a href=\"http://plug.dj/gold-server/\"><font color=\"#FFFF\">Plug.dj</a></font><br />" +
            "- <a href=\"https://github.com/panpawn/Pokemon-Showdown\"><font color=\"#39FF14\">GitHub</a></font><br />" +
            "- <a href=\"http://goldserver.weebly.com/news.html\"><font color=\"#BFFF00\">News</a></font><br />" +
            "- <a href=\"http://goldserver.weebly.com/faqs.html\"><font color=\"#DA9D01\">FAQs</a></font><br />" +
            "- <a href=\"http://goldserver.weebly.com/discipline-appeals.html\"><font color=\"#12C418\">Discipline Appeals</a></font>" +
            "</b></div>"
        );
    },

    om: 'othermetas',
    othermetas: function(target, room, user) {
        if (!this.canBroadcast()) return;
        target = toId(target);
        var buffer = "";
        var matched = false;
        if (!target) {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/forums/206/\">Other Metagames Forum</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3505031/\">Other Metagames Index</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3507466/\">Sample teams for entering Other Metagames</a><br />";
        }
        if (target === 'smogondoublesuu' || target === 'doublesuu') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516968/\">Doubles UU</a><br />";
        }
        if (target === 'smogontriples' || target === 'triples') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3511522/\">Smogon Triples</a><br />";
        }
        if (target === 'omofthemonth' || target === 'omotm' || target === 'month') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3481155/\">OM of the Month</a><br />";
        }
        if (target === 'seasonal') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a><br />";
        }
        if (target === 'balancedhackmons' || target === 'bh') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3489849/\">Balanced Hackmons</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3515725/\">Balanced Hackmons Suspect Discussion</a><br />";
        }
        if (target === '1v1') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496773/\">1v1</a><br />";
        }
        if (target === 'monotype') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493087/\">Monotype</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3517737/\">Monotype Viability Rankings</a><br />";
        }
        if (target === 'tiershift' || target === 'ts') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3508369/\">Tier Shift</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3514386/\">Tier Shift Viability Rankings</a><br />";
        }
        if (target === 'pu') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3513882/\">PU</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3517353/\">PU Viability Rankings</a><br />";
        }
        if (target === 'inversebattle' || target === 'inverse') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3518146/\">Inverse Battle</a><br />";
        }
        if (target === 'almostanyability' || target === 'aaa') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3517022/\">Almost Any Ability</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3508794/\">Almost Any Ability Viability Rankings</a><br />";
        }
        if (target === 'stabmons') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493081/\">STABmons</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3512215/\">STABmons Viability Rankings</a><br />";
        }
        if (target === 'lcuu') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516967/\">LC UU</a><br />";
        }
        if (target === '350cup') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3512945/\">350 Cup</a><br />";
        }
        if (target === 'averagemons') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3495527/\">Averagemons</a><br />";
        }
        if (target === 'hackmons' || target === 'purehackmons' || target === 'classichackmons') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3500418/\">Hackmons</a><br />";
        }
        if (target === 'hiddentype') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516349/\">Hidden Type</a><br />";
        }
        if (target === 'middlecup' || target === 'mc') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3494887/\">Middle Cup</a><br />";
        }
        if (target === 'skybattle') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493601/\">Sky Battle</a><br />";
        }
        if (!matched) {
            return this.sendReply("The Other Metas entry '" + target + "' was not found. Try /othermetas or /om for general help.");
        }
        this.sendReplyBox(buffer);
    },


    roomhelp: function(target, room, user) {
        if (room.id === 'lobby' || room.battle) return this.sendReply("This command is too spammy for lobby/battles.");
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Room drivers (%) can use:<br />' +
            '- /warn OR /k <em>username</em>: warn a user and show the Pokemon Showdown rules<br />' +
            '- /mute OR /m <em>username</em>: 7 minute mute<br />' +
            '- /hourmute OR /hm <em>username</em>: 60 minute mute<br />' +
            '- /unmute <em>username</em>: unmute<br />' +
            '- /announce OR /wall <em>message</em>: make an announcement<br />' +
            '- /modlog <em>username</em>: search the moderator log of the room<br />' +
            '<br />' +
            'Room moderators (@) can also use:<br />' +
            '- /roomban OR /rb <em>username</em>: bans user from the room<br />' +
            '- /roomunban <em>username</em>: unbans user from the room<br />' +
            '- /roomvoice <em>username</em>: appoint a room voice<br />' +
            '- /roomdevoice <em>username</em>: remove a room voice<br />' +
            '- /modchat <em>[off/autoconfirmed/+]</em>: set modchat level<br />' +
            '<br />' +
            'Room owners (#) can also use:<br />' +
            '- /roomdesc <em>description</em>: set the room description on the room join page<br />' +
            '- /rules <em>rules link</em>: set the room rules link seen when using /rules<br />' +
            '- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver<br />' +
            '- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver<br />' +
            '- /modchat <em>[%/@/#]</em>: set modchat level<br />' +
            '- /declare <em>message</em>: make a room declaration<br /><br>' +
            'The room founder can also use:<br />' +
            '- /roomowner <em>username</em><br />' +
            '- /roomdeowner <em>username</em><br />' +
            '</div>');
    },

    restarthelp: function(target, room, user) {
        if (room.id === 'lobby' && !this.can('lockdown')) return false;
        if (!this.canBroadcast()) return;
        this.sendReplyBox('The server is restarting. Things to know:<br />' +
            '- We wait a few minutes before restarting so people can finish up their battles<br />' +
            '- The restart itself will take a few seconds<br />' +
            '- Your ladder ranking and teams will not change<br />' +
            '- We are restarting to update Gold to a newer version' +
            '</div>');
    },



    mentoring: 'smogintro',
    smogonintro: 'smogintro',
    smogintro: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox(
            "Welcome to Smogon's official simulator! Here are some useful links to <a href=\"https://www.smogon.com/mentorship/\">Smogon\'s Mentorship Program</a> to help you get integrated into the community:<br />" +
            "- <a href=\"https://www.smogon.com/mentorship/primer\">Smogon Primer: A brief introduction to Smogon's subcommunities</a><br />" +
            "- <a href=\"https://www.smogon.com/mentorship/introductions\">Introduce yourself to Smogon!</a><br />" +
            "- <a href=\"https://www.smogon.com/mentorship/profiles\">Profiles of current Smogon Mentors</a><br />" +
            "- <a href=\"http://mibbit.com/#mentor@irc.synirc.net\">#mentor: the Smogon Mentorship IRC channel</a>"
        );
    },

    calculator: 'calc',
    calc: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox(
            "Pokemon Showdown! damage calculator. (Courtesy of Honko)<br />" +
            "- <a href=\"https://pokemonshowdown.com/damagecalc/\">Damage Calculator</a>"
        );
    },

    cap: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox(
            "An introduction to the Create-A-Pokemon project:<br />" +
            "- <a href=\"https://www.smogon.com/cap/\">CAP project website and description</a><br />" +
            "- <a href=\"https://www.smogon.com/forums/showthread.php?t=48782\">What Pokemon have been made?</a><br />" +
            "- <a href=\"https://www.smogon.com/forums/showthread.php?t=3464513\">Talk about the metagame here</a><br />" +
            "- <a href=\"https://www.smogon.com/forums/showthread.php?t=3466826\">Practice BW CAP teams</a>"
        );
    },

    gennext: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox(
            "NEXT (also called Gen-NEXT) is a mod that makes changes to the game:<br />" +
            "- <a href=\"https://github.com/Zarel/Pokemon-Showdown/blob/master/mods/gennext/README.md\">README: overview of NEXT</a><br />" +
            "Example replays:<br />" +
            "- <a href=\"https://replay.pokemonshowdown.com/gennextou-120689854\">Zergo vs Mr Weegle Snarf</a><br />" +
            "- <a href=\"https://replay.pokemonshowdown.com/gennextou-130756055\">NickMP vs Khalogie</a>"
        );
    },

    om: 'othermetas',
    othermetas: function(target, room, user) {
        if (!this.canBroadcast()) return;
        target = toId(target);
        var buffer = "";
        var matched = false;
        if (!target) {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/forums/206/\">Other Metagames Forum</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3505031/\">Other Metagames Index</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3507466/\">Sample teams for entering Other Metagames</a><br />";
        }
        if (target === 'smogondoublesuu' || target === 'doublesuu') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516968/\">Doubles UU</a><br />";
        }
        if (target === 'smogontriples' || target === 'triples') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3511522/\">Smogon Triples</a><br />";
        }
        if (target === 'omofthemonth' || target === 'omotm' || target === 'month') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3481155/\">OM of the Month</a><br />";
        }
        if (target === 'balancedhackmons' || target === 'bh') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3489849/\">Balanced Hackmons</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3515725/\">Balanced Hackmons Suspect Discussion</a><br />";
        }
        if (target === '1v1') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496773/\">1v1</a><br />";
        }
        if (target === 'monotype') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493087/\">Monotype</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3517737/\">Monotype Viability Rankings</a><br />";
        }
        if (target === 'tiershift' || target === 'ts') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3508369/\">Tier Shift</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3514386/\">Tier Shift Viability Rankings</a><br />";
        }
        if (target === 'pu') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3513882/\">PU</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3517353/\">PU Viability Rankings</a><br />";
        }
        if (target === 'inversebattle' || target === 'inverse') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3518146/\">Inverse Battle</a><br />";
        }
        if (target === 'almostanyability' || target === 'aaa') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3517022/\">Almost Any Ability</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3508794/\">Almost Any Ability Viability Rankings</a><br />";
        }
        if (target === 'stabmons') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493081/\">STABmons</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3512215/\">STABmons Viability Rankings</a><br />";
        }
        if (target === 'lcuu') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516967/\">LC UU</a><br />";
        }
        if (target === '350cup') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3512945/\">350 Cup</a><br />";
        }
        if (target === 'averagemons') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3495527/\">Averagemons</a><br />";
        }
        if (target === 'hackmons' || target === 'purehackmons' || target === 'classichackmons') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3500418/\">Hackmons</a><br />";
        }
        if (target === 'hiddentype') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516349/\">Hidden Type</a><br />";
        }
        if (target === 'middlecup' || target === 'mc') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3494887/\">Middle Cup</a><br />";
        }
        if (target === 'mashup') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3518763/\">OM Mashup</a><br />";
        }
        if (target === 'skybattle') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493601/\">Sky Battle</a><br />";
        }
        if (!matched) {
            return this.sendReply("The Other Metas entry '" + target + "' was not found. Try /othermetas or /om for general help.");
        }
        this.sendReplyBox(buffer);
    },




    tc: 'tourhelp',
    th: 'tourhelp',
    tourhelp: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<b><font size="4"><font color="green">Tournament Commands List:</font></b><br>' +
            '<b>/tpoll</b> - Starts a poll asking what tier users want. Requires: +, %, @, &, ~. <br>' +
            '<b>/tour [tier], [number of people or xminutes]</b> Requires: +, %, @, &, ~.<br>' +
            '<b>/endtour</b> - Ends the current tournement. Requires: +, %, @, &, ~.<br>' +
            '<b>/replace [replacee], [replacement]</b> Requires: +, %, @, &, ~.<br>' +
            '<b>/dq [username]</b> - Disqualifies a user from the tournement. Requires: +, %, @, &, ~.<br>' +
            '<b>/fj [user]</b> - Forcibily joins a user into the tournement in the sign up phase. Requires: +, %, @, &, ~.<br>' +
            '<b>/fl [username]</b> - Forcibily makes a user leave the tournement in the sign up phase. Requires: +, %, @, &, ~.<br>' +
            '<b>/vr</b> - Views the current round in the tournement of whose won and whose lost and who hasn\'t started yet.<br>' +
            '<b>/toursize [number]</b> - Changes the tour size if you started it with a number instead of a time limit during the sign up phase.<br>' +
            '<b>/tourtime [xminutes]</b> - Changes the tour time if you started it with a time limit instead of a number during the sign up phase.<br>' +
            '<b><font size="2"><font color="green">Polls Commands List:</b></font><br>' +
            '<b>/poll [title], [option],[option], exc...</b> - Starts a poll. Requires: +, %, @, &, ~.<br>' +
            '<b>/pr</b> - Reminds you of what the current poll is.<br>' +
            '<b>/endpoll</b> - Ends the current poll. Requires: +, %, @, &, ~.<br>' +
            '<b>/vote [opinion]</b> - votes for an option of the current poll.<br><br>' +
            '<i>--Just ask in the lobby if you\'d like a voice or up to start a tourney!</i>');
    },

    rule: 'rules',
    rules: function(target, room, user) {
        if (!target) {
            if (!this.canBroadcast()) return;
            this.sendReplyBox("Please follow the rules:<br />" +
                (room.rulesLink ? "- <a href=\"" + Tools.escapeHTML(room.rulesLink) + "\">" + Tools.escapeHTML(room.title) + " room rules</a><br />" : "") +
                "- <a href=\"http://goldserver.weebly.com/rules.html\">" + (room.rulesLink ? "Global rules" : "Rules") + "</a>");
            return;
        }
        if (!this.can('roommod', null, room)) return;
        if (target.length > 100) {
            return this.sendReply("Error: Room rules link is too long (must be under 100 characters). You can use a URL shortener to shorten the link.");
        }

        room.rulesLink = target.trim();
        this.sendReply("(The room rules link is now: " + target + ")");

        if (room.chatRoomData) {
            room.chatRoomData.rulesLink = room.rulesLink;
            Rooms.global.writeChatRoomData();
        }
    },

    faq: function(target, room, user) {
        if (!this.canBroadcast()) return;
        target = target.toLowerCase();
        var buffer = "";
        var matched = false;
        if (!target || target === 'all') {
            matched = true;
            buffer += "<a href=\"https://www.smogon.com/sim/faq\">Frequently Asked Questions</a><br />";
        }
        if (target === 'deviation') {
            matched = true;
            buffer += "<a href=\"https://www.smogon.com/sim/faq#deviation\">Why did this user gain or lose so many points?</a><br />";
        }
        if (target === 'doubles' || target === 'triples' || target === 'rotation') {
            matched = true;
            buffer += "<a href=\"https://www.smogon.com/sim/faq#doubles\">Can I play doubles/triples/rotation battles here?</a><br />";
        }
        if (target === 'randomcap') {
            matched = true;
            buffer += "<a href=\"https://www.smogon.com/sim/faq#randomcap\">What is this fakemon and what is it doing in my random battle?</a><br />";
        }
        if (target === 'restarts') {
            matched = true;
            buffer += "<a href=\"https://www.smogon.com/sim/faq#restarts\">Why is the server restarting?</a><br />";
        }
        if (target === 'all' || target === 'star' || target === 'player') {
            matched = true;
            buffer += '<a href="http://www.smogon.com/sim/faq#star">Why is there this star (&starf;) in front of my username?</a><br />';
        }
        if (target === 'staff') {
            matched = true;
            buffer += '<a href="http://goldserver.weebly.com/how-do-i-get-a-rank.html">Staff FAQ</a><br />';
        }
        if (target === 'autoconfirmed' || target === 'ac') {
            matched = true;
            buffer += "A user is autoconfirmed when they have won at least one rated battle and have been registered for a week or longer.<br />";
        }
        if (target === 'all' || target === 'customsymbol' || target === 'cs') {
            matched = true;
            buffer += 'A custom symbol will bring your name up to the top of the userlist with a custom symbol next to it.  These reset after the server restarts.<br />';
        }
        if (target === 'all' || target === 'league') {
            matched = true;
            buffer += 'Welcome to Gold!  So, you\'re interested in making or moving a league here?  If so, read <a href="http://goldserver.weebly.com/making-a-league.html">this</a> and write down your answers on a <a href="http://pastebin.com">Pastebin</a> and PM it to an admin.  Good luck!<br />';
        }
        if (target === 'customavatar' || target === 'ca') {
            matched = true;
            buffer += "<a href=\"https://www.smogon.com/sim/faq#customavatar\">How can I get a custom avatar?</a><br />";
        }
        if (!matched) {
            return this.sendReply("The FAQ entry '" + target + "' was not found. Try /faq for general help.");
        }
        this.sendReplyBox(buffer);
    },

    banlists: 'tiers',
    tier: 'tiers',
    tiers: function(target, room, user) {
        if (!this.canBroadcast()) return;
        target = toId(target);
        var buffer = "";
        var matched = false;
        if (!target || target === 'all') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/tiers/\">Smogon Tiers</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/tiering-faq.3498332/\">Tiering FAQ</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/xyhub/tiers\">The banlists for each tier</a><br />";
        }
        if (target === 'overused' || target === 'ou') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3521201/\">OU Metagame Discussion</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/dex/xy/tags/ou/\">OU Banlist</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3521602/\">OU Viability Rankings</a><br />";
        }
        if (target === 'ubers' || target === 'uber') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3522911/\">Ubers Metagame Discussion</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3523419/\">Ubers Viability Rankings</a><br />";
        }
        if (target === 'underused' || target === 'uu') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3522744/\">np: UU Stage 1</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/dex/xy/tags/uu/\">UU Banlist</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3523649/\">UU Viability Rankings</a><br />";
        }
        if (target === 'rarelyused' || target === 'ru') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3522572/\">np: RU Stage 5</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/dex/xy/tags/ru/\">RU Banlist</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3523627/\">RU Viability Rankings</a><br />";
        }
        if (target === 'neverused' || target === 'nu') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3522559/\">np: NU Stage 3</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/dex/xy/tags/nu/\">NU Banlist</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3509494/\">NU Viability Rankings</a><br />";
        }
        if (target === 'littlecup' || target === 'lc') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3505710/\">LC Metagame Discussion</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3490462/\">LC Banlist</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496013/\">LC Viability Rankings</a><br />";
        }
        if (target === 'smogondoubles' || target === 'doubles') {
            matched = true;
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3523833/\">np: Doubles Stage 1</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3498688/\">Doubles Banlist</a><br />";
            buffer += "- <a href=\"https://www.smogon.com/forums/threads/3522814/\">Doubles Viability Rankings</a><br />";
        }
        if (!matched) {
            return this.sendReply("The Tiers entry '" + target + "' was not found. Try /tiers for general help.");
        }
        this.sendReplyBox(buffer);
    },

    analysis: 'smogdex',
    strategy: 'smogdex',
    smogdex: function(target, room, user) {
        if (!this.canBroadcast()) return;

        var targets = target.split(',');
        if (toId(targets[0]) === 'previews') return this.sendReplyBox("<a href=\"https://www.smogon.com/forums/threads/sixth-generation-pokemon-analyses-index.3494918/\">Generation 6 Analyses Index</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
        var pokemon = Tools.getTemplate(targets[0]);
        var item = Tools.getItem(targets[0]);
        var move = Tools.getMove(targets[0]);
        var ability = Tools.getAbility(targets[0]);
        var atLeastOne = false;
        var generation = (targets[1] || 'xy').trim().toLowerCase();
        var genNumber = 6;
        // var doublesFormats = {'vgc2012':1, 'vgc2013':1, 'vgc2014':1, 'doubles':1};
        var doublesFormats = {};
        var doublesFormat = (!targets[2] && generation in doublesFormats) ? generation : (targets[2] || '').trim().toLowerCase();
        var doublesText = '';
        if (generation === 'xy' || generation === 'xy' || generation === '6' || generation === 'six') {
            generation = 'xy';
        } else if (generation === 'bw' || generation === 'bw2' || generation === '5' || generation === 'five') {
            generation = 'bw';
            genNumber = 5;
        } else if (generation === 'dp' || generation === 'dpp' || generation === '4' || generation === 'four') {
            generation = 'dp';
            genNumber = 4;
        } else if (generation === 'adv' || generation === 'rse' || generation === 'rs' || generation === '3' || generation === 'three') {
            generation = 'rs';
            genNumber = 3;
        } else if (generation === 'gsc' || generation === 'gs' || generation === '2' || generation === 'two') {
            generation = 'gs';
            genNumber = 2;
        } else if (generation === 'rby' || generation === 'rb' || generation === '1' || generation === 'one') {
            generation = 'rb';
            genNumber = 1;
        } else {
            generation = 'xy';
        }
        if (doublesFormat !== '') {
            // Smogon only has doubles formats analysis from gen 5 onwards.
            if (!(generation in {
                    'bw': 1,
                    'xy': 1
                }) || !(doublesFormat in doublesFormats)) {
                doublesFormat = '';
            } else {
                doublesText = {
                    'vgc2012': "VGC 2012",
                    'vgc2013': "VGC 2013",
                    'vgc2014': "VGC 2014",
                    'doubles': "Doubles"
                }[doublesFormat];
                doublesFormat = '/' + doublesFormat;
            }
        }

        // Pokemon
        if (pokemon.exists) {
            atLeastOne = true;
            if (genNumber < pokemon.gen) {
                return this.sendReplyBox("" + pokemon.name + " did not exist in " + generation.toUpperCase() + "!");
            }
            // if (pokemon.tier === 'CAP') generation = 'cap';
            if (pokemon.tier === 'CAP') return this.sendReply("CAP is not currently supported by Smogon Strategic Pokedex.");

            var illegalStartNums = {
                '351': 1,
                '421': 1,
                '487': 1,
                '493': 1,
                '555': 1,
                '647': 1,
                '648': 1,
                '649': 1,
                '681': 1
            };
            if (pokemon.isMega || pokemon.num in illegalStartNums) pokemon = Tools.getTemplate(pokemon.baseSpecies);
            var poke = pokemon.name.toLowerCase().replace(/\ /g, '_').replace(/[^a-z0-9\-\_]+/g, '');

            this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/pokemon/" + poke + doublesFormat + "\">" + generation.toUpperCase() + " " + doublesText + " " + pokemon.name + " analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
        }

        // Item
        if (item.exists && genNumber > 1 && item.gen <= genNumber) {
            atLeastOne = true;
            var itemName = item.name.toLowerCase().replace(' ', '_');
            this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/items/" + itemName + "\">" + generation.toUpperCase() + " " + item.name + " item analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
        }

        // Ability
        if (ability.exists && genNumber > 2 && ability.gen <= genNumber) {
            atLeastOne = true;
            var abilityName = ability.name.toLowerCase().replace(' ', '_');
            this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/abilities/" + abilityName + "\">" + generation.toUpperCase() + " " + ability.name + " ability analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
        }

        // Move
        if (move.exists && move.gen <= genNumber) {
            atLeastOne = true;
            var moveName = move.name.toLowerCase().replace(' ', '_');
            this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/moves/" + moveName + "\">" + generation.toUpperCase() + " " + move.name + " move analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
        }

        if (!atLeastOne) {
            return this.sendReplyBox("Pokemon, item, move, or ability not found for generation " + generation.toUpperCase() + ".");
        }

    },
    forums: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('Gold Forums can be found <a href="http://w11.zetaboards.com/Goldserverps/index/">here</a>.');
    },
    regdate: function(target, room, user, connection) {
        if (!this.canBroadcast()) return;
        if (!target || target == "0") return this.sendReply('Lol, you can\'t do that, you nub.');
        if (!target || target == "." || target == "," || target == "'") return this.sendReply('/regdate - Please specify a valid username.'); //temp fix for symbols that break the command
        var username = target;
        target = target.replace(/\s+/g, '');
        var util = require("util"),
            http = require("http");

        var options = {
            host: "www.pokemonshowdown.com",
            port: 80,
            path: "/forum/~" + target
        };

        var content = "";
        var self = this;
        var req = http.request(options, function(res) {

            res.setEncoding("utf8");
            res.on("data", function(chunk) {
                content += chunk;
            });
            res.on("end", function() {
                content = content.split("<em");
                if (content[1]) {
                    content = content[1].split("</p>");
                    if (content[0]) {
                        content = content[0].split("</em>");
                        if (content[1]) {
                            regdate = content[1];
                            data = Tools.escapeHTML(username) + ' was registered on' + regdate + '.';
                        }
                    }
                } else {
                    data = Tools.escapeHTML(username) + ' is not registered.';
                }
                self.sendReplyBox(Tools.escapeHTML(data));
            });
        });
        req.end();
    },

    league: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('<font size="2"><b><center>Goodra League</font></b></center>' +
            '★The league consists of 3 Gym Leaders<br /> ' +
            '★Currently the Champion position is empty.<br/>' +
            '★Be the first to complete the league, and the spot is yours!<br />' +
            '★The champion gets a FREE trainer card, custom avatar and global voice!<br />' +
            '★The Goodra League information can be found <a href="http://goldserver.weebly.com/league.html" >here</a>.<br />' +
            '★Click <button name=\"joinRoom\" value=\"goodraleague\">here</button> to enter our League\'s room!');
    },

    stafffaq: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('Click <a href="http://goldserver.weebly.com/how-do-i-get-a-rank-on-gold.html">here</a> to find out about Gold\'s ranks and promotion system.');
    },

    //Should solve the problem of users not being able to talk in chat
    unstick: function(target, room, user) {
        if (!this.can('hotpatch')) return;
        for (var uid in Users.users) {
            Users.users[uid].chatQueue = null;
            Users.users[uid].chatQueueTimeout = null;
        }
    },

    /*********************************************************
     * Miscellaneous commands
     *********************************************************/

    //kupo: function(target, room, user){
    //if(!this.canBroadcast()|| !user.can('broadcast')) return this.sendReply('/kupo - Access Denied.');
    //if(!target) return this.sendReply('Insufficent Parameters.');
    //room.add('|c|~kupo|/me '+ target);
    //this.logModCommand(user.name + ' used /kupo to say ' + target);
    //},

    birkal: function(target, room, user) {
        this.sendReply("It's not funny anymore.");
    },

    potd: function(target, room, user) {
        if (!this.can('potd')) return false;

        Config.potd = target;
        Simulator.SimulatorProcess.eval('Config.potd = \'' + toId(target) + '\'');
        if (target) {
            if (Rooms.lobby) Rooms.lobby.addRaw("<div class=\"broadcast-blue\"><b>The Pokemon of the Day is now " + target + "!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>");
            this.logModCommand("The Pokemon of the Day was changed to " + target + " by " + user.name + ".");
        } else {
            if (Rooms.lobby) Rooms.lobby.addRaw("<div class=\"broadcast-blue\"><b>The Pokemon of the Day was removed!</b><br />No pokemon will be guaranteed in random battles.</div>");
            this.logModCommand("The Pokemon of the Day was removed by " + user.name + ".");
        }
    },


    nstaffmemberoftheday: 'smotd',
    nsmotd: function(target, room, user) {
        if (room.id !== 'lobby') return this.sendReply("This command can only be used in Lobby.");
        //Users cannot do HTML tags with this command.
        if (target.indexOf('<img ') > -1) {
            return this.sendReply('HTML is not supported in this command.')
        }
        if (target.indexOf('<a href') > -1) {
            return this.sendReply('HTML is not supported in this command.')
        }
        if (target.indexOf('<font ') > -1) {
            return this.sendReply('HTML is not supported in this command.')
        }
        if (target.indexOf('<marquee') > -1) {
            return this.sendReply('HTML is not supported in this command.')
        }
        if (target.indexOf('<blink') > -1) {
            return this.sendReply('HTML is not supported in this command.')
        }
        if (target.indexOf('<center') > -1) {
            return this.sendReply('HTML is not supported in this command.')
        }
        if (!target) return this.sendReply('/nsmotd needs an Staff Member.');
        //Users who are muted cannot use this command.
        if (target.length > 25) {
            return this.sendReply('This Staff Member\'s name is too long; it cannot exceed 25 characters.');
        }
        if (!this.canTalk()) return;
        room.addRaw('' + user.name + '\'s nomination  for Staff Member of the Day is: <b><i>' + target + '</i></b>');
    },

    staffmemberoftheday: 'smotd',
    smotd: function(target, room, user) {
        if (room.id !== 'lobby') return this.sendReply("This command can only be used in Lobby.");
        //User use HTML with this command.
        if (target.indexOf('<img ') > -1) {
            return this.sendReply('HTML is not supported in this command.')
        }
        if (target.indexOf('<a href') > -1) {
            return this.sendReply('HTML is not supported in this command.')
        }
        if (target.indexOf('<font ') > -1) {
            return this.sendReply('HTML is not supported in this command.')
        }
        if (target.indexOf('<marquee') > -1) {
            return this.sendReply('HTML is not supported in this command.')
        }
        if (target.indexOf('<blink') > -1) {
            return this.sendReply('HTML is not supported in this command.')
        }
        if (target.indexOf('<center') > -1) {
            return this.sendReply('HTML is not supported in this command.')
        }
        if (!target) {
            //allows user to do /smotd to view who is the Staff Member of the day if people forget.
            return this.sendReply('The current Staff Member of the Day is: ' + room.smotd);
        }
        //Users who are muted cannot use this command.
        if (!this.canTalk()) return;
        //Only room drivers and up may use this command.
        if (target.length > 25) {
            return this.sendReply('This Staff Member\'s name is too long; it cannot exceed 25 characters.');
        }
        if (!this.can('mute', null, room)) return;
        room.smotd = target;
        if (target) {
            //if a user does /smotd (Staff Member name here), then we will display the Staff Member of the Day.
            room.addRaw('<div class="broadcast-red"><font size="2"><b>The Staff Member of the Day is now <font color="black">' + target + '!</font color></font size></b> <font size="1">(Set by ' + user.name + '.)<br />This Staff Member is now the honorary Staff Member of the Day!</div>');
            this.logModCommand('The Staff Member of the Day was changed to ' + target + ' by ' + user.name + '.');
        } else {
            //If there is no target, then it will remove the Staff Member of the Day.
            room.addRaw('<div class="broadcast-green"><b>The Staff Member of the Day was removed!</b><br />There is no longer an Staff Member of the day today!</div>');
            this.logModCommand('The Staff Member of the Day was removed by ' + user.name + '.');
        }
    },

    roll: 'dice',
    dice: function(target, room, user) {
        if (!target) return this.parse('/help dice');
        if (!this.canBroadcast()) return;
        var d = target.indexOf("d");
        if (d >= 0) {
            var num = parseInt(target.substring(0, d));
            var faces;
            if (target.length > d) faces = parseInt(target.substring(d + 1));
            if (isNaN(num)) num = 1;
            if (isNaN(faces)) return this.sendReply("The number of faces must be a valid integer.");
            if (faces < 1 || faces > 1000) return this.sendReply("The number of faces must be between 1 and 1000");
            if (num < 1 || num > 20) return this.sendReply("The number of dice must be between 1 and 20");
            var rolls = [];
            var total = 0;
            for (var i = 0; i < num; ++i) {
                rolls[i] = (Math.floor(faces * Math.random()) + 1);
                total += rolls[i];
            }
            return this.sendReplyBox("Random number " + num + "x(1 - " + faces + "): " + rolls.join(", ") + "<br />Total: " + total);
        }
        if (target && isNaN(target) || target.length > 21) return this.sendReply("The max roll must be a number under 21 digits.");
        var maxRoll = (target) ? target : 6;
        var rand = Math.floor(maxRoll * Math.random()) + 1;
        return this.sendReplyBox("Random number (1 - " + maxRoll + "): " + rand);
    },
    /*/
        rollgame: 'dicegame',
        dicegame: function(target, room, user) {
            if (!this.canBroadcast()) return;
            if (Users.get(''+user.name+'').money < target) {
                return this.sendReply('You cannot wager more than you have, nub.');
            }
            if(!target) return this.sendReply('/dicegame [amount of bucks agreed to wager].');
            if (isNaN(target)) {
                return this.sendReply('Very funny, now use a real number.');
            }
            if (String(target).indexOf('.') >= 0) {
                return this.sendReply('You cannot wager numbers with decimals.');
            }
            if (target < 0) {
                return this.sendReply('Number cannot be negative.');
            }
            if (target > 100) {
                return this.sendReply('Error: You cannot wager over 100 bucks.');
            }
            if (target == 0) {
                return this.sendReply('Number cannot be 0.');
            }
            var player1 = Math.floor(6 * Math.random()) + 1;
            var player2 = Math.floor(6 * Math.random()) + 1;
            var winner = '';
            var loser= '';
            if (player1 > player2) {
            winner = 'The <b>winner</b> is <font color="green">'+user.name+'</font>!';
            loser = 'Better luck next time, computer!';
            return this.add('|c|~crowt|.custom /tb '+user.name+','+target+'');
            }
            if (player1 < player2) {
            winner = 'The <b>winner</b> is <font color="green">Opponent</font>!';
            loser = 'Better luck next time, '+user.name+'!';
            return this.add('|c|~crowt|.custom /removebucks '+user.name+','+target+'');
            }
            if (player1 === player2) {
            winner = 'It\'s a <b>tie</b>!';
            loser = 'Try again!';
            }
            return this.sendReplyBox('<center><font size="4"><b><img border="5" title="Dice Game!"></b></font></center><br />' +
                    '<font color="red">This game is worth '+target+' buck(s).</font><br />' +
                    'Loser: Tranfer bucks to the winner using /tb [winner], '+target+' <br />' +
                    '<hr>' +
                    ''+user.name+' roll (1-6):  '+player1+'<br />' +
                    'Opponent roll (1-6):   '+player2+'<br />' +
                    '<hr>' +
                    'Winner: '+winner+'<br />' +
                    ''+loser+'');
        },
        */

    removebadge: function(target, room, user) {
        if (!this.can('hotpatch')) return false;
        target = this.splitTarget(target);
        var targetUser = this.targetUser;
        if (!target) return this.sendReply('/removebadge [user], [badge] - Removes a badge from a user.');
        if (!targetUser) return this.sendReply('There is no user named ' + this.targetUsername + '.');
        var self = this;
        var type_of_badges = ['admin', 'bot', 'dev', 'vip', 'artist', 'mod', 'leader', 'champ', 'creator', 'comcun', 'twinner', 'goodra', 'league', 'fgs'];
        if (type_of_badges.indexOf(target) > -1 == false) return this.sendReply('The badge ' + target + ' is not a valid badge.');
        fs.readFile('badges.txt', 'utf8', function(err, data) {
            if (err) console.log(err);
            var match = false;
            var currentbadges = '';
            var row = ('' + data).split('\n');
            var line = '';
            for (var i = row.length; i > -1; i--) {
                if (!row[i]) continue;
                var split = row[i].split(':');
                if (split[0] == targetUser.userid) {
                    match = true;
                    currentbadges = split[1];
                    line = row[i];
                }
            }
            if (match == true) {
                if (currentbadges.indexOf(target) > -1 == false) return self.sendReply(currentbadges); //'The user '+targetUser+' does not have the badge.');
                var re = new RegExp(line, 'g');
                currentbadges = currentbadges.replace(target, '');
                var newdata = data.replace(re, targetUser.userid + ':' + currentbadges);
                fs.writeFile('badges.txt', newdata, 'utf8', function(err, data) {
                    if (err) console.log(err);
                    return self.sendReply('You have removed the badge ' + target + ' from the user ' + targetUser + '.');
                });
            } else {
                return self.sendReply('There is no match for the user ' + targetUser + '.');
            }
        });
    },

    givebadge: function(target, room, user) {
        if (!this.can('hotpatch')) return false;
        target = this.splitTarget(target);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply('There is no user named ' + this.targetUsername + '.');
        if (!target) return this.sendReply('/givebadge [user], [badge] - Gives a badge to a user. Requires: &~');
        var self = this;
        var type_of_badges = ['admin', 'bot', 'dev', 'vip', 'mod', 'artist', 'leader', 'champ', 'creator', 'comcun', 'twinner', 'league', 'fgs'];
        if (type_of_badges.indexOf(target) > -1 == false) return this.sendReply('Ther is no badge named ' + target + '.');
        fs.readFile('badges.txt', 'utf8', function(err, data) {
            if (err) console.log(err);
            var currentbadges = '';
            var line = '';
            var row = ('' + data).split('\n');
            var match = false;
            for (var i = row.length; i > -1; i--) {
                if (!row[i]) continue;
                var split = row[i].split(':');
                if (split[0] == targetUser.userid) {
                    match = true;
                    currentbadges = split[1];
                    line = row[i];
                }
            }
            if (match == true) {
                if (currentbadges.indexOf(target) > -1) return self.sendReply('The user ' + targerUser + ' already has the badge ' + target + '.');
                var re = new RegExp(line, 'g');
                var newdata = data.replace(re, targetUser.userid + ':' + currentbadges + target);
                fs.writeFile('badges.txt', newdata, function(err, data) {
                    if (err) console.log(err);
                    self.sendReply('You have given the badge ' + target + ' to the user ' + targetUser + '.');
                    targetUser.send('You have recieved the badge ' + target + ' from the user ' + user.userid + '.');
                    room.addRaw(targetUser + ' has recieved the ' + target + ' badge from ' + user.name);
                });
            } else {
                fs.appendFile('badges.txt', '\n' + targetUser.userid + ':' + target, function(err) {
                    if (err) console.log(err);
                    self.sendReply('You have given the badge ' + target + ' to the user ' + targetUser + '.');
                    targetUser.send('You have recieved the badge ' + target + ' from the user ' + user.userid + '.');
                });
            }
        })
    },

    badgelist: function(target, room, user) {
        if (!this.canBroadcast()) return;
        var fgs = '<img src="http://www.smogon.com/media/forums/images/badges/forummod_alum.png" title="Former Gold Staff">';
        var admin = '<img src="http://www.smogon.com/media/forums/images/badges/sop.png" title="Server Administrator">';
        var dev = '<img src="http://www.smogon.com/media/forums/images/badges/factory_foreman.png" title="Gold Developer">';
        var creator = '<img src="http://www.smogon.com/media/forums/images/badges/dragon.png" title="Server Creator">';
        var comcun = '<img src="http://www.smogon.com/media/forums/images/badges/cc.png" title="Community Contributor">';
        var leader = '<img src="http://www.smogon.com/media/forums/images/badges/aop.png" title="Server Leader">';
        var mod = '<img src="http://www.smogon.com/media/forums/images/badges/pyramid_king.png" title="Exceptional Staff Member">';
        var league = '<img src="http://www.smogon.com/media/forums/images/badges/forumsmod.png" title="Successful Room Founder">';
        var champ = '<img src="http://www.smogon.com/media/forums/images/badges/forumadmin_alum.png" title="Goodra League Champion">';
        var artist = '<img src="http://www.smogon.com/media/forums/images/badges/ladybug.png" title="Artist">';
        var twinner = '<img src="http://www.smogon.com/media/forums/images/badges/spl.png" title="Badge Tournament Winner">';
        var vip = '<img src="http://www.smogon.com/media/forums/images/badges/zeph.png" title="VIP">';
        var bot = '<img src="http://www.smogon.com/media/forums/images/badges/mind.png" title="Gold Bot Hoster">';
        return this.sendReplyBox('<b>List of Gold Badges</b>:<br>' + fgs + '  ' + admin + '    ' + dev + '  ' + creator + '   ' + comcun + '    ' + mod + '    ' + leader + '    ' + league + '    ' + champ + '    ' + artist + '    ' + twinner + '    ' + vip + '    ' + bot + ' <br>--Hover over them to see the meaning of each.<br>--Get a badge and get a FREE custom avatar!<br>--Click <a href="http://goldserver.weebly.com/badges.html">here</a> to find out more about how to get a badge.');
    },
    badges: 'badge',
    badge: function(target, room, user) {
        if (!this.canBroadcast()) return;
        if (target == '') target = user.userid;
        target = this.splitTarget(target);
        var targetUser = this.targetUser;
        var matched = false;
        if (!targetUser) return false;
        var fgs = '<img src="http://www.smogon.com/media/forums/images/badges/forummod_alum.png" title="Former Gold Staff">';
        var admin = '<img src="http://www.smogon.com/media/forums/images/badges/sop.png" title="Server Administrator">';
        var dev = '<img src="http://www.smogon.com/media/forums/images/badges/factory_foreman.png" title="Gold Developer">';
        var creator = '<img src="http://www.smogon.com/media/forums/images/badges/dragon.png" title="Server Creator">';
        var comcun = '<img src="http://www.smogon.com/media/forums/images/badges/cc.png" title="Community Contributor">';
        var leader = '<img src="http://www.smogon.com/media/forums/images/badges/aop.png" title="Server Leader">';
        var mod = '<img src="http://www.smogon.com/media/forums/images/badges/pyramid_king.png" title="Exceptional Staff Member">';
        var league = '<img src="http://www.smogon.com/media/forums/images/badges/forumsmod.png" title="Successful League Owner">';
        var champ = '<img src="http://www.smogon.com/media/forums/images/badges/forumadmin_alum.png" title="Goodra League Champion">';
        var artist = '<img src="http://www.smogon.com/media/forums/images/badges/ladybug.png" title="Artist">';
        var twinner = '<img src="http://www.smogon.com/media/forums/images/badges/spl.png" title="Badge Tournament Winner">';
        var vip = '<img src="http://www.smogon.com/media/forums/images/badges/zeph.png" title="VIP">';
        var bot = '<img src="http://www.smogon.com/media/forums/images/badges/mind.png" title="Gold Bot Hoster">';
        var self = this;
        fs.readFile('badges.txt', 'utf8', function(err, data) {
            if (err) console.log(err);
            var row = ('' + data).split('\n');
            var match = false;
            var badges;
            for (var i = row.length; i > -1; i--) {
                if (!row[i]) continue;
                var split = row[i].split(':');
                if (split[0] == targetUser.userid) {
                    match = true;
                    currentbadges = split[1];
                }
            }
            if (match == true) {
                var badgelist = '';
                if (currentbadges.indexOf('fgs') > -1) badgelist += ' ' + fgs;
                if (currentbadges.indexOf('admin') > -1) badgelist += ' ' + admin;
                if (currentbadges.indexOf('dev') > -1) badgelist += ' ' + dev;
                if (currentbadges.indexOf('creator') > -1) badgelist += ' ' + creator;
                if (currentbadges.indexOf('comcun') > -1) badgelist += ' ' + comcun;
                if (currentbadges.indexOf('leader') > -1) badgelist += ' ' + leader;
                if (currentbadges.indexOf('mod') > -1) badgelist += ' ' + mod;
                if (currentbadges.indexOf('league') > -1) badgelist += ' ' + league;
                if (currentbadges.indexOf('champ') > -1) badgelist += ' ' + champ;
                if (currentbadges.indexOf('artist') > -1) badgelist += ' ' + artist;
                if (currentbadges.indexOf('twinner') > -1) badgelist += ' ' + twinner;
                if (currentbadges.indexOf('vip') > -1) badgelist += ' ' + vip;
                if (currentbadges.indexOf('bot') > -1) badgelist += ' ' + bot;
                self.sendReplyBox(targetUser.userid + "'s badges: " + badgelist);
                room.update();
            } else {
                self.sendReplyBox('User ' + targetUser.userid + ' has no badges.');
                room.update();
            }
        });
    },

    helixfossil: 'm8b',
    helix: 'm8b',
    magic8ball: 'm8b',
    m8b: function(target, room, user) {
        if (!this.canBroadcast()) return;
        var random = Math.floor(20 * Math.random()) + 1;
        var results = '';

        if (random == 1) {
            results = 'Signs point to yes.';
        }
        if (random == 2) {
            results = 'Yes.';
        }
        if (random == 3) {
            results = 'Reply hazy, try again.';
        }
        if (random == 4) {
            results = 'Without a doubt.';
        }
        if (random == 5) {
            results = 'My sources say no.';
        }
        if (random == 6) {
            results = 'As I see it, yes.';
        }
        if (random == 7) {
            results = 'You may rely on it.';
        }
        if (random == 8) {
            results = 'Concentrate and ask again.';
        }
        if (random == 9) {
            results = 'Outlook not so good.';
        }
        if (random == 10) {
            results = 'It is decidedly so.';
        }
        if (random == 11) {
            results = 'Better not tell you now.';
        }
        if (random == 12) {
            results = 'Very doubtful.';
        }
        if (random == 13) {
            results = 'Yes - definitely.';
        }
        if (random == 14) {
            results = 'It is certain.';
        }
        if (random == 15) {
            results = 'Cannot predict now.';
        }
        if (random == 16) {
            results = 'Most likely.';
        }
        if (random == 17) {
            results = 'Ask again later.';
        }
        if (random == 18) {
            results = 'My reply is no.';
        }
        if (random == 19) {
            results = 'Outlook good.';
        }
        if (random == 20) {
            results = 'Don\'t count on it.';
        }
        return this.sendReplyBox('' + results + '');
    },

    hue: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://reactiongifs.me/wp-content/uploads/2013/08/ducks-laughing.gif">');
    },

    coins: 'coingame',
    coin: 'coingame',
    coingame: function(target, room, user) {
        if (!this.canBroadcast()) return;
        var random = Math.floor(2 * Math.random()) + 1;
        var results = '';
        if (random == 1) {
            results = '<img src="http://surviveourcollapse.com/wp-content/uploads/2013/01/zinc.png" width="15%" title="Heads!"><br>It\'s heads!';
        }
        if (random == 2) {
            results = '<img src="http://upload.wikimedia.org/wikipedia/commons/e/e5/2005_Penny_Rev_Unc_D.png" width="15%" title="Tails!"><br>It\'s tails!';
        }
        return this.sendReplyBox('<center><font size="3"><b>Coin Game!</b></font><br>' + results + '');
    },

    p: 'panagrams',
    panagrams: function(target, room, user) {
        if (!user.can('ban')) return;
        if (room.id == 'lobby') {
            room.addRaw(
                '<div class="broadcast-black"><b><center><font size="3">Panagrams has started!</font></b>' +
                '<center>This is Gold\'s version of anagrams, but with buck prizes!  We currently have a random category and a Pokemon category!<br />' +
                '<button name="joinRoom" value="panagrams" target="_blank">Play now!</button></center></div>'
            );
        } else {
            room.addRaw(
                '<div class="broadcast-black"><center><font size="3">A panagrams session is about to begin!</font></center></div>'
            );
        }
    },

    one: function(target, room, user) {
        if (room.id !== '1v1') return this.sendReply("This command can only be used in 1v1.");
        if (!this.canBroadcast()) return;
        var messages = {
            onevone: 'Global 1v1 bans are: Focus Sash, Sturdy (if doesnt naturally learn it), Sleep, Imposter/imprison, Parental Bond, and level 100 Pokemon only. You are only allowed to use "3 team preview" in all tiers falling under the "1v1 Elimination" tier. All other tiers must be 1 Pokemon only. No switching',
            reg: 'This is regular 1v1, only bans are Sleep, Ubers (except mega gengar), and ditto (imposter/imprison)',
            monogen: 'You may only use pokemon, from the gen decided by the !roll command. No ubers, and no sleep',
            monotype: 'You may only use Pokemon from the type dictated by the !roll command. Here are the list of types. http://bulbapedia.bulbagarden.net/wiki/Type_chart No ubers, and no sleep',
            monopoke: 'You may only use the Pokemon decided by the !roll command. No ubers, and no sleep',
            monoletter: 'You may only use Pokemon starting with the same letter dictated by the !roll command. No ubers, and no sleep.',
            monocolor: 'You may only use Pokemon sharing the same color dictated by the !pickrandom command.',
            cap: '1v1 using Create-A-Pokemon! No sleep, no focus sash.',
            megaevo: 'Only bring one Pokemon. http://pastebin.com/d9pJWpya ',
            bstbased: 'You may only use Pokemon based off or lower than the BST decided by !roll command. ',
            metronome: 'Only bring one Pokemon. http://pastebin.com/diff.php?i=QPZBDzKb ',
            twovtwo: 'You may only use 2 pokemon, banlist include: no sleep, no ubers (mega gengar allowed), only one focus sash, no parental bond. ',
            ouonevone: 'OU choice- The OU version of CC1v1. You use an OU team, and choose one  Pokemon in battle. Once that Pokemon faints, you forfeit. You must use  the same OU team throughout the tour, but you can change which Pokemon  you select to choose. No ubers, no focus sash, no sleep. ',
            aaa: 'http://www.smogon.com/forums/threads/almost-any-ability-xy-aaa-xy-other-metagame-of-the-month-may.3495737/ You may only use a team of ONE pokemon, banlist in  this room for this tier are: Sleep, focus sash, Sturdy, Parental Bond,  Huge Power, Pure Power, Imprison, Normalize (on ghosts). ',
            stabmons: 'http://www.smogon.com/forums/threads/3484106/ You may only use a team of ONE Pokemon. Banlist = Sleep, Focus sash, Huge Power, Pure power, Sturdy, Parental Bond, Ubers. ',
            abccup: 'http://www.smogon.com/forums/threads/alphabet-cup-other-metagame-of-the-month-march.3498167/ You may only use a team of ONE Pokemon. Banlist = Sleep, Focus sash, Huge Power, Pure power, Sturdy, Parental Bond, Ubers. ',
            averagemons: 'http://www.smogon.com/forums/threads/averagemons.3495527/ You may only use a team of ONE Pokemon. Banlist = Sleep, Focus sash, Huge Power, Pure power, Sturdy, Parental Bond, Sableye. ',
            balancedhackmons: 'http://www.smogon.com/forums/threads/3463764/ You may only use a team of ONE Pokemon. Banlist =  Sleep, Focus sash, Huge Power, Pure power, Sturdy, Parental Bond,  Normalize Ghosts.',
            retro: 'This is how 1v1 used to be played before 3 team preview. Only bring ONE Pokemon, No sleep, no ubers (except mega gengar), no ditto. ',
            mediocremons: 'https://www.smogon.com/forums/threads/mediocre-mons-venomoth-banned.3507608/ You many only use a team of ONE Pokemon Banlist = Sleep, Focus sash, Huge Power, Pure power, Sturdy.  ',
            eeveeonly: 'You may bring up to 3 mons that are eeveelutions. No sleep inducing moves. ',
            tiershift: 'http://www.smogon.com/forums/threads/tier-shift-xy.3508369/ Tiershift 1v1, you may only bring ONE Pokemon. roombans are slaking, sleep, sash, sturdy, ditto ',
            lc: 'Only use a team of ONE LC Pokemon. No sleep, no sash. ',
            lcstarters: 'Only use a team of ONE starter Pokemon in LC form. No sleep, no sash, no pikachu, no eevee. ',
            ubers: 'Only use a team of ONE uber pokemon. No sleep, no sash ',
            inverse: 'https://www.smogon.com/forums/threads/the-inverse-battle-ǝɯɐƃɐʇǝɯ.3492433/ You may use ONE pokemon. No sleep, no sash, no ubers (except mega gengar). ',
        };
        try {
            return this.sendReplyBox(messages[target]);
        } catch (e) {
            this.sendReply('There is no target named /one ' + target);
        }
        if (!target) {
            this.sendReplyBox('Available commands for /one: ' + Object.keys(messages).join(', '));
        }
    },

    color: function(target, room, user) {
        if (!this.canBroadcast()) return;
        if (target === 'list' || target === 'help' || target === 'options') {
            return this.sendReplyBox('The random colors are: <b><font color="red">Red</font>, <font color="blue">Blue</font>, <font color="orange">Orange</font>, <font color="green">Green</font>, <font color="teal">Teal</font>, <font color="brown">Brown</font>, <font color="black">Black</font>, <font color="purple">Purple</font>, <font color="pink">Pink</font>, <font color="gray">Gray</font>, <font color="tan">Tan</font>, <font color="gold">Gold</font>, <font color=#CC0000>R</font><font color=#AE1D00>a</font><font color=#913A00>i</font><font color=#745700>n</font><font color=#577400>b</font><font color=#3A9100>o</font><font color=#1DAE00>w</font>.');
        }
        var colors = ['Red', 'Blue', 'Orange', 'Green', 'Teal', 'Brown', 'Black', 'Purple', 'Pink', 'Grey', 'Tan', 'Gold'];
        var results = colors[Math.floor(Math.random() * colors.length)];
        if (results == 'Rainbow') {
            return this.sendReply('The random color is :<b><font color=#CC0000>R</font><font color=#AE1D00>a</font><font color=#913A00>i</font><font color=#745700>n</font><font color=#577400>b</font><font color=#3A9100>o</font><font color=#1DAE00>w</font></b>');
        } else {
            return this.sendReplyBox('The random color is:<b><font color=' + results + '>' + results + '</font></b>');
        }
    },

    guesscolor: function(target, room, user) {
        if (!target) return this.sendReply('/guesscolor [color] - Guesses a random color.');
        var html = ['<img ', '<a href', '<font ', '<marquee', '<blink', '<center'];
        for (var x in html) {
            if (target.indexOf(html[x]) > -1) return this.sendReply('HTML is not supported in this command.');
        }
        if (target.length > 15) return this.sendReply('This new room suggestion is too long; it cannot exceed 15 characters.');
        if (!this.canTalk()) return;
        Rooms.rooms.room.add('|html|<font size="4"><b>New color guessed!</b></font><br><b>Guessed by:</b> ' + user.userid + '<br><b>Color:</b> ' + target + '');
        this.sendReply('Thanks, your new color guess has been sent.  We\'ll review your color soon and get back to you. ("' + target + '")');
    },


    pick: 'pickrandom',
    pickrandom: function(target, room, user) {
        var options = target.split(',');
        if (options.length < 2) return this.parse('/help pick');
        if (!this.canBroadcast()) return false;
        return this.sendReplyBox('<em>We randomly picked:</em> ' + Tools.escapeHTML(options.sample().trim()));
    },

    register: function() {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('You will be prompted to register upon winning a rated battle. Alternatively, there is a register button in the <button name="openOptions"><i class="icon-cog"></i> Options</button> menu in the upper right.');
    },

    lobbychat: function(target, room, user, connection) {
        if (!Rooms.lobby) return this.popupReply("This server doesn't have a lobby.");
        target = toId(target);
        if (target === 'off') {
            user.leaveRoom(Rooms.lobby, connection.socket);
            connection.send('|users|');
            this.sendReply("You are now blocking lobby chat.");
        } else {
            user.joinRoom(Rooms.lobby, connection);
            this.sendReply("You are now receiving lobby chat.");
        }
    },

    showimage: function(target, room, user) {
        if (!target) return this.parse('/help showimage');
        if (!this.can('declare', null, room)) return false;
        if (!this.canBroadcast()) return;

        var targets = target.split(',');
        if (targets.length !== 3) {
            return this.parse('/help showimage');
        }

        this.sendReply('|raw|<img src="' + Tools.escapeHTML(targets[0]) + '" alt="" width="' + toId(targets[1]) + '" height="' + toId(targets[2]) + '" />');
    },

    htmlbox: function(target, room, user) {
        if (!target) return this.parse('/help htmlbox');
        if (!this.can('declare', null, room)) return;
        if (!this.canHTML(target)) return;
        if (!this.canBroadcast('!htmlbox')) return;

        this.sendReplyBox(target);
    },

    shtmlbox: function(target, room, user) {
        if (!target) return this.parse('/help htmlbox');
        if (!this.can('lock')) return false;
        if (!this.canHTML(target)) return;
        if (!this.canBroadcast('!htmlbox')) return;

        this.sendReplyBox(target);
    },

    a: function(target, room, user) {
        if (!this.canTalk()) return;
        if (!this.can('rawpacket')) return false;
        // secret sysop command
        room.add(target);
    },

    temote: 'temotes',
    toggleemotes: 'temotes',
    temotes: function(target, room, user) {
        if (!user.can('pban')) return;
        if (!target) return this.sendReply('Valid targets are: "on", "off" and "status".');
        if (toId(target) === 'off' || toId(target) === 'disable') {
            Core.settings.emoteStatus = false;
            room.add(Tools.escapeHTML(user.name) + ' has disabled chat emotes.');
            this.logModCommand(Tools.escapeHTML(user.name) + ' has disabled chat emotes.');
        }
        if (toId(target) === 'on' || toId(target) === 'enable') {
            Core.settings.emoteStatus = true;
            room.add(Tools.escapeHTML(user.name) + ' has enabled chat emotes.');
            this.logModCommand(Tools.escapeHTML(user.name) + ' has enabled chat emotes.');
        }
        if (toId(target) === 'status') {
            var currentEmoteStatus = '';
            if (!Core.settings.emoteStatus) {
                currentEmoteStatus = 'disabled.';
            } else {
                currentEmoteStatus = 'enabled.';
            }
            return this.sendReply('Chat emotes are currently ' + currentEmoteStatus);
        }
    },

    emotes: 'emoticon',
    emoticons: 'emoticon',
    emoticon: function(target, room, user) {
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
            this.sendReplyBox('<b><u>List of emoticons:</b></u> <br/><br/>' + emoticons.join(' ').toString());
        }
    },

    sca: 'customavatar',
    setcustomavatar: 'customavatar',
    setcustomavi: 'customavatar',
    giveavatar: 'customavatar',
    customavatars: 'customavatar',
    customavatar: (function() {
        const script = (function() {/*
          
            FILENAME=`mktemp`
            function cleanup {
            rm -f $FILENAME
            }
            trap cleanup EXIT
            set -xe
            timeout 10 wget "$1" -nv -O $FILENAME
            FRAMES=`identify $FILENAME | wc -l`
            if [ $FRAMES -gt 1 ]; then
            EXT=".gif"
            else
            EXT=".png"
            fi
            timeout 10 convert $FILENAME -layers TrimBounds -coalesce -adaptive-resize 80x80\> -background transparent -gravity center -extent 80x80 "$2$EXT"
           
        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
        var pendingAdds = {};
        return function(target, room, user) {
            var parts = target.split(',');
            var cmd = parts[0].trim().toLowerCase();
            if (cmd in {
                    '': 1,
                    show: 1,
                    view: 1,
                    display: 1
                }) {
                var message = "";
                for (var a in Config.customavatars)
                    message += "<strong>" + Tools.escapeHTML(a) + ":</strong> " + Tools.escapeHTML(Config.customavatars[a]) + "<br />";
                return this.sendReplyBox(message);
            }
            if (!this.can('giveavatar') && !user.vip) return false;
            switch (cmd) {
                case 'add':
                case 'set':
                    var userid = toId(parts[1]);
                    if (!this.can('giveavatar') && user.vip && userid !== user.userid) return false;
                    var user = Users.getExact(userid);
                    var avatar = parts.slice(2).join(',').trim();
                    if (!userid) return this.sendReply("You didn't specify a user.");
                    if (Config.customavatars[userid]) return this.sendReply(userid + " already has a custom avatar.");
                    var hash = require('crypto').createHash('sha512').update(userid + '\u0000' + avatar).digest('hex').slice(0, 8);
                    pendingAdds[hash] = {
                        userid: userid,
                        avatar: avatar
                    };
                    parts[1] = hash;
                    if (!user) {
                        this.sendReply("Warning: " + userid + " is not online.");
                        this.sendReply("If you want to continue, use: /customavatar forceset, " + hash);
                        return;
                    }
                    // Fallthrough
                case 'forceset':
                    var hash = parts[1].trim();
                    if (!pendingAdds[hash]) return this.sendReply("Invalid hash.");
                    var userid = pendingAdds[hash].userid;
                    var avatar = pendingAdds[hash].avatar;
                    delete pendingAdds[hash];
                    require('child_process').execFile('bash', ['-c', script, '-', avatar, './config/avatars/' + userid], (function(e, out, err) {
                        if (e) {
                            this.sendReply(userid + "'s custom avatar failed to be set. Script output:");
                            (out + err).split('\n').forEach(this.sendReply.bind(this));
                            return;
                        }
                        reloadCustomAvatars();
                        this.sendReply(userid + "'s custom avatar has been set.");
                        Rooms.rooms.staff.add(parts[1] + ' has received a custom avatar from ' + user.name + '.');
                    }).bind(this));
                    break;
                case 'rem':
                case 'remove':
                case 'del':
                case 'delete':
                    var userid = toId(parts[1]);
                    if (!this.can('giveavatar') && user.vip && userid !== user.userid) return false;
                    if (!Config.customavatars[userid]) return this.sendReply(userid + " does not have a custom avatar.");
                    if (Config.customavatars[userid].toString().split('.').slice(0, -1).join('.') !== userid)
                        return this.sendReply(userid + "'s custom avatar (" + Config.customavatars[userid] + ") cannot be removed with this script.");
                    require('fs').unlink('./config/avatars/' + Config.customavatars[userid], (function(e) {
                        if (e) return this.sendReply(userid + "'s custom avatar (" + Config.customavatars[userid] + ") could not be removed: " + e.toString());
                        delete Config.customavatars[userid];
                        this.sendReply(userid + "'s custom avatar removed successfully");
                    }).bind(this));
                    break;
                default:
                    return this.sendReply("Invalid command. Valid commands are `/customavatar set, user, avatar` and `/customavatar delete, user`.");
            }
        };
    })(),

    /*********************************************************
     * Help commands
     *********************************************************/


    commands: 'help',
    h: 'help',
    '?': 'help',
    help: function(target, room, user) {
        target = target.toLowerCase();
        var matched = false;
        if (target === 'msg' || target === 'pm' || target === 'whisper' || target === 'w') {
            matched = true;
            this.sendReply("/msg OR /whisper OR /w [username], [message] - Send a private message.");
        }
        if (target === 'r' || target === 'reply') {
            matched = true;
            this.sendReply("/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.");
        }
        if (target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder') {
            matched = true;
            this.sendReply("/rating - Get your own rating.");
            this.sendReply("/rating [username] - Get user's rating.");
        }
        if (target === 'nick') {
            matched = true;
            this.sendReply("/nick [new username] - Change your username.");
        }
        if (target === 'avatar') {
            matched = true;
            this.sendReply("/avatar [new avatar number] - Change your trainer sprite.");
        }
        if (target === 'whois' || target === 'alts' || target === 'ip' || target === 'rooms') {
            matched = true;
            this.sendReply("/whois - Get details on yourself: alts, group, IP address, and rooms.");
            this.sendReply("/whois [username] - Get details on a username: alts (Requires: % @ & ~), group, IP address (Requires: @ & ~), and rooms.");
        }
        if (target === 'data') {
            matched = true;
            this.sendReply("/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability/nature.");
            this.sendReply("!data [pokemon/item/move/ability] - Show everyone these details. Requires: + % @ & ~");
        }
        if (target === 'details' || target === 'dt') {
            matched = true;
            this.sendReply("/details [pokemon] - Get additional details on this pokemon/item/move/ability/nature.");
            this.sendReply("!details [pokemon] - Show everyone these details. Requires: + % @ & ~");
        }
        if (target === 'analysis') {
            matched = true;
            this.sendReply("/analysis [pokemon], [generation] - Links to the Smogon University analysis for this Pokemon in the given generation.");
            this.sendReply("!analysis [pokemon], [generation] - Shows everyone this link. Requires: + % @ & ~");
        }
        if (target === 'groups') {
            matched = true;
            this.sendReply("/groups - Explains what the + % @ & next to people's names mean.");
            this.sendReply("!groups - Show everyone that information. Requires: + % @ & ~");
        }
        if (target === 'opensource') {
            matched = true;
            this.sendReply("/opensource - Links to PS's source code repository.");
            this.sendReply("!opensource - Show everyone that information. Requires: + % @ & ~");
        }
        if (target === 'avatars') {
            matched = true;
            this.sendReply("/avatars - Explains how to change avatars.");
            this.sendReply("!avatars - Show everyone that information. Requires: + % @ & ~");
        }
        if (target === 'intro') {
            matched = true;
            this.sendReply("/intro - Provides an introduction to competitive pokemon.");
            this.sendReply("!intro - Show everyone that information. Requires: + % @ & ~");
        }
        if (target === 'cap') {
            matched = true;
            this.sendReply("/cap - Provides an introduction to the Create-A-Pokemon project.");
            this.sendReply("!cap - Show everyone that information. Requires: + % @ & ~");
        }
        if (target === 'om') {
            matched = true;
            this.sendReply("/om - Provides links to information on the Other Metagames.");
            this.sendReply("!om - Show everyone that information. Requires: + % @ & ~");
        }
        if (target === 'learn' || target === 'learnset' || target === 'learnall') {
            matched = true;
            this.sendReply("/learn [pokemon], [move, move, ...] - Displays how a Pokemon can learn the given moves, if it can at all.");
            this.sendReply("!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: + % @ & ~");
        }
        if (target === 'calc' || target === 'calculator') {
            matched = true;
            this.sendReply("/calc - Provides a link to a damage calculator");
            this.sendReply("!calc - Shows everyone a link to a damage calculator. Requires: + % @ & ~");
        }
        if (target === 'blockchallenges' || target === 'away' || target === 'idle') {
            matched = true;
            this.sendReply("/away - Blocks challenges so no one can challenge you. Deactivate it with /back.");
        }
        if (target === 'allowchallenges' || target === 'back') {
            matched = true;
            this.sendReply("/back - Unlocks challenges so you can be challenged again. Deactivate it with /away.");
        }
        if (target === 'faq') {
            matched = true;
            this.sendReply("/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.");
            this.sendReply("!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: + % @ & ~");
        }
        if (target === 'highlight') {
            matched = true;
            this.sendReply("Set up highlights:");
            this.sendReply("/highlight add, word - add a new word to the highlight list.");
            this.sendReply("/highlight list - list all words that currently highlight you.");
            this.sendReply("/highlight delete, word - delete a word from the highlight list.");
            this.sendReply("/highlight delete - clear the highlight list");
        }
        if (target === 'timestamps') {
            matched = true;
            this.sendReply("Set your timestamps preference:");
            this.sendReply("/timestamps [all|lobby|pms], [minutes|seconds|off]");
            this.sendReply("all - change all timestamps preferences, lobby - change only lobby chat preferences, pms - change only PM preferences");
            this.sendReply("off - set timestamps off, minutes - show timestamps of the form [hh:mm], seconds - show timestamps of the form [hh:mm:ss]");
        }
        if (target === 'effectiveness' || target === 'matchup' || target === 'eff' || target === 'type') {
            matched = true;
            this.sendReply("/effectiveness OR /matchup OR /eff OR /type [attack], [defender] - Provides the effectiveness of a move or type on another type or a Pokémon.");
            this.sendReply("!effectiveness OR !matchup OR !eff OR !type [attack], [defender] - Shows everyone the effectiveness of a move or type on another type or a Pokémon.");
        }
        if (target === 'dexsearch' || target === 'dsearch' || target === 'ds') {
            matched = true;
            this.sendReply("/dexsearch [type], [move], [move], ... - Searches for Pokemon that fulfill the selected criteria.");
            this.sendReply("Search categories are: type, tier, color, moves, ability, gen.");
            this.sendReply("Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.");
            this.sendReply("Valid tiers are: Uber/OU/BL/UU/BL2/RU/BL3/NU/PU/NFE/LC/CAP.");
            this.sendReply("Types must be followed by ' type', e.g., 'dragon type'.");
            this.sendReply("Parameters can be excluded through the use of '!', e.g., '!water type' excludes all water types.");
            this.sendReply("The parameter 'mega' can be added to search for Mega Evolutions only, and the parameters 'FE' or 'NFE' can be added to search fully or not-fully evolved Pokemon only.");
            this.sendReply("The order of the parameters does not matter.");
        }
        if (target === 'dice' || target === 'roll') {
            matched = true;
            this.sendReply("/dice [optional max number] - Randomly picks a number between 1 and 6, or between 1 and the number you choose.");
            this.sendReply("/dice [number of dice]d[number of sides] - Simulates rolling a number of dice, e.g., /dice 2d4 simulates rolling two 4-sided dice.");
        }
        if (target === 'pick' || target === 'pickrandom') {
            matched = true;
            this.sendReply("/pick [option], [option], ... - Randomly selects an item from a list containing 2 or more elements.");
        }
        if (target === 'join') {
            matched = true;
            this.sendReply("/join [roomname] - Attempts to join the room [roomname].");
        }
        if (target === 'ignore') {
            matched = true;
            this.sendReply("/ignore [user] - Ignores all messages from the user [user].");
            this.sendReply("Note that staff messages cannot be ignored.");
        }
        if (target === 'unignore') {
            matched = true;
            this.sendReply("/unignore [user] - Removes user [user] from your ignore list.");
        }
        if (target === 'invite') {
            matched = true;
            this.sendReply("/invite [username], [roomname] - Invites the player [username] to join the room [roomname].");
        }

        // driver commands
        if (target === 'lock' || target === 'l') {
            matched = true;
            this.sendReply("/lock OR /l [username], [reason] - Locks the user from talking in all chats. Requires: % @ & ~");
        }
        if (target === 'unlock') {
            matched = true;
            this.sendReply("/unlock [username] - Unlocks the user. Requires: % @ & ~");
        }
        if (target === 'redirect' || target === 'redir') {
            matched = true;
            this.sendReply("/redirect OR /redir [username], [roomname] - Attempts to redirect the user [username] to the room [roomname]. Requires: % @ & ~");
        }
        if (target === 'modnote') {
            matched = true;
            this.sendReply("/modnote [note] - Adds a moderator note that can be read through modlog. Requires: % @ & ~");
        }
        if (target === 'forcerename' || target === 'fr') {
            matched = true;
            this.sendReply("/forcerename OR /fr [username], [reason] - Forcibly change a user's name and shows them the [reason]. Requires: % @ & ~");
        }
        if (target === 'kickbattle ') {
            matched = true;
            this.sendReply("/kickbattle [username], [reason] - Kicks a user from a battle with reason. Requires: % @ & ~");
        }
        if (target === 'warn' || target === 'k') {
            matched = true;
            this.sendReply("/warn OR /k [username], [reason] - Warns a user showing them the Pokemon Showdown Rules and [reason] in an overlay. Requires: % @ & ~");
        }
        if (target === 'modlog') {
            matched = true;
            this.sendReply("/modlog [roomid|all], [n] - Roomid defaults to current room. If n is a number or omitted, display the last n lines of the moderator log. Defaults to 15. If n is not a number, search the moderator log for 'n' on room's log [roomid]. If you set [all] as [roomid], searches for 'n' on all rooms's logs. Requires: % @ & ~");
        }
        if (target === 'mute' || target === 'm') {
            matched = true;
            this.sendReply("/mute OR /m [username], [reason] - Mutes a user with reason for 7 minutes. Requires: % @ & ~");
        }
        if (target === 'hourmute' || target === 'hm') {
            matched = true;
            this.sendReply("/hourmute OR /hm [username], [reason] - Mutes a user with reason for an hour. Requires: % @ & ~");
        }
        if (target === 'unmute' || target === 'um') {
            matched = true;
            this.sendReply("/unmute [username] - Removes mute from user. Requires: % @ & ~");
        }

        // mod commands
        if (target === 'roomban' || target === 'rb') {
            matched = true;
            this.sendReply("/roomban [username] - Bans the user from the room you are in. Requires: @ & ~");
        }
        if (target === 'roomunban') {
            matched = true;
            this.sendReply("/roomunban [username] - Unbans the user from the room you are in. Requires: @ & ~");
        }
        if (target === 'ban' || target === 'b') {
            matched = true;
            this.sendReply("/ban OR /b [username], [reason] - Kick user from all rooms and ban user's IP address with reason. Requires: @ & ~");
        }
        if (target === 'unban') {
            matched = true;
            this.sendReply("/unban [username] - Unban a user. Requires: @ & ~");
        }

        // RO commands
        if (target === 'showimage') {
            matched = true;
            this.sendReply("/showimage [url], [width], [height] - Show an image. Requires: # & ~");
        }
        if (target === 'roompromote') {
            matched = true;
            this.sendReply("/roompromote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: @ # & ~");
        }
        if (target === 'roomdemote') {
            matched = true;
            this.sendReply("/roomdemote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: @ # & ~");
        }

        // leader commands
        if (target === 'banip') {
            matched = true;
            this.sendReply("/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~");
        }
        if (target === 'unbanip') {
            matched = true;
            this.sendReply("/unbanip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~");
        }
        if (target === 'unbanall') {
            matched = true;
            this.sendReply("/unbanall - Unban all IP addresses. Requires: & ~");
        }
        if (target === 'promote') {
            matched = true;
            this.sendReply("/promote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: & ~");
        }
        if (target === 'demote') {
            matched = true;
            this.sendReply("/demote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: & ~");
        }
        if (target === 'forcetie') {
            matched = true;
            this.sendReply("/forcetie - Forces the current match to tie. Requires: & ~");
        }
        if (target === 'declare') {
            matched = true;
            this.sendReply("/declare [message] - Anonymously announces a message. Requires: & ~");
        }
        // admin commands
        if (target === 'chatdeclare' || target === 'cdeclare') {
            matched = true;
            this.sendReply("/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: ~");
        }
        if (target === 'globaldeclare' || target === 'gdeclare') {
            matched = true;
            this.sendReply("/globaldeclare [message] - Anonymously announces a message to every room on the server. Requires: ~");
        }
        if (target === 'htmlbox') {
            matched = true;
            this.sendReply("/htmlbox [message] - Displays a message, parsing HTML code contained. Requires: ~ # with global authority");
        }
        if (target === 'announce' || target === 'wall') {
            matched = true;
            this.sendReply("/announce OR /wall [message] - Makes an announcement. Requires: % @ & ~");
        }
        if (target === 'modchat') {
            matched = true;
            this.sendReply("/modchat [off/autoconfirmed/+/%/@/&/~] - Set the level of moderated chat. Requires: @ for off/autoconfirmed/+ options, & ~ for all the options");
        }
        if (target === 'hotpatch') {
            matched = true;
            this.sendReply("Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: ~");
            this.sendReply("Hot-patching has greater memory requirements than restarting.");
            this.sendReply("/hotpatch chat - reload chat-commands.js");
            this.sendReply("/hotpatch battles - spawn new simulator processes");
            this.sendReply("/hotpatch formats - reload the tools.js tree, rebuild and rebroad the formats list, and also spawn new simulator processes");
        }
        if (target === 'lockdown') {
            matched = true;
            this.sendReply("/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: ~");
        }
        if (target === 'kill') {
            matched = true;
            this.sendReply("/kill - kills the server. Can't be done unless the server is in lockdown state. Requires: ~");
        }
        if (target === 'loadbanlist') {
            matched = true;
            this.sendReply("/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: ~");
        }
        if (target === 'makechatroom') {
            matched = true;
            this.sendReply("/makechatroom [roomname] - Creates a new room named [roomname]. Requires: ~");
        }
        if (target === 'deregisterchatroom') {
            matched = true;
            this.sendReply("/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: ~");
        }
        if (target === 'roomowner') {
            matched = true;
            this.sendReply("/roomowner [username] - Appoints [username] as a room owner. Removes official status. Requires: ~");
        }
        if (target === 'roomdeowner') {
            matched = true;
            this.sendReply("/roomdeowner [username] - Removes [username]'s status as a room owner. Requires: ~");
        }
        if (target === 'privateroom') {
            matched = true;
            this.sendReply("/privateroom [on/off] - Makes or unmakes a room private. Requires: ~");
        }
        // overall
        if (target === 'help' || target === 'h' || target === '?' || target === 'commands') {
            matched = true;
            this.sendReply("/help OR /h OR /? - Gives you help.");
        }
        if (!target) {
            this.sendReply("COMMANDS: /nick, /avatar, /rating, /whois, /msg, /reply, /ignore, /away, /back, /timestamps, /highlight");
            this.sendReply("INFORMATIONAL COMMANDS: /data, /dexsearch, /groups, /opensource, /avatars, /faq, /rules, /intro, /tiers, /othermetas, /learn, /analysis, /calc (replace / with ! to broadcast. Broadcasting requires: + % @ & ~)");
            if (user.group !== Config.groupsranking[0]) {
                this.sendReply("DRIVER COMMANDS: /warn, /mute, /unmute, /alts, /forcerename, /modlog, /lock, /unlock, /announce, /redirect");
                this.sendReply("MODERATOR COMMANDS: /ban, /unban, /ip");
                this.sendReply("LEADER COMMANDS: /declare, /forcetie, /forcewin, /promote, /demote, /banip, /unbanall");
            }
            this.sendReply("For an overview of room commands, use /roomhelp");
            this.sendReply("For details of a specific command, use something like: /help data");
        } else if (!matched) {
            this.sendReply("Help for the command '" + target + "' was not found. Try /help for general help");
        }
    }
};
