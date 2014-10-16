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
                            data = username + ' was registered on' + regdate + '.';
                        }
                    }
                } else {
                    data = username + ' is not registered.';
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
            return this.sendReply('Very funny, now use a real number.');
        }
        if (target.length !== 12) {
            return this.sendReply('That ain\'t a real friendcode, you lazy bum! Check your 3DS!');
        }
        this.sendReply('You have successfully registered the friend code ' + target + '!');
        profile.set(user.userid, "fc", target);
    },

    fc: 'friendcode',
    fcs: 'friendcode',
    friendcode: function(target, room, user, connection, cmd) {
        if (!this.canBroadcast()) return;
        var userdetails = fs.readFileSync('config/userdetails.json');
        var code = JSON.parse(userdetails);
        if (!target) {
            if (this.broadcasting) {
                this.sendReplyBox('Click <button name="send" value = "/fc">here</button> to see the list of 3DS Friend Codes. Type in <b>/rfc [Friend Code]</b> to register yours!');
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

    place: 'location',
    setlocation: 'location',
    setplace: 'location',
    location: function(target, room, user) {
        if (!target) return this.sendReply('You need to specify your favorite pokemon (If you want to).')
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

    //You may not need this one if you aren't running a league server. If that's the case, go ahead and remove it.
    setquote: 'quote',
    quote: function(target, room, user) {
        if (!this.can('lock')) return this.sendReply('You need to be a Gym Leader or higher to be able to set a quote'); //Remove this line if you want to keep this code, but are not running a league server.
        if (!toId(target)) return this.sendReply('You need to specify your quote.');
        profile.set(user.userid, "quote", target);
        this.sendReply('Your quote has now been changed to - "' + target + '"');
    },

    //the same applies to this as well.
    setace: 'ace',
    ace: function(target, room, user) {
        if (!this.can('lock')) return this.sendReply("You need to be a Gym Leader or higher to be able to set an ace.");
        this.sendReply('Your ace pokemon has now been set as ' + target + '.');
        profile.set(user.userid, "ace", target);
    },

    punchline: function(target, room, user) {
        if (!toId(target)) return this.sendReply('You need to specify a punchline.');
        profile.set(user.userid, "punchline", target);
        this.sendReply('Your punchline has now been changed to - "' + target + '"');
    },

    profile: function(target, room, user, connection) {
        if (!this.canBroadcast()) return;
        if (!target) var target = user.userid;
        if (!Users.get(target)) return this.sendReply(target + ' not found.');
        var targetUser = Users.get(target);
        var avy = 'play.pokemonshowdown.com/sprites/trainers/' + targetUser.avatar + '.png';
        var moneh = money.checkAmt(toId(target), 'money');
        var l = profile.checkDetails(toId(target), 'location');
        var g = profile.checkDetails(toId(target), 'gender');
        var fav = profile.checkDetails(toId(target), 'favpoke');
        var fc = profile.checkDetails(toId(target), 'fc');
        target = target.replace(/\s+/g, '');
        var util = require("util"),
            http = require("http");

        var options = {
            host: "www.pokemonshowdown.com",
            port: 80,
            path: "/forum/~" + targetUser
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
                            self.sendReplyBox('<font size = 2><center><b><u>' + targetUser.name + '\'s Profile</u></font></b></center>' +
                                '<hr>' +
                                '<img src="//' + avy + '" alt="" width="80" height="80" align="left"><br />' +
                                '<b>Money</b>: ' + moneh + '<br />' +
                                '<b>Registered:</b> ' + content[1] + '<br />' +
                                '<b>Gender</b>: ' + g + '<br />' +
                                '<b>Location</b>: ' + l + '<br />' +
                                '<b>Favorite Pokémon</b>: ' + fav + '<br />' +
                                '<b>X/Y Friend Code</b>: ' + fc);
                        }
                    }
                } else {
                    self.sendReplyBox('<font size = 2><center><b><u>' + targetUser.name + '\'s Profile</u></font></b></center>' +
                        '<hr>' +
                        '<img src="//' + avy + '" alt="" width="80" height="80" align="left"><br />' +
                        '<b>Money</b>: ' + moneh + '<br />' +
                        '<b>Registered:</b> Unregistered<br />' +
                        '<b>Gender</b>: ' + g + '<br />' +
                        '<b>Location</b>: ' + l + '<br />' +
                        '<b>Favorite Pokémon</b>: ' + fav + '<br />' +
                        '<b>X/Y Friend Code</b>: ' + fc);
                }
                room.update();
            });
        });
        req.end();
    }
};
