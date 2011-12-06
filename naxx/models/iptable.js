steal('jquery/model', function(){

/**
 * @class Naxx.Models.Iptable
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend iptable services.  
 */
$.Model('Naxx.Models.Iptable',
/* @Static */
{
	findAll: "/iptables.json",
  	findOne : "/iptables/{id}.json", 
  	create : "/iptables.json",
 	update : "/iptables/{id}.json",
  	destroy : "/iptables/{id}.json"
},
/* @Prototype */
{});

})