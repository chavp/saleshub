(function () {
	angular
	  .module('salesHubApp')
      .controller('leadsCtrl', leadsCtrl);

    leadsCtrl.$inject = [
        '$window', '$rootScope', '$location', '$log', 'config', 'blockUI', 
        'accounts', 'leads', 'emails'];
    function leadsCtrl($window, $rootScope, $location, $log, config, blockUI, accounts, leads, emails) {
    	var vm = this;

        $rootScope.$on('REFRESH_LEAD', function(){
            //console.log(params);
            vm.refreshLeads();

            
        });

        vm.currentPath = $location.path();
        
        vm.leadsQuery = "All";
    	vm.title = "All leads";

        vm.totalResults = 0;
        
        vm.formError = "";
        vm.leadResults = [];

        vm.itemsByPage = 10;
        vm.phonePrefix = "+66";

        //var leadResultsBlock = blockUI.instances.get('lead-results-block');
        vm.refreshLeads = function(){
            //vm.isLoading = true;

            blockUI.start();
            leads.getAllLeads(function(err, data){
                //vm.isLoading = false;
                blockUI.stop();
                if(!err){
                    $log.debug(data);
                    if(!data) {
                        accounts.logout();
                        $window.location = config.DEFAULT_PATH;
                    }
                    var results = data.map(function(d){
                        if(d.contacts.length > 0){
                            var conChannels = d.contacts[0].contactChannels;
                            for (var i = 0; i < conChannels.length; i++) {
                                var name = conChannels[i].name;
                                if(validateEmail(name)) {
                                    d.email = name;
                                    break;
                                }
                            };
                            for (var i = 0; i < conChannels.length; i++) {
                                var name = conChannels[i].name;
                                if(validatePhone(name)) {
                                    d.phone = vm.phonePrefix + " " + name;
                                    break;
                                }
                            };
                        }
                        return {
                            _id: d._id,
                            company : d.companyName || config.EMPATY_DISPLAY,
                            contacts : d.contacts,
                            phone: d.phone || '',
                            email: d.email || '',
                            status: ""
                        }
                    });
                    
                    vm.leadResults = results;
                }
            });
        }

        vm.refreshLeads();
    }
    
})();