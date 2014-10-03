var fs = require('fs');
var datestuff = exports.datestuff = {
				  		  
		setdate: function(name) {
			var last = fs.readFileSync('config/lastseen.json');
            var lastseen = JSON.parse(last);
			lastseen[name] = Date.now();
			var last2 = JSON.stringify(lastseen, null, 1);
			fs.writeFile('config/lastseen.json', last2);
			return;
		    },	  
				  
	  setdateall: function() {
	  var last = fs.readFileSync('config/lastseen.json');
            var lastseen = JSON.parse(last);
			  for (var x in Users.users) {
			  if (Users.users[x].connected && Users.users[x].named) {
			  lastseen[x] = Date.now();
			  }
			  }
			  var last2 = JSON.stringify(lastseen, null, 1);
			fs.writeFile('config/lastseen.json', last2);
			return;
		  },
				  
		getdate: function(name) {
			var last = fs.readFileSync('config/lastseen.json');
        var lastseen = JSON.parse(last);
		if (!lastseen[name]) return 'never';
			     var getdate = Date.now() - lastseen[name];
				  return getdate;
				  }
				  };
