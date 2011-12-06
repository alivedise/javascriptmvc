steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/schedule.ejs', 
       function($){

/**
 * @class Naxx.Schedule.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists schedules and lets you destroy them.
 */
$.Controller('Naxx.Schedule.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Schedule.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.schedule').model().destroy();
		}
	},
	"{Naxx.Models.Schedule} destroyed" : function(Schedule, ev, schedule) {
		schedule.elements(this.element).remove();
	},
	"{Naxx.Models.Schedule} created" : function(Schedule, ev, schedule){
		this.element.append(this.view('init', [schedule]))
	},
	"{Naxx.Models.Schedule} updated" : function(Schedule, ev, schedule){
		schedule.elements(this.element)
		      .html(this.view('schedule', schedule) );
	}
});

});