/* Lottery Plug-in
 * A chat plug-in for a lottery system for PS
 * by: panpawn
 */
if (typeof Gold === 'undefined') global.Gold = {};

Gold.lottery = {
    ticketPrice: 1, //default ticket price of lottery ticket
    pot: 0,
    gameActive: false,
    maxTicketsPerUser: 10, //defualt max ticket cap for users to buy in the lottery
    players: [],
    updatePot: function(amount) {
        this.pot = (this.pot + (amount*2));
    },
};

exports.commands = {
    loto: 'lottery',
    lotto: 'lottery',
    lottery: function(target, room, user) {
    	var parts = target.split(',');
		for (var u in parts) parts[u] = parts[u].trim();
		if (room.id !== 'gamechamber') return this.errorReply("You must be in Game Chamber to use this command.");
		if (!Rooms.get('gamechamber')) return this.errorReply("You must have the room \"Game Chamber\" in order to use this script.");
        switch (toId(parts[0])) {
            case 'buy':
            case 'join':
                if (!Gold.lottery.gameActive) return this.errorReply("The game of lottery is not currently running.");
                if (economy.readMoney(toId(user.name)) < Gold.lottery.ticketPrice) return this.errorReply("You do not have enough bucks to partake in this game of Lottery.  Sorry.");
                var filteredPlayerArray = Gold.lottery.players.filter(function(username) {
                    return username === toId(user.name);
                });
                if (filteredPlayerArray.length >= Gold.lottery.maxTicketsPerUser) {
                    return this.errorReply("You cannot get more than " + Gold.lottery.maxTicketsPerUser + " tickets for this game of lotto.");
                }
                economy.writeMoney('money', toId(user.name), -Gold.lottery.ticketPrice);
                Gold.lottery.updatePot(Gold.lottery.ticketPrice);
                Rooms.get('gamechamber').add("|raw|<b><font color=" + Gold.hashColor(toId(user.name)) + ">" + user.name + "</font></b> has bought a lottery ticket.");
                Gold.lottery.players.push(toId(user.name));
                break;
            case 'new':
            case 'create':
                if (!this.can('ban', null, room)) return this.errorReply("Access denied.");
                if (Gold.lottery.gameActive) return this.errorReply("There is a game of Lottery already currently running.");
                if (!parts[1]) return this.errorReply("Usage: /lottery create, [ticket cost]");
                if (isNaN(Number(parts[1]))) return this.errorReply('The pot must be a number greater than 0');
                Gold.lottery.ticketPrice = parts[1];
                Gold.lottery.gameActive = true;
                var room_notification = 
                    "<div class=\"broadcast-gold\"><center><b><font size=4 color=red>Lottery Game!</font></b><br />" +
                    "<i><font color=gray>(Started by: " + Tools.escapeHTML(user.name) + ")</font></i><br />" +
                    "A game of lottery has been started!  Cost to join is <b>" + Gold.lottery.ticketPrice + "</b> Gold bucks.<br />" +
                    "To buy a ticket, do <code>/lotto join</code>. (Max tickets per user: " + Gold.lottery.maxTicketsPerUser + ")</center></div>";
                if (parts[2] === 'pmall') {
                    if (!this.can('hotpatch')) return this.errorReply("Access denied.");
                    var loto_notification =
                        "<center><font size=5 color=red><b>Lottery Game!</b></font><br />" +
                        "A game of Lottery has started in <button name=\"send\" value=\"/join gamechamber\">Game Chamber</button>!<br />" +
                        "The ticket cost to join is <b> " + Gold.lottery.ticketPrice + "</b> Gold Bucks.  For every ticket bought, the server automatically matches that price towards the pot.<br />" +
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
                if (!Gold.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
                var winner = Gold.lottery.players[Math.floor(Math.random() * Gold.lottery.players.length)];
                //TO:DO - Game cancelled lack of players
                Rooms.get("gamechamber").add('|raw|<b><font size="4" color="' + Gold.hashColor(winner) + '">' + winner + '</b></font><font size="4"> has won the game of lottery for <b>' + Gold.lottery.pot + '</b> bucks!</font>');
                economy.writeMoney('money', toId(winner), Gold.lottery.pot);
                Gold.lottery.pot = 0;
                Gold.lottery.players = [];
                Gold.lottery.gameActive = false;
                break;
            case 'setlimit':
                if (!this.can('hotpatch')) return this.errorReply("Access denied.");
                if (!parts[1]) return this.errorReply("Usage: /lotto setlimit, [limit of tickets per user].");
                if (isNaN(Number(parts[1]))) return this.errorReply('The pot must be a number greater than 0');
                Gold.lottery.maxTicketsPerUser = parts[1];
                this.add('|raw|<b><font size="4" color="' + Gold.hashColor(toId(user.name)) + '">' + Tools.escapeHTML(user.name) + '</font><font size="4"> has changed the lottery ticket cap to: ' + Gold.lottery.maxTicketsPerUser + '.</font></b>');
                break;
            case 'limit':
                return this.sendReply("The current cap of lottery tickets per user is: " + Gold.lottery.maxTicketsPerUser);
                break;
            case 'tickets':
                if (!this.canBroadcast()) return;
                if (!Gold.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
                return this.sendReplyBox("<b>Current tickets: (" + Gold.lottery.players.length + ")</b><br /> " + Gold.lottery.players);
                break;
            case 'pot':
                if (!this.canBroadcast()) return;
                if (!Gold.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
                return this.sendReplyBox("The current lottery pot is worth: <b>" + Gold.lottery.pot + "</b> bucks.");
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
                    "<code>/lotto tickets</code> - Shows all of the current tickets in the current game of lotto."
                );
        }
    }
};