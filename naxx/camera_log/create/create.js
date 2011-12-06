steal( 'jquery/controller',
       'jquery/view/ejs',
	   'jquery/dom/form_params',
	   'jquery/controller/view',
	   'naxx/models' )
	.then('./views/init.ejs', function($){

/**
 * @class Naxx.CameraLog.Create
 * @parent index
 * @inherits jQuery.Controller
 * Creates camera_logs
 */
$.Controller('Naxx.CameraLog.Create',
/** @Prototype */
{
	init : function(){
		this.element.html(this.view());
	},
	submit : function(el, ev){
		ev.preventDefault();
		this.element.find('[type=submit]').val('Creating...')
		new Naxx.Models.CameraLog(el.formParams()).save(this.callback('saved'));
	},
	saved : function(){
		this.element.find('[type=submit]').val('Create');
		this.element[0].reset()
	}
})

});