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
	 * 
	 */
	var getFourGrams = function (term) {
		var fourGrams = natural.NGrams.ngrams(term.split(''), 4);;

		for (var i = 0; i < fourGrams.length; i++) {
			fourGrams[i] = fourGrams[i].join('');
		}

		return fourGrams;
	}

	/*
	 * 
	 */
	 var getMaxTfidf = function(reference, candidates) {
	 	var tfidf = new natural.TfIdf();

	 	candidates.forEach(function(candidate) {
	 		tfidf.addDocument(getFourGrams(candidate.name));
	 	});

	 	var maxVal = 0, maxIndex = 0;
		tfidf.tfidfs(getFourGrams(reference.name), function(i, measure) {
			if (measure > 0 && measure > maxVal) {
				maxIndex = i;
				maxVal = measure;
			}
		});
		candidates[maxIndex].tfidf = maxVal;

		return candidates[maxIndex];
	 }

	/*
	 * Returns the most likely matches for the reference
	 *
	 * @param {Object} Reference that other candidates are matched
	 * @param {Object} Arrays of matching candidates
	 * @param {number} Costum threshold value for dice coefficient
	 */
	matcher.prototype.match = function (reference, candidates, d) {
		if (d) diceThreshold = d;
		
		console.log(reference.name + ' --------------------------------');
		for (var dataset in candidates) {
			var tfidf = new natural.TfIdf();


			candidates[dataset].forEach(function(poi) {
				tfidf.addDocument(getFourGrams(poi.name));
				poi.dice = natural.DiceCoefficient(reference.name, poi.name);
				poi.jaroWinkler = natural.JaroWinklerDistance(reference.name, poi.name);
			});

			var referenceFourGrams = getFourGrams(reference.name);

			tfidf.tfidfs(referenceFourGrams, function(i, measure) {
				candidates[dataset][i].tfidf = measure;	
			});
			
			
		}
		return candidates;
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