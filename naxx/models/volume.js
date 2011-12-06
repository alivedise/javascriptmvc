steal('jquery/model', function(){

/**
 * @class Naxx.Models.Volume
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend volume services.  
 */
$.Model('Naxx.Models.Volume',
/* @Static */
{
	findAll: "/volumes.json",
  	findOne : "/volumes/{id}.json", 
  	create : "/volumes.json",
 	update : "/volumes/{id}.json",
  	destroy : "/volumes/{id}.json"
},
/* @Prototype */
{});

})