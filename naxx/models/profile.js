steal('jquery/model', function(){

/**
 * @class Naxx.Models.Profile
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend profile services.  
 */
$.Model('Naxx.Models.Profile',
/* @Static */
{
	findAll: "/profiles.json",
  	findOne : "/profiles/{id}.json", 
  	create : "/profiles.json",
 	update : "/profiles/{id}.json",
  	destroy : "/profiles/{id}.json"
},
/* @Prototype */
{});

})