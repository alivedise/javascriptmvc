steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/system_log.ejs', 
       function($){

/**
 * @class Naxx.SystemLog.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists system_logs and lets you destroy them.
 */
$.Controller('Naxx.SystemLog.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.SystemLog.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.system_log').model().destroy();
		}
	},
	"{Naxx.Models.SystemLog} destroyed" : function(SystemLog, ev, system_log) {
		system_log.elements(this.element).remove();
	},
	"{Naxx.Models.SystemLog} created" : function(SystemLog, ev, system_log){
		this.element.append(this.view('init', [system_log]))
	},
	"{Naxx.Models.SystemLog} updated" : function(SystemLog, ev, system_log){
		system_log.elements(this.element)
		      .html(this.view('system_log', system_log) );
	}
});

});