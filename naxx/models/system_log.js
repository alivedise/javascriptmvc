steal('jquery/model', function(){

/**
 * @class Naxx.Models.SystemLog
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend system_log services.  
 */
$.Model('Naxx.Models.SystemLog',
/* @Static */
{
	findAll: "/system_logs.json",
  	findOne : "/system_logs/{id}.json", 
  	create : "/system_logs.json",
 	update : "/system_logs/{id}.json",
  	destroy : "/system_logs/{id}.json"
},
/* @Prototype */
{});

})