steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/alarm_data.ejs', 
       function($){

/**
 * @class Naxx.AlarmData.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists alarm_datas and lets you destroy them.
 */
$.Controller('Naxx.AlarmData.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.AlarmData.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.alarm_data').model().destroy();
		}
	},
	"{Naxx.Models.AlarmData} destroyed" : function(AlarmData, ev, alarm_data) {
		alarm_data.elements(this.element).remove();
	},
	"{Naxx.Models.AlarmData} created" : function(AlarmData, ev, alarm_data){
		this.element.append(this.view('init', [alarm_data]))
	},
	"{Naxx.Models.AlarmData} updated" : function(AlarmData, ev, alarm_data){
		alarm_data.elements(this.element)
		      .html(this.view('alarm_data', alarm_data) );
	}
});

});