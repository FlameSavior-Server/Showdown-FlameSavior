/**
 * Welcome to io.js!
 * Created by CreaturePhil
 * 
 * io.js contains standard streams.
 * 
 *
 * @license MIT license
 */
 
 
/* This is for standard input for the primitive type number in JavaScript. Standard input is data (often text) going into a program. 
 * The program requests data transfers by use of the read operation.
 * @param property is the user's property that will be set to info in the function,
 * file is the storage for the data, and user is an object having its property modified.
 * @return void
 */
function stdinNumber(file, user, property){
	var info = 0;
	var match = false;
	
	var data = fs.readFileSync('config/'+file,'utf8');
	
	var row = (''+data).split("\n");
	for (var i = row.length; i > -1; i--) {
		if (!row[i]) continue;
		var parts = row[i].split(",");
		var userid = toUserid(parts[0]);
		if (user.userid === userid) {
			info = Number(parts[1]);
			match = true;
			if (match === true) {
				break;
			}
		}
	}
	Object.defineProperty(user, property, { value : info, writable : true });
}
	
/* This is for standard output for the primitive type number in JavaScript. 
 * Standard output is the stream where a program writes its output data. 
 * The program requests data transfer with the write operation.
 * @param property is the user's property,
 * file is the storage for the data, user is an object having its property modified,
 * amount is how much you want to change the user's property,
 * @return void, this function just writes the info into the file
 */
function stdoutNumber(file, user, property, amount) {
	var data = fs.readFileSync('config/'+file,'utf8');
	var match = false;
	var info = 0;
	var row = (''+data).split("\n");
	var line = '';
	for (var i = row.length; i > -1; i--) {
		if (!row[i]) continue;
		var parts = row[i].split(",");
		var userid = toUserid(parts[0]);
		if (user.userid === userid) {
			info = Number(parts[1]);
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
		}
	}
	var total = info + amount;
	Object.defineProperty(user, property, { value : total, writable : true });
	if (match === true) {
		var re = new RegExp(line,"g");
		fs.readFile('config/'+file, 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		var result = data.replace(re, user.userid+','+total);
		fs.writeFile('config/'+file, result, 'utf8', function(err) {
			if (err) return console.log(err);
		});
		});
	} else {
		var log = fs.createWriteStream('config/'+file, {'flags': 'a'});
		log.write("\n"+user.userid+','+total);
	}
}
	
/* This is for standard input for the primitive type string in JavaScript. Standard input is data (often text) going into a program. 
 * The program requests data transfers by use of the read operation.
 * @param file is where the data is stored, user is the object having its property modified,
 * and property is the user's property being modified.
 * @return void
 */
function stdinString(file, user, property) {
		var info = "";
		var match = false;
	
    	var data = fs.readFileSync('config/'+file,'utf8');

        var row = (''+data).split("\n");
        for (var i = row.length; i > -1; i--) {
                if (!row[i]) continue;
                var parts = row[i].split(",");
                var userid = toUserid(parts[0]);
                if (user.userid == userid) {
                	info = String(parts[1]);
                    match = true;
                    if (match === true) {
                            break;
                    }
                }
        }
		Object.defineProperty(user, property, { value : info, writable : true });
}
	
/* This is for standard output for the primitive type string in JavaScript. 
 * Standard output is the stream where a program writes its output data. 
 * The program requests data transfer with the write operation.
 * @param file is where the data is stored, user is the object where it's parameter is being modified,
 * property is the user's property being modified, and
 * info is used to stored the new user's property and being written in the file.
 * @return void, this function just writes the info into the file
 */
function stdoutString(file, user, property, info) {
	var data = fs.readFileSync('config/'+file,'utf8');
	var match = false;
	var row = (''+data).split("\n");
	var line = '';
	for (var i = row.length; i > -1; i--) {
		if (!row[i]) continue;
		var parts = row[i].split(",");
		var userid = toUserid(parts[0]);
		if (user.userid == userid) {
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
		}
	}
	Object.defineProperty(user, property, { value : info, writable : true });
	if (match === true) {
		var re = new RegExp(line,"g");
		fs.readFile('config/'+file, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		var result = data.replace(re, user.userid+','+info);
		fs.writeFile('config/'+file, result, 'utf8', function (err) {
			if (err) return console.log(err);
		});
		});
	} else {
		var log = fs.createWriteStream('config/'+file, {'flags': 'a'});
		log.write("\n"+user.userid+','+info);
	}
}

exports.stdinNumber = stdinNumber;
exports.stdoutNumber = stdoutNumber;
exports.stdinString = stdinString;
exports.stdoutString = stdoutString;
