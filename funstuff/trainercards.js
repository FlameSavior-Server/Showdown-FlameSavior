exports.commands = {
    //example trainer card. You don't need to copy the same thing, this trainer card is really plain and simple.
    siiilver: 'silver',
    silver: function (target, user, room) {
        var avatar = getavy('siiilver');
        return cardPrint('<center><h3>Siiilver</h3>'+
        '<img src = "http://i1171.photobucket.com/albums/r545/Brahak/greninja3_zpsb90166f6.gif">'+avy+'', '');
    }
    /*You can even use some of the profile functions, like this one below. Its useful if you're hosting a league server.
    silver: 'silvy',
    silv: 'silvy',
    silvy: function(target, user, room, cmd) {
        if (!this.canBroadcast()) return;
        var fav = profile.checkDetails('frntiersilvy', 'ace');

        var l = profile.checkDetails('frntiersilvy', 'quote');
        
        var avy = getavy('frntiersilvy');

        return cardPrint('frntiersilvy', '<center><b><font size = 2><u>Fr❄ntier Silvy</u></b></font></center><br/>' +
            '<i>"' + l + '"</i><br/><br/>' +
            '<b>Ace:</b> ' + fav + '<br/>' +
            '<center><img src = "http://i1171.photobucket.com/albums/r545/Brahak/greninja3_zpsb90166f6.gif", width = 126, height = 128>'<img src = "http://play.pokemonshowdown.com/sprites/trainers/159.png">'+avy+'<img src = "http://i1171.photobucket.com/albums/r545/Brahak/cuddles_zps81481cbf.gif"><img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/scizor-mega.gif"><br/>',
            '');
    },
    /*Now while creating cards, this is where a lotta people go wrong, and end up crashing their servers and ask others how to fix the problem.
    If you see '};' after the last trainer card command, don't add a comma after the '}' which ends the last command. Those are only for commands which have another command after them.*/
};

//here are a couple of functions you'll find really handy.

//this function is used for getting the html code for displaying a user's avatar, as long as the server recognizes them. Otherwise, it won't return anything.
    function sendReplyBox(data) {
        data = '|html|<div class = "infobox"> ' + data + '</div>';
        if (this.broadcasting) {
            room.add(data, true);
        } else {
            connection.sendTo(room, data);
        }
    }
    
    function getavy(name) {
        if (Users.get(name)) {
            return '<img src = "//play.pokemonshowdown.com/sprites/trainers/' + Users.get(name).avatar + '.png">'
        } else {
            return '';
        }
    }
//If the user is online at the moment, something extra will be added to the card (that is, target1). Otherwise, it'll display how long ago the user was last seen, (if he was seen at all.)
//If you don't want to use this function, just stick with the normal this.sendReplyBox instead.    
    function cardPrint(name, target, target1) {
        var br = '<br/>';
        if (target.lastIndexOf('<br/>') === target.length - 5) br = ''
        if (!Users.get(name)) {
            return sendReplyBox(target + br + '<b>Last seen:</b> ' + datestuff.lastSeen(name) + ' ago');
        } else {
            if (!Users.get(name).connected) {
                return sendReplyBox(target + br + '<b>Last seen:</b> ' + datestuff.lastSeen(name) + ' ago');
            } else {
                return sendReplyBox(target + target1);
            }
        }
    }
