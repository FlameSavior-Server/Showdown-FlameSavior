/* Profile plugin
 * by: jd 
 * modified by: panpawn
 */

exports.commands = {
	profile: function(target, room, user) {
		if (!target) target = user.name;
		if (toId(target).length > 19) return this.sendReply("Usernames may not be more than 19 characters long.");
		if (toId(target).length < 1) return this.sendReply(target + " is not a valid username.");
		if (!this.canBroadcast()) return;
		var targetUser = Users.get(target);
		if (!targetUser) {
			var username = target;
			var userid = toId(target);
			var avatar = (Config.customavatars[userid] ? "http://" + serverIp + ":" + Config.port + "/avatars/" + Config.customavatars[userid] : "http://play.pokemonshowdown.com/sprites/trainers/167.png");
		} else {
			var username = targetUser.name;
			var userid = targetUser.userid;
			var avatar = (isNaN(targetUser.avatar) ? "http://" + serverIp + ":" + Config.port + "/avatars/" + targetUser.avatar : "http://play.pokemonshowdown.com/sprites/trainers/" + targetUser.avatar + ".png");
		}

		if (Users.usergroups[userid]) {
			var userGroup = Users.usergroups[userid].substr(0,1);
			for (var u in Config.grouplist) {
				if (Config.grouplist[u].symbol && Config.grouplist[u].symbol === userGroup) userGroup = Config.grouplist[u].name;
			}
		} else {
			var userGroup = 'Regular User';
		}
 
		var self = this;
		readMoney(userid, function(bucks) {
			var options = {
				host: "pokemonshowdown.com",
				port: 80,
				path: "/users/" + userid
			};
 
			var content = "";
			var req = http.request(options, function(res) {
 
				res.setEncoding("utf8");
				res.on("data", function (chunk) {
					content += chunk;
				});
				res.on("end", function () {
					content = content.split("<em");
					if (content[1]) {
						content = content[1].split("</p>");
						if (content[0]) {
							content = content[0].split("</em>");
							if (content[1]) {
								regdate = content[1].trim();
								showProfile();
							}
						}
					} else {
						regdate = '(Unregistered)';
						showProfile();
					}
				});
			});
			req.end();

			function showProfile() {
				//if (!lastOnline) lastOnline = "Never";
				var profile = '';
				profile += '<img src="' + avatar + '" height=80 width=80 align=left>';
				profile += '&nbsp;<font color=#24678d><b>Name: </font><b><font color="' + hashColor(toId(username)) + '">' + Tools.escapeHTML(username) + '</font></b><br />';
				profile += '&nbsp;<font color=#24678d><b>Registered: </font></b>' + regdate + '<br />';
				if (!Users.vips[userid]) profile += '&nbsp;<font color=#24678d><b>Rank: </font></b>' + userGroup + '<br />';
				if (Users.vips[userid]) profile += '&nbsp;<font color=#24568d><b>Rank: </font></b>' + userGroup + ' (<font color=#6390F0><b>VIP User</b></font>)<br />';
				if (bucks) profile += '&nbsp;<font color=#24678d><b>Bucks: </font></b>' + bucks + '<br />';
				//if (online) profile += '&nbsp;<font color=#24678d><b>Last Online: </font></b><font color=green>Currently Online</font><br />';
				//if (!online) profile += '&nbsp;<font color=#24678d><b>Last Online: </font></b>' + lastOnline + '<br />';
				profile += '<br clear="all">';
				self.sendReplyBox(profile);
				room.update();
			}
		});
	}
};
