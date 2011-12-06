steal('jquery/model', function(){

/**
 * @class Naxx.Models.AlarmData
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend alarm_data services.  
 */
$.Model('Naxx.Models.AlarmData',
/* @Static */
{
	findAll: "/alarm_datas.json",
  	findOne : "/alarm_datas/{id}.json", 
  	create : "/alarm_datas.json",
 	update : "/alarm_datas/{id}.json",
  	destroy : "/alarm_datas/{id}.json"
},
/* @Prototype */
{});

})