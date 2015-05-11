/* Biblia League plugin
 * A fun script that holds all
 * of the league ranks in a JSON
 * file to be accessed at our leisure
 * By: panpawn
 */
 
var fs = require('fs');
var serialize = require('node-serialize');
var leagueRanks = {};
var leagueName = "Biblia";
var leagueRanksToHave = ["e4", "champ", "gl", "purgatory"];

function loadLeague() {
	try {
		leagueRanks = serialize.unserialize(fs.readFileSync('config/biblia-league-ranks.json', 'utf8'));
		Object.merge(Core.biblia, leagueRanks);
	} catch (e) {};
}
setTimeout(function(){loadLeague();},1000);

function saveLeague() {
	try {
		fs.writeFileSync('config/biblia-league-ranks.json',serialize.serialize(leagueRanks));
		Object.merge(Core.biblia, leagueRanks);
	} catch (e) {};
}

exports.commands = {
	biblia: function (target, room, user) {
		if (!target) target = 'help';
		if (room.id !== 'thebiblialeague') return false;
		var parts = target.split(',');
		for (var u in parts) parts[u] = parts[u].trim();
		try {
			switch (toId(parts[0])) {
				case 'give':
				case 'giverank':
					if (!parts[1] || !parts[2]) return this.sendReply("ERROR!  Usage: /biblia give, [user], [rank] - Gives a user a league rank.");
					if (!this.can('roommod')) return this.sendReply("Only room owners and up can give a " + leagueName + " rank!");
					var targetUser = toId(parts[1]);
					if (Core.biblia[targetUser]) return this.sendReply("ERROR! The user " + targetUser + " already has a league rank!");
					if (!toId(parts[2]).match(leagueRanksToHave)) return this.sendReplyBox("Ahhhh!  You didn't enter a valid league rank! (" + leagueRanksToHave + ")");
					leagueRanks[targetUser] = Core.biblia[targetUser] = toId(parts[2]); //shouldn't have to take the id here, this is for safety precautions
					saveLeague();
					this.sendReply(targetUser + " was given the league rank of " + parts[2]);
					this.logModCommand(targetUser + " was given the league rank of " + parts[2]);
					room.add(targetUser + " was given the league rank of " + parts[2] + " by " + user.name);
					break;
				case 'take':
				case 'takerank':
					if (!this.can('roommod')) return this.sendReply("Only room owners and up can take a " + leagueName + " rank!");
					if (!parts[1]) return this.sendReply("Usage: /biblia take, [user] - Removes a users rank.");
					var targetUser = toId(parts[1]);
					if (!Core.biblia[targetUser]) return this.sendReply("ERROR!  The user " + targetUser + " does not have an existing rank to remove!");
					delete Core.biblia[targetUser];
					delete leagueRanks[targetUser];
					saveEmotes();
					this.sendReply(targetUser + "'s league rank was removed.");
					this.logModCommand(targetUser + "'s league rank was removed by " + user.name);
					room.add(targetUser + "'s league rank was removed by " + user.name);
					break;
				case 'view':
				case 'show':
					if (!this.canBroadcast()) return;
					var rank = Core.biblia[toId(parts[1])];
					if (!rank) return this.sendReply("User " + rank + " does not have a " + leagueName + " rank.");
					var img = "";
					switch (rank) {
						case 'e4':
							img = '<img src="http://www.smogon.com/media/forums/images/badges/vgc.png" title="Elite Four">';
							braek;
						case 'champ':
							img = '<img src="http://www.smogon.com/media/forums/images/badges/tr.png" title="Champion">';
							break;
						case 'gl':
							img = '<img src="http://www.smogon.com/media/forums/images/badges/tour.png" title="Gym Leader">';
							break;
						case 'purgatory':
							img = '<img src="http://www.smogon.com/media/forums/images/badges/tc.png" title="Purgatory">';
							break;
						default:
							img = '';
					}
					return this.sendReplyBox("Rank: " rank.substring(0,1).toUpperCase() + "<br />" + img);
					break;
				case 'help':
				default:
					if (!this.canBroadcast()) return;
					return this.sendReplyBox(
						"Biblia commands: <br />" +
						"/biblia give, [user], [rank] - Gives someone a league rank. Requires # and up.<br />" +
						"/biblia remove, [user] - Removes that user's league rank.  Requires # and up.<br />" +
						"/biblia show, [user] - Shows that user's league rank according to the biblia script."
					);
			}
		} catch (e) {
			console.log("AH!  THE BIBLIA SCRIPT HAS SELF DESTRUCTED!");
		}
	}
};
