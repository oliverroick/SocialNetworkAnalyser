var DICE = require('./Dice.js')

var Matcher = (function () {
	/*
	 * The singleton instance.
	 */
	var instance;

	/*
	 * Default threshold dice coefficient
	 */
	var diceThreshold = 0.7;

	/*
	 * Constructor
	 */
	var matcher = function () {
		
	}

	/*
	 * Returns the most likely matches for the reference
	 *
	 * @param {Object} Reference that other candidates are matched
	 * @param {Object} Arrays of matching candidates
	 * @param {number} Costum threshold value for dice coefficient
	 */
	matcher.prototype.match = function (reference, candidates, d) {
		var matches = {};

		if (d) diceThreshold = d;
		
		for (var dataset in candidates) {
			matches[dataset] = [];
			candidates[dataset].forEach(function (poi) {
				if (DICE.rollTheDice(reference.name, poi.name) > diceThreshold) {
					matches[dataset].push(poi.id);
					console.log(reference.name + ': ' + poi.name + ': ' + DICE.rollTheDice(reference.name, poi.name));
				}
			});
		}
		return matches;
	}

	/**
	 * Creates an instance if not already available
	 */
	var createInstance = function () {
		if (!instance) instance = new matcher();
		return instance;
	}

	return createInstance();
})();

module.exports = Matcher;