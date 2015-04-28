export default clearall;

function clearall() {
  let commands = {
    clearall(target, room) {
      if (!this.can('clearall')) return false;
      if (room.battle) return this.sendReply('You cannot /clearall in battle rooms.');

      let len = room.log.length;
      while (len--) {
        room.log[len] = '';
      }

      let users = [];
      for (let user in room.users) {
        users.push(user);
        Users.get(user).leaveRoom(room, Users.get(user).connections[0]);
      }

      len = users.length;
      setTimeout(() => {
        while (len--) {
          Users.get(users[len]).joinRoom(room, Users.get(users[len]).connections[0]);
        }
      }, 1000);
    }
  };

  Object.merge(CommandParser.commands, commands);
}
