exports.BattleScripts = {
	gen: 6,
	
	init: function () {
	for (var i in this.data.FormatsData) {
	this.modData('FormatsData', i).unreleasedHidden = false;
		}
	}
};
