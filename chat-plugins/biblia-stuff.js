/* Biblia League plugin
 * A fun script that holds all
 * of the league ranks in a JSON
 * file to be accessed at our leisure
 * By: panpawn
 */
 
var fs = require('fs');
var serialize = require('node-serialize');
var leagueRanks = {};
var leagueFactions = {};
var leagueName = "Biblia";
var leagueRanksToHave = ["e4", "champ", "gl", "purgatory"];
var leagueFactionsToHave = ["hell", "heaven"];

function loadFaction() {
	try {
		leagueFactions = serialize.unserialize(fs.readFileSync('config/biblia-league-factions.json', 'utf8'));
		Object.merge(Core.bibliafaction, leagueFactions);
	} catch (e) {};
}
setTimeout(function(){loadFaction();},1000);

function saveFaction() {
	try {
		fs.writeFileSync('config/biblia-league-factions.json',serialize.serialize(leagueFactions));
		Object.merge(Core.bibliafaction, leagueFactions);
	} catch (e) {};
}

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
				case 'giverank':
					if (!parts[1] || !parts[2]) return this.sendReply("ERROR!  Usage: /biblia giverank, [user], [rank] - Gives a user a league rank.");
					if (!this.can('declare', null, room)) return this.sendReply("Only room owners and up can give a " + leagueName + " rank!");
					var targetUser = toId(parts[1]);
					if (Core.biblia[targetUser]) return this.sendReply("ERROR! The user " + targetUser + " already has a league rank!");
					if (toId(parts[2]) !== 'e4' || toId(parts[2]) !== 'champ' || toId(parts[2]) !== 'gl' || toId(parts[2]) !== 'purgatory') return this.sendReply("Ahhhh!  You didn't enter a valid league rank! (" + leagueRanksToHave + ")");
					leagueRanks[targetUser] = Core.biblia[targetUser] = toId(parts[2]); //shouldn't have to take the id here, this is for safety precautions
					saveLeague();
					this.sendReply(targetUser + " was given the league rank of " + parts[2]);
					this.logModCommand(targetUser + " was given the league rank of " + parts[2]);
					room.add(targetUser + " was given the league rank of " + parts[2] + " by " + user.name);
					break;
				case 'takerank':
					if (!this.can('declare', null, room)) return this.sendReply("Only room owners and up can take a " + leagueName + " rank!");
					if (!parts[1]) return this.sendReply("Usage: /biblia takerank, [user] - Removes a users rank.");
					var targetUser = toId(parts[1]);
					if (!Core.biblia[targetUser]) return this.sendReply("ERROR!  The user " + targetUser + " does not have an existing rank to remove!");
					delete Core.biblia[targetUser];
					delete leagueRanks[targetUser];
					saveLeague();
					this.sendReply(targetUser + "'s league rank was removed.");
					this.logModCommand(targetUser + "'s league rank was removed by " + user.name);
					room.add(targetUser + "'s league rank was removed by " + user.name);
					break;
				case 'givefaction':
					if (!parts[1] || !parts[2]) return this.sendReply("ERROR!  Usage: /biblia givefaction, [user], [faction] - Gives a user a league faction.");
					if (!this.can('declare', null, room)) return this.sendReply("Only room owners and up can give a " + leagueName + " faction!");
					var targetUser = toId(parts[1]);
					if (Core.bibliafaction[targetUser]) return this.sendReply("ERROR! The user " + targetUser + " already has a league rank!");
					if (toId(parts[2]) !== 'hell' || toId(parts[2]) == 'heaven') return this.sendReply("Ahhhh!  You didn't enter a valid league rank! (" + leagueFactionsToHave + ")");
					leagueFactions[targetUser] = Core.bibliafaction[targetUser] = toId(parts[2]); //shouldn't have to take the id here, this is for safety precautions
					saveFaction();
					this.sendReply(targetUser + " was given the league faction of " + parts[2]);
					this.logModCommand(targetUser + " was given the league rank of " + parts[2]);
					room.add(targetUser + " was given the league rank of " + parts[2] + " by " + user.name + ".");
					break;
				case 'takefaction':
					if (!this.can('declare', null, room)) return this.sendReply("Only room owners and up can take a " + leagueName + " faction!");
					if (!parts[1]) return this.sendReply("Usage: /biblia takefaction, [user] - Removes a users faction.");
					var targetUser = toId(parts[1]);
					if (!Core.bibliafaction[targetUser]) return this.sendReply("ERROR!  The user " + targetUser + " does not have an existing faction to remove!");
					delete Core.bibliafaction[targetUser];
					delete leagueFactions[targetUser];
					saveFaction();
					this.sendReply(targetUser + "'s league faction was removed.");
					this.logModCommand(targetUser + "'s league faction was removed by " + user.name);
					room.add(targetUser + "'s league faction was removed by " + user.name + ".");
					break;
				//Development commands
				case 'rankobject':
					if (!this.canBroadcast()) return;
					if (this.broadcasting) return this.sendReply("ERROR: this command is too spammy to broadcast.  Use / instead of ! to see it for yourself.");
					return this.sendReplyBox("Core.biblia = " + fs.readFileSync('config/biblia-league-ranks.json', 'utf8'));
					break;
				case 'factionobject':
					if (!this.canBroadcast()) return;
					if (this.broadcasting) return this.sendReply("ERROR: this command is too spammy to broadcast.  Use / instead of ! to see it for yourself.");
					return this.sendReplyBox("Core.bibliafaction = " + fs.readFileSync('config/biblia-league-factions.json', 'utf8'));
					break;
				case 'view':
				case 'show':
					if (!this.canBroadcast()) return;
					var rank = Core.biblia[toId(parts[1])];
					if (!rank) return this.sendReply("User " + parts[1] + " does not have a " + leagueName + " rank.");
					if (!Core.bibliafaction[toId(parts[1])]) return this.sendReply("User " + parts[1] + "does not have a " + leagueName + " faction.");
					var img = "";
					var rankLabel = "";
					var fuckingFaction = Core.bibliafaction[toId(parts[1])];
					if (!fuckingFaction) fuckingFaction = "None.";
					switch (rank) {
						case 'e4':
							rankLabel = "Elite Four";
							img = '<img src="http://www.smogon.com/media/forums/images/badges/vgc.png" title="' + rankLabel + '">';
							break;
						case 'champ':
							rankLabel = "Champion";
							img = '<img src="http://www.smogon.com/media/forums/images/badges/tr.png" title="' + rankLabel + '">';
							break;
						case 'gl':
							rankLabel = "Gym Leader";
							img = '<img src="http://www.smogon.com/media/forums/images/badges/tour.png" title="' + rankLabel + '">';
							break;
						case 'purgatory':
							rankLabel = "Purgatory";
							img = '<img src="http://www.smogon.com/media/forums/images/badges/tc.png" title="' + rankLabel + '">';
							break;
						default:
							img = '';
					}
					return this.sendReplyBox(
						"<b>User</b>: " + parts[1] + "<br />" +
						"<b>League Faction</b>: " + fuckingFaction.substring(0,1).toUpperCase() + fuckingFaction.substring(1,fuckingFaction.length) + "<br />" +
						"<b>League Rank</b>: " + rankLabel.substring(0,1).toUpperCase() + rankLabel.substring(1,rankLabel.length) + img
					); 
					break;
				case 'help':
				default:
					if (!this.canBroadcast()) return;
					return this.sendReplyBox(
						"Biblia commands: <br />" +
						"/biblia giverank, [user], [rank] - Gives someone a league rank. Requires # and up.<br />" +
						"/biblia takerank, [user] - Removes that user's league rank.  Requires # and up.<br />" +
						"/biblia givefaction, [user], [faction] - Gives a user a league faction. Requires # and up.<br />" +
						"/biblia takefaction, [user], [faction] - Removes that user's league faction. Requires # and up.<br />" +
						"/biblia show, [user] - Shows that user's league rank and faction according to the biblia script."
					);
			}
		} catch (e) {
			console.log("AH!  THE BIBLIA SCRIPT HAS SELF DESTRUCTED!");
		}
	}
};
