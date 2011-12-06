steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/log.ejs', 
       function($){

/**
 * @class Naxx.Log.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists logs and lets you destroy them.
 */
$.Controller('Naxx.Log.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Log.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.log').model().destroy();
		}
	},
	"{Naxx.Models.Log} destroyed" : function(Log, ev, log) {
		log.elements(this.element).remove();
	},
	"{Naxx.Models.Log} created" : function(Log, ev, log){
		this.element.append(this.view('init', [log]))
	},
	"{Naxx.Models.Log} updated" : function(Log, ev, log){
		log.elements(this.element)
		      .html(this.view('log', log) );
	}
});

});