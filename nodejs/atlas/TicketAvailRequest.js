'use strict';
/*
 * TuiInnovation nodejs.
 * TicketAvailRequest: performs a TicketAvail request to ATLAS and resturns the results
 *
 * Copyright (C) 2013 TuiInnovation.
 */

/**
 * The TicketAvail request.
 * queryParameters: the parameters to build the xml and perform the call
 * descriptionMap: the json describing wich fields you want to read from the xml
 * tag: the tag to indicate which objects in the xml should we look for. Root if undefined or null
 */
var TicketAvailRequest = function(queryParameters, descriptionMap, tag)
{
	// self-reference
	var self = this;

	//requires
	var ParametrizedString = require('./ParametrizedString.js');
	var XmlReader = require('./XmlReader.js');
	var util = require('./util.js');
	var ajax = require('./ajax.js');
	var atlas = require('./atlas.js');
	var atlasDefaults = require('./atlasDefaults.js');

	//Initialize query parameters
	initQueryParams();
	descriptionMap = descriptionMap ? descriptionMap: atlasDefaults.ticketAvailDescriptionMap;
	tag = tag ? tag : atlasDefaults.ticketAvailTag;

	//console.log ('Using descriptionMap: ' + JSON.stringify(descriptionMap));
	//console.log ('Atlas descriptionMap: ' + JSON.stringify(atlasDefaults));

	/**
	 * Sends the ajax request to the apropriate url with the right xml and query parameters
	 * ok: callback in case of ok
	 * nok: callback in case of not ok
	 */
	self.sendRequest = function(ok, nok) {
		var parametrizedRequest = new ParametrizedString(atlas.ticketAvailRequest, queryParameters);
		var data = {xml_request: parametrizedRequest.replaceAllClean()};
		ajax.send(data, atlas.url, util.process([parseResponse, ok]), nok, 'POST');
	}

	/**
	 * Check the query parameters and creates (if needed) some of the compulsory fields
	 */
	function initQueryParams() {
		for (var key in atlasDefaults.ticketAvailRequest) {
			if (!(key in queryParameters)){
				queryParameters[key] = typeof atlasDefaults.ticketAvailRequest[key] === "function" ?
											atlasDefaults.ticketAvailRequest[key]() : atlasDefaults.ticketAvailRequest[key];
			}
		}
	}

	/**
	 * Parses the xml received according to the provided descriptionMap and returns the result
	 * data: the xml received
	 */
	function parseResponse(data) {
		var result = null;
		console.log("parsing response ...");
		var xmlReader = new XmlReader (data, descriptionMap, tag);
		xmlReader.readObjects(function(parsedResponse){
			result = parsedResponse;
		});
		while (result === null){}
		console.log("about to return parsed response");
		return result;
	}

	return self;
}

module.exports = TicketAvailRequest;

