var Dice = (function () {
	/*
	 * The singleton instance.
	 */
	var instance;

	/*
	 * Constructor
	 */
	var dice = function () {

	}

	/**
	 *
	 */
	dice.prototype.rollTheDice = function (strA, strB) {
		var strAbigr = bigrams(strA.toLowerCase());
		var strBbigr = bigrams(strB.toLowerCase());

		var intersections = 0;
		for (var i = 0; i < strAbigr.length; i++) {
			var intersectingBigrams = [];
			for (var j = 0; j < strBbigr.length; j++) {
				if ((strAbigr[i] == strBbigr[j]) && (!intersection(intersectingBigrams, strAbigr[i]))) {
					intersections++;
					intersectingBigrams.push(strAbigr[i]);
				}
			}
		}

		return (2*intersections) / (strAbigr.length + strBbigr.length);
	}

	/**
	 *
	 */
	var bigrams = function (str) {
		var b =[];
		for (var i = 0; i < str.length - 1; i++) {
			b.push(str.slice(i, i+2));
		}
		return b;
	}

	/**
	 *
	 */
	var intersection = function(arrayA, arrayB) {
		for (var i = 0; i < arrayA.length; i++) {
			if (arrayA[i] == arrayB) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Creates an instance if not already available
	 */
	var createInstance = function () {
		if (!instance) instance = new dice();
		return instance;
	}

	return createInstance();
})();

module.exports = Dice;