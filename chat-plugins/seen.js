/* Seen command
 * by jd and panpawn
 */

var fs = require('fs');
var moment = require('moment');

var seenData = {};
function loadData() {
	try {
		seenData = JSON.parse(fs.readFileSync('config/seenData.json', 'utf8'));
	} catch (e) {
		seenData = {};
	}
}
loadData();

function saveData() {
	fs.writeFileSync('config/seenData.json', JSON.stringify(seenData));
}

function updateSeen(userid) {
	if (!userid) return false;
	seenData[toId(userid)] = Date.now();
	saveData();
}
global.updateSeen = updateSeen;
exports.commands = {
	seen: function (target, room, user) {
		try {
			var userNameColor = hashColor(toId(target)); 
			switch (target) {
				case 'obj':
					if (!this.canBroadcast()) return;
					this.sendReplyBox("There have been " + Object.size(seenData) + " user names recorded in this database.");
					break;
				default:
					if (!this.canBroadcast()) return;
					var userid = toId(target);
					if (userid.length < 1) return this.sendReply("/seen - Please specify a name.");
					if (Users(target) && Users(target).connected) return this.sendReplyBox('<b><font color="' + userNameColor + '">' + target + '</font></b> is currently <font color="green">online</green>.');
					if (!seenData[userid]) return this.sendReplyBox('<b><font color="' + userNameColor + '">' + target + "</font></b> has <font color=\"red\">never</font> been seen online.");
					var date = new Date(seenData[userid]);
					var userLastSeen = moment(seenData[userid]).format("MMMM Do YYYY, h:mm:ss a");
					var userLastSeenLabel = userLastSeen.substr(-2).toUpperCase(); //AM or PM
					this.sendReplyBox('The user <b><font color="' + userNameColor + '">' + target + '</font></b> was last seen online ' + userLastSeen.substring(0, userLastSeen.length - 2) + userLastSeenLabel + ' EST.');
			}
		} catch (e) {
			return this.sendReply("Something failed: \n" + e.stack);
		}
	}
};

var colorCache = {};
hashColor = function(name) {
	if (colorCache[name]) return colorCache[name];

	var hash = MD5(name);
	var H = parseInt(hash.substr(4, 4), 16) % 360;
	var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
	var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;

	var rgb = hslToRgb(H, S, L);
	colorCache[name] = "#" + rgbToHex(rgb.r, rgb.g, rgb.b);
	return colorCache[name];
}

function hslToRgb(h, s, l) {
	var r, g, b, m, c, x

	if (!isFinite(h)) h = 0
	if (!isFinite(s)) s = 0
	if (!isFinite(l)) l = 0

	h /= 60
	if (h < 0) h = 6 - (-h % 6)
	h %= 6

	s = Math.max(0, Math.min(1, s / 100))
	l = Math.max(0, Math.min(1, l / 100))

	c = (1 - Math.abs((2 * l) - 1)) * s
	x = c * (1 - Math.abs((h % 2) - 1))

	if (h < 1) {
		r = c
		g = x
		b = 0
	} else if (h < 2) {
		r = x
		g = c
		b = 0
	} else if (h < 3) {
		r = 0
		g = c
		b = x
	} else if (h < 4) {
		r = 0
		g = x
		b = c
	} else if (h < 5) {
		r = x
		g = 0
		b = c
	} else {
		r = c
		g = 0
		b = x
	}

	m = l - c / 2
	r = Math.round((r + m) * 255)
	g = Math.round((g + m) * 255)
	b = Math.round((b + m) * 255)

	return {
		r: r,
		g: g,
		b: b
	}
}

function rgbToHex(R, G, B) {
	return toHex(R) + toHex(G) + toHex(B)
}

function toHex(N) {
	if (N == null) return "00";
	N = parseInt(N);
	if (N == 0 || isNaN(N)) return "00";
	N = Math.max(0, N);
	N = Math.min(N, 255);
	N = Math.round(N);
	return "0123456789ABCDEF".charAt((N - N % 16) / 16) + "0123456789ABCDEF".charAt(N % 16);
}

var colorCache = {};

function hashColor(name) {
	if (colorCache[name]) return colorCache[name];

	var hash = MD5(name);
	var H = parseInt(hash.substr(4, 4), 16) % 360;
	var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
	var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;

	var m1, m2, hue;
	var r, g, b
	S /= 100;
	L /= 100;
	if (S == 0)
		r = g = b = (L * 255).toString(16);
	else {
		if (L <= 0.5)
			m2 = L * (S + 1);
		else
			m2 = L + S - L * S;
		m1 = L * 2 - m2;
		hue = H / 360;
		r = HueToRgb(m1, m2, hue + 1 / 3);
		g = HueToRgb(m1, m2, hue);
		b = HueToRgb(m1, m2, hue - 1 / 3);
	}


	colorCache[name] = '#' + r + g + b;
	return colorCache[name];
}
