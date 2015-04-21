/* This is the file where all / most of the Biblia league 
 * code will be stored. 
*/
exports.commands = {
	biblia: function(target, room, user, connection) {
		if (!this.canTalk()) return;
		if (!this.canBroadcast()) return;
		var command = toId(target);
		var reply = "";
		switch (command) {
			case 'site':
			case 'website':
				reply +=		'Our website can be found <a href="http://thebiblialeague.webs.com/">here.</a>';
			break;
		}
		this.sendReplyBox(reply);
	}
};
