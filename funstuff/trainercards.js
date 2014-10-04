exports.commands {
    //example trainer card. You don't need to copy the same thing, this trainer card is really plain and simple.
    siiilver: 'silver',
    silver: function (target, user, room) {
        var avatar = getavy('siiilver');
        return cardPrint('<center><h3>Siiilver</h3>'+
        '<img src = "http://i1171.photobucket.com/albums/r545/Brahak/greninja3_zpsb90166f6.gif">'+avy);
    }
    /*Now while creating cards, this is where a lotta people go wrong, and end up crashing their servers and ask others how to fix the problem.
    If you see '};' after the last trainer card command, don't add a comma after the '}' which ends the last command. Those are only for commands which have another command after them.*/
};

//here are a couple of functions you'll find really handy.

//this function is used for getting the html code for displaying a user's avatar, as long as the server recognizes them. Otherwise, it won't return anything.
    function getavy(name) {
        if (Users.get(name)) {
            return '<img src = "//play.pokemonshowdown.com/sprites/trainers/' + Users.get(name).avatar + '.png">'
            }
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
            return this.sendReplyBox(target + br + '<b>Last seen:</b> ' + datestuff.lastSeen(name) + ' ago');
        } else {
            if (!Users.get(name).connected) {
                return this.sendReplyBox(target + br + '<b>Last seen:</b> ' + datestuff.lastSeen(name) + ' ago');
            } else {
                return this.sendReplyBox(target + target1);
            }
        }
    }
