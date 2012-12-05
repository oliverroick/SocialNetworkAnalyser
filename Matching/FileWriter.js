var fs = require('fs');

var FileWriter = (function() {
	var instance;

	/**
	 * Constructor
	 */	
	var fileWriter = function() {}

	/*
	 * Writes a batch of Strings to specified file. Each item in the array is written as a single line.
	 *
	 * @param {String} The file name.
	 * @param {Array} The batch of strings to be written to the file.
	 */
	fileWriter.prototype.writeBatch = function(file, batch) {
		var file = fs.openSync(file, 'a');

		batch.forEach(function(line) {
			fs.writeSync(file, line + '\n', null, null, null)
		});
		console.log('batch written');
		fs.closeSync(file);
	}

	/**
	 * Creates an instance if not already available
	 */
	var createInstance = function () {
		if (!instance) instance = new fileWriter();
		return instance;
	}

	return createInstance();
})();



/*
 * Export module
 */

 module.exports = FileWriter;