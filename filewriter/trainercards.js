    //incomplete
    function getavy(name) {
        if (Users.get(name)) {
            if (Users.get(name).avatar.length > 3) {
                return '<img src = "//thearchonleague.no-ip.org:8000/avatars/' + Users.get(name).avatar + '">'
            } else {
                return '<img src = "//play.pokemonshowdown.com/sprites/trainers/' + Users.get(name).avatar + '.png">'
            }
        } else {
            return '';
        }
    }

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
