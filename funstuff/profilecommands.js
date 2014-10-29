var fs = require("fs");
exports.commands = {

    regdate: function(target, room, user, connection) {
        if (!this.canBroadcast()) return;
        if (!toId(target)) return this.sendReply('/regdate - Please specify a valid username.');
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
                            data = '<font color = '+color.get(toId(username))+'><b>' + username + '</b></font> was registered on' + regdate + '.';
                        }
                    }
                } else {
                    data = '<font color = '+color.get(toId(username))+'><b>' + username + '</b></font> is not registered.';
                }
                self.sendReplyBox(data);
            });
        });
        req.end();
    },
    rfc: 'registerfriendcode',
    registerfc: 'registerfriendcode',
    registerfriendcode: function(target, room, user) {
        target = toId(target);
        if (!target) return this.sendReply('You need to specify a friend code.');
        if (isNaN(target)) {
            return this.sendReply("That isn't a number, you egg.");
        }
        if (target.length !== 12) {
            return this.sendReply('That is not a valid friend code.');
        }
        this.sendReply('Your friend code, ' + target.substring(0, 4) + '-' + target.substring(4, 8) + '-' + target.substring(8, 12) + ' has been successfully registered!');
        profile.set(user.userid, "fc", target);
    },

    fc: 'friendcode',
    fcs: 'friendcode',
    friendcode: function(target, room, user, connection, cmd) {
        if (!this.canBroadcast()) return;
        var userdetails = fs.readFileSync('infofiles/userdetails.json');
        var code = JSON.parse(userdetails);
        if (!target) {
            if (this.broadcasting) {
                this.sendReplyBox('Click <button name="send" value = "/fc">here</button> to see a list of 3DS Friend Codes. Type in <b>/rfc [Friend Code]</b> to register yours!');
            } else {
                var total = [];
                for (var i in code) {
                    if (!code[i].fc) continue;
                    var name = (Users.getExact(i)) ? Users.getExact(i).name : i;
                    total.push(name + '  -  ' + String(code[i].fc).substring(0, 4) + '-' + String(code[i].fc).substring(4, 8) + '-' + String(code[i].fc).substring(8, 12));
                }
                var fcs = total.join('\n');
                this.popupReply(fcs);
            }
        } else {
            var targetUser = (Users.get(target)) ? Users.getExact(target).name : target;
            if (code[toId(target)]) {
                if (!code[toId(target)].fc) {
                    return this.sendReplyBox(targetUser + ' does not have a registered Friend Code.');
                } else {
                    var codeformat = String(code[toId(target)].fc).substring(0, 4) + '-' + String(code[toId(target)].fc).substring(4, 8) + '-' + String(code[toId(target)].fc).substring(8, 12)
                    return this.sendReplyBox(targetUser + "'s Friend Code is " + codeformat);
                }
            } else {
                return this.sendReplyBox(targetUser + ' does not have a registered Friend Code.');
            }
        }
    },
    
    gender: 'setgender',
    sg: 'setgender',
    setgender: function(target, room, user) {
        if (!target) return this.sendReply('You need to specify your gender (If you want to).');
        if (target.length > 15) {
            return this.sendReply('Your gender is too long. It can only be male or female, remember that.');
        }
        if (target.toLowerCase() == 'male' || target.toLowerCase() == 'female' || target.toLowerCase() == 'hidden') {
            this.sendReply('Your gender has now been set as ' + target.toLowerCase() + '.');
            profile.set(user.userid, "gender", target.substring(0, 1).toUpperCase() + target.substring(1));
        } else this.sendReply('You can only register your gender as male or female, or \'hidden\'.');
    },

    place: 'location',
    setlocation: 'location',
    setplace: 'location',
    location: function(target, room, user) {
        if (!target) return this.sendReply('You need to specify your location.')
        if (target.length < 3) {
            return this.sendReply('That isn\'t a valid location.');
        }
        this.sendReply('Your location has now been set as ' + target + '.');
        profile.set(user.userid, "location", target);
    },

    fav: 'favepoke',
    fave: 'favepoke',
    fp: 'favepoke',
    favpoke: 'favepoke',
    favepoke: function(target, room, user) {
        if (!target) return this.sendReply('You need to specify your favorite pokemon (If you want to).')
        var poke = [];
        if (!Tools.data.Pokedex[toId(target)]) return this.sendReply(target + ' is not a valid pokemon.');
        this.sendReply('Your favorite Pokemon has now been set as ' + Tools.data.Pokedex[toId(target)].species + '.');
        profile.set(user.userid, "favpoke", String(Tools.data.Pokedex[toId(target)].species));
    },

    punchline: function(target, room, user) {
        if (!toId(target)) return this.sendReply('You need to specify a punchline.');
        target = target.trim();
        profile.set(user.userid, "punchline", target);
        this.sendReply('Your punchline has now been changed to - "' + target + '"');
    },

    profile: function(target, room, user, connection) {
        if (!this.canBroadcast()) return;
        target = toId(target);
        if (!target) target = user.userid;
        var targetUser = Users.get(target) ? Users.get(target).userid : target;
        var avy = Users.get(target) ? 'play.pokemonshowdown.com/sprites/trainers/' + targetUser.avatar + '.png' : 'play.pokemonshowdown.com/sprites/trainers/167.png';
        var moneh = money.checkAmt(targetUser, 'money');
        var punchline = profile.checkDetails(targetUser, 'punchline') == 'Unknown' ? '' : '<b>Punchline</b>: "' + profile.checkDetails(targetUser, 'punchline') + '"<br />';
        var l = profile.checkDetails(targetUser, 'location') == 'Unknown' ? '' : '<b>Location</b>: ' + profile.checkDetails(targetUser, 'location') + '<br />';
        var g = profile.checkDetails(targetUser, 'gender');
        var fc = profile.checkDetails(targetUser, 'fc') == 'Unknown' ? '' : '<b>3DS Friend Code</b>: ' + profile.checkDetails(targetUser, 'fc') + '<br />';
        var fav = profile.checkDetails(targetUser, 'favpoke') == 'Unknown' ? '' : '<b>Favorite Pokémon</b>: ' + profile.checkDetails(targetUser, 'favpoke') + '<br />';
        var user = Users.get(target) ? Users.get(target).name : target;
        target = target.replace(/\s+/g, '');
        var util = require("util"),
            http = require("http"),
            self = this;

        var options = {
            host: "www.pokemonshowdown.com",
            port: 80,
            path: "/forum/~" + targetUser
        };

        var content = "";
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
                            self.sendReplyBox('<font size = 2><center><b><font color = '+color.get(targetUser)+'>' + user + '\'s</font> Profile</font></b></center>' +
                                '<hr>' +
                                '<img src="' + avy + '" alt="" width="80" height="80" align="left"><br />' +
                                '<b>Money</b>: ' + moneh + '<br />' +
                                '<b>Registered:</b> ' + content[1] + '<br />' +
                                '<b>Gender</b>: ' + g + '<br />' +
                                punchline + l + fav + fc);
                        }
                    }
                } else {
                     self.sendReplyBox('<font size = 2><center><b><font color = '+color.get(targetUser)+'>' + user + '\'s</font> Profile</font></b></center>' +
                                '<hr>' +
                                '<img src="' + avy + '" alt="" width="80" height="80" align="left"><br />' +
                                '<b>Money</b>: ' + moneh + '<br />' +
                                '<b>Registered:</b> Unregistered<br />' +
                                '<b>Gender</b>: ' + g + '<br />' +
                                punchline + l + fav + fc);
                }
                room.update();
            });
        });
        req.end();
    }
};
