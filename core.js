var fs = require("fs");
var path = require("path");

var core = exports.core = {

emoticons: {
        'Kappa': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ddc6e3a8732cb50f-25x28.png',
        'PogChamp': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-60aa1af305e32d49-23x30.png',
        'BloodTrail': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-f124d3a96eff228a-41x28.png',
        'BibleThump': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-f6c13c7fc0a5c93d-36x30.png',
        'feelsgd': 'http://i.imgur.com/9gj1oPV.png',
        'feelsbd': 'http://i.imgur.com/Ehfkalz.gif',
        'crtNova': 'http://static-cdn.jtvnw.net/jtv_user_pictures/emoticon-3227-src-77d12eca2603dde0-28x28.png',
        'crtSSoH': 'http://static-cdn.jtvnw.net/jtv_user_pictures/emoticon-3228-src-d4b613767d7259c4-28x28.png',
        'SSSsss': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-5d019b356bd38360-24x24.png',
        'SwiftRage': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-680b6b3887ef0d17-21x28.png',
        'ResidentSleeper': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-1ddcc54d77fc4a61-28x28.png',
        'PJSalt': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-18be1a297459453f-36x30.png',
        'FailFish': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-c8a77ec0c49976d3-22x30.png',
        '4Head': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-76292ac622b0fc38-20x30.png',
        'DansGame': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ce52b18fccf73b29-25x32.png',
        'Kreygasm': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-3a624954918104fe-19x27.png'
    },

    processEmoticons: function (text) {
        var patterns = [],
            metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g,
            self = this;

        for (var i in this.emoticons) {
            if (this.emoticons.hasOwnProperty(i)) {
                patterns.push('(' + i.replace(metachars, "\\$&") + ')');
            }
        }

        return text.replace(new RegExp(patterns.join('|'), 'g'), function (match) {
            if (match === 'feelsbd' || match === 'feelsgd') return typeof self.emoticons[match] != 'undefined' ?
                '<img src="' + self.emoticons[match] + '" title="' + match + '" width="30" height="30"/>' :
                match;
            return typeof self.emoticons[match] != 'undefined' ?
                '<img src="' + self.emoticons[match] + '" title="' + match + '"/>' :
                match;
        });
    },

    processChatData: function (user, room, connection, message) {
        var match = false;
        
        for (var i in this.emoticons) {
            if (message.indexOf(i) >= 0) {
                match = true;
            }
        }
        if (!match || message.charAt(0) === '!') return true;
        message = Tools.escapeHTML(message);
        message = this.processEmoticons(message);
        if (user.hiding) return room.add('|raw|<div class="chat"><strong><font color="' + Core.hashColor(user.userid)+'"><small></small><span class="username" data-name="' + user.name + '">' + user.name + '</span>:</font></strong> <em class="mine">' + message + '</em></div>');
        room.add('|raw|<div class="chat"><strong><font color="' + Core.hashColor(user.userid)+'"><small>' + user.group + '</small><span class="username" data-name="' + user.group + user.name + '">' + user.name + '</span>:</font></strong> <em class="mine">' + message + '</em></div>');
        return false;
    },
};
