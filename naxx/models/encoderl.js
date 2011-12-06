steal('jquery/model', function(){

/**
 * @class Naxx.Models.Encoderl
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend encoderl services.  
 */
$.Model('Naxx.Models.Encoderl',
/* @Static */
{
	findAll: "/encoderls.json",
  	findOne : "/encoderls/{id}.json", 
  	create : "/encoderls.json",
 	update : "/encoderls/{id}.json",
  	destroy : "/encoderls/{id}.json"
},
/* @Prototype */
{});

})