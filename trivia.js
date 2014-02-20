exports.trivia = function(t) {
  if (typeof t != "undefined") var trivia = t; else var trivia = new Object();
var stuff = {
isOn: false,
question: 'No Question',
host: 'no-one',
allpoints: new Array(),

};
for(var i in stuff)  trivia[i] = stuff[i]; 

return trivia
};
  
    var cmds = {
        question: function(target, room, user){
            if(!this.canBroadcast)
             if(trivia.isOn != true){
                this.sendReply('There is no trivia game currently')
                }
                else
                this.sendReply('The current question is ' +  trivia.question)
            },
        nquestion: function(target, room, user){
            var target = toId(target);
             if(trivia.isOn != true){
                this.sendReply('There is no trivia game currently')
                }
           else if(trivia.host === user.userid || this.can('broadcast')){
                this.add('The new question is: ' + target + 'post your answers in chat.')
                trivia.question = target;
                }
                else 
                 return false
                                 
            },
            triv: 'starttrivia',
        starttrivia: function(target, room, user){
            if(!user.can('broadcast')){
                this.sendReply('You are unauthorized!.');
                }
                                else if(trivia.isOn == true){
                                this.sendReply('There is already a game going on :I') 
                                }
                                else if(room.id !== 'trivia'){
                                this.sendReply('Only in trivia room :I');
                                }
                else {
            trivia.isOn = true;
                        trivia.question = 'Nothing at the moment';
                        trivia.host = 'No-one at the moment'
            Rooms.rooms.lobby.add('Go to the room trivia to play trivia')
                        }
            },
                        endtrivia: function(target, room, user){
                        if(!user.can('broadcast')){
                this.sendReply('You are unauthorized!.');
                }
                                else if(trivia.isOn == false){
                                this.sendReply('There is no game going on :I') 
                                }
                                else {
                        trivia.isOn = true;
                        trivia.question = 'Nothing at the moment';
                        trivia.host = 'No-one at the moment'
                        }
                        },

        host: function(target, room, user){
             if(!trivia.isOn){
                this.sendReply('There is no trivia game currently');
                }
                else {
            this.sendReply('The current host is ' +  trivia.host);
                        }
            },
        newhost: function(target, room, user){
              if(trivia.isOn != true){
                this.sendReply('There is no trivia game currently')
                }
            var taruser = Users.get(target);           
             if(!this.can('broadcast')|| trivia.host == user.userid){
                trivia.question = 'nothing at the moment';
                    trivia.host = taruser.userid;
                    this.add('The new host is' + taruser.name)
                }
                else if(!taruser){
                this.sendReply('Either you didnt specify a user or that user doesn\'t exist');
                    }
                    else
                    return false;
            },
       /** addpoint: function(target, room, user){
            var target = toId(target);
            var taruser = Users.get(target);
              if(trivia.isOn != true){
                this.sendReply('There is no trivia game currently')
                }
            if(!user.can('mute') || trivia[room.id].host !== user.userid){
                this.sendReply('You are unauthorized!')
                }
                else
                trivia.points[taruser.userid] += 1;
                this.add(taruser.name + 'has recieved a point from ' + user.name + '.')
                
            },
       **/
       
       /** score: function(target, room, user) {
            var taruser = Users.get(target)
             if(!this.canBroadcast)
            if(trivia.allpoint[user.userid] || trivia.allpoints[user.userid] == 0){
                this.sendReply('You have no points.');
                } 
                   if(taruser){
                this.sendReply(taruser.name + ' has' + trivia.allpoints[user.userid] + 'points');
                }
                else
                this.sendReply('You have have ' + trivia.allpoints[user.userid] + 'points');
                }
           **/
        };
                
for (var i in cmds) CommandParser.commands[i] = cmds[i];
