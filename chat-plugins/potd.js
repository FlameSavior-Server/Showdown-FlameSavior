exports.commands = {
  declarepotd: function(target, room, user) {
    if (room.id != 'lobby') return this.sendReply("The command must be used in Lobby.");
    if (!this.can('declare')) return false;
    this.add('|raw|<div class="broadcast-blue"><b>AOTD has begun in GoldenrodRadioTower!! ' +
             'Join now to nominate your favorite artist for AOTD to be featured on the ' +
             'official page next to your name for a chance to win the monthly prize at the end of the month!!</b></div>'
    );
    this.logModCommand(user.name + " used declarepotd.");
  }
};