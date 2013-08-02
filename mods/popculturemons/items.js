exports.BattleItems = {
  "dwn006flames": {
		id: "dwn007flames",
		name: "DWN-007 Flames",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onStart: function (pokemon) {
			if (pokemon.species === 'Megaman') {
				this.add('-item', pokemon, 'DWN-007 Flames');
				if (pokemon.formeChange('Megaman-Fire')) {
					this.add('-formechange', pokemon, 'Megaman-Fire');
				}
			}
		},
		desc: "Changes Megaman to Megaman-Fire."
	},
	"dwn006bomb": {
		id: "dwn006bomb",
		name: "DWN-006 Bomb",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onStart: function (pokemon) {
			if (pokemon.species === 'Megaman') {
				this.add('-item', pokemon, 'DWN-006 Bomb');
				if (pokemon.formeChange('Megaman-Bomb')) {
					this.add('-formechange', pokemon, 'Megaman-Bomb');
				}
			}
		},
		desc: "Changes Megaman to Megaman-Bomb."
	}
};	
