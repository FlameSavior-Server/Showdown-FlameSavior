/*****************
 * Trainer Cards *
 *****************/

exports.commands = {
	
	mercilessleague: function (target, room, user) {
		if (room.id !== 'lobby') if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/4AEkWrg.png" width="480"><br />' +
			'<img src="http://i.imgur.com/FILf3Um.png" width="280">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/charizard-megax.gif"><br />' +
			'<font color="blue">Champion: </font>StunfiskThe Great<br />' +
			'<b>We are Merciless and We Mean Business! Come challenge us or join today!</b><br />' +
			'Click <a href="http://mercilessleague.weebly.com/">here</a> to see our website<br />' +
			'Click <a href="https://docs.google.com/document/d/1OTP9JDz2Q6z6oFnvy2-jRH5o9XdFwZaJBU-ndRWpgIM/edit"> here </a>for rules and registering'
		);
	},
};
