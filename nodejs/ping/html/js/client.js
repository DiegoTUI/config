

/**
 * PingerClient.
 */
 var pingerClient = new function(){
 	// self-reference
	var self = this;
	//number of active pingers
	var activePingers = 0;
	//number of pingers to create
	self.numberOfPingers = 100;
	//period for each pinger
	self.period = 100;
	//delay between the creation of each pinger
	self.delay = 1000;

	/**
 	 * Set Params
 	 */
 	 self.setParams = function(numberofpingers, period, delay){
 	 	self.numberOfPingers = numberofpingers;
 	 	self.period = period;
 	 	self.delay = delay;
 	 }

	/**
 	 * Create pingers
 	 */
 	self.createPingers = function(){
 		$('#message').html('<p>Trying to create ' + self.numberOfPingers + ' pingers with a period of ' + self.period + 'ms and a delay between pingers of ' + self.delay +  'ms</p>');
 	 	for (var i=0; i<self.numberOfPingers; i++)
		{
			setTimeout(createPinger, self.delay * i);
		}
 	 }

 	 /**
	  * Create one pinger with the given period
	  */
	function createPinger()
	{
		info("Creating new pinger");
		var p = new pinger();
		p.start(self.period);
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

