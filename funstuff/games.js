exports.commands = {
//panagrams

    panagramhelp: 'panagramrules',
    panagramrules: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('<u><font size = 2><center>Pangram rules and commands</center></font></u><br />' +
            '<b>/panagram</b> - Starts a game of Panagram in the room (Panagrams are just anagrams with Pokemon). Illegal and CAP Pokemon won\'t be selected. Must be ranked + or higher to use.<br />' +
            '<b>/guessp [Pokemon]</b> - Guesses a Pokémon. After guessing incorrectly, you cannot guess again in the same game. There are a total of 3 tries per game. The answer is revealed after all 3 chances are over.<br />' +
            '<b>/panagramend</b> OR <b>/endpanagram</b> - Ends the current game of Panagram.');
    },

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
    
    //NOTE- I haven't fully tested this game yet.
    
    dicerules: 'dicecommands',
    dicehelp: 'dicecommands',
    dicecommands: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('<u><font size = 2><center>Dice rules and commands</center></font></u><br />' +
            '<b>/dice [amount]</b> - Starts a dice game in the room for the specified amount of points. Must be ranked + or higher to use.<br />' +
            '<b>/play</b> - Joins the game of dice. You must have more or the same number of points the game is for. Winning a game wins you the amount of points the game is for. Losing the game removes that amount from you.<br />' +
            '<b>/diceend</b> - Ends the current game of dice in the room. You must be ranked + or higher to use this.');
    },

    dice: 'diceon',
    diceon: function(target, room, user) {
        if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to be able to start a game of dice.');
        if (room.dice) {
            return this.sendReply('There is already a dice game going on');
        }
        target = toId(target);
        if (!target) return this.sendReply('/dice [amount] - Starts a dice game. The specified amount will be the amount of cash betted for.');
        if (isNaN(target)) return this.sendReply('That isn\'t a number, smartass.');
        if (target < 1) return this.sendReply('You cannot start a game with anything less than 1 buck.');
        room.dice = {};
        room.dice.members = [];
        room.dice.award = parseInt(target);
        this.add('|html|<div class="infobox" style="border-color:blue"><font color = #007cc9><center><h2>' + user.name + ' has started a dice game for <font color = green>' + room.dice.award + '</font color> Bucks!<br />' +
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
            result1 = Math.floor((Math.random() * 6) + 1);
            result2 = Math.floor((Math.random() * 6) + 1);
            if (result1 > result2) {
                var result3 = '' + Users.get(room.dice.members[0]).name + ' has won ' + room.dice.award + ' points!'
            } else if (result2 > result1) {
                var result3 = '' + Users.get(room.dice.members[1]).name + ' has won ' + room.dice.award + ' points!'
            } else {
                do {
                    result1 = Math.floor((Math.random() * 6) + 1);
                    result2 = Math.floor((Math.random() * 6) + 1);
                } while (result1 === result2);
                if (result1 > result2) {
                    result3 = '' + room.dice.members[0] + ' has won ' + room.dice.award + ' points!';
                } else {
                    result3 = '' + room.dice.members[1] + ' has won ' + room.dice.award + ' points!';
                }
            }
            room.add('|html|<div class="infobox" style="border-color:blue"><b>The dice game has been started!</b><br />' +
                'Two members have joined the game.<br />' +
                'Rolling the dice...<br />' +
                '<b>' + Users.get(room.dice.members[0]).name + '</b> rolled ' + result1 + '!<br />' +
                '<b>' + Users.get(room.dice.members[1]).name + '</b> rolled ' + result2 + '!<br />' +
                '<b>' + result3 + '</b><br />');
            if (result3 === '' + Users.get(room.dice.members[0]).name + ' has won ' + room.dice.award + ' points!') {
                moneyStuff.transferAmt(Users.get(room.dicemembers[1]).userid, Users.get(room.dicemembers[0]).userid, 'money', room.dice.award);
            } else {
                moneyStuff.transferAmt(Users.get(room.dicemembers[0]).userid, Users.get(room.dicemembers[1]).userid, 'money', room.dice.award);
            }
            delete room.dice;
        }
    },

    diceend: function(target, room, user) {
        if (!this.can('broadcast', null, room) return this.sendReply('You must be ranked + or higher to end a game of dice.');
        if (!room.dice) return this.sendReply("There is no game of dice going on in this room right now."); 
        this.add('|html|<b>The game of dice has been ended by ' + user.name); 
        delete room.dice;
    },
    
    //just for the lols
    dance: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReply('|html| <marquee behavior="alternate" scrollamount="3"><b><img src=http://i196.photobucket.com/albums/aa279/loganknightphotos/wobbuffet-2.gif>WOBB<img src=http://i196.photobucket.com/albums/aa279/loganknightphotos/wobbuffet-2.gif>WOBB<img src=http://i196.photobucket.com/albums/aa279/loganknightphotos/wobbuffet-2.gif></b></marquee>');
    },
    
    model: 'sprite',
    sprite: function(target, room, user) {
        if (!this.canBroadcast()) return;
        var targets = target.split(',');
        target = targets[0].trim();
        target1 = targets[1];
        if (!toId(target)) return this.sendReply("/sprite [Pokémon], [shiny/back] - Shows the animated model of the specified Pokémon.");
        var clean = target.toLowerCase();
        if (target.toLowerCase().indexOf(' ') !== -1) {
            target = target.toLowerCase().replace(/ /g, '-');
        }
        if (target.indexOf('mega') == -1 && toId(target) != 'porygon2') {
            if (target.lastIndexOf('-') > -1) {
                for (var i = 0; i <= target.lastIndexOf('-'); i++) {
                    var a = target.substring(0, target.lastIndexOf('-')).replace(/-/g, ' ');
                    break;
                }
            }
        }

        var correction = a ? Tools.dataSearch(a) : Tools.dataSearch(target);
        if (correction && correction.length) {
            for (var i = 0; i < correction.length; ++i) {
                if (correction[i].id !== target && !i) {
                    target = a ? target.replace(a, correction[0].id) : correction[0].name.toLowerCase();
                }
            }
        } else {
            return this.sendReply((a || clean) + ' is not a valid Pokémon.');
        }

        if (!target1) {
            for (var x = 0; x < 10; x++) {
                if (target.indexOf('-' + toId(i) > -1) {
                    return this.sendReply('|html|<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/' + target + '.gif">');
                } 
				}
                    return this.sendReply('|html|<img src = "http://play.pokemonshowdown.com/sprites/xyani/' + target + '.gif">');
        } else {
            if (toId(target1) === 'back') {
                return this.sendReply('|html|<img src = "http://play.pokemonshowdown.com/sprites/xyani-back/' + target.toLowerCase().trim().replace(/ /g, '-') + '.gif">');
            } else if (toId(target1) === 'shiny') {
                return this.sendReply('|html|<img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/' + target.toLowerCase().trim().replace(/ /g, '-') + '.gif">');
            } else {
                this.sendReply(target1 + ' is not a valid parameter.');
               for (var x = 0; x < 10; x++) {
                if (target.indexOf('-' + toId(x)) > -1) {
                    return this.sendReply('|html|<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/' + target + '.gif">');
                } 
				}
                    return this.sendReply('|html|<img src = "http://play.pokemonshowdown.com/sprites/xyani/' + target + '.gif">');
            }
        }
    }
  };
