steal('jquery/model', function(){

/**
 * @class Naxx.Models.Alarm
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend alarm services.  
 */
$.Model('Naxx.Models.Alarm',
/* @Static */
{
	findAll: "/alarms.json",
  	findOne : "/alarms/{id}.json", 
  	create : "/alarms.json",
 	update : "/alarms/{id}.json",
  	destroy : "/alarms/{id}.json"
},
/* @Prototype */
{});

})