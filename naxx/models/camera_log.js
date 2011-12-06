steal('jquery/model', function(){

/**
 * @class Naxx.Models.CameraLog
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend camera_log services.  
 */
$.Model('Naxx.Models.CameraLog',
/* @Static */
{
	findAll: "/camera_logs.json",
  	findOne : "/camera_logs/{id}.json", 
  	create : "/camera_logs.json",
 	update : "/camera_logs/{id}.json",
  	destroy : "/camera_logs/{id}.json"
},
/* @Prototype */
{});

})