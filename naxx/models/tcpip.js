steal('jquery/model', function(){

/**
 * @class Naxx.Models.Tcpip
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend tcpip services.  
 */
$.Model('Naxx.Models.Tcpip',
/* @Static */
{
	findAll: "/tcpips.json",
  	findOne : "/tcpips/{id}.json", 
  	create : "/tcpips.json",
 	update : "/tcpips/{id}.json",
  	destroy : "/tcpips/{id}.json"
},
/* @Prototype */
{});

})