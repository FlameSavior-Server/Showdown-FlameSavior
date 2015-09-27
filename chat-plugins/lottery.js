/* Lottery Plug-in
 * A chat plug-in for a lottery system for PS
 * by: panpawn
 */

var moment = require('moment');

exports.commands = {
    loto: 'lottery',
    lotto: 'lottery',
    lottery: function(target, room, user) {
        var parts = target.split(',');
	for (var u in parts) parts[u] = parts[u].trim();
	if (room.id !== 'gamechamber') return this.errorReply("You must be in Game Chamber to use this command.");
	if (!Rooms.get('gamechamber')) return this.errorReply("You must have the room \"Game Chamber\" in order to use this script.");
	if (!room.lottery) room.lottery = {};   
        switch (toId(parts[0])) {
            case 'buy':
            case 'join':
                if (!room.lottery.gameActive) return this.errorReply("The game of lottery is not currently running.");
                if (economy.readMoney(toId(user.name)) < room.lottery.ticketPrice) return this.errorReply("You do not have enough bucks to partake in this game of Lottery.  Sorry.");
                if (room.lottery.players.length > 1) {
                    var filteredPlayerArray = room.lottery.players.filter(function(username) {
                        return username === toId(user.name);
                    });
                    if (filteredPlayerArray.length >= room.lottery.maxTicketsPerUser)  return this.errorReply("You cannot get more than " + room.lottery.maxTicketsPerUser + " tickets for this game of lotto.");
                }
                economy.writeMoney('money', toId(user.name), -room.lottery.ticketPrice);
                room.lottery.pot = room.lottery.pot + (room.lottery.ticketPrice * 2);
                Rooms.get('gamechamber').add("|raw|<b><font color=" + Gold.hashColor(toId(user.name)) + ">" + user.name + "</font></b> has bought a lottery ticket.");
                room.lottery.players.push(toId(user.name));
                break;
            case 'new':
            case 'create':
                if (!this.can('ban', null, room)) return this.errorReply("Access denied.");
                if (room.lottery.gameActive) return this.errorReply("There is a game of Lottery already currently running.");
                if (!parts[1]) return this.errorReply("Usage: /lottery create, [ticket cost]");
                room.lottery.maxTicketsPerUser = 10; //default max tickets per user
                room.lottery.maxTicketPrice = 20;
                if (isNaN(Number(parts[1]))) return this.errorReply('The pot must be a number greater than 0');
                if (parts[1] > room.lottery.maxTicketPrice) return this.errorReply("Lottery tickets cannot cost more than " + room.lottery.maxTicketPrice + " bucks.");
                room.lottery.startTime = Date.now();
                room.lottery.ticketPrice = parts[1];
                room.lottery.gameActive = true;
                room.lottery.pot = 0;
                room.lottery.players = [];
                var room_notification = 
                    "<div class=\"broadcast-gold\"><center><b><font size=4 color=red>Lottery Game!</font></b><br />" +
                    "<i><font color=gray>(Started by: " + Tools.escapeHTML(user.name) + ")</font></i><br />" +
                    "A game of lottery has been started!  Cost to join is <b>" + room.lottery.ticketPrice + "</b> Gold bucks.<br />" +
                    "To buy a ticket, do <code>/lotto join</code>. (Max tickets per user: " + room.lottery.maxTicketsPerUser + ")</center></div>";
                if (parts[2] === 'pmall') {
                    if (!this.can('hotpatch')) return this.errorReply("Access denied.");
                    var loto_notification =
                        "<center><font size=5 color=red><b>Lottery Game!</b></font><br />" +
                        "A game of Lottery has started in <button name=\"send\" value=\"/join gamechamber\">Game Chamber</button>!<br />" +
                        "The ticket cost to join is <b> " + room.lottery.ticketPrice + "</b> Gold Bucks.  For every ticket bought, the server automatically matches that price towards the pot.<br />" +
                        "(For more information, hop in the room and do /lotto or ask for help!)</center>";
                    var pmName = '~Gold Lottery';
		            for (var i in Users.users) {
		            	var message = '|pm|' + pmName + '|' + Users.users[i].getIdentity() + '|/html ' + loto_notification;
		            	Users.users[i].send(message);
		            }
                    Rooms.get('gamechamber').add('|raw|' + room_notification);
                } else {
                    Rooms.get('gamechamber').add('|raw|' + room_notification);
                }
                break;
            case 'end':
                if (!this.can('ban', null, room)) return this.errorReply("Access denied.");
                if (!room.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
                var winner = room.lottery.players[Math.floor(Math.random() * room.lottery.players.length)];
                var jackpot = Math.floor(100 * Math.random()) + 1;
                if (!room.lottery.pot == 0) {
                    if (jackpot == 100) {
                        Rooms.get("gamechamber").add('|raw|<b><font size="7" color="green"><blink>JACKPOT!</blink></font></b>');
                        Rooms.get("gamechamber").add('|raw|<b><font size="4" color="' + Gold.hashColor(winner) + '">' + winner + '</b></font><font size="4"> has won the game of lottery for <b>' + (room.lottery.pot * 2) + '</b> bucks!</font>');
                        economy.writeMoney('money', toId(winner), room.lottery.pot*2);
                    } else {
                        economy.writeMoney('money', toId(winner), room.lottery.pot);
                        Rooms.get("gamechamber").add('|raw|<b><font size="4" color="' + Gold.hashColor(winner) + '">' + winner + '</b></font><font size="4"> has won the game of lottery for <b>' + room.lottery.pot + '</b> bucks!</font>');
                        room.lottery = {};
                    }
                } else if (room.lottery.pot === 0) {
                    this.add('|raw|<b><font size="4">This game has been cancelled due to a lack of players by ' + Tools.escapeHTML(toId(user.name)) + '.');
                    room.lottery = {};
                }
                this.privateModCommand("(" + Tools.escapeHTML(user.name) + " has ended the game of lottery.)");
                break;
            case 'setlimit':
                if (!this.can('hotpatch')) return this.errorReply("Access denied.");
                if (!room.lottery.gameActive) return this.errorReply("The game of lottery is not currently running.");
                if (!parts[1]) return this.errorReply("Usage: /lotto setlimit, [limit of tickets per user].");
                if (isNaN(Number(parts[1]))) return this.errorReply('The pot must be a number greater than 0');
                room.lottery.maxTicketsPerUser = parts[1];
                this.add('|raw|<b><font size="4" color="' + Gold.hashColor(toId(user.name)) + '">' + Tools.escapeHTML(user.name) + '</font><font size="4"> has changed the lottery ticket cap to: ' + room.lottery.maxTicketsPerUser + '.</font></b>');
                break;
            case 'limit':
                return this.sendReply("The current cap of lottery tickets per user is: " + room.lottery.maxTicketsPerUser);
                break;
            case 'tickets':
                if (!this.canBroadcast()) return;
                if (!room.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
                return this.sendReplyBox("<b>Current tickets: (" + room.lottery.players.length + ")</b><br /> " + room.lottery.players);
                break;
            case 'status':
                if (!this.canBroadcast()) return;
                if (!room.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
                return this.sendReplyBox(
                    "<div class=\"infobox-limited\" target=\"_blank\">" +
                    "<u>Lottery Game Status:</u><br />" +
                    "Pot: <b>" + room.lottery.pot + " Gold bucks</b><br />" +
                    "Game started: <b>" + moment(room.lottery.startTime).fromNow() + "</b><br />" +
                    "Max tickets per user: <b>" + room.lottery.maxTicketsPerUser + "</b><br />" +
                    "<b>Tickets bought (" + room.lottery.players.length + "):</b><br />" +
                    room.lottery.players + "</div>"
                );
                break;
            case 'uptime':
                if (!this.canBroadcast()) return;
                if (!room.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
                return this.sendReplyBox("Lottery Game Uptime: <b>" + moment(room.lottery.startTime).fromNow() + "</b>");
                break;
            case 'pot':
                if (!this.canBroadcast()) return;
                if (!room.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
                return this.sendReplyBox("The current lottery pot is worth: <b>" + room.lottery.pot + "</b> bucks.");
                break;
            case 'obj':
                if (!this.can('hotpatch')) return this.errorReply("Access denied.");
                return this.sendReplyBox(JSON.stringify(room.lottery));
                break;
            default:
                if (!this.canBroadcast()) return;
                this.sendReplyBox(
                    "<center><b>Lottery Commands</b><br />" +
                    "<i><font color=gray>(By: panpawn)</font></i></center><br />" +
                    "<code>/lotto create, [ticket price]</code> - Starts a game of lotto with the respected ticket price. (Requires @, #, &, ~)<br />" +
                    "<code>/lotto create, [ticket price], pmall</code> - Starts a game of lotto with the respected ticket price AND notifies everyone. (Requires ~)<br />" +
                    "<code>/lotto join</code> OR <code>/loto buy</code> - Buys 1 ticket for the current game of loto (no cap set as of now).<br />" +
                    "<code>/lotto end</code> - Picks a winner of the lotto.  (Requires @, #, &, ~)<br />" +
                    "<code>/lotto setlimit, [ticketcap]</code> - Sets the cap of tickets per user.  (Requires ~)<br />" +
                    "<code>/lotto pot</code> - Shows the current pot of the game of lotto.<br />" +
                    "<code>/lotto uptime</code> - Shows how long ago the game of lottery was started.<br />" +
                    "<code>/lotto status</code> - Shows the current status of lottery.<br />" +
                    "<code>/lotto tickets</code> - Shows all of the current tickets in the current game of lotto."
                );
        }
    }
};
