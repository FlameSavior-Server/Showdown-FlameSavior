exports.BattleMovedex = {
  /******************************************************************
	Two-turn moves:
	- having a charge turn is useless, so lets get rid of the charge turn yet keep the moves balanced

	Justification:
	- These moves fucking suck
	******************************************************************/

        "solarbeam": {
		num: 76,
		accuracy: 100,
		basePower: 110,
		category: "Special",
		desc: "Deals damage to one adjacent target, The move completes in one turn.",
		shortDesc: "Its a good move.",
		id: "solarbeam",
		isViable: true,
		name: "SolarBeam",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"razorwind": {
		num: 13,
		accuracy: 100,
		basePower: 55,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a higher chance for a critical hit. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges, then hits foe(s) turn 2. High crit ratio.",
		id: "razorwind",
		name: "Razor Wind",
		pp: 10,
		priority: 0,
		willCrit: true,		
		secondary: false,
		target: "allAdjacentFoes",
		type: "Dark"
	},
	"skyattack": {
		num: 143,
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target with a 30% chance to flinch it and a higher chance for a critical hit. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges, then hits turn 2. 30% flinch. High crit.",
		id: "skyattack",
		name: "Sky Attack",
		pp: 5,
		priority: 0,
		secondary: false
		target: "any",
		type: "Flying"
	},
	"freezeshock": {
		num: 553,
		accuracy: 90,
		basePower: 130,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to paralyze it. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges turn 1. Hits turn 2. 30% paralyze.",
		id: "freezeshock",
		name: "Freeze Shock",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"iceburn": {
		num: 554,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 30% chance to burn it. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges turn 1. Hits turn 2. 30% burn.",
		id: "iceburn",
		name: "Ice Burn",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	/******************************************************************
	New Moves:
	- New moves made for competetive and flavour reasons for the new p.culture 'mons.

	Justification:
	- The new pokemon need something special about them, and new moves and such are ways to make then noticable
	******************************************************************/
	"megabuster": {
		num: 800,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "Nothing really special BUT ITS THE FUCKIN MEGA BUSTER",
		id: "megabuster",
		isViable: true,
		name: "Mega Buster",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Techno"
	},
	"multibuster": {
		num: 801,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits four to five times.",
		shortDesc: "Hits 4-5 times in one turn.",
		id: "multibuster",
		isViable: true,
		name: "Multi Buster",
		pp: 30,
		priority: 0,
		multihit: [4,5],
		secondary: false,
		target: "normal",
		type: "Techno"
	},
	"chargebuster": {
		num: 802,
		accuracy: 85,
		basePower: 120,
		category: "Special",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "The charged mega buster from mega man X and mega man 4.",
		id: "chargebuster",
		isViable: true,
		name: "Charge Buster",
		pp: 5,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Techno"
	},
	"hyperbomb": {
		num: 803,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "The hyper bomb from Bomb Man in MM1.",
		id: "hyperbomb",
		isViable: true,
		name: "Hyper Bomb",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"atomiceradication": {
		num: 804,
		accuracy: 85,
		basePower: 300,
		category: "Physical",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "A good move.",
		id: "atomiceradication",
		isViable: true,
		name: "Atomic Eradication",
		pp: 5,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Techno"
	},
	"firestorm": {
		num: 805,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "The hyper bomb from Bomb Man in MM1.",
		id: "firestorm",
		isViable: true,
		name: "Fire Storm",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	/**"ascension": {
		num: 806,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Turns a Saiyan into a super saiyan.",
		shortDesc: "Turns Saiyan to Super Saiyan.",
		id: "ascension",
		name: "Ascension",
		pp: 15,
		priority: 0,
		isContact: true,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			attacker.addVolatile(move.id, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				attacker.removeVolatile(move.id);
				return;
			}
			return null;
		},
		onHit: function(target, pokemon) {
			if (pokemon.baseTemplate.species === 'Goku' && !pokemon.transformed) {
				pokemon.addVolatile('ascension');
			}
		},
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function(pokemon, target, move) {
				if (pokemon.template.speciesid === 'gokusupersaiyan' && pokemon.formeChange('Meloetta')) {
					this.add('-formechange', pokemon, 'Meloetta');
				} else if (pokemon.formeChange('Meloetta-Pirouette')) {
					this.add('-formechange', pokemon, 'Meloetta-Pirouette');
				}
				pokemon.removeVolatile('relicsong');
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},**/	
	/******************************************************************
	New feature: Signature Pokemon
	- Selected weak moves receive a 1.5x damage boost when used by a
	  compatible Pokemon or something else that can compare to a 1.5x damage boost.

	Justification:
	- Adds much flavour and just makes sense out of a LOT of things
	- Your telling me mega man doesn't deserve 1.5x boost on his mega buster?'
	******************************************************************/
	megabuster: {
		inherit: true,
		onBasePower: function(power, user) {
			if (user.template.id === 'megaman') return power * 1.5;
		}
	},
	firestorm: {
		inherit: true,
		onBasePower: function(power, user) {
			if (user.template.id === 'megamanfire') return power * 1.5;
		}
	},
	hyperbomb: {
		inherit: true,
		onBasePower: function(power, user) {
			if (user.template.id === 'megamanbomb') return power * 1.5;
		}
	},	
	multibuster: {
		inherit: true,
		onBasePower: function(power, user) {
			if (user.template.id === 'megaman') return power * 1.5;
		}
	},
	chargebuster: {
		inherit: true,
		onBasePower: function(power, user) {
			if (user.template.id === 'megaman') return power * 1.5;
		},
		accuracy: 70
	        }		
	}	
};
