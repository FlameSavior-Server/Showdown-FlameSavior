/**
 * Tells
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Tells are the offline messaging system for PS. They are received when a
 * user successfully connects under a name that has tells waiting, and are
 * sent when a pm is sent to a user who does not exist or is not online.
 *
 * Tells are cleared after they have existed for a certain length of time
 * in order to remove any inactive messages. This length of time can be
 * specified in config.js
 *
 * @license MIT license
 */

// jscs:disable
var fs = require('fs');
var color = hashColor;

var tells = {inbox: {}, outbox: {}};
try {
    tells = JSON.parse(fs.readFileSync('config/tells.json'));
} catch (e) {} // file doesn't exist (yet)

/**
 * Purge expired messages from those stored
 * @param threshold The age limit of an "old" tell, in ms
 */
var pruneOld = exports.pruneOld = function (threshold) {
    var now = Date.now();
    var receivers = Object.keys(Tells.inbox);
    for (var i = 0; i < receivers.length; i++) {
        for (var n = 0; n < Tells.inbox[receivers[i]].length; n++) {
            if ((now - Tells.inbox[receivers[i]][n].time) >= threshold) {
                var ips = Object.keys(Tells.inbox[receivers[i]][n].ips);
                for (var ip = 0; ip < ips.length; ip++) {
                    if (Tells.outbox[ips[ip]]) Tells.outbox[ips[ip]]--;
                    if (Tells.outbox[ips[ip]] <= 0) delete Tells.outbox[ips[ip]];
                }
                Tells.inbox[receivers[i]].splice(n, 1);
                n--;
            }
        }
        if (!Tells.inbox[receivers[i]].length) delete Tells.inbox[receivers[i]];
    }
    Tells.writeTells();
};

exports.inbox = tells.inbox || {};
exports.outbox = tells.outbox || {};

/**
 * Write the inbox and outbox to file
 */
exports.writeTells = (function () {
    var writing = false;
    var writePending = false; // whether or not a new write is pending
    var finishWriting = function () {
        writing = false;
        if (writePending) {
            writePending = false;
            Tells.writeTells();
        }
    };
    return function () {
        if (writing) {
            writePending = true;
            return;
        }
        writing = true;
        var data = JSON.stringify({inbox: Tells.inbox, outbox: Tells.outbox});
        fs.writeFile('config/tells.json.0', data, function () {
            // rename is atomic on POSIX, but will throw an error on Windows
            fs.rename('config/tells.json.0', 'config/tells.json', function (err) {
                if (err) {
                    // This should only happen on Windows.
                    fs.writeFile('config/tells.json', data, finishWriting);
                    return;
                }
                finishWriting();
            });
        });
    };
})();

/**
 * Format a user's inbox and send it on to the client to be delivered
 * @param userid    The userid whose tells to send
 * @param user      The User object to send the tells to
 */
exports.sendTell = function (userid, user) {
    var buffer = '|raw|';
    var tellsToSend = Tells.inbox[userid];
    for (var i = 0; i < tellsToSend.length; i++) {
        var ips = Object.keys(tellsToSend[i].ips);
        for (var ip = 0; ip < ips.length; ip++) {
            if (Tells.outbox[ips[ip]]) Tells.outbox[ips[ip]]--;
            if (Tells.outbox[ips[ip]] <= 0) delete Tells.outbox[ips[ip]];
        }
        var timeStr = Tells.getTellTime(tellsToSend[i].time);
        buffer += '<div class="chat"><font color="gray">[' + timeStr + ' ago]</font> <b><font color="' + color(toId(tellsToSend[i].sender)) + '">' + tellsToSend[i].sender + ':</font></b> ' + Tools.escapeHTML(tellsToSend[i].msg.replace(/\|/g, '&#124;')) + '</div>';
    }
    user.send(buffer);
    delete Tells.inbox[userid];
    Tells.writeTells();
};

/**
 * Store a tell to be received later
 * @param sender    The User object of the sender
 * @param receiver  The target userid
 * @param msg       The message to be send
 * @return      false if the receiver has a full inbox
 *          null if the sender has a full outbox
 *          otherwise true
 */
exports.addTell = function (sender, receiver, msg) {
    if (Tells.inbox[receiver] && Tells.inbox[receiver].length >= 5) return false;
    var ips = Object.keys(sender.ips);
    for (var i = 0; i < ips.length; i++) {
        if (!Tells.outbox[ips[i]]) {
            Tells.outbox[ips[i]] = 1;
        } else {
            if (Tells.outbox[ips[i]] >= 10) return null;
            Tells.outbox[ips[i]]++;
        }
    }
    if (!Tells.inbox[receiver]) Tells.inbox[receiver] = [];
    var newTell = {
        'sender': sender.name,
        time: Date.now(),
        'msg': msg,
        ips: sender.ips
    };
    Tells.inbox[receiver].push(newTell);
    Tells.writeTells();
    return true;
};

/**
 * Converts a UNIX timestamp into 'x minutes, y seconds ago' form
 * @param time  UNIX timestamp (e.g., 1405460769855)
 * @return  A human readable time difference between now and the given time
 */
exports.getTellTime = function (time) {
    time = Date.now() - time;
    time = Math.round(time / 1000); // rounds to nearest second
    var seconds = time % 60;
    var times = [];
    if (seconds) times.push(String(seconds) + (seconds === 1 ? ' second' : ' seconds'));
    var minutes, hours, days;
    if (time >= 60) {
        time = (time - seconds) / 60; // converts to minutes
        minutes = time % 60;
        if (minutes) times.unshift(String(minutes) + (minutes === 1 ? ' minute' : ' minutes'));
        if (time >= 60) {
            time = (time - minutes) / 60; // converts to hours
            hours = time % 24;
            if (hours) times.unshift(String(hours) + (hours === 1 ? ' hour' : ' hours'));
            if (time >= 24) {
                days = (time - hours) / 24; // you can probably guess this one
                if (days) times.unshift(String(days) + (days === 1 ? ' day' : ' days'));
            }
        }
    }
    if (!times.length) times.push('0 seconds');
    return times.join(', ');
};

// clear old messages every two hours
exports.pruneOldTimer = setInterval(pruneOld, 1000 * 60 * 60 * 2,
Config.tellsexpiryage || 1000 * 60 * 60 * 24 * 7);

//color
function MD5(e) {
    function t(e, t) {
        var n, r, i, s, o;
        i = e & 2147483648;
        s = t & 2147483648;
        n = e & 1073741824;
        r = t & 1073741824;
        o = (e & 1073741823) + (t & 1073741823);
        return n & r ? o ^ 2147483648 ^ i ^ s : n | r ? o & 1073741824 ? o ^ 3221225472 ^ i ^ s : o ^ 1073741824 ^ i ^ s : o ^ i ^ s;
    }

    function n(e, n, r, i, s, o, u) {
        e = t(e, t(t(n & r | ~n & i, s), u));
        return t(e << o | e >>> 32 - o, n);
    }

    function r(e, n, r, i, s, o, u) {
        e = t(e, t(t(n & i | r & ~i, s), u));
        return t(e << o | e >>> 32 - o, n);
    }

    function i(e, n, r, i, s, o, u) {
        e = t(e, t(t(n ^ r ^ i, s), u));
        return t(e << o | e >>> 32 - o, n);
    }

    function s(e, n, r, i, s, o, u) {
        e = t(e, t(t(r ^ (n | ~i), s), u));
        return t(e << o | e >>> 32 - o, n);
    }

    function o(e) {
        var t = "",
            n = "",
            r;
        for (r = 0; r <= 3; r++) n = e >>> r * 8 & 255, n = "0" + n.toString(16), t += n.substr(n.length - 2, 2);
        return t
    }
    var u = [],
        a, f, l, c, h, p, d, v, e = function(e) {
            for (var e = e.replace(/\r\n/g, "\n"), t = "", n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                r < 128 ? t += String.fromCharCode(r) : (r > 127 && r < 2048 ? t += String.fromCharCode(r >> 6 | 192) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128)), t += String.fromCharCode(r & 63 | 128));
            }
            return t;
        }(e),
        u = function(e) {
            var t, n = e.length;
            t = n + 8;
            for (var r = ((t - t % 64) / 64 + 1) * 16, i = Array(r - 1), s = 0, o = 0; o < n;) t = (o - o % 4) / 4, s = o % 4 * 8, i[t] |= e.charCodeAt(o) << s, o++;
            i[(o - o % 4) / 4] |= 128 << o % 4 * 8;
            i[r - 2] = n << 3;
            i[r - 1] = n >>> 29;
            return i;
        }(e);
    h = 1732584193;
    p = 4023233417;
    d = 2562383102;
    v = 271733878;
    for (e = 0; e < u.length; e += 16) a = h, f = p, l = d, c = v, h = n(h, p, d, v, u[e + 0], 7, 3614090360), v = n(v, h, p, d, u[e + 1], 12, 3905402710), d = n(d, v, h, p, u[e + 2], 17, 606105819), p = n(p, d, v, h, u[e + 3], 22, 3250441966), h = n(h, p, d, v, u[e + 4], 7, 4118548399), v = n(v, h, p, d, u[e + 5], 12, 1200080426), d = n(d, v, h, p, u[e + 6], 17, 2821735955), p = n(p, d, v, h, u[e + 7], 22, 4249261313), h = n(h, p, d, v, u[e + 8], 7, 1770035416), v = n(v, h, p, d, u[e + 9], 12, 2336552879), d = n(d, v, h, p, u[e + 10], 17, 4294925233), p = n(p, d, v, h, u[e + 11], 22, 2304563134), h = n(h, p, d, v, u[e + 12], 7, 1804603682), v = n(v, h, p, d, u[e + 13], 12, 4254626195), d = n(d, v, h, p, u[e + 14], 17, 2792965006), p = n(p, d, v, h, u[e + 15], 22, 1236535329), h = r(h, p, d, v, u[e + 1], 5, 4129170786), v = r(v, h, p, d, u[e + 6], 9, 3225465664), d = r(d, v, h, p, u[e + 11], 14, 643717713), p = r(p, d, v, h, u[e + 0], 20, 3921069994), h = r(h, p, d, v, u[e + 5], 5, 3593408605), v = r(v, h, p, d, u[e + 10], 9, 38016083), d = r(d, v, h, p, u[e + 15], 14, 3634488961), p = r(p, d, v, h, u[e + 4], 20, 3889429448), h = r(h, p, d, v, u[e + 9], 5, 568446438), v = r(v, h, p, d, u[e + 14], 9, 3275163606), d = r(d, v, h, p, u[e + 3], 14, 4107603335), p = r(p, d, v, h, u[e + 8], 20, 1163531501), h = r(h, p, d, v, u[e + 13], 5, 2850285829), v = r(v, h, p, d, u[e + 2], 9, 4243563512), d = r(d, v, h, p, u[e + 7], 14, 1735328473), p = r(p, d, v, h, u[e + 12], 20, 2368359562), h = i(h, p, d, v, u[e + 5], 4, 4294588738), v = i(v, h, p, d, u[e + 8], 11, 2272392833), d = i(d, v, h, p, u[e + 11], 16, 1839030562), p = i(p, d, v, h, u[e + 14], 23, 4259657740), h = i(h, p, d, v, u[e + 1], 4, 2763975236), v = i(v, h, p, d, u[e + 4], 11, 1272893353), d = i(d, v, h, p, u[e + 7], 16, 4139469664), p = i(p, d, v, h, u[e + 10], 23, 3200236656), h = i(h, p, d, v, u[e + 13], 4, 681279174), v = i(v, h, p, d, u[e + 0], 11, 3936430074), d = i(d, v, h, p, u[e + 3], 16, 3572445317), p = i(p, d, v, h, u[e + 6], 23, 76029189), h = i(h, p, d, v, u[e + 9], 4, 3654602809), v = i(v, h, p, d, u[e + 12], 11, 3873151461), d = i(d, v, h, p, u[e + 15], 16, 530742520), p = i(p, d, v, h, u[e + 2], 23, 3299628645), h = s(h, p, d, v, u[e + 0], 6, 4096336452), v = s(v, h, p, d, u[e + 7], 10, 1126891415), d = s(d, v, h, p, u[e + 14], 15, 2878612391), p = s(p, d, v, h, u[e + 5], 21, 4237533241), h = s(h, p, d, v, u[e + 12], 6, 1700485571), v = s(v, h, p, d, u[e + 3], 10, 2399980690), d = s(d, v, h, p, u[e + 10], 15, 4293915773), p = s(p, d, v, h, u[e + 1], 21, 2240044497), h = s(h, p, d, v, u[e + 8], 6, 1873313359), v = s(v, h, p, d, u[e + 15], 10, 4264355552), d = s(d, v, h, p, u[e + 6], 15, 2734768916), p = s(p, d, v, h, u[e + 13], 21, 1309151649), h = s(h, p, d, v, u[e + 4], 6, 4149444226), v = s(v, h, p, d, u[e + 11], 10, 3174756917), d = s(d, v, h, p, u[e + 2], 15, 718787259), p = s(p, d, v, h, u[e + 9], 21, 3951481745), h = t(h, a), p = t(p, f), d = t(d, l), v = t(v, c);
    return (o(h) + o(p) + o(d) + o(v)).toLowerCase();
}

function hslToRgb(e, t, n) {
    var r, i, s, o, u, a;
    if (!isFinite(e)) e = 0;
    if (!isFinite(t)) t = 0;
    if (!isFinite(n)) n = 0;
    e /= 60;
    if (e < 0) e = 6 - -e % 6;
    e %= 6;
    t = Math.max(0, Math.min(1, t / 100));
    n = Math.max(0, Math.min(1, n / 100));
    u = (1 - Math.abs(2 * n - 1)) * t;
    a = u * (1 - Math.abs(e % 2 - 1));
    if (e < 1) {
        r = u;
        i = a;
        s = 0;
    } else if (e < 2) {
        r = a;
        i = u;
        s = 0;
    } else if (e < 3) {
        r = 0;
        i = u;
        s = a;
    } else if (e < 4) {
        r = 0;
        i = a;
        s = u;
    } else if (e < 5) {
        r = a;
        i = 0;
        s = u;
    } else {
        r = u;
        i = 0;
        s = a;
    }
    o = n - u / 2;
    r = Math.round((r + o) * 255);
    i = Math.round((i + o) * 255);
    s = Math.round((s + o) * 255);
    return {
        r: r,
        g: i,
        b: s
    };
}

function rgbToHex(e, t, n) {
    return toHex(e) + toHex(t) + toHex(n);
}

function toHex(e) {
    if (e == null) return "00";
    e = parseInt(e);
    if (e == 0 || isNaN(e)) return "00";
    e = Math.max(0, e);
    e = Math.min(e, 255);
    e = Math.round(e);
    return "0123456789ABCDEF".charAt((e - e % 16) / 16) + "0123456789ABCDEF".charAt(e % 16);
}

var colorCache = {};

function hashColor(e) {
    if (colorCache[e]) return colorCache[e];
    var t = MD5(e);
    var n = parseInt(t.substr(4, 4), 16) % 360;
    var r = parseInt(t.substr(0, 4), 16) % 50 + 50;
    var i = parseInt(t.substr(8, 4), 16) % 20 + 25;
    var s = hslToRgb(n, r, i);
    colorCache[e] = "#" + rgbToHex(s.r, s.g, s.b);
    return colorCache[e];
}