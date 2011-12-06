steal('jquery/model', function(){

/**
 * @class Naxx.Models.UserLog
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend user_log services.  
 */
$.Model('Naxx.Models.UserLog',
/* @Static */
{
	findAll: "/user_logs.json",
  	findOne : "/user_logs/{id}.json", 
  	create : "/user_logs.json",
 	update : "/user_logs/{id}.json",
  	destroy : "/user_logs/{id}.json"
},
/* @Prototype */
{});

})