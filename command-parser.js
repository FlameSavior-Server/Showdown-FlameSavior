/**
 * Command parser
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is the command parser. Call it with CommandParser.parse
 * (scroll down to its definition for details)
 *
 * Individual commands are put in:
 *   commands.js - "core" commands that shouldn't be modified
 *   config/commands.js - other commands that can be safely modified
 *
 * The command API is (mostly) documented in config/commands.js
 *
 * @license MIT license
 */
/*

To reload chat commands:

/hotpatch chat

*/
const MAX_MESSAGE_LENGTH = 300;

const BROADCAST_COOLDOWN = 20 * 1000;

const MESSAGE_COOLDOWN = 5 * 60 * 1000;

const MAX_PARSE_RECURSION = 10;

var fs = require('fs');

/*********************************************************
 * Load command files
 *********************************************************/

var commands = exports.commands = require('./commands.js').commands;

var customCommands = require('./config/commands.js');
if (customCommands && customCommands.commands) {
    Object.merge(commands, customCommands.commands);
}

// Install plug-in commands

fs.readdirSync('./chat-plugins').forEach(function(file) {
    if (file.substr(-3) === '.js') Object.merge(commands, require('./chat-plugins/' + file).commands);
});

fs.readdirSync('./funstuff').forEach(function(file) {
    if (file.substr(-3) === '.js') Object.merge(commands, require('./funstuff/' + file).commands);
});

/*********************************************************
 * Parser
 *********************************************************/

var modlog = exports.modlog = {
    lobby: fs.createWriteStream('logs/modlog/modlog_lobby.txt', {
        flags: 'a+'
    }),
    battle: fs.createWriteStream('logs/modlog/modlog_battle.txt', {
        flags: 'a+'
    })
};

/**
 * Can this user talk?
 * Shows an error message if not.
 */
function canTalk(user, room, connection, message) {
    if (!user.named) {
        connection.popup("You must choose a name before you can talk.");
        return false;
    }
    if (room && user.locked) {
        connection.sendTo(room, "You are locked from talking in chat.");
        return false;
    }
    if (room && user.mutedRooms[room.id]) {
        connection.sendTo(room, "You are muted and cannot talk in this room.");
        return false;
    }
    if (room && room.modchat) {
        if (room.modchat === 'crash') {
            if (!user.can('ignorelimits')) {
                connection.sendTo(room, "Because the server has crashed, you cannot speak in lobby chat.");
                return false;
            }
        } else {
            var userGroup = user.group;
            if (room.auth) {
                if (room.auth[user.userid]) {
                    userGroup = room.auth[user.userid];
                } else if (room.isPrivate) {
                    userGroup = ' ';
                }
            }
            if (!user.autoconfirmed && (room.auth && room.auth[user.userid] || user.group) === ' ' && room.modchat === 'autoconfirmed') {
                connection.sendTo(room, "Because moderated chat is set, your account must be at least one week old and you must have won at least one ladder game to speak in this room.");
                return false;
            } else if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(room.modchat)) {
                var groupName = Config.groups[room.modchat].name || room.modchat;
                connection.sendTo(room, "Because moderated chat is set, you must be of rank " + groupName + " or higher to speak in this room.");
                return false;
            }
        }
    }
    if (room && !(user.userid in room.users)) {
        connection.popup("You can't send a message to this room without being in it.");
        return false;
    }

    if (typeof message === 'string') {
        if (!message) {
            connection.popup("Your message can't be blank.");
            return false;
        }
        if (message.length > MAX_MESSAGE_LENGTH && !user.can('ignorelimits')) {
            connection.popup("Your message is too long:\n\n" + message);
            return false;
        }

        // remove zalgo
        message = message.replace(/[\u0300-\u036f\u0483-\u0489\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g, '');

        if (room && room.id === 'lobby') {
            var normalized = message.trim();
            if ((normalized === user.lastMessage) &&
                ((Date.now() - user.lastMessageTime) < MESSAGE_COOLDOWN)) {
                connection.popup("You can't send the same message again so soon.");
                return false;
            }
            user.lastMessage = message;
            user.lastMessageTime = Date.now();
        }

        if (Config.chatfilter) {
            return Config.chatfilter(user, room, connection, message);
        }
        return message;
    }

    return true;
}

/**
 * Command parser
 *
 * Usage:
 *   CommandParser.parse(message, room, user, connection)
 *
 * message - the message the user is trying to say
 * room - the room the user is trying to say it in
 * user - the user that sent the message
 * connection - the connection the user sent the message from
 *
 * Returns the message the user should say, or a falsy value which
 * means "don't say anything"
 *
 * Examples:
 *   CommandParser.parse("/join lobby", room, user, connection)
 *     will make the user join the lobby, and return false.
 *
 *   CommandParser.parse("Hi, guys!", room, user, connection)
 *     will return "Hi, guys!" if the user isn't muted, or
 *     if he's muted, will warn him that he's muted, and
 *     return false.
 */
var parse = exports.parse = function(message, room, user, connection, levelsDeep) {
    var cmd = '',
        target = '';
    if (!message || !message.trim().length) return;
    if (!levelsDeep) {
        levelsDeep = 0;
        // if (Config.emergencylog && (connection.ip === '62.195.195.62' || connection.ip === '86.141.154.222' || connection.ip === '189.134.175.221' || message.length > 2048 || message.length > 256 && message.substr(0, 5) !== '/utm ' && message.substr(0, 5) !== '/trn ')) {
        if (Config.emergencylog && (user.userid === 'pindapinda' || connection.ip === '62.195.195.62' || connection.ip === '86.141.154.222' || connection.ip === '189.134.175.221')) {
            Config.emergencylog.write('<' + user.name + '@' + connection.ip + '> ' + message + '\n');
        }
    } else {
        if (levelsDeep > MAX_PARSE_RECURSION) {
            return connection.sendTo(room, "Error: Too much recursion");
        }
    }

    if (message.substr(0, 3) === '>> ') {
        // multiline eval
        message = '/eval ' + message.substr(3);
    } else if (message.substr(0, 4) === '>>> ') {
        // multiline eval
        message = '/evalbattle ' + message.substr(4);
    }

    if (message.charAt(0) === '/' && message.charAt(1) !== '/') {
        var spaceIndex = message.indexOf(' ');
        if (spaceIndex > 0) {
            cmd = message.substr(1, spaceIndex - 1);
            target = message.substr(spaceIndex + 1);
        } else {
            cmd = message.substr(1);
            target = '';
        }
    } else if (message.charAt(0) === '!') {
        var spaceIndex = message.indexOf(' ');
        if (spaceIndex > 0) {
            cmd = message.substr(0, spaceIndex);
            target = message.substr(spaceIndex + 1);
        } else {
            cmd = message;
            target = '';
        }
    }
    cmd = cmd.toLowerCase();
    var broadcast = false;
    if (cmd.charAt(0) === '!') {
        broadcast = true;
        cmd = cmd.substr(1);
    }

    var commandHandler = commands[cmd];
    if (typeof commandHandler === 'string') {
        // in case someone messed up, don't loop
        commandHandler = commands[commandHandler];
    }
    if (commandHandler) {
        var context = {
            sendReply: function(data) {
                if (this.broadcasting) {
                    room.add(data, true);
                } else {
                    connection.sendTo(room, data);
                }
            },
            sendReplyBox: function(html) {
                this.sendReply('|raw|<div class="infobox">' + html + '</div>');
            },
            popupReply: function(message) {
                connection.popup(message);
            },
            add: function(data) {
                room.add(data, true);
            },
            send: function(data) {
                room.send(data);
            },
            privateModCommand: function(data, noLog) {
                this.sendModCommand(data);
                this.logEntry(data);
                this.logModCommand(data);
            },
            sendModCommand: function(data) {
                for (var i in room.users) {
                    var user = room.users[i];
                    // hardcoded for performance reasons (this is an inner loop)
                    if (user.isStaff || (room.auth && (room.auth[user.userid] || '+') !== '+')) {
                        user.sendTo(room, data);
                    }
                }
            },
            logEntry: function(data) {
                room.logEntry(data);
            },
            addModCommand: function(text, logOnlyText) {
                this.add(text);
                this.logModCommand(text + (logOnlyText || ""));
            },
            logModCommand: function(result) {
                if (!modlog[room.id]) {
                    if (room.battle) {
                        modlog[room.id] = modlog['battle'];
                    } else {
                        modlog[room.id] = fs.createWriteStream('logs/modlog/modlog_' + room.id + '.txt', {
                            flags: 'a+'
                        });
                    }
                }
                modlog[room.id].write('[' + (new Date().toJSON()) + '] (' + room.id + ') ' + result + '\n');
            },
            can: function(permission, target, room) {
                if (!user.can(permission, target, room)) {
                    this.sendReply("/" + cmd + " - Access denied.");
                    return false;
                }
                return true;
            },
            canBroadcast: function(suppressMessage) {
                if (broadcast) {
                    message = this.canTalk(message);
                    if (!message) return false;
                    if (!user.can('broadcast', null, room)) {
                        connection.sendTo(room, "You need to be voiced to broadcast this command's information.");
                        connection.sendTo(room, "To see it for yourself, use: /" + message.substr(1));
                        return false;
                    }
                    // broadcast cooldown
                    var normalized = toId(message);
                    if (room.lastBroadcast === normalized &&
                        room.lastBroadcastTime >= Date.now() - BROADCAST_COOLDOWN) {
                        connection.sendTo(room, "You can't broadcast this because it was just broadcast.");
                        return false;
                    }
                    var usercolorz = fs.readFileSync('config/usercolors.json');
                    var color = JSON.parse(usercolorz);
                    if (!color[user.userid]) {
                        this.add('|c|' + user.getIdentity(room.id) + '|' + (suppressMessage || message));

                    } else {
                        var x = (color[user.userid].blink) ? (user.name + ':').blink() : user.name + ':';
                        var y = (color[user.userid].blink) ? user.getIdentity(room.id).substring(0, 1).blink() : user.getIdentity(room.id).substring(0, 1);
                        var usercolor = color[user.userid].color;
                        if (user.getIdentity(room.id).substring(0, 1) !== ' ') {
                            if (room.battle) room.add('|html|<button class="userbuttonbattle" name="parseCommand" value="/user ' + user.name + '"><font color = "gray">' + y + '</font><b><font color = #' + usercolor + '>' + x + '</font></b></button> ' + (formatMessage(suppressMessage) || formatMessage(message)));
                            else room.add('|html|<button class="userbutton" name="parseCommand" value="/user ' + user.name + '"><font color = "gray">' + y + '</font><b><font color = #' + usercolor + '>' + x + '</font></b></button> ' + (formatMessage(suppressMessage) || formatMessage(message)));
                        } else {
                            if (room.battle) room.add('|html|<button class="userbutton" name="parseCommand" value="/user ' + user.name + '"><b><font color = #' + usercolor + '>' + x + '</font></b></button> ' + (formatMessage(suppressMessage) || formatMessage(message)));
                            else room.add('|html|<button class="userbutton" name="parseCommand" value="/user ' + user.name + '"><b><font color = #' + usercolor + '>' + x + '</font></b></button> ' + (formatMessage(suppressMessage) || formatMessage(message)));
                        }
                    }

                    room.lastBroadcast = normalized;
                    room.lastBroadcastTime = Date.now();

                    this.broadcasting = true;
                }
                return true;
            },
            parse: function(message) {
                return parse(message, room, user, connection, levelsDeep + 1);
            },
            canTalk: function(message, relevantRoom) {
                var innerRoom = (relevantRoom !== undefined) ? relevantRoom : room;
                return canTalk(user, innerRoom, connection, message);
            },
            canHTML: function(html) {
                html = '' + (html || '');
                var images = html.match(/<img\b[^<>]*/ig);
                if (!images) return true;
                for (var i = 0; i < images.length; i++) {
                    if (!/width=([0-9]+|"[0-9]+")/i.test(images[i]) || !/height=([0-9]+|"[0-9]+")/i.test(images[i])) {
                        this.sendReply('All images must have a width and height attribute');
                        return false;
                    }
                }
                return true;
            },
            targetUserOrSelf: function(target, exactName) {
                if (!target) {
                    this.targetUsername = user.name;
                    return user;
                }
                this.splitTarget(target, exactName);
                return this.targetUser;
            },
            getColor: function(name) {
                if (JSON.parse(fs.readFileSync('config/usercolors.json'))[toId(name)]) {
                    return JSON.parse(fs.readFileSync('config/usercolors.json'))[toId(name)].color;
                }

                function MD5(e) {
                    function t(e, t) {
                        var n, r, i, s, o;
                        i = e & 2147483648;
                        s = t & 2147483648;
                        n = e & 1073741824;
                        r = t & 1073741824;
                        o = (e & 1073741823) + (t & 1073741823);
                        return n & r ? o ^ 2147483648 ^ i ^ s : n | r ? o & 1073741824 ? o ^ 3221225472 ^ i ^ s : o ^ 1073741824 ^ i ^ s : o ^ i ^ s
                    }

                    function n(e, n, r, i, s, o, u) {
                        e = t(e, t(t(n & r | ~n & i, s), u));
                        return t(e << o | e >>> 32 - o, n)
                    }

                    function r(e, n, r, i, s, o, u) {
                        e = t(e, t(t(n & i | r & ~i, s), u));
                        return t(e << o | e >>> 32 - o, n)
                    }

                    function i(e, n, r, i, s, o, u) {
                        e = t(e, t(t(n ^ r ^ i, s), u));
                        return t(e << o | e >>> 32 - o, n)
                    }

                    function s(e, n, r, i, s, o, u) {
                        e = t(e, t(t(r ^ (n | ~i), s), u));
                        return t(e << o | e >>> 32 - o, n)
                    }

                    function o(e) {
                        var t = "",
                            n = "",
                            r;
                        for (r = 0; r <= 3; r++) n = e >>> r * 8 & 255, n = "0" + n.toString(16), t += n.substr(n.length - 2, 2);
                        return t
                    }
                    var u = [],
                        a, f, l, c, h, p, d, v, e = function(e) {
                            for (var e = e.replace(/\r\n/g, "\n"), t = "", n = 0; n < e.length; n++) {
                                var r = e.charCodeAt(n);
                                r < 128 ? t += String.fromCharCode(r) : (r > 127 && r < 2048 ? t += String.fromCharCode(r >> 6 | 192) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128)), t += String.fromCharCode(r & 63 | 128))
                            }
                            return t
                        }(e),
                        u = function(e) {
                            var t, n = e.length;
                            t = n + 8;
                            for (var r = ((t - t % 64) / 64 + 1) * 16, i = Array(r - 1), s = 0, o = 0; o < n;) t = (o - o % 4) / 4, s = o % 4 * 8, i[t] |= e.charCodeAt(o) << s, o++;
                            i[(o - o % 4) / 4] |= 128 << o % 4 * 8;
                            i[r - 2] = n << 3;
                            i[r - 1] = n >>> 29;
                            return i
                        }(e);
                    h = 1732584193;
                    p = 4023233417;
                    d = 2562383102;
                    v = 271733878;
                    for (e = 0; e < u.length; e += 16) a = h, f = p, l = d, c = v, h = n(h, p, d, v, u[e + 0], 7, 3614090360), v = n(v, h, p, d, u[e + 1], 12, 3905402710), d = n(d, v, h, p, u[e + 2], 17, 606105819), p = n(p, d, v, h, u[e + 3], 22, 3250441966), h = n(h, p, d, v, u[e + 4], 7, 4118548399), v = n(v, h, p, d, u[e + 5], 12, 1200080426), d = n(d, v, h, p, u[e + 6], 17, 2821735955), p = n(p, d, v, h, u[e + 7], 22, 4249261313), h = n(h, p, d, v, u[e + 8], 7, 1770035416), v = n(v, h, p, d, u[e + 9], 12, 2336552879), d = n(d, v, h, p, u[e + 10], 17, 4294925233), p = n(p, d, v, h, u[e + 11], 22, 2304563134), h = n(h, p, d, v, u[e + 12], 7, 1804603682), v = n(v, h, p, d, u[e + 13], 12, 4254626195), d = n(d, v, h, p, u[e + 14], 17, 2792965006), p = n(p, d, v, h, u[e + 15], 22, 1236535329), h = r(h, p, d, v, u[e + 1], 5, 4129170786), v = r(v, h, p, d, u[e + 6], 9, 3225465664), d = r(d, v, h, p, u[e + 11], 14, 643717713), p = r(p, d, v, h, u[e + 0], 20, 3921069994), h = r(h, p, d, v, u[e + 5], 5, 3593408605), v = r(v, h, p, d, u[e + 10], 9, 38016083), d = r(d, v, h, p, u[e + 15], 14, 3634488961), p = r(p, d, v, h, u[e + 4], 20, 3889429448), h = r(h, p, d, v, u[e + 9], 5, 568446438), v = r(v, h, p, d, u[e + 14], 9, 3275163606), d = r(d, v, h, p, u[e + 3], 14, 4107603335), p = r(p, d, v, h, u[e + 8], 20, 1163531501), h = r(h, p, d, v, u[e + 13], 5, 2850285829), v = r(v, h, p, d, u[e + 2], 9, 4243563512), d = r(d, v, h, p, u[e + 7], 14, 1735328473), p = r(p, d, v, h, u[e + 12], 20, 2368359562), h = i(h, p, d, v, u[e + 5], 4, 4294588738), v = i(v, h, p, d, u[e + 8], 11, 2272392833), d = i(d, v, h, p, u[e + 11], 16, 1839030562), p = i(p, d, v, h, u[e + 14], 23, 4259657740), h = i(h, p, d, v, u[e + 1], 4, 2763975236), v = i(v, h, p, d, u[e + 4], 11, 1272893353), d = i(d, v, h, p, u[e + 7], 16, 4139469664), p = i(p, d, v, h, u[e + 10], 23, 3200236656), h = i(h, p, d, v, u[e + 13], 4, 681279174), v = i(v, h, p, d, u[e + 0], 11, 3936430074), d = i(d, v, h, p, u[e + 3], 16, 3572445317), p = i(p, d, v, h, u[e + 6], 23, 76029189), h = i(h, p, d, v, u[e + 9], 4, 3654602809), v = i(v, h, p, d, u[e + 12], 11, 3873151461), d = i(d, v, h, p, u[e + 15], 16, 530742520), p = i(p, d, v, h, u[e + 2], 23, 3299628645), h = s(h, p, d, v, u[e + 0], 6, 4096336452), v = s(v, h, p, d, u[e + 7], 10, 1126891415), d = s(d, v, h, p, u[e + 14], 15, 2878612391), p = s(p, d, v, h, u[e + 5], 21, 4237533241), h = s(h, p, d, v, u[e + 12], 6, 1700485571), v = s(v, h, p, d, u[e + 3], 10, 2399980690), d = s(d, v, h, p, u[e + 10], 15, 4293915773), p = s(p, d, v, h, u[e + 1], 21, 2240044497), h = s(h, p, d, v, u[e + 8], 6, 1873313359), v = s(v, h, p, d, u[e + 15], 10, 4264355552), d = s(d, v, h, p, u[e + 6], 15, 2734768916), p = s(p, d, v, h, u[e + 13], 21, 1309151649), h = s(h, p, d, v, u[e + 4], 6, 4149444226), v = s(v, h, p, d, u[e + 11], 10, 3174756917), d = s(d, v, h, p, u[e + 2], 15, 718787259), p = s(p, d, v, h, u[e + 9], 21, 3951481745), h = t(h, a), p = t(p, f), d = t(d, l), v = t(v, c);
                    return (o(h) + o(p) + o(d) + o(v)).toLowerCase()
                }

                function hslToRgb(e, t, n) {
                    var r, i, s, o, u, a;
                    if (!isFinite(e)) e = 0;
                    if (!isFinite(t)) t = 0;
                    if (!isFinite(n)) n = 0;
                    e /= 60;
                    if (e < 0) e = 6 - -e % 6;
                    e %= 6;
                    t = Math.max(0, Math.min(1, t / 100));
                    n = Math.max(0, Math.min(1, n / 100));
                    u = (1 - Math.abs(2 * n - 1)) * t;
                    a = u * (1 - Math.abs(e % 2 - 1));
                    if (e < 1) {
                        r = u;
                        i = a;
                        s = 0
                    } else if (e < 2) {
                        r = a;
                        i = u;
                        s = 0
                    } else if (e < 3) {
                        r = 0;
                        i = u;
                        s = a
                    } else if (e < 4) {
                        r = 0;
                        i = a;
                        s = u
                    } else if (e < 5) {
                        r = a;
                        i = 0;
                        s = u
                    } else {
                        r = u;
                        i = 0;
                        s = a
                    }
                    o = n - u / 2;
                    r = Math.round((r + o) * 255);
                    i = Math.round((i + o) * 255);
                    s = Math.round((s + o) * 255);
                    return {
                        r: r,
                        g: i,
                        b: s
                    }
                }

                function rgbToHex(e, t, n) {
                    return toHex(e) + toHex(t) + toHex(n)
                }

                function toHex(e) {
                    if (e == null) return "00";
                    e = parseInt(e);
                    if (e == 0 || isNaN(e)) return "00";
                    e = Math.max(0, e);
                    e = Math.min(e, 255);
                    e = Math.round(e);
                    return "0123456789ABCDEF".charAt((e - e % 16) / 16) + "0123456789ABCDEF".charAt(e % 16)
                }
                var colorCache = {};
                var hashColor = function(e) {
                    if (colorCache[e]) return colorCache[e];
                    var t = MD5(e);
                    var n = parseInt(t.substr(4, 4), 16) % 360;
                    var r = parseInt(t.substr(0, 4), 16) % 50 + 50;
                    var i = parseInt(t.substr(8, 4), 16) % 20 + 25;
                    var s = hslToRgb(n, r, i);
                    colorCache[e] = "#" + rgbToHex(s.r, s.g, s.b);
                    return colorCache[e]
                }
                return hashColor(name);
            },
            getLastIdOf: function(user) {
                if (typeof user === 'string') user = Users.get(user);
                return (user.named ? user.userid : (Object.keys(user.prevNames).last() || user.userid));
            },
            splitTarget: function(target, exactName) {
                var commaIndex = target.indexOf(',');
                if (commaIndex < 0) {
                    var targetUser = Users.get(target, exactName);
                    this.targetUser = targetUser;
                    this.targetUsername = targetUser ? targetUser.name : target;
                    return '';
                }
                var targetUser = Users.get(target.substr(0, commaIndex), exactName);
                if (!targetUser) {
                    targetUser = null;
                }
                this.targetUser = targetUser;
                this.targetUsername = targetUser ? targetUser.name : target.substr(0, commaIndex);
                return target.substr(commaIndex + 1).trim();
            }
        };

        var result = commandHandler.call(context, target, room, user, connection, cmd, message);
        if (result === undefined) result = false;

        return result;
    } else {
        // Check for mod/demod/admin/deadmin/etc depending on the group ids
        for (var g in Config.groups) {
            var groupid = Config.groups[g].id;
            if (cmd === groupid) {
                return parse('/promote ' + toId(target) + ', ' + g, room, user, connection);
            } else if (cmd === 'de' + groupid || cmd === 'un' + groupid) {
                return parse('/demote ' + toId(target), room, user, connection);
            } else if (cmd === 'room' + groupid) {
                return parse('/roompromote ' + toId(target) + ', ' + g, room, user, connection);
            } else if (cmd === 'roomde' + groupid || cmd === 'deroom' + groupid || cmd === 'roomun' + groupid) {
                return parse('/roomdemote ' + toId(target), room, user, connection);
            }
        }

        if (message.substr(0, 1) === '/' && cmd) {
            // To guard against command typos, we now emit an error message
            return connection.sendTo(room.id, "The command '/" + cmd + "' was unrecognized. To send a message starting with '/" + cmd + "', type '//" + cmd + "'.");
        }
    }

    if (message.charAt(0) === '/' && message.charAt(1) !== '/') {
        message = '/' + message;
    }
    message = canTalk(user, room, connection, message);
    if (!message) return false;
    if (message.charAt(0) === '/' && message.charAt(1) !== '/') {
        return parse(message, room, user, connection, levelsDeep + 1);
    }
    var usercolorz = fs.readFileSync('config/usercolors.json');
    var color = JSON.parse(usercolorz);
    if (room && color[user.userid]) {
        var usercolor = color[user.userid].color;
        var x = (color[user.userid].blink) ? (user.name + ':').blink() : user.name + ':';
        var y = (color[user.userid].blink) ? user.getIdentity(room.id).substring(0, 1).blink() : user.getIdentity(room.id).substring(0, 1);

        message = formatMessage(message);

        var add;
        if (message.indexOf('//') === 0) message = message.substring(1);
        if (user.getIdentity().substring(0, 1) !== ' ') {
            if (room.battle) {
                add = room.add('|html|<button name="parseCommand" class="userbuttonbattle" value="/user ' + user.name + '"><font color = "gray">' + y + '</font><b><font color = #' + usercolor + '>' + x + '</font></b></button> ' + message);
            } else {
                add = room.add('|html|<button name="parseCommand" class="userbutton" value="/user ' + user.name + '"><font color = "gray">' + y + '</font><b><font color = #' + usercolor + '>' + x + '</font></b></button> ' + message);
            }
            return add;
        } else {
            if (room.battle) {
                add = room.add('|html|<button name="parseCommand" class="userbuttonbattle" value="/user ' + user.name + '"><b><font color = #' + usercolor + '>' + x + '</font></b></button> ' + message);
            } else {
                add = room.add('|html|<button name="parseCommand" class="userbutton" value="/user ' + user.name + '"><b><font color = #' + usercolor + '>' + x + '</font></b></button> ' + message);
            }
            return add;
        }

    } else {

        return message;
    }
};

exports.package = {};
fs.readFile('package.json', function(err, data) {
    if (err) return;
    exports.package = JSON.parse(data);
});

exports.uncacheTree = function(root) {
    var uncache = [require.resolve(root)];

    function getFilename(module) {
        return module.filename;
    }
    do {
        var newuncache = [];
        for (var i = 0; i < uncache.length; ++i) {
            if (require.cache[uncache[i]]) {
                newuncache.push.apply(newuncache,
                    require.cache[uncache[i]].children.map(getFilename)
                );
                delete require.cache[uncache[i]];
            }
        }
        uncache = newuncache;
    } while (uncache.length > 0);
};

function formatMessage(message) {
    if (typeof message == 'string') {
        message = message.replace(/\*\*([^< ]([^<]*?[^< ])?)\*\*/g, '<b>$1</b>').replace(/\_\_([^< ]([^<]*?[^< ])?)\_\_/g, '<i>$1</i>').replace(/\[\[([^< ]([^<`]*?[^< ])?)\]\]/ig, '<a href = http://www.google.com/search?ie=UTF-8&btnI&q=$1>$1</a>');

        message = message.replace(/(https?\:\/\/[a-z0-9-.]+(\:[0-9]+)?(\/([^\s]*[^\s?.,])?)?|[a-z0-9]([a-z0-9-\.]*[a-z0-9])?\.(com|org|net|edu|us)(\:[0-9]+)?((\/([^\s]*[^\s?.,])?)?|\b))/ig, (message.indexOf('http://') > -1 || message.indexOf('https://') > -1) ? '<a href = "$1">$1</a>' : '<a href = "http://$1">$1</a>');

        if (message.indexOf('spoiler:') > -1) {
            var position = message.indexOf('spoiler:') + 8;
            if (message.charAt(position) === ':') position++;
            if (message.charAt(position) === ' ') position++;
            message = message.substr(0, position) + '<span class = "spoiler">' + message.substr(position) + '</span>';
        }
    }
    return message;
}
