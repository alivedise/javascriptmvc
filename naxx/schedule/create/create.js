steal( 'jquery/controller',
       'jquery/view/ejs',
	   'jquery/dom/form_params',
	   'jquery/controller/view',
	   'naxx/models' )
	.then('./views/init.ejs', function($){

/**
 * @class Naxx.Schedule.Create
 * @parent index
 * @inherits jQuery.Controller
 * Creates schedules
 */
$.Controller('Naxx.Schedule.Create',
/** @Prototype */
{
	init : function(){
		this.element.html(this.view());
	},
	submit : function(el, ev){
		ev.preventDefault();
		this.element.find('[type=submit]').val('Creating...')
		new Naxx.Models.Schedule(el.formParams()).save(this.callback('saved'));
	},
	saved : function(){
		this.element.find('[type=submit]').val('Create');
		this.element[0].reset()
	}
})

});