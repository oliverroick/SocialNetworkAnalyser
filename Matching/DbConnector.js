/*
 * Load depending modules
 */
var pg = require('pg');

/*
 * Constructor
 */
function DbConnector (config) {
	this.client = new pg.Client('postgres://' + config.user + ':' + config.pass + '@' + config.host + ':5432/' + config.name)
	this.client.connect();
}

DbConnector.prototype.close = function () {
	this.client.end();
	this.client = null;
}


/*
 * Export the module
 */ 
module.exports = DbConnector;