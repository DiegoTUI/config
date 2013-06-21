'use strict';
/*
 * TuiInnovation nodejs.
 * XML Reader: receives an xml string and a description map and returns an array of objects
 *
 * Copyright (C) 2013 TuiInnovation.
 */

require("./core.js");

/**
 * The XML reader.
 * xmlString: the xml in string format
 * descriptionMap: an array representing the values to be extracted from the xml.
 * tag: the tag to indicate which objects in the xml should we look for. Root if undefined or null
 * see xmlreader-tests to fully understand this class
 */
var XmlReader = function(xmlString, descriptionMap, tag)
{
	// self-reference
	var self = this;

	var eyes = require("eyes");

	/**
	 * Reads the objects from the xmlString using the descriptionMap
	 * Returns an array of JS objects
	 * tag: the tag representing the objects in the xml to be read
	 */
	self.readObjects = function(callback) {
		console.log("entered readObjects");
		//initialize result
		var result =[];
		//parse the xmlString in a JSON
		var parser = require("xml2js").Parser();
		parser.on("end", function(xmlObject){
			var objectToBrowse = (tag && (tag.length > 0)) ? findTag(xmlObject, tag) : xmlObject(Object.keys(xmlObject)[0]);
			console.log("got objectToBrowse");
			//eyes.inspect (objectToBrowse);
			//console.log("Object to Browse: " + JSON.stringify(objectToBrowse));
			if (objectToBrowse == null) {
				console.log("objectToBrowse is null");
				result = null;
			} else if (objectToBrowse instanceof Array) {
				console.log("objectToBrowse is an instance of array");
				for (var i=0; i<objectToBrowse.length; i++) {
					console.log("Calling processElement for index " + i);
					result.push(processElement(objectToBrowse[i], descriptionMap));	
				}
			} else  { //It's an object
				console.log("objectToBrowse is an object");
				result.push(processElement(objectToBrowse, descriptionMap));
			}
			console.log("About to callback: " + JSON.stringify(result));
			callback(result);
		});

		parser.parseString(xmlString);
	}

	/**
	 * Recursive function to find a tag in the xmlObject and return the value of it
	 * Returns null if the tag was not found
	 */
	 function findTag(xmlObject, tag) {
	 	console.log ("Entered findTag: " + tag);
	 	//console.log ("With xmlObject: " + JSON.stringify(xmlObject));
	 	if (xmlObject instanceof Array) {
	 		for (var i=0; i<xmlObject.length; i++) {
	 			var result = findTag(xmlObject[i], tag);
	 			if (result)
	 				return result;
	 		}
	 	} else if (typeof xmlObject === "object") {
	 		for (var key in xmlObject) {
	 			if (tag === key) {
	 				return xmlObject[key];
	 			} else {
	 				var result = findTag(xmlObject[key], tag);
	 				if (result)
	 					return result;
	 			}
	 		}
	 	}
	 	return null;
	 }

	/**
	 * Process an element of the xml according to the description Map and returns an object
	 * element: a JSON object containing the element to be processed
	 */
	function processElement(element, descriptionMap) {
		console.log("processing element");
		//eyes.inspect (element);
		//initialize result
		var result = {};
		//iterate descriptionMap
		for (var i=0; i<descriptionMap.length; i++) {
			var item = descriptionMap[i];
			if (typeof item === 'string') {	//It's a string
				result[item] = getValue(element[item][0]);
			} 
			else if (typeof item === 'object') {	//It's a dictionary
				 if (Object.keys(item).length !== 1)
                    console.error ("Malformed descriptionMap. More than 1 element in object: " + JSON.stringify(item));
				//get the first (and only) key of the dictionary
				for (var key in item) {
					var value = item[key];
					if (value instanceof Array) {	//It's a list
						//initialize list
						var listifiedKey = key.listify();
						result[listifiedKey] = [];
						//get the array that contains the list
						var theList = listInXml(element,key);
						if (!(theList instanceof Array)) {
							eyes.inspect(theList)
							console.error("listInXml returned a non array for key " + key);
						}
						for(var j=0; j<theList.length; j++) {
							console.log("Calling processElement (innerList) for index " + j);
							result[listifiedKey].push(processElement(theList[j], value));
						}
					}
					else if (typeof value === 'string') {	//It's a deep value
						result[key] = valueInXml(element, value);
					}
					break;	//we only consider the first key
				}
			} 
		}
		return result;
	}

	/**
	 * Returns the text value of a node
	 */
	function getValue (node) {
		if (typeof node === 'string')
			return node;
		return node['_'];
	}


	/**
	 * Explores an xml jQuery object and returns the list in path
	 * xmlObject: a JSON object containing the xml to look in
	 * path: a string like "TicketInfo.DescriptionList.Description" containing the path to look in.
	 */
	function listInXml (xmlObject, path) {
		console.log("entered listInXml: " + path);
		var result = xmlObject;
		var pathArray = path.split(".");
		for (var i=0; i<(pathArray.length-1); i++) {
			result = result[pathArray[i]][0];
		}
		return result[pathArray[pathArray.length-1]];
	}

	/**
	 * Explores an xml jQuery object and returns the value in path
	 * xmlObject: a DOM object containing the xml to look in
	 * path: a string like "Description.@languageCode" containing the path to look in. "@" is for attributes
	 */
	function valueInXml (xmlObject, path) {
		console.log("Entered valueInXml: " + path);
		//eyes.inspect(xmlObject);
		var realPath = path.startsWith('@') ? path.substringUpTo('@') : path.substringUpTo('.@');
		var attribute = path.substringFrom('@');
		var realPathArray = realPath.split(".");
		var tip = xmlObject;
		for (var i=0; i<realPathArray.length; i++) {
			tip = tip[realPathArray[i]][0];
		}
		var value = null;
		if (attribute === '') {	//No attributes
			value = getValue(tip);
		}
		else {	//There is an attribute at the end
			value = tip['$'][attribute];
		}
		return value;
	}

	return self;
}

module.exports = XmlReader;

