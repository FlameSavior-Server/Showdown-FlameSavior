//This gives users console access. Don't give it to users unless you trust them completely.
exports.sysopAccess = function () {
  
  //go ahead and add in a comma separated list of names in the array below. I added my name by default for the fun of it, but go ahead and remove it if you want.
    var systemOperators = ['siiilver'];

    Users.User.prototype.hasSysopAccess = function () {
        if (systemOperators.indexOf(this.userid) > -1) {
            return true;
        } else {
            return false;
        }
		};
    };
