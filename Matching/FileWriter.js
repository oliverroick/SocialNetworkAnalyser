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
		fs.open(file, 'a', 666, function(e, id ) {
			var pending = batch.length - 1;
			batch.forEach(function(line) {
				fs.write(id, line + '\n', null, 'utf8', function() {
					pending--;
					if (pending === 0) {
						fs.close(id, function(){
			      			console.log('Batch written');
			    		});
					}
		  		});
			});
		});
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