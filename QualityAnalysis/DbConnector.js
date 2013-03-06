/*
 * Load depending modules
 */
var PG = require('pg');
var GEOJSON2WKT = require('../modules/Geojson2Wkt/Geojson2Wkt.js');

var DbConnector = (function () {
	/*
	 * Constructor
	 */
	var db = function (config) {
		this.client = new PG.Client('postgres://' + config.user + ':' + config.pass + '@' + config.host + ':5432/' + config.name)
		this.client.connect();
	}

	/**
	 * Closes the connection and unsets client
	 */
	db.prototype.close = function () {
		this.client.end();
		this.client = null;
	}

	/**
	 * returns all venues
	 */	

	db.prototype.getFourSquareVenues = function(callback) {
		this.client.query(
			'SELECT id, name, address as street, city, postal_code, country, checkins, users FROM ONLY foursq_venues WHERE sample = TRUE',
			function (error, result) {
				if (error)
					throw new Error('Error while getting Foursquare Venues from database \n' + error);
				else 
					callback(result.rows);
			}
		);
	}

	/**
	 * returns all venues
	 */	

	db.prototype.getFacebookVenues = function(callback) {
		this.client.query(
			'SELECT id, name, street, city, postal_code, country, checkins, likes FROM ONLY facebook WHERE sample = TRUE',
			function (error, result) {
				if (error)
					throw new Error('Error while getting facebook Venues from database \n' + error);
				else 
					callback(result.rows);
			}
		);
	}

	db.prototype.getDistance = function(foursquareId, facebookId, callback) {
		this.client.query(
			'SELECT Distance(ST_Transform(GeometryFromText ( (SELECT ST_AsText(the_geom) FROM ONLY facebook WHERE id = \'' + facebookId + '\'), 4326 ), 900913), ST_Transform(GeometryFromText ( (SELECT ST_AsText(the_geom) FROM ONLY foursq_venues WHERE id = \'' + foursquareId + '\'), 4326 ), 900913))',
			function (error, result) {
				if (error) {
					console.log('SELECT Distance(ST_Transform(GeometryFromText ( (SELECT ST_AsText(the_geom) FROM facebook WHERE id = \'' + facebookId + '\'), 4326 ), 900913), ST_Transform(GeometryFromText ( (SELECT ST_AsText(the_geom) FROM foursq_venues WHERE id = \'' + foursquareId + '\'), 4326 ), 900913))');
					throw new Error('Error while getting distance from database \n' + error);
				}
				else 
					callback(foursquareId, facebookId, result.rows[0].distance);
			}
		);
	}

	return db;
})();


/*
 * Export the module
 */ 
module.exports = DbConnector;