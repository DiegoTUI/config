/**
 * Requirements.
 */  
	var log = require('./util/log.js');
	var pinger = require('./robot/pinger.js');
	var debug = log.debug;
	var error = log.error;
	var info = log.info;

/**
 * Constants.
 */
process.title = 'client_pinger';

/**
 * Globals.
 */
 var numberOfPingers = 10;
 var period = 1000;
 processArguments(process.argv.slice(2));

/**
 * Process command line arguments.
 * Usage: client [-n][numberofpingers] [-p][period]
 */
function processArguments(args)
{
	while (args.length > 0)
	{
		var arg = args.shift();
		if (arg.startsWith("-n"))
		{
			numberOfPingers = parseInt(arg.substringFrom("-n"))
		}
		else if (arg.startsWith("-p"))
		{
			period = parseInt(arg.substringFrom("-p"))
		}
		else
		{
			error('Usage: client [-n][numberofpingers] [-p][period]');
			return;
		}
	}
}

info("Arguments. numberOfPingers: " + numberOfPingers + " - period: " + period);

