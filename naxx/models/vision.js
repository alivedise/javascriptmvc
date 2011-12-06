steal('jquery/model', function(){

/**
 * @class Naxx.Models.Vision
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend vision services.  
 */
$.Model('Naxx.Models.Vision',
/* @Static */
{
	findAll: "/visions.json",
  	findOne : "/visions/{id}.json", 
  	create : "/visions.json",
 	update : "/visions/{id}.json",
  	destroy : "/visions/{id}.json"
},
/* @Prototype */
{});

})