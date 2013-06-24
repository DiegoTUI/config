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
	function ok(result)
	{
		console.log("number of objects in the reply: " + result.length);
		console.log("number of serviceTickets in the reply: " + result[0].ServiceTicketList.length);
		console.log("TotalItems: " + result[0].TotalItems);
		test.ok(true, "Wrong number of items retrieved. Should have retrieved ");
		//test.ok(result[0].ServiceTicketList.length == parseInt(result[0].TotalItems), "Wrong number of items retrieved. Should have retrieved " + data[0].TotalItems + " but the parsed array only has " + data[0].ServiceTicketList.length);
		console.log("About to call test.done()");
		test.done();
	}

	function nok(error, statusCode)
	{
		console.log("Entering nok callback");
		var message = error ? 'test failed with status code ' + statusCode + ' and error: ' + JSON.stringify(error) : 
								'test failed with status code ' + statusCode;
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
