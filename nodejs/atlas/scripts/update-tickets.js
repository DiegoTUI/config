'use strict';
/**
 * Script to query ATLAS about tickets in certain destinations 
 * and update collection tickets in tuiinnovation db.
 * Usage: node update-ticket.js [destination_code]
 */

/**
 * Requirements.
 */
var mongo = require('mongodb');
var fs = require('fs');
var ATTicketAvail = require('../services/ATTicketAvail.js');
var log = require('../util/log.js');
var util = require('../util/util.js');
var atlas = require('../services/config/atlas.js');
var atlasDefaults = require('../services/config/atlasDefaults.js');

/**
 * Constants.
 */
process.title = 'update-tickets';
/**
 * Process uncaught exceptions.
 */
process.on('uncaughtException', function(err) {
	log.error("We found an uncaught exception.");
	log.error(err.stack);
});
/**
 * Globals.
 */
var languages = JSON.parse(fs.readFileSync("./languages.json"));
var destinations = JSON.parse(fs.readFileSync("./destinations.json"));
var server = new mongo.Server("127.0.0.1", mongo.Connection.DEFAULT_PORT, {});
log.info("db listening on port: " + mongo.Connection.DEFAULT_PORT);
var db = new mongo.Db("tuiinnovation", server, {w:1});
var ticketAvailMap = [
	{'code': 'TicketInfo.Code'},
	{'name': 'TicketInfo.Name'},
	{'currencyCode': 'Currency.@code'},
	{'TicketInfo.DescriptionList.Description':[{'type': '@type'},
						 			{'description': ''}]},
	{'TicketInfo.ImageList.Image': [{'type': 'Type'},
								{'order': 'Order'},
								{'visualizationOrder': 'VisualizationOrder'},
								{'url': 'Url'}]},
	{'AvailableModality':[{'code':'@code'},
						{'name':'Name'}, 
						{'contractName':'Contract.Name'},
						{'PriceList.Price':[{'amount':'Amount'},
											{'description':'Description'}]},
						{'childAgeFrom':'ChildAge.@ageFrom'},
						{'childAgeTo':'ChildAge.@ageTo'}]}];

/**
 * Connect and parse
 */
 function parseTickets (parameters) {
 	function ok(result)
	{
		log.info("Received " + result.length + " tickets for " + destinationCode + " in " + language);
		//open db
		db.open(function(error,db){
			if (error) {
				log.error("error returned while trying to open the database: " + JSON.stringify(error));
				throw error;
			}
			log.info("Database opened correctly.");
			//get to the collection
			db.collection("tickets", function(error,collection) {
				if (error) {
					log.error("error returned while trying to open tickets collection: " + JSON.stringify(error));
					throw error;
				}
				log.info("Collection opened correctly: " + collection);
				//browse the tickets, update the db
				result.forEach(function(ticket) {
					//First update the "simple" fields and remove the arrays
					var setItem = {
						code: ticket['code'],
						currencyCode: ticket['currencyCode'],
						destinationCode: destinationCode 
					};
					setItem["name."+language] = ticket.name;
					var unsetItem ={
						ImageList: 1,
						AvailableModalityList: 1
					};
					unsetItem["DescriptionList."+language] = 1;
					collection.update({code: ticket['code']},
						{'$set': setItem, '$unset': unsetItem},
						{upsert: true}, function(error, count){
							if (error) {
								log.error ("Error while updating set and unset");
								throw error;
							}
							log.info("Set and unset " + count + " elements. Pushing items now.");
							//Now push the new arrays
							var pushItem = {};
							pushItem["ImageList"] = {'$each': ticket["ImageList"]};
							pushItem["AvailableModalityList"] = {'$each': ticket["AvailableModalityList"]};
							pushItem["DescriptionList."+language] = {'$each': ticket["DescriptionList"]};
							collection.update({code: ticket['code']},
								{'$push': pushItem},
								{upsert: true}, function (error, count){
									if (error) {
										log.error ("Error while updating push");
										throw error;
									}
									log.info("Push " + count + " elements. Pushing items now.");
							});
					});
				});
			});
		});
	}

	function nok(result)
	{
		var message = 'Error returned while calling: ' + JSON.stringify(parameters) + '. Status code: ' + result.statusCode;
		if (error)
			message += '. Error: ' + JSON.stringify(result.error);
		log.error(message)
	}
	var destinationCode = parameters.Destination_code;
	var language = parameters.Language;
 	var ticketAvailRQ = new ATTicketAvail(parameters, ticketAvailMap, "ServiceTicket");
 	log.info("Calling ATLAS for " + destinationCode + " in " + language);
 	ticketAvailRQ.sendRequest(ok,nok);
 }

 var queryParameters = {
 	Destination_code: "TFS",
 	Language: "ENG"
 };

 parseTickets(queryParameters);

