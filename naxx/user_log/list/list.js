steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/user_log.ejs', 
       function($){

/**
 * @class Naxx.UserLog.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists user_logs and lets you destroy them.
 */
$.Controller('Naxx.UserLog.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.UserLog.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.user_log').model().destroy();
		}
	},
	"{Naxx.Models.UserLog} destroyed" : function(UserLog, ev, user_log) {
		user_log.elements(this.element).remove();
	},
	"{Naxx.Models.UserLog} created" : function(UserLog, ev, user_log){
		this.element.append(this.view('init', [user_log]))
	},
	"{Naxx.Models.UserLog} updated" : function(UserLog, ev, user_log){
		user_log.elements(this.element)
		      .html(this.view('user_log', user_log) );
	}
});

});