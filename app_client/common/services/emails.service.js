(function () {
	angular
    	.module('salesHubApp')
    	.service('emails', emails);
    emails.$inject = ['$http', '$window', 'config', 'accounts'];
    function emails ($http, $window, config, accounts) {
    	var saveDraft = function(data, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		var payload = JSON.parse($window.atob(token.split('.')[1]));
    		var memberId = payload._id;
    		$http.post(
    			'/api/emails', 
		        {
					memberId: memberId,
					leadId: data.leadId,
					from: data.from,
					to: data.to,
					cc: data.cc,
					bcc: data.bcc,
					subject: data.subject,
					content: data.content,
					attachs: data.attachs,
			        status: 'Draft'
				},
    			{
    				headers: {
		          		Authorization: 'Bearer '+ token
		        	}
		    	}
		    ).success(function(data){
		    	if(cb){
		        	cb(null, data);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	//accounts.logout();
		    	cb(err, null);
		    });
    	}

    	var updateDraft = function(data, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		var payload = JSON.parse($window.atob(token.split('.')[1]));
    		var memberId = payload._id;
    		$http.put(
    			'/api/emails/' + data.composeId, 
		        {
					memberId: memberId,
					leadId: data.leadId,
					from: data.from,
					to: data.to,
					cc: data.cc,
					bcc: data.bcc,
					subject: data.subject,
					content: data.content,
					attachs: data.attachs,
			        status: 'Draft'
				},
    			{
    				headers: {
		          		Authorization: 'Bearer '+ token
		        	}
		    	}
		    ).success(function(data){
		    	if(cb){
		        	cb(null, data);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	//accounts.logout();
		    	cb(err, null);
		    });
    	}

    	var deleteDraft= function(composeId, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		$http.delete(
    			'/api/emails/' + composeId, 
    			{
    				headers: {
		          		Authorization: 'Bearer '+ token
		        	}
		    	}
		    ).success(function(data){
		    	//console.log(data);
		    	if(cb){
		        	cb(null, data);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	//accounts.logout();
		    	cb(err, null);
		    });
    	}

    	var sendMail = function(composeId, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		$http.post(
    			'/api/emails/' + composeId + '/send', 
    			{},
    			{
    				headers: {
		          		Authorization: 'Bearer '+ token
		        	}
		    	}
		    ).success(function(data){
		    	//console.log(data);
		    	if(cb){
		        	cb(null, data);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	//accounts.logout();
		    	cb(err, null);
		    });
    	}

    	var sendNewMail = function(data, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		var payload = JSON.parse($window.atob(token.split('.')[1]));
    		var memberId = payload._id;
    		$http.post(
    			'/api/emails/send', 
		        {
					memberId: memberId,
					leadId: data.leadId,
					from: data.from,
					to: data.to,
					cc: data.cc,
					bcc: data.bcc,
					subject: data.subject,
					content: data.content,
					attachs: data.attachs,
			        status: 'Draft'
				},
    			{
    				headers: {
		          		Authorization: 'Bearer '+ token
		        	}
		    	}
		    ).success(function(data){
		    	if(cb){
		        	cb(null, data);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	//accounts.logout();
		    	cb(err, null);
		    });
    	}

    	return {
    		saveDraft: saveDraft,
    		updateDraft: updateDraft,
    		deleteDraft: deleteDraft,
    		sendMail: sendMail,
    		sendNewMail: sendNewMail
    	}
    }
})();