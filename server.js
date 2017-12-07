var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var rp = require('request-promise');
var path = require('path');

var PORT = process.env.PORT || '3000';
var options = {
	uri: 'https://us17.api.mailchimp.com/3.0/lists',
	method: 'get',
	headers: {
		'Authorization': "Basic " + new Buffer( "anystring:ed245a7384122550cdf5fa15cc64790e-us17").toString("base64")
	},
	json: true
};
var mandrillOps = {
	"key": "ed245a7384122550cdf5fa15cc64790e-us17",
	"message": {
		"from_email": "vikas@gmail.com",
		"from_name": "vikas",
		"to": [
			{
				"email": "vikasraj789@gmail.com"
			}
		],
		"subject": "example subject",
		"html": "<p>Example HTML content</p>",
		"headers": {
            "Reply-To": "message.reply@example.com"
        },
        "important": true,
	}
};

app.use(express.static(path.join(__dirname, 'dist')));

//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));

//To parse json data
app.use(bodyParser.json());

app.get(/^(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(PORT, () => {
  console.log('We are live on ' + PORT);
});

app.post('/emails', function(req, res) {
	var data = req.body;
	console.log(data);
	rp(options)
		.then(function(res){
			console.log(res);
		})
		.catch(function(err){
			console.log(err);
		})
});