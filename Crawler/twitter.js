var Twitter = require('ntwitter');
var GeoJson2Wkt = require('../modules/Geojson2Wkt');
var DB = require('./Database.js');

var locations = {
	'germany': '5.94,47.29,15.46,54.88',
	'ny': '-74.3268,40.4765,-73.5658,41.0252'
};

var twit = new Twitter({
	consumer_key: 'JjDJF5ffy9GdmID47YXvvQ',
	consumer_secret: 'UFhky7pyggKadWoxerJ0SbbvdHzjEuQk04CVnN5gkk',
	access_token_key: '58790171-34zkwPTL7JGJKvxsp7aoYflkU314n3fe0Pnq5jqaA',
	access_token_secret: 'fzNzp49nIWuI4wgSppouGij6vs4g7JrVXFYjEDRWpk'
});

var database = new DB();

function extractRelevantStuff(tweet) {
	var hashtags = [],
		stuff;
	
	for (var i = 0, len = tweet.entities.hashtags.length; i < len; i++) {
		hashtags.push(tweet.entities.hashtags[i].text);
	}
	
	if (tweet.coordinates) {
		stuff = {
			tweetId: tweet.id,
			userId: tweet.user.id,
			geometry: GeoJson2Wkt.convert(tweet.coordinates),
			hashtags: hashtags.join(','),
			placeId: (tweet.place != null ? tweet.place.id : null),
			text: tweet.text,
			date: tweet.created_at
		};
	}

	return stuff;
}

function saveToDatabase(stuff) {
	if (stuff) {
		database.saveTweet(stuff);
	}
}

function runStreaming() {
	twit.stream('statuses/filter', {'locations': locations.germany}, function (stream) {
		stream.on('data', function (data) {
			saveToDatabase(extractRelevantStuff(data));
		});
		
		stream.on('end', function (response) {
			console.warn('Stream disconnected: ' + response);
		});
	});
}



function initialize() {
	twit.verifyCredentials(function (err, data) {
		if (err) {console.error(err + 'd%', data); } else {runStreaming(twit); }
	});
}


/**
 * Get the user's password from command line and starts serivce initialization
 */
function getPassword() {
 	var stdin = process.openStdin(),
    	tty = require('tty');

    process.stdout.write('Enter password for user ' + database.getUser() + ' on database ' + database.getName() +': ');
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	process.stdin.setRawMode(true);
	password = ''
	process.stdin.on('data', function (char) {
	    char = char + ""

	    switch (char) {
	    	case "\n": case "\r": case "\u0004":
				// They've finished typing their password
				process.stdin.setRawMode(false);
				console.log('\n\n');
				stdin.pause();
				database.setPass(password);
				initialize();
				break;
	    	case "\u0003":
	    		// Ctrl C
				console.log('Cancelled');
				process.exit();
				break;
			default:
				// More passsword characters
				process.stdout.write('');
				password += char;
				break;
	    }
	});
}

/**
 * Initialize the process
 */

// parse command line arguments, shall be provide as node index.js -U [username] -h [host] -d [database name]
var args = process.argv;
var argsObj = {};

for (var i = 2;i < args.length; i++) {
	var argument = args[i];
	var nextArgument = args[i + 1];
	if (argument.indexOf('-') === 0) {
		argument = argument.replace(/^-+/,"");
		if (nextArgument && nextArgument.indexOf('-') !== 0) {
			argsObj[argument] = nextArgument;
			i++;
		} else {
			argsObj[argument] = true;	
		}
	}
}

// Setting database settings
database.setHost(argsObj.h);
database.setName(argsObj.d);
database.setUser(argsObj.u);

// getting database password
getPassword();