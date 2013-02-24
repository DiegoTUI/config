

/**
 * PingerClient.
 */
 var pingerClient = new function(){
 	// self-reference
	var self = this;
	//number of pingers to create
	var numberOfPingers = 10;
	//period for each pinger
	var period = 1000;
	//delay between the creation of each pinger
	var delay = 5000;

	/**
 	 * Create pingers
 	 */
 	self.createPingers = function(){
 	 	for (var i=0; i<numberOfPingers; i++)
		{
			setTimeout(createPinger, delay * i);
		}
 	 }

 	 /**
	  * Create one pinger with the given period
	  */
	function createPinger()
	{
		info("Creating new pinger");
		var p = new pinger();
		p.start(period);
	}
 }

