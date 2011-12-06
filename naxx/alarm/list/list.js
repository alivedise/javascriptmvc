steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/alarm.ejs', 
       function($){

/**
 * @class Naxx.Alarm.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists alarms and lets you destroy them.
 */
$.Controller('Naxx.Alarm.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Alarm.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.alarm').model().destroy();
		}
	},
	"{Naxx.Models.Alarm} destroyed" : function(Alarm, ev, alarm) {
		alarm.elements(this.element).remove();
	},
	"{Naxx.Models.Alarm} created" : function(Alarm, ev, alarm){
		this.element.append(this.view('init', [alarm]))
	},
	"{Naxx.Models.Alarm} updated" : function(Alarm, ev, alarm){
		alarm.elements(this.element)
		      .html(this.view('alarm', alarm) );
	}
});

});