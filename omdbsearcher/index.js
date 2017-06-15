var config = require('./config.js');
var request = require('request');
var bodyParser = require('body-parser')
var express = require('express'); //For handling of web requests etc
const http = require('http');
var app = express();
var options = {
	method: 'GET',
	url: 'http://www.omdbapi.com/',
	qs: {
		apikey: config.omdbkey,
		t: 'Gone with the wind'
	},
	headers: {
		accept: 'application/json'
	}
};

var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.post("/", function(req, res) {
	if (req.body.text) {
		console.log("Searching for on OMDB: " + req.body.text)
		options.qs.t = req.body.text;
		request(options, function(error, response, body) {
			if (error) throw new Error(error);
			postToSlack(JSON.parse(body), options.qs.t)
			res.send("OK");
		});

	} else {
		res.send("Got no input");
	}
});

app.listen(port, () => {
	console.log("App listening to port: " + port);
});

function postToSlack(result, searchterm) {
	var slackMessage;
	if (result.Response != "True") {
		console.log(result);
		slackMessage = "Movie with searchterm: " + searchterm + " not found!";
	} else {
		slackMessage = formatResult(result);
	}
	var slackOptions = {
		method: 'POST',
		url: config.slackurl,
		headers: {
			'cache-control': 'no-cache',
			'content-type': 'application/json',
			accept: 'application/json'
		},
		body: slackMessage,
		json: true
	};
	request(slackOptions, function(error, response, body) {
		if (error) throw new Error(error);
		console.log(body);
	});
}

function formatResult(input) {
	
	var output = { 	
		text: "",
		attachments: []
	};
	for (var key in input) {

		switch (key) {
			case "Response":
				break;
			case "Title":
				break;
			case "Ratings":
				break;
			case "Website":
				break;
			case "Poster":
				output.attachments.push({
					image_url: input[key],
		            fallback: input.Title + " poster"
				});
				break;
			default:
				output.text += "*" + key + ":* " + input[key] + "\n";
		}

	}
	console.log(output);
	return output;
}