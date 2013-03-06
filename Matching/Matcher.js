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

	/**
	 *
	 *
	 */
	var replacePlaceName = function(name, placeNames) {
		return name
			.toLowerCase()
			.replace(placeNames, '')
			.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // Removes preceeding and tailing white spaces
	}

	/**
	 *
	 *
	 */
	var prepareCategory = function(category) {
		var categoriesResults = [];
		var categories = category.substring(0, (category.indexOf('(') !== -1 ? category.indexOf('(') : category.length)).split('/');
		categories.forEach(function(cat) {
			categoriesResults.push(
				cat.toLowerCase()
				.replace(/^\s\s*/, '').replace(/\s\s*$/, '') // Removes preceeding and tailing white spaces
				.replace(/ /g, '_')
			);
		});
		return categoriesResults;
	}



	/*
	 * Returns the most likely matches for the reference
	 *
	 * @param {Object} Reference that other candidates are matched
	 * @param {Object} Arrays of matching candidates
	 * @param {number} Costum threshold value for dice coefficient
	 */
	matcher.prototype.match = function (reference, candidates, callback, d) {
		var matchTuples = [];
		if (d) diceThreshold = d;

		for (var dataset in candidates) {
			candidates[dataset].forEach(function(candidate) {
				var dice, jaroWinkler;
				var placeNames = new RegExp('(' + ((reference.city != null) ? reference.city.toLowerCase().replace(/(\(|\))/g, '') + '|' : '') 
					+ ((reference.state != null) ? reference.state.toLowerCase().replace(/(\(|\))/g, '') + '|' : '') 
					+ ((reference.country != null) ? reference.country.toLowerCase().replace(/(\(|\))/g, '') + '|' : '') 
					+ ((candidate.city != null) ? candidate.city.toLowerCase().replace(/(\(|\))/g, '') + '|' : '') 
					+ ((candidate.state != null) ? candidate.state.toLowerCase().replace(/(\(|\))/g, '') + '|' : '') 
					+ ((candidate.country != null) ? candidate.country.toLowerCase().replace(/(\(|\))/g, '') : '') + ')','g');

				var referenceName = replacePlaceName(reference.name, placeNames);
				var candidateName = replacePlaceName(candidate.name, placeNames);

				if (referenceName.length > 0 && candidateName.length > 0) {
					dice = natural.DiceCoefficient(referenceName, candidateName);
					jaroWinkler = natural.JaroWinklerDistance(referenceName, candidateName);
				}

				if (reference.category != null && candidate.category != null) {
					var referenceCategory = prepareCategory(reference.category);
					var candidateCategory = prepareCategory(candidate.category);
					console.log(reference.category + ' --> ' + referenceCategory);
					console.log(candidate.category + ' --> ' + candidateCategory);

					
					referenceCategory.forEach(function(refCat) {
						candidateCategory.forEach(function(candCat) {
							matchTuples.push({
								'reference': reference.id,
								'candidate': candidate.id,
								'dice': dice,
								'jaroWinkler': jaroWinkler,
								'referenceCategory': refCat,
								'candidateCategory': candCat
							});
						});
					});
				}
			});
		}
		getNextMatch(matchTuples, 0, callback);
	}

	var getNextMatch = function (matchTuples, inc, callback) {
		natural.WuPalmer(matchTuples[inc].referenceCategory, matchTuples[inc].candidateCategory, function(sim) {
			matchTuples[inc].wuPalmer = sim;
			
			newInc = inc + 1;
			if (newInc < matchTuples.length) getNextMatch(matchTuples, newInc, callback);
			else callback(matchTuples);
		});
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