 //just for the lols
 exports.commands = {
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
            },
