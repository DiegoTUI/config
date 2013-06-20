'use strict';

/**
 * Requirements.
 */
var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');

/**
 * Constants.
 */
process.title = 'atlasProxy';

/**
 * Globals.
 */
var config = JSON.parse(fs.readFileSync("config.json"));
var atlas = require("./atlas.js");
//The app
var app = express();
//Serve root GET calls
app.get("/:service", serve);
//Listen
app.listen(config.port);
console.log("listening on port: " + config.port);

/**
 * HTTP server
 */
function serve (request, response) {
	console.log("Serving for " + request.params.service + " with query: " + JSON.stringify(request.query));
	response.setHeader("Content-Type", "text/plain");
	response.send("Response: " + JSON.stringify(request.query) + ". Url: " + atlas.url);
  /*var url = urlParser.parse(request.url, true);
  info ("url: " + JSON.stringify(url));
  info ("url.pathname: " + url.pathname);
	if (url.pathname == '/')
	{
		serve_home(request, response);
		return;
	}
	// avoid going out of the home dir
	if (url.pathname.contains('..'))
	{
		serve_file(404, 'not_found.html', response);
		return;
	}
	if (url.pathname.startsWith('/src/'))
	{
		serve_file(200, '..' + url.pathname, response);
		return;
	}
	serve_file(200, url.pathname, response);*/
}

/**
 * Serve the home page.
 */
/*function serve_home(request, response)
{
	console.log("serving home");
	serve_file(200, 'index.html', response);
}*/

/*
 * Serve a file.
 */
/*function serve_file(status, file, response)
{
	console.log ("serving file: " + file);
	fs.readFile("html/" + file, function(err, data) {
		if (err)
		{
			info ("error reading file: " + file + " - err: " + err + ". Current dir: " + __dirname);
			response.writeHead(404, {
				'Content-Type': 'text/plain'
			});
			response.end('Page not found');
			return;
		}
		var type = 'text/html';
		if (file.endsWith('.js'))
		{
			type = 'text/javascript';
		}
		if (file.endsWith('.css'))
		{
			type = 'text/css';
		}
		response.writeHead(status, {
			'Content-Length': data.length,
			'Content-Type': type
		});
		response.end(data);
	});
}*/


	


