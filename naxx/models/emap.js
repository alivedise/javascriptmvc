steal('jquery/model', function(){

/**
 * @class Naxx.Models.Emap
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend emap services.  
 */
$.Model('Naxx.Models.Emap',
/* @Static */
{
	findAll: "/emaps.json",
  	findOne : "/emaps/{id}.json", 
  	create : "/emaps.json",
 	update : "/emaps/{id}.json",
  	destroy : "/emaps/{id}.json"
},
/* @Prototype */
{});

})