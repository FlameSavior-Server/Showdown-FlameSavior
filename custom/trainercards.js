//This is where all the trainer cards are stored (no shit) =P

exports.commands = {
kiira: 'kira',
    kira: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('frntierkiira', 'ace');

        var l = profile.checkDetails('frntierkiira', 'quote');

        var avy = this.getavy('frntierkiira');

        return this.cardPrint('frntierkiira', '<center><b><font size = 2><u>Fr❄ntier Kira</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Format:</b> Little Cup<br/>' +
            '<b>Restrictions:</b> No Choice items<br/>' +
            '<b>Symbol:</b> Bae Symbol<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>'+
			''+avy+'','');
    },

    nathan: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fs = require('fs');
        var dMatch = false;
        var fav = 'Unknown';
        var total = '';
        var data = fs.readFileSync('config/ace.csv', 'utf8')
        var fav = 'Unknown';
        var row = ('' + data).split("\n");
        for (var i = row.length; i > -1; i--) {
            if (!row[i]) continue;
            var parts = row[i].split(",");
            var userid = toId(parts[0]);
            if ('frntiernathan' == userid) {
                var x = parts[1];
                var fav = x;
                dMatch = true;
                if (dMatch === true) {
                    break;
                }
            }
        }
        if (dMatch === false) {
            fav = 'Unknown';
        }

        var cMatch = false;
        var location = 'Hidden';
        var total = '';
        var data = fs.readFileSync('config/quotes.csv', 'utf8')
        var ace = 'Get ready!';
        var row = ('' + data).split("\n");
        for (var i = row.length; i > -1; i--) {
            if (!row[i]) continue;
            var parts = row[i].split(",");
            var userid = toId(parts[0]);
            if ('frntiernathan' == userid) {
                var x = parts[1];
                var quote = x;
                cMatch = true;
                if (cMatch === true) {
                    break;
                }
            }
        }

        if (cMatch === true) {
            var l = quote;
        }
        if (cMatch === false) {
            l = 'Get ready!';
        }

        if (!Users.get('frntiernathan')) {
            return this.sendReplyBox('<b><font size = 2>Fr❄ntier Nathan</b></font><br/>' +
                '<i>"' + l + '"</i><br/><br/>' +
                '<b>Format:</b> RarelyUsed (RU)<br/>' +
                '<b>Symbol:</b> Valiance Symbol<br/>' +
                '<b>Ace:</b> ' + fav + '<br/>');
        } else {
            var avy = 'play.pokemonshowdown.com/sprites/trainers/' + Users.get('frntiernathan').avatar + '.png'
            if (Users.get('frntiernathan').avatar.length > 3) {
                var avy = 'thearchonleague.no-ip.org:8000/avatars/' + Users.get('frntiernathan').avatar + ''
            }
            return this.sendReplyBox('<center><b><font size = 2><u>Fr❄ntier Nathan</u></b></font></center><br/>' +
                '<i>"' + l + '"</i><br/><br/>' +
                '<b>Format:</b> RarelyUsed (RU)<br/>' +
                '<b>Symbol:</b> Valiance Symbol<br/>' +
                '<b>Ace:</b> ' + fav + '<br/>' +
                '<img src = "//">');
        }
    },
	mikey: 'mike',
	 mike: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('frntiermikey', 'ace');

        var l = profile.checkDetails('frntiermikey', 'quote');

        var avy = this.getavy('frntiermikey');

        return this.cardPrint('frntiermikey', '<center><b><u>Fr❄ntier Mikey</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
			'<b>Format:</b> Uber Monotype<br/>' +
            '<b>Symbol:</b> Power Symbol<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>'+
			'<center><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/gible.gif">'+avy+'<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/kyurem-black.gif"></center>', '');
    },

    /*mike: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('gymleadrmike', 'ace');

        var l = profile.checkDetails('gymleadrmike', 'quote');

        var avy = this.getavy('gymleadrmike');

        return this.cardPrint('gymleadrmike', '<center><b><u>Gym Lead❄r Mike</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = 000d89>Dragon</font></b></b> <br/>' +
            '<b>Badge:</b> Serpentine Badge<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>','');
    },*/

    alzzy: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('elitefuralzzy', 'ace');

        var l = profile.checkDetails('elitefuralzzy', 'quote');

        var avy = this.getavy('elitefuralzzy');

        return this.cardPrint('elitefuralzzy', '<center><b><font size = 2><u>Elite F❄ur Alzzy</u></b></font><br/><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = #a4c7dd>Flying</font></b> <br/>' +
            '<b>Restrictions:</b> No +2 or +3 priority moves<br/>' +
            '<b>Achievements:</b><br/>' +
            '- Gym Trainer to Gym Leader to Elite Four<br/>' +
            '- Banned Talonflame<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "http://i1171.photobucket.com/albums/r545/Brahak/sala_zps4dc3af05.gif">'+avy+'<img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/articuno.gif"><br/>',
            '<center><button class = "leaguechallenge" name = "parseCommand" value = "/challenge elitefuralzzy, e4battlealzzy"><b>Challenge!</b></button>');
    },


    psychic: 'atlas',
    atlas: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('glheadatlas', 'ace');

        var l = profile.checkDetails('glheadatlas', 'quote');

        var avy = this.getavy('glheadatlas');

        return this.cardPrint('glheadatlas', '<center><b><u>GL❄Head Atlas</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = "pink">Psychic</font></b> <br/>' +
            '<b>Badge:</b> Trance Badge<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/gardevoir-mega.gif">'+avy+'<img src = "http://i1171.photobucket.com/albums/r545/Brahak/ninetales_zps62044fb7.gif"><br/>', '');

    },

    sugar: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('frntiersugar', 'ace');

        var l = profile.checkDetails('frntiersugar', 'quote');

        var avy = this.getavy('frntiersugar');

        return this.cardPrint('frntiersugar', '<font size = 2><center><b><u>Fr❄ntier Sugar</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Format:</b> Uber<br/>' +
            '<b>Restrictions:</b><br/>' +
            '- No Baton Pass<br/>' +
            '- No Status Lowering<br/>' +
            '- Item Clause<br/>' +
            '<b>Symbol:</b> Legends Symbol<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "http://i1171.photobucket.com/albums/r545/Brahak/cuddles_zps81481cbf.gif"><img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/gardevoir-mega.gif"><br/>', '');
    },

    ground: 'chewer',
    chewer: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fs = require('fs');
        var dMatch = false;
        var fav = 'Unknown';
        var total = '';
        var data = fs.readFileSync('config/ace.csv', 'utf8')
        var fav = 'Unknown';
        var row = ('' + data).split("\n");
        for (var i = row.length; i > -1; i--) {
            if (!row[i]) continue;
            var parts = row[i].split(",");
            var userid = toId(parts[0]);
            if ('gymleadrchewer' == userid) {
                var x = parts[1];
                var fav = x;
                dMatch = true;
                if (dMatch === true) {
                    break;
                }
            }
        }
        if (dMatch === false) {
            fav = 'Unknown';
        }

        var cMatch = false;
        var location = 'Hidden';
        var total = '';
        var data = fs.readFileSync('config/quotes.csv', 'utf8')
        var ace = 'Get ready!';
        var row = ('' + data).split("\n");
        for (var i = row.length; i > -1; i--) {
            if (!row[i]) continue;
            var parts = row[i].split(",");
            var userid = toId(parts[0]);
            if ('gymleadrchewer' == userid) {
                if (parts[2]) {
                    var x = parts[1] + ',' + parts[2];
                } else {
                    var x = parts[1];
                }
                var quote = x;
                cMatch = true;
                if (cMatch === true) {
                    break;
                }
            }
        }

        if (cMatch === true) {
            var l = quote;
        }
        if (cMatch === false) {
            l = 'Get ready!';
        }

        if (!Users.get('gymleadrchewer')) {
            return this.sendReplyBox('<center><b><u>Gym Lead❄r Chewer</u></b></font></center><br/>' +
                '<i>"' + l + '"</i><br/><br/>' +
                '<b>Type: <font color = "brown">Ground</font></b> <br/>' +
                '<b>Badge:</b> Mountain Badge<br/>' +
                '<b>Ace:</b> ' + fav + '<br/>');
        } else {
            var avy = 'play.pokemonshowdown.com/sprites/trainers/' + Users.get('gymleadrchewer').avatar + '.png'
            if (Users.get('gymleadrchewer').avatar.length > 3) {
                var avy = 'thearchonleague.no-ip.org:8000/avatars/' + Users.get('gymleadrchewer').avatar + ''
            }
            return this.sendReplyBox('<center><b><u>Gym Lead❄r Chewer</u></b></font></center><br/>' +
                '<i>"' + l + '"</i><br/><br/>' +
                '<b>Type: <font color = "brown">Ground</font></b> <br/>' +
                '<b>Badge:</b> Mountain Badge<br/>' +
                '<b>Ace:</b> ' + fav + '<br/>' +
                '<img src = "//">');
        }
    },

    drix: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('chmpiondrix', 'ace');

        var l = profile.checkDetails('chmpiondrix', 'quote');

        var avy = this.getavy('chmpiondrix');

        return this.cardPrint('chmpiondrix', '<center><b><font size = 2><u>Ch❄mpion Drix</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Battle Rules:</b> TierShift Monotype<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "thearchonleague.no-ip.org:8000/avatars/drix.jpg"><img src = "http://i1171.photobucket.com/albums/r545/Brahak/psyduck2_zpsba186dd7.gif"><img src = "http://i1171.photobucket.com/albums/r545/Brahak/slowbro3_zpsd3c8d2ec.gif"><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/porygon2.gif"><img src = "thearchonleague.no-ip.org:8000/avatars/zazi.png">',
            '<center><button class = "leaguechallenge" name = "parseCommand" value = "/challenge Elite F❄ur Drix, e4battlebloomdrix"><b>Challenge!</b></button>');
    },

    ghost: 'wisp',
    wisp: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('gymleadrwisp', 'ace');

        var l = profile.checkDetails('gymleadrwisp', 'quote');

        var avy = this.getavy('gymleadrwisp');
        return this.cardPrint('gymleadrwisp', '<center><b><u>Gym Lead❄r Wisp</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = #3f00a5>Ghost</font></b><br/>' +
            '<b>Badge:</b> Spooky Badge<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '', '');
    },

    waffle: 'waffles',
    waffles: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('gymleadrwaffle', 'ace');

        var l = profile.checkDetails('gymleadrwaffle', 'quote');

        var avy = this.getavy('gymleadrwaffle');

        return this.cardPrint('gymleadrwaffle', '<center><b><u>Gym Lead❄r Waffle</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = "red">Fire</font></b> <br/>' +
            '<b>Badge:</b> Erupting Badge<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>',
            // '<center><button class = "leaguechallenge" name = "parseCommand" value = "/challenge '+Users.get('gymleadrchar').name+', ou"><b>Challenge!</b></button>');
            '');
    },

    electric: 'robo',
    robo: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fs = require('fs');
        var fav = profile.checkDetails('gymleadrrobo', 'ace');

        var l = profile.checkDetails('gymleadrrobo', 'quote');

        var avy = this.getavy('gymleadrrobo');
        return this.cardPrint('gymleadrrobo', '<center><b><u>Gym Lead❄r Robo</u></b></font><br/><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = #FFC631>Electric</font></b> <br/>' +
            '<b>Badge:</b> Conduction Badge<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/manectric-mega.gif">'+avy+'<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/electivire.gif"><br/>',
            //'<center><button class = "leaguechallenge" name = "parseCommand" value = "/challenge Gym Lead❄r Robo, ou"><b>Challenge!</b></button>');
            '');
    },

    silver: 'silvy',
    silv: 'silvy',
    silvy: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('frntiersilvy', 'ace');

        var l = profile.checkDetails('frntiersilvy', 'quote');

        return this.cardPrint('frntiersilvy', '<center><b><font size = 2><u>Fr❄ntier Silvy</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Format:</b> Capture The Flag <u>Monotype</u><br/>' +
            '<b>How to Play:</b> Attach the item \'Mail\' to a pokemon in your team. That pokemon is your flagholder. If it faints, you lose.<br/>' +
            '<b>Symbol:</b> Hunting Symbol<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "http://i1171.photobucket.com/albums/r545/Brahak/greninja3_zpsb90166f6.gif", width = 126, height = 128><img src = "http://play.pokemonshowdown.com/sprites/trainers/159.png"><img src = "http://i1171.photobucket.com/albums/r545/Brahak/cuddles_zps81481cbf.gif"><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/scizor-mega.gif"><br/>',
            '<center><button class = "leaguechallenge" name = "parseCommand" value = "/challenge frntiersilvy, frontierbattlesilvy"><b>Challenge!</b></button>');
    },

    dark: function(target, user, room, cmd) {
        this.sendReply("There is no Dark type gym leader. This position is vacant.");
    },

    bug: 'alcor',
    alcor: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('gymleadralcor', 'ace');

        var l = profile.checkDetails('gymleadralcor', 'quote');

        var avy = this.getavy('gymleadralcor');

        return this.cardPrint('gymleadralcor', '<center><b><u>Gym Lead❄r Alcor</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = #3a5b18>Bug</font></b> <br/>' +
            '<b>Badge:</b> Swarm Badge<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>','');
    },
	 
	steel: 'lelouch',
    lelouch: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('gymleadrlelouch', 'ace');

        var l = profile.checkDetails('gymleadrlelouch', 'quote');

        var avy = this.getavy('gymleadrlelouch');

        return this.cardPrint('gymleadrlelouch', '<center><b><u>Gym Lead❄r LeLouch</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = #666666>Steel</font></b> <br/>' +
            '<b>Badge:</b> Mineral Badge<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>','');
    },

    anna: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('frntieranna', 'ace');

        var l = profile.checkDetails('frntieranna', 'quote');

        var avy = this.getavy('frntieranna');
        return this.cardPrint('frntieranna', '<center><b><font size = 2><u>Fr❄ntier Anna</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Format:</b> Almost Any Ability (AAA)<br/>' +
            '<b>Restrictions:</b> No Light Screen or Reflect</b><br/>' +
            '<b>Symbol:</b> Alpha Symbol<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/milotic.gif">', '');
    },

    sev: 'seviper',
    seviper: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('frntierseviper', 'ace');

        var l = profile.checkDetails('frntierseviper', 'quote');

        var avy = this.getavy('frntierseviper');
        return this.cardPrint('frntierseviper', '<center><b><font size = 2><u>Fr❄ntier Seviper</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Format:</b> NeverUsed (NU)<br/>' +
            '<b>Restrictions:</b> No Light Screen or Reflect</b><br/>' +
            '<b>Symbol:</b> Logik Symbol<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/golurk.gif">', '');

    },

    sanchez: 'sandchez',
    sandchez: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('frntiersanchez', 'ace');

        var l = profile.checkDetails('frntiersanchez', 'quote');

        var avy = this.getavy('frntiersanchez');

        return this.cardPrint('frntiersanchez', '<center><b><font size = 2><u>Fr❄ntier Sandchez</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Format:</b> UU<br/>' +
            '<b>Rules:</b><br/>' +
            '-No entry hazards<br/>' +
            '-No Reflect or Light screen<br/>' +
            '<b>Symbol:</b> Omega Symbol<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '', '');
    },

    snow: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('frntiersnow', 'ace');

        var l = profile.checkDetails('frntiersnow', 'quote');

        var avy = this.getavy('frntiersnow');

        return this.cardPrint('frntiersnow', '<center><b><font size = 2><u>Fr❄ntier Snow</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Format:</b> 1v1<br/>' +
            '<b>Battle Rules:</b> 5 Battles, Race to 3 <br/>' +
            '<b>Restrictions:</b> No direct status<br/>' +
            '<b>Symbol:</b> Solitary Symbol<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/conkeldurr.gif"><img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/pinsir.gif"><img src = "http://i1171.photobucket.com/albums/r545/Brahak/dragonite4_zpsa25ee654.gif">', '');
    },

    rubiks: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fs = require('fs');
        var fav = profile.checkDetails('elitefurrubiks', 'ace');

        var l = profile.checkDetails('elitefurrubiks', 'quote');

        var avy = this.getavy('elitefurrubiks');

        return this.cardPrint('elitefurrubiks', '<center><b><font size = 2><u>Elite F❄ur Rubiks</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = #3f00a5>Ghost</font></b><br/>' +
            '<b>Restrictions:</b><br/>' +
            '- No Entry Hazards<br/>' +
            '- No Light Screen/Reflect<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<b>Acheivements:</b><br/>' +
            '- Gym Trainer to Gym Leader to E4<br/>' +
            '- Advanced Ghost user<br/>' +
            '- Loves pink fluffy Unicorns :3<br/>' +
            '<center><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/litwick.gif"><img src = "http://i1171.photobucket.com/albums/r545/Brahak/sabes_zps668d8a60.gif" width = 86.5 height = 137.4><br/>',
            '<center><button class = "leaguechallenge" name = "parseCommand" value = "/challenge Elite F❄ur Rubiks, e4battlerubiks"><b>Challenge!</b></button>');
    },

    tim: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fs = require('fs');
        var fav = profile.checkDetails('elitefurtim', 'ace');

        var l = profile.checkDetails('elitefurtim', 'quote');

        var avy = this.getavy('elitefurtim');

        return this.cardPrint('elitefurtim', '<center><b><font size = 2><u>Elite F❄ur Tim</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = #3a5b18>Bug</font></b><br/>' +
            '<b>Restrictions:</b><br/>' +
            '- No Stealth Rock<br/>' +
            '- No Direct Status<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/heracross.gif"><img src = "http://i1171.photobucket.com/albums/r545/Brahak/scizor3_zps0e6332cf.gif"><br/>',
            '<center><button class = "leaguechallenge" name = "parseCommand" value = "/challenge Elite F❄ur Tim, e4battletim"><b>Challenge!</b></button>');
    },

    champinnah: 'noah',
    nah: 'noah',
    femalegallade: 'noah',
    gallade: 'noah',
    championnoah: 'noah',
    noah: function(target, user, room) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><b><u><font size = 2>Female Gallade</center><br />' +
            '<i>"Need a champion? I Noah guy~"</i> <br />' +
            '<br />' +
            '<b>Ace:</b> Gegnarthewise/Liquidbones<br />' +
            '<b>Bio:</b> Current Champion of Sora, also known as Champion Noah.<br />' +
            '<center><img src="http://sprites.pokecheck.org/i/134.gif"><img src="http://i.imgur.com/pFtOL9I.png"><img src="http://play.pokemonshowdown.com/sprites/xyani/gengar.gif">');
    },



    fapple: 'apple',
    apple: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fs = require('fs');
        var fav = profile.checkDetails('elitefurapple', 'ace');

        var l = profile.checkDetails('elitefurapple', 'quote');

        var avy = this.getavy('elitefurapple');

        return this.cardPrint('elitefurapple', '<center><b><font size = 2><u>Elite F❄ur Apple</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = "blue">Water</font></b><br/>' +
            '<b>Restrictions:</b><br/>' +
            '- No Sticky Web<br/>' +
            '- No Light Screen/Reflect<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>', 
			'<center><button class = "leaguechallenge" name = "parseCommand" value = "/challenge Elite F❄ur Apple, e4battleapple"><b>Challenge!</b></button>');
    },
	
	deyi: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('elitefurdeyi', 'ace');

        var l = profile.checkDetails('elitefurdeyi', 'quote');

        var avy = this.getavy('elitefurdeyi');

        return this.cardPrint('elitefurdeyi', '<center><b><font size = 2><u>Elite F❄ur Deyi</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = #3a5b18>Bug</font></b><br/>' +
            '<b>Restrictions:</b> No Entry Hazards<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>'+
			''+avy+'', '');
    },

    water: 'yoshi',
    yoshi: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('gymleadryoshi', 'ace');

        var l = profile.checkDetails('gymleadryoshi', 'quote');

        var avy = this.getavy('gymleadryoshi');

        return this.cardPrint('gymleadryoshi', '<center><b><u>Gym Lead❄r Yoshi</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = "blue">Water</font></b><br/>' +
            '<b>Badge:</b> Splash Badge<br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/vaporeon.gif">', '');
    },

    /*iggy: 'meows',
			meows: function(target, user, room, cmd) {
	if (!this.canBroadcast()) return;
	var fs = require('fs');
	   var dMatch = false;
        var fav = 'Unknown';
        var total = '';
 var data = fs.readFileSync('config/ace.csv','utf8')
                var fav = 'Unknown';
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toId(parts[0]);
                        if ('frntieriggy' == userid) {
                        var x = parts[1];
                        var fav = x;
                        dMatch = true;
                        if (dMatch === true) {
                                break;
                        }
                        }
                }
			if (dMatch === false) {
			fav = 'Unknown';
			}
			
			var cMatch = false;
        var location = 'Hidden';
        var total = '';
 var data = fs.readFileSync('config/quotes.csv','utf8')
                var ace = 'Get ready!';
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toId(parts[0]);
                        if ('frntieriggy' == userid) {
						if (parts[2]) {
                        var x = parts[1] + ',' + parts[2];
						} else {
						var x = parts[1];
						}
                        var quote = x;
                        cMatch = true;
                        if (cMatch === true) {
                                break;
                        }
                        }
                }
                
				if (cMatch === true) {
						 var l = quote;
						 }
						 if (cMatch === false) {
						 l = 'Get ready!';
						 }
			
			return this.sendReplyBox('<center><b><font size = 2><u>Fr❄ntier Iggy</u></b></font><br/>'+
			'<i>"'+l+'"</i><br/><br/>'+
			'<b>Format:</b> OU Weather Wars<br/>'+
			'<b>Format Rules:</b> Gen 6 OU with Gen 5 weather mechanics. That is, weather brought by abilities will last indefinitely.<br/>'+
			'<b>Ace:</b> '+fav+'<br/>'+
			'<b>Achievements:</b><br/>'+
			'- Ex-Flying E4 of Yggdrasil<br/>'+
			'- <s>Greatest</s> Ex-Ice E4 of Yggdrasil<br/>'+
			'<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/gardevoir-mega.gif"><img src = "http://i1171.photobucket.com/albums/r545/Brahak/abomasnow4_zpsdabd9661.gif"><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/landorus.gif"><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/walrein.gif"><img src = "http://i1171.photobucket.com/albums/r545/Brahak/azumarill2_zpsb78745f3.gif"><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/vivillon-pokeball.gif">');
			
			},*/


    
    bloom: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('heade4bloom', 'ace');

        var l = profile.checkDetails('heade4bloom', 'quote');

        var avy = this.getavy('heade4bloom');

        return this.cardPrint('heade4bloom', '<center><b><font size = 2><u>Elite F❄ur Bloom</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Type: <font color = "green">Grass</font></b><br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/parasect.gif"><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/bellossom.gif"><br/>',
            '<center><button class = "leaguechallenge" name = "parseCommand" value = "/challenge Elite F❄ur Bloom, e4battlebloomdrix"><b>Challenge!</b></button>');
    },

    kiluren: 'tj',
    tj: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('frntierheadtj', 'ace');

        var l = profile.checkDetails('frntierheadtj', 'quote');

        var avy = this.getavy('frntierheadtj');
        return this.cardPrint('frntierheadtj', '<center><b><font size = 2><u>Fr❄ntier Head TJ</u></b></font><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Format:</b> OU<br/>' +
            '<b>Restrictions:</b> No Choice items<br/>' +
            '<b>Symbol:</b> Si\'Kajun Ring<br/>' +
            '<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/pinsir-mega.gif"><br/>',
            '<center><button class = "leaguechallenge" name = "parseCommand" value = "/challenge frntierheadtj, ou"><b>Challenge!</b></button>');
    },

    night: 'jaddu',
    jaddu: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://i.imgur.com/GHnqgjH.png"></center><br><i><font color="blue"><b>Quote:Who am I?Well,I am your Worst Nightmare<br>Ace=Infernape(CR Ace:Rhydon)<br>Custom Rules:<br>- No poke above the base speed of 40<br>- No Hazards<br>- Speed should not be increased or decreased<br></b></i><img src="http://play.pokemonshowdown.com/sprites/xyani-shiny/infernape.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/rhydon.gif">');
    }
    };
