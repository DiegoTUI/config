'use strict';
/*
 * Collection of requests for the nodejs server
 *
 * Copyright (C) 2013 TuiInnovation.
 */

//requires
var util = require('./util.js');

//Init requests
 var requests = {};

 requests.TicketAvailRequest = require('./TicketAvailRequest.js');
 requests.FSVenueSearch = require('./FSVenueSearch.js');

 module.exports = requests;
