var mongoose = require('mongoose');
var async    = require('async');
var helper = require('./helper');

// POST saveEmail
module.exports.saveEmail = function(req, res) {
	console.log('POST saveEmail', req.body);
	if(!req.body.memberId){
		helper.sendJsonResponse(res, NOT_FOUND, {
			"message": "Not found member Id"
		});
		return;
	}

	if(!req.body.leadId){
		helper.sendJsonResponse(res, NOT_FOUND, {
			"message": "Not found lead Id"
		});
		return;
	}

	Member
		.findById(req.body.memberId)
		.exec(function(err, mem){
			if (err) {
	          //console.log(err);
	          helper.sendJsonResponse(res, BAD_REQUEST, err);
	          return;
	        }
	        if (!mem) {
	          //console.log(err);
	          helper.sendJsonResponse(res, NOT_FOUND, {
				"message": "Not found member"
			  });
	          return;
	        }

	        Lead
				.findById(req.body.leadId)
				.exec(function(err, lead){
					if (err) {
			          //console.log(err);
			          helper.sendJsonResponse(res, BAD_REQUEST, err);
			          return;
			        }
			        if (!lead) {
			          //console.log(err);
			          helper.sendJsonResponse(res, NOT_FOUND, {
						"message": "Not found lead"
					  });
			          return;
			        }

			        var compose = new Compose({
			        	createdBy: mem,
			        	lead: lead,
			        	from: req.body.from,
			        	to: req.body.to,
			        	cc: req.body.cc,
			        	bcc: req.body.bcc,
			        	subject: req.body.subject,
			        	content: req.body.content,
			        	attachs: req.body.attachs,
			        	status: req.body.status
					});

			        compose.save(function(err){
						if (err) {
				          //console.log(err);
				          helper.sendJsonResponse(res, BAD_REQUEST, err);
				          return;
				        }

						LeadEvent
								.find({
									compose: compose
								})
								.populate('riaseFrom')
								.populate('riaseTo')
								.populate('compose')
								.sort({createdAt: 'desc'})
								//.sort({createdAt: 'asc'})
								.exec(function(err, docs){

									MemberProfile.populate(docs, {
								     	path: 'riaseFrom.profile'
								     }, function(err, result){
								     	if (err) {
								          //console.log(err);
									        helper.sendJsonResponse(res, BAD_REQUEST, err);
									        return;
									    }
									    helper.sendJsonResponse(res, OK, docs[0]);
								     });

									//helper.sendJsonResponse(res, OK, docs);
									//return leads;
								});
					});
				});
		});
}

// PUT updateEmail
module.exports.updateEmail = function(req, res) {
	console.log('PUT updateEmail', req.body);
	if(!req.params.composeId || req.params.composeId == 'null'){
		helper.sendJsonResponse(res, NOT_FOUND, {
			"message": "Not found compose Id"
		});
		return;
	}
	Compose
		.findById(req.params.composeId)
		.exec(function(err, compose){
			if (err) {
	          //console.log(err);
	          helper.sendJsonResponse(res, BAD_REQUEST, err);
	          return;
	        }
	        if (!compose) {
	          //console.log(err);
	          helper.sendJsonResponse(res, NOT_FOUND, {
				"message": "Not found compose"
			  });
	          return;
	        }

	        compose.to = req.body.to;
	        compose.cc = req.body.cc;
	        compose.bcc = req.body.bcc;
	        compose.subject = req.body.subject;
	        compose.content = req.body.content;
	        compose.attachs = req.body.attachs;

	        compose.save(function(err){
	        	if (err) {
			        helper.sendJsonResponse(res, BAD_REQUEST, err);
			        return;
			    }

	     		helper.sendJsonResponse(res, OK, compose);
	        });
		});
}

// DELETE deleteEmail
module.exports.deleteEmail = function(req, res){
	console.log('DELETE deleteEmail', req.params);
	if (!req.params.composeId) {
	    helper.sendJsonResponse(res, BAD_REQUEST, {
	      "message": "Not found, compose Id"
	    });
	    return;
	}
	Compose
	  .findById(req.params.composeId)
	  .exec	(function(err, compose){
	    if (err) {
	          //console.log(err);
	        helper.sendJsonResponse(res, BAD_REQUEST, err);
	        return;
	     }
	     if(!compose){
	     	helper.sendJsonResponse(res, NOT_FOUND, {
	     		"message": "Not found compose"
	     	});
	        return;
	     }

	     compose.remove(function(err){
	     	if (err) {
	          //console.log(err);
	        	helper.sendJsonResponse(res, BAD_REQUEST, err);
	        	return;
	     	}

	     	helper.sendJsonResponse(res, OK, {
	     		"message": "Delete completed."
	     	});
	     });
	  });
}