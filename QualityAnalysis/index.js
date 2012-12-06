/* *****************************************************************************
 * CONSTANTS setup
 * ****************************************************************************/

// load dependencies
var DbConnection = require('./DbConnector.js');
var FileWriter = require('./FileWriter.js');

// config
var processedRefPoints = [];

/* *****************************************************************************
 * SETUP PROCESSING
 * ****************************************************************************/

// parse the command line input 
var args = process.argv;
var argsObj = {};

var database, dbConfig;


// start index 2, since [0]=node, [1]=scriptpath
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

// set database connection

var dbConfig = {
	user: argsObj.U,
	host: argsObj.h,
	name: argsObj.d
};

getPassword(handlePasswordInput);

/* *****************************************************************************
 * CONTROL FUNCTIONS
 * ****************************************************************************/

 /*
  *
  */
function getPassword(callback) {
 	var stdin = process.openStdin(),
    	tty = require('tty');

    process.stdout.write('Enter password for user ' + dbConfig.user + ' on database ' + dbConfig.name +': ');
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
			callback(password);
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
 * Initialize process
 */
 function initializeProcess() {
 	database.getFourSquareVenues(handleFoursquareVenues);
 }


/* *****************************************************************************
 * EVENT HANDLER
 * ****************************************************************************/

/*
 *
 */
function handlePasswordInput(password) {
 	dbConfig.pass = password;
 	database = new DbConnection(dbConfig);
 	initializeProcess();
}

function handleFoursquareVenues(venues) {
	var lines = ['ID, COMPLETENESS, USERS, CHECKINS'];
	venues.forEach(function(venue) {
		var completeness = 0;
		if (venue.name !== null) completeness += 0.2;
		if (venue.street !== null) completeness += 0.2;
		if (venue.city !== null) completeness += 0.2;
		if (venue.postal_code !== null) completeness += 0.2;
		if (venue.country !== null) completeness += 0.2;
		lines.push(venue.id + ', ' + completeness + ', ' + venue.users + ', ' + venue.checkins);
		
		if (lines.length === 1000) {
			FileWriter.writeBatch('foursquare.csv', lines);	
			lines = [];
		}
	});
	FileWriter.writeBatch('foursquare.csv', lines);
}