

/**
 * PingerClient.
 */
 var pingerClient = new function(){
 	// self-reference
	var self = this;
	//number of pingers to create
	var numberOfPingers = 100;
	//number of active pingers
	var activePingers = 0;
	//period for each pinger
	var period = 100;
	//delay between the creation of each pinger
	var delay = 1000;

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
		activePingers++;
		$('#activePingers').html(activePingers);
	}
 }

