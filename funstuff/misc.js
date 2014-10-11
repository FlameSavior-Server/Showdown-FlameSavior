 var request = require('request');
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
     u: 'urbandefine',
     ud: 'urbandefine',
     urbandefine: function(target, room, user) {
         if (room.id !== 'lobby') {
             if (!this.canBroadcast()) return;
         }
         if (!target) return this.sendReply('/u [word] - Searched the urban dictionary definition for the entered word.');
         if (target.length > 50) return this.sendReply('Phrase can not be longer than 50 characters.');
         var BadWords = ['charizard', 'pikachuing', 'blowjob', 'pinksock', 'pen1s', 'cum', 'cock', 'dick', 'puta', 'clit', 'asshole', 'porn', 'p0rn', 'pimp', 'd!ck', 'vulva', 'peehole', 'boob', 'tit', 'sperm'];
         if (this.broadcasting) {
             for (var i = 0; i < BadWords.length; i++) {
                 if (toId(target).indexOf(BadWords[i]) > -1) return this.sendReply("That word's urban definition cannot be broadcasted.");
             }
         }
         var self = this;
         var options = {
             url: 'http://www.urbandictionary.com/iphone/search/define',
             term: target,
             headers: {
                 'Referer': 'http://m.urbandictionary.com'
             },
             qs: {
                 'term': target
             }
         };

         function callback(error, response, body) {
             if (!error && response.statusCode == 200) {
                 var page = JSON.parse(body);
                 var definitions = page['list'];
                 if (page['result_type'] == 'no_results') {
                     self.sendReplyBox('No results for <b>"' + Tools.escapeHTML(target) + '"</b>.');
                     return room.update();
                 } else {
                     if (!definitions[0]['word'] || !definitions[0]['definition']) {
                         self.sendReplyBox('No results for <b>"' + Tools.escapeHTML(target) + '"</b>.');
                         return room.update();
                     }
                     var output = '<b>' + Tools.escapeHTML(definitions[0]['word']) + ':</b> ' + Tools.escapeHTML(definitions[0]['definition']).replace(/\r\n/g, '<br />').replace(/\n/g, ' ');
                     if (output.length > 400) output = output.slice(0, 400) + '...';
                     self.sendReplyBox(output);
                     return room.update();
                 }
             }
         }
         request(options, callback);
     },

     def: 'define',
     define: function(target, room, user) {
         if (!this.canBroadcast()) return;
         if (!target) return this.parse('/define [word] - Gives the definition of the specified word.');
         target = toId(target);
         if (target > 50) return this.sendReply('Word can not be longer than 50 characters.');
         var self = this;
         var options = {
             url: 'http://api.wordnik.com:80/v4/word.json/' + target + '/definitions?limit=3&sourceDictionaries=all' +
                 '&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
         };

         function callback(error, response, body) {
             if (!error && response.statusCode == 200) {
                 var page = JSON.parse(body);
                 var output = '<b>Definitions for ' + target + ':</b><br />';
                 if (!page[0]) {
                     self.sendReplyBox('No results for <b>"' + target + '"</b>.');
                     return room.update();
                 } else {
                     var count = 1;
                     for (var u in page) {
                         if (count > 3) break;
                         output += '(' + count + ') ' + page[u]['text'] + '<br />';
                         count++;
                     }
                     self.sendReplyBox(output);
                     return room.update();
                 }
             }
         }
         request(options, callback);
     }

 };
