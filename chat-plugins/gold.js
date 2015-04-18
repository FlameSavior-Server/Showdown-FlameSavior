
var fs = require('fs');
var badges = fs.createWriteStream('badges.txt', {'flags': 'a'});

exports.commands = {
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
        }f
        this.logEntry(user.name + ' used /gdeclare');

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
    
    hideuser: function (target, room, user, connection, cmd) {
	    if (!target) return this.sendReply('/hideuser [user] - Makes all prior messages posted by this user "poof" and replaces it with a button to see. Requires: @, &, ~');
	    if (!this.can('ban')) return false;
	    try {
	    	this.add('|unlink|hide|' + target);
	    	Rooms.rooms.staff.add(target + '\'s messages have been hidden by ' + user.name);
	    	this.logModCommand(target + '\'s messages have been hidden by ' + user.name);
	    	this.sendReply(target + '\'s messages have been sucessfully hidden.');
	    } catch (e) {
	    	this.sendReply("Something went wrong! Ahhhhhh!");
	    }
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

    goldstaff: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('The staff forums can be found <a href="https://groups.google.com/forum/#!forum/gold-staff">here</a>.');
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

    forums: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('Gold Forums can be found <a href="http://goldservers.info/forums">here</a>.');
    },
    client: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('Gold\'s custom client can be found <a href="http://goldservers.info">here</a>.');
    },
    customcolors: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	return this.sendReplyBox('Information about our custom client colors can be found <a href="http://goldservers.info/forums/showthread.php?tid=17">here</a>.');
    },
    regdate: function(target, room, user, connection) {
        if (!this.canBroadcast()) return;
        if (!target || target == "0") return this.sendReply('Lol, you can\'t do that, you nub.');
        if (!target || target == "." || target == "," || target == "'") return this.sendReply('/regdate - Please specify a valid username.'); //temp fix for symbols that break the command
        var username = target;
        target = target.replace(/\s+/g, '');
        var require = require("request");
				var self = this;
				
        request('www.pokemonshowdown.com/users/~' + target, function (error, response, content) {
            if (!(!error && response.statusCode == 200)) return;
            content = content + '';
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
        if (!this.canBroadcast()) return;
        if (room.id == 'lobby') {
            room.addRaw(
                '<div class="broadcast-black"><b><center><font size="3">Panagrams has started!</font></b>' +
                '<center>This is Gold\'s version of anagrams, but with buck prizes!  We currently have a random category and a Pokemon category!<br />' +
                '<button name="joinRoom" value="gamechamber" target="_blank">Play now!</button></center></div>'
            );
        } else {
            room.addRaw(
                '<div class="broadcast-black"><center><font size="3">A panagrams session is about to begin!</font></center></div>'
            );
        }
    },
    /*
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
    */
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

    /*****************
    * Money commands *
    *****************/

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

};
