steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/camera_log.ejs', 
       function($){

/**
 * @class Naxx.CameraLog.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists camera_logs and lets you destroy them.
 */
$.Controller('Naxx.CameraLog.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.CameraLog.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.camera_log').model().destroy();
		}
	},
	"{Naxx.Models.CameraLog} destroyed" : function(CameraLog, ev, camera_log) {
		camera_log.elements(this.element).remove();
	},
	"{Naxx.Models.CameraLog} created" : function(CameraLog, ev, camera_log){
		this.element.append(this.view('init', [camera_log]))
	},
	"{Naxx.Models.CameraLog} updated" : function(CameraLog, ev, camera_log){
		camera_log.elements(this.element)
		      .html(this.view('camera_log', camera_log) );
	}
});

});