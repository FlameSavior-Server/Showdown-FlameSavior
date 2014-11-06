exports.commands = {

    give: 'award',
    givebucks: 'award',
    givepoints: 'award',
    gb: 'award',
    award: function(target, room, user, connection, cmd) {
        if (!this.can('hotpatch')) return false;
        if (!target) return this.sendReply('The proper syntax is /' + cmd + ' [user], [amount]');
        target = this.splitTarget(target);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
        if (!target) return this.sendReply('You need to mention the number of points you want to give ' + targetUser.name);
        if (isNaN(target)) return this.sendReply("That isn't even a number, smartass.");
        if (target < 1) return this.sendReply('You cannot give ' + targetUser.name + ' anything less than 1 point!');
        money.giveAmt(targetUser.userid, 'money', target);
        var total = (parseInt(target) == 1) ? 'point' : 'points';
        var points = (money.checkAmt(targetUser.userid, 'money') == 1) ? 'point' : 'points';
        targetUser.send('|popup|' + user.name + ' has given you ' + target + ' ' + points + '. You now have ' + money.checkAmt(targetUser.userid, 'money') + ' ' + total + '.');
        Rooms.rooms.staff.add(user.name + ' has given ' + targetUser.name + ' ' + target + ' ' + points + '. This user now has ' + money.checkAmt(targetUser.userid, 'money') + ' ' + total + '.');
        return this.sendReply(targetUser.name + ' was given ' + target + ' ' + points + '. This user now has ' + money.checkAmt(targetUser.userid, 'money') + ' ' + total + '.');
    },
    
    removebucks: 'remove',
    rb: 'remove',
    tb: 'remove',
    takebucks: 'remove',
    take: 'remove',
    remove: function(target, room, user, connection, cmd) {
        if (!this.can('hotpatch')) return false;
        if (!target) return this.sendReply('The proper syntax is /'+cmd+' [user], [amount]');
        target = this.splitTarget(target);
        var targetUser = this.targetUser;
	if (!targetUser) return this.sendReply('User '+this.targetUsername+' not found.');
	if (!target) return this.sendReply('You need to mention the number of points you want to remove from '+targetUser.name);
	if (isNaN(target)) return this.sendReply("That isn't even a number, smartass.");
	if (money.checkAmt(targetUser.userid, 'money') < target) return this.sendReply('You take away more points than what '+targetUser.name+' has!');
        money.removeAmt(targetUser.userid, 'money', target);
        var total = (money.checkAmt(targetUser.userid, 'money') == 1) ? 'point' : 'points';
	var points = (target == 1) ? 'point' : 'points';
        targetUser.send('|popup|'+user.name+' has taken ' + target + ' away '+points+' from you. You now have ' + money.checkAmt(targetUser.userid, 'money') + ' '+total+'.');
        Rooms.rooms.staff.add(user.name + ' has taken away ' + target + ' ' + points + ' from '+targetUser.name+'. This user now has ' + money.checkAmt(targetUser.userid, 'money') + ' '+total+'.');
        return this.sendReply('You have taken away '+target+' '+points+' from '+targetUser.name+'. This user now has ' + money.checkAmt(targetUser.userid, 'money') + ' '+total+'.');
    },
    
    cash: 'atm',
    points: 'atm',
    bucks: 'atm',
    cash: 'atm',
    purse: 'atm',
    wallet: 'atm',
    atm: function(target, room, user) {
        if (!this.canBroadcast()) return;
        if (!target) target = user.userid;
        var badges = money.checkAmt(target, 'badges');
        var moneh = money.checkAmt(target, 'money');
        var symbols = money.checkAmt(target, 'symbols');
        if (badges === 0) badges = 'no';

        var p1 = (badges === 1 ? 'Gym Badge' : 'Gym Badges');

        if (moneh === 0) moneh = 'no';

        var q1 = (money === 1 ? 'Point' : 'Points');

        if (symbols === 0) symbols = 'no';
        var s1 = (symbols === 1 ? 'Frontier Symbol' : 'Frontier Symbols');
        if (Users.getExact(target)) {
            var line1 = '<font color = ' + color.get(Users.get(target).userid) + '><b>' + Users.getExact(target).name + '</b></font> has ' + moneh + ' ' + q1 + '.<br/>';
            var line2 = '<font color = ' + color.get(Users.get(target).userid) + '><b>' + Users.getExact(target).name + '</b></font> has ' + badges + ' ' + p1 + '.<br/>';
            var line3 = '<font color = ' + color.get(Users.get(target).userid) + '><b>' + Users.getExact(target).name + '</b></font> has ' + symbols + ' ' + s1 + '.<br/>';
        } else {
            var line1 = '<font color = ' + color.get(toId(target)) + '><b>' + target + '</b></font> has ' + moneh + ' ' + q1 + '.<br/>';
            var line2 = '<font color = ' + color.get(toId(target)) + '><b>' + target + '</b></font> has ' + badges + ' ' + p1 + '.<br/>';
            var line3 = '<font color = ' + color.get(toId(target)) + '><b>' + target + '</b></font> has ' + symbols + ' ' + s1 + '.<br/>';
        }
        if (badges === 'no' || !badges) line2 = '';
        if (symbols === 'no' || !symbols) line3 = '';
        this.sendReplyBox(line1 + line2 + line3);
    },
  
    closeshop: function(target, room, user) {
        if (!this.can('hotpatch')) return false;
        if (global.shopclosed === true) return this.sendReply('The shop is already closed.');
        global.shopclosed = true;
        this.sendReply('The point shop is now closed.');
    },

    openshop: function(target, room, user) {
        if (!this.can('hotpatch')) return false;
        if (!global.shopclosed) return this.sendReply('The shop is already open.');
        global.shopclosed = false;
        this.sendReply('The point shop is now open.');
    },


    shop: function(target, room, user) {
        if (!this.canBroadcast()) return;
        if (this.broadcasting) return this.sendReplyBox('<center><b>Click <button name = "send" value = "/shop">here</button> to enter our shop!');
        var status = (!global.shopclosed) ? '<b>Shop status: <font color = "green">Open</font></b><br />To buy an item, type in /buy [item] in the chat, or simply click on one of the buttons.' : '<b>Shop status: <font color = "red">Closed</font></b>';
        this.sendReplyBox('<center><h3><b><u>Point Shop</u></b></h3><table border = "1" cellspacing = "0" cellpadding = "2"><tr><th>Item</th><th>Description</th><th>Price</th><th></th></tr>' +
            '<tr><td>Symbol</td><td>Buys a symbol to be placed in front of your username.</td><td>5</td><td><button name = "send", value = "/buy symbol"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Color</td><td>Buys the ability to change your username color in the chat.</td><td>15</td><td><button name = "send", value = "/buy color"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Avatar</td><td>Buys a custom avatar.</td><td>25</td><td><button name = "send", value = "/buy avatar"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Anim Avatar</td><td>Buys an animated custom avatar.</td><td>40</td><td><button name = "send", value = "/buy animavatar"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Card</td><td>Buys a trainer card.</td><td>40</td><td><button name = "send", value = "/buy card"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Fix</td><td>Buys the ability to edit your custom avatar or trainer card</td><td>10</td><td><button name = "send", value = "/buy fix"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Room</td><td>Buys a chatroom for you to own (with reason).</td><td>80</td><td><button name = "send", value = "/buy room"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Poof Message</td><td>Buys the ability to add a poof message of your choice into the list of poof messages.</td><td>15</td><td><button name = "send", value = "/buy poofmessage"><b>Buy!</b></button></td></tr>' +
            '<tr><td>POTD</td><td>Buys the ability to set the Pokémon of the Day. Not purchasable if there is already a POTD for the day.</td><td>5</td><td><button name = "send", value = "/buy potd"><b>Buy!</b></button></td></tr>' +
            '</table><br />' + status + '</center>');
    },
    
    buy: function(target, room, user) {
        if (global.shopclosed === true) return this.sendReply("The shop is closed for now. Wait until it re-opens shortly.");
        target = toId(target);

        if (target === 'symbol') {
            if (user.hassymbol) return this.sendReply("You've already bought a custom symbol!");
            if (user.needssymbol) return this.sendReply("You've already bought a custom symbol!");
            var price = 5;
            if (money.checkAmt(user, "money") < price) return this.sendReply("You don't have enough money to buy a symbol.");

            room.add(user.name + ' bought a custom symbol!');
            this.sendReply("You have bought a custom symbol. The symbol will wear off once you remain offline for more than an hour, or once the server restarts.");
            this.sendReply("Type /customsymbol [symbol] into the chat to add a symbol next to your name!");
            user.needssymbol = true;

        } else if (target === 'color') {
            var price = 15;
            if (money.checkAmt(user, "money") < price) return this.sendReply("You don't have enough money to buy a custom color.");


            room.add(user.name + ' bought a custom color!');
            Rooms.rooms.staff.add(user.name + ' has bought a custom color');
            this.sendReply("You have bought the ability to change the color of your name. This only applies to the chat, and not PMs or the userlist.");
            this.sendReply('|html|Type /usercolor [hex code] into the chat to change your color! If you don\'t know what a hex color code is, check  If you don\'t know what a hex color code is, <a href = "http://www.2createawebsite.com/build/hex-colors.html"><u>this</u></a> link should help you choose.');
            user.needscolor = true;

        } else if (target === 'avatar') {
            if (user.hasavatar === true) return this.sendReply("You've already bought a custom avatar! Type in /customavatar [URL] to request it.");
	    if (!Number(user.avatar)) return this.sendReply('You already have a custom avatar!');
            var price = 25;
            if (money.checkAmt(user, "money") < price) return this.sendReply("You don't have enough money to buy a custom avatar.");


            room.add(user.name + ' bought a custom avatar!');
            Rooms.rooms.staff.add(user.name + ' has bought a custom avatar.');
            this.sendReply("You have bought a custom avatar.");
            this.sendReply("Type in /customavatar [url] to request a custom avatar. The file cannot be in the .GIF format.");
            user.hasavatar = true;

        } else if (target === 'animavatar') {
            if (user.hasanimavatar === true) return this.sendReply("You've already bought an animated custom avatar! Type in /customanimavatar [URL] to request it.");
            if (user.avatar.toString().indexOf('.gif') == (user.avatar.length - 4)) return this.sendReply("You already have a custom animated avatar!");
	    var price = (!parseInt(user.avatar)) ? 20 : 40;
            if (money.checkAmt(user, "money") < price) return this.sendReply("You don't have enough money to buy an animated avatar.");

            room.add(user.name + ' bought an animated custom avatar!');
            Rooms.rooms.staff.add(user.name + ' has bought an animated custom avatar.');
            this.sendReply("You have bought an animated custom avatar.");
            this.sendReply("Type /customanimavatar [url] to request an animated avatar. The file must be in the .GIF format.");
            user.hasanimavatar = true;

        } else if (target === 'room') {
            if (user.hasroom === true) return this.sendReply("You've already bought a chatroom for yourself!");
            var price = 80;
            if (money.checkAmt(user, "money") < price) return this.sendReply("You don't have enough money to buy a symbol.");

            room.add(user.name + ' bought a chatroom!');
            Rooms.rooms.staff.add(user.name + ' has bought a chatroom.');
            this.sendReply("You have bought a chatroom for you to own.");
            this.sendReply("PM an admin to create your room and make you roomowner.");
            user.hasroom = true;

        } else if (target === 'card') {
            if (tcs.toString().indexOf(' ' + user.userid) > -1) return this.sendReply("You've already bought a trainer card!");
            var price = 40;
            if (money.checkAmt(user, "money") < price) return this.sendReply("You don't have enough money to buy a Trainer Card.");

            room.add(user.name + ' bought a trainer card!');
            Rooms.rooms.staff.add(user.name + ' has bought a trainer card.');
            this.sendReply("You have bought a trainer card. PM an admin to add it.");
            for (var i in Users.users) {
            	if (Users.users[i].can('hotpatch')) Users.users[i].send('|pm| Bot|'+user.name+' has bought a trainer card.')
            }

        } else if (target === 'fix') {
            var price = 10;
            if (money.checkAmt(user, "money") < price) return this.sendReply("You don't have enough money to buy a fix.");
            var nofix = 0;
            if (!Config.customavatars[user.userid]) nofix++;
            if (!require('./funstuff/trainercards').commands[user]) nofix++;
            if (nofix >= 2) return this.sendReply('You can\'t buy a fix when you neither have a trainer card nor a custom avatar!');
            room.add(user.name + ' bought a trainer card/avatar fix!');
            Rooms.rooms.staff.add(user.name + ' has bought a fix.');
            this.sendReply("You have bought a fix for your trainer card or avatar.");
            this.sendReply("PM the changes to an admin. You may only fix either your TC or avatar at a time.");

        } else if (target === 'poofmessage') {
            var price = 15;
            if (money.checkAmt(user, "money") < price) return this.sendReply("You don't have enough money to add a poof message.");

            room.add(user.name + ' bought the ability to add a poof message!');
            Rooms.rooms.staff.add(user.name + ' has bought the ability to add a poof message.');
            this.sendReply("You have bought the ability to add a poof message of your own choice into the list of possible poof messages.");
            this.sendReply("The poof message you choose is added to the list of all poof messages. Your poof message may be chosen at random once when someone uses the poof command.");
            this.sendReply('All poof messages will appear in this style- "(user) (message)". For example, "' + user.name + ' died!"');
            this.sendReply("Type /addpoof [message] to add a custom poof message. The message cannot contain profanity.");
            user.buypoof = true;

        } else if (target === 'potd') {
            if (Config.potd) return this.sendReply('The Pokémon of the Day has already been set.');
            var price = 5;
            if (money.checkAmt(user, "money") < price) return this.sendReply("You don't have enough money to set the POTD.");

            room.add(user.name + ' bought the ability to set the POTD!');
            Rooms.rooms.staff.add(user.name + ' has bought the ability to set the POTD.');
            this.sendReply("You have bought the ability to set the POTD of the day.");
            this.sendReply("Type /setpotd [pokémon] to set the Pokémon of the day.");
            user.setpotd = true;
        } else {
            return this.sendReply("That item isn't in the shop.");
        }
        money.removeAmt(toId(user), "money", parseInt(price));
    },

    setpotd: function(target, room, user) {
        if (!user.setpotd) return this.sendReply("You need to buy the ability to set the Pokemon of the Day!");
        if (user.alreadysetpotd) return this.sendReply("You've already set the POTD!");

        Config.potd = target;
        Simulator.SimulatorProcess.eval('Config.potd = \'' + toId(target) + '\'');
        if (!target) return this.sendRepply("You need to choose a Pokémon to set as the POTD.");
        if (Rooms.lobby) Rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokémon of the Day is now ' + target + '!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>');
        this.logModCommand('The Pokemon of the Day was changed to ' + target + ' by ' + user.name + '.');
        user.setpotd = false;
        user.alreadysetpotd = true;
    },
    
    customcolor: 'usercolor',
    setcolor: 'usercolor',
    usercolor: function(target, room, user) {
        if (!user.needscolor) {
            return this.sendReply('You need to buy the ability to change color first!');
        }
        target = toId(target);
        if (!target) return this.sendReply('|html|You need to specify a hex color code to set it as your username color. <a href = "http://www.2createawebsite.com/build/hex-colors.html"><u>This</u></a> link should help you choose.');
        var no = ['g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        for (var i = 0; i < no.length; i++) {
            if (target.indexOf(no[i]) > -1) return this.sendReply('|html|A hex color cannot contain letters beyond \'F\'. If you don\'t know what a hex color code is, <a href = "http://www.2createawebsite.com/build/hex-colors.html"><u>This</u></a> should help you choose.');
        }
        if (target.length !== 6) return this.sendReply('|html|The hex code must be exactly 6 characters long. If you don\'t know what a hex color code is, <a href = "http://www.2createawebsite.com/build/hex-colors.html"><u>This</u></a> should help you choose.');

        color.set(user.userid, target);
        user.needscolor = false;
        return this.sendReply('|html|Your color has successfully been set as <font color = #' + target + '><b>#' + target);
    },

    customanimavatar: function(target, user, room) {
        target = target.trim()
        if (user.requestedanimavy === true) return this.sendReply("You've already requested an animated avatar, wait for it to be added.");
        if (!user.hasanimavatar) return this.sendReply("You haven't bought an animated custom avatar yet!");
        if (!target) return this.sendReply("You have to enter in the image URL of the avatar you want. The avatar must be a .GIF image file.");
        if (target.indexOf('.gif') === -1) return this.sendReply("The file format must be .GIF.");
        this.sendReply("You have successfully requested an animated avatar! Wait for it to be added.");
        for (var i in Users.users) {
          if (Users.users[i].can('hotpatch')) {
            Users.users[i].send('|pm| Bot|' + Users.users[i].getIdentity() + '|'+user.name+' has bought a custom avatar. URL- '+target);
          }
        }
        return user.requestedanimavy = true;
    },


    customavatar: function(target, room, user) {
        target = target.trim()
        if (user.requestedavy === true) return this.sendReply("You've already requested a custom avatar, wait for it to be added.");
        if (!user.hasavatar) return this.sendReply("You haven't bought a custom avatar yet!");
        if (!target) return this.sendReply("You have to enter in the image URL of the avatar you want. The avatar cannot be a .GIF image file.");
        if (target.lastIndexOf('.gif') == target.length - 4) return this.sendReply("The file format cannot be .GIF.");
        this.sendReply("You have successfully requested an avatar! Wait for it to be added.");
        for (var i in Users.users) {
          if (Users.users[i].can('hotpatch')) {
            Users.users[i].send('|pm| Bot|' + Users.users[i].getIdentity() + '|'+user.name+' has bought a custom avatar. URL- '+target);
          }
        }
        user.requestedavy = true;
    },

    customsymbol: 'cs',
    cs: function(target, room, user) {
        if (user.hassymbol) return this.sendReply("You've already added a symbol to your name!");
        if (!user.needssymbol) return this.sendReply('You need to buy a custom symbol from the shop first!');
        target = target.trim();
        if (!target) return this.sendReply('You need to specify a symbol!');
        if (target.length > 1) return this.sendReply('The symbol can only be one character long.');
        var notallowed = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '~', '#', '+', '%', '@', '&', '★'];
        for (var i = 0; i < notallowed.length; i++) {
            if (target.indexOf(notallowed[i]) !== -1) return this.sendReply('For safety reasons, ' + target + ' cannot be used as a custom symbol.');
        }
        user.getIdentity = function(roomid) {
            if (this.locked) {
                return '‽' + this.name;
            }
            if (this.mutedRooms[roomid]) {
                return '!' + this.name;
            }
            return target + this.name;
        };
        user.updateIdentity();
        this.sendReply('You have successfuly changed your symbol to ' + target + '!');
        user.hassymbol = true;
        user.needssymbol = false;
    },
  };
    
