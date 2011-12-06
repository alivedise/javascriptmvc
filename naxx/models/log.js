steal('jquery/model', function(){

/**
 * @class Naxx.Models.Log
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend log services.  
 */
$.Model('Naxx.Models.Log',
/* @Static */
{
	findAll: "/logs.json",
  	findOne : "/logs/{id}.json", 
  	create : "/logs.json",
 	update : "/logs/{id}.json",
  	destroy : "/logs/{id}.json"
},
/* @Prototype */
{});

})