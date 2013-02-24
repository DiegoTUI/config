

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
 		$('#message').html('<p>Trying to create ' + numberOfPingers + ' pingers with a period of ' + period + 'ms and a delay between pingers of ' + delay +  'ms</p>');
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

 /**
  * Other UI functions
  */
  var showValue = function (title, value)
  {
  	$('#'+title).html(value);
  }

