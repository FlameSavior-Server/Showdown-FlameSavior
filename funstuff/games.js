exports.commands = {
    panagramhelp: 'panagramrules',
    panagramrules: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('<u><font size = 2><center>Pangram rules and commands</center></font></u><br />' +
            '<b>/panagram</b> - Starts a game of Panagram in the room (Panagrams are just anagrams with Pokemon). Illegal and CAP Pokemon won\'t be selected. Must be ranked + or higher to use.<br />' +
            '<b>/guessp [Pokemon]</b> - Guesses a Pokémon. After guessing incorrectly, you cannot guess again in the same game. There are a total of 3 tries per game. The answer is revealed after all 3 chances are over.<br />' +
            '<b>/panagramend</b> OR <b>/endpanagram</b> - Ends the current game of Panagram.');
    },

    panagrams: 'panagram',
    panagram: function(target, room, user) {
        if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to be able to start a game of Panagram in this room.');
        if (room.panagram) return this.sendReply('There is already a game of Panagram going on.');
        if (!this.canTalk()) return;
        var pokedex = [];
        for (var i in Tools.data.Pokedex) {
            if (Tools.data.Pokedex[i].num > 0 && !Tools.data.Pokedex[i].forme) {
                pokedex.push(i);
            }
        }
        var mixer = function(word) {
            var array = [];
            for (var k = 0; k < word.length; k++) {
                array.push(word[k]);
            }
            var a;
            var b;
            var i = array.length;
            while (i) {
                a = Math.floor(Math.random() * i);
                i--;
                b = array[i];
                array[i] = array[a];
                array[a] = b;
            }
            return array.join('').toString();
        }
        var poke = pokedex[Math.floor(Math.random() * pokedex.length)];
        var panagram = mixer(poke.toString());
        while (panagram == poke) {
            panagram = mixer(poke);
        }
        this.add('|html|<div class = "infobox"><center><b>A game of Panagram has been started!</b><br/>' +
            'The scrambled Pokémon is <b>' + panagram + '</b><br/>' +
            '<font size = 1>Type in <b>/guessp or /guesspoke [Pokémon]</b> to guess the Pokémon!');
        room.panagram = {};
        room.panagram.guessed = [];
        room.panagram.chances = 2;
        room.panagram.answer = toId(poke);
    },

    guesspoke: 'guessp',
    guessp: function(target, room, user, cmd) {
        if (!room.panagram) return this.sendReply('There is no game of Panagram going on in this room.');
        if (!this.canTalk()) return;
        if (room.panagram[user.userid]) return this.sendReply("You've already guessed once!");
        if (!target) return this.sendReply("The proper syntax is /guessp [pokemon]");
        if (!Tools.data.Pokedex[toId(target)]) return this.sendReply("'" + target + "' is not a valid Pokémon.");
        if (Tools.data.Pokedex[toId(target)].num < 1) return this.sendReply(Tools.data.Pokedex[toId(target)].species + ' is either an illegal or a CAP Pokémon. They are not used in Panagrams.');
        if (Tools.data.Pokedex[toId(target)].baseSpecies) target = toId(Tools.data.Pokedex[toId(target)].baseSpecies);
        if (room.panagram.guessed.indexOf(toId(target)) > -1) return this.sendReply("That Pokemon has already been guessed!");
        if (room.panagram.answer == toId(target)) {
            this.add('|html|<b>' + user.name + '</b> guessed <b>' + Tools.data.Pokedex[toId(target)].species + '</b>, which was the correct answer! Congratulations!');
            delete room.panagram;
        } else {
            if (room.panagram.chances > 0) {
                this.add('|html|<b>' + user.name + '</b> guessed <b>' + Tools.data.Pokedex[toId(target)].species + '</b>, but was not the correct answer...');
                room.panagram[user.userid] = toId(target);
                room.panagram.guessed.push(toId(target));
                room.panagram.chances--;
            } else {
                this.add('|html|<b>' + user.name + '</b> guessed <b>' + Tools.data.Pokedex[toId(target)].species + '</b>, but was not the correct answer. You have failed to guess the Pokemon, which was <b>' + Tools.data.Pokedex[room.panagram.answer].species + '</b>');
                delete room.panagram;
            }
        }
    },

    panagramend: 'endpanagram',
    endpanagram: function(target, room, user) {
        if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to be able to end a game of Panagram in this room.');
        if (!room.panagram) return this.sendReply('There is no Panagram game going on in this room.');
        if (!this.canTalk()) return;
        this.add("|html|<b>The game of Panagram has been ended.</b>");
        delete room.panagram;
    },

    dicerules: 'dicecommands',
    dicehelp: 'dicecommands',
    dicecommands: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('<u><font size = 2><center>Dice rules and commands</center></font></u><br />' +
            '<b>/dicegame OR /diceon [amount]</b> - Starts a dice game in the room for the specified amount of points. Must be ranked + or higher to use.<br />' +
            '<b>/play</b> - Joins the game of dice. You must have more or the same number of points the game is for. Winning a game wins you the amount of points the game is for. Losing the game removes that amount from you.<br />' +
            '<b>/diceend</b> - Ends the current game of dice in the room. You must be ranked + or higher to use this.');
    },

    dicegame: 'diceon',
    diceon: function(target, room, user, connection, cmd) {
        if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to be able to start a game of dice.');
        if (room.dice) {
            return this.sendReply('There is already a dice game going on');
        }
        target = toId(target);
        if (!target) return this.sendReply('/' + cmd + ' [amount] - Starts a dice game in the room. The specified amount will be the amount of cash betted for.');
        if (isNaN(target)) return this.sendReply('That isn\'t a number, smartass.');
        if (target < 1) return this.sendReply('You cannot start a game of dice with anything less than 1 point!');
        room.dice = {};
        room.dice.members = [];
        room.dice.award = parseInt(target);
        this.add('|html|<div class="infobox"><font color = #007cc9><center><h2>' + user.name + ' has started a dice game for <font color = green>' + room.dice.award + '</font color> Bucks!<br />' +
            '<center><button name="send" value="/play" target="_blank">Click to join!</button>');
    },

    play: function(target, room, user, connection, cmd) {
        if (!room.dice) {
            return this.sendReply('There is no dice game going on now');
        }
        if (moneyStuff.checkAmt(user.userid, 'money') < room.dice.award) {
            return this.sendReply("You don't have enough money to join this game of dice.");
        }
        for (var i = 0; i < room.dice.members.length; i++) {
            if (Users.get(room.dice.members[i]).userid == user.userid) return this.sendReply("You have already joined this game of dice!");
        }
        room.dice.members.push(user.userid);
        this.add('|html|<b>' + user.name + ' has joined the game!');
        if (room.dice.members.length == 2) {
            var point = (room.dice.award == 1) ? 'point' : 'points';
            result1 = Math.floor((Math.random() * 6) + 1);
            result2 = Math.floor((Math.random() * 6) + 1);
            if (result1 > result2) {
                var result3 = '' + Users.get(room.dice.members[0]).name + ' has won ' + room.dice.award + ' ' + point + '!';
                var losemessage = 'Better luck next time, ' + Users.get(room.dice.members[1]).name + '!';
            } else if (result2 > result1) {
                var result3 = '' + Users.get(room.dice.members[1]).name + ' has won ' + room.dice.award + ' ' + point + '!';
                var losemessage = 'Better luck next time, ' + Users.get(room.dice.members[0]).name + '!';
            } else {
                var result3;
                var losemessage;
                do {
                    result1 = Math.floor((Math.random() * 6) + 1);
                    result2 = Math.floor((Math.random() * 6) + 1);
                } while (result1 === result2);
                if (result1 > result2) {
                    result3 = '' + Users.get(room.dice.members[0]).name + ' has won ' + room.dice.award + ' ' + point + '!';
                    losemessage = 'Better luck next time, ' + Users.get(room.dice.members[1]).name + '!';
                } else {
                    result3 = '' + Users.get(room.dice.members[1]).name + ' has won ' + room.dice.award + ' ' + point + '!';
                    losemessage = 'Better luck next time, ' + Users.get(room.dice.members[0]).name + '!';
                }
            }
            var dice1, dice2;
            switch (result1) {
                case 1:
                    dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/1_zps4bef0fe2.png";
                    break;
                case 2:
                    dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/2_zpsa0efaac0.png";
                    break;
                case 3:
                    dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/3_zps36d44175.png";
                    break;
                case 4:
                    dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/4_zpsd3983524.png";
                    break;
                case 5:
                    dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/5_zpsc9bc5572.png";
                    break;
                case 6:
                    dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/6_zps05c8b6f5.png";
                    break;
            }

            switch (result2) {
                case 1:
                    dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/1_zps4bef0fe2.png";
                    break;
                case 2:
                    dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/2_zpsa0efaac0.png";
                    break;
                case 3:
                    dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/3_zps36d44175.png";
                    break;
                case 4:
                    dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/4_zpsd3983524.png";
                    break;
                case 5:
                    dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/5_zpsc9bc5572.png";
                    break;
                case 6:
                    dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/6_zps05c8b6f5.png";
                    break;
            }

            room.add('|html|<div class="infobox"><center><b>The dice game has been started!</b><br />' +
                'Rolling the dice...<br />' +
                '<img src = "' + dice2 + '" align = "left"><img src = "' + dice1 + '" align = "right"><br/>' +
                '<b>' + Users.get(room.dice.members[0]).name + '</b> rolled ' + result1 + '!<br />' +
                '<b>' + Users.get(room.dice.members[1]).name + '</b> rolled ' + result2 + '!<br />' +
                '<b>' + result3 + '</b><br />' + losemessage);
            if (result3 === '' + Users.get(room.dice.members[0]).name + ' has won ' + room.dice.award + ' ' + point + '!') {
                moneyStuff.giveAmt(Users.get(room.dice.members[0]).userid, 'money', room.dice.award);
                moneyStuff.removeAmt(Users.get(room.dice.members[1]).userid, 'money', room.dice.award);
            } else {
                moneyStuff.giveAmt(Users.get(room.dice.members[1]).userid, 'money', room.dice.award);
                moneyStuff.removeAmt(Users.get(room.dice.members[0]).userid, 'money', room.dice.award);
            }
            delete room.dice;
        }
    },

    diceend: function(target, room, user) {
        if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to end a game of dice.');
        if (!room.dice) return this.sendReply("There is no game of dice going on in this room right now.");
        this.add('|html|<b>The game of dice has been ended by ' + user.name);
        delete room.dice;
    },

    roulcommands: 'roulrules',
    roulhelp: 'roulrules',
    roulrules: function(target, room, user) {
        if (!this.canBroadcast()) return;
        if (room.id === 'lobby') return this.sendReply('This command is too spammy for lobby.');
        return this.sendReplyBox('<u><font size = 2><center>Roulette rules and commands</center></font></u><br />' +
            '<b>/roul</b> - Starts a roulette game in the room. Must be ranked + or higher to use.<br />' +
            '<b>/bet [color]</b> - Bets on a roulette color. Using this multiple times increases the number of times you\'ve bet to that color by 1. You require 1 buck per bet. Clicking on a different color changes the color your\'re betting on. <br />' +
            '<b>/participants</b> - Shows the number of participants in the game.<br />' +
            '<b>/deletebets</b> OR <b>/db</b> - Erases all of the bets you have made so far. All bucks spent for betting are refunded.<br />' +
            '<b>/spin</b> - Spins the roulette. Must be ranked + or higher to use.<br />' +
            '<b>/endroul</b> - Ends the game of roulette in the room. Any bets made will be refunded. Must be ranked + or higher to use.<br />' +
            'The values of red and yellow are 4, blue and green 5, and black, 8. The cash reward is equal to the color\'s prize value multiplied by the number of bets you\'ve made, if the roulette lands on the color you\'ve bet on.');
    },

    roulette: 'roul',
    roul: function(target, room, user) {
        if (!this.can('broadcast', null, room)) return this.sendReply('You need to be ranked + or higher to start a roulette in the room.');
        if (room.roulette) {
            return this.sendReply('There is already a roulette going on.');
        }
        room.roulette = {};
        this.add('|html|<div class = "infobox"><font size = 3, color = "green"><center><b>' + user.name + ' has started a roulette!</font><br />' +
            '<center><button name = "send", value = "/bet red"><font color = "red"><b>Red</b></font><button name = "send", value = "/bet yellow"><font color = "yellow"><b>Yellow</b></font></button><button name = "send", value = "/bet blue"><font color = "blue"><b>Blue</b></font></button><button name = "send", value = "/bet green"><font color = "green"><b>Green</b></font><button name = "send", value = "/bet black"><font color = "black"><b>Black</b></font></button>' +
            '<font size = 1><center>Click one of the buttons or do /bet [color] to place a bet on a color!</font><br />' +
            '<font size = 1><center>Type /roulrules in the chat for a list of roulette commands and rules.</font><br /></div>');
    },

    bet: function(target, room, user, connection, cmd) {
        if (!room.roulette) {
            return this.sendReply('There is no roulette going on right now.');
        }
        if (moneyStuff.checkAmt(user.userid, 'money') < 1) return this.sendReply("You don't have enough money to place bets.");
        target = toId(target);
        var targets = ['red', 'blue', 'yellow', 'green', 'black'];
        if (targets.indexOf(target) === -1) {
            return this.sendReply('Sorry, but that isn\'t a valid color.');
        }
        if (!room.roulette[user.userid]) {
            room.roulette[user.userid] = {};
            room.roulette[user.userid].color = target;
            room.roulette[user.userid].bets = 0;
        }

        if (room.roulette[user.userid].color != target) {
            var oldcolor = room.roulette[user.userid].color
            var newcolor = target;
            room.roulette[user.userid].color = target;
            var bets = (room.roulette[user.userid].bets == 1) ? 'bet' : 'bets';
            return this.sendReply('You are now betting on ' + newcolor + ' instead of ' + oldcolor + '. You are currently placing ' + room.roulette[user.userid].bets + ' ' + bets + ' on ' + newcolor + '.');
        }

        room.roulette[user.userid].color = target;
        room.roulette[user.userid].bets++;
        var bets = (room.roulette[user.userid].bets == 1) ? 'bet' : 'bets';
        this.sendReply('You have placed ' + room.roulette[user.userid].bets + ' ' + bets + ' on ' + target);
        moneyStuff.removeAmt(user.userid, 'money', 1);
    },

    db: 'deletebets',
    deletebets: function(target, room, user, connection, cmd) {
        if (!room.roulette) {
            return this.sendReply('There is no roulette going on right now.');
        }
        if (!room.roulette[user.userid]) return this.sendReply("You haven't placed any bets yet!");
        moneyStuff.giveAmt(user.userid, 'money', room.roulette[user.userid].bets);
        delete room.roulette[user.userid];
        return this.sendReply('All your bets in the current roulette have been removed.');
    },


    participants: function(target, room, user, connection, cmd) {
        if (!this.canBroadcast()) return;
        if (!room.roulette) {
            return this.sendReply('There is no roulette going on in this room right now.');
        }
        this.sendReplyBox('Number of roulette participants: ' + Object.keys(room.roulette).length);
    },

    sp: 'spin',
    spin: function(target, room, user, connection, cmd) {
        if (!room.roulette) return this.sendReply('There is no roulette going on right now.');
        if (Object.keys(room.roulette).length < 1) return this.sendReply('No bets have been made yet!');
        var random = Math.floor((Math.random() * 11) + 1);
        var payout;
        var color = '';
        var winners = [];
        if (random <= 3) {
            color = 'red';
            payout = 4;
        } else if (random <= 6) {
            color = 'yellow';
            payout = 4;
        } else if (random <= 8) {
            color = 'blue';
            payout = 5;
        } else if (random <= 10) {
            color = 'green';
            payout = 5;
        } else if (random <= 11) {
            color = 'black';
            payout = 8;
        } else {
            color = 'red';
            payout = 4;
        }

        for (var i in room.roulette) {
            if (room.roulette[i].color == color) winners.push(i);
        }
        if (winners.length <= 0) {
            this.add('|html|<div class = "infobox"><font size = 2, color = "green"><center><b>The roulette has been spun!</font><br />' +
                '<center>The roulette landed on <font color = "' + color + '"><b>' + color + '<b>!</font><br />' +
                '<center>But nobody won this time...');
        } else {
            var winnerz = '';
            for (var i = 0; i < winners.length; i++) {
                var winamount = room.roulette[toId(winners[i])].bets * payout;
                var name = (Users.getExact(winners[i])) ? Users.getExact(winners[i]).name : winners[i];
                winnerz += '<b>' + name + '</b> who won <b>' + winamount + '</b> points<br/>';
            }
            if (winners.length == 1) {
                this.add('|html|<div class = "infobox"><font size = 2, color = "green"><center><b>The roulette has been spun!</font><br />' +
                    '<center>The roulette landed on <font color = "' + color + '"><b>' + color + '<b>!</font><br />' +
                    '<center>The only winner is ' + winnerz);
            } else {
                this.add('|html|<div class = "infobox"><font size = 2, color = "green"><center><b>The roulette has been spun!</font><br />' +
                    '<center>The roulette landed on <font color = "' + color + '"><b>' + color + '<b>!</font><br />' +
                    '<center>The winners are:<br/>' +
                    '<center>' + winnerz);
            }

            for (var x = 0; x < winners.length; x++) {
                moneyStuff.giveAmt(toId(winners[x]), 'money', (payout * room.roulette[toId(winners[x])].bets));
            }
        }
        delete room.roulette;
    },

    endroulette: 'endroul',
    rouletteend: 'endroul',
    roulend: 'endroul',
    endroul: function(target, room, user, connection, cmd) {
        if (!room.roulette) return this.sendReply('There is no roulette going on right now.');
        for (var i in room.roulette) {
            moneyStuff.giveAmt(toId(i), 'money', room.roulette[i].bets);
        }
        delete room.roulette;
        this.add('|html|<b>' + user.name + ' has ended the current roulette.');
    },

    pollhelp: 'pollcommands',
    pollcommands: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('<u><font size = 2><center>Poll commands</center></font></u><br />' +
            '<b>/poll [question], [option 1], [option 2], etc.</b> - Starts a poll in the room. Must be ranked + or higher to use.<br />' +
            '<b>/vote [option]</b> - Votes on a poll option.<br />' +
            '<b>/unvote OR /removevote </b> - Removes your vote for a poll option.<br />' +
            '<b>/pollusers </b> - Checks the number of users who are voting.<br />' +
            '<b>/pollremind or /pr</b> - Checks the poll options of the poll. Can be broadcasted.<br />' +
            '<b>/pollend OR /endpoll</b> - Ends the current poll. Must be ranked + or higher to use.');
    },

    poll: function(target, room, user) {
        if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to start a poll.');
        if (room.poll) return this.sendReply('There is already a poll going on in this room.');
        if (!target) return this.sendReply('/poll [question], [option 1], [option 2], etc. - Starts a poll in the room with the given number of options.');
        target = target.split(',');
        if (target.length < 3) return this.sendReply('You need to have at least 2 different poll options.');
        var options = '';
        for (var i = 1; i < target.length; i++) {
            if (!target[i].replace(/ /g, '')) return this.sendReply('A poll option cannot be blank.');
            options += '<li><button name = "send" value = "/vote ' + target[i] + '">' + target[i] + '</button><br/>';
        }
        room.poll = {};
        room.poll.question = target[0];
        room.poll.starter = user.name;
        room.poll.users = {};
        room.poll.options = {};
        for (var i = 1; i < target.length; i++) {
            room.poll.options[target[i].toLowerCase().replace(/ /g, '')] = {};
            room.poll.options[target[i].toLowerCase().replace(/ /g, '')].name = target[i].trim();
            room.poll.options[target[i].toLowerCase().replace(/ /g, '')].count = 0;
        }
        return this.add('|html|<div class = "infobox"><center><font size = 3><b>' + target[0] + '</b></font></center><br/>' +
            '<font color = "gray" size = 2><i><b>Poll started by ' + user.name + '</b></i></font><br/>' +
            '<hr>' + options);
    },

    votes: function(target, room, user) {
        if (!room.poll) return this.sendReply('There is no poll going on in this room.');
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Number of votes: ' + Object.keys(room.poll.users).length);
    },

    voteoption: 'vote',
    vote: function(target, room, user) {
        if (!room.poll) return this.sendReply('There is no poll going on in this room.');
        target = target.toLowerCase().replace(/ /g, '');
        if (Object.keys(room.poll.options).indexOf(target) == -1) return this.sendReply("'" + target + "' is not a valid poll option.");
        for (var i in room.poll.users) {
            if (Users.get(i).userid == user.userid) return this.sendReply('One of your alts is already voting in this poll.');
        }
        if (!room.poll.users[user.userid]) {
            room.poll.users[user.userid] = room.poll.options[target].name;
            room.poll.options[target].count++;
            return this.sendReply('You are now voting for \'' + room.poll.options[target].name + '\'');
        } else {
            if (room.poll.users[user.userid] == room.poll.options[target].name) return this.sendReply("You are already voting for '" + room.poll.options[target].name + "'.");
            var oldpoll = room.poll.users[user.userid];
            room.poll.users[user.userid] = room.poll.options[target].name;
            room.poll.options[target].count++;
            room.poll.options[oldpoll].count--;
            return this.sendReply('You are now voting for \'' + room.poll.options[target].name + '\' instead of \'' + oldpoll + '\'.');
        }
    },



    pollremind: 'pr',
    pr: function(target, room, user) {
        if (!room.poll) return this.sendReply('There is no poll going on in this room.');
        if (!this.canBroadcast()) return;
        var options = '';
        for (var i in room.poll.options) {
            options += '<li><button name = "send" value = "/vote ' + room.poll.options[i].name + '">' + room.poll.options[i].name + '</button><br/>';
        }
        if (this.broadcasting) {
            this.sendReply('|html|<div class = "infobox"><center><font size = 3><b>' + room.poll.question + '</b></font></center><br/>' +
                '<font color = "gray" size = 2><i><b>Poll reminded by ' + user.name + '</b></i></font><br/>' +
                '<hr>' + options);
        } else {
            this.sendReply('|html|<div class = "infobox"><center><font size = 3><b>' + room.poll.question + '</b></font></center><br/>' +
                '<font color = "gray" size = 2><i><b>Poll started by ' + room.poll.starter + '</b></i></font><br/>' +
                '<hr>' + options);
        }
    },



    endpoll: 'endp',
    endp: function(target, room, user) {
        if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to end a poll.');
        if (Object.keys(room.poll.users).length < 2) {
            delete room.poll;
            return this.add('|html|<b>The poll has been canceled due to the lack of voters.');
        }
        var total = '';
        for (var i in room.poll.options) {
            if (room.poll.options[i].count > 0)
                total += '<li>' + room.poll.options[i].name + ' - ' + room.poll.options[i].count + ' (' + Math.round(((room.poll.options[i].count) / Object.keys(room.poll.users).length) * 100) + '%)';
        }
        this.add('|html|<div class = "infobox"><center><font size = 3><b>Results to \'' + room.poll.question + '\'</b></font></center><br/>' +
            '<font color = "gray" size = 2><i><b>Poll ended by ' + user.name + '</b></i></font><br/>' +
            '<hr>' + total);
        delete room.poll;
    }
};
