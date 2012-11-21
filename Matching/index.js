var DbConnection = require('./DbConnector.js');
var dbscan = require('../modules/Clustering/clustering.min.js'); // https://github.com/bss/clustering.js



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


/* *****************************************************************************
 * EVENT HANDLER
 * ****************************************************************************/

/*
 *
 */
function handlePasswordInput(password) {
 	dbConfig.password = password;
 	database = new DbConnection(dbConfig);
 	// intializeProcess();
}