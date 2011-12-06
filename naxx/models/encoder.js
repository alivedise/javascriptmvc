steal('jquery/model', function(){

/**
 * @class Naxx.Models.Encoder
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend encoder services.  
 */
$.Model('Naxx.Models.Encoder',
/* @Static */
{
	findAll: "/encoders.json",
  	findOne : "/encoders/{id}.json", 
  	create : "/encoders.json",
 	update : "/encoders/{id}.json",
  	destroy : "/encoders/{id}.json"
},
/* @Prototype */
{});

})