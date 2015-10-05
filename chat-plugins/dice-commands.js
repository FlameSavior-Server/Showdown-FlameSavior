/* Dice commands chat-plugin
 * by jd
*/

exports.commands = {
	gambledicehelp: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			'Dice game commands: <br />' + 
			'/startdice <bet> - Starts a game.<br />' + 
			'/joindice - Joins the game.<br />' + 
			'/enddice - Forcibly ends the game.'
		);
	},
	dicestart: 'startdice',
	startdice: function(target, room, user) {
	 	if (!this.canTalk()) return this.sendReply("You can not start dice games while unable to speak.");
	 	if (room.id !== 'gamechamber' && !user.can('pban')) return this.sendReply("Dice games should only be started in \"Game Chamber\".");
	 	//if (!user.can('broadcast',null,room)) return this.sendReply('/startdice - Access denied.');
	 	if (!target) return this.sendReply('Usage: /startdice <bet>');
	 	if (isNaN(Number(target))) return this.sendReply('/startdice - <bet> must be a number greater than 0');
	 	target = Math.round(Number(target));
	 	if (target < 1) return this.sendReply('/startdice - You can not bet less than one buck.');
	 	if (target > 500) return this.sendReply('/startdice - You can\'t bet more than 500 bucks.');
	 	var self = this;

	 	economy.readMoneyAsync(user.userid, function(userMoney) {
	 		if (!room.dice) room.dice = {};
	 		if (!room.dice.status) room.dice.status = 0;
	 		if (room.dice.status > 0) return self.sendReply('/startdice - There is already a game started in here!');
	 		room.dice.status = 1;
	 		room.dice.bet = target;
	 		room.dice.startTime = Date.now();
	 		room.addRaw('<div class="infobox"><h2><center><font color=#24678d>' + Tools.escapeHTML(user.name) + ' has started a dice game for </font><font color=red>' + target + 
	 			' </font><font color=#24678d>' + ((target === 1) ? " buck." : " bucks.") + '</font><br /> <button name="send" value="/joindice">Click to join.</button></center></h2></div>');
	 		room.update();
	 	});
	},

	joindice: function(target, room, user) {
		if (!this.canTalk()) return this.sendReply("You may not join dice games while unable to speak.");
	 	if (!room.dice) return this.sendReply('There is no dice game in it\'s signup phase in this room.');
	 	if (room.dice.status !== 1) return this.sendReply('There is no dice game in it\'s signup phase in this room.');
	 	var self = this;
	 	room.dice.status = 2;
	 	economy.readMoneyAsync(user.userid, function(userMoney) {
	 		if (userMoney < room.dice.bet) {
	 			self.sendReply('You don\'t have enough bucks to join this game.');
	 			return room.dice.status = 1;
	 		}
	 		if (!room.dice.player1) {
	 			room.dice.player1 = user.userid;
	 			room.dice.status = 1;
	 			room.addRaw('<b>' + Tools.escapeHTML(user.name) + ' has joined the dice game.</b>');
	 			return room.update();
	 		}
	 		if (room.dice.player1 === user.userid) return room.dice.status = 1;
	 		if (room.dice.player1 !== user.userid) {
	 			room.dice.player2 = user.userid;
	 			if (!Users(room.dice.player1) || !Users(room.dice.player1).userid) {
	 				room.addRaw("<b>Player 1 seems to be missing... game ending.</b>");
	 				delete room.dice.player1;
	 				delete room.dice.player2;
	 				delete room.dice.bet;
	 				delete room.dice.startTime;
	 				room.update();
	 				return false;
	 			}
	 			if (!Users(room.dice.player2) || !Users(room.dice.player2).userid) {
	 				room.addRaw("<b>Player 2 seems to be missing... game ending.</b>");
	 				delete room.dice.player1;
	 				delete room.dice.player2;
	 				delete room.dice.bet;
	 				delete room.dice.startTime;
	 				room.update();
	 				return false;
	 			}
	 			if (room.dice.player1 !== Users.get(room.dice.player1).userid) {
	 				room.addRaw('<b>Player 1 has changed names, game ending.</b>');
	 				room.dice.status = 0;
	 				delete room.dice.player1;
	 				delete room.dice.player2;
	 				delete room.dice.bet;
	 				delete room.dice.startTime;
	 				room.update();
	 				return false;
	 			}
	 			room.addRaw('<b>' + Tools.escapeHTML(user.name) + ' has joined the dice game.</b>');
	 			room.update();
	 			var firstNumber = Math.floor(6 * Math.random()) + 1;
	 			var secondNumber = Math.floor(6 * Math.random()) + 1;
	 			var firstName = Users.get(room.dice.player1).name;
	 			var secondName = Users.get(room.dice.player2).name;
	 			economy.readMoneyAsync(toId(firstName), function(firstMoney) {
		 			economy.readMoneyAsync(toId(secondName), function(secondMoney) {
	 					if (firstMoney < room.dice.bet) {
							room.dice.status = 0;
	 						delete room.dice.player1;
	 						delete room.dice.player2;
	 						delete room.dice.bet;
	 						delete room.dice.startTime;
	 						room.addRaw('<b>' + Tools.escapeHTML(firstName) + ' no longer has enough bucks to play, game ending.');
	 						return room.update();
	 					}
	 					if (secondMoney < room.dice.bet) {
							room.dice.status = 0;
	 						delete room.dice.player1;
	 						delete room.dice.player2;
	 						delete room.dice.bet;
	 						delete room.dice.startTime;
	 						room.addRaw('<b>' + Tools.escapeHTML(secondName) + ' no longer has enough bucks to play, game ending.');
	 						return room.update();
	 					}
	 					var output = '<div class="infobox">Game has two players, starting now.<br />';
	 					output += 'Rolling the dice.<br />';
	 					output += Tools.escapeHTML(firstName) + ' has rolled a ' + firstNumber + '.<br />';
	 					output += Tools.escapeHTML(secondName) + ' has rolled a ' + secondNumber + '.<br />';
						while (firstNumber === secondNumber) {
							output += 'Tie... rolling again.<br />';
	 						firstNumber = Math.floor(6 * Math.random()) + 1;
	 						secondNumber = Math.floor(6 * Math.random()) + 1;
			 				output += Tools.escapeHTML(firstName) + ' has rolled a ' + firstNumber + '.<br />';
	 						output += Tools.escapeHTML(secondName) + ' has rolled a ' + secondNumber + '.<br />';
						}
						var betMoney = room.dice.bet;
	 					if (firstNumber > secondNumber) {
	 						output += '<font color=#24678d><b>' + Tools.escapeHTML(firstName) + '</b></font> has won <font color=#24678d><b>' + betMoney + '</b></font> ' + ((betMoney === 1) ? " buck." : " bucks.") + '<br />'
	 						output += 'Better luck next time ' + Tools.escapeHTML(secondName) + '!';
	 						economy.writeMoney('money', Users.get(firstName).userid, betMoney, function() {
	 							economy.writeMoney('money', Users.get(secondName).userid,-betMoney,function() {
	 								economy.readMoneyAsync(Users.get(firstName).userid, function(firstMoney){
	 									economy.readMoneyAsync(Users.get(secondName).userid, function(secondMoney) {
	 										//logDice(firstName + ' has won ' + betMoney + ' ' + ((betMoney === 1) ? " buck." : " bucks.") + ' from a dice game with ' + secondName + '. They now have ' + firstMoney);
	 										//logDice(secondName + ' has lost ' + betMoney + ' ' + ((betMoney === 1) ? " buck." : " bucks.") + ' from a dice game with ' + firstName + '. They now have ' + secondMoney);
	 									});
	 								});
	 							});
	 						});
	 						room.dice.status = 0;
	 						delete room.dice.player1;
	 						delete room.dice.player2;
	 						delete room.dice.bet;
	 						delete room.dice.startTime;
	 					}
	 					if (secondNumber > firstNumber) {
	 						output += '<font color=#24678d><b>' + Tools.escapeHTML(secondName) + '</b></font> has won <font color=#24678d><b>' + betMoney + '</b></font> ' + ((betMoney === 1) ? " buck." : " bucks.") + '<br />';
	 						output += 'Better luck next time ' + Tools.escapeHTML(firstName) + '!';
	 						economy.writeMoney('money', Users.get(secondName).userid, betMoney, function() {
	 							economy.writeMoney('money', Users.get(firstName).userid,-betMoney,function() {
	 								economy.readMoneyAsync(Users.get(firstName).userid, function(firstMoney){
		 								economy.readMoneyAsync(Users.get(secondName).userid, function(secondMoney){
	 										//logDice(secondName + ' has won ' + betMoney + ' ' + ((betMoney === 1) ? " buck." : " bucks.") + ' from a dice game with ' + firstName + '. They now have ' + secondMoney);
	 										//logDice(firstName + ' has lost ' + betMoney + ' ' + ((betMoney === 1) ? " buck." : " bucks.") + ' from a dice game with ' + secondName + '. They now have ' + firstMoney);
		 								});
	 								});
	 							});
	 						});
	 						room.dice.status = 0;
	 						delete room.dice.player1;
	 						delete room.dice.player2;
	 						delete room.dice.bet;
	 						delete room.dice.startTime;
	 					}
	 					output += '</div>';
	 					room.addRaw(output);
	 					room.update();
	 				});
	 			});
	 		}
		});
	},
	enddice: function (target, room, user) {
		if (!this.canTalk()) return this.sendReply("You may not end dice games while unable to speak.");
		if (!room.dice) return this.sendReply('/enddice - There is no dice game in this room.');
		if (room.dice.status === 0) return this.sendReply('/enddice - There is no dice game in this room.');
		if ((Date.now() - room.dice.startTime) < 60000 && !user.can('broadcast', null, room)) return this.sendReply('Regular users may not end a dice game within the first minute of it starting.');
		room.dice = {};
		room.dice.status = 0;
		return this.add('|raw|<b>' + Tools.escapeHTML(user.name) + ' ended the dice game.');
	},
};