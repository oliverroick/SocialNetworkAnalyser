var PG = require('pg');
var SQL = require('squel');

var databaseConfig = {};

function setHost(h) {
	databaseConfig.host = h;
}

function setUser(u) {
	databaseConfig.user = u;
}

function getUser(u) {
	return databaseConfig.user;
}

function setPass(p) {
	databaseConfig.pass = p;
}

function setName(n) {
	databaseConfig.name = n;
}

function getName(n) {
	return databaseConfig.name;
}

function connect() {
	var client = new PG.Client("postgres://" + databaseConfig.user + ":" + databaseConfig.pass + "@" + databaseConfig.host + ":5432/" + databaseConfig.name);
	client.connect();

	return client;
}

function saveTweet(tweet) {
	var connection = connect();
	var statement = SQL.insert()
		.into("clfinal")
		.set("id", tweet.tweetId)
		.set("user_id", tweet.userId)
		.set("the_geom", tweet.geometry)
		.set("hashtags", tweet.hashtags)
		.set("place_id", tweet.placeId)
		.set("tweet", tweet.text)
		.set("created_at", tweet.date);
	
	var query = connection.query(statement);
        
	query.on('end', function (res) {
		console.log("Successfully inserted tweet #" + tweet.tweetId + ' at ' + tweet.date);
		connection.end();
	});
	query.on('error', function (e) {
		console.error("Error while inserting tweet: " + e);
		console.log(statement);
		connection.end();
	});
}

function Database () {
}

Database.prototype.setHost = setHost;
Database.prototype.setUser = setUser;
Database.prototype.getUser = getUser;
Database.prototype.setPass = setPass;
Database.prototype.setName = setName;
Database.prototype.getName = getName;
Database.prototype.saveTweet = saveTweet;

module.exports = Database;