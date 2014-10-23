exports.commands = {
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
                 if (target.indexOf('-' + toId(i)) > -1) {
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
     },

     roomkick: 'kick',
     spank: 'kick',
     kick: function(target, room, user, connection, cmd) {
         if (!this.can('warn', null, room)) return false;
         if (!target) return this.sendReply('/kick [user], [reason] - Kicks a user from the room');

         target = this.splitTarget(target);
         var targetUser = this.targetUser;
         if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
         console.log(user.name);
         if (!Rooms.rooms[room.id].users[targetUser.userid]) return this.sendReply(targetUser.name + ' is not in this room.');
         switch (cmd) {
             case 'roomkick':
             case 'kick':
                 if (target) {
                     targetUser.popup('You have been kicked from room ' + room.title + ' by ' + user.name + '.\n\n' + target);
                 } else {
                     targetUser.popup('You have been kicked from room ' + room.title + ' by ' + user.name + '.');
                 }
                 break;
             case 'spank':
                 if (target) {
                     targetUser.popup('You have been spanked out of the room ' + room.title + ' by ' + user.name + '.\n\n' + target);
                 } else {
                     targetUser.popup('You have been spanked out of the room ' + room.title + ' by ' + user.name + '.');
                 }
                 break;
         }
         targetUser.leaveRoom(room);
         if (cmd == 'spank') room.add('|raw|' + targetUser.name + ' has been spanked out of the room by ' + user.name + '.');
         else room.add('|raw|' + targetUser.name + ' has been kicked from the room by ' + user.name + '.');
         this.logModCommand(user.name + ' kicked ' + targetUser.name + ' from ' + room.id);
     },
     lastseen: 'seen',
     seen: function(target, room, user) {
          if (!this.canBroadcast()) return;
          if (!target) return this.sendReply('You need to specify a user.');
          var lastSeen = datestuff.lastSeen(target);
          if (Users.get(target)) {
               if (Users.get(target).connected) {
                    if (!Users.get(target).authenticated) return this.sendReplyBox('<font color = '+color.get(toId(target))+'><b>' + target + '</b></font> was last seen ' + lastSeen + ' ago.');
                    var lastSeen = this.lastSeen(Users.get(target));
                    return this.sendReplyBox('<font color = '+color.get(toId(target))+'><b>' + Users.get(target).name + '</b></font> is currently <font color = "green"> online.</font> This user has stayed online for ' + lastSeen);
               }
          }
          if (lastSeen === 'never') return this.sendReplyBox('<font color = '+color.get(toId(target))+'><b>' + target + '</b></font> has <font color = "red"> never </font> been seen online.');
          return this.sendReplyBox('<font color = '+color.get(toId(target))+'><b>' + target + '</b></font> was last seen ' + lastSeen + ' ago.');
     },
 };
