'use strict';
/**
 * TuiInnovation
 * TicketAvail unit tests
 *
 * Copyright (C) 2013 TuiInnovation.
 */

var TicketAvailRequest = require('../TicketAvailRequest.js');

var ticketAvailMap = [
{'DateFrom':'DateFrom.@date'},
{'DateTo':'DateTo.@date'},
'Currency',
{'CurrencyCode': 'Currency.@code'},
{'Name': 'TicketInfo.Name'},
{'TicketInfo.DescriptionList.Description':[{'Type': '@type'},
					 			{'Description': ''}]},
{'TicketInfo.ImageList.Image': [{'Type': 'Type'},
							{'Url': 'Url'}]}];

var ticketAvailMapAlt = [
{'TotalItems':'@totalItems'},
{'ServiceTicket':[{'DateFrom':'DateFrom.@date'},
	{'DateTo':'DateTo.@date'},
	'Currency',
	{'CurrencyCode': 'Currency.@code'},
	{'Name': 'TicketInfo.Name'},
	{'TicketInfo.DescriptionList.Description':[{'Type': '@type'},
					 			{'Description': ''}]},
	{'TicketInfo.ImageList.Image': [{'Type': 'Type'},
							{'Url': 'Url'}]}
	]}
];

/* run tests */
exports.ticketAvailRequest = function (test) {
	test.expect(1);
	function ok(result)
	{
		console.log("number of objects in the reply: " + result.length);
		console.log("number of serviceTickets in the reply: " + result[0].ServiceTicketList.length);
		test.ok(result[0].ServiceTicketList.length == parseInt(result[0].TotalItems), "Wrong number of items retrieved. Should have retrieved " + result[0].TotalItems + " but the parsed array only has " + result[0].ServiceTicketList.length);
		test.done();
	}

	function nok(result)
	{
		var message = error ? 'test failed with status code ' + result.statusCode + ' and error: ' + JSON.stringify(result.error) : 
								'test failed with status code ' + result.statusCode;
		test.ok(false, message);
		test.done();
	}
	var parameters = {
		Language: "ENG",
		Credentials_User: "ISLAS",
		ServiceOccupancy_AdultCount: "1"
	};

	var ticketAvailRQ = new TicketAvailRequest(parameters, ticketAvailMapAlt);
	ticketAvailRQ.sendRequest(ok, nok);
}

exports.ticketAvailRequestNoDescriptionMap = function (test) {
	test.expect(1);
	function ok(result)
	{
		console.log("number of objects in the reply: " + result.length);
		console.log("number of serviceTickets in the reply: " + result[0].ServiceTicketList.length);
		test.ok(result[0].ServiceTicketList.length == parseInt(result[0].TotalItems), "Wrong number of items retrieved. Should have retrieved " + result[0].TotalItems + " but the parsed array only has " + result[0].ServiceTicketList.length);
		test.done();
	}

	function nok(result)
	{
		var message = error ? 'test failed with status code ' + result.statusCode + ' and error: ' + JSON.stringify(result.error) : 
								'test failed with status code ' + result.statusCode;
		test.ok(false, message);
		test.done();
	}
	var parameters = {
		Language: "ENG",
		Credentials_User: "ISLAS",
		ServiceOccupancy_AdultCount: "1"
	};

	var ticketAvailRQ = new TicketAvailRequest(parameters);
	ticketAvailRQ.sendRequest(ok, nok);
}

exports.ticketAvailRequestErrors = function (test) {
	test.expect(2);
	function ok(result)
	{
		test.ok(false, "Should not end up in ok when there are errors in the response");
		test.done();
	}

	function nok(result)
	{
		test.ok(result.statusCode == 400, "wrong status code returned");
		var errors = result.error;
		console.log("number of objects in the reply: " + errors.length);
		console.log("number of errors in the reply: " + errors[0].ErrorList.length);
		test.ok(errors[0].ErrorList.length == 1, "Wrong number of errors retrieved.");
		test.done();
	}
	var parameters = {
		Language: "SPA",	//UNEXISTING LANGUAGE!!!
		Credentials_User: "ISLAS",
		ServiceOccupancy_AdultCount: "1"
	};

	var ticketAvailRQ = new TicketAvailRequest(parameters);
	ticketAvailRQ.sendRequest(ok, nok);
}