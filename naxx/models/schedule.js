steal('jquery/model', function(){

/**
 * @class Naxx.Models.Schedule
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend schedule services.  
 */
$.Model('Naxx.Models.Schedule',
/* @Static */
{
	findAll: "/schedules.json",
  	findOne : "/schedules/{id}.json", 
  	create : "/schedules.json",
 	update : "/schedules/{id}.json",
  	destroy : "/schedules/{id}.json"
},
/* @Prototype */
{});

})