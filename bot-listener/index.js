var sentiment = require('sentiment');
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

var port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.post("/api", function(req, res) {
	if (req.body.user_name == ("slackbot" || "OMDB Voice") { //We do not want the bot to act on its own messages
		res.send("OK");
	} else {
		if (req.body.text) {
			var likedit = sentiment(req.body.text);
			console.log(req.body.user_name + " score: " + likedit.score);

			res.send(JSON.stringify({
				text: req.body.user_name + " score: " + likedit.score
			}));
			//console.log(body);

		} else {
			res.send("Not OK");
		}
	}
});

app.listen(port, () => {
	console.log("App listening to port: " + port);
});