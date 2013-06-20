'use strict';
/*
 * Atlas defaults for requests .
 *
 * Copyright (C) 2013 TuiInnovation.
 */

var util = require("./util.js");

/**
 * Pseudo-global to store Atlas defaults for requests
 */
var atlasDefaults = {};

//ticketAvailRequest
atlasDefaults["ticketAvailRequest"] = {
		echoToken: function(){return util.randomString(util.echoTokenLength)},
		sessionId: function(){return util.randomString(util.sessionIdLength)},
		Language: "ENG",
		Credentials_User: "ISLAS",
		Credentials_Password: "ISLAS",
		PaginationData_itemsPerPage: "25",
		PaginationData_pageNumber: "1",
		ServiceOccupancy_AdultCount: "1",
		ServiceOccupancy_ChildCount: "0",
		Destination_code: "PMI",
		DateFrom_date: function(){
			var date = new Date();
			return util.atlasDate (date);
		},
		DateTo_date: function(){
			var date = new Date();
			date.setDate(date.getDate() + 1);
			return util.atlasDate (date);
		}
	};

//export module
module.exports = atlasDefaults;