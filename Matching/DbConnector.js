/*
 * Load depending modules
 */
var PG = require('pg');
var GEOJSON2WKT = require('../modules/Geojson2Wkt/Geojson2Wkt.js');

var DbConnector = (function () {
	/*
	 * Constructor
	 */
	var obj = function (config) {
		this.client = new PG.Client('postgres://' + config.user + ':' + config.pass + '@' + config.host + ':5432/' + config.name)
		this.client.connect();
	}

	/**
	 * Closes the connection and unsets client
	 */
	obj.prototype.close = function () {
		this.client.end();
		this.client = null;
	}

	/**
	 * Returns the next Reference Point 
	 */
	obj.prototype.getNextReferencePoint = function (excludes, callback) {
		// console.log('SELECT id, name, ST_AsGeoJSON(the_geom) AS geom FROM foursq_venues ' + ((excludes.length > 0) ? 'WHERE id NOT IN (\'' + excludes.join('\', \'') + '\') ' : '') + 'LIMIT 1');
		this.client.query(
			'SELECT id, name, ST_AsGeoJSON(the_geom) AS geom FROM foursq_venues ' + ((excludes.length > 0) ? 'WHERE name IS NOT NULL AND id NOT IN (\'' + excludes.join('\', \'') + '\') ' : '') + 'LIMIT 1',
			function (error, result) {
				if (error) throw new Error('Reading next reference point from foursquare venue table failed: \n' + JSON.stringify(error))
				else callback(result.rows[0]);
			}
		);
	}

	/**
	 * Returns {Array} of matching candidates in Facebook and OSM tables
	 */

	 obj.prototype.getMatchingCandidates = function(matchingReference, callback) {
	 	var geometryWkt = GEOJSON2WKT.convert(matchingReference.geom);
	 	var matchingCandidates = {
	 		osm: [],
	 		facebook: []
	 	};
	 	var pending = 2;
	 	// TODO: Try to to put result handling into dedicated function
	 	this.client.query(
	 		'SELECT id, name, ST_AsGeoJSON(the_geom) AS geom FROM facebook WHERE ST_Intersects(the_geom, ST_Buffer(ST_Geomfromtext(\'' + geometryWkt + '\', 4326), 0.01))',
	 		function (error, result) {
	 			if (error) throw new Error('Error while reading facebook venues from database: \n' + JSON.stringify(error));
	 			else matchingCandidates.facebook = result.rows;
	 			pending--;
	 			if (pending === 0) callback(matchingReference, matchingCandidates);
	 		}
	 	);

	 	this.client.query(
	 		'SELECT osm_id as id, name, ST_AsGeoJSON(way) AS geom FROM planet_osm_point WHERE name IS NOT null AND ST_Intersects(way, ST_Buffer(ST_Geomfromtext(\'' + geometryWkt + '\', 4326), 0.01))',
	 		function (error, result) {
	 			if (error) throw new Error('Error while reading osm pois from database: \n' + JSON.stringify(error));
	 			else matchingCandidates.osm = result.rows;
	 			pending--;
	 			if (pending === 0) callback(matchingReference, matchingCandidates);
	 		}
	 	);
	 }

	return obj;
})();


/*
 * Export the module
 */ 
module.exports = DbConnector;