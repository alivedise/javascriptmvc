steal('jquery/model', function(){

/**
 * @class Naxx.Models.DDNService
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend ddn_service services.  
 */
$.Model('Naxx.Models.DDNService',
/* @Static */
{
	findAll: "/ddn_services.json",
  	findOne : "/ddn_services/{id}.json", 
  	create : "/ddn_services.json",
 	update : "/ddn_services/{id}.json",
  	destroy : "/ddn_services/{id}.json"
},
/* @Prototype */
{});

})