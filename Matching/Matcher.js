var natural = require('natural');

var Matcher = (function () {
	/*
	 * The singleton instance.
	 */
	var instance;

	/*
	 * Default threshold dice coefficient
	 */
	var diceThreshold = 0.5;

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
				var dice, wupalmer;
				dice = natural.DiceCoefficient(reference.name, poi.name);

				if (dice > diceThreshold && (reference.category && poi.category)) {
					wupalmer = natural.WuPalmer(reference.category, poi.category);
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