steal('jquery/model', function(){

/**
 * @class Naxx.Models.Disk
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend disk services.  
 */
$.Model('Naxx.Models.Disk',
/* @Static */
{
	findAll: "/disks.json",
  	findOne : "/disks/{id}.json", 
  	create : "/disks.json",
 	update : "/disks/{id}.json",
  	destroy : "/disks/{id}.json"
},
/* @Prototype */
{});

})