/* Lottery Plug-in
 * A chat plug-in for a lottery system for PS
 * by: panpawn
 */
if (typeof Gold === 'undefined') global.Gold = {};

Gold.lottery = {
    ticketPrice: 1, //default ticket price of lottery ticket
    pot: 0,
    gameActive: false,
    players: [],
    updatePot: function(amount) {
        this.pot = (this.pot + (amount*2));
    },
};

exports.commands = {
    loto: 'lottery',
    lottery: function(target, room, user) {
    	var parts = target.split(',');
		for (var u in parts) parts[u] = parts[u].trim();
		if (!Rooms.get('gamechamber')) return this.errorReply("You must have the room \"Game Chamber\" in order to use this script.");
        switch (toId(parts[0])) {
            case 'buy':
            case 'join':
                if (!Gold.lottery.gameActive) return this.errorReply("The game of lottery is not currently running.");
                if (economy.readMoney(toId(user.name)) < Gold.lottery.ticketPrice) return this.errorReply("You do not have enough bucks to partake in this game of Lottery.  Sorry.");
                economy.writeMoney('money', toId(user.name), -Gold.lottery.ticketPrice);
                Gold.lottery.updatePot(Gold.lottery.ticketPrice);
                Rooms.get('gamechamber').add("|raw|<b><font color=" + Gold.hashColor(toId(user.name)) + ">" + user.name + "</font></b> has bought a lottery ticket.");
                Gold.lottery.players.push(toId(user.name));
                break;
            case 'new':
            case 'create':
                if (!this.can('hotpatch')) return this.errorReply("Access denied.");
                if (Gold.lottery.gameActive) return this.errorReply("There is a game of Lottery already currently running.");
                if (!parts[1]) return this.errorReply("Usage: /lottery create, [ticket cost]");
                if (isNaN(Number(parts[1]))) return this.errorReply('The pot must be a number greater than 0');
                Gold.lottery.ticketPrice = parts[1];
                Gold.lottery.gameActive = true;
                var room_notification = 
                    "<div class=\"broadcast-gold\"><center><b><font size=4 color=red>Lottery Game!</font></b><br />" +
                    "<i><font color=gray>(Started by: " + Tools.escapeHTML(user.name) + ")</font></i><br />" +
                    "A game of lottery has been started!  Cost to join is <b>" + Gold.lottery.ticketPrice + "</b> Gold bucks.<br />" +
                    "To buy a ticket, do <code>/loto join</code>.</center></div>";
                if (parts[2] === 'pmall') {
                    var loto_notification =
                        "<center><font size=4 color=red><b>Lottery Game!</b></font><br />" +
                        "A game of Lottery has started in <button name=\"send\" value=\"/join gamechamber\">Game Chamber</button>!<br />" +
                        "The ticket cost to join is <b> " + Gold.lottery.ticketPrice + "</b> Gold Bucks.  For every ticket bought, the server automatically matches that price towards the pot.<br />" +
                        "(For more information, hop in the room and do /loto or ask for help!)</center>";
                    var pmName = '~Gold Lottery';
		            for (var i in Users.users) {
		            	var message = '|pm|' + pmName + '|' + Users.users[i].getIdentity() + '|/html ' + loto_notification;
		            	Users.users[i].send(message);
		            }
                    Rooms.get('gamechamber').add('|raw|' + room_notification);
                } else {
                    Rooms.get('gamechamber').add('|raw|' + room_notification);
                }
                //this.sendReply("You have started a lottery game for " + Gold.lottery.ticketPrice + " bucks.");
                break;
            case 'end':
                if (!this.can('hotpatch')) return this.errorReply("Access denied.");
                if (!Gold.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
                var winner = Gold.lottery.players[Math.floor(Math.random() * Gold.lottery.players.length)];
                if (!winner) {
                    Rooms.get('gamechamber').add('|raw|<h2>The game of loto has been canceled due to a lack of players.</h2>');
                    economy.writeMoney('money', toId(user.name), Gold.lottery.pot);
                    Gold.lottery.pot = 0;
                    Gold.lottery.players = [];
                    Gold.lottery.gameActive = false;
                } else {
                    Rooms.get("gamechamber").add('|raw|<b><font color="' + Gold.hashColor(toId(winner)) + '> ' + winner + "</font> has won the game of lottery for " + Gold.lottery.pot + " bucks!</b>");
                    economy.writeMoney('money', toId(user.name), Gold.lottery.pot);
                    Gold.lottery.pot = 0;
                    Gold.lottery.players = [];
                    Gold.lottery.gameActive = false;
                }
                break;
            case 'tickets':
                if (!this.canBroadcast()) return;
                if (!Gold.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
                return this.sendReplyBox("<b>Current tickets:</b><br /> " + Gold.lottery.players);
                break;
            case 'pot':
                if (!this.canBroadcast()) return;
                if (!Gold.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
                return this.sendReplyBox("The current lottery pot is worth: <b>" + Gold.lottery.pot + "</b> bucks.");
                break;
            default:
                this.sendReplyBox(
                    "<center><b>Lottery Commands</b><br />" +
                    "<i><font color=gray>(By: panpawn)</font></i></center><br />" +
                    "<code>/loto create, [ticket price]</code> - Starts a game of loto with the respected ticket price. (Requires ~)<br />" +
                    "<code>/loto create, [ticket price], pmall</code> - Starts a game of loto with the respected ticket price AND notifies everyone. (Requires ~)<br />" +
                    "<code>/loto join</code> OR <code>/loto buy</code> - Buys 1 ticket for the current game of loto (no cap set as of now).<br />" +
                    "<code>/loto end</code> - Picks a winner of the loto.  (Requires ~)<br />" +
                    "<code>/loto pot</code> - Shows the current pot of the game of loto.<br />" +
                    "<code>/loto tickets</code> - Shows all of the current tickets in the current game of loto."
                );
        }
    }
};