exports.commands = {
	testing143: function (target, room, user) {
		if (room.id === 'testing') return this.sendReply("Ask one of the Mods in the Help room.");
		this.sendReply("Ask a Mod in the Help room.");
		this.parse('/join testing');
	}
};
