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
	 *
	 *
	 */
	var replacePlaceName = function(name, placeNames) {
		return name
			.toLowerCase()
			.replace(placeNames, '')
			.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // Removes preceeding and tailing white spaces
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
		
		// console.log(reference.name + ' --------------------------------');
		for (var dataset in candidates) {
			// var tfidf = new natural.TfIdf();

			candidates[dataset].forEach(function(candidate) {
				// console.log(reference.city);
				var placeNames = new RegExp('(' + ((reference.city != null) ? reference.city.toLowerCase().replace(/(\(|\))/g, '') + '|' : '') 
					+ ((reference.state != null) ? reference.state.toLowerCase().replace(/(\(|\))/g, '') + '|' : '') 
					+ ((reference.country != null) ? reference.country.toLowerCase().replace(/(\(|\))/g, '') + '|' : '') 
					+ ((candidate.city != null) ? candidate.city.toLowerCase().replace(/(\(|\))/g, '') + '|' : '') 
					+ ((candidate.state != null) ? candidate.state.toLowerCase().replace(/(\(|\))/g, '') + '|' : '') 
					+ ((candidate.country != null) ? candidate.country.toLowerCase().replace(/(\(|\))/g, '') : '') + ')','g');

				var referenceName = replacePlaceName(reference.name, placeNames);
				var candidateName = replacePlaceName(candidate.name, placeNames);

				// tfidf.addDocument(getFourGrams(poi.name));
				if (referenceName.length > 0 && candidateName.length > 0) {
					candidate.dice = natural.DiceCoefficient(referenceName, candidateName);
					candidate.jaroWinkler = natural.JaroWinklerDistance(referenceName, candidateName);	
				}
			});

			// var referenceFourGrams = getFourGrams(reference.name);

			// tfidf.tfidfs(referenceFourGrams, function(i, measure) {
			// 	candidates[dataset][i].tfidf = measure;	
			// });
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