steal('jquery/model', function(){

/**
 * @class Naxx.Models.Protocol
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend protocol services.  
 */
$.Model('Naxx.Models.Protocol',
/* @Static */
{
	findAll: "/protocols.json",
  	findOne : "/protocols/{id}.json", 
  	create : "/protocols.json",
 	update : "/protocols/{id}.json",
  	destroy : "/protocols/{id}.json"
},
/* @Prototype */
{});

})