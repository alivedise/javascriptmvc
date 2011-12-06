steal('jquery/model', function(){

/**
 * @class Naxx.Models.Recording
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend recording services.  
 */
$.Model('Naxx.Models.Recording',
/* @Static */
{
	findAll: "/recordings.json",
  	findOne : "/recordings/{id}.json", 
  	create : "/recordings.json",
 	update : "/recordings/{id}.json",
  	destroy : "/recordings/{id}.json"
},
/* @Prototype */
{});

})