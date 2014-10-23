var fs = require('fs');
var last = fs.readFileSync('infofiles/lastseen.json');
var lastseen = JSON.parse(last);
var datestuff = exports.datestuff = {

    setdate: function(name) {
        lastseen[name] = Date.now();
        var last2 = JSON.stringify(lastseen, null, 1);
        fs.writeFile('infofiles/lastseen.json', last2);
        return;
    },

    setdateall: function() {
        for (var x in Users.users) {
            if (Users.users[x].connected && Users.users[x].named) {
                lastseen[x] = Date.now();
            }
        }
        var last2 = JSON.stringify(lastseen, null, 1);
        fs.writeFile('infofiles/lastseen.json', last2);
        return;
    },

    getdate: function(name) {
        if (!lastseen[name]) return 'never';
        var getdate = Date.now() - lastseen[name];
        return getdate;
    },
    
    lastSeen: function(target) {
                var plural = function(target, target1) {
                    if (Math.floor(target) !== 1) {
                        return target1 = target1 + "s";
                    } else {
                        return target1;
                    }
                }
                var lastseen = datestuff.getdate(toId(target));
                if (lastseen == 'never') return 'never';
                var part1 = Math.floor(lastseen / 1000);
                var time1 = Math.floor(lastseen / 1000) + ' ' + plural(part1, 'second');
                if (part1 >= 60) {
                    var part2 = Math.floor(part1 / 60);
                    if (part1 % 60 === 0) {
                        var time1 = part2 + ' ' + plural(part2, 'minute');
                    } else {
                        var time1 = part2 + ' ' + plural(part2, 'minute') + ', ' + (part1 % 60) + ' ' + plural(part1 % 60, 'second');
                    }
                    if (part2 >= 60) {
                        var part3 = Math.floor(part2 / 60);
                        if (part2 % 60 !== 0) {
                            var time1 = part3 + ' ' + plural(part3, 'hour') + ', ' + (part2 % 60) + ' ' + plural(part2 % 60, 'minute');
                        } else {
                            var time1 = part3 + ' ' + plural(part3, 'hour');
                        }
                        if (part3 >= 24) {
                            var part4 = Math.floor(part3 / 24);
                            if (part3 % 24 !== 0 && (part2 % 60) !== 0) {
                                var time1 = part4 + ' ' + plural(part4, 'day') + ', ' + (part3 % 24) + ' ' + plural(part3 % 24, 'hour') + ', ' + (part2 % 60) + ' ' + plural(part2 % 60, 'minute');
                            } else if (part3 % 24 !== 0 && (part2 % 60) === 0) {
                                var time1 = part4 + ' ' + plural(part4, 'day') + ', ' + (part3 % 24) + ' ' + plural(part3 % 24, 'hour');
                            } else if (part3 % 24 === 0 && (part2 % 60) !== 0) {
                                var time1 = part4 + ' ' + plural(part4, 'day') + ', ' + (part2 % 60) + ' ' + plural(part2 % 60, 'minute');
                            } else {
                                var time1 = part4 + ' ' + plural(part4, 'day');
                            }
                            if (part4 >= 7) {
                                var part5 = Math.floor(part4 / 7);
                                if (part3 % 7 !== 0 && part3 % 24 !== 0) {
                                    var time1 = part5 + ' ' + plural(part5, 'week') + ', ' + (part4 % 7) + ' ' + plural(part4 % 7, 'day') + ', ' + (part3 % 24) + ' ' + plural(part3 % 24, 'hour');
                                } else if (part3 % 7 !== 0 && part3 % 24 === 0) {
                                    var time1 = part5 + ' ' + plural(part5, 'week') + ', ' + (part4 % 7) + ' ' + plural(part4 % 7, 'day');
                                } else if (part3 % 7 === 0 && part3 % 24 !== 0) {
                                    var time1 = part5 + ' ' + plural(part5, 'week') + ', ' + (part4 % 7) + ' ' + plural(part3 % 24, 'hour');
                                } else {
                                    var time1 = part5 + ' ' + plural(part5, 'week');
                                }
                            }
                        }
                    }
                }
                return time1;
            }
};
