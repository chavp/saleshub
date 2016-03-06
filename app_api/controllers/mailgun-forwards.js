var mongoose = require('mongoose');
var helper = require('./helper');

// POST callback
module.exports.callback = function(req, res){
	console.log('POST callback', req.body);
	
	var mailgunForward = new MailgunForward({
		body: JSON.stringify(req.body),
		params: JSON.stringify(req.params)
	});

	mailgunForward.save(function(err){
		helper.sendJsonResponse(res, OK, 
			{ "message": "Save forward mail completed." }
		);
	});
}

// POST callback
module.exports.messages = function(req, res){
	console.log('POST callback', req.body);
	
	var mailgunForward = new MailgunForward({
		body: "have message"
	});

	mailgunForward.save(function(err){
		helper.sendJsonResponse(res, OK, 
			{ "message": "Save forward mail completed." }
		);
	});
}