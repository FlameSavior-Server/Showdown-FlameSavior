/* Custom color plugin
 * by jd and panpawn
 */

var filepath = 'config/customcolors.json'; 
var goldCustomColors = {};
var fs = require('fs');
var request = require('request');

function load () {
	fs.readFile(filepath, 'utf8', function (err, file) {
		if (err) return;
		goldCustomColors = JSON.parse(file);
	});
}
load();

function save () {
	fs.writeFileSync(filepath, JSON.stringify(goldCustomColors));
}

function updateColor(name, hex) {
	goldCustomColors[toId(name)] = hex;
	save();

	var newCss = '/* COLORS START */\n';
	
	for (var name in goldCustomColors) {
		newCss += generateCSS(name, goldCustomColors[name]);
	}
	newCss += '/* COLORS END */\n';
	
	var file = fs.readFileSync('config/custom.css', 'utf8').split('\n');
	if (~file.indexOf('/* COLORS START */')) file.splice(file.indexOf('/* COLORS START */'), (file.indexOf('/* COLORS END */') - file.indexOf('/* COLORS START */')) + 1);
	fs.writeFileSync('config/custom.css', file.join('\n') + newCss);
	request('http://play.pokemonshowdown.com/customcss.php?server=gold&invalidate', function callback(error, res, body) {
		if (error) return console.log('updateColor error: ' + error);
	});
}

function generateCSS(name, color) {
	var css = '';
	var rooms = [];
	name = toId(name);
	for (var room in Rooms.rooms) {
		if (Rooms.rooms[room].id === 'global' || Rooms.rooms[room].type !== 'chat') continue;
		rooms.push('#' + Rooms.rooms[room].id + '-userlist-user-' + name + ' button strong em');
		rooms.push('#' + Rooms.rooms[room].id + '-userlist-user-' + name + ' button span');
	}
	css = rooms.join(', ');
	css += '{\ncolor: ' + color + ' !important;\n}\n';
	css += '.chat.chatmessage-' + name + ' strong {\n';
	css += 'color: ' + color + ' !important;\n}\n';
	return css;
}

exports.commands = {
	customcolor: function (target, room, user) {
		if (!this.can('hotpatch')) return this.errorReply("Access denied.");
		target = target.split(',');
		for (var u in target) target[u] = target[u].trim();
		if (!target[1]) return this.parse('/help customcolor');
		if (toId(target[0]).length > 19) return this.errorReply("Usernames are not this long...");

		this.sendReply("You have given " + Tools.escapeHTML(target[0]) + " a custom color.");
		Rooms('staff').add(Tools.escapeHTML(target[0]) + " has recieved a custom color from " + Tools.escapeHTML(user.name) + ".").update();
		updateColor(target[0], target[1]);
	},
	customcolorhelp: ["Usage: /customcolor [user], [hex] - Gives [user] a custom color of [hex]"],
};